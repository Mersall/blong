/**
 * BLONG Questionnaire Component
 * Handles phase-specific questionnaire rendering and validation
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#DC2626',
};

const QuestionnaireComponent = ({
  phase = 'single',
  questionnaireData = null,
  onComplete = null,
  onProgress = null,
  style = {},
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = questionnaireData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    if (onProgress) {
      onProgress(progress);
    }
  }, [progress, onProgress]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error when user provides answer
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentQuestion = () => {
    if (!currentQuestion) return false;
    
    const answer = answers[currentQuestion.id];
    const isRequired = currentQuestion.required;
    
    if (isRequired && (!answer || answer.trim() === '')) {
      setErrors(prev => ({
        ...prev,
        [currentQuestion.id]: 'This question is required'
      }));
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) {
      return;
    }
    
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Validate all required questions
    const newErrors = {};
    questions.forEach(question => {
      if (question.required && (!answers[question.id] || answers[question.id].trim() === '')) {
        newErrors[question.id] = 'This question is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Incomplete', 'Please answer all required questions');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onComplete) {
        await onComplete(answers);
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      Alert.alert('Error', 'Failed to submit questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextInput = (question) => (
    <View style={{ marginTop: 20 }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: errors[question.id] ? COLORS.error : COLORS.border,
          borderRadius: 12,
          padding: 16,
          fontSize: 16,
          color: COLORS.text,
          backgroundColor: COLORS.background,
          minHeight: question.multiline ? 100 : 50,
          textAlignVertical: question.multiline ? 'top' : 'center',
        }}
        placeholder={question.placeholder || 'Your answer...'}
        placeholderTextColor={COLORS.textTertiary}
        value={answers[question.id] || ''}
        onChangeText={(value) => handleAnswerChange(question.id, value)}
        multiline={question.multiline}
        numberOfLines={question.multiline ? 4 : 1}
      />
      {errors[question.id] && (
        <Text style={{
          color: COLORS.error,
          fontSize: 12,
          marginTop: 8,
          marginLeft: 4,
        }}>
          {errors[question.id]}
        </Text>
      )}
    </View>
  );

  const renderMultipleChoice = (question) => (
    <View style={{ marginTop: 20 }}>
      {question.options?.map((option) => {
        const isSelected = answers[question.id] === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleAnswerChange(question.id, option.id)}
            style={{
              borderWidth: 1,
              borderColor: isSelected ? COLORS.accent : COLORS.border,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              backgroundColor: isSelected ? `${COLORS.accent}10` : COLORS.background,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: isSelected ? COLORS.accent : COLORS.border,
                backgroundColor: isSelected ? COLORS.accent : COLORS.background,
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
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
                color: isSelected ? COLORS.accent : COLORS.text,
                fontWeight: isSelected ? '500' : '400',
              }}>
                {option.text}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
      {errors[question.id] && (
        <Text style={{
          color: COLORS.error,
          fontSize: 12,
          marginTop: 8,
          marginLeft: 4,
        }}>
          {errors[question.id]}
        </Text>
      )}
    </View>
  );

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
        return renderTextInput(question);
      case 'multiple_choice':
        return renderMultipleChoice(question);
      default:
        return renderTextInput(question);
    }
  };

  if (!questionnaireData || questions.length === 0) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
      }}>
        <Text style={{
          fontSize: 16,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          No questionnaire available for this phase.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Bar */}
        <View style={{
          height: 4,
          backgroundColor: COLORS.border,
          marginHorizontal: 20,
          marginTop: 20,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <View
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: COLORS.accent,
              borderRadius: 2,
            }}
          />
        </View>

        {/* Question Counter */}
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          marginTop: 16,
          marginBottom: 8,
        }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>

        {/* Question Content */}
        <View style={{
          flex: 1,
          padding: 20,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            color: COLORS.text,
            marginBottom: 12,
            lineHeight: 32,
          }}>
            {currentQuestion?.question}
          </Text>

          {currentQuestion?.required && (
            <Text style={{
              fontSize: 12,
              color: COLORS.error,
              marginBottom: 8,
            }}>
              * Required
            </Text>
          )}

          {renderQuestion(currentQuestion)}
        </View>

        {/* Navigation Buttons */}
        <View style={{
          flexDirection: 'row',
          padding: 20,
          gap: 12,
        }}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              flex: 1,
              backgroundColor: currentQuestionIndex === 0 ? COLORS.surface : COLORS.background,
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              fontWeight: '500',
            }}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={isSubmitting}
            style={{
              flex: 2,
              backgroundColor: COLORS.accent,
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: COLORS.background,
              fontWeight: '600',
            }}>
              {isSubmitting ? 'Submitting...' : isLastQuestion ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default QuestionnaireComponent;