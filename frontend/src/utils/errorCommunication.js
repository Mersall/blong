/**
 * BLONG Error Communication System
 * Provides user-friendly error messages and communication
 */

import { Alert } from 'react-native';

// Error types and their user-friendly messages
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Issue',
    message: 'Unable to connect to our servers. Please check your internet connection and try again.',
    action: 'Check Connection'
  },
  TIMEOUT_ERROR: {
    title: 'Request Timeout',
    message: 'The request is taking longer than expected. Please try again.',
    action: 'Try Again'
  },
  
  // Authentication errors
  AUTH_EXPIRED: {
    title: 'Session Expired',
    message: 'Your session has expired for security reasons. Please log in again.',
    action: 'Log In Again'
  },
  AUTH_INVALID: {
    title: 'Authentication Failed',
    message: 'Please check your credentials and try again.',
    action: 'Retry Login'
  },
  
  // Validation errors
  VALIDATION_ERROR: {
    title: 'Information Required',
    message: 'Please check that all required fields are filled correctly.',
    action: 'Review Information'
  },
  PROFILE_INCOMPLETE: {
    title: 'Profile Incomplete',
    message: 'Some required information is missing. Please complete all fields.',
    action: 'Complete Profile'
  },
  
  // Server errors
  SERVER_ERROR: {
    title: 'Server Issue',
    message: 'Our servers are experiencing issues. Please try again in a few moments.',
    action: 'Try Again Later'
  },
  MAINTENANCE: {
    title: 'Maintenance Mode',
    message: 'BLONG is currently undergoing maintenance. We\'ll be back shortly!',
    action: 'Check Back Later'
  },
  
  // Location errors
  LOCATION_DENIED: {
    title: 'Location Access Needed',
    message: 'BLONG needs location access to find matches near you. Please enable location in your device settings.',
    action: 'Enable Location'
  },
  LOCATION_UNAVAILABLE: {
    title: 'Location Unavailable',
    message: 'Unable to determine your location. Please check your GPS settings.',
    action: 'Check GPS'
  },
  
  // Profile specific errors
  PROFILE_SAVE_ERROR: {
    title: 'Profile Save Failed',
    message: 'Unable to save your profile changes. Please try again.',
    action: 'Retry Save'
  },
  PHOTO_UPLOAD_ERROR: {
    title: 'Photo Upload Failed',
    message: 'Unable to upload your photo. Please check your connection and try again.',
    action: 'Try Again'
  },
  
  // Generic fallback
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    action: 'Try Again'
  }
};

/**
 * Determine error type from error object
 */
export const getErrorType = (error) => {
  // Network errors
  if (error.message?.includes('Network') || error.type === 'NETWORK_ERROR') {
    return 'NETWORK_ERROR';
  }
  
  if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
    return 'TIMEOUT_ERROR';
  }
  
  // Authentication errors
  if (error.statusCode === 401 || error.isTokenExpired) {
    return 'AUTH_EXPIRED';
  }
  
  if (error.statusCode === 403) {
    return 'AUTH_INVALID';
  }
  
  // Validation errors
  if (error.statusCode === 400 || error.statusCode === 422 || error.type === 'VALIDATION_ERROR') {
    return 'VALIDATION_ERROR';
  }
  
  // Server errors
  if (error.statusCode >= 500 || error.type === 'SERVER_ERROR') {
    return 'SERVER_ERROR';
  }
  
  // Location errors
  if (error.message?.includes('location') || error.message?.includes('Location')) {
    return 'LOCATION_DENIED';
  }
  
  // Profile specific
  if (error.message?.includes('profile') || error.message?.includes('Profile')) {
    return 'PROFILE_SAVE_ERROR';
  }
  
  return 'UNKNOWN_ERROR';
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyError = (error, context = {}) => {
  const errorType = getErrorType(error);
  const errorConfig = ERROR_MESSAGES[errorType];
  
  // Enhance message with context if available
  let enhancedMessage = errorConfig.message;
  
  if (context.operation) {
    switch (context.operation) {
      case 'profile_save':
        enhancedMessage = 'Unable to save your profile. ' + errorConfig.message;
        break;
      case 'login':
        enhancedMessage = 'Login failed. ' + errorConfig.message;
        break;
      case 'location_detection':
        enhancedMessage = 'Location detection failed. ' + errorConfig.message;
        break;
      default:
        break;
    }
  }
  
  return {
    ...errorConfig,
    message: enhancedMessage,
    originalError: error,
    context
  };
};

/**
 * Show user-friendly error alert
 */
export const showErrorAlert = (error, context = {}, onAction = null) => {
  const errorInfo = getUserFriendlyError(error, context);
  
  const buttons = [
    {
      text: 'OK',
      style: 'cancel'
    }
  ];
  
  if (onAction) {
    buttons.unshift({
      text: errorInfo.action,
      onPress: onAction
    });
  }
  
  Alert.alert(
    errorInfo.title,
    errorInfo.message,
    buttons
  );
};

/**
 * Log error for debugging while showing user-friendly message
 */
export const handleErrorWithLogging = (error, context = {}, onAction = null) => {
  // Log technical details for debugging
  console.error('🚨 Error occurred:', {
    error: error.message || error,
    stack: error.stack,
    statusCode: error.statusCode,
    type: error.type,
    context,
    timestamp: new Date().toISOString()
  });
  
  // Show user-friendly message
  showErrorAlert(error, context, onAction);
};

/**
 * Success message helper
 */
export const showSuccessAlert = (title, message, onOK = null) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: onOK
      }
    ]
  );
};

export default {
  ERROR_MESSAGES,
  getErrorType,
  getUserFriendlyError,
  showErrorAlert,
  handleErrorWithLogging,
  showSuccessAlert
};
