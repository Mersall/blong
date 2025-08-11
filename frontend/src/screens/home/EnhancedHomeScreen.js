/**
 * BLONG Enhanced Home Screen
 * Premium dashboard with sophisticated UX and phase-specific features
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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTransition } from '../../components/AppTransition';
import { PersonalityInsightsWidget, DateNotificationWidget, PhaseProgressionWidget } from '../../components/dashboard';
import QuizProgressCard from '../../components/quiz/QuizProgressCard';
import { ExperienceBar, ProgressRing } from '../../components/quiz/GamificationSystem';
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
  gradient: {
    primary: ['#FF6B35', '#FF8A65'],
    secondary: ['#FAFAFA', '#FFFFFF'],
    accent: ['#FFD700', '#FFA000'],
  },
};

const EnhancedHomeScreen = ({
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
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(150);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const quickActionsAnim = useRef(new Animated.Value(0)).current;

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
    initializeUserStats();
  }, []);

  const initializeUserStats = () => {
    // Initialize user level and experience from profile data
    const profile = userProfile?.profile;
    if (profile) {
      setUserLevel(profile.level || 1);
      setUserXP(profile.experience || 150);
    }
  };

  const animateEntrance = () => {
    Animated.stagger(100, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
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
  };

  const setDynamicGreeting = () => {
    const hour = new Date().getHours();
    const firstName = userProfile?.profile?.firstName || user?.firstName || 'there';
    
    let timeGreeting = '';
    let emoji = '';
    let motivation = '';
    
    if (hour < 12) {
      timeGreeting = 'Good morning';
      emoji = '🌅';
      motivation = 'Start your day with intention';
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
      emoji = '☀️';
      motivation = 'Make the most of today';
    } else {
      timeGreeting = 'Good evening';
      emoji = '🌙';
      motivation = 'Reflect and connect';
    }
    
    setGreeting(`${timeGreeting}, ${firstName} ${emoji}\n${motivation}`);
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

  const handleQuickActionToggle = () => {
    const toValue = showQuickActions ? 0 : 1;
    setShowQuickActions(!showQuickActions);

    Animated.spring(quickActionsAnim, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const quickActions = [
    {
      id: 'quiz',
      icon: '🧠',
      title: 'Take Quiz',
      subtitle: 'Discover insights',
      color: COLORS.accent,
      action: () => navigation.navigate('Quiz'),
    },
    {
      id: 'dates',
      icon: '💝',
      title: 'Browse Dates',
      subtitle: 'Find your match',
      color: COLORS.success,
      action: () => navigation.navigate('Dates'),
    },
    {
      id: 'matches',
      icon: '✨',
      title: 'View Matches',
      subtitle: 'Connect with others',
      color: COLORS.warning,
      action: () => navigation.navigate('Matches'),
    },
    {
      id: 'profile',
      icon: '👤',
      title: 'Edit Profile',
      subtitle: 'Update details',
      color: COLORS.textSecondary,
      action: () => navigation.navigate('Profile'),
    },
  ];

  const renderQuickActionsGrid = () => (
    <Animated.View
      style={{
        opacity: quickActionsAnim,
        transform: [{
          scale: quickActionsAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        }],
        marginVertical: 16,
      }}
    >
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.action}
            style={{
              width: (screenWidth - 76) / 2,
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.border,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${action.color}15`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 20 }}>{action.icon}</Text>
            </View>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 4,
            }}>
              {action.title}
            </Text>
            <Text style={{
              fontSize: 10,
              color: COLORS.textSecondary,
              textAlign: 'center',
            }}>
              {action.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderHeader = () => (
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
        alignItems: 'flex-start',
        marginBottom: 24,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            letterSpacing: 4,
            color: COLORS.text,
            marginBottom: 8,
          }}>
            BLONG
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 18,
          }}>
            {greeting}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
          {/* Experience Level Indicator */}
          <View style={{
            alignItems: 'center',
          }}>
            <ExperienceBar
              currentXP={userXP}
              level={userLevel}
              nextLevelXP={userLevel * 100}
              showAnimation={false}
            />
          </View>

          {/* Settings Button */}
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
      </View>

      {/* Quick Actions Toggle */}
      <TouchableOpacity
        onPress={handleQuickActionToggle}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.accent,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 20,
          shadowColor: COLORS.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text style={{
          color: COLORS.background,
          fontSize: 14,
          fontWeight: '600',
          marginRight: 8,
        }}>
          {showQuickActions ? 'Hide' : 'Show'} Quick Actions
        </Text>
        <Animated.View
          style={{
            transform: [{
              rotate: quickActionsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            }],
          }}
        >
          <Text style={{ color: COLORS.background, fontSize: 12 }}>▼</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
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
            <LinearGradient
              colors={COLORS.gradient.primary}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Text style={{
                fontSize: 24,
                fontWeight: '300',
                letterSpacing: 2,
                color: COLORS.background,
              }}>
                B
              </Text>
            </LinearGradient>
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
          colors={COLORS.gradient.secondary}
          style={{ flex: 1 }}
        >
          {/* Header */}
          {renderHeader()}

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
              {/* Quick Actions Grid */}
              {showQuickActions && renderQuickActionsGrid()}

              {/* Phase Progress Widget */}
              <PhaseProgressionWidget
                currentPhase={currentUserPhase}
                progress={phaseProgress}
                milestones={mockMilestones}
                onPhasePress={handlePhasePress}
                onMilestonePress={handleMilestonePress}
                style={{ marginBottom: 24 }}
              />

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
                  <ProgressRing
                    progress={3}
                    total={10}
                    size={80}
                    color={COLORS.accent}
                  />
                  <Text style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                    marginTop: 12,
                  }}>
                    3 activities completed this week
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

export default EnhancedHomeScreen;