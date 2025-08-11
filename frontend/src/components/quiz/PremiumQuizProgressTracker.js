/**
 * BLONG Premium Quiz Progress Tracker
 * Sophisticated progress visualization with gamification elements
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

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

const PremiumQuizProgressTracker = ({
  currentStep = 0,
  totalSteps = 10,
  categoryName = '',
  onStepPress = null,
  achievements = [],
  level = 1,
  experience = 0,
  experienceToNextLevel = 100,
  style = {},
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const achievementAnim = useRef(new Animated.Value(0)).current;
  
  const [showAchievement, setShowAchievement] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState(null);

  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);
  const experiencePercentage = (experience / experienceToNextLevel) * 100;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Pulse animation for active step
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (currentStep < totalSteps) {
      pulseAnimation.start();
    }

    return () => {
      pulseAnimation.stop();
    };
  }, [currentStep, totalSteps, progressPercentage]);

  // Show achievement notification
  useEffect(() => {
    if (achievements.length > 0) {
      const newAchievement = achievements[achievements.length - 1];
      if (newAchievement && newAchievement.id !== latestAchievement?.id) {
        setLatestAchievement(newAchievement);
        showAchievementNotification();
      }
    }
  }, [achievements]);

  const showAchievementNotification = () => {
    setShowAchievement(true);
    
    Animated.sequence([
      Animated.timing(achievementAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(achievementAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowAchievement(false);
    });
  };

  const getAchievementIcon = (type) => {
    const icons = {
      streak: '🔥',
      speed: '⚡',
      perfectScore: '💯',
      milestone: '🏆',
      explorer: '🌟',
      philosopher: '🤔',
      social: '👥',
      default: '🎯',
    };
    return icons[type] || icons.default;
  };

  const renderProgressSteps = () => {
    const steps = [];
    const stepWidth = (screenWidth - 80) / Math.min(totalSteps, 8); // Max 8 visible steps
    
    for (let i = 0; i < Math.min(totalSteps, 8); i++) {
      const isCompleted = i < currentStep;
      const isCurrent = i === currentStep;
      const isUpcoming = i > currentStep;

      steps.push(
        <TouchableOpacity
          key={i}
          onPress={() => onStepPress && onStepPress(i)}
          disabled={!onStepPress}
          style={{
            width: stepWidth,
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: isCompleted 
                ? COLORS.success 
                : isCurrent 
                  ? COLORS.accent 
                  : COLORS.border,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isCompleted || isCurrent ? 0.2 : 0,
              shadowRadius: 4,
              elevation: isCompleted || isCurrent ? 2 : 0,
              transform: isCurrent ? [{ scale: pulseAnim }] : [{ scale: 1 }],
            }}
          >
            {isCompleted ? (
              <Text style={{ color: COLORS.background, fontSize: 12, fontWeight: 'bold' }}>
                ✓
              </Text>
            ) : (
              <Text style={{
                color: isCurrent ? COLORS.background : COLORS.textTertiary,
                fontSize: 10,
                fontWeight: 'bold',
              }}>
                {i + 1}
              </Text>
            )}
          </Animated.View>
          
          {/* Progress line */}
          {i < Math.min(totalSteps, 8) - 1 && (
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: stepWidth * 0.7,
                width: stepWidth * 0.6,
                height: 2,
                backgroundColor: i < currentStep ? COLORS.success : COLORS.border,
                zIndex: -1,
              }}
            />
          )}
        </TouchableOpacity>
      );
    }

    return steps;
  };

  return (
    <View style={[{
      backgroundColor: COLORS.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: COLORS.border,
    }, style]}>
      {/* Header with Level and Category */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <View>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            {categoryName || 'Personality Assessment'}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            Question {currentStep + 1} of {totalSteps}
          </Text>
        </View>

        {/* Level Badge */}
        <LinearGradient
          colors={[COLORS.gold, '#FFA000']}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 12, marginRight: 4 }}>👑</Text>
          <Text style={{
            color: COLORS.background,
            fontSize: 12,
            fontWeight: 'bold',
          }}>
            Level {level}
          </Text>
        </LinearGradient>
      </View>

      {/* Main Progress Bar */}
      <View style={{
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        <Animated.View
          style={{
            height: '100%',
            borderRadius: 4,
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          }}
        >
          <LinearGradient
            colors={[COLORS.accent, '#FF8A65']}
            style={{ flex: 1, borderRadius: 4 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </View>

      {/* Step Indicators */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        {renderProgressSteps()}
      </View>

      {/* Experience Bar */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 12,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.textSecondary,
          }}>
            Experience
          </Text>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.accent,
          }}>
            {experience} / {experienceToNextLevel} XP
          </Text>
        </View>

        <View style={{
          height: 4,
          backgroundColor: COLORS.border,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <View
            style={{
              height: '100%',
              width: `${experiencePercentage}%`,
              backgroundColor: COLORS.accent,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <View style={{
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.textSecondary,
            marginBottom: 8,
          }}>
            Recent Achievements
          </Text>
          <View style={{
            flexDirection: 'row',
            gap: 8,
          }}>
            {achievements.slice(-3).map((achievement, index) => (
              <View
                key={achievement.id || index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: `${COLORS.success}15`,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 12, marginRight: 4 }}>
                  {getAchievementIcon(achievement.type)}
                </Text>
                <Text style={{
                  fontSize: 10,
                  color: COLORS.success,
                  fontWeight: '500',
                }}>
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Achievement Notification */}
      {showAchievement && latestAchievement && (
        <Animated.View
          style={{
            position: 'absolute',
            top: -60,
            left: 20,
            right: 20,
            backgroundColor: COLORS.success,
            borderRadius: 12,
            padding: 16,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            transform: [
              {
                translateY: achievementAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
              {
                scale: achievementAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
            opacity: achievementAnim,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>
              {getAchievementIcon(latestAchievement.type)}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: COLORS.background,
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 2,
              }}>
                Achievement Unlocked!
              </Text>
              <Text style={{
                color: COLORS.background,
                fontSize: 12,
                opacity: 0.9,
              }}>
                {latestAchievement.name}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default PremiumQuizProgressTracker;