/**
 * BLONG Compatibility Explanation
 * Explains how personality affects relationship compatibility
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const CompatibilityExplanation = ({ personalityProfile, style }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
    love: '#E91E63',
  };

  const getCompatibilityOverview = () => {
    if (!personalityProfile) return null;

    const {
      opennessScore = 0,
      conscientiousnessScore = 0,
      extraversionScore = 0,
      agreeablenessScore = 0,
      neuroticismScore = 0,
      primaryLoveLanguage,
      attachmentStyle,
    } = personalityProfile;

    return {
      idealPartner: getIdealPartnerDescription(),
      relationshipStrengths: getRelationshipStrengths(),
      growthAreas: getGrowthAreas(),
      communicationStyle: getCommunicationStyle(),
      conflictResolution: getConflictResolutionStyle(),
    };
  };

  const getIdealPartnerDescription = () => {
    const { extraversionScore = 0, agreeablenessScore = 0, neuroticismScore = 0 } = personalityProfile;
    
    let description = "Your ideal partner would be someone who ";
    
    if (extraversionScore > 70) {
      description += "can match your social energy or provide a calming balance, ";
    } else if (extraversionScore < 30) {
      description += "appreciates deep, meaningful conversations and quiet moments together, ";
    } else {
      description += "is flexible with both social activities and intimate time, ";
    }

    if (agreeablenessScore > 70) {
      description += "values harmony and emotional connection, ";
    } else if (agreeablenessScore < 30) {
      description += "appreciates directness and can handle healthy debate, ";
    } else {
      description += "balances empathy with honest communication, ";
    }

    if (neuroticismScore > 70) {
      description += "and provides emotional stability and reassurance.";
    } else if (neuroticismScore < 30) {
      description += "and can benefit from your emotional stability.";
    } else {
      description += "and shares your balanced emotional approach.";
    }

    return description;
  };

  const getRelationshipStrengths = () => {
    const strengths = [];
    const { 
      opennessScore = 0, 
      conscientiousnessScore = 0, 
      extraversionScore = 0, 
      agreeablenessScore = 0, 
      neuroticismScore = 0 
    } = personalityProfile;

    if (opennessScore > 60) {
      strengths.push("Bringing creativity and adventure to relationships");
    }
    if (conscientiousnessScore > 60) {
      strengths.push("Creating stability and following through on commitments");
    }
    if (extraversionScore > 60) {
      strengths.push("Building social connections and bringing energy");
    }
    if (agreeablenessScore > 60) {
      strengths.push("Fostering harmony and emotional support");
    }
    if (neuroticismScore < 40) {
      strengths.push("Providing emotional stability during challenges");
    }

    return strengths.length > 0 ? strengths : ["Building authentic connections based on your unique personality"];
  };

  const getGrowthAreas = () => {
    const areas = [];
    const { 
      opennessScore = 0, 
      conscientiousnessScore = 0, 
      extraversionScore = 0, 
      agreeablenessScore = 0, 
      neuroticismScore = 0 
    } = personalityProfile;

    if (opennessScore < 40) {
      areas.push("Being open to your partner's new ideas and experiences");
    }
    if (conscientiousnessScore < 40) {
      areas.push("Following through on relationship commitments and plans");
    }
    if (extraversionScore > 70) {
      areas.push("Appreciating quiet, intimate moments with your partner");
    }
    if (agreeablenessScore < 40) {
      areas.push("Practicing empathy and compromise during disagreements");
    }
    if (neuroticismScore > 60) {
      areas.push("Managing stress and communicating emotional needs clearly");
    }

    return areas.length > 0 ? areas : ["Continuing to grow together as a couple"];
  };

  const getCommunicationStyle = () => {
    const { extraversionScore = 0, agreeablenessScore = 0 } = personalityProfile;
    
    if (extraversionScore > 60 && agreeablenessScore > 60) {
      return "You likely communicate openly and warmly, expressing feelings easily and seeking harmony.";
    } else if (extraversionScore > 60 && agreeablenessScore < 40) {
      return "You probably communicate directly and assertively, not afraid to express your opinions.";
    } else if (extraversionScore < 40 && agreeablenessScore > 60) {
      return "You tend to communicate thoughtfully and diplomatically, preferring deeper conversations.";
    } else if (extraversionScore < 40 && agreeablenessScore < 40) {
      return "You likely communicate selectively and directly, valuing honest and meaningful exchanges.";
    } else {
      return "You have a balanced communication style that adapts to different situations and people.";
    }
  };

  const getConflictResolutionStyle = () => {
    const { agreeablenessScore = 0, neuroticismScore = 0 } = personalityProfile;
    
    if (agreeablenessScore > 60 && neuroticismScore < 40) {
      return "You likely approach conflicts calmly, seeking compromise and understanding.";
    } else if (agreeablenessScore > 60 && neuroticismScore > 60) {
      return "You prefer to avoid conflict but may need support in addressing issues directly.";
    } else if (agreeablenessScore < 40 && neuroticismScore < 40) {
      return "You probably address conflicts head-on with confidence and directness.";
    } else if (agreeablenessScore < 40 && neuroticismScore > 60) {
      return "You may feel strongly about conflicts and benefit from taking time to cool down first.";
    } else {
      return "You have a balanced approach to conflict, adapting your style to the situation.";
    }
  };

  const renderTabButton = (tabKey, label, icon) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tabKey)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: activeTab === tabKey ? COLORS.accent : COLORS.surface,
        borderWidth: 1,
        borderColor: activeTab === tabKey ? COLORS.accent : COLORS.border,
        marginRight: 8,
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 14, marginRight: 6 }}>{icon}</Text>
        <Text style={{
          fontSize: 12,
          fontWeight: '500',
          color: activeTab === tabKey ? COLORS.background : COLORS.textSecondary,
        }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderOverviewTab = () => {
    const overview = getCompatibilityOverview();
    if (!overview) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ideal Partner */}
        <View style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.love,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
            marginBottom: 8,
          }}>
            💕 Your Ideal Partner
          </Text>
          <Text style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 18,
          }}>
            {overview.idealPartner}
          </Text>
        </View>

        {/* Communication Style */}
        <View style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.info,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
            marginBottom: 8,
          }}>
            💬 Your Communication Style
          </Text>
          <Text style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 18,
          }}>
            {overview.communicationStyle}
          </Text>
        </View>

        {/* Conflict Resolution */}
        <View style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.warning,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.text,
            marginBottom: 8,
          }}>
            🤝 Conflict Resolution
          </Text>
          <Text style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 18,
          }}>
            {overview.conflictResolution}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderStrengthsTab = () => {
    const overview = getCompatibilityOverview();
    if (!overview) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.text,
          marginBottom: 16,
          textAlign: 'center',
        }}>
          ✨ Your Relationship Strengths
        </Text>

        {overview.relationshipStrengths.map((strength, index) => (
          <View key={index} style={{
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.success,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 16, marginRight: 12 }}>✅</Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.text,
                flex: 1,
                lineHeight: 20,
              }}>
                {strength}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderGrowthTab = () => {
    const overview = getCompatibilityOverview();
    if (!overview) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.text,
          marginBottom: 16,
          textAlign: 'center',
        }}>
          🌱 Growth Opportunities
        </Text>

        {overview.growthAreas.map((area, index) => (
          <View key={index} style={{
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.info,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 16, marginRight: 12 }}>🎯</Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.text,
                flex: 1,
                lineHeight: 20,
              }}>
                {area}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  if (!personalityProfile) {
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
          Complete your personality profile to see compatibility insights
        </Text>
      </View>
    );
  }

  return (
    <View style={[{
      backgroundColor: COLORS.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    }, style]}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
      }}>
        💕 Relationship Compatibility
      </Text>

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {renderTabButton('overview', 'Overview', '📋')}
        {renderTabButton('strengths', 'Strengths', '✨')}
        {renderTabButton('growth', 'Growth', '🌱')}
      </ScrollView>

      {/* Tab Content */}
      <View style={{ minHeight: 200 }}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'strengths' && renderStrengthsTab()}
        {activeTab === 'growth' && renderGrowthTab()}
      </View>
    </View>
  );
};

export default CompatibilityExplanation;
