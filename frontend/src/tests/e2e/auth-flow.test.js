/**
 * BLONG Comprehensive Authentication End-to-End Tests
 * Testing complete authentication flows with security considerations
 */

import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateAuthForm, validatePassword } from '../../utils/formValidation';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  clear: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Authentication End-to-End Flow', () => {
  const validUserData = {
    email: 'test@blong.app',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
  };

  const mockApiResponse = {
    user: {
      id: '1',
      email: validUserData.email,
      firstName: validUserData.firstName,
      lastName: validUserData.lastName,
      isVerified: false,
    },
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('Registration Flow', () => {
    it('should complete full registration flow with valid data', async () => {
      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Test form validation
      const validation = validateAuthForm(validUserData, 'register');
      expect(validation.isValid).toBe(true);

      // Test password strength
      const passwordValidation = validatePassword(validUserData.password);
      expect(passwordValidation.strength).toBe('strong');

      // Test registration API call
      const result = await authService.register(validUserData);

      // Verify API call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            email: validUserData.email,
            password: validUserData.password,
            firstName: validUserData.firstName,
            lastName: validUserData.lastName,
            dateOfBirth: validUserData.dateOfBirth,
            gender: validUserData.gender,
          }),
        })
      );

      // Verify tokens are stored
      expect(AsyncStorage.multiSet).toHaveBeenCalled();

      // Verify result
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockApiResponse.user);
      expect(result.tokens.accessToken).toBe(mockApiResponse.accessToken);
    });

    it('should reject registration with weak password', async () => {
      const weakPasswordData = {
        ...validUserData,
        password: '123', // Weak password
      };

      const validation = validateAuthForm(weakPasswordData, 'register');
      expect(validation.isValid).toBe(false);
      expect(validation.errors.password).toContain('Password needs:');
    });

    it('should reject registration with invalid email', async () => {
      const invalidEmailData = {
        ...validUserData,
        email: 'invalid-email',
      };

      const validation = validateAuthForm(invalidEmailData, 'register');
      expect(validation.isValid).toBe(false);
      expect(validation.errors.email).toContain('valid email address');
    });

    it('should reject registration with missing required fields', async () => {
      const incompleteData = {
        email: validUserData.email,
        password: validUserData.password,
        // Missing firstName, lastName
      };

      const validation = validateAuthForm(incompleteData, 'register');
      expect(validation.isValid).toBe(false);
      expect(validation.errors.firstName).toBeDefined();
      expect(validation.errors.lastName).toBeDefined();
    });

    it('should handle duplicate email error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: 'A user with this email address already exists' }),
      });

      await expect(authService.register(validUserData)).rejects.toThrow(
        'A user with this email address already exists'
      );
    });
  });

  describe('Login Flow', () => {
    const loginData = {
      email: validUserData.email,
      password: validUserData.password,
    };

    it('should complete full login flow with valid credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const validation = validateAuthForm(loginData, 'signin');
      expect(validation.isValid).toBe(true);

      const result = await authService.signIn(loginData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(loginData),
        })
      );

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockApiResponse.user);
    });

    it('should handle invalid credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid email or password' }),
      });

      await expect(authService.signIn(loginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should handle network errors with retry logic', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(authService.signIn(loginData)).rejects.toThrow(
        'Network connection failed'
      );
    });
  });

  describe('Token Management', () => {
    it('should validate token expiration correctly', async () => {
      // Mock expired token info
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@blong_token_info') {
          return Promise.resolve(JSON.stringify({
            timestamp: Date.now() - 7200000, // 2 hours ago
            expiresIn: 3600, // 1 hour
          }));
        }
        return Promise.resolve(null);
      });

      const { tokenManager } = require('../../services/authService');
      const isExpired = await tokenManager.isTokenExpired();
      expect(isExpired).toBe(true);
    });

    it('should refresh tokens when expired', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('old_refresh_token') // refresh token
        .mockResolvedValueOnce(JSON.stringify({ timestamp: Date.now() - 7200000, expiresIn: 3600 })); // expired token info

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token',
          expiresIn: 3600,
        }),
      });

      const { tokenManager } = require('../../services/authService');
      const success = await tokenManager.refreshAccessToken();

      expect(success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken: 'old_refresh_token' }),
        })
      );
    });
  });

  describe('Security Tests', () => {
    it('should clear tokens on logout', async () => {
      await authService.signOut();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@blong_access_token',
        '@blong_refresh_token',
        '@blong_user_data',
        '@blong_token_info',
      ]);
    });

    it('should validate password strength requirements', () => {
      const testCases = [
        { password: 'weak', expectedStrength: 'weak' },
        { password: 'StrongPass123!', expectedStrength: 'strong' },
        { password: 'GoodPass123', expectedStrength: 'medium' },
      ];

      testCases.forEach(({ password, expectedStrength }) => {
        const validation = validatePassword(password);
        expect(validation.strength).toBe(expectedStrength);
      });
    });

    it('should handle account lockout scenarios', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Account locked due to 5 failed login attempts. Try again in 15 minutes.',
        }),
      });

      await expect(authService.signIn({
        email: 'locked@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('Account locked');
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(authService.signIn({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toHrow();
    });

    it('should handle malformed responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ /* malformed response missing required fields */ }),
      });

      await expect(authService.signIn({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow('Invalid response from server');
    });
  });

  describe('Accessibility', () => {
    it('should provide proper error messages for screen readers', () => {
      const invalidData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      };

      const validation = validateAuthForm(invalidData, 'register');
      expect(validation.isValid).toBe(false);
      
      // Check that error messages are descriptive
      expect(validation.errors.email).toMatch(/email/i);
      expect(validation.errors.password).toMatch(/password/i);
      expect(validation.errors.firstName).toMatch(/first name/i);
      expect(validation.errors.lastName).toMatch(/last name/i);
    });
  });
});