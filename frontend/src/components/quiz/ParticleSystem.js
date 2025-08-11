/**
 * BLONG Particle System
 * Celebration particle effects for quiz achievements
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Particle = ({ color, delay, duration }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Random starting position
    const startX = Math.random() * screenWidth;
    const startY = Math.random() * screenHeight;
    
    // Random movement direction
    const endX = startX + (Math.random() - 0.5) * 400;
    const endY = startY - Math.random() * 300 - 100;

    translateX.setValue(startX);
    translateY.setValue(startY);

    // Animate particle movement
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: endX,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: endY,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.8,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

const ParticleSystem = ({ 
  active = false, 
  particleCount = 30, 
  colors = ['#FFD700', '#FF69B4', '#00CED1', '#98FB98'],
  duration = 2000 
}) => {
  if (!active) return null;

  const particles = Array.from({ length: particleCount }, (_, index) => (
    <Particle
      key={index}
      color={colors[index % colors.length]}
      delay={Math.random() * 500}
      duration={duration + Math.random() * 1000}
    />
  ));

  return (
    <View style={styles.container} pointerEvents="none">
      {particles}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ParticleSystem;