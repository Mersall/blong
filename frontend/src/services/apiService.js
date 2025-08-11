/**
 * BLONG API Service
 * Simple HTTP client for API calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '../config/env';
import { ERROR_TYPES } from '../utils/errorHandling';
import { handleTokenExpiration } from './navigationService';

// Conditional NetInfo import for better compatibility
let NetInfo;
try {
  NetInfo = require('@react-native-community/netinfo');
} catch (error) {
  console.warn('NetInfo not available, network checking disabled');
  NetInfo = null;
}

const API_BASE_URL = ENV.API_BASE_URL;

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@blong_access_token',
};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isHandlingTokenExpiration = false;
  }

  async getAuthHeaders() {
    try {
      console.log(`🔑 [ApiService] Getting auth headers...`);
      console.log(`🔑 [ApiService] Storage key: ${STORAGE_KEYS.ACCESS_TOKEN}`);

      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      console.log(`🔑 [ApiService] Token found: ${token ? 'YES' : 'NO'}`);

      if (token) {
        console.log(`🔑 [ApiService] Token preview: ${token.substring(0, 20)}...`);
        console.log(`🔑 [ApiService] Token length: ${token.length}`);

        const headers = { Authorization: `Bearer ${token}` };
        console.log(`🔑 [ApiService] Returning headers:`, headers);
        return headers;
      } else {
        console.log(`❌ [ApiService] No token found, checking all storage keys...`);

        // Debug: Check all storage keys
        const allKeys = await AsyncStorage.getAllKeys();
        console.log(`🔍 [ApiService] All AsyncStorage keys:`, allKeys);

        // Check if token exists with different key
        for (const key of allKeys) {
          if (key.includes('token') || key.includes('access')) {
            const value = await AsyncStorage.getItem(key);
            console.log(`🔍 [ApiService] Found token-like key: ${key} = ${value ? value.substring(0, 20) + '...' : 'null'}`);
          }
        }

        console.log(`❌ [ApiService] Returning empty headers`);
        return {};
      }
    } catch (error) {
      console.error(`❌ [ApiService] Error getting auth headers:`, error);
      return {};
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    console.log(`🌐 [ApiService] Making ${options.method || 'GET'} request to: ${endpoint}`);
    console.log(`🌐 [ApiService] Full URL: ${url}`);

    const authHeaders = await this.getAuthHeaders();

    console.log(`🔑 [ApiService] Auth headers result:`, authHeaders);

    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };

    console.log(`📤 [ApiService] Final request config:`, {
      method: config.method,
      headers: config.headers,
      url: url
    });

    // Handle request body
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`📡 [ApiService] Sending request...`);
      const response = await fetch(url, config);

      console.log(`📥 [ApiService] Response status: ${response.status}`);
      console.log(`📥 [ApiService] Response ok: ${response.ok}`);

      // Check for token expiration (401 Unauthorized or 403 Forbidden)
      if (response.status === 401 || response.status === 403) {
        console.log('🔐 [ApiService] Token expiration detected in API response:', response.status);

        // Prevent infinite retry loops
        if (options._isRetryAfterRefresh) {
          console.log('❌ Already retried after token refresh, giving up');
          await this.handleTokenExpiration();

          const error = new Error('Session expired. Please log in again.');
          error.isTokenExpired = true;
          error.statusCode = response.status;
          throw error;
        }

        // Try to refresh token automatically instead of logging out immediately
        const refreshResult = await this.attemptTokenRefresh();

        if (refreshResult.success) {
          console.log('✅ Token refreshed successfully, retrying original request');
          // Retry the original request with the new token (mark as retry)
          return await this.request(endpoint, { ...options, _isRetryAfterRefresh: true });
        } else {
          console.log('❌ Token refresh failed, user needs to log in again');
          // Only now do we log the user out
          await this.handleTokenExpiration();

          // Create a specific error for token expiration
          const error = new Error('Session expired. Please log in again.');
          error.isTokenExpired = true;
          error.statusCode = response.status;
          throw error;
        }
      }
      
      if (!response.ok) {
        // Enhanced error parsing to extract backend error messages
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.warn('Failed to parse error response as JSON:', parseError);
          errorData = { message: response.statusText };
        }
        
        // Create enhanced error object with all relevant information
        const error = new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        
        // Attach response details for better error handling
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          headers: response.headers,
        };
        
        // Attach the raw error data for consumers
        error.serverData = errorData;
        error.statusCode = response.status;
        
        // Add error type classification
        if (response.status >= 400 && response.status < 500) {
          error.type = response.status === 422 || response.status === 400 ? 'VALIDATION_ERROR' : 'CLIENT_ERROR';
        } else if (response.status >= 500) {
          error.type = 'SERVER_ERROR';
        }
        
        console.error('❌ API Request failed with detailed error:', {
          url,
          method: config.method,
          status: response.status,
          statusText: response.statusText,
          errorMessage: error.message,
          serverData: errorData,
        });
        
        throw error;
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('❌ Network error detected:', error);
        const networkError = new Error('Unable to connect to server. Please check your internet connection.');
        networkError.type = 'NETWORK_ERROR';
        networkError.originalError = error;
        throw networkError;
      }
      
      // Re-throw token expiration errors as-is
      if (error.isTokenExpired) {
        throw error;
      }
      
      // Re-throw errors that already have our enhanced structure
      if (error.response || error.type) {
        throw error;
      }
      
      // Handle other errors
      console.error('❌ API Request failed:', error);
      
      // Enhance generic errors with type information
      error.type = error.type || 'UNKNOWN_ERROR';
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    // Handle query parameters
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      endpoint = `${endpoint}?${queryString}`;
      delete options.params;
    }
    
    return this.request(endpoint, { 
      ...options, 
      method: 'GET' 
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }

  // ========================================
  // DATABASE-DRIVEN APIs - REPLACES ALL HARDCODED DATA
  // ========================================

  /**
   * Get available languages - REPLACES hardcoded language arrays
   */
  async getLanguages() {
    return this.get('/system/languages');
  }

  /**
   * Get relationship phases - REPLACES hardcoded phase options
   */
  async getPhases() {
    return this.get('/system/phases');
  }

  /**
   * Get questionnaire by phase - REPLACES hardcoded questionnaire data
   */
  async getQuestionnaire(phase) {
    return this.get(`/questionnaire/${phase}`);
  }

  /**
   * Submit questionnaire answers - REPLACES mock submission
   */
  async submitQuestionnaireAnswers(templateId, answers) {
    return this.post(`/questionnaire/${templateId}/answers`, { answers });
  }

  /**
   * Get ice breaker questions - REPLACES hardcoded ice breaker arrays
   */
  async getIceBreakers(language = 'en') {
    return this.get('/system/icebreakers', { params: { language } });
  }

  /**
   * Get date activities - REPLACES hardcoded date activity arrays
   */
  async getDateActivities(language = 'en') {
    return this.get('/system/date-activities', { params: { language } });
  }

  /**
   * Get potential matches - REPLACES hardcoded match data
   */
  async getPotentialMatches(userId) {
    return this.get(`/matching/potential-matches/${userId}`);
  }

  /**
   * Get articles - REPLACES hardcoded article arrays
   */
  async getArticles(language = 'en', category = null, featured = false) {
    const params = { language };
    if (category) params.category = category;
    if (featured) params.featured = 'true';

    return this.get('/articles', { params });
  }

  /**
   * Get article categories - REPLACES hardcoded category arrays
   */
  async getArticleCategories(language = 'en') {
    return this.get('/articles/categories', { params: { language } });
  }

  /**
   * Get user completion status - REPLACES hardcoded completion tracking
   */
  async getUserCompletionStatus() {
    return this.get('/profile/completion-status');
  }

  /**
   * Get venue recommendations - REPLACES hardcoded venue data
   */
  async getVenueRecommendations(type = 'RESTAURANT', city = 'New York', budget = 'MODERATE') {
    return this.get('/venues/recommendations', {
      params: { type, city, budget }
    });
  }

  /**
   * Authentication methods with real database
   */
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);

    if (response.accessToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    }

    return response;
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  async isAuthenticated() {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }

  /**
   * Attempt to refresh the access token automatically
   */
  async attemptTokenRefresh() {
    try {
      console.log('🔄 Attempting automatic token refresh...');

      // Get the refresh token
      const refreshToken = await AsyncStorage.getItem('@blong_refresh_token');
      if (!refreshToken) {
        console.log('❌ No refresh token available');
        return { success: false, reason: 'No refresh token' };
      }

      // Call the refresh endpoint
      const refreshResponse = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();

        if (data.accessToken) {
          // Save the new tokens
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
          if (data.refreshToken) {
            await AsyncStorage.setItem('@blong_refresh_token', data.refreshToken);
          }

          // Update token timestamp
          const tokenInfo = {
            timestamp: Date.now(),
            expiresIn: data.expiresIn || 7200, // Default 2 hours
          };
          await AsyncStorage.setItem('@blong_token_info', JSON.stringify(tokenInfo));

          console.log('✅ Token refresh successful');
          return { success: true };
        }
      }

      console.log('❌ Token refresh failed:', refreshResponse.status);
      return { success: false, reason: 'Refresh request failed' };

    } catch (error) {
      console.error('❌ Error during token refresh:', error);
      return { success: false, reason: error.message };
    }
  }

  /**
   * Handle token expiration by clearing tokens and redirecting to login
   */
  async handleTokenExpiration() {
    // Prevent multiple simultaneous token expiration handling
    if (this.isHandlingTokenExpiration) {
      console.log('🔐 Token expiration already being handled, skipping...');
      return;
    }

    this.isHandlingTokenExpiration = true;

    try {
      console.log('🔐 Handling token expiration...');
      
      // Clear stored tokens
      await this.clearTokens();
      
      // Use navigation service to handle the redirect
      await handleTokenExpiration();
      
      console.log('✅ Token expiration handled successfully');
    } catch (error) {
      console.error('❌ Error handling token expiration:', error);
    } finally {
      // Reset the flag after a delay to prevent rapid-fire calls
      setTimeout(() => {
        this.isHandlingTokenExpiration = false;
      }, 1000);
    }
  }

  /**
   * Clear stored authentication tokens
   */
  async clearTokens() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        '@blong_refresh_token',
        '@blong_user_data'
      ]);
      console.log('🗑️ Authentication tokens cleared');
    } catch (error) {
      console.error('❌ Error clearing tokens:', error);
    }
  }

  /**
   * Check if an error is due to token expiration
   */
  isTokenExpirationError(error) {
    return error?.isTokenExpired === true || 
           error?.statusCode === 401 || 
           error?.statusCode === 403 || 
           error?.message?.toLowerCase().includes('unauthorized') ||
           error?.message?.toLowerCase().includes('forbidden') ||
           error?.message?.toLowerCase().includes('token') && error?.message?.toLowerCase().includes('expired');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
