/**
 * BLONG Quiz Results Screen
 * Beautiful personality profile visualization
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
import PersonalityChart from './PersonalityChart';
import PersonalityInsights from './PersonalityInsights';
import CompatibilityExplanation from './CompatibilityExplanation';
import QuizLoadingAnimation from './QuizLoadingAnimation';
import AnimatedQuizButton from './AnimatedQuizButton';

const { width: screenWidth } = Dimensions.get('window');

const QuizResultsScreen = ({ navigation }) => {
  const [personalityProfile, setPersonalityProfile] = useState(null);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [animatedValues] = useState({
    openness: new Animated.Value(0),
    conscientiousness: new Animated.Value(0),
    extraversion: new Animated.Value(0),
    agreeableness: new Animated.Value(0),
    neuroticism: new Animated.Value(0),
  });

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
    // Personality trait colors
    openness: '#9C27B0',
    conscientiousness: '#2196F3',
    extraversion: '#FF9800',
    agreeableness: '#4CAF50',
    neuroticism: '#F44336',
  };

  useEffect(() => {
    loadPersonalityProfile();
  }, []);

  const loadPersonalityProfile = async () => {
    try {
      setLoading(true);
      const profile = await quizService.getUserPersonalityProfile();
      setPersonalityProfile(profile);
      
      if (profile) {
        const profileInsights = quizService.getPersonalityInsights(profile);
        setInsights(profileInsights);
        animateScores(profile);
      }
    } catch (error) {
      console.error('Error loading personality profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateScores = (profile) => {
    const animations = [];
    
    Object.keys(animatedValues).forEach(trait => {
      const scoreKey = `${trait}Score`;
      const score = profile[scoreKey] || 0;
      
      animations.push(
        Animated.timing(animatedValues[trait], {
          toValue: score,
          duration: 1500,
          delay: Math.random() * 500,
          useNativeDriver: false,
        })
      );
    });

    Animated.parallel(animations).start();
  };

  const renderPersonalityTrait = (trait, traitName, color) => {
    const score = personalityProfile?.[`${trait}Score`] || 0;
    const insight = insights[trait];

    return (
      <View key={trait} style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}>
        {/* Trait Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            {traitName}
          </Text>
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: `${color}15`,
            borderRadius: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: color,
            }}>
              {score}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={{
          height: 8,
          backgroundColor: COLORS.border,
          borderRadius: 4,
          marginBottom: 16,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: 4,
            width: animatedValues[trait].interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          }} />
        </View>

        {/* Insight */}
        {insight && (
          <View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: color,
                marginRight: 8,
              }} />
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                {insight.level} {traitName}
              </Text>
            </View>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
              marginBottom: 12,
            }}>
              {insight.description}
            </Text>
            
            {/* Traits */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              {insight.traits?.map((traitTag, index) => (
                <View key={index} style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  backgroundColor: `${color}10`,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: `${color}30`,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: color,
                    fontWeight: '500',
                  }}>
                    {traitTag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderLoveLanguage = () => {
    if (!personalityProfile?.primaryLoveLanguage) return null;
    
    const insight = insights.loveLanguage;
    if (!insight) return null;

    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>💕</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            Your Love Language
          </Text>
        </View>

        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.accent,
          marginBottom: 8,
        }}>
          {insight.name}
        </Text>

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          lineHeight: 20,
          marginBottom: 12,
        }}>
          {insight.description}
        </Text>

        <View style={{
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.textTertiary,
            marginBottom: 4,
          }}>
            💡 Relationship Tip
          </Text>
          <Text style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 18,
            fontStyle: 'italic',
          }}>
            {insight.tips}
          </Text>
        </View>
      </View>
    );
  };

  const renderAttachmentStyle = () => {
    if (!personalityProfile?.attachmentStyle) return null;
    
    const insight = insights.attachmentStyle;
    if (!insight) return null;

    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>🤝</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            Relationship Style
          </Text>
        </View>

        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.accent,
          marginBottom: 8,
        }}>
          {insight.name}
        </Text>

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          lineHeight: 20,
          marginBottom: 16,
        }}>
          {insight.description}
        </Text>

        {/* Strengths */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
            marginBottom: 8,
          }}>
            Your Strengths:
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {insight.strengths?.map((strength, index) => (
              <View key={index} style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                backgroundColor: `${COLORS.success}15`,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: `${COLORS.success}30`,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.success,
                  fontWeight: '500',
                }}>
                  {strength}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.textTertiary,
            marginBottom: 4,
          }}>
            💡 Growth Tip
          </Text>
          <Text style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 18,
            fontStyle: 'italic',
          }}>
            {insight.tips}
          </Text>
        </View>
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
            message="Analyzing your personality..."
          />
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
          paddingBottom: 24,
          paddingHorizontal: 32,
          alignItems: 'center',
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            letterSpacing: 1,
            marginBottom: 8,
          }}>
            Your Personality Profile
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Discover what makes you unique
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 32,
            paddingVertical: 24,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Personality Chart */}
          <PersonalityChart
            personalityProfile={personalityProfile}
            style={{ marginBottom: 24 }}
          />

          {/* Personality Insights */}
          <PersonalityInsights
            personalityProfile={personalityProfile}
            insights={insights}
            style={{ marginBottom: 24 }}
          />

          {/* Compatibility Explanation */}
          <CompatibilityExplanation
            personalityProfile={personalityProfile}
            style={{ marginBottom: 24 }}
          />

          {/* Action Button */}
          <AnimatedQuizButton
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            size="large"
            style={{
              marginTop: 20,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            Continue to Matching
          </AnimatedQuizButton>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default QuizResultsScreen;
