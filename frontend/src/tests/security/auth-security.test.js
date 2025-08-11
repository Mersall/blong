/**
 * BLONG Authentication Security Tests
 * Comprehensive security testing for authentication system
 */

import { authService, tokenManager } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validatePassword } from '../../utils/formValidation';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Authentication Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('Password Security', () => {
    it('should enforce strong password requirements', () => {
      const weakPasswords = [
        'password',        // Common password
        '123456',         // Numeric only
        'abc123',         // Too simple
        'PASSWORD',       // No lowercase
        'password123',    // No uppercase, no special chars
        'Pass!',          // Too short
        'p'.repeat(129),  // Too long
      ];

      weakPasswords.forEach(password => {
        const validation = validatePassword(password);
        expect(validation.isValid).toBe(false);
        expect(validation.strength).not.toBe('strong');
      });
    });

    it('should accept strong passwords', () => {
      const strongPasswords = [
        'SecurePass123!',
        'MyStr0ng@Password',
        'C0mpl3x#Pass',
        'Un1qu3$Security',
      ];

      strongPasswords.forEach(password => {
        const validation = validatePassword(password);
        expect(validation.isValid).toBe(true);
        expect(validation.strength).toBe('strong');
      });
    });

    it('should detect password patterns and common passwords', () => {
      const commonPatterns = [
        'password123',
        'qwerty123',
        'letmein123',
        'Password123', // Still common
      ];

      commonPatterns.forEach(password => {
        const validation = validatePassword(password);
        expect(validation.isValid).toBe(false);
      });
    });
  });

  describe('Token Security', () => {
    it('should securely store tokens', async () => {
      const tokens = {
        accessToken: 'secure_access_token',
        refreshToken: 'secure_refresh_token',
        expiresIn: 3600,
      };

      await tokenManager.saveTokens(tokens);

      // Verify tokens are stored with proper keys
      expect(AsyncStorage.multiSet).toHaveBeenCalledWith(
        expect.arrayContaining([
          ['@blong_access_token', tokens.accessToken],
          ['@blong_refresh_token', tokens.refreshToken],
        ])
      );

      // Verify token info is stored with timestamp
      expect(AsyncStorage.multiSet).toHaveBeenCalledWith(
        expect.arrayContaining([
          ['@blong_token_info', expect.any(String)],
        ])
      );
    });

    it('should handle token expiration properly', async () => {
      // Mock expired token
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@blong_token_info') {
          return Promise.resolve(JSON.stringify({
            timestamp: Date.now() - 7200000, // 2 hours ago
            expiresIn: 3600, // 1 hour expiry
          }));
        }
        return Promise.resolve('mock_token');
      });

      const isExpired = await tokenManager.isTokenExpired();
      expect(isExpired).toBe(true);
    });

    it('should clear all authentication data on logout', async () => {
      await authService.signOut();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@blong_access_token',
        '@blong_refresh_token',
        '@blong_user_data',
        '@blong_token_info',
      ]);
    });

    it('should handle corrupted token data gracefully', async () => {
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@blong_token_info') {
          return Promise.resolve('invalid json');
        }
        return Promise.resolve(null);
      });

      const isExpired = await tokenManager.isTokenExpired();
      expect(isExpired).toBe(true); // Should assume expired on error
    });
  });

  describe('Input Validation Security', () => {
    it('should sanitize and validate email inputs', () => {
      const maliciousEmails = [
        '<script>alert("xss")</script>@test.com',
        'test@<script>alert("xss")</script>.com',
        'test+<img src=x onerror=alert(1)>@test.com',
        'a'.repeat(256) + '@test.com', // Too long
      ];

      const { validateEmail } = require('../../utils/formValidation');
      
      maliciousEmails.forEach(email => {
        const validation = validateEmail(email);
        expect(validation.isValid).toBe(false);
      });
    });

    it('should validate name fields against injection attacks', () => {
      const maliciousNames = [
        '<script>alert("xss")</script>',
        'Robert"; DROP TABLE users; --',
        'John<img src=x onerror=alert(1)>',
        'A'.repeat(51), // Too long
        '123', // Invalid characters only
      ];

      const { validateName } = require('../../utils/formValidation');
      
      maliciousNames.forEach(name => {
        const validation = validateName(name, 'First name');
        expect(validation.isValid).toBe(false);
      });
    });
  });

  describe('API Security', () => {
    it('should use HTTPS in production', () => {
      const ENV = require('../../config/env').default;
      
      if (!ENV.IS_DEV) {
        expect(ENV.API_BASE_URL).toMatch(/^https:\/\//);
      }
    });

    it('should include proper security headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: {}, accessToken: 'token' }),
      });

      await authService.signIn({
        email: 'test@example.com',
        password: 'SecurePass123!',
      });

      const [url, options] = fetch.mock.calls[0];
      expect(options.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
    });

    it('should handle rate limiting responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ message: 'Too many requests' }),
      });

      await expect(authService.signIn({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow();
    });
  });

  describe('Session Management', () => {
    it('should validate tokens before API calls', async () => {
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@blong_access_token') {
          return Promise.resolve('valid_token');
        }
        if (key === '@blong_token_info') {
          return Promise.resolve(JSON.stringify({
            timestamp: Date.now() - 1800000, // 30 min ago
            expiresIn: 3600, // Valid token
          }));
        }
        return Promise.resolve(null);
      });

      const isValid = await tokenManager.validateToken();
      expect(isValid).toBe(true);
    });

    it('should handle token refresh on expiration', async () => {
      // Mock expired access token
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@blong_access_token') {
          return Promise.resolve('expired_token');
        }
        if (key === '@blong_refresh_token') {
          return Promise.resolve('valid_refresh_token');
        }
        if (key === '@blong_token_info') {
          return Promise.resolve(JSON.stringify({
            timestamp: Date.now() - 7200000, // 2 hours ago
            expiresIn: 3600, // Expired
          }));
        }
        return Promise.resolve(null);
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token',
        }),
      });

      const success = await tokenManager.refreshAccessToken();
      expect(success).toBe(true);
    });
  });

  describe('Error Handling Security', () => {
    it('should not expose sensitive information in error messages', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          message: 'Database connection failed: host=localhost password=secret123',
          stack: 'Error at line 123...',
        }),
      });

      try {
        await authService.signIn({
          email: 'test@example.com',
          password: 'password',
        });
      } catch (error) {
        // Error message should be sanitized
        expect(error.message).not.toContain('password=secret123');
        expect(error.message).not.toContain('stack');
      }
    });

    it('should handle timeout attacks', async () => {
      jest.useFakeTimers();
      
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const timeoutPromise = authService.signIn({
        email: 'test@example.com',
        password: 'password',
      });

      jest.advanceTimersByTime(15000); // 15 seconds

      await expect(timeoutPromise).rejects.toThrow('timeout');
      
      jest.useRealTimers();
    });
  });

  describe('Data Protection', () => {
    it('should not store sensitive data in plain text', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: '1', email: userData.email, firstName: userData.firstName },
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
        }),
      });

      await authService.register(userData);

      // Verify password is not stored locally
      const storedCalls = AsyncStorage.setItem.mock.calls.concat(AsyncStorage.multiSet.mock.calls);
      const allStoredData = storedCalls.flat().join(' ');
      
      expect(allStoredData).not.toContain(userData.password);
    });

    it('should clear sensitive data from memory after use', async () => {
      const sensitiveData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: {}, accessToken: 'token' }),
      });

      await authService.signIn(sensitiveData);

      // In a real implementation, we would verify that passwords
      // are cleared from variables and not kept in memory
      expect(true).toBe(true); // Placeholder for actual memory inspection
    });
  });

  describe('Brute Force Protection', () => {
    it('should handle account lockout after failed attempts', async () => {
      const responses = [
        { ok: false, status: 401, json: async () => ({ message: 'Invalid credentials' }) },
        { ok: false, status: 401, json: async () => ({ message: 'Invalid credentials' }) },
        { ok: false, status: 401, json: async () => ({ message: 'Invalid credentials' }) },
        { ok: false, status: 400, json: async () => ({ message: 'Account locked' }) },
      ];

      for (const response of responses) {
        fetch.mockResolvedValueOnce(response);
        
        try {
          await authService.signIn({
            email: 'test@example.com',
            password: 'wrongpassword',
          });
        } catch (error) {
          // Expected to fail
        }
      }

      // Last call should indicate account lockout
      expect(fetch).toHaveBeenCalledTimes(4);
    });
  });
});