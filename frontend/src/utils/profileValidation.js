/**
 * BLONG Profile Validation System
 * Unified validation schema and utilities for profile management
 */

// Validation constants aligned with backend
export const VALIDATION_CONSTANTS = {
  age: {
    min: 18,
    max: 100
  },
  height: {
    min: 100, // cm
    max: 250  // cm
  },
  weight: {
    min: 30,  // kg
    max: 300  // kg
  },
  bio: {
    min: 10,
    max: 500
  },
  occupation: {
    min: 2,
    max: 100
  },
  interests: {
    max: 10
  },
  languages: {
    max: 5
  },
  photos: {
    max: 6,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
};

// Gender options aligned with backend enum - Enhanced for inclusivity
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' }
];

// Marital status options aligned with backend enum
export const MARITAL_STATUS_OPTIONS = [
  { value: 'NEVER_MARRIED', label: 'Never Married' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'WIDOWED', label: 'Widowed' }
];

// Lifestyle choice options aligned with backend enum
export const LIFESTYLE_OPTIONS = [
  { value: 'NEVER', label: 'Never' },
  { value: 'OCCASIONALLY', label: 'Occasionally' },
  { value: 'REGULARLY', label: 'Regularly' }
];

// Education options
export const EDUCATION_OPTIONS = [
  { value: 'high-school', label: 'High School' },
  { value: 'some-college', label: 'Some College' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'trade-school', label: 'Trade School' },
  { value: 'other', label: 'Other' }
];

// Interest options
export const INTEREST_OPTIONS = [
  { value: 'travel', label: 'Travel' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'music', label: 'Music' },
  { value: 'movies', label: 'Movies' },
  { value: 'reading', label: 'Reading' },
  { value: 'sports', label: 'Sports' },
  { value: 'art', label: 'Art' },
  { value: 'technology', label: 'Technology' },
  { value: 'nature', label: 'Nature' },
  { value: 'photography', label: 'Photography' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'volunteer', label: 'Volunteering' }
];

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'arabic', label: 'Arabic' },
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'russian', label: 'Russian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' }
];

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(field, message, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Date validation utilities
 */
export const dateValidation = {
  /**
   * Check if date makes user at least 18 years old
   */
  isValidAge: (dateOfBirth) => {
    if (!dateOfBirth) return false;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    if (isNaN(birthDate.getTime())) return false;
    
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    return actualAge >= VALIDATION_CONSTANTS.age.min && actualAge <= VALIDATION_CONSTANTS.age.max;
  },

  /**
   * Get minimum allowed birth date (18 years ago)
   */
  getMinBirthDate: () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - VALIDATION_CONSTANTS.age.max);
    return date;
  },

  /**
   * Get maximum allowed birth date (100 years ago)
   */
  getMaxBirthDate: () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - VALIDATION_CONSTANTS.age.min);
    return date;
  },

  /**
   * Format date for backend (YYYY-MM-DD)
   */
  formatForBackend: (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  }
};

/**
 * Field validation functions
 */
export const fieldValidators = {
  /**
   * Validate required field
   */
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      throw new ValidationError(fieldName, `${fieldName} is required`, value);
    }
    return true;
  },

  /**
   * Validate date of birth
   */
  dateOfBirth: (value) => {
    if (!value) {
      throw new ValidationError('dateOfBirth', 'Date of birth is required');
    }
    
    if (!dateValidation.isValidAge(value)) {
      throw new ValidationError('dateOfBirth', `You must be between ${VALIDATION_CONSTANTS.age.min} and ${VALIDATION_CONSTANTS.age.max} years old`);
    }
    
    return true;
  },

  /**
   * Validate gender
   */
  gender: (value) => {
    if (!value) {
      throw new ValidationError('gender', 'Gender is required');
    }
    
    const validGenders = GENDER_OPTIONS.map(g => g.value);
    if (!validGenders.includes(value.toUpperCase())) {
      throw new ValidationError('gender', 'Please select a valid gender');
    }
    
    return true;
  },

  /**
   * Validate height
   */
  height: (value) => {
    if (!value) return true; // Optional field
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      throw new ValidationError('height', 'Height must be a number');
    }
    
    if (numValue < VALIDATION_CONSTANTS.height.min || numValue > VALIDATION_CONSTANTS.height.max) {
      throw new ValidationError('height', `Height must be between ${VALIDATION_CONSTANTS.height.min} and ${VALIDATION_CONSTANTS.height.max} cm`);
    }
    
    return true;
  },

  /**
   * Validate weight
   */
  weight: (value) => {
    if (!value) return true; // Optional field
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      throw new ValidationError('weight', 'Weight must be a number');
    }
    
    if (numValue < VALIDATION_CONSTANTS.weight.min || numValue > VALIDATION_CONSTANTS.weight.max) {
      throw new ValidationError('weight', `Weight must be between ${VALIDATION_CONSTANTS.weight.min} and ${VALIDATION_CONSTANTS.weight.max} kg`);
    }
    
    return true;
  },

  /**
   * Validate occupation
   */
  occupation: (value) => {
    if (!value) return true; // Optional field
    
    const trimmed = value.trim();
    if (trimmed.length < VALIDATION_CONSTANTS.occupation.min) {
      throw new ValidationError('occupation', `Occupation must be at least ${VALIDATION_CONSTANTS.occupation.min} characters`);
    }
    
    if (trimmed.length > VALIDATION_CONSTANTS.occupation.max) {
      throw new ValidationError('occupation', `Occupation must be less than ${VALIDATION_CONSTANTS.occupation.max} characters`);
    }
    
    return true;
  },

  /**
   * Validate bio
   */
  bio: (value) => {
    if (!value) return true; // Optional field
    
    const trimmed = value.trim();
    if (trimmed.length < VALIDATION_CONSTANTS.bio.min) {
      throw new ValidationError('bio', `Bio must be at least ${VALIDATION_CONSTANTS.bio.min} characters`);
    }
    
    if (trimmed.length > VALIDATION_CONSTANTS.bio.max) {
      throw new ValidationError('bio', `Bio must be less than ${VALIDATION_CONSTANTS.bio.max} characters`);
    }
    
    return true;
  },

  /**
   * Validate location
   */
  location: (value) => {
    if (!value || typeof value !== 'object') {
      throw new ValidationError('location', 'Location is required');
    }
    
    if (!value.country || !value.country.trim()) {
      throw new ValidationError('location.country', 'Country is required');
    }
    
    if (!value.city || !value.city.trim()) {
      throw new ValidationError('location.city', 'City is required');
    }
    
    return true;
  },

  /**
   * Validate interests array
   */
  interests: (value) => {
    if (!value) return true; // Optional field
    
    if (!Array.isArray(value)) {
      throw new ValidationError('interests', 'Interests must be an array');
    }
    
    if (value.length > VALIDATION_CONSTANTS.interests.max) {
      throw new ValidationError('interests', `You can select up to ${VALIDATION_CONSTANTS.interests.max} interests`);
    }
    
    const validInterests = INTEREST_OPTIONS.map(i => i.value);
    const invalidInterests = value.filter(interest => !validInterests.includes(interest));
    
    if (invalidInterests.length > 0) {
      throw new ValidationError('interests', `Invalid interests: ${invalidInterests.join(', ')}`);
    }
    
    return true;
  },

  /**
   * Validate languages array
   */
  languages: (value) => {
    if (!value) return true; // Optional field
    
    if (!Array.isArray(value)) {
      throw new ValidationError('languages', 'Languages must be an array');
    }
    
    if (value.length > VALIDATION_CONSTANTS.languages.max) {
      throw new ValidationError('languages', `You can select up to ${VALIDATION_CONSTANTS.languages.max} languages`);
    }
    
    const validLanguages = LANGUAGE_OPTIONS.map(l => l.value);
    const invalidLanguages = value.filter(language => !validLanguages.includes(language));
    
    if (invalidLanguages.length > 0) {
      throw new ValidationError('languages', `Invalid languages: ${invalidLanguages.join(', ')}`);
    }
    
    return true;
  },

  /**
   * Validate marital status
   */
  maritalStatus: (value) => {
    if (!value) return true; // Optional for some steps
    
    const validStatuses = MARITAL_STATUS_OPTIONS.map(s => s.value);
    if (!validStatuses.includes(value)) {
      throw new ValidationError('maritalStatus', 'Please select a valid marital status');
    }
    
    return true;
  },

  /**
   * Validate yes/no fields
   */
  yesNo: (value, fieldName) => {
    if (!value) return true; // Optional for some steps
    
    const validValues = ['yes', 'no'];
    if (!validValues.includes(value.toLowerCase())) {
      throw new ValidationError(fieldName, `${fieldName} must be yes or no`);
    }
    
    return true;
  },

  /**
   * Validate lifestyle choices
   */
  lifestyle: (value, fieldName) => {
    if (!value) return true; // Optional field
    
    const validChoices = LIFESTYLE_OPTIONS.map(l => l.value);
    if (!validChoices.includes(value)) {
      throw new ValidationError(fieldName, `Please select a valid ${fieldName} option`);
    }
    
    return true;
  }
};

/**
 * Step-based validation schemas
 */
export const stepValidationSchemas = {
  essentials: {
    required: ['gender', 'location'],
    optional: ['dateOfBirth'],
    validators: {
      dateOfBirth: fieldValidators.dateOfBirth,
      gender: fieldValidators.gender,
      location: fieldValidators.location
    }
  },
  
  preferences: {
    required: ['maritalStatus', 'hasChildren', 'wantChildren'],
    optional: ['smoking', 'drinking'],
    validators: {
      maritalStatus: fieldValidators.maritalStatus,
      hasChildren: (value) => fieldValidators.yesNo(value, 'hasChildren'),
      wantChildren: (value) => fieldValidators.yesNo(value, 'wantChildren'),
      smoking: (value) => fieldValidators.lifestyle(value, 'smoking'),
      drinking: (value) => fieldValidators.lifestyle(value, 'drinking')
    }
  },
  
  details: {
    required: [],
    optional: ['height', 'weight', 'occupation', 'education', 'interests', 'languages', 'bio'],
    validators: {
      height: fieldValidators.height,
      weight: fieldValidators.weight,
      occupation: fieldValidators.occupation,
      bio: fieldValidators.bio,
      interests: fieldValidators.interests,
      languages: fieldValidators.languages
    }
  }
};

/**
 * Validate a single step
 */
export const validateStep = (stepName, data) => {
  const schema = stepValidationSchemas[stepName];
  if (!schema) {
    throw new Error(`Unknown step: ${stepName}`);
  }

  const errors = {};
  let hasErrors = false;

  // Validate required fields
  schema.required.forEach(field => {
    try {
      fieldValidators.required(data[field], field);
      if (schema.validators[field]) {
        schema.validators[field](data[field]);
      }
    } catch (error) {
      errors[field] = error.message;
      hasErrors = true;
    }
  });

  // Validate optional fields that have values
  schema.optional.forEach(field => {
    if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
      try {
        if (schema.validators[field]) {
          schema.validators[field](data[field]);
        }
      } catch (error) {
        errors[field] = error.message;
        hasErrors = true;
      }
    }
  });

  return {
    isValid: !hasErrors,
    errors
  };
};

/**
 * Validate complete profile data
 */
export const validateCompleteProfile = (profileData) => {
  const allErrors = {};
  let isValid = true;

  // Validate each step
  Object.keys(stepValidationSchemas).forEach(stepName => {
    const stepResult = validateStep(stepName, profileData);
    if (!stepResult.isValid) {
      isValid = false;
      Object.assign(allErrors, stepResult.errors);
    }
  });

  return {
    isValid,
    errors: allErrors
  };
};

/**
 * Transform profile data for backend submission
 */
export const transformForBackend = (profileData) => {
  const transformed = {
    // Basic info
    dateOfBirth: dateValidation.formatForBackend(profileData.dateOfBirth),
    gender: profileData.gender?.toUpperCase(),
    
    // Location
    city: profileData.location?.city?.trim(),
    country: profileData.location?.country?.trim(),
    district: profileData.location?.district?.trim() || null,
    postalCode: profileData.location?.postalCode?.trim() || null,
    
    // Physical info
    height: profileData.height ? parseInt(profileData.height) : null,
    weight: profileData.weight ? parseInt(profileData.weight) : null,
    
    // Professional info
    occupation: profileData.occupation?.trim() || null,
    education: profileData.education || null,
    
    // Personal background
    maritalStatus: profileData.maritalStatus || null,
    hasChildren: profileData.hasChildren === 'yes',
    wantChildren: profileData.wantChildren === 'yes',
    smoking: profileData.smoking?.toUpperCase() || 'NEVER',
    drinking: profileData.drinking?.toUpperCase() || 'NEVER',
    
    // Additional info
    interests: Array.isArray(profileData.interests) ? profileData.interests : [],
    languages: Array.isArray(profileData.languages) ? profileData.languages : [],
    religion: profileData.religion?.trim() || null,
    ethnicity: profileData.ethnicity?.trim() || null,
    bio: profileData.bio?.trim() || null
  };

  // Remove undefined values
  Object.keys(transformed).forEach(key => {
    if (transformed[key] === undefined) {
      delete transformed[key];
    }
  });

  return transformed;
};

/**
 * Get field validation error in real-time
 */
export const validateField = (fieldName, value, context = {}) => {
  try {
    // Find the appropriate validator
    let validator = fieldValidators[fieldName];
    
    if (!validator) {
      // Try to find in step schemas
      for (const schema of Object.values(stepValidationSchemas)) {
        if (schema.validators[fieldName]) {
          validator = schema.validators[fieldName];
          break;
        }
      }
    }
    
    if (validator) {
      validator(value);
    }
    
    return { isValid: true, error: null };
  } catch (error) {
    return { 
      isValid: false, 
      error: error.message 
    };
  }
};

/**
 * Photo validation utilities
 */
export const photoValidation = {
  /**
   * Validate photo file
   */
  validateFile: (file) => {
    const errors = [];
    
    // Check file type
    if (!VALIDATION_CONSTANTS.photos.allowedTypes.includes(file.type)) {
      errors.push('Please upload a JPEG, PNG, or WebP image');
    }
    
    // Check file size
    if (file.size > VALIDATION_CONSTANTS.photos.maxFileSize) {
      errors.push(`Image must be smaller than ${VALIDATION_CONSTANTS.photos.maxFileSize / (1024 * 1024)}MB`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if user can upload more photos
   */
  canUploadMore: (currentPhotoCount) => {
    return currentPhotoCount < VALIDATION_CONSTANTS.photos.max;
  },

  /**
   * Get remaining photo slots
   */
  getRemainingSlots: (currentPhotoCount) => {
    return Math.max(0, VALIDATION_CONSTANTS.photos.max - currentPhotoCount);
  }
};

export default {
  VALIDATION_CONSTANTS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LIFESTYLE_OPTIONS,
  EDUCATION_OPTIONS,
  INTEREST_OPTIONS,
  LANGUAGE_OPTIONS,
  ValidationError,
  dateValidation,
  fieldValidators,
  stepValidationSchemas,
  validateStep,
  validateCompleteProfile,
  transformForBackend,
  validateField,
  photoValidation
};