/**
 * BLONG Simple Progress Indicator
 * Clean and intuitive step progress indicator for profile completion
 */

import React from 'react';
import { View, Text } from 'react-native';

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
};

const SimpleProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  stepTitles = [],
  style = {} 
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  const currentStepTitle = stepTitles[currentStep] || `Step ${currentStep + 1}`;

  return (
    <View style={[{
      paddingHorizontal: 32,
      paddingVertical: 24,
      backgroundColor: COLORS.surface,
    }, style]}>
      
      {/* Step Counter */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.text,
          letterSpacing: 0.5,
        }}>
          {currentStepTitle}
        </Text>
        
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          fontWeight: '300',
        }}>
          {currentStep + 1} of {totalSteps}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={{
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <View style={{
          height: '100%',
          width: `${progressPercentage}%`,
          backgroundColor: COLORS.accent,
          borderRadius: 2,
        }} />
      </View>

      {/* Step Dots */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 4,
      }}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <View
              key={index}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: isCompleted 
                  ? COLORS.success 
                  : isCurrent 
                    ? COLORS.accent 
                    : COLORS.border,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: isCurrent ? 2 : 0,
                borderColor: isCurrent ? COLORS.accent + '40' : 'transparent',
              }}
            >
              {isCompleted ? (
                <Text style={{
                  fontSize: 12,
                  color: COLORS.background,
                  fontWeight: '600',
                }}>
                  ✓
                </Text>
              ) : (
                <Text style={{
                  fontSize: 12,
                  color: isCurrent ? COLORS.background : COLORS.textTertiary,
                  fontWeight: isCurrent ? '600' : '400',
                }}>
                  {index + 1}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Step Labels */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 4,
      }}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          const stepLabel = stepTitles[index] || `Step ${index + 1}`;
          const shortLabel = stepLabel.length > 8 
            ? stepLabel.substring(0, 8) + '...' 
            : stepLabel;

          return (
            <Text
              key={index}
              style={{
                fontSize: 10,
                color: isCompleted 
                  ? COLORS.success 
                  : isCurrent 
                    ? COLORS.accent 
                    : COLORS.textTertiary,
                fontWeight: isCurrent ? '500' : '300',
                textAlign: 'center',
                width: 24,
                marginTop: 4,
              }}
            >
              {shortLabel}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default SimpleProgressIndicator;
