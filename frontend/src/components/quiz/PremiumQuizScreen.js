/**
 * BLONG Premium Quiz Screen
 * Enhanced quiz experience with swipe navigation and gamification
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
  Haptics,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTransition } from '../AppTransition';
import PremiumQuizQuestion from './PremiumQuizQuestion';
import PremiumQuizProgressTracker from './PremiumQuizProgressTracker';
import QuizLoadingAnimation from './QuizLoadingAnimation';
import QuizSuccessAnimation from './QuizSuccessAnimation';
import { ExperienceBar, AchievementPopup, StreakCounter, ACHIEVEMENTS } from './GamificationSystem';
import quizService from '../../services/quizService';

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
};

const PremiumQuizScreen = ({ navigation, route }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardStackAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadQuizData();
    animateEntrance();
  }, []);

  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardStackAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadQuizData = async () => {
    try {
      setLoading(true);
      const [categoriesData, existingResponses, userStats] = await Promise.all([
        quizService.getQuizCategories(),
        quizService.getUserQuizResponses(),
        quizService.getUserStats(),
      ]);

      // Flatten questions from all categories
      const allQuestions = categoriesData.reduce((acc, category) => {
        return acc.concat(
          category.questions.map(q => ({
            ...q,
            categoryName: category.name,
            categoryId: category.id,
          }))
        );
      }, []);

      setQuizData(allQuestions);
      
      // Convert existing responses to our format
      const responseMap = {};
      existingResponses.forEach(response => {
        responseMap[response.question.id] = response.selectedOption.id;
      });
      setResponses(responseMap);

      // Set user stats
      setUserLevel(userStats.level || 1);
      setExperience(userStats.experience || 0);
      setStreak(userStats.streak || 0);
      setAchievements(userStats.achievements || []);

    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForAchievements = (questionIndex, totalQuestions) => {
    const newAchievements = [];
    
    // First question achievement
    if (questionIndex === 0) {
      newAchievements.push(ACHIEVEMENTS.FIRST_QUESTION);
    }
    
    // Streak achievements
    if (streak >= 5) {
      newAchievements.push(ACHIEVEMENTS.STREAK_5);
    }
    
    // Half way achievement
    if (questionIndex === Math.floor(totalQuestions / 2)) {
      newAchievements.push(ACHIEVEMENTS.HALF_WAY);
    }
    
    // Completion achievement
    if (questionIndex === totalQuestions - 1) {
      newAchievements.push(ACHIEVEMENTS.PERFECTIONIST);
    }
    
    return newAchievements;
  };

  const showAchievementPopup = (achievement) => {
    setCurrentAchievement(achievement);
    setShowAchievement(true);
    
    // Haptic feedback
    if (Haptics?.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleAnswerSelect = async (questionId, optionId) => {
    if (saving) return;

    try {
      setSaving(true);

      // Haptic feedback
      if (Haptics?.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Save response to backend
      const result = await quizService.saveQuizResponse(questionId, optionId);

      // Update local state
      setResponses(prev => ({
        ...prev,
        [questionId]: optionId,
      }));

      // Update streak and answered questions
      setStreak(prev => prev + 1);
      setAnsweredQuestions(prev => prev + 1);

      // Check for achievements
      const newAchievements = checkForAchievements(currentQuestionIndex, quizData.length);
      if (newAchievements.length > 0) {
        const achievement = newAchievements[0]; // Show first achievement
        setAchievements(prev => [...prev, ...newAchievements]);
        showAchievementPopup(achievement);
        
        // Add experience points
        setExperience(prev => prev + achievement.points);
      } else {
        // Base experience for answering
        setExperience(prev => prev + 10);
      }

      // Update experience and check for level up
      if (result.experienceGained) {
        setExperience(prev => prev + result.experienceGained);
      }

      if (result.achievements) {
        setAchievements(prev => [...prev, ...result.achievements]);
      }

      // Check for level up
      const nextLevelXP = userLevel * 100;
      if (experience >= nextLevelXP) {
        setUserLevel(prev => prev + 1);
        setExperience(0); // Reset experience for next level
        
        // Show level up animation
        if (Haptics?.notificationAsync) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);

    } catch (error) {
      console.error('Error saving response:', error);
      // Reset streak on error
      setStreak(0);
    } finally {
      setSaving(false);
    }
  };

  const handleSwipeComplete = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    try {
      const result = await quizService.calculatePersonalityProfile();
      
      // Haptic feedback for completion
      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      navigation.navigate('QuizResults', {
        personalityProfile: result.profile,
        achievements: result.achievements,
        stats: result.stats,
      });
    } catch (error) {
      console.error('Error calculating personality profile:', error);
    }
  };

  const renderQuestionStack = () => {
    const visibleCards = 3;
    const currentQuestion = quizData[currentQuestionIndex];
    
    if (!currentQuestion) return null;

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
      }}>
        {/* Stack of upcoming questions (background cards) */}
        {Array.from({ length: Math.min(visibleCards, quizData.length - currentQuestionIndex) }).map((_, index) => {
          if (index === 0) return null; // Skip current card
          
          const questionIndex = currentQuestionIndex + index;
          const question = quizData[questionIndex];
          
          if (!question) return null;

          return (
            <View
              key={`bg-${questionIndex}`}
              style={{
                position: 'absolute',
                width: screenWidth - 64 - (index * 8),
                height: screenHeight * 0.6 - (index * 16),
                backgroundColor: COLORS.surface,
                borderRadius: 20,
                zIndex: visibleCards - index,
                opacity: 0.3 - (index * 0.1),
                transform: [
                  { translateY: index * 8 },
                  { scale: 1 - (index * 0.02) },
                ],
              }}
            />
          );
        })}

        {/* Current question card */}
        <PremiumQuizQuestion
          question={{
            text: currentQuestion.questionText,
            options: currentQuestion.options.map(opt => ({
              id: opt.id,
              text: opt.optionText,
            }))
          }}
          selectedAnswer={responses[currentQuestionIndex]}
          onAnswer={(answer) => handleAnswer(currentQuestionIndex, answer)}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quizData.length}
          disabled={saving}
          style={{
            zIndex: visibleCards + 1,
          }}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          <QuizLoadingAnimation
            visible={true}
            type="personality"
            message="Preparing your personality assessment..."
          />
        </SafeAreaView>
      </AppTransition>
    );
  }

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        {/* Gradient Background */}
        <LinearGradient
          colors={[COLORS.background, COLORS.surface]}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <Animated.View
            style={{
              paddingTop: 20,
              paddingHorizontal: 32,
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  padding: 8,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: COLORS.accent,
                  fontWeight: '500',
                }}>
                  ← Back
                </Text>
              </TouchableOpacity>

              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '300',
                  color: COLORS.text,
                  letterSpacing: 2,
                }}>
                  PERSONALITY
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  letterSpacing: 1,
                }}>
                  ASSESSMENT
                </Text>
              </View>

              <View style={{ width: 60 }} />
            </View>

            {/* Progress Tracker */}
            <PremiumQuizProgressTracker
              currentStep={currentQuestionIndex}
              totalSteps={quizData.length}
              categoryName={quizData[currentQuestionIndex]?.categoryName}
              achievements={achievements}
              level={userLevel}
              experience={experience}
              experienceToNextLevel={userLevel * 100}
            />

            {/* Streak Counter */}
            {streak > 2 && (
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <StreakCounter 
                  streak={streak}
                  showCelebration={streak >= 5}
                />
              </View>
            )}
          </Animated.View>

          {/* Question Stack */}
          <Animated.View
            style={{
              flex: 1,
              opacity: cardStackAnim,
              transform: [{
                scale: cardStackAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              }],
            }}
          >
            {renderQuestionStack()}
          </Animated.View>

          {/* Bottom Actions */}
          <Animated.View
            style={{
              paddingHorizontal: 32,
              paddingBottom: 20,
              opacity: headerAnim,
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
            }}>
              <TouchableOpacity
                onPress={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(prev => prev - 1);
                  }
                }}
                disabled={currentQuestionIndex === 0}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 20,
                  backgroundColor: currentQuestionIndex === 0 
                    ? COLORS.border 
                    : COLORS.surface,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                }}
              >
                <Text style={{
                  color: COLORS.textSecondary,
                  fontSize: 12,
                  fontWeight: '500',
                }}>
                  Previous
                </Text>
              </TouchableOpacity>

              <View style={{
                flex: 1,
                height: 1,
                backgroundColor: COLORS.border,
              }} />

              <TouchableOpacity
                onPress={() => handleSwipeComplete()}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 20,
                  backgroundColor: COLORS.accent,
                }}
              >
                <Text style={{
                  color: COLORS.background,
                  fontSize: 12,
                  fontWeight: '500',
                }}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>

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

        {/* Achievement Popup */}
        <AchievementPopup
          achievement={currentAchievement}
          visible={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
      </SafeAreaView>
    </AppTransition>
  );
};

export default PremiumQuizScreen;