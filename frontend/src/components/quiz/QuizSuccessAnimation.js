/**
 * BLONG Quiz Success Animation
 * Celebratory animation for quiz completions
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuizSuccessAnimation = ({ 
  visible = false,
  message = 'Great job!',
  onComplete,
  duration = 2000,
  style 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  // Confetti particles
  const confettiAnims = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(Math.random() * screenWidth),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

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

  const confettiColors = [
    COLORS.accent,
    COLORS.success,
    COLORS.warning,
    '#9C27B0',
    '#2196F3',
    '#E91E63',
  ];

  useEffect(() => {
    if (visible) {
      // Main success animation
      Animated.sequence([
        // Fade in and scale up
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
        
        // Bounce effect
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        
        // Hold for a moment
        Animated.delay(duration - 1000),
        
        // Fade out
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (onComplete) {
          onComplete();
        }
      });

      // Confetti animation
      const confettiAnimations = confettiAnims.map((particle, index) => {
        // Reset particle position
        particle.x.setValue(Math.random() * screenWidth);
        particle.y.setValue(-50);
        particle.rotation.setValue(0);
        particle.scale.setValue(1);

        return Animated.parallel([
          // Fall down
          Animated.timing(particle.y, {
            toValue: screenHeight + 50,
            duration: 3000 + Math.random() * 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          
          // Rotate
          Animated.timing(particle.rotation, {
            toValue: Math.random() > 0.5 ? 360 : -360,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          
          // Scale variation
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 0.5 + Math.random() * 0.5,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });

      // Start confetti with staggered delays
      confettiAnimations.forEach((anim, index) => {
        setTimeout(() => anim.start(), index * 100);
      });

    } else {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      bounceAnim.setValue(0);
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <View style={[
      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: visible ? 'auto' : 'none',
      },
      style,
    ]}>
      {/* Confetti Particles */}
      {confettiAnims.map((particle, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            backgroundColor: confettiColors[index % confettiColors.length],
            borderRadius: 4,
            transform: [
              { translateX: particle.x },
              { translateY: particle.y },
              { 
                rotate: particle.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })
              },
              { scale: particle.scale },
            ],
          }}
        />
      ))}

      {/* Success Message */}
      <Animated.View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        opacity: fadeAnim,
      }}>
        <Animated.View style={{
          alignItems: 'center',
          transform: [
            { scale: scaleAnim },
            { 
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              })
            },
          ],
        }}>
          {/* Success Icon */}
          <Animated.View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: COLORS.success,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
            transform: [{
              scale: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              })
            }],
          }}>
            <Text style={{ fontSize: 48, color: COLORS.background }}>✓</Text>
          </Animated.View>

          {/* Success Message */}
          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: 12,
          }}>
            {message}
          </Text>

          {/* Subtitle */}
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Moving to the next section...
          </Text>

          {/* Animated Progress Ring */}
          <Animated.View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: 3,
            borderColor: COLORS.border,
            borderTopColor: COLORS.accent,
            marginTop: 24,
            transform: [{
              rotate: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            }],
          }} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default QuizSuccessAnimation;
