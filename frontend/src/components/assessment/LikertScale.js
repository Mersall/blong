/**
 * BLONG Likert Scale Component
 * Interactive scale for personality assessment questions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

const LikertScale = ({
  scale = 5,
  value,
  onValueChange,
  labels,
  colors,
  isRTL,
  t,
  style,
}) => {
  const [scaleAnims] = useState(
    Array.from({ length: scale }, () => new Animated.Value(0.8))
  );
  const [selectedAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate scale entrance
    const animations = scaleAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, animations).start();
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
    const buttonIndex = selectedValue - 1;
    Animated.sequence([
      Animated.timing(scaleAnims[buttonIndex], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[buttonIndex], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const styles = createStyles(colors, isRTL, scale);

  const renderScaleButton = (index) => {
    const buttonValue = index + 1;
    const isSelected = value === buttonValue;
    const label = labels[index];

    return (
      <Animated.View
        key={buttonValue}
        style={[
          styles.scaleButtonContainer,
          {
            transform: [{ scale: scaleAnims[index] }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.scaleButton,
            isSelected && styles.scaleButtonSelected,
          ]}
          onPress={() => handlePress(buttonValue)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.scaleButtonText,
              isSelected && styles.scaleButtonTextSelected,
            ]}
          >
            {buttonValue}
          </Text>
        </TouchableOpacity>
        
        <Text
          style={[
            styles.scaleLabel,
            isSelected && styles.scaleLabelSelected,
          ]}
        >
          {t(label.key)}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Scale Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {t('assessment.scaleInstruction')}
        </Text>
      </View>

      {/* Scale Buttons */}
      <View style={styles.scaleContainer}>
        {Array.from({ length: scale }, (_, index) => renderScaleButton(index))}
      </View>

      {/* Extreme Labels */}
      <View style={styles.extremeLabelsContainer}>
        <Text style={styles.extremeLabel}>
          {t(labels[0].key)}
        </Text>
        <Text style={styles.extremeLabel}>
          {t(labels[labels.length - 1].key)}
        </Text>
      </View>

      {/* Selection Indicator */}
      {value !== undefined && (
        <Animated.View
          style={[
            styles.selectionIndicator,
            {
              opacity: selectedAnim,
              transform: [
                {
                  translateX: selectedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (value - 1) * (100 / (scale - 1)) - 50],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.selectionDot} />
        </Animated.View>
      )}
    </View>
  );
};

const createStyles = (colors, isRTL, scale) => StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  descriptionContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },

  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  scaleContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  scaleButtonContainer: {
    alignItems: 'center',
    flex: 1,
  },

  scaleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  scaleButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  scaleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  scaleButtonTextSelected: {
    color: colors.surface,
  },

  scaleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 60,
    lineHeight: 16,
  },

  scaleLabelSelected: {
    color: colors.accent,
    fontWeight: '600',
  },

  extremeLabelsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },

  extremeLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    maxWidth: 80,
    textAlign: 'center',
  },

  selectionIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    alignItems: 'center',
  },

  selectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});

export default LikertScale;
