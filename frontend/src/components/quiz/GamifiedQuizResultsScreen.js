/**
 * BLONG Gamified Quiz Results Screen
 * Beautiful personality results with interactive charts and insights
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import components
import PersonalityRadarChart from './PersonalityRadarChart';
import PersonalityInsightCard from './PersonalityInsightCard';
import AchievementBadge from './AchievementBadge';
import PersonalityBadges from './PersonalityBadges';
import CompatibilityExplanation from './CompatibilityExplanation';
import GrowthRecommendations from './GrowthRecommendations';
import { PremiumLoader } from '../loading';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GamifiedQuizResultsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { session, personalityProfile, achievements } = route.params || {};
  
  // State management
  const [loading, setLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [celebrationComplete, setCelebrationComplete] = useState(false);
  
  // Animation values
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const celebrationAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnimation, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Celebration sequence
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(celebrationAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(celebrationAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setCelebrationComplete(true));
    }, 1000);
  }, []);

  const handleShare = async () => {
    try {
      const shareContent = generateShareContent();
      await Share.share({
        message: shareContent,
        title: 'My BLONG Personality Results',
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const generateShareContent = () => {
    const traits = personalityProfile?.personalityTraits?.slice(0, 3) || [];
    const loveLanguage = personalityProfile?.primaryLoveLanguage?.replace(/_/g, ' ') || '';
    const attachmentStyle = personalityProfile?.attachmentStyle || '';

    return `Just discovered my personality profile on BLONG! 🎯\n\n` +
      `My top traits: ${traits.join(', ')}\n` +
      `Love Language: ${loveLanguage}\n` +
      `Attachment Style: ${attachmentStyle}\n\n` +
      `Find your perfect match with science-backed compatibility! #BLONG #PersonalityMatching`;
  };

  const handleRetakeQuiz = () => {
    navigation.navigate('QuizCategories');
  };

  const handleViewMatches = () => {
    navigation.navigate('Matches');
  };

  const handleInsightSelect = (insight) => {
    setSelectedInsight(insight);
    setShowDetailedView(true);
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnimation,
          transform: [
            { translateY: slideAnimation },
            { scale: scaleAnimation },
          ],
        },
      ]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Your Personality Profile</Text>
        <Text style={styles.headerSubtitle}>
          Completed in {Math.round(session?.timeSpent / 60)} minutes
        </Text>
        
        {/* Achievement celebration */}
        <Animated.View
          style={[
            styles.achievementCelebration,
            { opacity: celebrationAnimation },
          ]}
        >
          <Text style={styles.celebrationText}>🎉 Profile Complete! 🎉</Text>
          <Text style={styles.celebrationSubtext}>
            You've unlocked {achievements?.length || 0} achievements
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderPersonalityOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personality Overview</Text>
      
      {/* Big Five Radar Chart */}
      <View style={styles.chartContainer}>
        <PersonalityRadarChart
          data={{
            openness: Math.round(personalityProfile?.openness * 100) || 0,
            conscientiousness: Math.round(personalityProfile?.conscientiousness * 100) || 0,
            extraversion: Math.round(personalityProfile?.extraversion * 100) || 0,
            agreeableness: Math.round(personalityProfile?.agreeableness * 100) || 0,
            emotionalStability: Math.round((1 - (personalityProfile?.neuroticism || 0)) * 100),
          }}
          size={280}
          animated={true}
        />
      </View>

      {/* Personality Badges */}
      <PersonalityBadges
        traits={personalityProfile?.personalityTraits || []}
        loveLanguage={personalityProfile?.primaryLoveLanguage}
        attachmentStyle={personalityProfile?.attachmentStyle}
        style={styles.badgeCollection}
      />
    </View>
  );

  const renderKeyInsights = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Key Insights</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.insightsContainer}
      >
        {personalityProfile?.insights?.map((insight, index) => (
          <PersonalityInsightCard
            key={insight.id || index}
            insight={insight}
            onPress={() => handleInsightSelect(insight)}
            style={styles.insightCard}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Achievements Unlocked</Text>
      
      <View style={styles.achievementsGrid}>
        {achievements?.map((achievement, index) => (
          <AchievementBadge
            key={index}
            achievement={achievement}
            animated={true}
            delay={index * 200}
            style={styles.achievementBadge}
          />
        ))}
      </View>
    </View>
  );

  const renderCompatibilityPreview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Compatibility Preview</Text>
      
      <CompatibilityExplanation
        personalityProfile={personalityProfile}
        onViewMatches={handleViewMatches}
        style={styles.compatibilityContainer}
      />
    </View>
  );

  const renderGrowthSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Growth Opportunities</Text>
      
      <GrowthRecommendations
        personalityProfile={personalityProfile}
        style={styles.growthContainer}
      />
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={handleShare}
      >
        <Ionicons name="share-outline" size={20} color="#667eea" />
        <Text style={styles.secondaryButtonText}>Share Results</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, styles.tertiaryButton]}
        onPress={handleRetakeQuiz}
      >
        <Ionicons name="refresh-outline" size={20} color="#6c757d" />
        <Text style={styles.tertiaryButtonText}>Retake Quiz</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={handleViewMatches}
      >
        <Ionicons name="heart" size={20} color="white" />
        <Text style={styles.primaryButtonText}>Find Matches</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <PremiumLoader message="Generating your personality insights..." />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        
        <View style={styles.content}>
          {renderPersonalityOverview()}
          {renderKeyInsights()}
          {renderAchievements()}
          {renderCompatibilityPreview()}
          {renderGrowthSection()}
        </View>
        
        {renderActionButtons()}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
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
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  achievementCelebration: {
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  celebrationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  celebrationSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  badgeCollection: {
    marginTop: 16,
  },
  insightsContainer: {
    paddingRight: 20,
  },
  insightCard: {
    marginRight: 16,
    width: 280,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementBadge: {
    width: (screenWidth - 60) / 2,
    marginBottom: 16,
  },
  compatibilityContainer: {
    marginBottom: 16,
  },
  growthContainer: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tertiaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 16,
  },
  tertiaryButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default GamifiedQuizResultsScreen;