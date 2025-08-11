/**
 * BLONG Quiz Progress Card
 * Shows quiz completion status and encourages completion
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import quizService from '../../services/quizService';

const QuizProgressCard = ({ navigation, style }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressAnim] = useState(new Animated.Value(0));

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

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const progressData = await quizService.getQuizProgress();
      setProgress(progressData);
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: progressData.overallProgress || 0,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } catch (error) {
      console.error('Error loading quiz progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !progress) {
    return null;
  }

  // Don't show if quiz is complete
  if (progress.isComplete) {
    return null;
  }

  const getProgressMessage = () => {
    const overallProgress = progress.overallProgress || 0;
    
    if (overallProgress === 0) {
      return {
        title: '🎯 Discover Your Personality',
        subtitle: 'Take our scientific assessment to find better matches',
        buttonText: 'Start Quiz',
        color: COLORS.accent,
      };
    } else if (overallProgress < 50) {
      return {
        title: '🚀 Great Start!',
        subtitle: `You're ${Math.round(overallProgress)}% complete. Keep going!`,
        buttonText: 'Continue Quiz',
        color: COLORS.warning,
      };
    } else {
      return {
        title: '🔥 Almost There!',
        subtitle: `You're ${Math.round(overallProgress)}% complete. Finish to unlock insights!`,
        buttonText: 'Finish Quiz',
        color: COLORS.success,
      };
    }
  };

  const progressInfo = getProgressMessage();

  return (
    <TouchableOpacity
      onPress={() => {
        if (progress.overallProgress === 0) {
          navigation.navigate('QuizIntro');
        } else {
          navigation.navigate('Quiz');
        }
      }}
      style={[{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: `${progressInfo.color}20`,
      }, style]}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            {progressInfo.title}
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
          }}>
            {progressInfo.subtitle}
          </Text>
        </View>
        
        <View style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: progressInfo.color,
          borderRadius: 16,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: COLORS.background,
          }}>
            {progressInfo.buttonText}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {progress.overallProgress > 0 && (
        <View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
            }}>
              Progress
            </Text>
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: progressInfo.color,
            }}>
              {Math.round(progress.overallProgress)}%
            </Text>
          </View>
          
          <View style={{
            height: 6,
            backgroundColor: COLORS.border,
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <Animated.View style={{
              height: '100%',
              backgroundColor: progressInfo.color,
              borderRadius: 3,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            }} />
          </View>
        </View>
      )}

      {/* Category Progress */}
      {progress.categories && progress.categories.length > 0 && (
        <View style={{
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: COLORS.textTertiary,
            marginBottom: 8,
          }}>
            Categories
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {progress.categories.map((category, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: category.isComplete 
                  ? `${COLORS.success}15` 
                  : `${COLORS.border}30`,
                borderRadius: 12,
              }}>
                <Text style={{
                  fontSize: 10,
                  marginRight: 4,
                }}>
                  {category.isComplete ? '✅' : '⏳'}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: category.isComplete 
                    ? COLORS.success 
                    : COLORS.textTertiary,
                  fontWeight: '500',
                }}>
                  {category.categoryName}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default QuizProgressCard;
