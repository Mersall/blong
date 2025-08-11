import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTransition } from '../../components/AppTransition';
import { useTheme } from '../../contexts/AppContext';
import DatePreparationCard from '../../components/dates/DatePreparationCard';
import QuizProgressCard from '../../components/quiz/QuizProgressCard';
import {
  useUserProfile,
  useCompletionStatus,
  useQuestionnaireData,
  useUserAnalytics
} from '../../services/api/userProfileApi';

// Elite color system - matching onboarding design
const COLORS = {
  // Pure minimalist backgrounds
  background: '#FFFFFF',      // Pure white for maximum elegance
  surface: '#FAFAFA',         // Subtle off-white for cards

  // Elite text hierarchy
  text: '#0A0A0A',           // Deep black for maximum contrast
  textSecondary: '#6B6B6B',  // Sophisticated gray
  textTertiary: '#9E9E9E',   // Light gray for subtle text

  // Premium accent colors
  accent: '#FF6B35',         // Vibrant coral for actions
  border: '#E0E0E0',         // Subtle borders
  shadow: '#000000',         // Pure black shadows

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
};

const HomeScreen = ({
  userPreferences,
  user,
  navigation,
  userPhase,
  isProfileComplete
}) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showDateAnimation, setShowDateAnimation] = useState(false);

  // React Query hooks for data fetching
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: completionData, isLoading: completionLoading } = useCompletionStatus();
  const { data: analyticsData } = useUserAnalytics();

  // Determine current user phase from multiple sources
  const currentUserPhase = userPhase ||
                           userProfile?.profile?.currentPhase ||
                           userPreferences?.phase?.id ||
                           'single';

  // Get questionnaire data for current phase
  const { data: questionnaireData } = useQuestionnaireData(currentUserPhase);

  // Extract completion status and progress
  const completionStatus = completionData?.phases || {};
  const overallProgress = completionData?.overall?.progress || 0;
  const isCurrentProfileComplete = isProfileComplete ||
                                  completionStatus[currentUserPhase]?.completed ||
                                  false;

  useEffect(() => {
    // Show date preparation animation if profile is complete
    if (isCurrentProfileComplete) {
      setShowDateAnimation(true);
    }
  }, [isCurrentProfileComplete]);

  // Calculate progress percentage for current phase
  const progressPercentage = completionStatus[currentUserPhase]?.progress || 0;

  const handleEditQuestionnaire = () => {
    setCurrentScreen('editQuestionnaire');
  };

  const handleQuestionnaireUpdated = (updatedAnswers) => {
    // React Query will automatically refetch completion data
    // due to cache invalidation in the mutation
    setShowDateAnimation(true);
  };

  const getPhaseInfo = () => {
    switch (currentUserPhase) {
      case 'single':
        return {
          icon: '💝',
          title: 'Ready for Dates',
          subtitle: 'We deliver perfect dates for you',
          color: '#FF6B35',
          lightColor: '#FFF5F0',
        };
      case 'engagement':
        return {
          icon: '💍',
          title: 'Plan Your Wedding',
          subtitle: 'Create your dream wedding',
          color: '#FFD700',
          lightColor: '#FFF9E6',
        };
      case 'engagement_day_prep':
        return {
          icon: '✨',
          title: 'Engagement Day',
          subtitle: 'Perfect your special day',
          color: '#FF6B35',
          lightColor: '#FFF5F0',
        };
      default:
        return {
          icon: '💝',
          title: 'Welcome',
          subtitle: 'Your journey begins here',
          color: '#FF6B35',
          lightColor: '#FFF5F0',
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  const renderCompletionMessage = () => {
    if (isCurrentProfileComplete) {
      return (
        <>
          {/* Date Preparation Animation */}
          {showDateAnimation && <DatePreparationCard />}

          {/* Profile Complete Card */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            alignItems: 'center',
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
            borderWidth: 1,
            borderColor: COLORS.success + '30',
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: COLORS.success,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 20, color: COLORS.background }}>✓</Text>
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Profile Complete
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 16,
            }}>
              Our AI is preparing your perfect dates
            </Text>

            <TouchableOpacity
              onPress={handleEditQuestionnaire}
              style={{
                backgroundColor: COLORS.background,
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: COLORS.accent,
              }}
            >
              <Text style={{
                color: COLORS.accent,
                fontSize: 12,
                fontWeight: '500',
                letterSpacing: 0.5,
              }}>
                Edit Answers
              </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      return (
        <View style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 24,
          marginBottom: 24,
          alignItems: 'center',
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: COLORS.warning + '30',
        }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: COLORS.warning + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 20 }}>📝</Text>
          </View>
          <Text style={{
            fontSize: 18,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Complete Your Profile
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 20,
          }}>
            {progressPercentage}% complete
          </Text>

          <TouchableOpacity
            onPress={() => onNavigateToQuestionnaire()}
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 24,
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
              fontWeight: '500',
              letterSpacing: 0.5,
            }}>
              {progressPercentage > 0 ? 'Continue' : 'Start Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // Elite menu items - Following Design Rules
  const menuItems = [
    {
      id: 'questionnaire',
      icon: '📝',
      title: isCurrentProfileComplete ? 'Edit Questionnaire' : 'Complete Profile',
      subtitle: isCurrentProfileComplete ? 'Update your questionnaire answers' : 'Complete your profile questionnaire',
      action: () => isCurrentProfileComplete ? handleEditQuestionnaire() : onNavigateToQuestionnaire(),
      disabled: false,
    },
    {
      id: 'articles',
      icon: '📚',
      title: 'Dating Articles',
      subtitle: 'Expert advice and relationship tips',
      action: () => console.log('Navigate to articles'),
      disabled: false,
    },
  ];

  const { colors } = useTheme();

  // Handle screen navigation
  if (currentScreen === 'editQuestionnaire') {
    return (
      <EditQuestionnaireScreen
        userPhase={currentUserPhase}
        onBack={() => setCurrentScreen('home')}
        onSave={handleQuestionnaireUpdated}
      />
    );
  }

  // Show loading state while data is being fetched
  if (profileLoading || completionLoading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

          {/* Elite Header */}
          <View style={{
            paddingTop: 40,
            paddingBottom: 32,
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
              marginBottom: 24,
            }} />

            <Text style={{
              fontSize: 20,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Loading your profile...
            </Text>

            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Preparing your elite experience
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

        {/* Elite Header - matching onboarding style */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 32,
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
            marginBottom: 24,
          }} />

          <Text style={{
            fontSize: 20,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Welcome back, {userProfile?.profile?.firstName || user?.firstName || 'User'}
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Your elite matrimonial experience continues
          </Text>
        </View>

        {/* Main Content - matching onboarding scroll style */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Phase Status Card - Elite minimalist design */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            alignItems: 'center',
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{ fontSize: 32, marginBottom: 16 }}>{phaseInfo.icon}</Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              {phaseInfo.title}
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              {phaseInfo.subtitle}
            </Text>
          </View>

          {/* Completion Status */}
          {renderCompletionMessage()}

          {/* Quiz Progress Card */}
          <QuizProgressCard navigation={navigation} />

          {/* Elite Menu Items - matching onboarding button style */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.action}
              disabled={item.disabled}
              style={{
                backgroundColor: item.disabled ? COLORS.surface : COLORS.background,
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: item.disabled ? 0.02 : 0.05,
                shadowRadius: 8,
                elevation: item.disabled ? 1 : 2,
                borderWidth: 1,
                borderColor: item.disabled ? COLORS.border : COLORS.border,
                opacity: item.disabled ? 0.5 : 1,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 20,
                  marginRight: 16,
                  opacity: item.disabled ? 0.5 : 1,
                }}>
                  {item.icon}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '300',
                    color: item.disabled ? COLORS.textTertiary : COLORS.text,
                    marginBottom: 4,
                  }}>
                    {item.title}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: item.disabled ? COLORS.textTertiary : COLORS.textSecondary,
                    lineHeight: 16,
                  }}>
                    {item.subtitle}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  color: item.disabled ? COLORS.textTertiary : COLORS.accent,
                  fontWeight: '300',
                }}>
                  →
                </Text>
              </View>
            </TouchableOpacity>
          ))}


        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default HomeScreen;
