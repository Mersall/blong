/**
 * BLONG Enhanced Error Processing Service
 * Intelligent error parsing and user-friendly message generation
 */

import { Platform } from 'react-native';
import { ERROR_TYPES, ERROR_SEVERITY } from '../utils/errorHandling';

// Field mapping for validation errors
const FIELD_MAPPINGS = {
  // Authentication fields
  email: 'Email address',
  password: 'Password', 
  confirmPassword: 'Confirm password',
  firstName: 'First name',
  lastName: 'Last name',
  
  // Profile fields
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  height: 'Height',
  weight: 'Weight',
  occupation: 'Occupation',
  education: 'Education',
  maritalStatus: 'Marital status',
  hasChildren: 'Children status',
  wantChildren: 'Children preference',
  smoking: 'Smoking preference',
  drinking: 'Drinking preference',
  
  // Location fields
  country: 'Country',
  city: 'City',
  region: 'Region/State',
  district: 'District',
  postalCode: 'Postal code',
  
  // Additional fields
  interests: 'Interests',
  languages: 'Languages',
  religion: 'Religion',
  ethnicity: 'Ethnicity',

  // Quiz/Assessment fields
  personalityType: 'Personality type',
  loveLanguage: 'Love language',
  attachmentStyle: 'Attachment style',
  compatibilityScore: 'Compatibility score',

  // Date/Venue fields
  venuePreference: 'Venue preference',
  datePreference: 'Date preference',
  timePreference: 'Time preference',
  budgetRange: 'Budget range',
};

// Common error patterns and their user-friendly messages
const ERROR_PATTERNS = {
  // Network errors
  'NETWORK_REQUEST_FAILED': {
    type: ERROR_TYPES.NETWORK,
    title: 'Connection Failed',
    message: 'Unable to connect to our servers. Please check your internet connection.',
    suggestions: ['Check your WiFi or mobile data connection', 'Try again in a few moments'],
    retryable: true,
  },
  'TIMEOUT': {
    type: ERROR_TYPES.NETWORK,
    title: 'Request Timeout',
    message: 'The request took too long to complete. This might be due to a slow connection.',
    suggestions: ['Check your internet speed', 'Try again with a better connection'],
    retryable: true,
  },
  
  // Authentication errors
  'INVALID_CREDENTIALS': {
    type: ERROR_TYPES.AUTH,
    title: 'Invalid Credentials',
    message: 'The email or password you entered is incorrect.',
    suggestions: ['Double-check your email and password', 'Use "Forgot Password" if needed'],
    retryable: false,
  },
  'EMAIL_NOT_VERIFIED': {
    type: ERROR_TYPES.AUTH,
    title: 'Email Not Verified',
    message: 'Please verify your email address before signing in.',
    suggestions: ['Check your email for a verification link', 'Request a new verification email'],
    retryable: false,
  },
  'ACCOUNT_LOCKED': {
    type: ERROR_TYPES.AUTH,
    title: 'Account Temporarily Locked',
    message: 'Your account has been temporarily locked due to multiple failed login attempts.',
    suggestions: ['Wait 15 minutes before trying again', 'Contact support if the issue persists'],
    retryable: false,
  },
  
  // Validation errors
  'VALIDATION_ERROR': {
    type: ERROR_TYPES.VALIDATION,
    title: 'Invalid Information',
    message: 'Please check the highlighted fields and try again.',
    suggestions: ['Review all required fields', 'Ensure information is in the correct format'],
    retryable: false,
  },
  'EMAIL_ALREADY_EXISTS': {
    type: ERROR_TYPES.VALIDATION,
    title: 'Email Already Registered',
    message: 'An account with this email address already exists.',
    suggestions: ['Try signing in instead', 'Use a different email address', 'Reset your password if forgotten'],
    retryable: false,
  },

  // BLONG-specific errors
  'PROFILE_INCOMPLETE': {
    type: ERROR_TYPES.VALIDATION,
    title: 'Profile Incomplete',
    message: 'Please complete your profile before proceeding.',
    suggestions: ['Fill in all required profile fields', 'Add at least one profile photo', 'Complete personality assessment'],
    retryable: false,
  },
  'QUIZ_SESSION_EXPIRED': {
    type: ERROR_TYPES.SESSION,
    title: 'Quiz Session Expired',
    message: 'Your quiz session has expired. Your progress has been saved.',
    suggestions: ['Resume from where you left off', 'Start a new session if needed'],
    retryable: true,
  },
  'VENUE_UNAVAILABLE': {
    type: ERROR_TYPES.BUSINESS,
    title: 'Venue Unavailable',
    message: 'The selected venue is no longer available for your preferred date.',
    suggestions: ['Choose a different date', 'Select an alternative venue', 'Let our AI suggest similar venues'],
    retryable: true,
  },
  'COMPATIBILITY_CALCULATION_FAILED': {
    type: ERROR_TYPES.SERVER,
    title: 'Compatibility Analysis Failed',
    message: 'We couldn\'t calculate your compatibility score at this time.',
    suggestions: ['Try again in a few minutes', 'Ensure your personality assessment is complete'],
    retryable: true,
  },
  'PAYMENT_PROCESSING_FAILED': {
    type: ERROR_TYPES.PAYMENT,
    title: 'Payment Processing Failed',
    message: 'We couldn\'t process your payment. Your card was not charged.',
    suggestions: ['Check your payment details', 'Try a different payment method', 'Contact your bank if the issue persists'],
    retryable: true,
  },
  'WEAK_PASSWORD': {
    type: ERROR_TYPES.VALIDATION,
    title: 'Password Too Weak',
    message: 'Your password doesn\'t meet our security requirements.',
    suggestions: ['Use at least 8 characters', 'Include uppercase and lowercase letters', 'Add numbers and special characters'],
    retryable: false,
  },
  
  // Server errors
  'INTERNAL_SERVER_ERROR': {
    type: ERROR_TYPES.SERVER,
    title: 'Server Error',
    message: 'Something went wrong on our end. Our team has been notified.',
    suggestions: ['Try again in a few minutes', 'Contact support if the issue persists'],
    retryable: true,
  },
  'SERVICE_UNAVAILABLE': {
    type: ERROR_TYPES.SERVER,
    title: 'Service Temporarily Unavailable',
    message: 'Our servers are temporarily unavailable for maintenance.',
    suggestions: ['Try again in a few minutes', 'Check our status page for updates'],
    retryable: true,
  },
  'RATE_LIMIT_EXCEEDED': {
    type: ERROR_TYPES.SERVER,
    title: 'Too Many Requests',
    message: 'You\'re making requests too quickly. Please slow down.',
    suggestions: ['Wait a moment before trying again', 'Avoid rapid repeated actions'],
    retryable: true,
  },
  
  // Permission errors
  'INSUFFICIENT_PERMISSIONS': {
    type: ERROR_TYPES.AUTH,
    title: 'Access Denied',
    message: 'You don\'t have permission to perform this action.',
    suggestions: ['Check your account status', 'Contact support for assistance'],
    retryable: false,
  },
  'SUBSCRIPTION_REQUIRED': {
    type: ERROR_TYPES.AUTH,
    title: 'Premium Feature',
    message: 'This feature requires a premium subscription.',
    suggestions: ['Upgrade to BLONG Premium', 'Explore our subscription plans'],
    retryable: false,
  },
};

class ErrorProcessingService {
  /**
   * Process and categorize error from various sources
   */
  static processError(error, context = {}) {
    try {
      const errorInfo = {
        originalError: error,
        type: ERROR_TYPES.UNKNOWN,
        severity: ERROR_SEVERITY.MEDIUM,
        title: 'Unexpected Error',
        message: 'An unexpected error occurred.',
        suggestions: ['Try again later'],
        retryable: false,
        technical: null,
        timestamp: new Date().toISOString(),
        context: context,
        platform: Platform.OS,
        // Enhanced context information
        userAction: context?.operation || 'unknown_action',
        screenName: context?.screen || 'unknown_screen',
        userId: context?.userId || null,
        sessionId: context?.sessionId || null,
      };

      // Parse different error formats
      if (typeof error === 'string') {
        return this.parseStringError(error, errorInfo);
      }

      if (error?.response) {
        return this.parseHttpError(error, errorInfo);
      }

      // Handle network errors first
      if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
        return this.parseNetworkError(error, errorInfo);
      }

      if (error?.code || error?.type) {
        return this.parseCodedError(error, errorInfo);
      }

      if (error?.message) {
        return this.parseMessageError(error, errorInfo);
      }

      // Enhance error message based on context
      return this.enhanceWithContext(errorInfo);
    } catch (processingError) {
      console.error('Error processing error:', processingError);
      return this.createFallbackError();
    }
  }

  /**
   * Enhance error information with context-aware messaging
   */
  static enhanceWithContext(errorInfo) {
    const context = errorInfo.context || {};
    const operation = context.operation;

    // Add context-specific suggestions and messages
    switch (operation) {
      case 'profile_save':
        if (errorInfo.type === ERROR_TYPES.NETWORK) {
          errorInfo.message = 'Unable to save your profile due to connection issues. Your changes are preserved locally.';
          errorInfo.suggestions = [
            'Check your internet connection',
            'Your changes will be saved when connection is restored',
            'Try again when you have a stable connection'
          ];
        }
        break;

      case 'quiz_submission':
        if (errorInfo.type === ERROR_TYPES.NETWORK) {
          errorInfo.message = 'Your quiz answers couldn\'t be submitted. Don\'t worry, your progress is saved.';
          errorInfo.suggestions = [
            'Your answers are saved locally',
            'Try submitting again when connection is restored',
            'You can continue from where you left off'
          ];
        }
        break;

      case 'date_booking':
        if (errorInfo.type === ERROR_TYPES.NETWORK) {
          errorInfo.message = 'Unable to book your date due to connection issues. The venue is still available.';
          errorInfo.suggestions = [
            'Check your internet connection',
            'The venue remains available for booking',
            'Try again in a few moments'
          ];
        }
        break;

      case 'compatibility_calculation':
        if (errorInfo.type === ERROR_TYPES.SERVER) {
          errorInfo.message = 'We\'re having trouble calculating compatibility scores right now.';
          errorInfo.suggestions = [
            'Our AI is temporarily unavailable',
            'Try again in a few minutes',
            'Your profile and quiz data are safe'
          ];
        }
        break;
    }

    // Add recovery guidance based on error type and context
    errorInfo = this.addRecoveryGuidance(errorInfo);

    return errorInfo;
  }

  /**
   * Add specific recovery guidance based on error type and context
   */
  static addRecoveryGuidance(errorInfo) {
    const context = errorInfo.context || {};

    // Add step-by-step recovery guidance
    switch (errorInfo.type) {
      case ERROR_TYPES.NETWORK:
        errorInfo.recoverySteps = [
          'Check your WiFi or mobile data connection',
          'Try moving to an area with better signal',
          'Restart your internet connection if needed',
          'Try again in a few moments'
        ];
        break;

      case ERROR_TYPES.VALIDATION:
        if (context.operation === 'profile_save') {
          errorInfo.recoverySteps = [
            'Review all highlighted fields',
            'Ensure all required information is filled',
            'Check that dates and formats are correct',
            'Save your changes when ready'
          ];
        }
        break;

      case ERROR_TYPES.AUTH:
        errorInfo.recoverySteps = [
          'Double-check your email and password',
          'Ensure caps lock is not enabled',
          'Try resetting your password if needed',
          'Contact support if issues persist'
        ];
        break;

      case ERROR_TYPES.PAYMENT:
        errorInfo.recoverySteps = [
          'Verify your card details are correct',
          'Check that your card has sufficient funds',
          'Try a different payment method',
          'Contact your bank if the issue continues'
        ];
        break;

      case ERROR_TYPES.QUIZ:
        errorInfo.recoverySteps = [
          'Your progress has been automatically saved',
          'You can resume from where you left off',
          'Check your internet connection',
          'Try refreshing the quiz if needed'
        ];
        break;
    }

    // Add estimated resolution time
    errorInfo.estimatedResolutionTime = this.getEstimatedResolutionTime(errorInfo.type);

    return errorInfo;
  }

  /**
   * Get estimated resolution time for different error types
   */
  static getEstimatedResolutionTime(errorType) {
    switch (errorType) {
      case ERROR_TYPES.NETWORK:
        return 'Usually resolves in 1-2 minutes';
      case ERROR_TYPES.SERVER:
        return 'Usually resolves in 5-10 minutes';
      case ERROR_TYPES.VALIDATION:
        return 'Can be fixed immediately';
      case ERROR_TYPES.AUTH:
        return 'Can be fixed immediately';
      case ERROR_TYPES.PAYMENT:
        return 'May take 5-15 minutes to resolve';
      default:
        return 'Resolution time varies';
    }
  }

  /**
   * Parse HTTP response errors
   */
  static parseHttpError(error, errorInfo) {
    const response = error.response;
    const status = response?.status;
    const data = response?.data;

    errorInfo.technical = {
      status,
      statusText: response?.statusText,
      url: response?.config?.url,
      method: response?.config?.method,
      data: data,
    };

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        return this.parse400Error(data, errorInfo);
      case 401:
        return this.parse401Error(data, errorInfo);
      case 403:
        return this.parse403Error(data, errorInfo);
      case 404:
        return this.parse404Error(data, errorInfo);
      case 422:
        return this.parse422Error(data, errorInfo);
      case 429:
        return this.parse429Error(data, errorInfo);
      case 500:
      case 502:
      case 503:
      case 504:
        return this.parse5xxError(status, data, errorInfo);
      default:
        return this.parseGenericHttpError(status, data, errorInfo);
    }
  }

  /**
   * Parse 400 Bad Request errors
   */
  static parse400Error(data, errorInfo) {
    errorInfo.type = ERROR_TYPES.VALIDATION;
    errorInfo.severity = ERROR_SEVERITY.MEDIUM;
    errorInfo.title = 'Invalid Request';
    
    if (data?.message) {
      errorInfo.message = this.humanizeErrorMessage(data.message);
    } else {
      errorInfo.message = 'The request contains invalid data. Please check your input.';
    }

    if (data?.errors) {
      errorInfo.fieldErrors = this.parseFieldErrors(data.errors);
      errorInfo.message = this.generateFieldErrorMessage(errorInfo.fieldErrors);
    }

    errorInfo.suggestions = [
      'Review the highlighted fields',
      'Ensure all required information is provided',
      'Check that data is in the correct format'
    ];

    return errorInfo;
  }

  /**
   * Parse 401 Unauthorized errors
   */
  static parse401Error(data, errorInfo) {
    errorInfo.type = ERROR_TYPES.AUTH;
    errorInfo.severity = ERROR_SEVERITY.HIGH;
    
    const message = data?.message?.toLowerCase() || '';
    
    if (message.includes('invalid') && (message.includes('credentials') || message.includes('password'))) {
      Object.assign(errorInfo, ERROR_PATTERNS.INVALID_CREDENTIALS);
    } else if (message.includes('token') && message.includes('expired')) {
      errorInfo.title = 'Session Expired';
      errorInfo.message = 'Your session has expired. Please sign in again.';
      errorInfo.suggestions = ['Sign in with your credentials', 'Enable "Remember Me" for longer sessions'];
    } else if (message.includes('email') && message.includes('verified')) {
      Object.assign(errorInfo, ERROR_PATTERNS.EMAIL_NOT_VERIFIED);
    } else {
      Object.assign(errorInfo, ERROR_PATTERNS.INVALID_CREDENTIALS);
    }

    return errorInfo;
  }

  /**
   * Parse 403 Forbidden errors
   */
  static parse403Error(data, errorInfo) {
    errorInfo.type = ERROR_TYPES.AUTH;
    errorInfo.severity = ERROR_SEVERITY.HIGH;
    
    const message = data?.message?.toLowerCase() || '';
    
    if (message.includes('subscription') || message.includes('premium')) {
      Object.assign(errorInfo, ERROR_PATTERNS.SUBSCRIPTION_REQUIRED);
    } else if (message.includes('locked') || message.includes('suspended')) {
      Object.assign(errorInfo, ERROR_PATTERNS.ACCOUNT_LOCKED);
    } else {
      Object.assign(errorInfo, ERROR_PATTERNS.INSUFFICIENT_PERMISSIONS);
    }

    return errorInfo;
  }

  /**
   * Parse 404 Not Found errors
   */
  static parse404Error(data, errorInfo) {
    errorInfo.type = ERROR_TYPES.SERVER;
    errorInfo.severity = ERROR_SEVERITY.MEDIUM;
    errorInfo.title = 'Not Found';
    errorInfo.message = 'The requested resource could not be found.';
    errorInfo.suggestions = [
      'Check if the URL is correct',
      'The resource may have been moved or deleted',
      'Contact support if you believe this is an error'
    ];
    return errorInfo;
  }

  /**
   * Parse 422 Validation errors
   */
  static parse422Error(data, errorInfo) {
    errorInfo.type = ERROR_TYPES.VALIDATION;
    errorInfo.severity = ERROR_SEVERITY.MEDIUM;
    
    if (data?.message?.toLowerCase().includes('email') && data?.message?.toLowerCase().includes('exists')) {
      Object.assign(errorInfo, ERROR_PATTERNS.EMAIL_ALREADY_EXISTS);
    } else if (data?.message?.toLowerCase().includes('password') && data?.message?.toLowerCase().includes('weak')) {
      Object.assign(errorInfo, ERROR_PATTERNS.WEAK_PASSWORD);
    } else {
      errorInfo.title = 'Validation Failed';
      errorInfo.message = data?.message || 'Some of the provided information is invalid.';
      
      if (data?.errors) {
        errorInfo.fieldErrors = this.parseFieldErrors(data.errors);
        errorInfo.message = this.generateFieldErrorMessage(errorInfo.fieldErrors);
      }
      
      errorInfo.suggestions = [
        'Check all required fields',
        'Ensure information meets the requirements',
        'Review any highlighted errors'
      ];
    }

    return errorInfo;
  }

  /**
   * Parse 429 Rate Limit errors
   */
  static parse429Error(data, errorInfo) {
    Object.assign(errorInfo, ERROR_PATTERNS.RATE_LIMIT_EXCEEDED);
    errorInfo.severity = ERROR_SEVERITY.MEDIUM;
    errorInfo.retryable = true;
    
    if (data?.retryAfter) {
      errorInfo.retryAfter = data.retryAfter;
      errorInfo.message = `You're making requests too quickly. Please wait ${data.retryAfter} seconds before trying again.`;
    }

    return errorInfo;
  }

  /**
   * Parse 5xx Server errors
   */
  static parse5xxError(status, data, errorInfo) {
    errorInfo.type = ERROR_TYPES.SERVER;
    errorInfo.severity = status >= 500 ? ERROR_SEVERITY.CRITICAL : ERROR_SEVERITY.HIGH;
    errorInfo.retryable = true;

    if (status === 503) {
      Object.assign(errorInfo, ERROR_PATTERNS.SERVICE_UNAVAILABLE);
    } else {
      Object.assign(errorInfo, ERROR_PATTERNS.INTERNAL_SERVER_ERROR);
    }

    return errorInfo;
  }

  /**
   * Parse field validation errors
   */
  static parseFieldErrors(errors) {
    const fieldErrors = {};

    if (Array.isArray(errors)) {
      errors.forEach(error => {
        if (error.field && error.message) {
          fieldErrors[error.field] = this.humanizeErrorMessage(error.message);
        }
      });
    } else if (typeof errors === 'object') {
      Object.keys(errors).forEach(field => {
        const error = errors[field];
        if (typeof error === 'string') {
          fieldErrors[field] = this.humanizeErrorMessage(error);
        } else if (Array.isArray(error) && error.length > 0) {
          fieldErrors[field] = this.humanizeErrorMessage(error[0]);
        }
      });
    }

    return fieldErrors;
  }

  /**
   * Generate user-friendly message from field errors
   */
  static generateFieldErrorMessage(fieldErrors) {
    const fields = Object.keys(fieldErrors);
    if (fields.length === 0) return 'Please check your input and try again.';
    
    if (fields.length === 1) {
      const field = fields[0];
      const fieldName = FIELD_MAPPINGS[field] || field;
      return `${fieldName}: ${fieldErrors[field]}`;
    }

    const fieldNames = fields.map(field => FIELD_MAPPINGS[field] || field);
    return `Please check the following fields: ${fieldNames.join(', ')}`;
  }

  /**
   * Make error messages more human-readable
   */
  static humanizeErrorMessage(message) {
    if (!message || typeof message !== 'string') return 'Invalid input';

    return message
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim();
  }

  /**
   * Parse network errors
   */
  static parseNetworkError(error, errorInfo) {
    errorInfo.type = ERROR_TYPES.NETWORK;
    errorInfo.severity = ERROR_SEVERITY.HIGH;
    errorInfo.retryable = true;

    if (error?.message?.includes('timeout')) {
      Object.assign(errorInfo, ERROR_PATTERNS.TIMEOUT);
    } else {
      Object.assign(errorInfo, ERROR_PATTERNS.NETWORK_REQUEST_FAILED);
    }

    return this.enhanceWithContext(errorInfo);
  }

  /**
   * Parse string errors
   */
  static parseStringError(error, errorInfo) {
    const errorStr = error.toLowerCase();
    
    for (const [pattern, config] of Object.entries(ERROR_PATTERNS)) {
      if (errorStr.includes(pattern.toLowerCase().replace(/_/g, ' '))) {
        Object.assign(errorInfo, config);
        return this.enhanceWithContext(errorInfo);
      }
    }

    errorInfo.message = this.humanizeErrorMessage(error);
    return this.enhanceWithContext(errorInfo);
  }

  /**
   * Parse errors with codes or types
   */
  static parseCodedError(error, errorInfo) {
    const code = error.code || error.type;
    const pattern = ERROR_PATTERNS[code];
    
    if (pattern) {
      Object.assign(errorInfo, pattern);
    } else {
      errorInfo.message = error.message || 'An error occurred with code: ' + code;
    }

    return errorInfo;
  }

  /**
   * Parse message-only errors
   */
  static parseMessageError(error, errorInfo) {
    // Check for BLONG-specific error patterns first
    const errorMessage = error.message;

    // Check if it's a known error pattern
    for (const [pattern, config] of Object.entries(ERROR_PATTERNS)) {
      if (errorMessage === pattern || errorMessage.includes(pattern)) {
        Object.assign(errorInfo, config);
        return this.enhanceWithContext(errorInfo);
      }
    }

    errorInfo.message = this.humanizeErrorMessage(errorMessage);

    // Try to categorize based on message content
    const message = errorMessage.toLowerCase();

    if (message.includes('network') || message.includes('connection')) {
      errorInfo.type = ERROR_TYPES.NETWORK;
      errorInfo.retryable = true;
    } else if (message.includes('unauthorized') || message.includes('forbidden')) {
      errorInfo.type = ERROR_TYPES.AUTH;
    } else if (message.includes('validation') || message.includes('invalid')) {
      errorInfo.type = ERROR_TYPES.VALIDATION;
    } else if (message.includes('server') || message.includes('internal')) {
      errorInfo.type = ERROR_TYPES.SERVER;
      errorInfo.retryable = true;
    }

    return this.enhanceWithContext(errorInfo);
  }

  /**
   * Parse generic HTTP errors
   */
  static parseGenericHttpError(status, data, errorInfo) {
    errorInfo.title = `HTTP ${status} Error`;
    errorInfo.message = data?.message || `The server returned an unexpected response (${status}).`;
    errorInfo.suggestions = [
      'Try again in a moment',
      'Contact support if the issue persists'
    ];
    
    if (status >= 500) {
      errorInfo.type = ERROR_TYPES.SERVER;
      errorInfo.severity = ERROR_SEVERITY.HIGH;
      errorInfo.retryable = true;
    } else if (status >= 400) {
      errorInfo.type = ERROR_TYPES.VALIDATION;
      errorInfo.severity = ERROR_SEVERITY.MEDIUM;
    }

    return errorInfo;
  }

  /**
   * Create fallback error when processing fails
   */
  static createFallbackError() {
    return {
      type: ERROR_TYPES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      title: 'Unexpected Error',
      message: 'Something went wrong. Please try again.',
      suggestions: ['Try again later', 'Restart the app if the issue persists'],
      retryable: true,
      technical: null,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
    };
  }

  /**
   * Get appropriate error modal configuration
   */
  static getModalConfig(processedError) {
    const baseConfig = {
      title: processedError.title,
      message: processedError.message,
      errorType: processedError.type,
      showRetry: processedError.retryable,
      showSupport: processedError.severity === ERROR_SEVERITY.CRITICAL,
    };

    // Add specific configurations based on error type
    switch (processedError.type) {
      case ERROR_TYPES.NETWORK:
        baseConfig.showRetry = true;
        baseConfig.customActions = [{
          label: 'Check Connection',
          icon: 'wifi',
          onPress: () => {
            // Could open network settings or show connection help
          }
        }];
        break;

      case ERROR_TYPES.AUTH:
        baseConfig.customActions = [{
          label: 'Sign In Again',
          icon: 'log-in',
          onPress: () => {
            // Navigate to sign in
          }
        }];
        break;

      case ERROR_TYPES.VALIDATION:
        baseConfig.showRetry = false;
        break;

      case ERROR_TYPES.SERVER:
        baseConfig.showSupport = true;
        baseConfig.showRetry = true;
        break;

      // BLONG-specific error types
      case ERROR_TYPES.QUIZ:
        baseConfig.customActions = [{
          label: 'Resume Quiz',
          icon: 'play-circle',
          onPress: () => {
            // Navigate to quiz resume
          }
        }];
        break;

      case ERROR_TYPES.VENUE:
        baseConfig.customActions = [{
          label: 'Browse Venues',
          icon: 'map-pin',
          onPress: () => {
            // Navigate to venue selection
          }
        }];
        break;

      case ERROR_TYPES.PAYMENT:
        baseConfig.customActions = [{
          label: 'Update Payment',
          icon: 'credit-card',
          onPress: () => {
            // Navigate to payment settings
          }
        }];
        break;

      case ERROR_TYPES.COMPATIBILITY:
        baseConfig.customActions = [{
          label: 'View Profile',
          icon: 'user',
          onPress: () => {
            // Navigate to profile completion
          }
        }];
        break;
    }

    // Add suggestions to the modal if available
    if (processedError.suggestions && processedError.suggestions.length > 0) {
      baseConfig.suggestions = processedError.suggestions;
    }

    // Add context information for debugging (in development)
    if (__DEV__ && processedError.context) {
      baseConfig.debugInfo = {
        operation: processedError.userAction,
        screen: processedError.screenName,
        timestamp: processedError.timestamp,
        platform: processedError.platform,
      };
    }

    return baseConfig;
  }

  /**
   * Learn from error patterns to improve future error handling
   */
  static learnFromError(processedError, userAction = null) {
    try {
      const errorPattern = {
        type: processedError.type,
        operation: processedError.userAction,
        screen: processedError.screenName,
        timestamp: processedError.timestamp,
        resolved: userAction === 'resolved',
        retrySuccessful: userAction === 'retry_successful',
        userFeedback: userAction === 'helpful' || userAction === 'not_helpful',
      };

      // Store error pattern for analytics (in a real app, this would go to analytics service)
      if (__DEV__) {
        console.log('📊 Error Pattern Learned:', errorPattern);
      }

      // In production, this would send to analytics service:
      // AnalyticsService.trackErrorPattern(errorPattern);

    } catch (error) {
      console.warn('Failed to learn from error pattern:', error);
    }
  }

  /**
   * Get personalized error suggestions based on user history
   */
  static getPersonalizedSuggestions(errorInfo, userContext = {}) {
    const suggestions = [...(errorInfo.suggestions || [])];

    // Add personalized suggestions based on user context
    if (userContext.isNewUser && errorInfo.type === ERROR_TYPES.VALIDATION) {
      suggestions.unshift('New to BLONG? Check our quick start guide for help');
    }

    if (userContext.hasRepeatedErrors && errorInfo.type === ERROR_TYPES.NETWORK) {
      suggestions.push('Having repeated connection issues? Try our offline mode');
    }

    if (userContext.preferredLanguage !== 'en' && errorInfo.type === ERROR_TYPES.VALIDATION) {
      suggestions.push('Need help in your language? Switch to your preferred language in settings');
    }

    return suggestions;
  }

  /**
   * Generate error report for support team
   */
  static generateErrorReport(processedError) {
    return {
      errorId: `BLONG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: processedError.timestamp,
      type: processedError.type,
      severity: processedError.severity,
      operation: processedError.userAction,
      screen: processedError.screenName,
      platform: processedError.platform,
      userAgent: Platform.OS === 'web' ? navigator.userAgent : `${Platform.OS} ${Platform.Version}`,
      errorDetails: {
        title: processedError.title,
        message: processedError.message,
        technical: processedError.technical,
        context: processedError.context,
      },
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version,
        // Add more device info as needed
      }
    };
  }
}

export default ErrorProcessingService;