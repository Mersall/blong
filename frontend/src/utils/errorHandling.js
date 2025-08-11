/**
 * BLONG Elite Error Handling System
 * Sophisticated error management with premium user feedback
 */

// Error types for different scenarios
export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  SERVER: 'server',
  AUTH: 'authentication',
  UNKNOWN: 'unknown',
  // BLONG-specific error types
  SESSION: 'session',
  BUSINESS: 'business',
  PAYMENT: 'payment',
  COMPATIBILITY: 'compatibility',
  VENUE: 'venue',
  QUIZ: 'quiz',
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Classify error based on response and context
 */
export const classifyError = (error) => {
  if (!error) {
    return {
      type: ERROR_TYPES.UNKNOWN,
      severity: ERROR_SEVERITY.LOW,
      code: 'UNKNOWN_ERROR',
    };
  }

  // Network errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return {
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      code: 'NETWORK_ERROR',
    };
  }

  // HTTP status-based classification
  if (error.response) {
    const status = error.response.status;
    
    if (status >= 400 && status < 500) {
      if (status === 401 || status === 403) {
        return {
          type: ERROR_TYPES.AUTH,
          severity: ERROR_SEVERITY.HIGH,
          code: `AUTH_${status}`,
        };
      }
      
      if (status === 422 || status === 400) {
        return {
          type: ERROR_TYPES.VALIDATION,
          severity: ERROR_SEVERITY.MEDIUM,
          code: `VALIDATION_${status}`,
        };
      }
      
      return {
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.MEDIUM,
        code: `CLIENT_${status}`,
      };
    }
    
    if (status >= 500) {
      return {
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.CRITICAL,
        code: `SERVER_${status}`,
      };
    }
  }

  return {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Generate user-friendly error messages
 */
export const getErrorMessage = (error, t) => {
  // Handle AuthError instances from our auth service
  if (error?.type) {
    switch (error.type) {
      case 'AUTH_ERROR':
        return {
          title: t('errors.auth.invalidCredentials.title') || 'Authentication Failed',
          message: error.message || t('errors.auth.invalidCredentials.message') || 'Invalid credentials',
          action: t('common.ok') || 'OK',
          icon: '🔐',
        };

      case 'VALIDATION_ERROR':
        return {
          title: t('errors.validation.title') || 'Validation Error',
          message: error.message || t('errors.validation.message') || 'Please check your input',
          action: t('common.ok') || 'OK',
          icon: '⚠️',
        };

      case 'NETWORK_ERROR':
        return {
          title: t('errors.network.title') || 'Connection Error',
          message: t('errors.network.message') || 'Please check your internet connection',
          action: t('common.tryAgain') || 'Try Again',
          icon: '🌐',
        };

      case 'TIMEOUT_ERROR':
        return {
          title: t('errors.timeout.title') || 'Request Timeout',
          message: t('errors.timeout.message') || 'The request took too long',
          action: t('common.tryAgain') || 'Try Again',
          icon: '⏱️',
        };

      case 'SERVER_ERROR':
        return {
          title: t('errors.server.title') || 'Server Error',
          message: t('errors.server.message') || 'Our servers are experiencing issues',
          action: t('common.tryAgain') || 'Try Again',
          icon: '🔧',
        };
    }
  }

  const classification = classifyError(error);

  // Try to get specific error message from response
  const serverMessage = error?.response?.data?.message ||
                       error?.response?.data?.error ||
                       error?.message;

  switch (classification.type) {
    case ERROR_TYPES.NETWORK:
      return {
        title: t('errors.network.title'),
        message: t('errors.network.message'),
        action: t('errors.network.action'),
        icon: '🌐',
      };
      
    case ERROR_TYPES.AUTH:
      if (error?.response?.status === 401) {
        return {
          title: t('errors.auth.invalidCredentials.title'),
          message: t('errors.auth.invalidCredentials.message'),
          action: t('errors.auth.invalidCredentials.action'),
          icon: '🔐',
        };
      }
      return {
        title: t('errors.auth.general.title'),
        message: serverMessage || t('errors.auth.general.message'),
        action: t('errors.auth.general.action'),
        icon: '🔐',
      };
      
    case ERROR_TYPES.VALIDATION:
      return {
        title: t('errors.validation.title'),
        message: serverMessage || t('errors.validation.message'),
        action: t('errors.validation.action'),
        icon: '⚠️',
      };
      
    case ERROR_TYPES.SERVER:
      if (classification.severity === ERROR_SEVERITY.CRITICAL) {
        return {
          title: t('errors.server.critical.title'),
          message: t('errors.server.critical.message'),
          action: t('errors.server.critical.action'),
          icon: '🚨',
        };
      }
      return {
        title: t('errors.server.general.title'),
        message: serverMessage || t('errors.server.general.message'),
        action: t('errors.server.general.action'),
        icon: '⚡',
      };
      
    default:
      return {
        title: t('errors.unknown.title'),
        message: serverMessage || t('errors.unknown.message'),
        action: t('errors.unknown.action'),
        icon: '❓',
      };
  }
};

/**
 * Validation helpers for forms
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

export const validateName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
};

/**
 * Form validation for authentication
 */
export const validateAuthForm = (formData, mode, t) => {
  const errors = {};
  
  // Email validation
  if (!formData.email) {
    errors.email = t('validation.email.required');
  } else if (!validateEmail(formData.email)) {
    errors.email = t('validation.email.invalid');
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = t('validation.password.required');
  } else {
    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.isValid) {
      errors.password = t('validation.password.minLength');
    }
  }
  
  // Registration-specific validation
  if (mode === 'register') {
    if (!formData.firstName) {
      errors.firstName = t('validation.firstName.required');
    } else if (!validateName(formData.firstName)) {
      errors.firstName = t('validation.firstName.invalid');
    }
    
    if (!formData.lastName) {
      errors.lastName = t('validation.lastName.required');
    } else if (!validateName(formData.lastName)) {
      errors.lastName = t('validation.lastName.invalid');
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('validation.confirmPassword.required');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.confirmPassword.mismatch');
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Retry logic for failed requests
 */
export const createRetryConfig = (maxRetries = 3, baseDelay = 1000) => ({
  retry: (failureCount, error) => {
    const classification = classifyError(error);
    
    // Don't retry validation or auth errors
    if (classification.type === ERROR_TYPES.VALIDATION || 
        classification.type === ERROR_TYPES.AUTH) {
      return false;
    }
    
    return failureCount < maxRetries;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

export default {
  ERROR_TYPES,
  ERROR_SEVERITY,
  classifyError,
  getErrorMessage,
  validateAuthForm,
  createRetryConfig,
};
