/**
 * BLONG Error Manager
 * Central error handling system with premium modal integration
 */

import React from 'react';
import { Alert } from 'react-native';
import ErrorProcessingService from './errorProcessingService';
import PremiumErrorModal from '../components/ui/PremiumErrorModal';
import { ERROR_TYPES, ERROR_SEVERITY } from '../utils/errorHandling';

// Global error modal state management
let currentErrorModal = null;
let modalShowCallback = null;
let modalHideCallback = null;

class ErrorManager {
  /**
   * Initialize the error manager with modal callbacks
   */
  static initialize(showModalCallback, hideModalCallback) {
    modalShowCallback = showModalCallback;
    modalHideCallback = hideModalCallback;
  }

  /**
   * Display error using premium modal
   */
  static async showError(error, options = {}) {
    try {
      // Process the error to get user-friendly information
      const processedError = ErrorProcessingService.processError(error, options.context);
      
      // Get modal configuration
      const modalConfig = ErrorProcessingService.getModalConfig(processedError);
      
      // Merge with custom options
      const finalConfig = {
        ...modalConfig,
        ...options,
        error: processedError,
        onClose: () => {
          this.hideError();
          options.onClose?.();
        },
        onRetry: () => {
          this.hideError();
          options.onRetry?.();
        },
        onContactSupport: () => {
          this.hideError();
          this.showSupportOptions(processedError);
          options.onContactSupport?.();
        },
      };

      // Show the modal
      if (modalShowCallback) {
        currentErrorModal = finalConfig;
        modalShowCallback(finalConfig);
      } else {
        // Fallback to native alert if modal system not initialized
        this.showFallbackAlert(processedError, options);
      }

      // Log error for analytics/debugging
      this.logError(processedError, options);

      return processedError;
    } catch (processingError) {
      console.error('Error in ErrorManager.showError:', processingError);
      this.showFallbackAlert({
        title: 'System Error',
        message: 'An unexpected error occurred in the error handling system.',
      }, options);
    }
  }

  /**
   * Hide current error modal
   */
  static hideError() {
    if (modalHideCallback) {
      modalHideCallback();
    }
    currentErrorModal = null;
  }

  /**
   * Show network error with retry functionality
   */
  static async showNetworkError(error, retryFunction, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'network_request'
    });

    return this.showError(processedError, {
      ...options,
      showRetry: true,
      onRetry: async () => {
        try {
          if (retryFunction) {
            await retryFunction();
          }
        } catch (retryError) {
          // If retry fails, show the error again
          setTimeout(() => {
            this.showNetworkError(retryError, retryFunction, {
              ...options,
              context: { ...options.context, retryAttempt: true }
            });
          }, 500);
        }
      },
    });
  }

  /**
   * Show validation error with field-specific information
   */
  static async showValidationError(error, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'validation'
    });

    return this.showError(processedError, {
      ...options,
      errorType: ERROR_TYPES.VALIDATION,
      showRetry: false,
      showCopyDetails: false, // Usually not needed for validation errors
    });
  }

  /**
   * Show authentication error
   */
  static async showAuthError(error, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'authentication'
    });

    return this.showError(processedError, {
      ...options,
      errorType: ERROR_TYPES.AUTH,
      showRetry: false,
      customActions: [{
        label: 'Sign In Again',
        icon: 'log-in',
        color: '#FF6B35',
        onPress: () => {
          // Navigate to auth screen
          options.onSignInAgain?.();
        }
      }],
    });
  }

  /**
   * Show server error with support option
   */
  static async showServerError(error, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'server'
    });

    return this.showError(processedError, {
      ...options,
      errorType: ERROR_TYPES.SERVER,
      showRetry: true,
      showSupport: true,
    });
  }

  /**
   * Show critical error that requires immediate attention
   */
  static async showCriticalError(error, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'critical',
      severity: ERROR_SEVERITY.CRITICAL
    });

    return this.showError(processedError, {
      ...options,
      errorType: ERROR_TYPES.SERVER,
      showSupport: true,
      showCopyDetails: true,
      autoHide: false, // Don't auto-hide critical errors
      customActions: [{
        label: 'Restart App',
        icon: 'refresh-circle',
        color: '#F44336',
        onPress: () => {
          options.onRestartApp?.();
        }
      }],
    });
  }

  /**
   * Show timeout error with specific suggestions
   */
  static async showTimeoutError(error, retryFunction, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'timeout'
    });

    return this.showError(processedError, {
      ...options,
      errorType: 'timeout',
      title: 'Request Timeout',
      message: 'The request took too long to complete. This might be due to a slow connection.',
      showRetry: true,
      onRetry: retryFunction,
      customActions: [{
        label: 'Check Connection',
        icon: 'wifi',
        onPress: () => {
          options.onCheckConnection?.();
        }
      }],
    });
  }

  /**
   * Show permission error
   */
  static async showPermissionError(error, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'permission'
    });

    return this.showError(processedError, {
      ...options,
      errorType: 'permission',
      showRetry: false,
      customActions: [{
        label: 'Open Settings',
        icon: 'settings',
        onPress: () => {
          options.onOpenSettings?.();
        }
      }],
    });
  }

  /**
   * Show subscription/premium error
   */
  static async showSubscriptionError(error, options = {}) {
    const processedError = ErrorProcessingService.processError(error, {
      ...options.context,
      type: 'subscription'
    });

    return this.showError(processedError, {
      ...options,
      errorType: ERROR_TYPES.AUTH,
      title: 'Premium Feature',
      showRetry: false,
      customActions: [{
        label: 'Upgrade Now',
        icon: 'star',
        color: '#FF6B35',
        onPress: () => {
          options.onUpgrade?.();
        }
      }],
    });
  }

  /**
   * Batch show multiple errors (useful for form validation)
   */
  static async showMultipleErrors(errors, options = {}) {
    if (!errors || errors.length === 0) return;

    if (errors.length === 1) {
      return this.showError(errors[0], options);
    }

    // Combine multiple errors into one message
    const processedErrors = errors.map(error => 
      ErrorProcessingService.processError(error, options.context)
    );

    const combinedError = {
      type: ERROR_TYPES.VALIDATION,
      title: 'Multiple Issues Found',
      message: `${processedErrors.length} issues need your attention:`,
      fieldErrors: {},
      suggestions: [],
    };

    // Combine field errors and suggestions
    processedErrors.forEach((error, index) => {
      if (error.fieldErrors) {
        Object.assign(combinedError.fieldErrors, error.fieldErrors);
      }
      if (error.suggestions) {
        combinedError.suggestions.push(...error.suggestions);
      }
    });

    // Remove duplicate suggestions
    combinedError.suggestions = [...new Set(combinedError.suggestions)];

    return this.showError(combinedError, {
      ...options,
      showRetry: false,
      showCopyDetails: true,
    });
  }

  /**
   * Show support options
   */
  static showSupportOptions(processedError) {
    const supportOptions = [
      {
        text: 'Contact Support',
        onPress: () => {
          // Open support contact method
        }
      },
      {
        text: 'View Help Center',
        onPress: () => {
          // Open help center
        }
      },
      {
        text: 'Report Bug',
        onPress: () => {
          // Open bug report
        }
      },
      {
        text: 'Cancel',
        style: 'cancel'
      }
    ];

    Alert.alert(
      'Get Help',
      'How would you like to get assistance with this issue?',
      supportOptions
    );
  }

  /**
   * Fallback alert for when modal system is not available
   */
  static showFallbackAlert(processedError, options = {}) {
    const alertOptions = [
      { text: 'OK', onPress: options.onClose }
    ];

    if (processedError.retryable && options.onRetry) {
      alertOptions.unshift({ 
        text: 'Try Again', 
        onPress: options.onRetry 
      });
    }

    Alert.alert(
      processedError.title || 'Error',
      processedError.message || 'An error occurred',
      alertOptions
    );
  }

  /**
   * Log error for analytics and debugging
   */
  static logError(processedError, options = {}) {
    const logData = {
      timestamp: processedError.timestamp,
      type: processedError.type,
      severity: processedError.severity,
      title: processedError.title,
      message: processedError.message,
      technical: processedError.technical,
      context: processedError.context,
      platform: processedError.platform,
      userAgent: options.userAgent,
      userId: options.userId,
      sessionId: options.sessionId,
    };

    // Log to console in development
    if (__DEV__) {
      console.group('🚨 Error Occurred');
      console.error('Processed Error:', processedError);
      console.log('Log Data:', logData);
      console.groupEnd();
    }

    // In production, send to analytics service
    // Analytics.logError(logData);
  }

  /**
   * Test error modal with different error types
   */
  static testErrorModal() {
    if (__DEV__) {
      const testErrors = [
        {
          type: 'network',
          error: new Error('Network request failed'),
          options: { showRetry: true }
        },
        {
          type: 'validation',
          error: { 
            response: { 
              status: 422, 
              data: { 
                message: 'Validation failed',
                errors: {
                  email: 'Email is required',
                  password: 'Password must be at least 8 characters'
                }
              }
            }
          },
          options: {}
        },
        {
          type: 'auth',
          error: { 
            response: { 
              status: 401, 
              data: { message: 'Invalid credentials' }
            }
          },
          options: {}
        },
        {
          type: 'server',
          error: { 
            response: { 
              status: 500, 
              data: { message: 'Internal server error' }
            }
          },
          options: { showSupport: true }
        }
      ];

      // Show each test error with a delay
      testErrors.forEach((test, index) => {
        setTimeout(() => {
          this.showError(test.error, {
            ...test.options,
            context: { test: true, testType: test.type }
          });
        }, index * 3000);
      });
    }
  }

  /**
   * Get current error modal state
   */
  static getCurrentError() {
    return currentErrorModal;
  }

  /**
   * Clear all error states
   */
  static clearAll() {
    this.hideError();
    currentErrorModal = null;
  }
}

export default ErrorManager;