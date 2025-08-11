/**
 * BLONG API Service Layer
 * Centralized API management with React Query integration
 */

console.log('🚨 [api.js] MODULE LOADING - api.js is being imported!');

import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createRetryConfig } from '../utils/errorHandling';
import { API_CONFIG as CONFIG_API, API_ENDPOINTS, REQUEST_CONFIG } from '../config/api';
import { errorHandler, handleNetworkError, handleAuthError } from '../utils/errorHandler';

// Local API Configuration (fallback)
const LOCAL_API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3000/api'
    : 'https://api.blong.app',
  TIMEOUT: 10000,
  RETRY_CONFIG: createRetryConfig(3, 1000),
};

// Use imported config or fallback to local
const API_CONFIG = CONFIG_API || LOCAL_API_CONFIG;

// Storage keys - MUST match apiService.js
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@blong_access_token',
  REFRESH_TOKEN: '@blong_refresh_token',
  USER_DATA: '@blong_user_data',
};

/**
 * HTTP Client with authentication and error handling
 */
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.pendingRequests = new Map(); // For request deduplication
    this.retryAttempts = new Map(); // Track retry attempts
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second base delay
  }

  async getAuthHeaders() {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    console.log(`🔑 [api.js] Getting auth headers - Storage key: ${STORAGE_KEYS.ACCESS_TOKEN}`);
    console.log(`🔑 [api.js] Token found: ${token ? 'YES' : 'NO'}`);
    if (token) {
      console.log(`🔑 [api.js] Token preview: ${token.substring(0, 20)}...`);
      console.log(`🔑 [api.js] Token length: ${token.length}`);
      const headers = { Authorization: `Bearer ${token}` };
      console.log(`🔑 [api.js] Returning headers:`, headers);
      return headers;
    } else {
      console.log(`❌ [api.js] No token found, returning empty headers`);
      return {};
    }
  }

  async request(endpoint, options = {}) {
    console.log(`🚨 [api.js] REQUEST METHOD CALLED! Endpoint: ${endpoint}`);

    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';

    console.log(`🌐 [api.js] Making ${method} request to: ${endpoint}`);
    console.log(`🌐 [api.js] Full URL: ${url}`);

    // Create request key for deduplication (only for GET requests)
    const requestKey = method === 'GET' ? `${method}:${url}` : null;

    // Check if this request is already pending (deduplication)
    if (requestKey && this.pendingRequests.has(requestKey)) {
      console.log(`🔄 [api.js] Deduplicating request: ${requestKey}`);
      return this.pendingRequests.get(requestKey);
    }

    const authHeaders = await this.getAuthHeaders();

    console.log(`🔑 [api.js] Auth headers result:`, authHeaders);

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      timeout: this.timeout,
      ...options,
    };

    console.log(`📤 [api.js] Final request config:`, {
      method: config.method,
      headers: config.headers,
      url: url
    });

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    // Create the request promise
    const requestPromise = this.executeRequest(url, config, endpoint, options);

    // Store pending request for deduplication
    if (requestKey) {
      this.pendingRequests.set(requestKey, requestPromise);

      // Clean up after request completes
      requestPromise.finally(() => {
        this.pendingRequests.delete(requestKey);
      });
    }

    return requestPromise;
  }

  async executeRequest(url, config, endpoint, options) {
    const requestKey = `${config.method}:${url}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - attempt token refresh
      if (response.status === 401 && !options._isRetry) {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            // Attempt to refresh token
            const refreshResponse = await this.refreshToken();
            if (refreshResponse.accessToken) {
              // Retry original request with new token
              return await this.request(endpoint, { ...options, _isRetry: true });
            }
          } catch (refreshError) {
            // Handle auth error through error handler
            const processedError = handleAuthError(refreshError);
            await this.clearTokens();
            const sessionError = new Error('Session expired. Please log in again.');
            sessionError.code = 'SESSION_EXPIRED';
            throw sessionError;
          }
        } else {
          // No refresh token available
          await this.clearTokens();
          const sessionError = new Error('Session expired. Please log in again.');
          sessionError.code = 'SESSION_EXPIRED';
          throw sessionError;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}`);
        error.response = {
          status: response.status,
          data: errorData,
        };

        // Check if we should retry this request
        if (this.shouldRetry(response.status, requestKey)) {
          return this.retryRequest(url, config, endpoint, options, requestKey);
        }

        throw error;
      }

      // Reset retry count on success
      this.retryAttempts.delete(requestKey);
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.code = 'NETWORK_ERROR';

        // Process through error handler
        handleNetworkError(timeoutError);

        // Retry on timeout if appropriate
        if (this.shouldRetry(0, requestKey)) {
          return this.retryRequest(url, config, endpoint, options, requestKey);
        }

        throw timeoutError;
      }

      // Process network errors through error handler
      handleNetworkError(error);

      // Check if we should retry on network error
      if (this.shouldRetry(0, requestKey)) {
        return this.retryRequest(url, config, endpoint, options, requestKey);
      }

      throw error;
    }
  }

  shouldRetry(statusCode, requestKey) {
    const retryCount = this.retryAttempts.get(requestKey) || 0;

    // Don't retry if we've exceeded max attempts
    if (retryCount >= this.maxRetries) {
      return false;
    }

    // Retry on network errors, timeouts, and certain HTTP status codes
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return statusCode === 0 || retryableStatuses.includes(statusCode);
  }

  async retryRequest(url, config, endpoint, options, requestKey) {
    const retryCount = this.retryAttempts.get(requestKey) || 0;
    this.retryAttempts.set(requestKey, retryCount + 1);

    // Exponential backoff delay
    const delay = this.retryDelay * Math.pow(2, retryCount);
    console.log(`🔄 Retrying request (${retryCount + 1}/${this.maxRetries}) after ${delay}ms: ${requestKey}`);

    await new Promise(resolve => setTimeout(resolve, delay));

    return this.executeRequest(url, config, endpoint, options);
  }

  // HTTP Methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Token management methods
  async refreshToken() {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    // Store new tokens
    if (data.accessToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    }
    if (data.refreshToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    }

    return data;
  }

  async clearTokens() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Export apiClient for use in other API services
export { apiClient };

/**
 * Authentication API endpoints
 */
export const authApi = {
  // Sign in user
  signIn: async (credentials) => {
    const response = await apiClient.post('/auth/signin', credentials);
    
    // Store tokens
    if (response.accessToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    }
    if (response.refreshToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    }
    if (response.user) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
    }
    
    return response;
  },

  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    
    // Store tokens
    if (response.accessToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    }
    if (response.refreshToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    }
    if (response.user) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
    }
    
    return response;
  },

  // Sign out user
  signOut: async () => {
    try {
      await apiClient.post('/auth/signout');
    } catch (error) {
      // Continue with local cleanup even if server request fails
      console.warn('Sign out request failed:', error);
    } finally {
      // Clear local storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    }
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    
    if (response.accessToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    }
    
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return await apiClient.post('/auth/reset-password', { token, newPassword });
  },
};

/**
 * Mock API for development (remove in production)
 */
const mockAuthApi = {
  signIn: async (credentials) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (credentials.email === 'test@blong.app' && credentials.password === 'password123') {
      return {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          avatar: null,
          preferences: {},
        },
      };
    } else {
      const error = new Error('Invalid credentials');
      error.response = {
        status: 401,
        data: { message: 'Invalid email or password' },
      };
      throw error;
    }
  },

  register: async (userData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock email validation
    if (userData.email === 'existing@blong.app') {
      const error = new Error('Email already exists');
      error.response = {
        status: 422,
        data: { message: 'An account with this email already exists' },
      };
      throw error;
    }
    
    return {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      user: {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: null,
        preferences: {},
      },
    };
  },

  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
};

// Enhanced API service - ALWAYS use real APIs (no mocking)
const createApiService = () => {
  console.log('� Using Real Backend API - Mock data disabled');
  return authApi;
};

export const api = createApiService();

/**
 * React Query configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      ...API_CONFIG.RETRY_CONFIG,
    },
    mutations: {
      ...API_CONFIG.RETRY_CONFIG,
    },
  },
});

/**
 * Query keys for consistent cache management
 */
export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ['auth', 'currentUser'],
  },
  USER: {
    PROFILE: (userId) => ['user', 'profile', userId],
  },
};

export default {
  api,
  queryClient,
  QUERY_KEYS,
  STORAGE_KEYS,
};
