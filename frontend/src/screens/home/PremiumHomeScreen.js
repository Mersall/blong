/**
 * BLONG Premium Home Screen
 * Sophisticated dashboard with premium widgets and insights
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
  RefreshControl,
  Dimensions,
  Haptics,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTransition } from '../../components/AppTransition';
import { PersonalityInsightsWidget, DateNotificationWidget, PhaseProgressionWidget } from '../../components/dashboard';
import QuizProgressCard from '../../components/quiz/QuizProgressCard';
import {
  useUserProfile,
  useCompletionStatus,
  useUserAnalytics
} from '../../services/api/userProfileApi';

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

const PremiumHomeScreen = ({
  userPreferences,
  user,
  navigation,
  userPhase,
  isProfileComplete,
  onNavigateToQuestionnaire,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [greeting, setGreeting] = useState('');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  // React Query hooks for data fetching
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useUserProfile();
  const { data: completionData, isLoading: completionLoading, refetch: refetchCompletion } = useCompletionStatus();
  const { data: analyticsData, refetch: refetchAnalytics } = useUserAnalytics();

  // Determine current user phase
  const currentUserPhase = userPhase ||
                           userProfile?.profile?.currentPhase ||
                           userPreferences?.phase?.id ||
                           'single';

  useEffect(() => {
    animateEntrance();
    setDynamicGreeting();
  }, []);

  const animateEntrance = () => {
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
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const setDynamicGreeting = () => {
    const hour = new Date().getHours();
    const firstName = userProfile?.profile?.firstName || user?.firstName || 'there';
    
    let timeGreeting = '';
    let emoji = '';
    
    if (hour < 12) {
      timeGreeting = 'Good morning';
      emoji = '🌅';
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
      emoji = '☀️';
    } else {
      timeGreeting = 'Good evening';
      emoji = '🌙';
    }
    
    setGreeting(`${timeGreeting}, ${firstName} ${emoji}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Haptic feedback
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await Promise.all([
        refetchProfile(),
        refetchCompletion(),
        refetchAnalytics(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  };

  const handlePersonalityInsightPress = (insight) => {
    navigation.navigate('PersonalityInsights', { insight });
  };

  const handleDatePress = (date) => {
    navigation.navigate('DateDetail', { date });
  };

  const handleScheduleDate = (suggestion) => {
    navigation.navigate('DateScheduling', { suggestion });
  };

  const handlePhasePress = () => {
    navigation.navigate('PhaseDetail', { phase: currentUserPhase });
  };

  const handleMilestonePress = (milestone) => {
    navigation.navigate('MilestoneDetail', { milestone });
  };

  // Mock data for demonstration
  const mockPersonalityData = {
    openness: 78,
    conscientiousness: 65,
    extraversion: 82,
    agreeableness: 71,
    neuroticism: 35,
  };

  const mockUpcomingDates = [
    {
      id: 1,
      title: 'Coffee & Conversation',
      type: 'coffee',
      venue: 'The Roastery, Downtown',
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      title: 'Art Gallery Opening',
      type: 'cultural',
      venue: 'Modern Art Museum',
      scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const mockDateRecommendations = [
    {
      id: 1,
      title: 'Cooking Class for Two',
      type: 'activity',
      description: 'Learn to make Italian pasta together',
      estimatedCost: '$120',
      duration: '3 hours',
    },
    {
      id: 2,
      title: 'Sunset Hiking Trail',
      type: 'outdoor',
      description: 'Scenic hike with city views',
      estimatedCost: 'Free',
      duration: '2 hours',
    },
  ];

  const mockMilestones = [
    { id: 1, title: 'Complete personality assessment', completed: true },
    { id: 2, title: 'Upload quality photos', completed: true },
    { id: 3, title: 'Write compelling bio', completed: false },
    { id: 4, title: 'Set dating preferences', completed: false },
    { id: 5, title: 'Complete first date', completed: false },
  ];

  const phaseProgress = completionData?.phases?.[currentUserPhase]?.progress || 65;

  const renderQuickActions = () => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 24,
      gap: 12,
    }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Quiz')}
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 8 }}>🧠</Text>
        <Text style={{
          fontSize: 12,
          fontWeight: '500',
          color: COLORS.text,
          textAlign: 'center',
        }}>
          Take Quiz
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Dates')}
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 8 }}>💝</Text>
        <Text style={{
          fontSize: 12,
          fontWeight: '500',
          color: COLORS.text,
          textAlign: 'center',
        }}>
          Browse Dates
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Matches')}
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 8 }}>✨</Text>
        <Text style={{
          fontSize: 12,
          fontWeight: '500',
          color: COLORS.text,
          textAlign: 'center',
        }}>
          View Matches
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 8 }}>⚙️</Text>
        <Text style={{
          fontSize: 12,
          fontWeight: '500',
          color: COLORS.text,
          textAlign: 'center',
        }}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (profileLoading || completionLoading) {
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
              fontSize: 24,
              fontWeight: '300',
              letterSpacing: 6,
              color: COLORS.text,
              marginBottom: 16,
            }}>
              BLONG
            </Text>
            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
            }}>
              Preparing your premium experience...
            </Text>
          </View>
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
              paddingBottom: 16,
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
              marginBottom: 24,
            }}>
              <View>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '300',
                  letterSpacing: 4,
                  color: COLORS.text,
                  marginBottom: 4,
                }}>
                  BLONG
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                }}>
                  {greeting}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: COLORS.surface,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text style={{ fontSize: 16 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Main Content */}
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={COLORS.accent}
                  colors={[COLORS.accent]}
                />
              }
            >
              {/* Phase Progress Widget */}
              <PhaseProgressionWidget
                currentPhase={currentUserPhase}
                progress={phaseProgress}
                milestones={mockMilestones}
                onPhasePress={handlePhasePress}
                onMilestonePress={handleMilestonePress}
                style={{ marginBottom: 24 }}
              />

              {/* Quick Actions */}
              {renderQuickActions()}

              {/* Date Notifications Widget */}
              <DateNotificationWidget
                upcomingDates={mockUpcomingDates}
                dateRecommendations={mockDateRecommendations}
                onDatePress={handleDatePress}
                onScheduleDate={handleScheduleDate}
                userPhase={currentUserPhase}
                style={{ marginBottom: 24 }}
              />

              {/* Personality Insights Widget */}
              <PersonalityInsightsWidget
                personalityData={mockPersonalityData}
                onPress={handlePersonalityInsightPress}
                style={{ marginBottom: 24 }}
              />

              {/* Quiz Progress Card */}
              <QuizProgressCard 
                navigation={navigation}
                style={{ marginBottom: 24 }}
              />

              {/* Recent Activity */}
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
                marginBottom: 24,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginBottom: 16,
                }}>
                  Recent Activity
                </Text>

                <View style={{
                  alignItems: 'center',
                  paddingVertical: 20,
                }}>
                  <Text style={{ fontSize: 32, marginBottom: 12 }}>📊</Text>
                  <Text style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                  }}>
                    Your activity and insights will appear here
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    </AppTransition>
  );
};

export default PremiumHomeScreen;