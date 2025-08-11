/**
 * BLONG Questionnaire Manager
 * Manages the comprehensive personality questionnaire flow
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTransition } from '../AppTransition';
import { Card, Text as UIText, Button } from '../ui';
import QuestionComponent, { QUESTION_CATEGORIES } from './ComprehensiveQuestionnaire';
import SimpleProgressIndicator from './SimpleProgressIndicator';

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

const QuestionnaireManager = ({ 
  onComplete, 
  onSkip, 
  initialData = {},
  showSkipOption = true 
}) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState({});

  const categories = Object.values(QUESTION_CATEGORIES);
  const currentCategory = categories[currentCategoryIndex];
  const currentQuestion = currentCategory?.questions[currentQuestionIndex];
  const totalQuestions = categories.reduce((total, cat) => total + cat.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;

  // Calculate progress
  const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);
  const categoryProgress = Math.round(((currentQuestionIndex + 1) / currentCategory.questions.length) * 100);

  useEffect(() => {
    // Clear validation errors when question changes
    setValidationErrors({});
  }, [currentCategoryIndex, currentQuestionIndex]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Clear validation error for this question
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentQuestion = () => {
    if (!currentQuestion) return true;
    
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.required) {
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        setValidationErrors({
          [currentQuestion.id]: 'This question is required'
        });
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) return;

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      // Next question in current category
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Next category
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Completed all questions
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Previous question in current category
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentCategoryIndex > 0) {
      // Previous category
      setCurrentCategoryIndex(prev => prev - 1);
      const prevCategory = categories[currentCategoryIndex - 1];
      setCurrentQuestionIndex(prevCategory.questions.length - 1);
    }
  };

  const handleComplete = () => {
    // Validate all required questions
    const errors = {};
    let hasErrors = false;

    categories.forEach(category => {
      category.questions.forEach(question => {
        if (question.required) {
          const answer = answers[question.id];
          if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            errors[question.id] = 'This question is required';
            hasErrors = true;
          }
        }
      });
    });

    if (hasErrors) {
      setValidationErrors(errors);
      // Navigate to first error
      for (let catIndex = 0; catIndex < categories.length; catIndex++) {
        const category = categories[catIndex];
        for (let qIndex = 0; qIndex < category.questions.length; qIndex++) {
          const question = category.questions[qIndex];
          if (errors[question.id]) {
            setCurrentCategoryIndex(catIndex);
            setCurrentQuestionIndex(qIndex);
            return;
          }
        }
      }
      return;
    }

    onComplete(answers);
  };

  const isFirstQuestion = currentCategoryIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion = currentCategoryIndex === categories.length - 1 && 
                         currentQuestionIndex === currentCategory.questions.length - 1;

  if (!currentCategory || !currentQuestion) {
    return null;
  }

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 24,
          paddingHorizontal: 32,
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}>
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
            marginBottom: 16,
          }} />

          <Text style={{
            fontSize: 18,
            fontWeight: '300',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Personality Questionnaire
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Help us understand you better for perfect matches
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={{
          paddingHorizontal: 32,
          paddingVertical: 16,
          backgroundColor: COLORS.surface,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.text,
            }}>
              {currentCategory.title}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
            }}>
              {answeredQuestions} of {totalQuestions} answered
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={{
            height: 4,
            backgroundColor: COLORS.border,
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <View style={{
              height: '100%',
              width: `${overallProgress}%`,
              backgroundColor: COLORS.accent,
              borderRadius: 2,
            }} />
          </View>
        </View>

        {/* Question Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Card style={{ marginBottom: 24 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 24, marginRight: 12 }}>
                {currentCategory.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <UIText.H6 style={{ color: COLORS.accent, marginBottom: 4 }}>
                  {currentCategory.title}
                </UIText.H6>
                <UIText.Body2 style={{ color: COLORS.textSecondary }}>
                  Question {currentQuestionIndex + 1} of {currentCategory.questions.length}
                </UIText.Body2>
              </View>
            </View>

            <QuestionComponent
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
              error={validationErrors[currentQuestion.id]}
            />
          </Card>
        </ScrollView>

        {/* Navigation Footer */}
        <View style={{
          paddingHorizontal: 32,
          paddingVertical: 24,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={isFirstQuestion}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                opacity: isFirstQuestion ? 0.5 : 1,
              }}
            >
              <Text style={{
                fontSize: 16,
                color: COLORS.accent,
                fontWeight: '500',
              }}>
                Previous
              </Text>
            </TouchableOpacity>

            {showSkipOption && (
              <TouchableOpacity
                onPress={onSkip}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                  fontWeight: '300',
                }}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={isLastQuestion ? handleComplete : handleNext}
              style={{
                backgroundColor: COLORS.accent,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 24,
              }}
            >
              <Text style={{
                fontSize: 16,
                color: COLORS.background,
                fontWeight: '500',
              }}>
                {isLastQuestion ? 'Complete' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default QuestionnaireManager;
