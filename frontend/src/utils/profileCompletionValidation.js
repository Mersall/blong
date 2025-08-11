/**
 * BLONG Profile Completion Validation
 * Comprehensive validation system for profile completion steps
 */

// Validation rules for each step
export const VALIDATION_RULES = {
  essentials: {
    dateOfBirth: {
      required: true,
      validator: (value) => {
        if (!value) return 'Date of birth is required';
        
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) return 'You must be at least 18 years old';
        if (age > 100) return 'Please enter a valid date of birth';
        
        return null;
      }
    },
    gender: {
      required: true,
      validator: (value) => {
        if (!value) return 'Gender selection is required';
        const validGenders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
        if (!validGenders.includes(value)) return 'Please select a valid gender';
        return null;
      }
    },
    location: {
      required: true,
      validator: (value) => {
        if (!value || !value.city) return 'Location is required';
        if (!value.country) return 'Country is required';
        return null;
      }
    }
  },

  'about-you': {
    occupation: {
      required: false,
      validator: (value) => {
        if (value && value.length < 2) return 'Occupation must be at least 2 characters';
        if (value && value.length > 100) return 'Occupation must be less than 100 characters';
        return null;
      }
    },
    education: {
      required: false,
      validator: (value) => {
        if (value) {
          const validEducation = [
            'high-school', 'some-college', 'bachelors', 'masters', 
            'doctorate', 'trade-school', 'other'
          ];
          if (!validEducation.includes(value)) return 'Please select a valid education level';
        }
        return null;
      }
    },
    maritalStatus: {
      required: false,
      validator: (value) => {
        if (value) {
          const validStatuses = ['single', 'divorced', 'widowed', 'separated'];
          if (!validStatuses.includes(value)) return 'Please select a valid marital status';
        }
        return null;
      }
    },
    smoking: {
      required: false,
      validator: (value) => {
        if (value) {
          const validOptions = ['never', 'occasionally', 'regularly', 'trying-to-quit'];
          if (!validOptions.includes(value)) return 'Please select a valid smoking preference';
        }
        return null;
      }
    },
    drinking: {
      required: false,
      validator: (value) => {
        if (value) {
          const validOptions = ['never', 'rarely', 'socially', 'regularly'];
          if (!validOptions.includes(value)) return 'Please select a valid drinking preference';
        }
        return null;
      }
    }
  },

  'complete-profile': {
    height: {
      required: false,
      validator: (value) => {
        if (value) {
          const height = parseInt(value);
          if (isNaN(height)) return 'Height must be a number';
          if (height < 100) return 'Height must be at least 100cm';
          if (height > 250) return 'Height must be less than 250cm';
        }
        return null;
      }
    },
    interests: {
      required: false,
      validator: (value) => {
        if (value && Array.isArray(value)) {
          if (value.length > 10) return 'Please select no more than 10 interests';
        }
        return null;
      }
    },
    languages: {
      required: false,
      validator: (value) => {
        if (value && Array.isArray(value)) {
          if (value.length > 5) return 'Please select no more than 5 languages';
        }
        return null;
      }
    }
  },

  'personality-questionnaire': {
    personalityData: {
      required: false,
      validator: (value) => {
        // Personality questionnaire is optional
        return null;
      }
    }
  }
};

// Validate a single field
export const validateField = (stepId, fieldName, value) => {
  const stepRules = VALIDATION_RULES[stepId];
  if (!stepRules || !stepRules[fieldName]) return null;

  const rule = stepRules[fieldName];
  
  // Check if required
  if (rule.required && (!value || (Array.isArray(value) && value.length === 0))) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
  }

  // Run custom validator
  if (rule.validator) {
    return rule.validator(value);
  }

  return null;
};

// Validate an entire step
export const validateStep = (stepId, profileData) => {
  const stepRules = VALIDATION_RULES[stepId];
  if (!stepRules) return { isValid: true, errors: {} };

  const errors = {};
  let isValid = true;

  Object.keys(stepRules).forEach(fieldName => {
    const value = profileData[fieldName];
    const error = validateField(stepId, fieldName, value);
    
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Validate all completed steps
export const validateAllSteps = (profileData, currentStep, steps) => {
  const allErrors = {};
  let overallValid = true;

  // Validate all steps up to current step
  for (let i = 0; i <= currentStep; i++) {
    const step = steps[i];
    const { isValid, errors } = validateStep(step.id, profileData);
    
    if (!isValid) {
      allErrors[step.id] = errors;
      overallValid = false;
    }
  }

  return { isValid: overallValid, errors: allErrors };
};

// Get user-friendly error messages
export const getFieldErrorMessage = (stepId, fieldName, value) => {
  const error = validateField(stepId, fieldName, value);
  if (!error) return null;

  // Map technical field names to user-friendly names
  const fieldLabels = {
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    location: 'Location',
    occupation: 'Occupation',
    education: 'Education',
    maritalStatus: 'Marital Status',
    smoking: 'Smoking Preference',
    drinking: 'Drinking Preference',
    height: 'Height',
    interests: 'Interests',
    languages: 'Languages',
    personalityData: 'Personality Questionnaire'
  };

  const friendlyFieldName = fieldLabels[fieldName] || fieldName;
  
  // Replace field name in error message if it starts with the field name
  if (error.startsWith(fieldName)) {
    return error.replace(fieldName, friendlyFieldName);
  }

  return error;
};

// Check if step can be completed (has minimum required fields)
export const canCompleteStep = (stepId, profileData) => {
  const stepRules = VALIDATION_RULES[stepId];
  if (!stepRules) return true;

  // Check only required fields
  const requiredFields = Object.keys(stepRules).filter(
    fieldName => stepRules[fieldName].required
  );

  return requiredFields.every(fieldName => {
    const value = profileData[fieldName];
    const error = validateField(stepId, fieldName, value);
    return !error;
  });
};

// Get completion percentage for a step
export const getStepCompletionPercentage = (stepId, profileData) => {
  const stepRules = VALIDATION_RULES[stepId];
  if (!stepRules) return 100;

  const allFields = Object.keys(stepRules);
  const completedFields = allFields.filter(fieldName => {
    const value = profileData[fieldName];
    return value && (!Array.isArray(value) || value.length > 0);
  });

  return Math.round((completedFields.length / allFields.length) * 100);
};

export default {
  VALIDATION_RULES,
  validateField,
  validateStep,
  validateAllSteps,
  getFieldErrorMessage,
  canCompleteStep,
  getStepCompletionPercentage
};
