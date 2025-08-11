/**
 * BLONG Personality Insight Card
 * Beautiful card component for displaying personality insights
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const PersonalityInsightCard = ({ insight, onPress, style, animated = true }) => {
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnimation.setValue(1);
      opacityAnimation.setValue(1);
    }
  }, [animated]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'PERSONALITY_TRAIT':
        return 'person';
      case 'LOVE_LANGUAGE':
        return 'heart';
      case 'ATTACHMENT_STYLE':
        return 'people';
      case 'COMPATIBILITY':
        return 'link';
      case 'GROWTH_AREA':
        return 'trending-up';
      case 'STRENGTH':
        return 'star';
      case 'BALANCE':
        return 'scale';
      case 'UNIQUE_TRAITS':
        return 'diamond';
      default:
        return 'information-circle';
    }
  };

  const getInsightGradient = (type) => {
    switch (type) {
      case 'PERSONALITY_TRAIT':
        return ['#667eea', '#764ba2'];
      case 'LOVE_LANGUAGE':
        return ['#ff6b6b', '#feca57'];
      case 'ATTACHMENT_STYLE':
        return ['#48cae4', '#023e8a'];
      case 'COMPATIBILITY':
        return ['#a8e6cf', '#3d5a80'];
      case 'GROWTH_AREA':
        return ['#ffd23f', '#ff6b35'];
      case 'STRENGTH':
        return ['#06ffa5', '#00d4aa'];
      case 'BALANCE':
        return ['#c471f5', '#fa71cd'];
      case 'UNIQUE_TRAITS':
        return ['#fcf6bd', '#d4a574'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress && onPress(insight);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: opacityAnimation,
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchable}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <LinearGradient
            colors={getInsightGradient(insight.insightType)}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={getInsightIcon(insight.insightType)}
                  size={24}
                  color="white"
                />
              </View>
              
              {insight.score && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{insight.score}%</Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {insight.title}
              </Text>
              
              <Text style={styles.description} numberOfLines={3}>
                {insight.description}
              </Text>

              {/* Traits Tags */}
              {insight.traits && insight.traits.length > 0 && (
                <View style={styles.traitsContainer}>
                  {insight.traits.slice(0, 3).map((trait, index) => (
                    <View key={index} style={styles.traitTag}>
                      <Text style={styles.traitText}>{trait}</Text>
                    </View>
                  ))}
                  {insight.traits.length > 3 && (
                    <View style={styles.traitTag}>
                      <Text style={styles.traitText}>+{insight.traits.length - 3}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Tap to explore</Text>
              <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
            </View>

            {/* Priority Indicator */}
            {insight.priority && insight.priority >= 4 && (
              <View style={styles.priorityIndicator}>
                <Ionicons name="flag" size={16} color="#FFD700" />
              </View>
            )}
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  touchable: {
    borderRadius: 16,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    minHeight: 200,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  traitTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  traitText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PersonalityInsightCard;