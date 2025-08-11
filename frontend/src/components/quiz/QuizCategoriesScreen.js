/**
 * BLONG Quiz Categories Screen
 * Navigate between different personality assessment categories with progress tracking
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import services
import gamifiedQuizService from '../../services/gamifiedQuizService';
import { useLoading } from '../../hooks/useLoading';

// Import components
import { PremiumLoader } from '../loading';
import QuizProgressBar from './QuizProgressBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QuizCategoryCard = ({ category, onPress, index, animated = true }) => {
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(scaleAnimation, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 150);
    } else {
      scaleAnimation.setValue(1);
      fadeAnimation.setValue(1);
    }
  }, [animated, index]);

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'BIG_FIVE':
        return 'person';
      case 'LOVE_LANGUAGES':
        return 'heart';
      case 'ATTACHMENT_STYLE':
        return 'people';
      case 'SCENARIO_BASED':
        return 'list';
      default:
        return 'help-circle';
    }
  };

  const getCategoryGradient = (type) => {
    switch (type) {
      case 'BIG_FIVE':
        return ['#667eea', '#764ba2'];
      case 'LOVE_LANGUAGES':
        return ['#ff6b6b', '#feca57'];
      case 'ATTACHMENT_STYLE':
        return ['#48cae4', '#023e8a'];
      case 'SCENARIO_BASED':
        return ['#a8e6cf', '#3d5a80'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100) return ['#06ffa5', '#00d4aa']; // Complete - green
    if (percentage >= 50) return ['#ffd23f', '#ff6b35']; // In progress - orange
    if (percentage > 0) return ['#4facfe', '#00f2fe']; // Started - blue
    return ['#e9ecef', '#dee2e6']; // Not started - gray
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress(category);
  };

  const progress = category.progress || {};
  const progressPercentage = progress.progressPercentage || 0;

  return (
    <Animated.View
      style={[
        styles.categoryCard,
        {
          opacity: fadeAnimation,
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.cardTouchable}
      >
        <BlurView intensity={20} style={styles.cardBlur}>
          <LinearGradient
            colors={getCategoryGradient(category.type)}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={getCategoryIcon(category.type)}
                  size={28}
                  color="white"
                />
              </View>
              
              {progress.isComplete && (
                <View style={styles.completeBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#06ffa5" />
                </View>
              )}
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {category.description}
              </Text>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {progress.answeredQuestions || 0}
                  </Text>
                  <Text style={styles.statLabel}>Answered</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {progress.totalQuestions || 0}
                  </Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {Math.round((category.questions?.length || 0) * 2.5)}m
                  </Text>
                  <Text style={styles.statLabel}>Est. Time</Text>
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <QuizProgressBar
                progress={progressPercentage / 100}
                colors={getProgressColor(progressPercentage)}
                height={6}
                style={styles.progressBar}
              />
              
              <Text style={styles.progressText}>
                {progressPercentage}% Complete
              </Text>
            </View>

            {/* Action Button */}
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>
                {progress.isComplete 
                  ? 'Review Results' 
                  : progressPercentage > 0 
                    ? 'Continue Quiz' 
                    : 'Start Assessment'
                }
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color="rgba(255,255,255,0.8)" 
              />
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuizCategoriesScreen = () => {
  const navigation = useNavigation();
  const { setLoading } = useLoading();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [incompleteSessions, setIncompleteSessions] = useState([]);

  // Animation values
  const headerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCategories();
    checkIncompleteSessions();
    
    // Header animation
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true, 'Loading personality assessments...');
      
      const [categoriesData, progressData] = await Promise.all([
        gamifiedQuizService.getQuizCategoriesWithProgress(),
        gamifiedQuizService.getQuizProgress(),
      ]);
      
      setCategories(categoriesData);
      setOverallProgress(progressData.overallProgress || 0);
      
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIncompleteSessions = () => {
    const sessions = gamifiedQuizService.getIncompleteSessions();
    setIncompleteSessions(sessions);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    checkIncompleteSessions();
    setRefreshing(false);
  };

  const handleCategoryPress = (category) => {
    const progress = category.progress || {};
    
    if (progress.isComplete) {
      // Navigate to results
      navigation.navigate('QuizResults', { categoryId: category.id });
    } else {
      // Start or continue quiz
      navigation.navigate('GamifiedQuiz', { categoryId: category.id });
    }
  };

  const handleResumeSession = (session) => {
    navigation.navigate('GamifiedQuiz', { 
      sessionToken: session.sessionToken 
    });
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerAnimation,
          transform: [{
            translateY: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        },
      ]}
    >
      <Text style={styles.headerTitle}>Personality Assessment</Text>
      <Text style={styles.headerSubtitle}>
        Discover your unique personality profile through science-backed assessments
      </Text>
      
      {/* Overall Progress */}
      <View style={styles.overallProgressContainer}>
        <Text style={styles.overallProgressLabel}>Overall Progress</Text>
        <QuizProgressBar
          progress={overallProgress / 100}
          colors={['#667eea', '#764ba2']}
          height={8}
          showPercentage={true}
          style={styles.overallProgressBar}
        />
      </View>
    </Animated.View>
  );

  const renderIncompleteSessions = () => {
    if (incompleteSessions.length === 0) return null;

    return (
      <View style={styles.sessionsContainer}>
        <Text style={styles.sectionTitle}>Resume Your Journey</Text>
        
        {incompleteSessions.map((session, index) => (
          <TouchableOpacity
            key={session.sessionToken}
            style={styles.sessionCard}
            onPress={() => handleResumeSession(session)}
          >
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>
                {session.category?.name || 'Personality Assessment'}
              </Text>
              <Text style={styles.sessionProgress}>
                {session.answeredQuestions} of {session.totalQuestions} questions
              </Text>
            </View>
            <Ionicons name="play-circle" size={32} color="#667eea" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>Assessment Categories</Text>
      
      {categories.map((category, index) => (
        <QuizCategoryCard
          key={category.id}
          category={category}
          onPress={handleCategoryPress}
          index={index}
          animated={true}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="white"
            colors={['white']}
          />
        }
      >
        {renderHeader()}
        {renderIncompleteSessions()}
        {renderCategories()}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  overallProgressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  overallProgressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  overallProgressBar: {
    marginBottom: 8,
  },
  sessionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  sessionProgress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardTouchable: {
    borderRadius: 16,
  },
  cardBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    minHeight: 200,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 4,
  },
  cardContent: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginRight: 6,
  },
});

export default QuizCategoriesScreen;