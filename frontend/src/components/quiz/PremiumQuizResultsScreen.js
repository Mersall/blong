/**
 * BLONG Premium Quiz Results Screen
 * Sophisticated results presentation with personality insights
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
  Dimensions,
  Share,
  Haptics,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTransition } from '../AppTransition';
import InteractivePersonalityChart from './InteractivePersonalityChart';
import QuizSuccessAnimation from './QuizSuccessAnimation';

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
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  
  traits: {
    openness: '#9C27B0',
    conscientiousness: '#2196F3',
    extraversion: '#FF9800',
    agreeableness: '#4CAF50',
    neuroticism: '#F44336',
  },
};

const PremiumQuizResultsScreen = ({ navigation, route }) => {
  const { personalityProfile = {}, achievements = [], stats = {} } = route.params || {};
  
  const [showCelebration, setShowCelebration] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, insights, compatibility

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    // Haptic feedback
    if (Haptics?.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const getPersonalityType = () => {
    // Simple personality type determination based on traits
    const traits = personalityProfile.traits || {};
    let type = '';
    
    if (traits.extraversion > 60) type += 'E';
    else type += 'I';
    
    if (traits.conscientiousness > 60) type += 'J';
    else type += 'P';
    
    if (traits.agreeableness > 60) type += 'F';
    else type += 'T';
    
    if (traits.openness > 60) type += 'N';
    else type += 'S';
    
    const typeNames = {
      'ENFP': 'The Enthusiast',
      'INFP': 'The Mediator',
      'ENFJ': 'The Protagonist',
      'INFJ': 'The Advocate',
      'ENTP': 'The Debater',
      'INTP': 'The Thinker',
      'ENTJ': 'The Commander',
      'INTJ': 'The Architect',
      'ESFP': 'The Entertainer',
      'ISFP': 'The Adventurer',
      'ESFJ': 'The Consul',
      'ISFJ': 'The Protector',
      'ESTP': 'The Entrepreneur',
      'ISTP': 'The Virtuoso',
      'ESTJ': 'The Executive',
      'ISTJ': 'The Logistician',
    };
    
    return {
      code: type,
      name: typeNames[type] || 'The Unique Individual',
    };
  };

  const personalityType = getPersonalityType();

  const generateInsights = () => {
    const traits = personalityProfile.traits || {};
    const insights = [];

    // Generate insights based on personality traits
    Object.entries(traits).forEach(([traitKey, value]) => {
      let insight = '';
      let tip = '';
      
      switch (traitKey) {
        case 'openness':
          if (value > 70) {
            insight = 'You are highly creative and open to new experiences. You thrive on novelty and intellectual stimulation.';
            tip = 'Seek partners who appreciate your curiosity and can engage in deep, meaningful conversations.';
          } else if (value < 30) {
            insight = 'You prefer familiar routines and traditional approaches. You value stability and predictability.';
            tip = 'Look for partners who share your values and appreciate consistency in relationships.';
          }
          break;
        case 'conscientiousness':
          if (value > 70) {
            insight = 'You are highly organized and reliable. You set goals and work steadily to achieve them.';
            tip = 'Your dedication is attractive to partners who value commitment and long-term planning.';
          } else if (value < 30) {
            insight = 'You are spontaneous and flexible. You adapt easily to changing circumstances.';
            tip = 'Find partners who appreciate your spontaneity and can go with the flow.';
          }
          break;
        case 'extraversion':
          if (value > 70) {
            insight = 'You are energetic and outgoing. You draw energy from social interactions and group activities.';
            tip = 'Look for partners who enjoy social activities or who complement your outgoing nature.';
          } else if (value < 30) {
            insight = 'You are reflective and prefer intimate settings. You recharge through quiet, meaningful conversations.';
            tip = 'Seek partners who appreciate depth over breadth in social connections.';
          }
          break;
        case 'agreeableness':
          if (value > 70) {
            insight = 'You are compassionate and cooperative. You prioritize harmony and understanding in relationships.';
            tip = 'Your empathy is a strength, but ensure your needs are also heard and respected.';
          } else if (value < 30) {
            insight = 'You are independent and direct. You value honesty and straightforward communication.';
            tip = 'Find partners who appreciate your authenticity and can handle direct communication.';
          }
          break;
        case 'neuroticism':
          if (value < 30) {
            insight = 'You are emotionally stable and resilient. You handle stress well and maintain composure.';
            tip = 'Your stability can be a calming influence in relationships. Share your coping strategies.';
          } else if (value > 70) {
            insight = 'You are emotionally sensitive and intuitive. You feel deeply and notice subtle changes in mood.';
            tip = 'Your emotional awareness is valuable. Seek partners who appreciate your sensitivity.';
          }
          break;
      }
      
      if (insight) {
        insights.push({
          trait: traitKey,
          traitName: traitKey.charAt(0).toUpperCase() + traitKey.slice(1),
          value,
          insight,
          tip,
          color: COLORS.traits[traitKey],
        });
      }
    });

    return insights;
  };

  const insights = generateInsights();

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `I just completed my BLONG personality assessment! I'm ${personalityType.name} (${personalityType.code}). Check out BLONG to discover your personality type!`,
        title: 'My BLONG Personality Results',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderOverviewTab = () => (
    <View>
      {/* Personality Type Card */}
      <LinearGradient
        colors={[COLORS.accent, '#FF8A65']}
        style={{
          borderRadius: 20,
          padding: 32,
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: 48,
          marginBottom: 16,
        }}>
          🎭
        </Text>
        <Text style={{
          fontSize: 24,
          fontWeight: '300',
          color: COLORS.background,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          {personalityType.name}
        </Text>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: COLORS.background,
          letterSpacing: 2,
        }}>
          {personalityType.code}
        </Text>
      </LinearGradient>

      {/* Personality Chart */}
      <InteractivePersonalityChart
        personalityData={personalityProfile.traits}
        showDetailedView={true}
        onTraitPress={setSelectedInsight}
      />

      {/* Stats Cards */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 24,
        gap: 12,
      }}>
        <View style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}>
          <Text style={{ fontSize: 24, marginBottom: 8 }}>📊</Text>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            {stats.totalQuestions || 0}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Questions Answered
          </Text>
        </View>

        <View style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}>
          <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            {stats.accuracy || 95}%
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Accuracy Score
          </Text>
        </View>

        <View style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}>
          <Text style={{ fontSize: 24, marginBottom: 8 }}>🏆</Text>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            {achievements.length}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Achievements
          </Text>
        </View>
      </View>
    </View>
  );

  const renderInsightsTab = () => (
    <View>
      {insights.map((insight, index) => (
        <TouchableOpacity
          key={insight.trait}
          onPress={() => setSelectedInsight(selectedInsight?.trait === insight.trait ? null : insight)}
          style={{
            backgroundColor: selectedInsight?.trait === insight.trait 
              ? `${insight.color}10` 
              : COLORS.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            borderWidth: selectedInsight?.trait === insight.trait ? 2 : 1,
            borderColor: selectedInsight?.trait === insight.trait 
              ? insight.color 
              : COLORS.border,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: insight.color,
              marginRight: 12,
            }} />
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.text,
              flex: 1,
            }}>
              {insight.traitName}
            </Text>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: insight.color,
            }}>
              {Math.round(insight.value)}%
            </Text>
          </View>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
            marginBottom: selectedInsight?.trait === insight.trait ? 16 : 0,
          }}>
            {insight.insight}
          </Text>

          {selectedInsight?.trait === insight.trait && (
            <View style={{
              backgroundColor: `${insight.color}15`,
              borderRadius: 12,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: insight.color,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: insight.color,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                Dating Tip
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.text,
                lineHeight: 20,
              }}>
                {insight.tip}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAchievementsTab = () => (
    <View>
      {achievements.length > 0 ? (
        achievements.map((achievement, index) => (
          <View
            key={achievement.id || index}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: COLORS.gold + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Text style={{ fontSize: 20 }}>
                {achievement.icon || '🏆'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 4,
              }}>
                {achievement.name || 'Achievement Unlocked'}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
              }}>
                {achievement.description || 'You completed a milestone!'}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={{
          alignItems: 'center',
          paddingVertical: 40,
        }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🎯</Text>
          <Text style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Complete more assessments to unlock achievements!
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <Animated.View
          style={{
            paddingTop: 20,
            paddingHorizontal: 32,
            paddingBottom: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{ padding: 8 }}
            >
              <Text style={{
                fontSize: 16,
                color: COLORS.accent,
                fontWeight: '500',
              }}>
                Done
              </Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '300',
                color: COLORS.text,
                letterSpacing: 2,
              }}>
                YOUR RESULTS
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleShare}
              style={{ padding: 8 }}
            >
              <Text style={{
                fontSize: 24,
              }}>
                📤
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View
          style={{
            paddingHorizontal: 32,
            marginBottom: 20,
            opacity: fadeAnim,
          }}
        >
          <View style={{
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 4,
          }}>
            {['overview', 'insights', 'achievements'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 16,
                  backgroundColor: activeTab === tab ? COLORS.accent : 'transparent',
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: activeTab === tab ? COLORS.background : COLORS.textSecondary,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'insights' && renderInsightsTab()}
            {activeTab === 'achievements' && renderAchievementsTab()}
          </ScrollView>
        </Animated.View>

        {/* Celebration Animation */}
        <QuizSuccessAnimation
          visible={showCelebration}
          message="Assessment Complete! 🎉"
          onComplete={() => setShowCelebration(false)}
        />
      </SafeAreaView>
    </AppTransition>
  );
};

export default PremiumQuizResultsScreen;