import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  clear: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('AuthService', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockTokens = {
    accessToken: 'access_token_123',
    refreshToken: 'refresh_token_123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('signIn', () => {
    it('should signIn successfully with valid credentials', async () => {
      const mockResponse = {
        user: mockUser,
        ...mockTokens,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.signIn(loginData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(loginData),
        })
      );

      expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
        ['@blong_access_token', mockTokens.accessToken],
        ['@blong_refresh_token', mockTokens.refreshToken],
      ]);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@blong_user_data',
        JSON.stringify(mockUser)
      );

      expect(result).toEqual({
        success: true,
        user: mockUser,
        tokens: mockTokens,
      });
    });

    it('should throw error for invalid credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.signIn(loginData)).rejects.toThrow(
        'Invalid credentials'
      );

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.signIn(loginData)).rejects.toThrow(
        'Network connection failed'
      );
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const mockResponse = {
        user: mockUser,
        ...mockTokens,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      const result = await authService.register(registerData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(registerData),
        })
      );

      expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
        ['@blong_access_token', mockTokens.accessToken],
        ['@blong_refresh_token', mockTokens.refreshToken],
      ]);

      expect(result).toEqual({
        success: true,
        user: mockUser,
        tokens: mockTokens,
      });
    });

    it('should throw error for duplicate email', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: 'User already exists' }),
      });

      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      await expect(authService.register(registerData)).rejects.toThrow(
        'User already exists'
      );
    });
  });

  describe('signOut', () => {
    it('should signOut successfully', async () => {
      const result = await authService.signOut();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@blong_access_token',
        '@blong_refresh_token',
        '@blong_user_data',
      ]);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(mockUser)) // user data
        .mockResolvedValueOnce('access_token_123'); // token

      const result = await authService.getCurrentUser();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@blong_user_data');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@blong_access_token');
      expect(result).toEqual({
        user: mockUser,
        isAuthenticated: true,
      });
    });

    it('should return null if no user in storage', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce(null) // user data
        .mockResolvedValueOnce(null); // token

      const result = await authService.getCurrentUser();

      expect(result).toEqual({
        user: null,
        isAuthenticated: false,
      });
    });

    it('should handle corrupted user data', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('invalid json') // user data
        .mockResolvedValueOnce('access_token_123'); // token

      const result = await authService.getCurrentUser();

      expect(result).toEqual({
        user: null,
        isAuthenticated: false,
      });
    });
  });
});