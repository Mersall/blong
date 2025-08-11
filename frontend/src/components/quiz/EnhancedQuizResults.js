/**
 * BLONG Enhanced Quiz Results Interface
 * Comprehensive results display with insights and visualizations
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
} from 'react-native';
import { AppTransition } from '../AppTransition';
import { LinearGradient } from 'expo-linear-gradient';

// ALWAYS include COLORS constant - BLONG Design System
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
};

const { width: screenWidth } = Dimensions.get('window');

export const EnhancedQuizResults = ({
  quizType = 'personality',
  results = {},
  onContinue,
  onRetake,
  onShare,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedValues] = useState({
    fadeIn: new Animated.Value(0),
    slideUp: new Animated.Value(50),
    scaleIn: new Animated.Value(0.8),
  });

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(animatedValues.fadeIn, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues.slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValues.scaleIn, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getQuizConfig = () => {
    const configs = {
      personality: {
        title: 'Your Personality Profile',
        icon: '🧠',
        color: COLORS.accent,
        subtitle: 'Based on the Big Five personality model',
      },
      love_languages: {
        title: 'Your Love Languages',
        icon: '💕',
        color: '#E91E63',
        subtitle: 'How you give and receive love',
      },
      attachment_style: {
        title: 'Your Attachment Style',
        icon: '🤝',
        color: '#9C27B0',
        subtitle: 'Your relationship patterns',
      },
      values_assessment: {
        title: 'Your Core Values',
        icon: '⭐',
        color: '#FF9800',
        subtitle: 'What matters most to you',
      },
    };

    return configs[quizType] || configs.personality;
  };

  const config = getQuizConfig();

  const renderHeader = () => (
    <View style={{
      paddingTop: 40,
      paddingBottom: 32,
      paddingHorizontal: 32,
      alignItems: 'center',
      backgroundColor: COLORS.background,
    }}>
      <TouchableOpacity
        onPress={onBack}
        style={{
          position: 'absolute',
          top: 50,
          left: 32,
          padding: 8,
        }}
      >
        <Text style={{ fontSize: 18, color: COLORS.accent }}>←</Text>
      </TouchableOpacity>

      <Animated.View style={{
        opacity: animatedValues.fadeIn,
        transform: [
          { translateY: animatedValues.slideUp },
          { scale: animatedValues.scaleIn },
        ],
        alignItems: 'center',
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: config.color + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 40 }}>{config.icon}</Text>
        </View>

        <Text style={{
          fontSize: 24,
          fontWeight: '300',
          color: COLORS.text,
          marginBottom: 8,
          textAlign: 'center',
        }}>
          {config.title}
        </Text>

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          {config.subtitle}
        </Text>
      </Animated.View>
    </View>
  );

  const renderTabNavigation = () => (
    <View style={{
      flexDirection: 'row',
      backgroundColor: COLORS.surface,
      marginHorizontal: 32,
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
    }}>
      {[
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'insights', label: 'Insights', icon: '💡' },
        { id: 'recommendations', label: 'Tips', icon: '🎯' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => setActiveTab(tab.id)}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: activeTab === tab.id ? COLORS.background : 'transparent',
            shadowColor: activeTab === tab.id ? COLORS.shadow : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: activeTab === tab.id ? 0.1 : 0,
            shadowRadius: 4,
            elevation: activeTab === tab.id ? 2 : 0,
          }}
        >
          <Text style={{
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 4,
          }}>
            {tab.icon}
          </Text>
          <Text style={{
            fontSize: 12,
            fontWeight: activeTab === tab.id ? '500' : '300',
            color: activeTab === tab.id ? config.color : COLORS.textSecondary,
            textAlign: 'center',
          }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverviewTab = () => (
    <Animated.View style={{
      opacity: animatedValues.fadeIn,
      transform: [{ translateY: animatedValues.slideUp }],
    }}>
      {/* Primary Result */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 32,
        marginBottom: 24,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <View style={{
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
          }}>
            Your Primary Type
          </Text>
          <View style={{
            backgroundColor: config.color + '20',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 24,
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '500',
              color: config.color,
              letterSpacing: 0.5,
            }}>
              {results.primaryType || 'Analytical Thinker'}
            </Text>
          </View>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            {results.description || 'You approach life with logic and careful analysis, making well-thought-out decisions.'}
          </Text>
        </View>

        {/* Trait Scores */}
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 16,
          }}>
            Your Trait Scores
          </Text>

          {(results.traits || [
            { name: 'Openness', score: 85, description: 'Open to new experiences' },
            { name: 'Conscientiousness', score: 78, description: 'Organized and responsible' },
            { name: 'Extraversion', score: 62, description: 'Moderately social' },
            { name: 'Agreeableness', score: 71, description: 'Cooperative and trusting' },
            { name: 'Neuroticism', score: 34, description: 'Emotionally stable' },
          ]).map((trait, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '300',
                  color: COLORS.text,
                }}>
                  {trait.name}
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: config.color,
                }}>
                  {trait.score}%
                </Text>
              </View>

              <View style={{
                height: 6,
                backgroundColor: COLORS.border,
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <View style={{
                  height: 6,
                  backgroundColor: config.color,
                  borderRadius: 3,
                  width: `${trait.score}%`,
                }} />
              </View>

              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginTop: 4,
              }}>
                {trait.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Compatibility Preview */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 32,
        marginBottom: 24,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: COLORS.text,
          marginBottom: 16,
        }}>
          💕 Compatibility Insights
        </Text>

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          lineHeight: 20,
          marginBottom: 16,
        }}>
          Based on your personality profile, you're most compatible with partners who are:
        </Text>

        {(results.compatibilityTraits || [
          'Emotionally stable and supportive',
          'Share your intellectual curiosity',
          'Appreciate your analytical nature',
          'Value deep, meaningful conversations',
        ]).map((trait, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Text style={{
              fontSize: 12,
              color: config.color,
              marginRight: 8,
            }}>
              •
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              flex: 1,
            }}>
              {trait}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderInsightsTab = () => (
    <View style={{ paddingHorizontal: 32 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 16,
      }}>
        🔍 Detailed Insights
      </Text>

      {(results.insights || [
        {
          title: 'Strengths',
          items: ['Logical decision-making', 'Strong problem-solving skills', 'Reliable and consistent'],
          color: COLORS.success,
        },
        {
          title: 'Growth Areas',
          items: ['Could be more spontaneous', 'Sometimes overthink decisions', 'May need to express emotions more'],
          color: COLORS.warning,
        },
        {
          title: 'In Relationships',
          items: ['Values deep connections', 'Needs intellectual stimulation', 'Appreciates honesty and directness'],
          color: config.color,
        },
      ]).map((insight, index) => (
        <View key={index} style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: insight.color,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 12,
          }}>
            {insight.title}
          </Text>

          {insight.items.map((item, itemIndex) => (
            <View key={itemIndex} style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 12,
                color: insight.color,
                marginRight: 8,
              }}>
                •
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                flex: 1,
                lineHeight: 20,
              }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderRecommendationsTab = () => (
    <View style={{ paddingHorizontal: 32 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 16,
      }}>
        🎯 Personalized Recommendations
      </Text>

      {(results.recommendations || [
        {
          category: 'Dating Tips',
          icon: '💕',
          tips: [
            'Look for partners who appreciate intellectual conversations',
            'Be open about your need for alone time to recharge',
            'Share your interests and passions early in relationships',
          ],
        },
        {
          category: 'Communication',
          icon: '💬',
          tips: [
            'Practice expressing your emotions more openly',
            'Ask open-ended questions to encourage deeper conversations',
            'Be patient with partners who process emotions differently',
          ],
        },
        {
          category: 'Personal Growth',
          icon: '🌱',
          tips: [
            'Try new activities to expand your comfort zone',
            'Practice mindfulness to stay present in relationships',
            'Consider couples activities that involve learning together',
          ],
        },
      ]).map((category, index) => (
        <View key={index} style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>{category.icon}</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
            }}>
              {category.category}
            </Text>
          </View>

          {category.tips.map((tip, tipIndex) => (
            <View key={tipIndex} style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 12,
                color: config.color,
                marginRight: 8,
                marginTop: 4,
              }}>
                •
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                flex: 1,
                lineHeight: 20,
              }}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderActionButtons = () => (
    <View style={{
      paddingHorizontal: 32,
      paddingTop: 24,
      paddingBottom: 32,
    }}>
      <TouchableOpacity
        onPress={onContinue}
        style={{
          backgroundColor: config.color,
          paddingVertical: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.background,
          textAlign: 'center',
          letterSpacing: 0.5,
        }}>
          Continue to Matching
        </Text>
      </TouchableOpacity>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <TouchableOpacity
          onPress={onRetake}
          style={{
            flex: 1,
            paddingVertical: 12,
            marginRight: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Retake Quiz
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          style={{
            flex: 1,
            paddingVertical: 12,
            marginLeft: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Share Results
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'insights':
        return renderInsightsTab();
      case 'recommendations':
        return renderRecommendationsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {renderHeader()}
        {renderTabNavigation()}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>

        {renderActionButtons()}
      </SafeAreaView>
    </AppTransition>
  );
};

export default EnhancedQuizResults;

/**
 * Quiz Progress Tracker Component
 * Real-time progress tracking with motivational feedback
 */
export const QuizProgressTracker = ({
  currentQuestion = 0,
  totalQuestions = 50,
  timeSpent = 0,
  questionsAnswered = 0,
  quizType = 'personality',
  onPause,
  onResume,
  isPaused = false,
}) => {
  const progressPercentage = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  const averageTimePerQuestion = questionsAnswered > 0 ? timeSpent / questionsAnswered : 0;
  const estimatedTimeRemaining = (totalQuestions - currentQuestion) * averageTimePerQuestion;

  const getMilestoneMessage = () => {
    if (progressPercentage >= 100) return "🎉 Quiz Complete!";
    if (progressPercentage >= 75) return "🌟 Almost there!";
    if (progressPercentage >= 50) return "💪 Halfway done!";
    if (progressPercentage >= 25) return "🚀 Great progress!";
    return "✨ Just getting started!";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 32,
      marginBottom: 16,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      {/* Progress Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '300',
          color: COLORS.text,
        }}>
          {getMilestoneMessage()}
        </Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={isPaused ? onResume : onPause}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: COLORS.accent + '20',
              marginRight: 8,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: COLORS.accent,
              fontWeight: '500',
            }}>
              {isPaused ? '▶️' : '⏸️'}
            </Text>
          </TouchableOpacity>

          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            fontWeight: '500',
          }}>
            {formatTime(timeSpent)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
      }}>
        <View style={{
          height: 8,
          backgroundColor: COLORS.accent,
          borderRadius: 4,
          width: `${progressPercentage}%`,
        }} />
      </View>

      {/* Progress Stats */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
        }}>
          {currentQuestion} of {totalQuestions} questions
        </Text>

        {estimatedTimeRemaining > 0 && (
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            ~{formatTime(Math.round(estimatedTimeRemaining))} remaining
          </Text>
        )}
      </View>
    </View>
  );
};
