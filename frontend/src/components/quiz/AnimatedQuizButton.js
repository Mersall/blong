/**
 * BLONG Animated Quiz Button
 * Premium animated button with micro-interactions
 */

import React, { useState, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from 'react-native';

const AnimatedQuizButton = ({ 
  children, 
  onPress, 
  style, 
  textStyle,
  disabled = false,
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

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
  };

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: size === 'small' ? 12 : size === 'large' ? 20 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 18 : 14,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? COLORS.border : COLORS.accent,
          shadowColor: COLORS.shadow,
          shadowOpacity: disabled ? 0.05 : 0.1,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? COLORS.surface : COLORS.surface,
          borderWidth: 1,
          borderColor: disabled ? COLORS.border : COLORS.accent,
          shadowColor: COLORS.shadow,
          shadowOpacity: 0.05,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? COLORS.border : COLORS.accent,
          shadowOpacity: 0,
        };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = () => {
    const baseStyles = {
      fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
      fontWeight: '500',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          color: disabled ? COLORS.textTertiary : COLORS.background,
        };
      case 'secondary':
      case 'outline':
        return {
          ...baseStyles,
          color: disabled ? COLORS.textTertiary : COLORS.accent,
        };
      default:
        return baseStyles;
    }
  };

  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    // Scale down animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      // Glow effect for primary buttons
      variant === 'primary' && Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ].filter(Boolean)).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    // Scale back up animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled || !onPress) return;
    
    // Ripple effect
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    
    // Haptic feedback would go here in a real app
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    onPress();
  };

  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      {...props}
    >
      <Animated.View style={[
        buttonStyles,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          // Glow effect
          ...(variant === 'primary' && {
            shadowColor: COLORS.accent,
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
            shadowRadius: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 16],
            }),
          }),
        },
        style,
      ]}>
        {/* Ripple Effect */}
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: buttonStyles.borderRadius,
          backgroundColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 107, 53, 0.1)',
          opacity: rippleAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [{
            scale: rippleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1.2],
            }),
          }],
        }} />
        
        {/* Button Content */}
        {typeof children === 'string' ? (
          <Text style={[textStyles, textStyle]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedQuizButton;
