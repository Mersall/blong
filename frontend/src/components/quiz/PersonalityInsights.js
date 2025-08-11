/**
 * BLONG Personality Insights
 * Detailed personality insights and compatibility explanations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';

const PersonalityInsights = ({ personalityProfile, insights, style }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [animatedHeights] = useState({});

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
    info: '#2196F3',
    // Personality trait colors
    openness: '#9C27B0',
    conscientiousness: '#2196F3',
    extraversion: '#FF9800',
    agreeableness: '#4CAF50',
    neuroticism: '#F44336',
  };

  const traitColors = {
    openness: COLORS.openness,
    conscientiousness: COLORS.conscientiousness,
    extraversion: COLORS.extraversion,
    agreeableness: COLORS.agreeableness,
    neuroticism: COLORS.neuroticism,
  };

  const toggleSection = (sectionKey) => {
    const isExpanded = expandedSections[sectionKey];
    
    if (!animatedHeights[sectionKey]) {
      animatedHeights[sectionKey] = new Animated.Value(isExpanded ? 1 : 0);
    }

    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !isExpanded,
    }));

    Animated.timing(animatedHeights[sectionKey], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderPersonalityTrait = (traitKey, traitName, insight) => {
    if (!insight) return null;

    const isExpanded = expandedSections[traitKey];
    const score = personalityProfile?.[`${traitKey}Score`] || 0;
    const color = traitColors[traitKey] || COLORS.accent;

    return (
      <View key={traitKey} style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}>
        <TouchableOpacity
          onPress={() => toggleSection(traitKey)}
          style={{
            padding: 20,
            borderLeftWidth: 4,
            borderLeftColor: color,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.text,
            }}>
              {traitName}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <View style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: `${color}15`,
                borderRadius: 8,
                marginRight: 8,
              }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: color,
                }}>
                  {insight.level}
                </Text>
              </View>
              <Text style={{
                fontSize: 12,
                color: COLORS.textTertiary,
              }}>
                {isExpanded ? '▲' : '▼'}
              </Text>
            </View>
          </View>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
          }}>
            {insight.description}
          </Text>
        </TouchableOpacity>

        {/* Expanded Content */}
        {animatedHeights[traitKey] && (
          <Animated.View style={{
            opacity: animatedHeights[traitKey],
            maxHeight: animatedHeights[traitKey].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
          }}>
            <View style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
              marginTop: -1,
            }}>
              {/* Traits */}
              {insight.traits && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: COLORS.textTertiary,
                    marginBottom: 8,
                  }}>
                    Key Traits
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}>
                    {insight.traits.map((trait, index) => (
                      <View key={index} style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor: `${color}10`,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: `${color}30`,
                      }}>
                        <Text style={{
                          fontSize: 11,
                          color: color,
                          fontWeight: '500',
                        }}>
                          {trait}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Compatibility */}
              {insight.compatibility && (
                <View>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: COLORS.textTertiary,
                    marginBottom: 6,
                  }}>
                    💕 Relationship Compatibility
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: COLORS.textSecondary,
                    lineHeight: 18,
                    fontStyle: 'italic',
                  }}>
                    {insight.compatibility}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderLoveLanguageInsight = () => {
    if (!insights.loveLanguage) return null;

    const insight = insights.loveLanguage;
    const isExpanded = expandedSections.loveLanguage;

    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}>
        <TouchableOpacity
          onPress={() => toggleSection('loveLanguage')}
          style={{
            padding: 20,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.accent,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>💕</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                Love Language
              </Text>
            </View>
            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
            }}>
              {isExpanded ? '▲' : '▼'}
            </Text>
          </View>

          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: COLORS.accent,
            marginBottom: 4,
          }}>
            {insight.name}
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
          }}>
            {insight.description}
          </Text>
        </TouchableOpacity>

        {/* Expanded Content */}
        {animatedHeights.loveLanguage && (
          <Animated.View style={{
            opacity: animatedHeights.loveLanguage,
            maxHeight: animatedHeights.loveLanguage.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 100],
            }),
          }}>
            <View style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
              marginTop: -1,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: COLORS.textTertiary,
                marginBottom: 6,
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
          </Animated.View>
        )}
      </View>
    );
  };

  const renderAttachmentStyleInsight = () => {
    if (!insights.attachmentStyle) return null;

    const insight = insights.attachmentStyle;
    const isExpanded = expandedSections.attachmentStyle;

    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}>
        <TouchableOpacity
          onPress={() => toggleSection('attachmentStyle')}
          style={{
            padding: 20,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.info,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>🤝</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.text,
              }}>
                Attachment Style
              </Text>
            </View>
            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
            }}>
              {isExpanded ? '▲' : '▼'}
            </Text>
          </View>

          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: COLORS.info,
            marginBottom: 4,
          }}>
            {insight.name}
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
          }}>
            {insight.description}
          </Text>
        </TouchableOpacity>

        {/* Expanded Content */}
        {animatedHeights.attachmentStyle && (
          <Animated.View style={{
            opacity: animatedHeights.attachmentStyle,
            maxHeight: animatedHeights.attachmentStyle.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 150],
            }),
          }}>
            <View style={{
              paddingHorizontal: 20,
              paddingBottom: 20,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
              marginTop: -1,
            }}>
              {/* Strengths */}
              {insight.strengths && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: COLORS.textTertiary,
                    marginBottom: 6,
                  }}>
                    ✨ Your Strengths
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 6,
                  }}>
                    {insight.strengths.map((strength, index) => (
                      <View key={index} style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        backgroundColor: `${COLORS.success}15`,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: `${COLORS.success}30`,
                      }}>
                        <Text style={{
                          fontSize: 10,
                          color: COLORS.success,
                          fontWeight: '500',
                        }}>
                          {strength}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Growth Tip */}
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: COLORS.textTertiary,
                marginBottom: 6,
              }}>
                🌱 Growth Tip
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
          </Animated.View>
        )}
      </View>
    );
  };

  if (!personalityProfile || !insights) {
    return (
      <View style={[{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }, style]}>
        <Text style={{
          fontSize: 16,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          Complete the personality quiz to see your insights
        </Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <Text style={{
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
      }}>
        🔍 Personality Insights
      </Text>

      {/* Big Five Traits */}
      {renderPersonalityTrait('openness', 'Openness to Experience', insights.openness)}
      {renderPersonalityTrait('conscientiousness', 'Conscientiousness', insights.conscientiousness)}
      {renderPersonalityTrait('extraversion', 'Extraversion', insights.extraversion)}
      {renderPersonalityTrait('agreeableness', 'Agreeableness', insights.agreeableness)}
      {renderPersonalityTrait('neuroticism', 'Emotional Stability', insights.neuroticism)}

      {/* Love Language */}
      {renderLoveLanguageInsight()}

      {/* Attachment Style */}
      {renderAttachmentStyleInsight()}
    </View>
  );
};

export default PersonalityInsights;
