/**
 * BLONG Achievement Badge
 * Animated achievement badge for gamification
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AchievementBadge = ({ 
  achievement, 
  animated = true, 
  delay = 0,
  onPress,
  style 
}) => {
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Entry animation with delay
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(scaleAnimation, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();

        // Glow animation
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
        glowLoop.start();
      }, delay);
    } else {
      scaleAnimation.setValue(1);
      rotateAnimation.setValue(1);
    }
  }, [animated, delay]);

  const getAchievementGradient = (type) => {
    switch (type) {
      case 'PROGRESS':
        return ['#4facfe', '#00f2fe'];
      case 'SPEED':
        return ['#43e97b', '#38f9d7'];
      case 'COMPLETION':
        return ['#fa709a', '#fee140'];
      case 'SPEED_COMPLETION':
        return ['#a8edea', '#fed6e3'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'PROGRESS':
        return 'trending-up';
      case 'SPEED':
        return 'flash';
      case 'COMPLETION':
        return 'trophy';
      case 'SPEED_COMPLETION':
        return 'rocket';
      default:
        return 'star';
    }
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress && onPress(achievement);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchable}
      >
        {/* Glow Effect */}
        <Animated.View
          style={[
            styles.glowContainer,
            {
              opacity: glowOpacity,
              shadowColor: getAchievementGradient(achievement.type)[1],
            },
          ]}
        />

        <LinearGradient
          colors={getAchievementGradient(achievement.type)}
          style={styles.badge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Icon Container */}
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <Text style={styles.iconEmoji}>
              {achievement.icon || '🏆'}
            </Text>
            
            <View style={styles.iconBadge}>
              <Ionicons
                name={getAchievementIcon(achievement.type)}
                size={12}
                color="white"
              />
            </View>
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {achievement.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {achievement.description}
            </Text>
            
            {achievement.points && (
              <View style={styles.pointsContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.pointsText}>
                  +{achievement.points}
                </Text>
              </View>
            )}
          </View>

          {/* Achievement Type Badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {achievement.type.replace('_', ' ')}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 8,
  },
  touchable: {
    borderRadius: 16,
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pointsText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default AchievementBadge;