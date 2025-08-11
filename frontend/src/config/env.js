/**
 * BLONG Environment Configuration
 * SINGLE SOURCE OF TRUTH for all environment variables
 * 
 * This file centralizes all environment configuration to avoid
 * hardcoded values scattered across the codebase.
 */

import { Platform } from 'react-native';

// Platform-specific API URL resolution
const getApiBaseUrl = () => {
  // For production, always use the production URL
  if (!__DEV__) {
    return 'https://api.blong.app/api';
  }

  // For development, try different URLs based on platform
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (apiUrl) return apiUrl;
  
  // Platform-specific URLs for development
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  } else if (Platform.OS === 'ios') {
    // iOS simulator needs the host machine's IP address
    return 'http://192.168.1.8:3000/api';
  } else if (Platform.OS === 'android') {
    // Android emulator special IP
    return 'http://10.0.2.2:3000/api';
  }
  
  // Fallback for physical devices
  return 'http://192.168.1.8:3000/api';
};

// Environment Variables (using Expo's EXPO_PUBLIC_ prefix for client-side access)
const ENV = {
  // API Configuration
  API_BASE_URL: getApiBaseUrl(),
  API_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
  
  // Environment
  NODE_ENV: process.env.EXPO_PUBLIC_NODE_ENV || 'development',
  IS_DEV: process.env.EXPO_PUBLIC_NODE_ENV === 'development' || __DEV__,
  
  // Feature Flags
  ENABLE_MOCK_DATA: process.env.EXPO_PUBLIC_ENABLE_MOCK_DATA === 'true',
  ENABLE_DEBUG_LOGS: process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === 'true',
  
  // App Configuration
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'BLONG',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  
  // Network Configuration
  REQUEST_RETRY_ATTEMPTS: parseInt(process.env.EXPO_PUBLIC_REQUEST_RETRY_ATTEMPTS) || 3,
  REQUEST_RETRY_DELAY: parseInt(process.env.EXPO_PUBLIC_REQUEST_RETRY_DELAY) || 1000,
  
  // Cache Configuration
  CACHE_STALE_TIME: parseInt(process.env.EXPO_PUBLIC_CACHE_STALE_TIME) || 300000, // 5 minutes
  CACHE_GC_TIME: parseInt(process.env.EXPO_PUBLIC_CACHE_GC_TIME) || 600000, // 10 minutes
};

// Validation function to ensure required environment variables are set
const validateEnv = () => {
  const requiredVars = ['API_BASE_URL'];
  const missing = requiredVars.filter(key => !ENV[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (ENV.ENABLE_DEBUG_LOGS) {
    console.log('🔧 Environment Configuration:', {
      API_BASE_URL: ENV.API_BASE_URL,
      NODE_ENV: ENV.NODE_ENV,
      IS_DEV: ENV.IS_DEV,
      ENABLE_MOCK_DATA: ENV.ENABLE_MOCK_DATA,
      PLATFORM: Platform.OS,
    });

    // Test API connectivity
    console.log('🔍 Testing API connectivity...');
    fetch(`${ENV.API_BASE_URL.replace('/api', '')}/api/health`)
      .then(response => {
        console.log('✅ API Health Check Success:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('📊 API Health Data:', data);
      })
      .catch(error => {
        console.error('❌ API Health Check Failed:', error.message);
        console.error('🔧 Trying alternative URLs...');

        // Try alternative URLs
        const alternatives = [
          'http://localhost:3000/api/health',
          'http://127.0.0.1:3000/api/health',
          'http://10.0.2.2:3000/api/health'
        ];

        alternatives.forEach(url => {
          fetch(url)
            .then(res => console.log(`✅ Alternative URL works: ${url} - Status: ${res.status}`))
            .catch(err => console.log(`❌ Alternative URL failed: ${url} - ${err.message}`));
        });
      });
  }
};

// Validate environment on import
validateEnv();

// Environment-specific configurations
export const API_CONFIG = {
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  enableMocking: ENV.ENABLE_MOCK_DATA,
};

export const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  retry: {
    attempts: ENV.REQUEST_RETRY_ATTEMPTS,
    delay: ENV.REQUEST_RETRY_DELAY,
    backoff: 2,
  },
  cache: {
    staleTime: ENV.CACHE_STALE_TIME,
    gcTime: ENV.CACHE_GC_TIME,
  },
};

export const FEATURE_FLAGS = {
  enableMockData: ENV.ENABLE_MOCK_DATA,
  enableDebugLogs: ENV.ENABLE_DEBUG_LOGS,
  enableSocialLogin: true,
  enableBiometricAuth: true,
  enablePushNotifications: true,
  enableVideoChat: false,
  enableVoiceMessages: true,
  enableGifts: true,
  enableSuperLikes: true,
  enableBoosts: true,
};

// Export the complete environment object
export default ENV;
