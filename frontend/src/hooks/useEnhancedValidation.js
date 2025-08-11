/**
 * BLONG Enhanced Validation Hook
 * React hook for real-time form validation with enhanced UX
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { EnhancedValidator, Rules, VALIDATION_SEVERITY } from '../utils/EnhancedValidation';

const useEnhancedValidation = (initialValues = {}, validationRules = {}, options = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validatorRef = useRef(new EnhancedValidator());
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounceTime = 300,
    hapticFeedback = true,
    announceErrors = true,
    continueOnError = false,
  } = options;

  // Initialize validation rules
  useEffect(() => {
    const validator = validatorRef.current;
    validator.clearTimers();

    // Clear existing rules
    validator.rules.clear();
    validator.customMessages.clear();

    // Add new rules
    Object.entries(validationRules).forEach(([fieldName, fieldRules]) => {
      if (Array.isArray(fieldRules)) {
        fieldRules.forEach(rule => validator.addRule(fieldName, rule));
      } else {
        validator.addRule(fieldName, fieldRules);
      }
    });

    return () => {
      validator.clearTimers();
    };
  }, [validationRules]);

  // Update field value and optionally validate
  const setValue = useCallback((fieldName, value, options = {}) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));

    if (validateOnChange && !options.skipValidation) {
      validateField(fieldName, value, { ...options, realTime: true });
    }
  }, [validateOnChange]);

  // Update multiple values
  const setValues = useCallback((newValues, options = {}) => {
    setValues(prev => ({ ...prev, ...newValues }));

    if (validateOnChange && !options.skipValidation) {
      Object.entries(newValues).forEach(([fieldName, value]) => {
        validateField(fieldName, value, { ...options, realTime: true });
      });
    }
  }, [validateOnChange]);

  // Mark field as touched
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }));

    if (validateOnBlur && isTouched && values[fieldName] !== undefined) {
      validateField(fieldName, values[fieldName]);
    }
  }, [validateOnBlur, values]);

  // Validate a single field
  const validateField = useCallback((fieldName, value, options = {}) => {
    const validator = validatorRef.current;
    const {
      realTime = false,
      showFeedback = hapticFeedback,
      announce = announceErrors,
    } = options;

    const validate = (val) => {
      setIsValidating(prev => ({ ...prev, [fieldName]: true }));

      const result = validator.validateField(fieldName, val, {
        continueOnError,
        hapticFeedback: showFeedback,
        announceErrors: announce,
      });

      // Update error state
      setErrors(prev => ({
        ...prev,
        [fieldName]: result.hasErrors ? result.errorMessage : undefined
      }));

      // Update warning state
      setWarnings(prev => ({
        ...prev,
        [fieldName]: result.hasWarnings ? result.results.find(r => r.severity === VALIDATION_SEVERITY.WARNING)?.message : undefined
      }));

      setIsValidating(prev => ({ ...prev, [fieldName]: false }));

      return result;
    };

    if (realTime && debounceTime > 0) {
      validator.validateRealTime(fieldName, value, validate, debounceTime, {
        hapticFeedback: showFeedback,
        announceErrors: announce,
      });
    } else {
      return validate(value);
    }
  }, [continueOnError, hapticFeedback, announceErrors, debounceTime]);

  // Validate all fields
  const validateAll = useCallback((valuesToValidate = values) => {
    const validator = validatorRef.current;
    const result = validator.validateFields(valuesToValidate, {
      continueOnError: true,
      hapticFeedback: false, // Don't provide feedback for bulk validation
      announceErrors: false,
    });

    // Update all error and warning states
    const newErrors = {};
    const newWarnings = {};

    Object.entries(result.fields).forEach(([fieldName, fieldResult]) => {
      if (fieldResult.hasErrors) {
        newErrors[fieldName] = fieldResult.errorMessage;
      }
      if (fieldResult.hasWarnings) {
        newWarnings[fieldName] = fieldResult.results.find(r => r.severity === VALIDATION_SEVERITY.WARNING)?.message;
      }
    });

    setErrors(newErrors);
    setWarnings(newWarnings);

    return result;
  }, [values]);

  // Clear error for a field
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
    setWarnings({});
  }, []);

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setWarnings({});
    setTouched({});
    setIsValidating({});
    setIsSubmitting(false);
    validatorRef.current.clearTimers();
  }, [initialValues]);

  // Submit handler with validation
  const handleSubmit = useCallback(async (onSubmit, options = {}) => {
    const {
      validateBeforeSubmit = true,
      touchAllFields = true,
    } = options;

    setIsSubmitting(true);

    try {
      // Touch all fields if requested
      if (touchAllFields) {
        const allFields = Object.keys(validationRules);
        setTouched(prev => {
          const newTouched = { ...prev };
          allFields.forEach(field => {
            newTouched[field] = true;
          });
          return newTouched;
        });
      }

      // Validate before submit if requested
      if (validateBeforeSubmit) {
        const validationResult = validateAll();
        if (!validationResult.isValid) {
          // Announce first error to screen reader
          if (validationResult.firstError && announceErrors) {
            validatorRef.current.provideHapticFeedback(VALIDATION_SEVERITY.ERROR);
          }
          return { success: false, errors: validationResult.fields };
        }
      }

      // Call submit handler
      const result = await onSubmit(values);
      
      // Provide success feedback
      if (hapticFeedback) {
        validatorRef.current.provideHapticFeedback(VALIDATION_SEVERITY.SUCCESS);
      }

      return { success: true, result };
    } catch (error) {
      console.error('Submit error:', error);
      
      // Provide error feedback
      if (hapticFeedback) {
        validatorRef.current.provideHapticFeedback(VALIDATION_SEVERITY.ERROR);
      }

      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, validateAll, announceErrors, hapticFeedback]);

  // Get field props for inputs
  const getFieldProps = useCallback((fieldName, options = {}) => {
    const {
      validateOnChange: fieldValidateOnChange = validateOnChange,
      validateOnBlur: fieldValidateOnBlur = validateOnBlur,
    } = options;

    return {
      value: values[fieldName] || '',
      error: touched[fieldName] && errors[fieldName],
      warning: touched[fieldName] && warnings[fieldName],
      onChangeText: (value) => {
        setValue(fieldName, value, { skipValidation: !fieldValidateOnChange });
      },
      onBlur: () => {
        setFieldTouched(fieldName, true);
      },
      onFocus: () => {
        // Clear error when field gains focus
        if (errors[fieldName]) {
          clearFieldError(fieldName);
        }
      },
    };
  }, [values, touched, errors, warnings, setValue, setFieldTouched, clearFieldError, validateOnChange, validateOnBlur]);

  // Get validation state
  const getValidationState = useCallback(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const hasWarnings = Object.keys(warnings).length > 0;
    const isValid = !hasErrors;
    const hasValidatingFields = Object.values(isValidating).some(Boolean);

    return {
      isValid,
      hasErrors,
      hasWarnings,
      isValidating: hasValidatingFields,
      isSubmitting,
      errors,
      warnings,
      touched,
    };
  }, [errors, warnings, isValidating, isSubmitting, touched]);

  return {
    // Values
    values,
    setValue,
    setValues,
    
    // Validation
    validateField,
    validateAll,
    clearFieldError,
    clearErrors,
    
    // State
    errors,
    warnings,
    touched,
    setFieldTouched,
    isSubmitting,
    
    // Helpers
    getFieldProps,
    getValidationState,
    handleSubmit,
    reset,
  };
};

export default useEnhancedValidation;