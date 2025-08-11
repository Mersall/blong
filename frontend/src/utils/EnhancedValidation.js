/**
 * BLONG Enhanced Validation System
 * Real-time validation with smart error handling and user feedback
 */

import * as Haptics from 'expo-haptics';
import { a11y } from './AccessibilityUtils';

// Validation rule types
const VALIDATION_TYPES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PASSWORD: 'password',
  PHONE: 'phone',
  DATE: 'date',
  NUMBER: 'number',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern',
  CUSTOM: 'custom',
};

// Common validation patterns
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  alpha: /^[a-zA-Z]+$/,
};

// Error messages
const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
  phone: 'Please enter a valid phone number',
  minLength: (min) => `Must be at least ${min} characters long`,
  maxLength: (max) => `Must be no more than ${max} characters long`,
  pattern: 'Please enter a valid format',
  date: 'Please enter a valid date',
  number: 'Please enter a valid number',
  custom: 'Invalid input',
};

// Validation severity levels
const VALIDATION_SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
};

class EnhancedValidator {
  constructor() {
    this.rules = new Map();
    this.customMessages = new Map();
    this.debounceTimers = new Map();
  }

  // Add validation rule for a field
  addRule(fieldName, rule) {
    if (!this.rules.has(fieldName)) {
      this.rules.set(fieldName, []);
    }
    this.rules.get(fieldName).push(rule);
    return this; // Enable chaining
  }

  // Set custom error message for a field
  setMessage(fieldName, ruleType, message) {
    const key = `${fieldName}.${ruleType}`;
    this.customMessages.set(key, message);
    return this;
  }

  // Validate a single field
  validateField(fieldName, value, options = {}) {
    const rules = this.rules.get(fieldName) || [];
    const results = [];

    for (const rule of rules) {
      const result = this.executeRule(fieldName, value, rule, options);
      if (result) {
        results.push(result);
        // Stop on first error unless specified otherwise
        if (result.severity === VALIDATION_SEVERITY.ERROR && !options.continueOnError) {
          break;
        }
      }
    }

    return {
      isValid: results.length === 0 || results.every(r => r.severity !== VALIDATION_SEVERITY.ERROR),
      results,
      hasErrors: results.some(r => r.severity === VALIDATION_SEVERITY.ERROR),
      hasWarnings: results.some(r => r.severity === VALIDATION_SEVERITY.WARNING),
      messages: results.map(r => r.message),
      errorMessage: results.find(r => r.severity === VALIDATION_SEVERITY.ERROR)?.message,
    };
  }

  // Execute a single validation rule
  executeRule(fieldName, value, rule, options) {
    const { type, severity = VALIDATION_SEVERITY.ERROR, ...params } = rule;

    // Skip validation if value is empty and rule is not required
    if ((value === null || value === undefined || value === '') && type !== VALIDATION_TYPES.REQUIRED) {
      return null;
    }

    let isValid = true;
    let message = '';

    switch (type) {
      case VALIDATION_TYPES.REQUIRED:
        isValid = value !== null && value !== undefined && value !== '';
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.required;
        break;

      case VALIDATION_TYPES.EMAIL:
        isValid = PATTERNS.email.test(value);
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.email;
        break;

      case VALIDATION_TYPES.PASSWORD:
        isValid = value.length >= 8 && PATTERNS.password.test(value);
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.password;
        break;

      case VALIDATION_TYPES.PHONE:
        isValid = PATTERNS.phone.test(value.replace(/\s/g, ''));
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.phone;
        break;

      case VALIDATION_TYPES.DATE:
        const date = new Date(value);
        isValid = !isNaN(date.getTime());
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.date;
        break;

      case VALIDATION_TYPES.NUMBER:
        isValid = !isNaN(Number(value)) && isFinite(Number(value));
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.number;
        break;

      case VALIDATION_TYPES.MIN_LENGTH:
        isValid = value.length >= params.min;
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.minLength(params.min);
        break;

      case VALIDATION_TYPES.MAX_LENGTH:
        isValid = value.length <= params.max;
        message = this.getMessage(fieldName, type) || ERROR_MESSAGES.maxLength(params.max);
        break;

      case VALIDATION_TYPES.PATTERN:
        const pattern = typeof params.pattern === 'string' ? new RegExp(params.pattern) : params.pattern;
        isValid = pattern.test(value);
        message = this.getMessage(fieldName, type) || params.message || ERROR_MESSAGES.pattern;
        break;

      case VALIDATION_TYPES.CUSTOM:
        const result = params.validator(value, options);
        if (typeof result === 'boolean') {
          isValid = result;
          message = this.getMessage(fieldName, type) || params.message || ERROR_MESSAGES.custom;
        } else {
          isValid = result.isValid;
          message = result.message || this.getMessage(fieldName, type) || ERROR_MESSAGES.custom;
        }
        break;

      default:
        console.warn(`Unknown validation type: ${type}`);
        return null;
    }

    return isValid ? null : { type, severity, message, fieldName };
  }

  // Get custom message or default
  getMessage(fieldName, ruleType) {
    return this.customMessages.get(`${fieldName}.${ruleType}`);
  }

  // Validate multiple fields
  validateFields(fieldsData, options = {}) {
    const results = {};
    let hasErrors = false;
    let hasWarnings = false;

    for (const [fieldName, value] of Object.entries(fieldsData)) {
      const result = this.validateField(fieldName, value, options);
      results[fieldName] = result;
      
      if (result.hasErrors) {
        hasErrors = true;
      }
      if (result.hasWarnings) {
        hasWarnings = true;
      }
    }

    return {
      isValid: !hasErrors,
      hasErrors,
      hasWarnings,
      fields: results,
      firstError: Object.values(results).find(r => r.hasErrors)?.errorMessage,
    };
  }

  // Real-time validation with debouncing
  validateRealTime(fieldName, value, callback, debounceMs = 300, options = {}) {
    // Clear existing timer
    if (this.debounceTimers.has(fieldName)) {
      clearTimeout(this.debounceTimers.get(fieldName));
    }

    // Set new timer
    const timer = setTimeout(() => {
      const result = this.validateField(fieldName, value, options);
      
      // Provide haptic feedback for errors
      if (result.hasErrors && options.hapticFeedback !== false) {
        this.provideHapticFeedback(VALIDATION_SEVERITY.ERROR);
      } else if (result.hasWarnings && options.hapticFeedback !== false) {
        this.provideHapticFeedback(VALIDATION_SEVERITY.WARNING);
      }

      // Announce to screen reader if needed
      if (result.hasErrors && options.announceErrors !== false) {
        a11y.focusManagement.announce(result.errorMessage, 'assertive');
      }

      callback(result);
      this.debounceTimers.delete(fieldName);
    }, debounceMs);

    this.debounceTimers.set(fieldName, timer);
  }

  // Provide haptic feedback based on validation result
  provideHapticFeedback(severity) {
    if (!Haptics?.impactAsync && !Haptics?.notificationAsync) return;

    switch (severity) {
      case VALIDATION_SEVERITY.ERROR:
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Error);
        break;
      case VALIDATION_SEVERITY.WARNING:
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Warning);
        break;
      case VALIDATION_SEVERITY.SUCCESS:
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Success);
        break;
      default:
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  // Clear all timers
  clearTimers() {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}

// Common validation rule builders
export const Rules = {
  required: (message) => ({ 
    type: VALIDATION_TYPES.REQUIRED, 
    ...(message && { message }) 
  }),
  
  email: (message) => ({ 
    type: VALIDATION_TYPES.EMAIL, 
    ...(message && { message }) 
  }),
  
  password: (message) => ({ 
    type: VALIDATION_TYPES.PASSWORD, 
    ...(message && { message }) 
  }),
  
  phone: (message) => ({ 
    type: VALIDATION_TYPES.PHONE, 
    ...(message && { message }) 
  }),
  
  minLength: (min, message) => ({ 
    type: VALIDATION_TYPES.MIN_LENGTH, 
    min,
    ...(message && { message }) 
  }),
  
  maxLength: (max, message) => ({ 
    type: VALIDATION_TYPES.MAX_LENGTH, 
    max,
    ...(message && { message }) 
  }),
  
  pattern: (pattern, message) => ({ 
    type: VALIDATION_TYPES.PATTERN, 
    pattern,
    message: message || 'Invalid format'
  }),
  
  number: (message) => ({ 
    type: VALIDATION_TYPES.NUMBER, 
    ...(message && { message }) 
  }),
  
  date: (message) => ({ 
    type: VALIDATION_TYPES.DATE, 
    ...(message && { message }) 
  }),
  
  custom: (validator, message) => ({ 
    type: VALIDATION_TYPES.CUSTOM, 
    validator,
    message: message || 'Custom validation failed'
  }),

  // Age validation
  age: (minAge = 18, maxAge = 100, message) => ({
    type: VALIDATION_TYPES.CUSTOM,
    validator: (value) => {
      const birthDate = new Date(value);
      const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= minAge && age <= maxAge;
    },
    message: message || `Age must be between ${minAge} and ${maxAge} years`
  }),

  // Height validation
  height: (minHeight = 100, maxHeight = 250, message) => ({
    type: VALIDATION_TYPES.CUSTOM,
    validator: (value) => {
      const height = Number(value);
      return height >= minHeight && height <= maxHeight;
    },
    message: message || `Height must be between ${minHeight} and ${maxHeight} cm`
  }),

  // Weight validation
  weight: (minWeight = 30, maxWeight = 300, message) => ({
    type: VALIDATION_TYPES.CUSTOM,
    validator: (value) => {
      const weight = Number(value);
      return weight >= minWeight && weight <= maxWeight;
    },
    message: message || `Weight must be between ${minWeight} and ${maxWeight} kg`
  }),
};

// Export types and constants
export { 
  VALIDATION_TYPES, 
  VALIDATION_SEVERITY, 
  EnhancedValidator,
  ERROR_MESSAGES,
  PATTERNS
};

// Create default validator instance
export const validator = new EnhancedValidator();

// Export default validator for convenience
export default validator;