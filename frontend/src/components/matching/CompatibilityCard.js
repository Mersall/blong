/**
 * BLONG Compatibility Card
 * Advanced compatibility display with AI insights and recommendations
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressIndicator, { PROGRESS_TYPES } from '../ui/ProgressIndicator';

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
  error: '#F44336',
  excellent: '#4CAF50',
  good: '#8BC34A',
  moderate: '#FF9800',
  challenging: '#FF5722',
};

const CompatibilityCard = ({
  compatibilityData,
  user1,
  user2,
  onArrangeDate,
  onViewDetails,
  onDismiss,
  style,
  showActions = true,
  compact = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (compatibilityData) {
      Animated.timing(animatedValue, {
        toValue: compatibilityData.score,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }
  }, [compatibilityData]);

  if (!compatibilityData) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 90) return COLORS.excellent;
    if (score >= 80) return COLORS.good;
    if (score >= 70) return COLORS.good;
    if (score >= 60) return COLORS.moderate;
    return COLORS.challenging;
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return ['#4CAF50', '#66BB6A'];
    if (score >= 80) return ['#8BC34A', '#9CCC65'];
    if (score >= 70) return ['#CDDC39', '#D4E157'];
    if (score >= 60) return ['#FF9800', '#FFB74D'];
    return ['#FF5722', '#FF7043'];
  };

  const renderCompatibilityScore = () => (
    <View style={{
      alignItems: 'center',
      marginBottom: 24,
    }}>
      {/* Main Score Circle */}
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <LinearGradient
          colors={getScoreGradient(compatibilityData.score)}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: COLORS.background,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Animated.Text style={{
              fontSize: 32,
              fontWeight: '800',
              color: getScoreColor(compatibilityData.score),
            }}>
              {Math.round(compatibilityData.score)}%
            </Animated.Text>
          </View>
        </LinearGradient>
      </View>

      {/* Compatibility Level */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: COLORS.text,
          marginRight: 8,
        }}>
          {compatibilityData.analysis?.summary?.level || 'Good'} Match
        </Text>
        <Text style={{ fontSize: 20 }}>
          {compatibilityData.analysis?.summary?.emoji || '✨'}
        </Text>
      </View>

      {/* Summary Description */}
      <Text style={{
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 16,
      }}>
        {compatibilityData.analysis?.summary?.description ||
         'You have good compatibility with potential for a meaningful connection.'}
      </Text>
    </View>
  );

  const renderBreakdown = () => (
    <View style={{
      marginBottom: 24,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
      }}>
        {t('compatibility.breakdown')}
      </Text>

      {/* Personality Compatibility */}
      <View style={{ marginBottom: 12 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            🧠 {t('compatibility.personality')}
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: getScoreColor(compatibilityData.breakdown.personality),
          }}>
            {compatibilityData.breakdown.personality}%
          </Text>
        </View>
        <ProgressIndicator
          progress={compatibilityData.breakdown.personality}
          color={getScoreColor(compatibilityData.breakdown.personality)}
          showPercentage={false}
          showLabel={false}
          size="small"
        />
      </View>

      {/* Preferences Compatibility */}
      <View style={{ marginBottom: 12 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            ⚙️ {t('compatibility.preferences')}
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: getScoreColor(compatibilityData.breakdown.preferences),
          }}>
            {compatibilityData.breakdown.preferences}%
          </Text>
        </View>
        <ProgressIndicator
          progress={compatibilityData.breakdown.preferences}
          color={getScoreColor(compatibilityData.breakdown.preferences)}
          showPercentage={false}
          showLabel={false}
          size="small"
        />
      </View>

      {/* Values Compatibility */}
      <View style={{ marginBottom: 12 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
          }}>
            💎 {t('compatibility.values')}
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: getScoreColor(compatibilityData.breakdown.values),
          }}>
            {compatibilityData.breakdown.values}%
          </Text>
        </View>
        <ProgressIndicator
          progress={compatibilityData.breakdown.values}
          color={getScoreColor(compatibilityData.breakdown.values)}
          showPercentage={false}
          showLabel={false}
          size="small"
        />
      </View>
    </View>
  );

  const renderInsights = () => (
    <View style={{
      marginBottom: 24,
    }}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
        }}>
          {t('compatibility.insights')}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View>
          {/* Conversation Starters */}
          {compatibilityData.conversationStarters?.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 8,
              }}>
                💬 {t('compatibility.conversationStarters')}
              </Text>
              {compatibilityData.conversationStarters.slice(0, 2).map((starter, index) => (
                <Text key={index} style={{
                  fontSize: 13,
                  color: COLORS.textSecondary,
                  marginBottom: 4,
                  fontStyle: 'italic',
                }}>
                  "{ starter }"
                </Text>
              ))}
            </View>
          )}

          {/* Suggested Venues */}
          {compatibilityData.suggestedVenues?.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 8,
              }}>
                📍 {t('compatibility.suggestedVenues')}
              </Text>
              {compatibilityData.suggestedVenues.slice(0, 3).map((venue, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: COLORS.text,
                    fontWeight: '500',
                    marginRight: 8,
                  }}>
                    {venue.type}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textTertiary,
                    flex: 1,
                  }}>
                    {venue.reason}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Strength Areas */}
          {compatibilityData.strengthAreas?.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.success,
                marginBottom: 8,
              }}>
                ✅ {t('compatibility.strengths')}
              </Text>
              {compatibilityData.strengthAreas.slice(0, 3).map((strength, index) => (
                <Text key={index} style={{
                  fontSize: 13,
                  color: COLORS.textSecondary,
                  marginBottom: 2,
                }}>
                  • {strength}
                </Text>
              ))}
            </View>
          )}

          {/* Potential Challenges */}
          {compatibilityData.potentialChallenges?.length > 0 && (
            <View>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.warning,
                marginBottom: 8,
              }}>
                ⚠️ {t('compatibility.challenges')}
              </Text>
              {compatibilityData.potentialChallenges.slice(0, 2).map((challenge, index) => (
                <Text key={index} style={{
                  fontSize: 13,
                  color: COLORS.textSecondary,
                  marginBottom: 2,
                }}>
                  • {challenge}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderActions = () => {
    if (!showActions) return null;

    const canArrangeDate = compatibilityData.recommendation?.shouldArrangeDate;

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
      }}>
        {/* Dismiss Button */}
        <TouchableOpacity
          onPress={onDismiss}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 24,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
            marginRight: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            fontWeight: '500',
          }}>
            {t('common.notNow')}
          </Text>
        </TouchableOpacity>

        {/* Main Action Button */}
        <TouchableOpacity
          onPress={canArrangeDate ? onArrangeDate : onViewDetails}
          style={{
            flex: 2,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 24,
            backgroundColor: canArrangeDate ? COLORS.accent : COLORS.success,
            marginLeft: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 14,
            color: COLORS.background,
            fontWeight: '600',
          }}>
            {canArrangeDate
              ? t('compatibility.arrangeDate')
              : t('compatibility.learnMore')
            }
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (compact) {
    return (
      <View style={[
        {
          backgroundColor: COLORS.background,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: COLORS.border,
        },
        style,
      ]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: getScoreColor(compatibilityData.score) + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: getScoreColor(compatibilityData.score),
              }}>
                {compatibilityData.score}%
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 4,
              }}>
                {compatibilityData.analysis?.summary?.level || 'Good'} Match
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                numberOfLines: 2,
              }}>
                {compatibilityData.analysis?.summary?.description}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onViewDetails}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 16,
              backgroundColor: COLORS.accent,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: COLORS.background,
              fontWeight: '600',
            }}>
              {t('common.viewDetails')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      style,
    ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderCompatibilityScore()}
        {renderBreakdown()}
        {renderInsights()}
        {renderActions()}
      </ScrollView>
    </View>
  );
};

export default CompatibilityCard;