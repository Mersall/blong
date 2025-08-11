/**
 * BLONG Premium Loading System
 * Complete loading solution with branded animations and smooth transitions
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  Modal,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Elite color system
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
  gradient: {
    primary: ['#FF6B35', '#FF8A65'],
    secondary: ['#FAFAFA', '#FFFFFF'],
    loading: ['#FF6B35', '#FFB74D', '#FF8A65'],
  },
};

// Branded Logo Animation Component
export const BrandedLogo = ({ 
  size = 80, 
  animate = true, 
  style = {} 
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate) {
      // Rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    }
  }, [animate]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [
            { rotate: rotation },
            { scale: scaleAnim },
          ],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={COLORS.gradient.primary}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.Text
          style={{
            fontSize: size * 0.3,
            fontWeight: '300',
            letterSpacing: 2,
            color: COLORS.background,
            transform: [{ scale: pulseAnim }],
          }}
        >
          B
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Floating Particles Animation
export const FloatingParticles = ({ count = 20, style = {} }) => {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, index) => ({
      id: index,
      animValue: new Animated.Value(0),
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2000,
      duration: Math.random() * 3000 + 2000,
    }))
  );

  useEffect(() => {
    const animations = particles.map(particle =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(particle.delay),
          Animated.timing(particle.animValue, {
            toValue: 1,
            duration: particle.duration,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={[{ 
      position: 'absolute',
      width: '100%',
      height: '100%',
    }, style]}>
      {particles.map(particle => {
        const translateY = particle.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight, -100],
        });

        const translateX = particle.animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [
            Math.random() * screenWidth,
            Math.random() * screenWidth,
            Math.random() * screenWidth,
          ],
        });

        const opacity = particle.animValue.interpolate({
          inputRange: [0, 0.1, 0.9, 1],
          outputRange: [0, 0.6, 0.6, 0],
        });

        return (
          <Animated.View
            key={particle.id}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: COLORS.accent,
              transform: [
                { translateX },
                { translateY },
              ],
              opacity,
            }}
          />
        );
      })}
    </View>
  );
};

// Progress Wave Animation
export const ProgressWave = ({ 
  progress = 0, 
  height = 6, 
  style = {} 
}) => {
  const waveAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wave animation
    const waveAnimation = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.sine),
        useNativeDriver: true,
      })
    );

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    waveAnimation.start();

    return () => {
      waveAnimation.stop();
    };
  }, [progress]);

  const translateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View style={[{
      height,
      backgroundColor: COLORS.border,
      borderRadius: height / 2,
      overflow: 'hidden',
    }, style]}>
      <Animated.View
        style={{
          width: progressAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }),
          height: '100%',
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={COLORS.gradient.loading}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        
        {/* Wave effect */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// Pulse Dots Loader
export const PulseDots = ({ 
  count = 3, 
  size = 8, 
  color = COLORS.accent,
  style = {} 
}) => {
  const [dots] = useState(() =>
    Array.from({ length: count }, (_, index) => ({
      id: index,
      animValue: new Animated.Value(0.3),
    }))
  );

  useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(dot.animValue, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot.animValue, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: size,
    }, style]}>
      {dots.map(dot => (
        <Animated.View
          key={dot.id}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: dot.animValue,
            transform: [{
              scale: dot.animValue.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.8, 1.2],
              }),
            }],
          }}
        />
      ))}
    </View>
  );
};

// Main Loading Screen Component
export const PremiumLoadingScreen = ({
  visible = false,
  message = 'Loading...',
  submessage = '',
  progress = null,
  showParticles = true,
  onComplete = null,
  style = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onComplete) onComplete();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
    >
      <View style={[{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
      }, style]}>
        {/* Floating Particles */}
        {showParticles && <FloatingParticles />}

        {/* Main Content */}
        <Animated.View
          style={{
            alignItems: 'center',
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Logo */}
          <BrandedLogo size={100} style={{ marginBottom: 32 }} />

          {/* Brand Name */}
          <Text style={{
            fontSize: 28,
            fontWeight: '300',
            letterSpacing: 6,
            color: COLORS.text,
            marginBottom: 8,
          }}>
            BLONG
          </Text>

          {/* Loading Message */}
          <Text style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            marginBottom: 32,
            textAlign: 'center',
          }}>
            {message}
          </Text>

          {/* Progress Bar or Pulse Dots */}
          {progress !== null ? (
            <View style={{ width: 200, marginBottom: 16 }}>
              <ProgressWave progress={progress} />
              <Text style={{
                fontSize: 12,
                color: COLORS.textTertiary,
                textAlign: 'center',
                marginTop: 8,
              }}>
                {Math.round(progress)}%
              </Text>
            </View>
          ) : (
            <PulseDots style={{ marginBottom: 16 }} />
          )}

          {/* Submessage */}
          {submessage && (
            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
              textAlign: 'center',
              lineHeight: 16,
              paddingHorizontal: 32,
            }}>
              {submessage}
            </Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

// Quick Loading Indicator (for inline use)
export const QuickLoader = ({ 
  size = 20, 
  color = COLORS.accent,
  style = {} 
}) => (
  <PulseDots
    count={3}
    size={size * 0.3}
    color={color}
    style={style}
  />
);

// Export all components
export default {
  PremiumLoadingScreen,
  BrandedLogo,
  FloatingParticles,
  ProgressWave,
  PulseDots,
  QuickLoader,
};