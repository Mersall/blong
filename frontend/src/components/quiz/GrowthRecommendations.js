/**
 * BLONG Growth Recommendations
 * Provides personalized growth suggestions based on personality profile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const GrowthRecommendations = ({ personalityProfile, style }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [recommendationAnims] = useState({});

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
    info: '#2196F3',
    warning: '#FF9800',
    growth: '#9C27B0',
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getGrowthRecommendations = () => {
    if (!personalityProfile) return { personal: [], relationship: [], career: [] };

    const {
      openness = 0,
      conscientiousness = 0,
      extraversion = 0,
      agreeableness = 0,
      neuroticism = 0,
      personalityTraits = [],
      primaryLoveLanguage,
      attachmentStyle,
    } = personalityProfile;

    const recommendations = {
      personal: [],
      relationship: [],
      career: [],
    };

    // Personal Growth Recommendations
    if (openness < 0.4) {
      recommendations.personal.push({
        id: 'openness_low',
        title: 'Embrace New Experiences',
        description: 'Try one new activity each week to expand your comfort zone',
        action: 'Start with small changes like trying a new cuisine or taking a different route to work',
        icon: '🌟',
        priority: 'high',
      });
    } else if (openness > 0.8) {
      recommendations.personal.push({
        id: 'openness_high',
        title: 'Channel Your Creativity',
        description: 'Focus your creative energy into meaningful projects',
        action: 'Set aside dedicated time for creative pursuits that align with your goals',
        icon: '🎨',
        priority: 'medium',
      });
    }

    if (conscientiousness < 0.4) {
      recommendations.personal.push({
        id: 'conscientiousness_low',
        title: 'Build Better Habits',
        description: 'Develop simple, consistent routines to improve organization',
        action: 'Start with one small daily habit like making your bed or planning tomorrow',
        icon: '📋',
        priority: 'high',
      });
    }

    if (neuroticism > 0.6) {
      recommendations.personal.push({
        id: 'emotional_stability',
        title: 'Stress Management',
        description: 'Develop coping strategies for emotional regulation',
        action: 'Practice mindfulness, deep breathing, or journaling for 10 minutes daily',
        icon: '🧘',
        priority: 'high',
      });
    }

    if (extraversion < 0.3) {
      recommendations.personal.push({
        id: 'introvert_growth',
        title: 'Strategic Social Growth',
        description: 'Build social skills at your own pace',
        action: 'Practice one-on-one conversations before group settings',
        icon: '💬',
        priority: 'medium',
      });
    } else if (extraversion > 0.8) {
      recommendations.personal.push({
        id: 'extravert_balance',
        title: 'Cultivate Solitude',
        description: 'Balance social energy with meaningful alone time',
        action: 'Schedule regular quiet time for reflection and recharging',
        icon: '🤔',
        priority: 'medium',
      });
    }

    // Relationship Growth Recommendations
    if (attachmentStyle === 'ANXIOUS') {
      recommendations.relationship.push({
        id: 'anxious_attachment',
        title: 'Build Secure Attachment',
        description: 'Work on self-soothing and communication skills',
        action: 'Practice expressing needs clearly and trusting your partner',
        icon: '💙',
        priority: 'high',
      });
    } else if (attachmentStyle === 'AVOIDANT') {
      recommendations.relationship.push({
        id: 'avoidant_attachment',
        title: 'Embrace Vulnerability',
        description: 'Practice opening up and sharing emotions',
        action: 'Share one feeling or concern with someone you trust each week',
        icon: '🤗',
        priority: 'high',
      });
    }

    if (primaryLoveLanguage === 'PHYSICAL_TOUCH') {
      recommendations.relationship.push({
        id: 'physical_touch',
        title: 'Communicate Touch Preferences',
        description: 'Help partners understand your need for physical affection',
        action: 'Discuss comfort levels and preferred types of physical connection',
        icon: '🤝',
        priority: 'medium',
      });
    } else if (primaryLoveLanguage === 'WORDS_OF_AFFIRMATION') {
      recommendations.relationship.push({
        id: 'words_affirmation',
        title: 'Express Appreciation',
        description: 'Learn to give and receive verbal affirmation effectively',
        action: 'Practice giving specific, genuine compliments daily',
        icon: '💬',
        priority: 'medium',
      });
    }

    if (agreeableness < 0.4) {
      recommendations.relationship.push({
        id: 'empathy_building',
        title: 'Develop Empathy Skills',
        description: 'Practice seeing situations from others\' perspectives',
        action: 'Before responding in conflicts, ask "How might they be feeling?"',
        icon: '❤️',
        priority: 'high',
      });
    }

    // Career Growth Recommendations
    if (conscientiousness > 0.7 && openness > 0.6) {
      recommendations.career.push({
        id: 'leadership_potential',
        title: 'Explore Leadership Roles',
        description: 'Your organization and creativity make you a natural leader',
        action: 'Volunteer to lead a project or mentor a colleague',
        icon: '👑',
        priority: 'medium',
      });
    }

    if (extraversion > 0.7) {
      recommendations.career.push({
        id: 'networking_strength',
        title: 'Leverage Your Social Skills',
        description: 'Use your people skills for career advancement',
        action: 'Attend industry events or join professional organizations',
        icon: '🌐',
        priority: 'medium',
      });
    } else if (extraversion < 0.3) {
      recommendations.career.push({
        id: 'deep_work_advantage',
        title: 'Maximize Deep Work',
        description: 'Your focus and depth are valuable assets',
        action: 'Seek roles that allow for concentrated, independent work',
        icon: '🎯',
        priority: 'medium',
      });
    }

    if (openness > 0.7) {
      recommendations.career.push({
        id: 'innovation_opportunity',
        title: 'Drive Innovation',
        description: 'Your creativity can solve complex problems',
        action: 'Propose new solutions or volunteer for creative projects',
        icon: '💡',
        priority: 'medium',
      });
    }

    // Add some general recommendations if not many specific ones
    if (recommendations.personal.length === 0) {
      recommendations.personal.push({
        id: 'general_growth',
        title: 'Continue Self-Discovery',
        description: 'Keep exploring your unique strengths and interests',
        action: 'Set aside time each week for reflection and goal-setting',
        icon: '🌱',
        priority: 'medium',
      });
    }

    if (recommendations.relationship.length === 0) {
      recommendations.relationship.push({
        id: 'communication_skills',
        title: 'Enhance Communication',
        description: 'Strong communication is the foundation of all relationships',
        action: 'Practice active listening and expressing yourself clearly',
        icon: '🗣️',
        priority: 'medium',
      });
    }

    if (recommendations.career.length === 0) {
      recommendations.career.push({
        id: 'skill_development',
        title: 'Continuous Learning',
        description: 'Invest in developing skills that align with your strengths',
        action: 'Identify one key skill to develop this quarter',
        icon: '📚',
        priority: 'medium',
      });
    }

    return recommendations;
  };

  const renderCategoryButton = (categoryKey, label, icon) => (
    <TouchableOpacity
      key={categoryKey}
      onPress={() => setSelectedCategory(categoryKey)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: selectedCategory === categoryKey ? COLORS.accent : COLORS.surface,
        borderWidth: 1,
        borderColor: selectedCategory === categoryKey ? COLORS.accent : COLORS.border,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 14, marginRight: 6 }}>{icon}</Text>
      <Text style={{
        fontSize: 12,
        fontWeight: '500',
        color: selectedCategory === categoryKey ? COLORS.background : COLORS.textSecondary,
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderRecommendation = (recommendation, index) => {
    if (!recommendationAnims[recommendation.id]) {
      recommendationAnims[recommendation.id] = new Animated.Value(0);
      Animated.timing(recommendationAnims[recommendation.id], {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    }

    const priorityColor = recommendation.priority === 'high' ? COLORS.accent : COLORS.info;

    return (
      <Animated.View
        key={recommendation.id}
        style={{
          opacity: recommendationAnims[recommendation.id],
          transform: [{
            translateY: recommendationAnims[recommendation.id].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: priorityColor,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${priorityColor}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 20 }}>{recommendation.icon}</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.text,
              marginBottom: 2,
            }}>
              {recommendation.title}
            </Text>
            
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              backgroundColor: `${priorityColor}20`,
              borderRadius: 10,
              alignSelf: 'flex-start',
            }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '500',
                color: priorityColor,
                textTransform: 'uppercase',
              }}>
                {recommendation.priority} priority
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          lineHeight: 20,
          marginBottom: 12,
        }}>
          {recommendation.description}
        </Text>

        {/* Action */}
        <View style={{
          backgroundColor: COLORS.background,
          borderRadius: 8,
          padding: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.accent,
            marginBottom: 4,
          }}>
            💡 Action Step:
          </Text>
          <Text style={{
            fontSize: 13,
            color: COLORS.text,
            lineHeight: 18,
          }}>
            {recommendation.action}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const recommendations = getGrowthRecommendations();
  const currentRecommendations = recommendations[selectedCategory] || [];

  return (
    <Animated.View style={[{
      opacity: fadeAnim,
      backgroundColor: COLORS.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    }, style]}>
      {/* Header */}
      <View style={{
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 8,
        }}>
          🌱 Growth Recommendations
        </Text>
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          Personalized suggestions to help you grow and thrive
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {renderCategoryButton('personal', 'Personal', '🧠')}
        {renderCategoryButton('relationship', 'Relationships', '💕')}
        {renderCategoryButton('career', 'Career', '💼')}
      </ScrollView>

      {/* Recommendations */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      >
        {currentRecommendations.length > 0 ? (
          currentRecommendations.map((recommendation, index) => 
            renderRecommendation(recommendation, index)
          )
        ) : (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
          }}>
            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
            }}>
              Complete your personality profile to see personalized recommendations
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Summary */}
      <View style={{
        backgroundColor: `${COLORS.growth}10`,
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: `${COLORS.growth}30`,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 4,
        }}>
          ✨ Remember: Growth is a Journey
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 16,
        }}>
          Focus on one recommendation at a time. Small, consistent steps lead to meaningful change.
        </Text>
      </View>
    </Animated.View>
  );
};

export default GrowthRecommendations;