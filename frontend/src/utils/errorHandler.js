/**
 * BLONG Error Handling System
 * Comprehensive error handling with user-friendly messages and proper logging
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Error types and their user-friendly messages
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Problem',
    message: 'Please check your internet connection and try again.',
    action: 'Retry',
    icon: '📶',
  },
  TIMEOUT_ERROR: {
    title: 'Request Timeout',
    message: 'The request took too long. Please try again.',
    action: 'Retry',
    icon: '⏱️',
  },
  
  // Authentication errors
  SESSION_EXPIRED: {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    action: 'Log In',
    icon: '🔐',
  },
  UNAUTHORIZED: {
    title: 'Access Denied',
    message: 'You don\'t have permission to access this feature.',
    action: 'Go Back',
    icon: '🚫',
  },
  
  // Validation errors
  VALIDATION_ERROR: {
    title: 'Invalid Information',
    message: 'Please check your information and try again.',
    action: 'Fix',
    icon: '⚠️',
  },
  
  // Server errors
  SERVER_ERROR: {
    title: 'Server Problem',
    message: 'Something went wrong on our end. We\'re working to fix it.',
    action: 'Try Later',
    icon: '🔧',
  },
  
  // Feature-specific errors
  PROFILE_INCOMPLETE: {
    title: 'Profile Incomplete',
    message: 'Please complete your profile to access this feature.',
    action: 'Complete Profile',
    icon: '👤',
  },
  PAYMENT_REQUIRED: {
    title: 'Premium Feature',
    message: 'This feature requires a premium subscription.',
    action: 'Upgrade',
    icon: '💎',
  },
  
  // Default fallback
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    action: 'Retry',
    icon: '❌',
  },
};

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  /**
   * Process and categorize errors
   */
  processError(error, context = {}) {
    const errorInfo = this.categorizeError(error);
    const processedError = {
      ...errorInfo,
      context,
      timestamp: new Date().toISOString(),
      id: this.generateErrorId(),
    };

    // Log error for debugging
    this.logError(processedError);

    return processedError;
  }

  /**
   * Categorize error based on type and status
   */
  categorizeError(error) {
    // Network/Connection errors
    if (error.code === 'NETWORK_ERROR' || error.name === 'AbortError') {
      return { ...ERROR_MESSAGES.NETWORK_ERROR, type: 'NETWORK_ERROR' };
    }

    // Session/Authentication errors
    if (error.code === 'SESSION_EXPIRED' || error.message?.includes('session expired')) {
      return { ...ERROR_MESSAGES.SESSION_EXPIRED, type: 'SESSION_EXPIRED' };
    }

    // HTTP status-based errors
    if (error.response?.status) {
      const status = error.response.status;
      
      switch (status) {
        case 400:
          return { ...ERROR_MESSAGES.VALIDATION_ERROR, type: 'VALIDATION_ERROR' };
        case 401:
          return { ...ERROR_MESSAGES.UNAUTHORIZED, type: 'UNAUTHORIZED' };
        case 403:
          return { ...ERROR_MESSAGES.UNAUTHORIZED, type: 'UNAUTHORIZED' };
        case 404:
          return {
            title: 'Not Found',
            message: 'The requested information could not be found.',
            action: 'Go Back',
            icon: '🔍',
            type: 'NOT_FOUND',
          };
        case 422:
          return { ...ERROR_MESSAGES.VALIDATION_ERROR, type: 'VALIDATION_ERROR' };
        case 429:
          return {
            title: 'Too Many Requests',
            message: 'Please wait a moment before trying again.',
            action: 'Wait',
            icon: '⏳',
            type: 'RATE_LIMITED',
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return { ...ERROR_MESSAGES.SERVER_ERROR, type: 'SERVER_ERROR' };
        default:
          return { ...ERROR_MESSAGES.UNKNOWN_ERROR, type: 'UNKNOWN_ERROR' };
      }
    }

    // Feature-specific errors
    if (error.message?.includes('profile incomplete')) {
      return { ...ERROR_MESSAGES.PROFILE_INCOMPLETE, type: 'PROFILE_INCOMPLETE' };
    }

    if (error.message?.includes('premium') || error.message?.includes('subscription')) {
      return { ...ERROR_MESSAGES.PAYMENT_REQUIRED, type: 'PAYMENT_REQUIRED' };
    }

    // Default fallback
    return { ...ERROR_MESSAGES.UNKNOWN_ERROR, type: 'UNKNOWN_ERROR' };
  }

  /**
   * Log error for debugging and analytics
   */
  logError(errorInfo) {
    // Add to in-memory log
    this.errorLog.unshift(errorInfo);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console log for development
    if (__DEV__) {
      console.group(`🚨 Error: ${errorInfo.title}`);
      console.error('Message:', errorInfo.message);
      console.error('Type:', errorInfo.type);
      console.error('Context:', errorInfo.context);
      console.error('Timestamp:', errorInfo.timestamp);
      console.groupEnd();
    }

    // Store critical errors for later analysis
    this.persistCriticalError(errorInfo);
  }

  /**
   * Persist critical errors to storage
   */
  async persistCriticalError(errorInfo) {
    const criticalTypes = ['SERVER_ERROR', 'NETWORK_ERROR', 'SESSION_EXPIRED'];
    
    if (criticalTypes.includes(errorInfo.type)) {
      try {
        const existingErrors = await AsyncStorage.getItem('critical_errors');
        const errors = existingErrors ? JSON.parse(existingErrors) : [];
        
        errors.unshift(errorInfo);
        
        // Keep only last 20 critical errors
        const trimmedErrors = errors.slice(0, 20);
        
        await AsyncStorage.setItem('critical_errors', JSON.stringify(trimmedErrors));
      } catch (storageError) {
        console.error('Failed to persist critical error:', storageError);
      }
    }
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {};
    
    this.errorLog.forEach(error => {
      stats[error.type] = (stats[error.type] || 0) + 1;
    });

    return {
      totalErrors: this.errorLog.length,
      errorTypes: stats,
      recentErrors: this.errorLog.slice(0, 5),
    };
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get user-friendly error message for display
   */
  getUserMessage(error, context = {}) {
    const errorInfo = this.processError(error, context);
    
    return {
      title: errorInfo.title,
      message: errorInfo.message,
      action: errorInfo.action,
      icon: errorInfo.icon,
      type: errorInfo.type,
      id: errorInfo.id,
    };
  }

  /**
   * Handle specific error scenarios
   */
  handleAuthError(error) {
    const errorInfo = this.processError(error, { scenario: 'authentication' });
    
    // Clear auth tokens on session expiry
    if (errorInfo.type === 'SESSION_EXPIRED') {
      this.clearAuthTokens();
    }
    
    return errorInfo;
  }

  handleNetworkError(error) {
    return this.processError(error, { scenario: 'network' });
  }

  handleValidationError(error, formData = {}) {
    return this.processError(error, { scenario: 'validation', formData });
  }

  /**
   * Clear authentication tokens
   */
  async clearAuthTokens() {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
    } catch (error) {
      console.error('Failed to clear auth tokens:', error);
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export utility functions
export const handleError = (error, context) => errorHandler.processError(error, context);
export const getUserErrorMessage = (error, context) => errorHandler.getUserMessage(error, context);
export const handleAuthError = (error) => errorHandler.handleAuthError(error);
export const handleNetworkError = (error) => errorHandler.handleNetworkError(error);
export const handleValidationError = (error, formData) => errorHandler.handleValidationError(error, formData);

export default errorHandler;
