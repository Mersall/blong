/**
 * BLONG Achievement Popup
 * Gamified achievement notifications for quiz milestones
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const AchievementPopup = ({ achievement, visible, onClose }) => {
  const slideAnimation = useRef(new Animated.Value(-100)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Entry animation
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for icon
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();

      return () => pulseLoop.stop();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!achievement) return null;

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

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: opacityAnimation,
          transform: [{ translateY: slideAnimation }],
        },
      ]}
    >
      <BlurView intensity={20} style={styles.blurContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onClose}
          style={styles.achievementContainer}
        >
          <Animated.View
            style={[
              styles.content,
              { transform: [{ scale: scaleAnimation }] },
            ]}
          >
            <LinearGradient
              colors={getAchievementGradient(achievement.type)}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Achievement Icon */}
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ scale: pulseAnimation }] },
                ]}
              >
                <Text style={styles.iconEmoji}>
                  {achievement.icon || '🏆'}
                </Text>
                <View style={styles.iconBadge}>
                  <Ionicons
                    name={getAchievementIcon(achievement.type)}
                    size={16}
                    color="white"
                  />
                </View>
              </Animated.View>

              {/* Achievement Content */}
              <View style={styles.textContainer}>
                <Text style={styles.achievementType}>
                  {achievement.type.replace('_', ' ')}
                </Text>
                <Text style={styles.achievementTitle}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                
                {achievement.points && (
                  <View style={styles.pointsContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.pointsText}>
                      +{achievement.points} points
                    </Text>
                  </View>
                )}
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementContainer: {
    borderRadius: 16,
  },
  content: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    borderRadius: 16,
    minHeight: 120,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: 70,
    flex: 1,
  },
  achievementType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pointsText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AchievementPopup;