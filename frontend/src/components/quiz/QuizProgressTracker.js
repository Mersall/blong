/**
 * BLONG Quiz Progress Tracker
 * Advanced progress tracking with category breakdown and animations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';

const QuizProgressTracker = ({ 
  categories, 
  responses, 
  currentCategoryIndex, 
  currentQuestionIndex,
  onCategoryPress,
  style 
}) => {
  const [progressAnimations] = useState({});
  const [showDetails, setShowDetails] = useState(false);

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
    // Category colors
    personality: '#9C27B0',
    loveLanguages: '#E91E63',
    attachment: '#2196F3',
    lifestyle: '#4CAF50',
  };

  const categoryColors = {
    'big_five': COLORS.personality,
    'love_languages': COLORS.loveLanguages,
    'attachment': COLORS.attachment,
    'lifestyle': COLORS.lifestyle,
  };

  useEffect(() => {
    // Initialize animations for each category
    categories.forEach((category, index) => {
      if (!progressAnimations[index]) {
        progressAnimations[index] = new Animated.Value(0);
      }
    });
    
    // Animate progress bars
    animateProgress();
  }, [categories, responses]);

  const animateProgress = () => {
    const animations = categories.map((category, index) => {
      const progress = getCategoryProgress(category);
      return Animated.timing(progressAnimations[index], {
        toValue: progress,
        duration: 800,
        delay: index * 100,
        useNativeDriver: false,
      });
    });

    Animated.parallel(animations).start();
  };

  const getCategoryProgress = (category) => {
    if (!category.questions || category.questions.length === 0) return 0;
    
    let answeredQuestions = 0;
    category.questions.forEach(question => {
      if (responses[question.id]) {
        answeredQuestions++;
      }
    });
    
    return (answeredQuestions / category.questions.length) * 100;
  };

  const getOverallProgress = () => {
    if (categories.length === 0) return 0;
    
    let totalQuestions = 0;
    let answeredQuestions = 0;
    
    categories.forEach(category => {
      if (category.questions) {
        totalQuestions += category.questions.length;
        category.questions.forEach(question => {
          if (responses[question.id]) {
            answeredQuestions++;
          }
        });
      }
    });
    
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  };

  const getCategoryIcon = (categoryKey) => {
    const icons = {
      'big_five': '🧠',
      'love_languages': '💕',
      'attachment': '🤝',
      'lifestyle': '✨',
    };
    return icons[categoryKey] || '📝';
  };

  const renderCategoryProgress = (category, index) => {
    const progress = getCategoryProgress(category);
    const isActive = index === currentCategoryIndex;
    const isCompleted = progress === 100;
    const color = categoryColors[category.key] || COLORS.accent;
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => onCategoryPress && onCategoryPress(index)}
        style={{
          backgroundColor: isActive ? `${color}10` : COLORS.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: isActive ? 2 : 1,
          borderColor: isActive ? color : COLORS.border,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
            <Text style={{
              fontSize: 20,
              marginRight: 12,
            }}>
              {getCategoryIcon(category.key)}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.text,
                marginBottom: 2,
              }}>
                {category.name}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
              }}>
                {category.questions?.length || 0} questions
              </Text>
            </View>
          </View>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {isCompleted && (
              <Text style={{
                fontSize: 16,
                marginRight: 8,
              }}>
                ✅
              </Text>
            )}
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: isCompleted ? COLORS.success : color,
            }}>
              {Math.round(progress)}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={{
          height: 6,
          backgroundColor: COLORS.border,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: 3,
            width: progressAnimations[index] ? progressAnimations[index].interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }) : '0%',
          }} />
        </View>

        {/* Current Question Indicator */}
        {isActive && (
          <View style={{
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 11,
              color: COLORS.textTertiary,
            }}>
              Question {currentQuestionIndex + 1} of {category.questions?.length || 0}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderOverallProgress = () => {
    const overallProgress = getOverallProgress();
    const completedCategories = categories.filter(cat => getCategoryProgress(cat) === 100).length;
    
    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '500',
            color: COLORS.text,
          }}>
            Overall Progress
          </Text>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.accent,
          }}>
            {Math.round(overallProgress)}%
          </Text>
        </View>

        {/* Overall Progress Bar */}
        <View style={{
          height: 8,
          backgroundColor: COLORS.border,
          borderRadius: 4,
          marginBottom: 16,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            height: '100%',
            backgroundColor: COLORS.accent,
            borderRadius: 4,
            width: `${overallProgress}%`,
          }} />
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: COLORS.success,
            }}>
              {completedCategories}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
            }}>
              Completed
            </Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: COLORS.warning,
            }}>
              {categories.length - completedCategories}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
            }}>
              Remaining
            </Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: COLORS.accent,
            }}>
              {categories.reduce((total, cat) => total + (cat.questions?.length || 0), 0)}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
            }}>
              Total Questions
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[{ padding: 20 }, style]}>
      {/* Overall Progress */}
      {renderOverallProgress()}

      {/* Toggle Details */}
      <TouchableOpacity
        onPress={() => setShowDetails(!showDetails)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.accent,
          marginRight: 8,
        }}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.accent,
        }}>
          {showDetails ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Category Progress Details */}
      {showDetails && (
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.text,
            marginBottom: 16,
          }}>
            Category Progress
          </Text>
          
          {categories.map((category, index) => renderCategoryProgress(category, index))}
        </View>
      )}
    </View>
  );
};

export default QuizProgressTracker;
