/**
 * BLONG Premium Quiz Question Component
 * Interactive quiz question with animations and visual feedback
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanGestureHandler,
  State,
} from 'react-native';
import { PanGestureHandler as GestureHandler } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

const PremiumQuizQuestion = ({
  question,
  onAnswer,
  selectedAnswer,
  questionNumber,
  totalQuestions,
  style,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [optionAnims] = useState(
    question.options.map(() => new Animated.Value(0))
  );

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
    gradient1: '#FF6B35',
    gradient2: '#FF8A65',
  };

  useEffect(() => {
    // Animate question entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate options with stagger
    const optionAnimations = optionAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 200 + index * 100,
        useNativeDriver: true,
      })
    );

    Animated.parallel(optionAnimations).start();
  }, [question]);

  const handleOptionPress = (option, index) => {
    // Pulse animation for feedback
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onAnswer(option);
  };

  const renderLikertScale = () => {
    if (question.type !== 'LIKERT_5') return null;

    return (
      <View style={{
        paddingHorizontal: 20,
        marginTop: 20,
      }}>
        {/* Scale Labels */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingHorizontal: 10,
        }}>
          <Text style={{
            fontSize: 12,
            color: COLORS.textTertiary,
            textAlign: 'center',
            maxWidth: 60,
          }}>
            Strongly Disagree
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textTertiary,
            textAlign: 'center',
          }}>
            Neutral
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textTertiary,
            textAlign: 'center',
            maxWidth: 60,
          }}>
            Strongly Agree
          </Text>
        </View>

        {/* Interactive Scale */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer?.id === option.id;
            
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleOptionPress(option, index)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isSelected ? COLORS.accent : COLORS.surface,
                  borderWidth: 2,
                  borderColor: isSelected ? COLORS.accent : COLORS.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: isSelected ? COLORS.accent : COLORS.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.3 : 0.1,
                  shadowRadius: isSelected ? 8 : 4,
                  elevation: isSelected ? 8 : 2,
                  transform: [{ scale: isSelected ? 1.1 : 1 }],
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: isSelected ? COLORS.background : COLORS.text,
                }}>
                  {option.value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Progress Dots */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
          gap: 8,
        }}>
          {question.options.map((option, index) => {
            const isActive = selectedAnswer && index <= question.options.findIndex(opt => opt.id === selectedAnswer.id);
            
            return (
              <View
                key={index}
                style={{
                  width: isActive ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isActive ? COLORS.accent : COLORS.border,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderMultipleChoice = () => {
    if (question.type !== 'SELECT') return null;

    return (
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer?.id === option.id;
          
          return (
            <Animated.View
              key={option.id}
              style={{
                opacity: optionAnims[index],
                transform: [{
                  translateY: optionAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => handleOptionPress(option, index)}
                style={{
                  backgroundColor: isSelected ? `${COLORS.accent}10` : COLORS.surface,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: isSelected ? COLORS.accent : COLORS.border,
                  shadowColor: COLORS.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.1 : 0.05,
                  shadowRadius: 8,
                  elevation: isSelected ? 4 : 2,
                  transform: [{ scale: isSelected ? 1.02 : 1 }],
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: isSelected ? COLORS.accent : 'transparent',
                    borderWidth: 2,
                    borderColor: isSelected ? COLORS.accent : COLORS.border,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    {isSelected && (
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: COLORS.background,
                      }} />
                    )}
                  </View>
                  
                  <Text style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: isSelected ? '500' : '400',
                    color: isSelected ? COLORS.text : COLORS.textSecondary,
                    lineHeight: 22,
                  }}>
                    {option.text}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View style={[{
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: pulseAnim },
      ],
      flex: 1,
      paddingVertical: 20,
    }, style]}>
      {/* Question Header */}
      <View style={{
        paddingHorizontal: 32,
        marginBottom: 30,
      }}>
        {/* Progress Indicator */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
          <View style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: `${COLORS.accent}15`,
            borderRadius: 20,
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: COLORS.accent,
            }}>
              Question {questionNumber} of {totalQuestions}
            </Text>
          </View>
        </View>

        {/* Question Text */}
        <Text style={{
          fontSize: 24,
          fontWeight: '300',
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 32,
          marginBottom: 8,
        }}>
          {question.text}
        </Text>

        {/* Question Subtitle */}
        <Text style={{
          fontSize: 14,
          color: COLORS.textTertiary,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          Choose the option that best describes you
        </Text>
      </View>

      {/* Question Content */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {renderLikertScale()}
        {renderMultipleChoice()}
      </View>

      {/* Navigation Hint */}
      {selectedAnswer && (
        <Animated.View style={{
          alignItems: 'center',
          paddingHorizontal: 32,
          paddingVertical: 20,
          opacity: fadeAnim,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: `${COLORS.success}15`,
            borderRadius: 20,
          }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>✓</Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.success,
            }}>
              Great choice! Moving to next question...
            </Text>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default PremiumQuizQuestion;