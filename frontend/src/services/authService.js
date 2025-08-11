/**
 * BLONG Authentication Service
 * Professional authentication service with robust error handling and loading states
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleTokenExpiration } from './navigationService';

// Storage keys for authentication
const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: '@blong_access_token',
  REFRESH_TOKEN: '@blong_refresh_token',
  USER_DATA: '@blong_user_data',
};

// Token management functions
const saveTokens = async (accessToken, refreshToken, userData) => {
  try {
    await Promise.all([
      AsyncStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      AsyncStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken || ''),
      AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
    ]);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

const getStoredTokens = async () => {
  try {
    const [accessToken, refreshToken, userData] = await Promise.all([
      AsyncStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA),
    ]);

    return {
      accessToken,
      refreshToken,
      userData: userData ? JSON.parse(userData) : null,
    };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return { accessToken: null, refreshToken: null, userData: null };
  }
};

const clearStoredTokens = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA),
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

import ENV from '../config/env';

// API Configuration - Use centralized environment configuration
const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TIMEOUT: ENV.API_TIMEOUT,
  RETRY_ATTEMPTS: ENV.REQUEST_RETRY_ATTEMPTS,
  RETRY_DELAY: ENV.REQUEST_RETRY_DELAY,
};

// Error types for better error handling
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Enhanced error class with detailed information
 */
class AuthError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, statusCode = null, details = null) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Network request with timeout and retry logic
 */
const makeRequest = async (url, options = {}, retryCount = 0) => {

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Error response data:', errorData);
      throw new AuthError(
        errorData.message || `HTTP ${response.status}`,
        response.status >= 400 && response.status < 500 ? ERROR_TYPES.VALIDATION : ERROR_TYPES.SERVER,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log('❌ Request error:', error);

    if (error.name === 'AbortError') {
      throw new AuthError('Request timeout', ERROR_TYPES.TIMEOUT);
    }

    if (error instanceof AuthError) {
      throw error;
    }

    // Network error - retry logic
    if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      console.log(`🔄 Retrying request (${retryCount + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1)));
      return makeRequest(url, options, retryCount + 1);
    }

    throw new AuthError(
      'Network connection failed',
      ERROR_TYPES.NETWORK,
      null,
      { originalError: error.message }
    );
  }
};

/**
 * Mock API functions for development
 */
const mockAPI = {
  signIn: async (credentials) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (credentials.email === 'test@blong.app' && credentials.password === 'password123') {
      return {
        success: true,
        data: {
          user: {
            id: '1',
            email: credentials.email,
            firstName: 'John',
            lastName: 'Doe',
            avatar: null,
            verified: true,
          },
          tokens: {
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            expiresIn: 3600,
          },
        },
      };
    } else {
      throw new AuthError(
        'Invalid email or password',
        ERROR_TYPES.AUTHENTICATION,
        401,
        { field: 'credentials' }
      );
    }
  },

  register: async (userData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock email validation
    if (userData.email === 'existing@blong.app') {
      throw new AuthError(
        'An account with this email already exists',
        ERROR_TYPES.VALIDATION,
        422,
        { field: 'email' }
      );
    }
    
    return {
      success: true,
      data: {
        user: {
          id: Date.now().toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: null,
          verified: false,
        },
        tokens: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          expiresIn: 7200, // 2 hours
        },
      },
    };
  },
};

/**
 * Real API functions (for production)
 */
const realAPI = {
  signIn: async (credentials) => {
    return makeRequest(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return makeRequest(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Choose API based on environment and platform - use real API by default
const api = ENV.ENABLE_MOCK_DATA ? mockAPI : realAPI;

/**
 * Token management
 */
export const tokenManager = {
  async saveTokens(tokens) {
    try {
      console.log(`🔐 AuthService saveTokens - Saving token with key: ${AUTH_STORAGE_KEYS.ACCESS_TOKEN}`);
      console.log(`🔐 Token preview: ${tokens.accessToken ? tokens.accessToken.substring(0, 20) + '...' : 'NO TOKEN'}`);

      const tokenPairs = [
        [AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken],
      ];

      // Only save refresh token if it exists
      if (tokens.refreshToken) {
        tokenPairs.push([AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken]);
      }

      // Save token timestamp for expiration checking
      const tokenInfo = {
        timestamp: Date.now(),
        expiresIn: tokens.expiresIn || 7200, // Default 2 hours
      };
      tokenPairs.push(['@blong_token_info', JSON.stringify(tokenInfo)]);

      await AsyncStorage.multiSet(tokenPairs);
      console.log(`✅ AuthService saveTokens - Tokens saved successfully`);

      // Verify the token was saved
      const savedToken = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      console.log(`🔍 AuthService saveTokens - Verification: Token saved: ${savedToken ? 'YES' : 'NO'}`);
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  },

  async getAccessToken() {
    try {
      return await AsyncStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  },

  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  },

  async getTokenInfo() {
    try {
      const tokenInfo = await AsyncStorage.getItem('@blong_token_info');
      return tokenInfo ? JSON.parse(tokenInfo) : null;
    } catch (error) {
      console.error('Failed to get token info:', error);
      return null;
    }
  },

  async clearTokens() {
    try {
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEYS.ACCESS_TOKEN,
        AUTH_STORAGE_KEYS.REFRESH_TOKEN,
        AUTH_STORAGE_KEYS.USER_DATA,
        '@blong_token_info',
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  /**
   * Check if the current access token is expired
   */
  async isTokenExpired() {
    try {
      const tokenInfo = await this.getTokenInfo();
      if (!tokenInfo) {
        return true; // No token info means expired
      }

      const now = Date.now();
      const tokenAge = (now - tokenInfo.timestamp) / 1000; // Age in seconds
      const isExpired = tokenAge >= tokenInfo.expiresIn;
      
      if (isExpired) {
        console.log('🕐 Token expired - age:', Math.round(tokenAge), 'seconds, expires in:', tokenInfo.expiresIn);
      }
      
      return isExpired;
    } catch (error) {
      console.error('Failed to check token expiration:', error);
      return true; // Assume expired on error
    }
  },

  /**
   * Validate token and handle expiration
   */
  async validateToken() {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        console.log('🔐 No access token found');
        return false;
      }

      const isExpired = await this.isTokenExpired();
      if (isExpired) {
        console.log('🔐 Access token is expired');
        
        // Try to refresh token
        const refreshSuccess = await this.refreshAccessToken();
        if (!refreshSuccess) {
          // Refresh failed, handle token expiration
          await this.handleTokenExpiration();
          return false;
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error('❌ Error validating token:', error);
      return false;
    }
  },

  /**
   * Attempt to refresh the access token
   */
  async refreshAccessToken() {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        console.log('🔐 No refresh token available');
        return false;
      }

      console.log('🔄 Attempting to refresh access token...');
      
      // Make refresh token request
      const response = await makeRequest(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (response.accessToken) {
        console.log('✅ Successfully refreshed access token');
        
        // Save the new tokens
        const tokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || refreshToken,
          expiresIn: response.expiresIn || 7200, // Default to 2 hours if not provided
        };
        
        await this.saveTokens(tokens);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      return false;
    }
  },

  /**
   * Handle token expiration
   */
  async handleTokenExpiration() {
    try {
      console.log('🔐 Handling token expiration...');
      
      // Clear all authentication data
      await this.clearTokens();
      await userManager.clearUser();
      
      // Use navigation service to handle the redirect
      await handleTokenExpiration();
      
      console.log('✅ Token expiration handled successfully');
    } catch (error) {
      console.error('❌ Error handling token expiration:', error);
    }
  },
};

/**
 * User data management
 */
export const userManager = {
  async saveUser(userData) {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  async getUser() {
    try {
      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },

  async clearUser() {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  },
};

/**
 * Main authentication service
 */
export const authService = {
  /**
   * Sign in user
   */
  async signIn(credentials) {
    try {
      const response = await api.signIn(credentials);

      // Handle backend response format
      if (response.accessToken && response.user) {
        const tokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || null,
          expiresIn: response.expiresIn || 7200, // Default to 2 hours if not provided
        };

        const user = response.user;

        // Save tokens and user data
        await tokenManager.saveTokens(tokens);
        await userManager.saveUser(user);

        return {
          success: true,
          user: user,
          tokens: tokens,
        };
      }

      throw new AuthError('Invalid response from server', ERROR_TYPES.SERVER);
    } catch (error) {
      throw error instanceof AuthError ? error : new AuthError(error.message);
    }
  },

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // Transform frontend data to backend format - remove phone if null to match test expectations
      const backendData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth || '1990-01-01', // Default date if not provided
        gender: userData.gender || 'MALE', // Default gender if not provided
      };

      // Only include phone if it's provided and not null/empty
      if (userData.phone && userData.phone.trim()) {
        backendData.phone = userData.phone;
      }

      const response = await api.register(backendData);

      // Handle backend response format
      if (response.accessToken && response.user) {
        const tokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || null,
          expiresIn: response.expiresIn || 7200, // Default to 2 hours if not provided
        };

        const user = response.user;

        // Save tokens and user data
        await tokenManager.saveTokens(tokens);
        await userManager.saveUser(user);

        return {
          success: true,
          user: user,
          tokens: tokens,
        };
      }

      throw new AuthError('Invalid response from server', ERROR_TYPES.SERVER);
    } catch (error) {
      throw error instanceof AuthError ? error : new AuthError(error.message);
    }
  },

  /**
   * Sign out user
   */
  async signOut() {
    try {
      await tokenManager.clearTokens();
      await userManager.clearUser();
      return { success: true };
    } catch (error) {
      throw new AuthError('Failed to sign out', ERROR_TYPES.UNKNOWN);
    }
  },

  /**
   * Force logout due to token expiration
   */
  async forceLogout(reason = 'Session expired') {
    try {
      console.log('🔐 Force logout triggered:', reason);
      
      // Clear all authentication data
      await tokenManager.clearTokens();
      await userManager.clearUser();
      
      // Handle the navigation redirect
      await handleTokenExpiration();
      
      return { success: true, reason };
    } catch (error) {
      console.error('❌ Error during force logout:', error);
      throw new AuthError('Failed to force logout', ERROR_TYPES.UNKNOWN);
    }
  },

  /**
   * Validate current authentication status
   */
  async validateAuthentication() {
    try {
      const isValid = await tokenManager.validateToken();
      if (!isValid) {
        console.log('🔐 Authentication validation failed');
        return { isValid: false, user: null };
      }

      const user = await userManager.getUser();
      return { isValid: true, user };
    } catch (error) {
      console.error('❌ Error validating authentication:', error);
      return { isValid: false, user: null };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const user = await userManager.getUser();
      const token = await tokenManager.getAccessToken();
      
      return {
        user,
        isAuthenticated: !!(user && token),
      };
    } catch (error) {
      return {
        user: null,
        isAuthenticated: false,
      };
    }
  },
};

export default authService;
