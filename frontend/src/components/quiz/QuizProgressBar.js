/**
 * BLONG Quiz Progress Bar
 * Animated progress indicator for quiz sessions
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const QuizProgressBar = ({ 
  progress, 
  colors = ['#4ECDC4', '#6BCF7F'], 
  style,
  animatedValue,
  showPercentage = false,
  height = 8,
}) => {
  const widthAnimation = useRef(animatedValue || new Animated.Value(progress)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animatedValue) {
      Animated.timing(widthAnimation, {
        toValue: progress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }

    // Glow effect animation
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    if (progress > 0) {
      glowLoop.start();
    }

    return () => glowLoop.stop();
  }, [progress]);

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Background Track */}
      <View style={[styles.track, { height }]}>
        {/* Progress Fill */}
        <Animated.View
          style={[
            styles.progressContainer,
            { 
              height,
              width: widthAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressFill}
          />
          
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowOpacity,
                shadowColor: colors[1],
              },
            ]}
          />
        </Animated.View>

        {/* Progress Indicators */}
        <View style={styles.indicators}>
          {Array.from({ length: 4 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  left: `${(index + 1) * 20}%`,
                  backgroundColor: progress >= (index + 1) * 0.2 
                    ? colors[1] 
                    : 'rgba(255,255,255,0.3)',
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Percentage Display */}
      {showPercentage && (
        <Text style={styles.percentageText}>
          {Math.round(progress * 100)}%
        </Text>
      )}

      {/* Milestone Markers */}
      <View style={styles.milestones}>
        <View style={styles.milestone}>
          <View style={[
            styles.milestoneMarker,
            { backgroundColor: progress >= 0.25 ? colors[1] : 'rgba(255,255,255,0.5)' }
          ]} />
          <Text style={styles.milestoneText}>25%</Text>
        </View>
        
        <View style={styles.milestone}>
          <View style={[
            styles.milestoneMarker,
            { backgroundColor: progress >= 0.50 ? colors[1] : 'rgba(255,255,255,0.5)' }
          ]} />
          <Text style={styles.milestoneText}>50%</Text>
        </View>
        
        <View style={styles.milestone}>
          <View style={[
            styles.milestoneMarker,
            { backgroundColor: progress >= 0.75 ? colors[1] : 'rgba(255,255,255,0.5)' }
          ]} />
          <Text style={styles.milestoneText}>75%</Text>
        </View>
        
        <View style={styles.milestone}>
          <View style={[
            styles.milestoneMarker,
            { backgroundColor: progress >= 1.0 ? colors[1] : 'rgba(255,255,255,0.5)' }
          ]} />
          <Text style={styles.milestoneText}>100%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  track: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    flex: 1,
    borderRadius: 10,
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  indicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  indicator: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  percentageText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  milestone: {
    alignItems: 'center',
  },
  milestoneMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  milestoneText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
});

export default QuizProgressBar;