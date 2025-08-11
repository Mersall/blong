/**
 * BLONG Gamified Quiz Screen
 * Premium personality assessment experience with animations and gamification
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import services
import quizService from '../../services/quizService';
import { useLoading } from '../../hooks/useLoading';

// Import components
import { PremiumLoader } from '../loading';
import ParticleSystem from './ParticleSystem';
import AchievementPopup from './AchievementPopup';
import QuizProgressBar from './QuizProgressBar';
import PremiumQuizQuestion from './PremiumQuizQuestion';
import QuizSessionTimer from './QuizSessionTimer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GamifiedQuizScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setLoading } = useLoading();
  
  // Extract params
  const { categoryId, sessionToken: existingSessionToken } = route.params || {};
  
  // State management
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [particleActive, setParticleActive] = useState(false);
  
  // Animation values
  const cardTranslateX = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  
  // Initialize quiz session
  useEffect(() => {
    initializeQuizSession();
  }, []);
  
  const initializeQuizSession = async () => {
    try {
      setLoading(true, 'Starting your personality journey...');
      
      let sessionData;
      
      if (existingSessionToken) {
        // Resume existing session
        sessionData = await quizService.resumeQuizSession(existingSessionToken);
      } else {
        // Start new session
        sessionData = await quizService.startQuizSession(categoryId);
      }
      
      setSession(sessionData);
      setCurrentQuestion(sessionData.nextQuestion);
      setQuestionStartTime(Date.now());
      
      // Animate progress bar
      Animated.timing(progressAnimation, {
        toValue: sessionData.progressPercentage / 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
    } catch (error) {
      console.error('Error initializing quiz session:', error);
      Alert.alert('Error', 'Failed to start quiz session. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    // Animate selection
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Haptic feedback
    Vibration.vibrate(10);
    
    // Auto-submit after selection
    setTimeout(() => {
      handleSubmitAnswer(option);
    }, 800);
  };
  
  const handleSubmitAnswer = async (option = selectedOption) => {
    if (!option || !session || !currentQuestion) return;
    
    try {
      setLoading(true, 'Processing your answer...');
      
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      
      const response = await quizService.answerQuestionInSession(
        session.sessionToken,
        currentQuestion.id,
        option.id,
        timeSpent
      );
      
      // Handle achievements
      if (response.achievements && response.achievements.length > 0) {
        handleNewAchievements(response.achievements);
      }
      
      // Update session and progress
      setSession(response.session);
      
      // Animate progress
      Animated.timing(progressAnimation, {
        toValue: response.progressData.percentage / 100,
        duration: 800,
        useNativeDriver: false,
      }).start();
      
      if (response.nextQuestion) {
        // Move to next question with smooth transition
        await animateQuestionTransition();
        setCurrentQuestion(response.nextQuestion);
        setSelectedOption(null);
        setQuestionStartTime(Date.now());
      } else {
        // Quiz completed!
        handleQuizComplete(response);
      }
      
    } catch (error) {
      console.error('Error submitting answer:', error);
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const animateQuestionTransition = () => {
    return new Promise((resolve) => {
      // Slide out current question
      Animated.parallel([
        Animated.timing(cardTranslateX, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset position for new question
        cardTranslateX.setValue(screenWidth);
        cardScale.setValue(0.8);
        
        // Slide in new question
        Animated.parallel([
          Animated.timing(cardTranslateX, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(cardScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(resolve);
      });
    });
  };
  
  const handleNewAchievements = (newAchievements) => {
    setAchievements(prev => [...prev, ...newAchievements]);
    
    // Show achievement popup
    if (newAchievements.length > 0) {
      setCurrentAchievement(newAchievements[0]);
      setShowAchievement(true);
      setParticleActive(true);
      
      // Celebrate with animation
      Animated.sequence([
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(celebrationOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setParticleActive(false);
      });
      
      // Haptic feedback
      Vibration.vibrate([0, 100, 50, 100]);
      
      // Auto-hide achievement after 3 seconds
      setTimeout(() => {
        setShowAchievement(false);
      }, 3000);
    }
  };
  
  const handleQuizComplete = async (response) => {
    try {
      setLoading(true, 'Analyzing your personality...');
      
      // Show completion celebration
      setParticleActive(true);
      
      Animated.timing(celebrationOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Navigate to results with delay for animation
      setTimeout(() => {
        navigation.replace('QuizResults', {
          session: response.session,
          personalityProfile: response.personalityProfile,
          achievements: response.achievements,
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error completing quiz:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleSkipQuestion = async () => {
    // Implementation for skipping questions
    // This would depend on your business logic
  };
  
  const getProgressColor = (progress) => {
    if (progress < 0.3) return ['#FF6B6B', '#FF8E8E']; // Red gradient
    if (progress < 0.7) return ['#FFD93D', '#FFED4E']; // Yellow gradient
    return ['#4ECDC4', '#6BCF7F']; // Green gradient
  };
  
  if (!session || !currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <PremiumLoader message="Preparing your personality assessment..." />
      </View>
    );
  }
  
  const progressColors = getProgressColor(session.progressPercentage / 100);
  
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      {/* Particle System for Celebrations */}
      {particleActive && (
        <ParticleSystem
          active={particleActive}
          particleCount={50}
          colors={['#FFD700', '#FF69B4', '#00CED1', '#98FB98']}
        />
      )}
      
      {/* Header with Progress */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.categoryTitle}>
            {session.category?.name || 'Personality Assessment'}
          </Text>
          <QuizSessionTimer 
            startTime={session.startedAt}
            style={styles.timer}
          />
        </View>
        
        <QuizProgressBar
          progress={session.progressPercentage / 100}
          colors={progressColors}
          style={styles.progressBar}
          animatedValue={progressAnimation}
        />
        
        <Text style={styles.progressText}>
          Question {session.answeredQuestions + 1} of {session.totalQuestions}
        </Text>
      </View>
      
      {/* Quiz Card */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX: cardTranslateX },
              { scale: cardScale },
            ],
          },
        ]}
      >
        <PremiumQuizQuestion
          question={currentQuestion}
          selectedAnswer={selectedOption}
          onAnswer={handleOptionSelect}
          style={styles.quizCard}
        />
      </Animated.View>
      
      {/* Achievement Popup */}
      {showAchievement && currentAchievement && (
        <AchievementPopup
          achievement={currentAchievement}
          visible={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
      
      {/* Celebration Overlay */}
      <Animated.View
        style={[
          styles.celebrationOverlay,
          { opacity: celebrationOpacity },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.celebrationText}>🎉 Great Progress! 🎉</Text>
      </Animated.View>
      
      {/* Floating Action Hints */}
      <View style={styles.actionHints}>
        <View style={styles.hintContainer}>
          <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.7)" />
          <Text style={styles.hintText}>Swipe left to skip</Text>
        </View>
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>Swipe right to continue</Text>
          <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  progressBar: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  quizCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: screenHeight * 0.4,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  celebrationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  actionHints: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hintText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 6,
  },
});

export default GamifiedQuizScreen;