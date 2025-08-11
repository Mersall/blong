/**
 * BLONG Quiz Screen
 * Premium personality assessment experience
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
import quizService from '../../services/quizService';
import AnimatedQuizButton from './AnimatedQuizButton';
import QuizFloatingButton from './QuizFloatingButton';
import QuizLoadingAnimation from './QuizLoadingAnimation';
import QuizSuccessAnimation from './QuizSuccessAnimation';

const { width: screenWidth } = Dimensions.get('window');

const QuizScreen = ({ navigation, route }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));

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
    loadQuizData();
  }, []);

  useEffect(() => {
    updateProgress();
  }, [responses, categories]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      const [categoriesData, existingResponses] = await Promise.all([
        quizService.getQuizCategories(),
        quizService.getUserQuizResponses(),
      ]);

      setCategories(categoriesData);
      
      // Convert existing responses to our format
      const responseMap = {};
      existingResponses.forEach(response => {
        responseMap[response.question.id] = response.selectedOption.id;
      });
      setResponses(responseMap);

    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = () => {
    if (categories.length === 0) return;

    let totalQuestions = 0;
    let answeredQuestions = 0;

    categories.forEach(category => {
      category.questions.forEach(question => {
        totalQuestions++;
        if (responses[question.id]) {
          answeredQuestions++;
        }
      });
    });

    const newProgress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    setProgress(newProgress);
  };

  const getCurrentQuestion = () => {
    if (!categories[currentCategoryIndex]) return null;
    const currentCategory = categories[currentCategoryIndex];
    return currentCategory.questions[currentQuestionIndex];
  };

  const handleAnswerSelect = async (optionId) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    try {
      setSaving(true);

      // Save response to backend
      await quizService.saveQuizResponse(currentQuestion.id, optionId);

      // Update local state
      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));

      setSaving(false);

      // Show success animation briefly
      setShowSuccess(true);

      // Animate to next question after success animation
      setTimeout(() => {
        setShowSuccess(false);
        animateToNextQuestion();
      }, 800);

    } catch (error) {
      console.error('Error saving response:', error);
      setSaving(false);
    }
  };

  const animateToNextQuestion = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Move to next question after animation starts
    setTimeout(() => {
      moveToNextQuestion();
    }, 150);
  };

  const moveToNextQuestion = () => {
    const currentCategory = categories[currentCategoryIndex];
    if (!currentCategory) return;

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      // Next question in same category
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Next category
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Quiz complete
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    try {
      await quizService.calculatePersonalityProfile();
      navigation.navigate('QuizResults');
    } catch (error) {
      console.error('Error calculating personality profile:', error);
    }
  };

  const renderProgressBar = () => (
    <View style={{
      paddingHorizontal: 32,
      paddingVertical: 20,
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
          Personality Assessment
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
        }}>
          {Math.round(progress)}% Complete
        </Text>
      </View>
      
      <View style={{
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <Animated.View style={{
          height: '100%',
          backgroundColor: COLORS.accent,
          borderRadius: 3,
          width: `${progress}%`,
        }} />
      </View>
    </View>
  );

  const renderQuestion = () => {
    const currentQuestion = getCurrentQuestion();
    const currentCategory = categories[currentCategoryIndex];
    
    if (!currentQuestion || !currentCategory) return null;

    return (
      <Animated.View style={{
        transform: [{ translateX: slideAnim }],
        flex: 1,
      }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 32, 
            paddingVertical: 40,
            minHeight: '100%',
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Category Badge */}
          <View style={{
            alignSelf: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: `${COLORS.accent}15`,
            borderRadius: 20,
            marginBottom: 32,
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: COLORS.accent,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              {currentCategory.name}
            </Text>
          </View>

          {/* Question */}
          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            textAlign: 'center',
            lineHeight: 32,
            marginBottom: 48,
            paddingHorizontal: 16,
          }}>
            {currentQuestion.questionText}
          </Text>

          {/* Options */}
          <View style={{ gap: 16 }}>
            {currentQuestion.options.map((option, index) => (
              <AnimatedQuizButton
                key={option.id}
                onPress={() => handleAnswerSelect(option.id)}
                variant={responses[currentQuestion.id] === option.id ? 'primary' : 'secondary'}
                size="large"
                disabled={saving}
                style={{
                  shadowColor: COLORS.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '400',
                  color: responses[currentQuestion.id] === option.id
                    ? COLORS.background
                    : COLORS.text,
                  textAlign: 'center',
                  lineHeight: 22,
                }}>
                  {option.optionText}
                </Text>
              </AnimatedQuizButton>
            ))}
          </View>

          {/* Question Counter */}
          <View style={{
            alignItems: 'center',
            marginTop: 40,
          }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
            }}>
              Question {currentQuestionIndex + 1} of {currentCategory.questions.length}
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  if (loading) {
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
              textAlign: 'center',
            }}>
              Preparing your personality assessment...
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

        {/* Header */}
        <View style={{
          paddingTop: 20,
          paddingBottom: 16,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              BLONG Quiz
            </Text>
            
            <View style={{ width: 50 }} />
          </View>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Question Content */}
        {renderQuestion()}

        {/* Loading Animation */}
        <QuizLoadingAnimation
          visible={saving}
          type="saving"
          message="Saving your response..."
        />

        {/* Success Animation */}
        <QuizSuccessAnimation
          visible={showSuccess}
          message="Great choice!"
          onComplete={() => setShowSuccess(false)}
        />
      </SafeAreaView>
    </AppTransition>
  );
};

export default QuizScreen;
