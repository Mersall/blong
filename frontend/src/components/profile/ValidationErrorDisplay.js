/**
 * BLONG Validation Error Display
 * Component for displaying validation errors in a user-friendly way
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#4CAF50',
};

// Individual field error component
export const FieldError = ({ error, style = {} }) => {
  if (!error) return null;

  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: COLORS.error + '10',
      borderRadius: 6,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.error,
    }, style]}>
      <Ionicons 
        name="alert-circle" 
        size={16} 
        color={COLORS.error} 
        style={{ marginRight: 8 }}
      />
      <Text style={{
        fontSize: 12,
        color: COLORS.error,
        fontWeight: '400',
        flex: 1,
        lineHeight: 16,
      }}>
        {error}
      </Text>
    </View>
  );
};

// Step validation summary component
export const StepValidationSummary = ({ 
  stepId, 
  errors = {}, 
  onFieldFocus,
  style = {} 
}) => {
  const errorFields = Object.keys(errors);
  
  if (errorFields.length === 0) return null;

  return (
    <View style={[{
      backgroundColor: COLORS.error + '08',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.error + '20',
    }, style]}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <Ionicons 
          name="warning" 
          size={20} 
          color={COLORS.error} 
          style={{ marginRight: 8 }}
        />
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.error,
        }}>
          Please fix the following issues:
        </Text>
      </View>

      {errorFields.map((fieldName, index) => (
        <TouchableOpacity
          key={fieldName}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            paddingHorizontal: 8,
            marginBottom: index === errorFields.length - 1 ? 0 : 4,
            backgroundColor: COLORS.background,
            borderRadius: 4,
          }}
          onPress={() => onFieldFocus && onFieldFocus(fieldName)}
        >
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.error,
            marginRight: 8,
          }} />
          <Text style={{
            fontSize: 12,
            color: COLORS.error,
            flex: 1,
          }}>
            {errors[fieldName]}
          </Text>
          {onFieldFocus && (
            <Ionicons 
              name="chevron-forward" 
              size={14} 
              color={COLORS.error} 
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Success validation component
export const ValidationSuccess = ({ message, style = {} }) => {
  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.success + '10',
      borderRadius: 6,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.success,
    }, style]}>
      <Ionicons 
        name="checkmark-circle" 
        size={16} 
        color={COLORS.success} 
        style={{ marginRight: 8 }}
      />
      <Text style={{
        fontSize: 12,
        color: COLORS.success,
        fontWeight: '400',
        flex: 1,
      }}>
        {message}
      </Text>
    </View>
  );
};

// Warning component for optional fields
export const ValidationWarning = ({ message, style = {} }) => {
  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.warning + '10',
      borderRadius: 6,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.warning,
    }, style]}>
      <Ionicons 
        name="information-circle" 
        size={16} 
        color={COLORS.warning} 
        style={{ marginRight: 8 }}
      />
      <Text style={{
        fontSize: 12,
        color: COLORS.warning,
        fontWeight: '400',
        flex: 1,
      }}>
        {message}
      </Text>
    </View>
  );
};

// Progress validation indicator
export const ValidationProgress = ({ 
  completionPercentage, 
  requiredFieldsComplete,
  style = {} 
}) => {
  const isComplete = completionPercentage === 100;
  const hasRequiredFields = requiredFieldsComplete;

  return (
    <View style={[{
      backgroundColor: COLORS.surface,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    }, style]}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Text style={{
          fontSize: 12,
          fontWeight: '500',
          color: COLORS.text,
        }}>
          Step Completion
        </Text>
        <Text style={{
          fontSize: 12,
          color: isComplete ? COLORS.success : COLORS.textSecondary,
          fontWeight: '500',
        }}>
          {completionPercentage}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={{
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 8,
      }}>
        <View style={{
          height: '100%',
          width: `${completionPercentage}%`,
          backgroundColor: isComplete ? COLORS.success : COLORS.accent,
          borderRadius: 2,
        }} />
      </View>

      {/* Status Message */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Ionicons 
          name={hasRequiredFields ? "checkmark-circle" : "alert-circle"} 
          size={14} 
          color={hasRequiredFields ? COLORS.success : COLORS.warning} 
          style={{ marginRight: 6 }}
        />
        <Text style={{
          fontSize: 11,
          color: hasRequiredFields ? COLORS.success : COLORS.warning,
          fontWeight: '400',
        }}>
          {hasRequiredFields 
            ? "All required fields completed" 
            : "Some required fields are missing"}
        </Text>
      </View>
    </View>
  );
};

// Inline field validation component
export const InlineFieldValidation = ({ 
  isValid, 
  error, 
  successMessage,
  style = {} 
}) => {
  if (isValid && successMessage) {
    return <ValidationSuccess message={successMessage} style={style} />;
  }

  if (!isValid && error) {
    return <FieldError error={error} style={style} />;
  }

  return null;
};

export default {
  FieldError,
  StepValidationSummary,
  ValidationSuccess,
  ValidationWarning,
  ValidationProgress,
  InlineFieldValidation
};
