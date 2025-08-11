/**
 * BLONG Quiz Selection Interface
 * Comprehensive quiz selection with categories and filtering
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';
import { AppTransition } from '../AppTransition';

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

export const QuizSelectionInterface = ({
  onQuizSelect,
  onBack,
  userProgress = {},
  userPhase = 'single',
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const categories = [
    { id: 'all', name: 'All Quizzes', icon: '📋', color: COLORS.accent },
    { id: 'personality', name: 'Personality', icon: '🧠', color: '#9C27B0' },
    { id: 'relationship', name: 'Relationships', icon: '💕', color: '#E91E63' },
    { id: 'compatibility', name: 'Compatibility', icon: '✨', color: '#FF9800' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', color: '#4CAF50' },
    { id: 'values', name: 'Values', icon: '⭐', color: '#2196F3' },
  ];

  const quizzes = [
    {
      id: 'core_values',
      title: 'Core Values Assessment',
      subtitle: 'Identify your fundamental values and life priorities',
      category: 'values',
      icon: '💎',
      color: '#9C27B0',
      duration: '20-25 min',
      questions: 25,
      difficulty: 'Medium',
      description: 'Discover what truly matters to you and how your values shape your decisions and relationships.',
      tags: ['values', 'priorities', 'life goals'],
      progress: userProgress.coreValues || 0,
      isRecommended: ['single', 'engagement'].includes(userPhase),
    },
    {
      id: 'communication_style',
      title: 'Communication Style',
      subtitle: 'Understand your communication patterns',
      category: 'relationship',
      icon: '💬',
      color: '#E91E63',
      duration: '15-20 min',
      questions: 20,
      difficulty: 'Easy',
      description: 'Learn about your communication preferences and how you interact with others in relationships.',
      tags: ['communication', 'relationships', 'interaction'],
      progress: userProgress.communication || 0,
      isRecommended: true,
    },
    {
      id: 'emotional_intelligence',
      title: 'Emotional Intelligence',
      subtitle: 'Assess your emotional awareness and management',
      category: 'personality',
      icon: '🧠',
      color: '#4CAF50',
      duration: '15-20 min',
      questions: 20,
      difficulty: 'Medium',
      description: 'Understand your ability to recognize, understand, and manage emotions in yourself and others.',
      tags: ['emotions', 'intelligence', 'relationships'],
      progress: userProgress.emotionalIntelligence || 0,
      isRecommended: userPhase === 'engagement',
    },
    {
      id: 'lifestyle_compatibility',
      title: 'Lifestyle Preferences',
      subtitle: 'Share your lifestyle and activity interests',
      category: 'lifestyle',
      icon: '🌟',
      color: '#4CAF50',
      duration: '15-20 min',
      questions: 20,
      difficulty: 'Easy',
      description: 'Explore your lifestyle preferences and find compatibility with potential partners.',
      tags: ['lifestyle', 'activities', 'compatibility'],
      progress: userProgress.lifestyle || 0,
      isRecommended: true,
    },
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const recommendedQuizzes = filteredQuizzes.filter(quiz => quiz.isRecommended);
  const otherQuizzes = filteredQuizzes.filter(quiz => !quiz.isRecommended);

  const renderHeader = () => (
    <View style={{
      paddingTop: 40,
      paddingBottom: 24,
      paddingHorizontal: 32,
      backgroundColor: COLORS.background,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ fontSize: 18, color: COLORS.accent }}>←</Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 20,
          fontWeight: '300',
          color: COLORS.text,
          letterSpacing: 1,
        }}>
          Choose Your Quiz
        </Text>
        
        <View style={{ width: 34 }} />
      </View>

      {/* Search Bar */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20,
      }}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search quizzes..."
          placeholderTextColor={COLORS.textTertiary}
          style={{
            fontSize: 16,
            color: COLORS.text,
            fontWeight: '300',
          }}
        />
      </View>
    </View>
  );

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 32,
        paddingBottom: 20,
      }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => setSelectedCategory(category.id)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: selectedCategory === category.id ? category.color + '20' : COLORS.surface,
            borderWidth: 1,
            borderColor: selectedCategory === category.id ? category.color : COLORS.border,
            marginRight: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 6 }}>{category.icon}</Text>
          <Text style={{
            fontSize: 14,
            fontWeight: selectedCategory === category.id ? '500' : '300',
            color: selectedCategory === category.id ? category.color : COLORS.textSecondary,
          }}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderQuizCard = (quiz, index) => {
    const isCompleted = quiz.progress >= 100;
    const isInProgress = quiz.progress > 0 && quiz.progress < 100;

    return (
      <Animated.View
        key={quiz.id}
        style={{
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }}
      >
        <TouchableOpacity
          onPress={() => onQuizSelect(quiz)}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 32,
            marginBottom: 16,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
            borderWidth: quiz.isRecommended ? 2 : 1,
            borderColor: quiz.isRecommended ? quiz.color : COLORS.border,
          }}
        >
          {/* Recommended Badge */}
          {quiz.isRecommended && (
            <View style={{
              position: 'absolute',
              top: -8,
              right: 16,
              backgroundColor: quiz.color,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '500',
                color: COLORS.background,
                letterSpacing: 0.5,
              }}>
                RECOMMENDED
              </Text>
            </View>
          )}

          {/* Quiz Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: quiz.color + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 20 }}>{quiz.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '300',
                color: COLORS.text,
                marginBottom: 2,
              }}>
                {quiz.title}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
              }}>
                {quiz.duration} • {quiz.questions} questions • {quiz.difficulty}
              </Text>
            </View>

            {/* Status Indicator */}
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: isCompleted ? COLORS.success : 
                             isInProgress ? COLORS.warning : 
                             COLORS.border,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 10,
                color: COLORS.background,
              }}>
                {isCompleted ? '✓' : isInProgress ? '⏳' : '○'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
            marginBottom: 12,
          }}>
            {quiz.description}
          </Text>

          {/* Progress Bar */}
          {quiz.progress > 0 && (
            <View style={{
              height: 4,
              backgroundColor: COLORS.border,
              borderRadius: 2,
              overflow: 'hidden',
              marginBottom: 8,
            }}>
              <View style={{
                height: 4,
                backgroundColor: quiz.color,
                borderRadius: 2,
                width: `${quiz.progress}%`,
              }} />
            </View>
          )}

          {/* Tags */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
            {quiz.tags.slice(0, 3).map((tag, tagIndex) => (
              <View
                key={tagIndex}
                style={{
                  backgroundColor: quiz.color + '15',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  marginRight: 6,
                  marginBottom: 4,
                }}
              >
                <Text style={{
                  fontSize: 10,
                  color: quiz.color,
                  fontWeight: '500',
                }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {renderHeader()}
        {renderCategoryTabs()}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Recommended Section */}
          {recommendedQuizzes.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '300',
                color: COLORS.text,
                marginHorizontal: 32,
                marginBottom: 16,
                letterSpacing: 0.5,
              }}>
                Recommended for You
              </Text>

              {recommendedQuizzes.map((quiz, index) => renderQuizCard(quiz, index))}
            </View>
          )}

          {/* Other Quizzes Section */}
          {otherQuizzes.length > 0 && (
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: '300',
                color: COLORS.text,
                marginHorizontal: 32,
                marginBottom: 16,
                letterSpacing: 0.5,
              }}>
                {recommendedQuizzes.length > 0 ? 'More Quizzes' : 'Available Quizzes'}
              </Text>

              {otherQuizzes.map((quiz, index) => renderQuizCard(quiz, index))}
            </View>
          )}

          {/* No Results */}
          {filteredQuizzes.length === 0 && (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
              <Text style={{ fontSize: 40, marginBottom: 16 }}>🔍</Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '300',
                color: COLORS.text,
                marginBottom: 8,
              }}>
                No quizzes found
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                textAlign: 'center',
              }}>
                Try adjusting your search or category filter
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default QuizSelectionInterface;
