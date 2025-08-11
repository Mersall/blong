/**
 * Password Strength Indicator Component
 * Elegant password strength visualization for BLONG authentication
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPasswordStrengthColor, getPasswordStrengthText } from '../../utils/formValidation';

const PasswordStrengthIndicator = ({ 
  strength, 
  colors, 
  isVisible = true,
  style = {} 
}) => {
  if (!isVisible || strength === 'none') {
    return null;
  }

  const strengthColor = getPasswordStrengthColor(strength);
  const strengthText = getPasswordStrengthText(strength);
  
  // Calculate strength percentage for progress bar
  const getStrengthPercentage = () => {
    switch (strength) {
      case 'weak':
        return 33;
      case 'medium':
        return 66;
      case 'strong':
        return 100;
      default:
        return 0;
    }
  };

  const strengthPercentage = getStrengthPercentage();

  const styles = StyleSheet.create({
    container: {
      marginTop: 8,
      marginBottom: 4,
    },
    progressContainer: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: 4,
    },
    progressBar: {
      height: '100%',
      backgroundColor: strengthColor,
      borderRadius: 2,
      width: `${strengthPercentage}%`,
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    strengthText: {
      fontSize: 12,
      color: strengthColor,
      fontWeight: '500',
    },
    criteriaText: {
      fontSize: 11,
      color: colors.textSecondary,
    },
  });

  return (
    <View 
      style={[styles.container, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: strengthPercentage,
        text: `Password strength: ${strengthText}`
      }}
      accessibilityLabel={`Password strength indicator showing ${strengthText} strength`}
    >
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar} />
      </View>
      
      {/* Strength Text */}
      <View style={styles.textContainer}>
        <Text 
          style={styles.strengthText}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`Password strength: ${strengthText}`}
        >
          {strengthText}
        </Text>
        
        {strength === 'weak' && (
          <Text 
            style={styles.criteriaText}
            accessibilityLabel="Password requirements: 8 or more characters, uppercase letter, lowercase letter, and number"
          >
            8+ chars, uppercase, lowercase, number
          </Text>
        )}
      </View>
    </View>
  );
};

export default PasswordStrengthIndicator;
