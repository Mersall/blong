/**
 * BLONG Master Quiz Interface
 * Comprehensive quiz experience with unified design and enhanced UX
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  PanGestureHandler,
  State,
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MasterQuizInterface = ({
  quizData,
  currentQuestionIndex = 0,
  onAnswerSelect,
  onQuizComplete,
  onBack,
  userProgress = {},
  showTimer = true,
  enableSwipeNavigation = true,
  quizType = 'personality', // 'personality', 'compatibility', 'values'
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animationState, setAnimationState] = useState('idle');
  
  // Animations
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const questionAnimation = useRef(new Animated.Value(1)).current;
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const timerAnimation = useRef(new Animated.Value(0)).current;

  const currentQuestion = quizData?.[currentQuestionIndex];
  const totalQuestions = quizData?.length || 0;
  const progressPercentage = totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnimation, {
      toValue: progressPercentage / 100,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Reset question animation
    Animated.sequence([
      Animated.timing(questionAnimation, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(questionAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset timer
    setTimeSpent(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Timer effect
    if (showTimer) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, showTimer]);

  const handleAnswerSelect = (answer, optionIndex) => {
    setSelectedAnswer({ answer, optionIndex });
    
    // Animate selection
    Animated.sequence([
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance after selection (with delay for feedback)
    setTimeout(() => {
      handleNextQuestion(answer, optionIndex);
    }, 1000);
  };

  const handleNextQuestion = (answer, optionIndex) => {
    if (onAnswerSelect) {
      onAnswerSelect({
        questionId: currentQuestion.id,
        answer,
        optionIndex,
        timeSpent,
        questionIndex: currentQuestionIndex,
      });
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      // Move to next question
      setAnimationState('transitioning');
      
      Animated.timing(questionAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // This would be handled by parent component
        setAnimationState('idle');
      });
    } else {
      // Quiz complete
      setAnimationState('completing');
      if (onQuizComplete) {
        onQuizComplete();
      }
    }
  };

  const renderQuizHeader = () => (
    <View style={{
      paddingTop: 20,
      paddingBottom: 24,
      paddingHorizontal: 32,
      backgroundColor: COLORS.background,
    }}>
      {/* Header with back button and timer */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ fontSize: 18, color: COLORS.accent }}>←</Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: COLORS.text,
          letterSpacing: 1,
        }}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Text>
        
        {showTimer && (
          <View style={{
            backgroundColor: COLORS.surface,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              fontWeight: '500',
            }}>
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={{
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <Animated.View style={{
          height: 6,
          backgroundColor: COLORS.accent,
          borderRadius: 3,
          width: progressAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }} />
      </View>

      <Text style={{
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 8,
      }}>
        {Math.round(progressPercentage)}% Complete
      </Text>
    </View>
  );

  const renderQuestionCard = () => {
    if (!currentQuestion) return null;

    return (
      <Animated.View style={{
        transform: [{ scale: questionAnimation }],
        opacity: questionAnimation,
      }}>
        <View style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 32,
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
          {/* Question Category */}
          {currentQuestion.category && (
            <View style={{
              backgroundColor: COLORS.accent + '20',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: COLORS.accent,
                letterSpacing: 0.5,
              }}>
                {currentQuestion.category}
              </Text>
            </View>
          )}

          {/* Question Text */}
          <Text style={{
            fontSize: 20,
            fontWeight: '300',
            color: COLORS.text,
            lineHeight: 28,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            {currentQuestion.text}
          </Text>

          {/* Question Subtitle/Context */}
          {currentQuestion.subtitle && (
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              {currentQuestion.subtitle}
            </Text>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderAnswerOptions = () => {
    if (!currentQuestion?.options) return null;

    return (
      <View style={{ paddingHorizontal: 32 }}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer?.optionIndex === index;
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(option, index)}
              disabled={selectedAnswer !== null}
              style={{
                backgroundColor: isSelected ? COLORS.accent + '20' : COLORS.background,
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: isSelected ? COLORS.accent : COLORS.border,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.1 : 0.05,
                shadowRadius: 8,
                elevation: isSelected ? 4 : 2,
                transform: [
                  {
                    scale: isSelected ? 1.02 : 1,
                  },
                ],
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                {/* Option Number */}
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isSelected ? COLORS.accent : COLORS.surface,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: isSelected ? COLORS.background : COLORS.textSecondary,
                  }}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>

                {/* Option Text */}
                <Text style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: '300',
                  color: isSelected ? COLORS.accent : COLORS.text,
                  lineHeight: 22,
                }}>
                  {option.text || option}
                </Text>

                {/* Selection Indicator */}
                {isSelected && (
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: COLORS.accent,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: COLORS.background,
                    }}>
                      ✓
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderQuizTypeIndicator = () => {
    const typeConfig = {
      personality: { icon: '🧠', label: 'Personality Assessment', color: COLORS.accent },
      compatibility: { icon: '💕', label: 'Compatibility Quiz', color: '#E91E63' },
      values: { icon: '⭐', label: 'Values Assessment', color: '#9C27B0' },
    };

    const config = typeConfig[quizType] || typeConfig.personality;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
      }}>
        <Text style={{ fontSize: 20, marginRight: 8 }}>{config.icon}</Text>
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: config.color,
          letterSpacing: 0.5,
        }}>
          {config.label}
        </Text>
      </View>
    );
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {renderQuizHeader()}
        {renderQuizTypeIndicator()}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {renderQuestionCard()}
          {renderAnswerOptions()}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default MasterQuizInterface;
