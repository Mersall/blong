/**
 * BLONG Quiz Dashboard
 * Central hub for all quiz experiences and progress tracking
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { AppTransition } from '../AppTransition';
import { LinearGradient } from 'expo-linear-gradient';

// ALWAYS include COLORS constant - BLONG Design System
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

const { width: screenWidth } = Dimensions.get('window');

export const QuizDashboard = ({
  userProgress = {},
  onQuizSelect,
  onBack,
  userPhase = 'single',
}) => {
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
  });

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(animatedValues.fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues.slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const quizCategories = [
    {
      id: 'personality',
      title: 'Personality Assessment',
      subtitle: 'Discover your unique personality traits',
      icon: '🧠',
      color: COLORS.accent,
      estimatedTime: '15-20 min',
      questions: 50,
      progress: userProgress.personality || 0,
      description: 'Based on the Big Five personality model, this assessment reveals your core personality traits.',
      benefits: ['Better self-understanding', 'Improved match compatibility', 'Personalized dating advice'],
      difficulty: 'Easy',
      type: 'core',
    },
    {
      id: 'love_languages',
      title: 'Love Languages',
      subtitle: 'How do you give and receive love?',
      icon: '💕',
      color: '#E91E63',
      estimatedTime: '10-15 min',
      questions: 30,
      progress: userProgress.loveLanguages || 0,
      description: 'Understand how you express and prefer to receive love in relationships.',
      benefits: ['Better communication', 'Stronger relationships', 'Reduced conflicts'],
      difficulty: 'Easy',
      type: 'relationship',
    },
    {
      id: 'attachment_style',
      title: 'Attachment Style',
      subtitle: 'Your relationship attachment patterns',
      icon: '🤝',
      color: '#9C27B0',
      estimatedTime: '12-18 min',
      questions: 40,
      progress: userProgress.attachmentStyle || 0,
      description: 'Discover your attachment style and how it affects your relationships.',
      benefits: ['Understand relationship patterns', 'Improve emotional intimacy', 'Better partner selection'],
      difficulty: 'Medium',
      type: 'relationship',
    },
    {
      id: 'values_assessment',
      title: 'Core Values',
      subtitle: 'What matters most to you in life?',
      icon: '⭐',
      color: '#FF9800',
      estimatedTime: '8-12 min',
      questions: 25,
      progress: userProgress.values || 0,
      description: 'Identify your core values and life priorities for better compatibility.',
      benefits: ['Clearer life direction', 'Better value alignment', 'Meaningful connections'],
      difficulty: 'Easy',
      type: 'compatibility',
    },
    {
      id: 'communication_style',
      title: 'Communication Style',
      subtitle: 'How do you communicate in relationships?',
      icon: '💬',
      color: '#2196F3',
      estimatedTime: '10-15 min',
      questions: 35,
      progress: userProgress.communication || 0,
      description: 'Understand your communication patterns and preferences.',
      benefits: ['Better conversations', 'Reduced misunderstandings', 'Stronger connections'],
      difficulty: 'Medium',
      type: 'relationship',
    },
    {
      id: 'lifestyle_preferences',
      title: 'Lifestyle & Interests',
      subtitle: 'Your lifestyle and activity preferences',
      icon: '🌟',
      color: '#4CAF50',
      estimatedTime: '6-10 min',
      questions: 20,
      progress: userProgress.lifestyle || 0,
      description: 'Share your lifestyle preferences and interests for better matches.',
      benefits: ['Activity compatibility', 'Shared interests', 'Lifestyle alignment'],
      difficulty: 'Easy',
      type: 'compatibility',
    },
  ];

  const getPhaseRecommendations = () => {
    switch (userPhase) {
      case 'single':
        return ['personality', 'values_assessment', 'love_languages'];
      case 'engagement':
        return ['attachment_style', 'communication_style', 'lifestyle_preferences'];
      case 'engagement_day_prep':
        return ['communication_style', 'values_assessment', 'lifestyle_preferences'];
      default:
        return ['personality', 'love_languages', 'values_assessment'];
    }
  };

  const recommendedQuizzes = getPhaseRecommendations();
  const overallProgress = Math.round(
    Object.values(userProgress).reduce((sum, progress) => sum + progress, 0) / 
    Object.keys(userProgress).length || 0
  );

  const renderHeader = () => (
    <View style={{
      paddingTop: 40,
      paddingBottom: 32,
      paddingHorizontal: 32,
      alignItems: 'center',
      backgroundColor: COLORS.background,
    }}>
      <TouchableOpacity
        onPress={onBack}
        style={{
          position: 'absolute',
          top: 50,
          left: 32,
          padding: 8,
        }}
      >
        <Text style={{ fontSize: 18, color: COLORS.accent }}>←</Text>
      </TouchableOpacity>

      <Text style={{
        fontSize: 28,
        fontWeight: '300',
        letterSpacing: 8,
        color: COLORS.text,
        marginBottom: 16,
      }}>
        BLONG
      </Text>

      <View style={{
        width: 40,
        height: 2,
        backgroundColor: COLORS.accent,
        marginBottom: 24,
      }} />

      <Text style={{
        fontSize: 20,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 8,
      }}>
        Personality Quizzes
      </Text>

      <Text style={{
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
      }}>
        Discover yourself and find better matches
      </Text>
    </View>
  );

  const renderProgressOverview = () => (
    <Animated.View style={{
      opacity: animatedValues.fadeIn,
      transform: [{ translateY: animatedValues.slideUp }],
    }}>
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 32,
        marginBottom: 32,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>📊</Text>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              Your Progress
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}>
              Overall completion: {overallProgress}%
            </Text>
          </View>
          <Text style={{
            fontSize: 32,
            fontWeight: '300',
            color: COLORS.accent,
          }}>
            {overallProgress}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{
          height: 8,
          backgroundColor: COLORS.border,
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <View style={{
            height: 8,
            backgroundColor: COLORS.accent,
            borderRadius: 4,
            width: `${overallProgress}%`,
          }} />
        </View>

        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
          marginTop: 12,
        }}>
          Complete more quizzes to improve your match accuracy
        </Text>
      </View>
    </Animated.View>
  );

  const renderQuizCard = (quiz, index) => {
    const isRecommended = recommendedQuizzes.includes(quiz.id);
    const isCompleted = quiz.progress >= 100;
    const isInProgress = quiz.progress > 0 && quiz.progress < 100;

    return (
      <Animated.View
        key={quiz.id}
        style={{
          opacity: animatedValues.fadeIn,
          transform: [{ translateY: animatedValues.slideUp }],
        }}
      >
        <TouchableOpacity
          onPress={() => onQuizSelect(quiz)}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 24,
            marginHorizontal: 32,
            marginBottom: 20,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
            borderWidth: isRecommended ? 2 : 1,
            borderColor: isRecommended ? quiz.color : COLORS.border,
          }}
        >
          {/* Recommended Badge */}
          {isRecommended && (
            <View style={{
              position: 'absolute',
              top: -8,
              right: 16,
              backgroundColor: quiz.color,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '500',
                color: COLORS.background,
                letterSpacing: 0.5,
              }}>
                RECOMMENDED
              </Text>
            </View>
          )}

          {/* Quiz Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: quiz.color + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Text style={{ fontSize: 24 }}>{quiz.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '300',
                color: COLORS.text,
                marginBottom: 4,
              }}>
                {quiz.title}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
              }}>
                {quiz.estimatedTime} • {quiz.questions} questions
              </Text>
            </View>

            {/* Status Indicator */}
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: isCompleted ? COLORS.success : 
                             isInProgress ? COLORS.warning : 
                             COLORS.border,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.background,
              }}>
                {isCompleted ? '✓' : isInProgress ? '⏳' : '○'}
              </Text>
            </View>
          </View>

          {/* Quiz Description */}
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
            marginBottom: 16,
          }}>
            {quiz.description}
          </Text>

          {/* Progress Bar */}
          {quiz.progress > 0 && (
            <View style={{
              height: 4,
              backgroundColor: COLORS.border,
              borderRadius: 2,
              overflow: 'hidden',
              marginBottom: 12,
            }}>
              <View style={{
                height: 4,
                backgroundColor: quiz.color,
                borderRadius: 2,
                width: `${quiz.progress}%`,
              }} />
            </View>
          )}

          {/* Benefits */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 8,
          }}>
            {quiz.benefits.slice(0, 2).map((benefit, benefitIndex) => (
              <View
                key={benefitIndex}
                style={{
                  backgroundColor: quiz.color + '15',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  marginRight: 8,
                  marginBottom: 4,
                }}
              >
                <Text style={{
                  fontSize: 10,
                  color: quiz.color,
                  fontWeight: '500',
                }}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {renderHeader()}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {renderProgressOverview()}

          {/* Recommended Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginHorizontal: 32,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Recommended for You
            </Text>

            {quizCategories
              .filter(quiz => recommendedQuizzes.includes(quiz.id))
              .map((quiz, index) => renderQuizCard(quiz, index))}
          </View>

          {/* All Quizzes Section */}
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginHorizontal: 32,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              All Assessments
            </Text>

            {quizCategories
              .filter(quiz => !recommendedQuizzes.includes(quiz.id))
              .map((quiz, index) => renderQuizCard(quiz, index))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default QuizDashboard;
