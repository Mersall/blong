/**
 * BLONG Simple Questionnaire Screen - Premium Elite Design
 * Profile completion questionnaire with phase-specific questions
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Animated, ActivityIndicator } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { questionnaireService, QUESTIONNAIRE_DATA } from '../../services/questionnaireService';
import { personalityAnalyticsService } from '../../services/personalityAnalyticsService';
// Backend matching service removed
import {
  useQuestionnaireData,
  useQuestionnaireAnswers,
  useSaveQuestionnaireAnswers
} from '../../services/api/userProfileApi';

// MANDATORY COLORS - Following Design Rules
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
};

const SimpleQuestionnaireScreen = ({
  userPhase = 'single',
  onComplete,
  onNavigateToQuestionnaire
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  // React Query hooks
  const { data: questionnaireData, isLoading: questionnaireLoading } = useQuestionnaireData(userPhase);
  const { data: answersData, isLoading: answersLoading } = useQuestionnaireAnswers(userPhase);
  const saveAnswersMutation = useSaveQuestionnaireAnswers();

  // Local state for answers (synced with React Query)
  const [answers, setAnswers] = useState(answersData?.answers || {});

  // Premium animations
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Sync local answers with React Query data
  useEffect(() => {
    if (answersData?.answers) {
      setAnswers(answersData.answers);
    }
  }, [answersData]);

  useEffect(() => {
    // Reset animations for new question
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    // Smooth entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuestionIndex]);

  // Use React Query data or fallback to local data
  const currentQuestionnaireData = questionnaireData?.questionnaire || QUESTIONNAIRE_DATA[userPhase];
  
  // Get all questions from all sections
  const allQuestions = currentQuestionnaireData?.sections?.reduce((acc, section) => {
    return [...acc, ...section.questions.map(q => ({ ...q, sectionTitle: section.title }))];
  }, []) || [];
  
  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;

  console.log('SimpleQuestionnaireScreen - userPhase:', userPhase);
  console.log('SimpleQuestionnaireScreen - totalQuestions:', totalQuestions);
  console.log('SimpleQuestionnaireScreen - currentQuestion:', currentQuestion);
  console.log('SimpleQuestionnaireScreen - answers:', answers);
  console.log('SimpleQuestionnaireScreen - current answer:', answers[currentQuestion?.id]);

  const handleAnswerChange = (questionId, value) => {
    console.log('handleAnswerChange called:', { questionId, value });
    const newAnswers = {
      ...answers,
      [questionId]: value
    };
    console.log('New answers:', newAnswers);
    setAnswers(newAnswers);

    // Save answers using React Query mutation
    saveAnswersMutation.mutate({
      phase: userPhase,
      answers: newAnswers
    });

    // Also save locally as fallback
    questionnaireService.saveAnswers(userPhase, newAnswers);
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentAnswer = answers[currentQuestion.id];

    if (currentQuestion.type === 'multiselect') {
      return currentAnswer && Array.isArray(currentAnswer) && currentAnswer.length > 0;
    } else if (currentQuestion.type === 'range' || currentQuestion.type === 'select' || currentQuestion.type === 'text') {
      return currentAnswer && currentAnswer.toString().trim() !== '';
    }

    return false;
  };

  const handleNext = async () => {
    // Check if question is required and not answered
    if (currentQuestion.required && !isCurrentQuestionAnswered()) {
      // Show validation message
      console.log('Please answer the question before continuing');
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Questionnaire completed - process completion
      await handleQuestionnaireComplete();
    }
  };

  const handleQuestionnaireComplete = async () => {
    try {
      setIsCompleting(true);
      console.log('🎯 Questionnaire completed!', answers);

      // Save completion status and answers locally
      await questionnaireService.saveCompletionStatus(userPhase, true);
      await questionnaireService.saveAnswers(userPhase, answers);

      // Generate personality analytics for display
      console.log('📊 Generating personality analytics...');
      const personalityAnalytics = await personalityAnalyticsService.analyzePersonalityForDisplay(answers);

      // Backend AI matching removed
      console.log('🔗 Backend matching functionality removed');

      // Call completion handler with comprehensive data
      if (onComplete) {
        onComplete({
          answers,
          personalityAnalytics,
          backendSubmitted: backendResult.success,
          submissionId: backendResult.submissionId,
          userPhase
        });
      }

      console.log('✅ Questionnaire completion process finished');

    } catch (error) {
      console.error('❌ Error completing questionnaire:', error);
      setIsCompleting(false);

      // Still try to call onComplete with whatever we have
      if (onComplete) {
        onComplete({
          answers,
          personalityAnalytics: null,
          backendSubmitted: false,
          error: error.message,
          userPhase
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Show loading state while data is being fetched
  if (questionnaireLoading || answersLoading || !currentQuestionnaireData || !currentQuestion) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              {questionnaireLoading || answersLoading ? 'Loading Questionnaire' : 'No questions available'}
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              {questionnaireLoading || answersLoading
                ? 'Preparing your personalized questions'
                : `Phase: ${userPhase}`
              }
            </Text>
          </View>
        </SafeAreaView>
      </AppTransition>
    );
  }

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header - Following Design Rules */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 32,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
        }}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => {
              console.log('Closing questionnaire');
              // Navigate back to previous view (home screen)
              if (onNavigateToQuestionnaire) {
                // This will hide the questionnaire in MainNavigator
                onNavigateToQuestionnaire();
              }
            }}
            style={{
              position: 'absolute',
              top: 50,
              right: 32,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: COLORS.surface,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.border,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              fontWeight: '300',
            }}>
              ✕
            </Text>
          </TouchableOpacity>

            {/* Minimal Header - Clean Design */}
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '300',
                letterSpacing: 4,
                color: COLORS.text,
              }}>
                BLONG
              </Text>
            </View>
        </View>

        {/* Fixed Question Header with Animation */}
        <Animated.View style={{
          paddingHorizontal: 32,
          paddingVertical: 16,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <View style={{
            alignItems: 'center',
          }}>
            {/* Question Text - Minimal */}
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              {currentQuestion.label || currentQuestion.text}
              {currentQuestion.required && (
                <Text style={{ color: COLORS.accent }}> *</Text>
              )}
            </Text>
          </View>
        </Animated.View>

        {/* Scrollable Answers Section with Animation */}
        <Animated.View style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 32,
              paddingVertical: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Answer Options Section */}
            <View style={{
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
            {/* Compact Age Range Options */}
            {currentQuestion.type === 'range' && (
              <View style={{ width: '100%' }}>
                {/* Compact Age Range Grid */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  marginHorizontal: -3,
                }}>
                  {[
                    { min: 22, max: 28, label: '22-28' },
                    { min: 25, max: 32, label: '25-32' },
                    { min: 28, max: 35, label: '28-35' },
                    { min: 30, max: 38, label: '30-38' },
                    { min: 35, max: 42, label: '35-42' },
                    { min: 38, max: 45, label: '38-45' },
                    { min: 40, max: 50, label: '40-50' },
                    { min: 45, max: 55, label: '45-55' },
                    { min: 50, max: 60, label: '50-60' },
                  ].map((range, index) => {
                    const rangeValue = `${range.min}-${range.max}`;
                    const isSelected = answers[currentQuestion.id] === rangeValue;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          console.log('Range selected:', rangeValue);
                          handleAnswerChange(currentQuestion.id, rangeValue);
                        }}
                        style={{
                          width: '31%',
                          backgroundColor: isSelected ? COLORS.accent : COLORS.surface,
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 8,
                          marginHorizontal: 3,
                          borderWidth: 1,
                          borderColor: isSelected ? COLORS.accent : COLORS.border,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '300',
                          color: isSelected ? COLORS.background : COLORS.text,
                          textAlign: 'center',
                        }}>
                          {range.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Compact Text Input */}
            {currentQuestion.type === 'text' && (
              <View style={{ width: '100%' }}>
                <TouchableOpacity
                  onPress={() => {
                    // For now, just set a placeholder value
                    handleAnswerChange(currentQuestion.id, 'Sample answer');
                  }}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: answers[currentQuestion.id] ? COLORS.accent : COLORS.border,
                    minHeight: 60,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: answers[currentQuestion.id] ? COLORS.text : COLORS.textTertiary,
                    fontWeight: '300',
                    textAlign: 'center',
                  }}>
                    {answers[currentQuestion.id] || currentQuestion.placeholder || 'Tap to enter your answer...'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Compact Single Select Options */}
            {currentQuestion.type === 'select' && currentQuestion.options && (
              <View style={{ width: '100%' }}>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleAnswerChange(currentQuestion.id, option)}
                      style={{
                        backgroundColor: isSelected ? COLORS.accent + '10' : COLORS.surface,
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: isSelected ? COLORS.accent : COLORS.border,
                      }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        {/* Radio Button Indicator */}
                        <View style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: isSelected ? COLORS.accent : COLORS.border,
                          backgroundColor: isSelected ? COLORS.accent : 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 12,
                        }}>
                          {isSelected && (
                            <View style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: COLORS.background,
                            }} />
                          )}
                        </View>

                        {/* Option Text */}
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '300',
                          color: isSelected ? COLORS.accent : COLORS.text,
                          flex: 1,
                        }}>
                          {option}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Compact Multi-Select Options */}
            {currentQuestion.type === 'multiselect' && currentQuestion.options && (
              <View style={{ width: '100%' }}>
                {/* Compact Selection Counter */}
                <Text style={{
                  fontSize: 11,
                  color: COLORS.textSecondary,
                  marginBottom: 12,
                  textAlign: 'center',
                }}>
                  {answers[currentQuestion.id]?.length || 0} selected
                </Text>

                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id]?.includes(option);
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const currentAnswers = answers[currentQuestion.id] || [];
                        const newAnswers = isSelected
                          ? currentAnswers.filter(item => item !== option)
                          : [...currentAnswers, option];
                        handleAnswerChange(currentQuestion.id, newAnswers);
                      }}
                      style={{
                        backgroundColor: isSelected ? COLORS.accent + '10' : COLORS.surface,
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: isSelected ? COLORS.accent : COLORS.border,
                      }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        {/* Checkbox Indicator */}
                        <View style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: isSelected ? COLORS.accent : COLORS.border,
                          backgroundColor: isSelected ? COLORS.accent : 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 12,
                        }}>
                          {isSelected && (
                            <Text style={{
                              color: COLORS.background,
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}>
                              ✓
                            </Text>
                          )}
                        </View>

                        {/* Option Text */}
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '300',
                          color: isSelected ? COLORS.accent : COLORS.text,
                          flex: 1,
                        }}>
                          {option}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
          </ScrollView>
        </Animated.View>

        {/* Enhanced Navigation Footer */}
        <View style={{
          paddingHorizontal: 32,
          paddingTop: 24,
          paddingBottom: 32,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          {/* Progress Indicator */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            {Array.from({ length: totalQuestions }, (_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index <= currentQuestionIndex ? COLORS.accent : COLORS.border,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 24,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: currentQuestionIndex === 0 ? COLORS.border : COLORS.textSecondary,
                opacity: currentQuestionIndex === 0 ? 0.3 : 1,
                minWidth: 100,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 16,
                color: COLORS.textSecondary,
                fontWeight: '300',
              }}>
                ← Back
              </Text>
            </TouchableOpacity>

            {/* Progress Text */}
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              fontWeight: '300',
            }}>
              {currentQuestionIndex + 1} of {totalQuestions}
            </Text>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleNext}
              disabled={isCompleting || (currentQuestion.required && !isCurrentQuestionAnswered())}
              style={{
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 24,
                backgroundColor: (isCompleting || (currentQuestion.required && !isCurrentQuestionAnswered()))
                  ? COLORS.border
                  : COLORS.accent,
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: (isCompleting || (currentQuestion.required && !isCurrentQuestionAnswered())) ? 0 : 0.2,
                shadowRadius: 8,
                elevation: (isCompleting || (currentQuestion.required && !isCurrentQuestionAnswered())) ? 0 : 4,
                minWidth: 120,
                alignItems: 'center',
                opacity: (isCompleting || (currentQuestion.required && !isCurrentQuestionAnswered())) ? 0.5 : 1,
              }}
            >
              {isCompleting ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator
                    size="small"
                    color={COLORS.textTertiary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    fontSize: 16,
                    color: COLORS.textTertiary,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                  }}>
                    Processing...
                  </Text>
                </View>
              ) : (
                <Text style={{
                  fontSize: 16,
                  color: (currentQuestion.required && !isCurrentQuestionAnswered())
                    ? COLORS.textTertiary
                    : COLORS.background,
                  fontWeight: '500',
                  letterSpacing: 0.5,
                }}>
                  {currentQuestionIndex === totalQuestions - 1 ? 'Complete' : 'Continue'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default SimpleQuestionnaireScreen;
