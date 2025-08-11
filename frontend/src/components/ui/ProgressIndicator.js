/**
 * BLONG Progress Indicator
 * Advanced progress tracking with context-aware messages and animations
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

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
  warning: '#FF9800',
  error: '#F44336',
};

const PROGRESS_TYPES = {
  LINEAR: 'linear',
  CIRCULAR: 'circular',
  STEP: 'step',
  WAVE: 'wave',
};

const ProgressIndicator = ({
  progress = 0, // 0-100
  type = PROGRESS_TYPES.LINEAR,
  size = 'medium', // 'small', 'medium', 'large'
  color = COLORS.accent,
  backgroundColor = COLORS.border,
  showPercentage = true,
  showLabel = true,
  label,
  animated = true,
  duration = 500,
  steps = [],
  currentStep = 0,
  style,
  trackStyle,
  fillStyle,
  labelStyle,
  percentageStyle,
  indeterminate = false,
  showIcon = false,
  icon = 'checkmark',
  thickness = 4,
}) => {
  const { t } = useTranslation();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated, duration]);

  useEffect(() => {
    if (indeterminate) {
      // Indeterminate animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotation for circular indeterminate
      if (type === PROGRESS_TYPES.CIRCULAR) {
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ).start();
      }
    }
  }, [indeterminate, type]);

  useEffect(() => {
    // Pulse animation for completed progress
    if (progress >= 100) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [progress]);

  const getSizeConfig = () => {
    const configs = {
      small: {
        height: 4,
        borderRadius: 2,
        fontSize: 12,
        iconSize: 16,
        circularSize: 40,
      },
      medium: {
        height: 6,
        borderRadius: 3,
        fontSize: 14,
        iconSize: 20,
        circularSize: 60,
      },
      large: {
        height: 8,
        borderRadius: 4,
        fontSize: 16,
        iconSize: 24,
        circularSize: 80,
      },
    };
    return configs[size] || configs.medium;
  };

  const sizeConfig = getSizeConfig();

  const renderLinearProgress = () => {
    const trackWidth = screenWidth - 64; // Account for padding

    return (
      <View style={[{ width: '100%' }, style]}>
        {/* Label */}
        {showLabel && label && (
          <Text style={[
            {
              fontSize: sizeConfig.fontSize,
              color: COLORS.textSecondary,
              marginBottom: 8,
              textAlign: 'center',
            },
            labelStyle,
          ]}>
            {label}
          </Text>
        )}

        {/* Progress Track */}
        <View style={[
          {
            height: sizeConfig.height,
            backgroundColor,
            borderRadius: sizeConfig.borderRadius,
            overflow: 'hidden',
            width: '100%',
          },
          trackStyle,
        ]}>
          {/* Progress Fill */}
          {indeterminate ? (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '30%',
                backgroundColor: color,
                transform: [
                  {
                    translateX: waveAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-trackWidth * 0.3, trackWidth],
                    }),
                  },
                ],
              }}
            />
          ) : (
            <Animated.View
              style={[
                {
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: sizeConfig.borderRadius,
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
                fillStyle,
              ]}
            />
          )}
        </View>

        {/* Percentage */}
        {showPercentage && !indeterminate && (
          <Animated.Text style={[
            {
              fontSize: sizeConfig.fontSize,
              color: COLORS.text,
              marginTop: 8,
              textAlign: 'center',
              fontWeight: '600',
              transform: [{ scale: pulseAnim }],
            },
            percentageStyle,
          ]}>
            {Math.round(progress)}%
          </Animated.Text>
        )}

        {/* Completion Icon */}
        {showIcon && progress >= 100 && (
          <Animated.View
            style={{
              alignItems: 'center',
              marginTop: 8,
              transform: [{ scale: pulseAnim }],
            }}
          >
            <Ionicons
              name={icon}
              size={sizeConfig.iconSize}
              color={COLORS.success}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  const renderStepProgress = () => {
    if (!steps.length) return null;

    return (
      <View style={[{ width: '100%' }, style]}>
        {/* Label */}
        {showLabel && label && (
          <Text style={[
            {
              fontSize: sizeConfig.fontSize,
              color: COLORS.textSecondary,
              marginBottom: 16,
              textAlign: 'center',
            },
            labelStyle,
          ]}>
            {label}
          </Text>
        )}

        {/* Steps */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const stepColor = isCompleted ? COLORS.success :
                            isCurrent ? color : COLORS.border;

            return (
              <React.Fragment key={index}>
                {/* Step Circle */}
                <Animated.View
                  style={{
                    width: sizeConfig.circularSize * 0.6,
                    height: sizeConfig.circularSize * 0.6,
                    borderRadius: sizeConfig.circularSize * 0.3,
                    backgroundColor: stepColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: isCurrent ? [{ scale: pulseAnim }] : [],
                  }}
                >
                  {isCompleted ? (
                    <Ionicons
                      name="checkmark"
                      size={sizeConfig.iconSize}
                      color={COLORS.background}
                    />
                  ) : (
                    <Text style={{
                      fontSize: sizeConfig.fontSize - 2,
                      color: isCurrent ? COLORS.background : COLORS.textTertiary,
                      fontWeight: '600',
                    }}>
                      {index + 1}
                    </Text>
                  )}
                </Animated.View>

                {/* Step Label */}
                <View style={{
                  position: 'absolute',
                  top: sizeConfig.circularSize * 0.6 + 8,
                  left: -20,
                  right: -20,
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: sizeConfig.fontSize - 2,
                    color: isCurrent ? COLORS.text : COLORS.textTertiary,
                    textAlign: 'center',
                    fontWeight: isCurrent ? '600' : '400',
                  }}>
                    {step.title || step}
                  </Text>
                </View>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <View style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: isCompleted ? COLORS.success : COLORS.border,
                    marginHorizontal: 8,
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Current Step Description */}
        {steps[currentStep]?.description && (
          <Text style={{
            fontSize: sizeConfig.fontSize - 1,
            color: COLORS.textSecondary,
            textAlign: 'center',
            marginTop: 32,
            lineHeight: 20,
          }}>
            {steps[currentStep].description}
          </Text>
        )}
      </View>
    );
  };

  const renderCircularProgress = () => {
    const radius = sizeConfig.circularSize / 2 - thickness;
    const circumference = 2 * Math.PI * radius;

    return (
      <View style={[
        {
          width: sizeConfig.circularSize,
          height: sizeConfig.circularSize,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
        {/* Background Circle */}
        <View
          style={{
            position: 'absolute',
            width: sizeConfig.circularSize,
            height: sizeConfig.circularSize,
            borderRadius: sizeConfig.circularSize / 2,
            borderWidth: thickness,
            borderColor: backgroundColor,
          }}
        />

        {/* Progress Circle */}
        {indeterminate ? (
          <Animated.View
            style={{
              position: 'absolute',
              width: sizeConfig.circularSize,
              height: sizeConfig.circularSize,
              borderRadius: sizeConfig.circularSize / 2,
              borderWidth: thickness,
              borderColor: 'transparent',
              borderTopColor: color,
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          />
        ) : (
          <Animated.View
            style={{
              position: 'absolute',
              width: sizeConfig.circularSize,
              height: sizeConfig.circularSize,
              borderRadius: sizeConfig.circularSize / 2,
              borderWidth: thickness,
              borderColor: 'transparent',
              borderTopColor: color,
              transform: [
                {
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          />
        )}

        {/* Center Content */}
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {showPercentage && !indeterminate && (
            <Animated.Text style={[
              {
                fontSize: sizeConfig.fontSize + 2,
                color: COLORS.text,
                fontWeight: '600',
                transform: [{ scale: pulseAnim }],
              },
              percentageStyle,
            ]}>
              {Math.round(progress)}%
            </Animated.Text>
          )}

          {showIcon && progress >= 100 && (
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
            >
              <Ionicons
                name={icon}
                size={sizeConfig.iconSize + 4}
                color={COLORS.success}
              />
            </Animated.View>
          )}

          {indeterminate && (
            <Text style={{
              fontSize: sizeConfig.fontSize,
              color: COLORS.textSecondary,
            }}>
              ...
            </Text>
          )}
        </View>

        {/* Label */}
        {showLabel && label && (
          <Text style={[
            {
              fontSize: sizeConfig.fontSize,
              color: COLORS.textSecondary,
              marginTop: 16,
              textAlign: 'center',
            },
            labelStyle,
          ]}>
            {label}
          </Text>
        )}
      </View>
    );
  };

  const renderProgress = () => {
    switch (type) {
      case PROGRESS_TYPES.CIRCULAR:
        return renderCircularProgress();
      case PROGRESS_TYPES.STEP:
        return renderStepProgress();
      case PROGRESS_TYPES.LINEAR:
      default:
        return renderLinearProgress();
    }
  };

  return renderProgress();
};

// Export progress types for easy usage
ProgressIndicator.TYPES = PROGRESS_TYPES;

export default ProgressIndicator;
export { PROGRESS_TYPES };