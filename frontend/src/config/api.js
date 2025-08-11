/**
 * BLONG API Configuration
 * Now uses centralized environment configuration
 */

import ENV, { API_CONFIG as ENV_API_CONFIG, REQUEST_CONFIG as ENV_REQUEST_CONFIG, FEATURE_FLAGS as ENV_FEATURE_FLAGS } from './env';

// Use centralized environment configuration
export const API_CONFIG = ENV_API_CONFIG;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
  
  // User Management (Updated to match backend endpoints)
  user: {
    profile: '/profile',
    preferences: '/profile/preferences',
    avatar: '/profile/avatar',
    deactivate: '/profile/deactivate',
  },
  
  // Matching & Discovery removed
  
  // Messaging removed
  
  // Premium Features
  premium: {
    plans: '/premium/plans',
    subscribe: '/premium/subscribe',
    status: '/premium/status',
    features: '/premium/features',
  },
};

// Use centralized request configuration
export const REQUEST_CONFIG = ENV_REQUEST_CONFIG;

// Error handling configuration
export const ERROR_CONFIG = {
  // Network errors
  network: {
    timeout: 'Network timeout. Please check your connection.',
    offline: 'You appear to be offline. Please check your connection.',
    server: 'Server error. Please try again later.',
  },
  
  // Authentication errors
  auth: {
    unauthorized: 'Session expired. Please sign in again.',
    forbidden: 'Access denied.',
    invalid: 'Invalid credentials.',
  },
  
  // Validation errors
  validation: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters.',
    match: 'Passwords do not match.',
  },
};

// Use centralized feature flags
export const FEATURE_FLAGS = ENV_FEATURE_FLAGS;

export default {
  API_CONFIG,
  API_ENDPOINTS,
  REQUEST_CONFIG,
  ERROR_CONFIG,
  FEATURE_FLAGS,
};
