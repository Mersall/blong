/**
 * BLONG Profile Completion Dashboard
 * Comprehensive profile completion tracking and analytics
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { apiService } from '../../services/apiService';

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

export const ProfileCompletionDashboard = ({ onNavigateToSection }) => {
  const [completionData, setCompletionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchCompletionData();
  }, []);

  const fetchCompletionData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/profile/completion-status');
      setCompletionData(response.data);
      
      // Animate progress bar
      Animated.timing(animatedValue, {
        toValue: response.data.overall.percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } catch (error) {
      console.error('Error fetching completion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 90) return COLORS.success;
    if (percentage >= 70) return COLORS.accent;
    if (percentage >= 50) return COLORS.warning;
    return COLORS.textTertiary;
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'excellent': return '🌟';
      case 'good': return '✅';
      case 'fair': return '⚡';
      case 'basic': return '📝';
      default: return '🔄';
    }
  };

  const renderProgressBar = () => {
    const percentage = completionData?.overall?.percentage || 0;
    const color = getCompletionColor(percentage);

    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: 24,
        marginBottom: 24,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>
            {getLevelIcon(completionData?.overall?.level)}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              Profile Completion
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}>
              {completionData?.overall?.level?.charAt(0).toUpperCase() + 
               completionData?.overall?.level?.slice(1)} level
            </Text>
          </View>
          <Text style={{
            fontSize: 32,
            fontWeight: '300',
            color: color,
          }}>
            {percentage}%
          </Text>
        </View>

        {/* Animated Progress Bar */}
        <View style={{
          height: 8,
          backgroundColor: COLORS.border,
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            height: 8,
            backgroundColor: color,
            borderRadius: 4,
            width: animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          }} />
        </View>

        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
          marginTop: 8,
        }}>
          {completionData?.overall?.completedSections} of {completionData?.overall?.totalSections} sections complete
        </Text>
      </View>
    );
  };

  const renderSectionCard = (sectionKey, sectionData, title, icon) => {
    const score = completionData?.overall?.score?.[sectionKey] || 0;
    const isCompleted = sectionData?.completed || false;

    return (
      <TouchableOpacity
        onPress={() => onNavigateToSection?.(sectionKey)}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 20,
          marginBottom: 16,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 1,
          borderColor: isCompleted ? COLORS.success + '30' : COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isCompleted ? COLORS.success + '20' : COLORS.accent + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <Text style={{ fontSize: 18 }}>{icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              {title}
            </Text>
            <Text style={{
              fontSize: 12,
              color: isCompleted ? COLORS.success : COLORS.textSecondary,
            }}>
              {isCompleted ? 'Complete' : 'Needs attention'}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: isCompleted ? COLORS.success : COLORS.accent,
              marginBottom: 4,
            }}>
              {score}%
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.accent,
            }}>
              →
            </Text>
          </View>
        </View>

        {/* Progress bar for section */}
        <View style={{
          height: 4,
          backgroundColor: COLORS.border,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <View style={{
            height: 4,
            backgroundColor: isCompleted ? COLORS.success : COLORS.accent,
            borderRadius: 2,
            width: `${score}%`,
          }} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendations = () => {
    const recommendations = completionData?.recommendations || [];
    
    if (recommendations.length === 0) return null;

    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: COLORS.text,
          marginBottom: 16,
        }}>
          💡 Recommendations
        </Text>

        {recommendations.slice(0, 3).map((rec, index) => (
          <View key={index} style={{
            marginBottom: index < 2 ? 12 : 0,
            paddingBottom: index < 2 ? 12 : 0,
            borderBottomWidth: index < 2 ? 1 : 0,
            borderBottomColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              {rec.title}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              lineHeight: 16,
            }}>
              {rec.description}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
      }}>
        <Text style={{
          fontSize: 16,
          color: COLORS.textSecondary,
        }}>
          Loading completion status...
        </Text>
      </View>
    );
  }

  if (!completionData) {
    return null;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {renderProgressBar()}
      
      {renderSectionCard('basicInfo', completionData.sections.basicInfo, 'Basic Information', '👤')}
      {renderSectionCard('profileDetails', completionData.sections.profileDetails, 'Profile Details', '📝')}
      {renderSectionCard('photos', completionData.sections.photos, 'Photos', '📸')}
      {renderSectionCard('preferences', completionData.sections.preferences, 'Preferences', '⚙️')}
      
      {renderRecommendations()}
    </ScrollView>
  );
};

export default ProfileCompletionDashboard;
