/**
 * BLONG Personality Badges
 * Gamified badge system for personality quiz completion and achievements
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const PersonalityBadges = ({ personalityProfile, quizProgress, style }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [badgeAnims] = useState({});

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
    purple: '#9C27B0',
    blue: '#2196F3',
    green: '#4CAF50',
    pink: '#E91E63',
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getBadges = () => {
    const badges = [];

    // Completion Badges
    if (quizProgress?.isComplete) {
      badges.push({
        id: 'quiz_complete',
        title: 'Quiz Master',
        description: 'Completed the full personality assessment',
        icon: '🎯',
        color: COLORS.gold,
        rarity: 'gold',
        earned: true,
      });
    }

    if (quizProgress?.overallProgress >= 50) {
      badges.push({
        id: 'halfway_hero',
        title: 'Halfway Hero',
        description: 'Completed 50% of the personality quiz',
        icon: '⭐',
        color: COLORS.silver,
        rarity: 'silver',
        earned: true,
      });
    }

    // Personality Trait Badges
    if (personalityProfile) {
      // Openness Badges
      if (personalityProfile.openness > 0.8) {
        badges.push({
          id: 'creative_visionary',
          title: 'Creative Visionary',
          description: 'Exceptionally high openness to experience',
          icon: '🎨',
          color: COLORS.purple,
          rarity: 'rare',
          earned: true,
        });
      } else if (personalityProfile.openness > 0.6) {
        badges.push({
          id: 'curious_explorer',
          title: 'Curious Explorer',
          description: 'High openness to new experiences',
          icon: '🔍',
          color: COLORS.blue,
          rarity: 'common',
          earned: true,
        });
      }

      // Conscientiousness Badges
      if (personalityProfile.conscientiousness > 0.8) {
        badges.push({
          id: 'master_organizer',
          title: 'Master Organizer',
          description: 'Exceptionally high conscientiousness',
          icon: '📋',
          color: COLORS.blue,
          rarity: 'rare',
          earned: true,
        });
      }

      // Extraversion Badges
      if (personalityProfile.extraversion > 0.8) {
        badges.push({
          id: 'social_butterfly',
          title: 'Social Butterfly',
          description: 'Highly extraverted and social',
          icon: '🦋',
          color: COLORS.warning,
          rarity: 'uncommon',
          earned: true,
        });
      } else if (personalityProfile.extraversion < 0.3) {
        badges.push({
          id: 'thoughtful_introvert',
          title: 'Thoughtful Introvert',
          description: 'Values deep, meaningful connections',
          icon: '🤔',
          color: COLORS.green,
          rarity: 'uncommon',
          earned: true,
        });
      }

      // Agreeableness Badges
      if (personalityProfile.agreeableness > 0.8) {
        badges.push({
          id: 'compassionate_heart',
          title: 'Compassionate Heart',
          description: 'Exceptionally caring and empathetic',
          icon: '💝',
          color: COLORS.pink,
          rarity: 'rare',
          earned: true,
        });
      }

      // Emotional Stability Badge
      if (personalityProfile.neuroticism < 0.3) {
        badges.push({
          id: 'zen_master',
          title: 'Zen Master',
          description: 'Exceptionally emotionally stable',
          icon: '🧘',
          color: COLORS.green,
          rarity: 'rare',
          earned: true,
        });
      }

      // Love Language Badges
      if (personalityProfile.primaryLoveLanguage) {
        const loveLanguageBadges = {
          WORDS_OF_AFFIRMATION: {
            title: 'Word Wizard',
            description: 'Values verbal appreciation and encouragement',
            icon: '💬',
          },
          ACTS_OF_SERVICE: {
            title: 'Helpful Hero',
            description: 'Feels loved through acts of service',
            icon: '🤝',
          },
          RECEIVING_GIFTS: {
            title: 'Gift Appreciator',
            description: 'Treasures thoughtful gifts and gestures',
            icon: '🎁',
          },
          QUALITY_TIME: {
            title: 'Time Treasure',
            description: 'Values quality time and focused attention',
            icon: '⏰',
          },
          PHYSICAL_TOUCH: {
            title: 'Touch Connoisseur',
            description: 'Feels loved through physical affection',
            icon: '🤗',
          },
        };

        const loveBadge = loveLanguageBadges[personalityProfile.primaryLoveLanguage];
        if (loveBadge) {
          badges.push({
            id: `love_${personalityProfile.primaryLoveLanguage.toLowerCase()}`,
            title: loveBadge.title,
            description: loveBadge.description,
            icon: loveBadge.icon,
            color: COLORS.pink,
            rarity: 'common',
            earned: true,
          });
        }
      }

      // Attachment Style Badges
      if (personalityProfile.attachmentStyle) {
        const attachmentBadges = {
          SECURE: {
            title: 'Relationship Rock',
            description: 'Secure attachment style - relationship superstar',
            icon: '🪨',
            color: COLORS.success,
            rarity: 'uncommon',
          },
          ANXIOUS: {
            title: 'Caring Connector',
            description: 'Anxious attachment - deeply caring and invested',
            icon: '💙',
            color: COLORS.blue,
            rarity: 'common',
          },
          AVOIDANT: {
            title: 'Independent Spirit',
            description: 'Avoidant attachment - values independence',
            icon: '🦅',
            color: COLORS.purple,
            rarity: 'common',
          },
          DISORGANIZED: {
            title: 'Complex Character',
            description: 'Complex attachment patterns - beautifully unique',
            icon: '🎭',
            color: COLORS.warning,
            rarity: 'uncommon',
          },
        };

        const attachmentBadge = attachmentBadges[personalityProfile.attachmentStyle];
        if (attachmentBadge) {
          badges.push({
            id: `attachment_${personalityProfile.attachmentStyle.toLowerCase()}`,
            title: attachmentBadge.title,
            description: attachmentBadge.description,
            icon: attachmentBadge.icon,
            color: attachmentBadge.color,
            rarity: attachmentBadge.rarity,
            earned: true,
          });
        }
      }
    }

    // Future/Locked Badges for motivation
    badges.push(
      {
        id: 'perfect_match',
        title: 'Perfect Match',
        description: 'Find a highly compatible match',
        icon: '💕',
        color: COLORS.textTertiary,
        rarity: 'legendary',
        earned: false,
      },
      {
        id: 'relationship_guru',
        title: 'Relationship Guru',
        description: 'Help 5 friends complete their personality quiz',
        icon: '🧠',
        color: COLORS.textTertiary,
        rarity: 'epic',
        earned: false,
      },
      {
        id: 'first_date',
        title: 'First Date',
        description: 'Go on your first BLONG date',
        icon: '☕',
        color: COLORS.textTertiary,
        rarity: 'uncommon',
        earned: false,
      }
    );

    return badges;
  };

  const getRarityStyle = (rarity, earned) => {
    if (!earned) {
      return {
        backgroundColor: COLORS.border,
        borderColor: COLORS.border,
        shadowColor: 'transparent',
      };
    }

    const rarityStyles = {
      common: {
        backgroundColor: `${COLORS.green}15`,
        borderColor: COLORS.green,
        shadowColor: COLORS.green,
      },
      uncommon: {
        backgroundColor: `${COLORS.blue}15`,
        borderColor: COLORS.blue,
        shadowColor: COLORS.blue,
      },
      rare: {
        backgroundColor: `${COLORS.purple}15`,
        borderColor: COLORS.purple,
        shadowColor: COLORS.purple,
      },
      epic: {
        backgroundColor: `${COLORS.warning}15`,
        borderColor: COLORS.warning,
        shadowColor: COLORS.warning,
      },
      legendary: {
        backgroundColor: `${COLORS.gold}15`,
        borderColor: COLORS.gold,
        shadowColor: COLORS.gold,
      },
      gold: {
        backgroundColor: `${COLORS.gold}15`,
        borderColor: COLORS.gold,
        shadowColor: COLORS.gold,
      },
      silver: {
        backgroundColor: `${COLORS.silver}15`,
        borderColor: COLORS.silver,
        shadowColor: COLORS.silver,
      },
    };

    return rarityStyles[rarity] || rarityStyles.common;
  };

  const renderBadge = (badge, index) => {
    if (!badgeAnims[badge.id]) {
      badgeAnims[badge.id] = new Animated.Value(0);
      Animated.timing(badgeAnims[badge.id], {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }

    const rarityStyle = getRarityStyle(badge.rarity, badge.earned);

    return (
      <Animated.View
        key={badge.id}
        style={{
          opacity: badgeAnims[badge.id],
          transform: [{
            scale: badgeAnims[badge.id].interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }],
          width: (screenWidth - 80) / 2,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: rarityStyle.backgroundColor,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: rarityStyle.borderColor,
            padding: 16,
            alignItems: 'center',
            shadowColor: rarityStyle.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: badge.earned ? 0.2 : 0,
            shadowRadius: 8,
            elevation: badge.earned ? 4 : 0,
            opacity: badge.earned ? 1 : 0.5,
          }}
        >
          {/* Badge Icon */}
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: badge.earned ? `${badge.color}20` : COLORS.border,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ 
              fontSize: badge.earned ? 24 : 20,
              opacity: badge.earned ? 1 : 0.5,
            }}>
              {badge.earned ? badge.icon : '🔒'}
            </Text>
          </View>

          {/* Badge Title */}
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: badge.earned ? COLORS.text : COLORS.textTertiary,
            textAlign: 'center',
            marginBottom: 4,
          }}>
            {badge.title}
          </Text>

          {/* Rarity Indicator */}
          <View style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            backgroundColor: badge.earned ? `${badge.color}20` : COLORS.border,
            borderRadius: 10,
            marginBottom: 8,
          }}>
            <Text style={{
              fontSize: 10,
              fontWeight: '500',
              color: badge.earned ? badge.color : COLORS.textTertiary,
              textTransform: 'uppercase',
            }}>
              {badge.rarity}
            </Text>
          </View>

          {/* Badge Description */}
          <Text style={{
            fontSize: 12,
            color: badge.earned ? COLORS.textSecondary : COLORS.textTertiary,
            textAlign: 'center',
            lineHeight: 16,
          }}>
            {badge.description}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const badges = getBadges();
  const earnedBadges = badges.filter(badge => badge.earned);
  const lockedBadges = badges.filter(badge => !badge.earned);

  return (
    <Animated.View style={[{
      opacity: fadeAnim,
    }, style]}>
      {/* Header */}
      <View style={{
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '500',
          color: COLORS.text,
          marginBottom: 8,
        }}>
          🏆 Personality Badges
        </Text>
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          Collect badges as you explore your personality and find meaningful connections
        </Text>
      </View>

      {/* Stats */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 32,
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            color: COLORS.accent,
          }}>
            {earnedBadges.length}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            Earned
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            color: COLORS.textTertiary,
          }}>
            {badges.length}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            Total
          </Text>
        </View>
      </View>

      {/* Badges Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.text,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              ✨ Your Achievements
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              {earnedBadges.map((badge, index) => renderBadge(badge, index))}
            </View>
          </View>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.textSecondary,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              🔒 Locked Badges
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              {lockedBadges.map((badge, index) => renderBadge(badge, earnedBadges.length + index))}
            </View>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

export default PersonalityBadges;