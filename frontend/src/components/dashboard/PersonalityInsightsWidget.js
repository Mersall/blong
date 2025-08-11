/**
 * BLONG Personality Insights Widget
 * Premium dashboard widget showing personality insights and compatibility tips
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

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
  
  traits: {
    openness: '#9C27B0',
    conscientiousness: '#2196F3',
    extraversion: '#FF9800',
    agreeableness: '#4CAF50',
    neuroticism: '#F44336',
  },
};

const PersonalityInsightsWidget = ({
  personalityData = {},
  onPress = null,
  style = {},
}) => {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Generate daily insights based on personality data
  const generateInsights = () => {
    const traits = personalityData || {};
    const insights = [];

    // Get dominant trait
    const dominantTrait = Object.entries(traits).reduce((a, b) => 
      traits[a[0]] > traits[b[0]] ? a : b
    );

    if (dominantTrait) {
      const [traitKey, value] = dominantTrait;
      
      switch (traitKey) {
        case 'openness':
          insights.push({
            icon: '🎨',
            title: 'Creative Explorer',
            insight: 'Your openness to new experiences makes you an ideal partner for cultural adventures and deep conversations.',
            tip: 'Try suggesting unique date ideas like art galleries or cooking classes.',
            color: COLORS.traits.openness,
          });
          break;
        case 'conscientiousness':
          insights.push({
            icon: '🎯',
            title: 'Reliable Partner',
            insight: 'Your conscientiousness shows you value commitment and long-term planning in relationships.',
            tip: 'Share your goals and appreciate partners who value stability.',
            color: COLORS.traits.conscientiousness,
          });
          break;
        case 'extraversion':
          insights.push({
            icon: '⚡',
            title: 'Social Butterfly',
            insight: 'Your extraversion means you bring energy and enthusiasm to social situations.',
            tip: 'Plan group activities or social events for memorable dates.',
            color: COLORS.traits.extraversion,
          });
          break;
        case 'agreeableness':
          insights.push({
            icon: '❤️',
            title: 'Empathetic Soul',
            insight: 'Your high agreeableness makes you naturally caring and understanding.',
            tip: 'Your compassion is attractive - don\'t be afraid to show your caring nature.',
            color: COLORS.traits.agreeableness,
          });
          break;
        case 'neuroticism':
          if (value < 50) {
            insights.push({
              icon: '🧘',
              title: 'Emotionally Stable',
              insight: 'Your emotional stability helps you stay calm during relationship challenges.',
              tip: 'Your steady presence can be very comforting to partners.',
              color: COLORS.success,
            });
          }
          break;
      }
    }

    // Add general insights
    insights.push(
      {
        icon: '💝',
        title: 'Perfect Match Potential',
        insight: 'Your personality profile shows strong compatibility with thoughtful, genuine people.',
        tip: 'Focus on authentic connections rather than trying to impress.',
        color: COLORS.accent,
      },
      {
        icon: '🌟',
        title: 'Relationship Strength',
        insight: 'Your balanced personality traits create a foundation for lasting relationships.',
        tip: 'Be confident in what you bring to a partnership.',
        color: COLORS.success,
      }
    );

    return insights;
  };

  const insights = generateInsights();
  const currentInsight = insights[currentInsightIndex] || insights[0];

  // Auto-rotate insights every 5 seconds
  useEffect(() => {
    if (insights.length > 1) {
      const interval = setInterval(() => {
        animateToNextInsight();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [insights.length, currentInsightIndex]);

  const animateToNextInsight = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
    }, 200);
  };

  const handlePress = () => {
    // Scale animation feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      onPress(currentInsight);
    }
  };

  if (!currentInsight) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[style]}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <LinearGradient
          colors={[`${currentInsight.color}15`, `${currentInsight.color}05`]}
          style={{
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: `${currentInsight.color}30`,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 20,
                marginRight: 12,
              }}>
                {currentInsight.icon}
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
              }}>
                {currentInsight.title}
              </Text>
            </View>

            {/* Insight Counter */}
            {insights.length > 1 && (
              <View style={{
                flexDirection: 'row',
                gap: 4,
              }}>
                {insights.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: index === currentInsightIndex 
                        ? currentInsight.color 
                        : COLORS.border,
                    }}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Insight Content */}
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
              marginBottom: 12,
            }}>
              {currentInsight.insight}
            </Text>

            {/* Tip Section */}
            <View style={{
              backgroundColor: COLORS.background,
              borderRadius: 12,
              padding: 12,
              borderLeftWidth: 3,
              borderLeftColor: currentInsight.color,
            }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '600',
                color: currentInsight.color,
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                Daily Tip
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.text,
                lineHeight: 16,
              }}>
                {currentInsight.tip}
              </Text>
            </View>
          </Animated.View>

          {/* Action Hint */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 10,
              color: COLORS.textTertiary,
              textAlign: 'center',
            }}>
              Tap for detailed personality insights
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default PersonalityInsightsWidget;