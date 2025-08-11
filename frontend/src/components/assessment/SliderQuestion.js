/**
 * BLONG Slider Question Component
 * Interactive slider for continuous scale assessment questions
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SliderQuestion = ({
  min = 0,
  max = 100,
  value,
  onValueChange,
  labelKey,
  colors,
  isRTL,
  t,
  style,
}) => {
  const [sliderWidth, setSliderWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || min);
  
  const slideAnim = useRef(new Animated.Value(0.8)).current;
  const thumbAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate component entrance
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Update current value when prop changes
    if (value !== undefined && value !== currentValue) {
      setCurrentValue(value);
      updateProgressAnimation(value);
    }
  }, [value]);

  const updateProgressAnimation = (newValue) => {
    const progress = (newValue - min) / (max - min);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSliderLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  const calculateValueFromPosition = (x) => {
    const clampedX = Math.max(0, Math.min(x, sliderWidth));
    const progress = clampedX / sliderWidth;
    const newValue = Math.round(min + progress * (max - min));
    return Math.max(min, Math.min(max, newValue));
  };

  const calculatePositionFromValue = (val) => {
    const progress = (val - min) / (max - min);
    return progress * sliderWidth;
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      setIsDragging(true);
      Animated.spring(thumbAnim, {
        toValue: 1.2,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    })
    .onUpdate((event) => {
      const newValue = calculateValueFromPosition(event.x);
      setCurrentValue(newValue);
      updateProgressAnimation(newValue);
    })
    .onEnd(() => {
      setIsDragging(false);
      onValueChange(currentValue);
      
      Animated.spring(thumbAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    });

  const getValueLabel = () => {
    if (labelKey) {
      return t(labelKey);
    }
    return `${currentValue}`;
  };

  const getDescriptiveText = () => {
    const progress = (currentValue - min) / (max - min);
    
    if (progress < 0.2) {
      return t('assessment.slider.veryLow') || 'Very Low';
    } else if (progress < 0.4) {
      return t('assessment.slider.low') || 'Low';
    } else if (progress < 0.6) {
      return t('assessment.slider.moderate') || 'Moderate';
    } else if (progress < 0.8) {
      return t('assessment.slider.high') || 'High';
    } else {
      return t('assessment.slider.veryHigh') || 'Very High';
    }
  };

  const styles = createStyles(colors, isRTL);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: slideAnim }],
        },
        style,
      ]}
    >
      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          {t('assessment.sliderInstruction') || 'Drag the slider to indicate your preference:'}
        </Text>
      </View>

      {/* Current Value Display */}
      <View style={styles.valueDisplayContainer}>
        <View style={[
          styles.valueDisplay,
          isDragging && styles.valueDisplayActive,
        ]}>
          <Text style={[
            styles.valueText,
            isDragging && styles.valueTextActive,
          ]}>
            {currentValue}
          </Text>
          <Text style={[
            styles.valueDescription,
            isDragging && styles.valueDescriptionActive,
          ]}>
            {getDescriptiveText()}
          </Text>
        </View>
      </View>

      {/* Slider Container */}
      <View style={styles.sliderContainer}>
        {/* Min/Max Labels */}
        <View style={styles.extremeLabelsContainer}>
          <Text style={styles.extremeLabel}>{min}</Text>
          <Text style={styles.extremeLabel}>{max}</Text>
        </View>

        {/* Slider Track */}
        <View
          style={styles.sliderTrack}
          onLayout={handleSliderLayout}
        >
          {/* Progress Fill */}
          <Animated.View
            style={[
              styles.sliderProgress,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />

          {/* Slider Thumb */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.sliderThumb,
                {
                  left: calculatePositionFromValue(currentValue) - 20,
                  transform: [{ scale: thumbAnim }],
                },
                isDragging && styles.sliderThumbActive,
              ]}
            >
              <View style={[
                styles.thumbInner,
                isDragging && styles.thumbInnerActive,
              ]} />
            </Animated.View>
          </GestureDetector>

          {/* Tick Marks */}
          <View style={styles.tickMarksContainer}>
            {Array.from({ length: 5 }, (_, index) => {
              const tickValue = min + (index * (max - min)) / 4;
              const isActive = Math.abs(currentValue - tickValue) <= (max - min) / 8;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.tickMark,
                    isActive && styles.tickMarkActive,
                    {
                      left: `${(index * 100) / 4}%`,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Scale Labels */}
        {labelKey && (
          <View style={styles.scaleLabelsContainer}>
            <Text style={styles.scaleLabel}>
              {getValueLabel()}
            </Text>
          </View>
        )}
      </View>

      {/* Selection Status */}
      {value !== undefined && (
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator}>
            <Text style={styles.statusIcon}>✓</Text>
          </View>
          <Text style={styles.statusText}>
            {t('assessment.valueSelected') || 'Value selected'}
          </Text>
        </View>
      )}
    </Animated.View>
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

  valueDisplayContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  valueDisplay: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 120,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  valueDisplayActive: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceElevated,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  valueText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  valueTextActive: {
    color: colors.accent,
  },

  valueDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  valueDescriptionActive: {
    color: colors.accent,
  },

  sliderContainer: {
    paddingHorizontal: 20,
  },

  extremeLabelsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  extremeLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },

  sliderTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    position: 'relative',
    marginVertical: 20,
  },

  sliderProgress: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  sliderThumb: {
    position: 'absolute',
    top: -16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  sliderThumbActive: {
    borderColor: colors.accentDark || colors.accent,
    elevation: 6,
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  thumbInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },

  thumbInnerActive: {
    backgroundColor: colors.accentDark || colors.accent,
  },

  tickMarksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },

  tickMark: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: colors.border,
    borderRadius: 1,
  },

  tickMarkActive: {
    backgroundColor: colors.accent,
    width: 3,
  },

  scaleLabelsContainer: {
    alignItems: 'center',
    marginTop: 8,
  },

  scaleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  statusContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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

export default SliderQuestion;
