/**
 * BLONG Quiz Floating Action Button
 * Animated floating button for quiz actions
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

const QuizFloatingButton = ({ 
  onPress, 
  disabled = false,
  icon = '→',
  text = 'Next',
  position = 'bottom-right', // bottom-right, bottom-center, bottom-left
  style,
  visible = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    // Show/hide animation
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    // Continuous pulse animation when visible
    if (visible && !disabled) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      return () => pulseAnimation.stop();
    }
  }, [visible, disabled]);

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute',
      bottom: 32,
      zIndex: 1000,
    };

    switch (position) {
      case 'bottom-center':
        return {
          ...baseStyles,
          alignSelf: 'center',
          left: '50%',
          marginLeft: -32, // Half of button width
        };
      case 'bottom-left':
        return {
          ...baseStyles,
          left: 32,
        };
      case 'bottom-right':
      default:
        return {
          ...baseStyles,
          right: 32,
        };
    }
  };

  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: visible ? 1 : 0,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
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
    
    // Success animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: visible ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  if (!visible && scaleAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View style={[
      getPositionStyles(),
      {
        transform: [
          { scale: Animated.multiply(scaleAnim, pulseAnim) },
          { 
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '5deg'],
            })
          },
        ],
      },
      style,
    ]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={1}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: disabled ? COLORS.border : COLORS.accent,
          borderRadius: 32,
          paddingVertical: 16,
          paddingHorizontal: 24,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation: 8,
          minWidth: 64,
          justifyContent: 'center',
        }}
      >
        {/* Glow Effect */}
        <Animated.View style={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: 36,
          backgroundColor: COLORS.accent,
          opacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.3],
          }),
        }} />
        
        {/* Button Content */}
        {text && (
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: disabled ? COLORS.textTertiary : COLORS.background,
            marginRight: icon ? 8 : 0,
          }}>
            {text}
          </Text>
        )}
        
        {icon && (
          <Animated.Text style={{
            fontSize: 16,
            color: disabled ? COLORS.textTertiary : COLORS.background,
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '10deg'],
              })
            }],
          }}>
            {icon}
          </Animated.Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default QuizFloatingButton;
