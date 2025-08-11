/**
 * BLONG Quiz Loading Animation
 * Beautiful loading animations for quiz transitions
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const QuizLoadingAnimation = ({ 
  visible = true,
  message = 'Loading...',
  type = 'personality', // personality, calculating, saving
  style 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Multiple floating dots
  const dotAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

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
    // Personality colors
    openness: '#9C27B0',
    conscientiousness: '#2196F3',
    extraversion: '#FF9800',
    agreeableness: '#4CAF50',
    neuroticism: '#F44336',
  };

  const getLoadingConfig = () => {
    switch (type) {
      case 'personality':
        return {
          icon: '🧠',
          colors: [COLORS.openness, COLORS.conscientiousness, COLORS.extraversion, COLORS.agreeableness, COLORS.neuroticism],
          message: message || 'Analyzing your personality...',
        };
      case 'calculating':
        return {
          icon: '⚡',
          colors: [COLORS.accent, COLORS.warning, COLORS.success],
          message: message || 'Calculating compatibility...',
        };
      case 'saving':
        return {
          icon: '💾',
          colors: [COLORS.success, COLORS.accent],
          message: message || 'Saving your responses...',
        };
      default:
        return {
          icon: '✨',
          colors: [COLORS.accent],
          message: message || 'Loading...',
        };
    }
  };

  useEffect(() => {
    if (visible) {
      // Fade in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous rotation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();

      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Floating dots animation
      const dotAnimations = dotAnims.map((anim, index) => 
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 1000,
              delay: index * 200,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        )
      );

      dotAnimations.forEach(anim => anim.start());

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
        dotAnimations.forEach(anim => anim.stop());
      };
    } else {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const config = getLoadingConfig();

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View style={[
      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: fadeAnim,
      },
      style,
    ]}>
      <Animated.View style={{
        alignItems: 'center',
        transform: [{ scale: scaleAnim }],
      }}>
        {/* Main Loading Icon */}
        <Animated.View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: COLORS.surface,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
          transform: [
            { scale: pulseAnim },
            { 
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            },
          ],
        }}>
          <Text style={{ fontSize: 32 }}>{config.icon}</Text>
        </Animated.View>

        {/* Floating Dots */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          height: 20,
        }}>
          {dotAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: config.colors[index % config.colors.length],
                marginHorizontal: 4,
                transform: [{
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  })
                }],
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
              }}
            />
          ))}
        </View>

        {/* Loading Message */}
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          {config.message}
        </Text>

        {/* Subtitle */}
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          This will only take a moment
        </Text>

        {/* Progress Indicator */}
        <View style={{
          width: 200,
          height: 2,
          backgroundColor: COLORS.border,
          borderRadius: 1,
          marginTop: 24,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            height: '100%',
            backgroundColor: COLORS.accent,
            borderRadius: 1,
            width: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default QuizLoadingAnimation;
