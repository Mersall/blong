/**
 * BLONG Multiple Choice Component
 * Interactive multiple choice selection for assessment questions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

const MultipleChoice = ({
  options,
  value,
  onValueChange,
  colors,
  isRTL,
  t,
  style,
}) => {
  const [optionAnims] = useState(
    options.map(() => new Animated.Value(0.8))
  );
  const [selectedAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate options entrance
    const animations = optionAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  useEffect(() => {
    // Animate selection
    if (value !== undefined) {
      Animated.spring(selectedAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [value]);

  const handlePress = (selectedValue) => {
    onValueChange(selectedValue);
    
    // Animate button press
    const optionIndex = options.findIndex(opt => opt.value === selectedValue);
    if (optionIndex >= 0) {
      Animated.sequence([
        Animated.timing(optionAnims[optionIndex], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(optionAnims[optionIndex], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const styles = createStyles(colors, isRTL);

  return (
    <View style={[styles.container, style]}>
      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          {t('assessment.multipleChoiceInstruction') || 'Select the option that best describes you:'}
        </Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = value === option.value;
          
          return (
            <Animated.View
              key={option.value}
              style={[
                styles.optionContainer,
                {
                  transform: [{ scale: optionAnims[index] }],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => handlePress(option.value)}
                activeOpacity={0.7}
              >
                {/* Selection Indicator */}
                <View style={[
                  styles.selectionIndicator,
                  isSelected && styles.selectionIndicatorSelected,
                ]}>
                  {isSelected && (
                    <Animated.View
                      style={[
                        styles.selectionDot,
                        {
                          opacity: selectedAnim,
                          transform: [
                            {
                              scale: selectedAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  )}
                </View>

                {/* Option Text */}
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {t(option.key)}
                  </Text>
                </View>

                {/* Option Letter */}
                <View style={[
                  styles.optionLetter,
                  isSelected && styles.optionLetterSelected,
                ]}>
                  <Text style={[
                    styles.optionLetterText,
                    isSelected && styles.optionLetterTextSelected,
                  ]}>
                    {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Selection Status */}
      {value !== undefined && (
        <Animated.View
          style={[
            styles.statusContainer,
            {
              opacity: selectedAnim,
              transform: [
                {
                  translateY: selectedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statusIndicator}>
            <Text style={styles.statusIcon}>✓</Text>
          </View>
          <Text style={styles.statusText}>
            {t('assessment.optionSelected') || 'Option selected'}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const createStyles = (colors, isRTL) => StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  instructionsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },

  instructionsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  optionsContainer: {
    gap: 12,
  },

  optionContainer: {
    marginBottom: 4,
  },

  optionButton: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  optionButtonSelected: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.accent,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isRTL ? 0 : 12,
    marginLeft: isRTL ? 12 : 0,
  },

  selectionIndicatorSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },

  selectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },

  optionTextContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },

  optionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    textAlign: isRTL ? 'right' : 'left',
  },

  optionTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },

  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: isRTL ? 0 : 12,
    marginRight: isRTL ? 12 : 0,
  },

  optionLetterSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  optionLetterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  optionLetterTextSelected: {
    color: colors.surface,
  },

  statusContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isRTL ? 0 : 8,
    marginLeft: isRTL ? 8 : 0,
  },

  statusIcon: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },

  statusText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
});

export default MultipleChoice;
