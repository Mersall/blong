/**
 * BLONG Gamification System
 * Advanced gamification features for quiz engagement
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  Modal,
  Haptics,
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
  warning: '#FF9800',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

const ACHIEVEMENTS = {
  FIRST_QUESTION: {
    id: 'first_question',
    title: 'First Step',
    description: 'Answered your first question',
    icon: '🌟',
    color: COLORS.gold,
    points: 10,
  },
  STREAK_5: {
    id: 'streak_5',
    title: 'On Fire',
    description: '5 questions in a row',
    icon: '🔥',
    color: COLORS.warning,
    points: 25,
  },
  HALF_WAY: {
    id: 'half_way',
    title: 'Half Way There',
    description: 'Completed 50% of questions',
    icon: '⚡',
    color: COLORS.accent,
    points: 50,
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Answered all questions thoughtfully',
    icon: '💎',
    color: COLORS.success,
    points: 100,
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Quick and decisive',
    icon: '⚡',
    color: COLORS.accent,
    points: 30,
  },
};

const LEVELS = [
  { level: 1, threshold: 0, title: 'Explorer', color: COLORS.bronze },
  { level: 2, threshold: 100, title: 'Seeker', color: COLORS.silver },
  { level: 3, threshold: 250, title: 'Discoverer', color: COLORS.gold },
  { level: 4, threshold: 500, title: 'Sage', color: COLORS.accent },
  { level: 5, threshold: 1000, title: 'Master', color: COLORS.success },
];

export const ExperienceBar = ({ 
  currentXP, 
  level, 
  nextLevelXP, 
  showAnimation = false 
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progress = currentXP / nextLevelXP;
    
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }),
      showAnimation
        ? Animated.loop(
            Animated.sequence([
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(glowAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          )
        : Animated.timing(glowAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
    ]).start();
  }, [currentXP, nextLevelXP, showAnimation]);

  const currentLevelInfo = LEVELS.find(l => l.level === level) || LEVELS[0];

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: currentLevelInfo.color,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.background,
            }}>
              {level}
            </Text>
          </View>
          <View>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.text,
            }}>
              {currentLevelInfo.title}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
            }}>
              Level {level}
            </Text>
          </View>
        </View>
        
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          fontWeight: '500',
        }}>
          {currentXP} / {nextLevelXP} XP
        </Text>
      </View>

      {/* Experience Bar */}
      <View style={{
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: currentLevelInfo.color,
            borderRadius: 4,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            transform: [{
              scaleY: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2],
              }),
            }],
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.8],
            }),
          }}
        />
      </View>
    </View>
  );
};

export const AchievementPopup = ({ 
  achievement, 
  visible, 
  onClose 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 360,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose && onClose();
      }, 3000);
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  if (!achievement) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <Animated.View
          style={{
            transform: [
              { scale: scaleAnim },
              { 
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })
              },
            ],
          }}
        >
          <LinearGradient
            colors={[COLORS.background, COLORS.surface]}
            style={{
              borderRadius: 20,
              padding: 32,
              alignItems: 'center',
              maxWidth: screenWidth * 0.8,
              borderWidth: 2,
              borderColor: achievement.color,
              shadowColor: achievement.color,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Achievement Icon */}
            <Animated.Text
              style={{
                fontSize: 48,
                marginBottom: 16,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                }),
                transform: [{
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                }],
              }}
            >
              {achievement.icon}
            </Animated.Text>

            {/* Achievement Title */}
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              {achievement.title}
            </Text>

            {/* Achievement Description */}
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 20,
            }}>
              {achievement.description}
            </Text>

            {/* Points Earned */}
            <View style={{
              backgroundColor: achievement.color,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: COLORS.background,
              }}>
                +{achievement.points} XP
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                marginTop: 20,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.textSecondary,
              }}>
                Continue
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

export const ProgressRing = ({ 
  progress, 
  total, 
  size = 60, 
  strokeWidth = 4,
  color = COLORS.accent,
  showAnimation = true 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const progressValue = total > 0 ? progress / total : 0;
    
    if (showAnimation) {
      Animated.timing(animatedValue, {
        toValue: progressValue,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progressValue);
    }
  }, [progress, total]);

  return (
    <View style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: COLORS.border,
        }}
      />
      
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{
            rotate: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          }],
        }}
      />

      <Text style={{
        fontSize: size * 0.25,
        fontWeight: '600',
        color: COLORS.text,
      }}>
        {progress}/{total}
      </Text>
    </View>
  );
};

export const StreakCounter = ({ 
  streak, 
  maxStreak = 10,
  showCelebration = false 
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fireAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showCelebration) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(fireAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fireAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showCelebration]);

  const getStreakColor = () => {
    if (streak >= 10) return COLORS.gold;
    if (streak >= 5) return COLORS.warning;
    if (streak >= 3) return COLORS.accent;
    return COLORS.textSecondary;
  };

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: getStreakColor(),
        transform: [{ scale: pulseAnim }],
      }}
    >
      <Animated.Text
        style={{
          fontSize: 16,
          marginRight: 8,
          opacity: fireAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.6],
          }),
        }}
      >
        🔥
      </Animated.Text>
      
      <View>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: getStreakColor(),
        }}>
          {streak} Streak
        </Text>
        <Text style={{
          fontSize: 10,
          color: COLORS.textTertiary,
        }}>
          Keep it up!
        </Text>
      </View>
    </Animated.View>
  );
};

export default {
  ExperienceBar,
  AchievementPopup,
  ProgressRing,
  StreakCounter,
  ACHIEVEMENTS,
  LEVELS,
  COLORS,
};