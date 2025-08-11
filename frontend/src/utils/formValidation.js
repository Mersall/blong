/**
 * BLONG Form Validation Utilities
 * Advanced form validation with password strength and elegant error handling
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength criteria - Updated to match backend requirements
const PASSWORD_CRITERIA = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true, // Backend requires special characters
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) {
    return { 
      isValid: false, 
      message: 'Password is required',
      strength: 'none'
    };
  }
  
  const issues = [];
  let strength = 'weak';
  let score = 0;
  
  // Check length
  if (password.length < PASSWORD_CRITERIA.minLength) {
    issues.push(`At least ${PASSWORD_CRITERIA.minLength} characters`);
  } else {
    score += 1;
  }
  
  // Check uppercase
  if (PASSWORD_CRITERIA.requireUppercase && !/[A-Z]/.test(password)) {
    issues.push('One uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }
  
  // Check lowercase
  if (PASSWORD_CRITERIA.requireLowercase && !/[a-z]/.test(password)) {
    issues.push('One lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }
  
  // Check numbers
  if (PASSWORD_CRITERIA.requireNumbers && !/\d/.test(password)) {
    issues.push('One number');
  } else if (/\d/.test(password)) {
    score += 1;
  }
  
  // Check special characters (optional)
  if (PASSWORD_CRITERIA.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('One special character');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }
  
  // Determine strength
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }
  
  const isValid = issues.length === 0;
  const message = issues.length > 0 ? `Password needs: ${issues.join(', ')}` : '';
  
  return {
    isValid,
    message,
    strength,
    score,
  };
};

/**
 * Validate name fields
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: `${fieldName} must be less than 50 characters` };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

/**
 * Validate confirm password
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

/**
 * Comprehensive form validation for authentication
 */
export const validateAuthForm = (formData, authMode, t) => {
  const errors = {};
  let isValid = true;
  
  // Email validation
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
    isValid = false;
  }
  
  // Password validation
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
    isValid = false;
  }
  
  // Registration-specific validations
  if (authMode === 'register') {
    // First name validation
    const firstNameValidation = validateName(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.message;
      isValid = false;
    }
    
    // Last name validation
    const lastNameValidation = validateName(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.message;
      isValid = false;
    }
    
    // Confirm password validation (if provided)
    if (formData.confirmPassword !== undefined) {
      const confirmPasswordValidation = validateConfirmPassword(
        formData.password, 
        formData.confirmPassword
      );
      if (!confirmPasswordValidation.isValid) {
        errors.confirmPassword = confirmPasswordValidation.message;
        isValid = false;
      }
    }
  }
  
  return {
    isValid,
    errors,
    passwordStrength: passwordValidation.strength,
  };
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'strong':
      return '#10B981'; // Green
    case 'medium':
      return '#F59E0B'; // Yellow
    case 'weak':
      return '#EF4444'; // Red
    default:
      return '#9CA3AF'; // Gray
  }
};

/**
 * Get password strength text
 */
export const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 'strong':
      return 'Strong password';
    case 'medium':
      return 'Good password';
    case 'weak':
      return 'Weak password';
    default:
      return '';
  }
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  validateAuthForm,
  getPasswordStrengthColor,
  getPasswordStrengthText,
};
