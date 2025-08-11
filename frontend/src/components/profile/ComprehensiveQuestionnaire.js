/**
 * BLONG Comprehensive Questionnaire
 * In-depth personality and compatibility questions for better matching
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text as UIText } from '../ui';

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
};

// Comprehensive question categories
export const QUESTION_CATEGORIES = {
  PERSONALITY: {
    id: 'personality',
    title: 'Personality & Values',
    subtitle: 'Help us understand who you are at your core',
    icon: '🧠',
    questions: [
      {
        id: 'core_values',
        type: 'multi_select',
        question: 'What are your core values? (Select up to 5)',
        options: [
          { value: 'honesty', label: 'Honesty & Integrity' },
          { value: 'family', label: 'Family & Relationships' },
          { value: 'career', label: 'Career & Success' },
          { value: 'adventure', label: 'Adventure & Exploration' },
          { value: 'spirituality', label: 'Spirituality & Faith' },
          { value: 'creativity', label: 'Creativity & Arts' },
          { value: 'health', label: 'Health & Wellness' },
          { value: 'education', label: 'Learning & Growth' },
          { value: 'community', label: 'Community & Service' },
          { value: 'independence', label: 'Independence & Freedom' }
        ],
        maxSelections: 5,
        required: true
      },
      {
        id: 'personality_type',
        type: 'single_select',
        question: 'How would you describe your personality?',
        options: [
          { value: 'extrovert', label: 'Extrovert - I gain energy from being around people' },
          { value: 'introvert', label: 'Introvert - I prefer quiet time to recharge' },
          { value: 'ambivert', label: 'Ambivert - I enjoy both social time and alone time' }
        ],
        required: true
      },
      {
        id: 'communication_style',
        type: 'single_select',
        question: 'How do you prefer to communicate in relationships?',
        options: [
          { value: 'direct', label: 'Direct and straightforward' },
          { value: 'gentle', label: 'Gentle and considerate' },
          { value: 'analytical', label: 'Analytical and detailed' },
          { value: 'emotional', label: 'Emotional and expressive' },
          { value: 'humorous', label: 'Light-hearted and humorous' }
        ],
        required: true
      },
      {
        id: 'conflict_resolution',
        type: 'single_select',
        question: 'How do you handle disagreements?',
        options: [
          { value: 'discuss_immediately', label: 'Address issues immediately' },
          { value: 'take_time', label: 'Take time to think before discussing' },
          { value: 'seek_compromise', label: 'Always look for compromise' },
          { value: 'avoid_conflict', label: 'Prefer to avoid conflict when possible' },
          { value: 'seek_help', label: 'Seek outside perspective when needed' }
        ],
        required: true
      }
    ]
  },

  RELATIONSHIP_GOALS: {
    id: 'relationship_goals',
    title: 'Relationship Goals',
    subtitle: 'What are you looking for in a relationship?',
    icon: '💕',
    questions: [
      {
        id: 'relationship_timeline',
        type: 'single_select',
        question: 'What is your ideal relationship timeline?',
        options: [
          { value: 'casual_dating', label: 'Casual dating for now' },
          { value: 'serious_relationship', label: 'Looking for a serious relationship' },
          { value: 'marriage_minded', label: 'Marriage-minded within 1-2 years' },
          { value: 'marriage_soon', label: 'Ready for marriage soon' },
          { value: 'open_to_possibilities', label: 'Open to see where things go' }
        ],
        required: true
      },
      {
        id: 'family_plans',
        type: 'single_select',
        question: 'What are your plans regarding children?',
        options: [
          { value: 'want_children_soon', label: 'Want children within 2-3 years' },
          { value: 'want_children_eventually', label: 'Want children eventually' },
          { value: 'maybe_children', label: 'Maybe want children' },
          { value: 'no_children', label: 'Do not want children' },
          { value: 'have_children', label: 'Already have children' },
          { value: 'open_to_stepchildren', label: 'Open to partner having children' }
        ],
        required: true
      },
      {
        id: 'deal_breakers',
        type: 'multi_select',
        question: 'What are absolute deal breakers for you?',
        options: [
          { value: 'smoking', label: 'Smoking' },
          { value: 'excessive_drinking', label: 'Excessive drinking' },
          { value: 'dishonesty', label: 'Dishonesty' },
          { value: 'different_religion', label: 'Different religious beliefs' },
          { value: 'no_ambition', label: 'Lack of ambition' },
          { value: 'poor_hygiene', label: 'Poor personal hygiene' },
          { value: 'different_values', label: 'Fundamentally different values' },
          { value: 'financial_irresponsibility', label: 'Financial irresponsibility' }
        ],
        maxSelections: 8,
        required: false
      },
      {
        id: 'love_language',
        type: 'single_select',
        question: 'What is your primary love language?',
        options: [
          { value: 'words_of_affirmation', label: 'Words of Affirmation' },
          { value: 'quality_time', label: 'Quality Time' },
          { value: 'physical_touch', label: 'Physical Touch' },
          { value: 'acts_of_service', label: 'Acts of Service' },
          { value: 'receiving_gifts', label: 'Receiving Gifts' }
        ],
        required: true
      }
    ]
  },

  LIFESTYLE: {
    id: 'lifestyle',
    title: 'Lifestyle & Interests',
    subtitle: 'Tell us about how you like to spend your time',
    icon: '🌟',
    questions: [
      {
        id: 'social_preferences',
        type: 'single_select',
        question: 'How do you prefer to socialize?',
        options: [
          { value: 'large_groups', label: 'Large groups and parties' },
          { value: 'small_gatherings', label: 'Small intimate gatherings' },
          { value: 'one_on_one', label: 'One-on-one conversations' },
          { value: 'mix_of_both', label: 'Mix of different social settings' },
          { value: 'prefer_quiet', label: 'Prefer quiet activities' }
        ],
        required: true
      },
      {
        id: 'weekend_activities',
        type: 'multi_select',
        question: 'How do you like to spend your weekends?',
        options: [
          { value: 'outdoor_activities', label: 'Outdoor activities & nature' },
          { value: 'cultural_events', label: 'Museums, galleries, cultural events' },
          { value: 'sports_fitness', label: 'Sports and fitness activities' },
          { value: 'home_relaxation', label: 'Relaxing at home' },
          { value: 'social_events', label: 'Social events and parties' },
          { value: 'travel_exploration', label: 'Travel and exploration' },
          { value: 'hobbies_crafts', label: 'Hobbies and creative projects' },
          { value: 'learning_reading', label: 'Learning and reading' }
        ],
        maxSelections: 5,
        required: true
      },
      {
        id: 'travel_preferences',
        type: 'single_select',
        question: 'What describes your travel style?',
        options: [
          { value: 'adventure_seeker', label: 'Adventure seeker - love trying new things' },
          { value: 'cultural_explorer', label: 'Cultural explorer - interested in history and culture' },
          { value: 'relaxation_focused', label: 'Relaxation focused - prefer peaceful getaways' },
          { value: 'luxury_traveler', label: 'Luxury traveler - enjoy comfort and fine experiences' },
          { value: 'budget_conscious', label: 'Budget conscious - prefer affordable adventures' },
          { value: 'homebody', label: 'Prefer staying close to home' }
        ],
        required: true
      },
      {
        id: 'fitness_lifestyle',
        type: 'single_select',
        question: 'How important is fitness in your life?',
        options: [
          { value: 'very_active', label: 'Very active - exercise is a daily priority' },
          { value: 'moderately_active', label: 'Moderately active - exercise regularly' },
          { value: 'occasionally_active', label: 'Occasionally active - when I have time' },
          { value: 'prefer_other_activities', label: 'Prefer other activities over traditional exercise' },
          { value: 'not_priority', label: 'Fitness is not a priority for me' }
        ],
        required: true
      }
    ]
  },

  BACKGROUND: {
    id: 'background',
    title: 'Background & Values',
    subtitle: 'Share your background and what matters to you',
    icon: '🏛️',
    questions: [
      {
        id: 'cultural_background',
        type: 'single_select',
        question: 'How important is cultural background in a relationship?',
        options: [
          { value: 'very_important', label: 'Very important - prefer same background' },
          { value: 'somewhat_important', label: 'Somewhat important but open to others' },
          { value: 'not_important', label: 'Not important - open to all backgrounds' },
          { value: 'prefer_different', label: 'Prefer learning about different cultures' }
        ],
        required: true
      },
      {
        id: 'religious_beliefs',
        type: 'single_select',
        question: 'How important is religion/spirituality to you?',
        options: [
          { value: 'very_religious', label: 'Very religious - central to my life' },
          { value: 'moderately_religious', label: 'Moderately religious - important but flexible' },
          { value: 'spiritual_not_religious', label: 'Spiritual but not religious' },
          { value: 'not_religious', label: 'Not religious or spiritual' },
          { value: 'open_minded', label: 'Open-minded about different beliefs' }
        ],
        required: true
      },
      {
        id: 'financial_attitudes',
        type: 'single_select',
        question: 'What best describes your approach to finances?',
        options: [
          { value: 'saver', label: 'Saver - I prioritize saving and investing' },
          { value: 'balanced', label: 'Balanced - I save but also enjoy spending' },
          { value: 'spender', label: 'Spender - I enjoy spending on experiences' },
          { value: 'frugal', label: 'Frugal - I prefer simple, low-cost living' },
          { value: 'generous', label: 'Generous - I like helping others financially' }
        ],
        required: true
      }
    ]
  },

  FUTURE_PLANS: {
    id: 'future_plans',
    title: 'Future Plans',
    subtitle: 'Where do you see yourself going?',
    icon: '🚀',
    questions: [
      {
        id: 'career_ambitions',
        type: 'single_select',
        question: 'How important is career advancement to you?',
        options: [
          { value: 'very_ambitious', label: 'Very ambitious - career is a top priority' },
          { value: 'moderately_ambitious', label: 'Moderately ambitious - want to grow' },
          { value: 'work_life_balance', label: 'Prefer work-life balance over advancement' },
          { value: 'family_focused', label: 'Family and relationships come first' },
          { value: 'entrepreneurial', label: 'Entrepreneurial - want to start my own business' }
        ],
        required: true
      },
      {
        id: 'living_preferences',
        type: 'single_select',
        question: 'Where would you prefer to live long-term?',
        options: [
          { value: 'big_city', label: 'Big city with lots of opportunities' },
          { value: 'suburbs', label: 'Suburbs - quiet but accessible' },
          { value: 'small_town', label: 'Small town - close-knit community' },
          { value: 'rural', label: 'Rural area - peaceful and natural' },
          { value: 'flexible', label: 'Flexible - open to different places' },
          { value: 'travel_frequently', label: 'Travel frequently - not tied to one place' }
        ],
        required: true
      },
      {
        id: 'life_goals',
        type: 'multi_select',
        question: 'What are your main life goals? (Select up to 5)',
        options: [
          { value: 'happy_marriage', label: 'Happy marriage and family' },
          { value: 'career_success', label: 'Career success and recognition' },
          { value: 'financial_security', label: 'Financial security and wealth' },
          { value: 'travel_world', label: 'Travel and see the world' },
          { value: 'help_others', label: 'Help others and make a difference' },
          { value: 'personal_growth', label: 'Continuous personal growth' },
          { value: 'creative_expression', label: 'Creative expression and arts' },
          { value: 'health_wellness', label: 'Health and wellness' },
          { value: 'adventure', label: 'Adventure and new experiences' },
          { value: 'spiritual_growth', label: 'Spiritual growth and meaning' }
        ],
        maxSelections: 5,
        required: true
      }
    ]
  }
};

// Question component for rendering individual questions
const QuestionComponent = ({ question, value, onAnswer, error }) => {
  const renderOptions = () => {
    if (question.type === 'single_select') {
      return question.options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={{
            padding: 16,
            backgroundColor: value === option.value ? COLORS.accent + '10' : COLORS.surface,
            borderRadius: 8,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: value === option.value ? COLORS.accent : COLORS.border,
          }}
          onPress={() => onAnswer(option.value)}
        >
          <Text style={{
            fontSize: 14,
            color: value === option.value ? COLORS.accent : COLORS.text,
            fontWeight: value === option.value ? '500' : '300',
          }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ));
    }

    if (question.type === 'multi_select') {
      const selectedValues = Array.isArray(value) ? value : [];
      
      return question.options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const canSelect = selectedValues.length < (question.maxSelections || 10);
        
        return (
          <TouchableOpacity
            key={option.value}
            style={{
              padding: 16,
              backgroundColor: isSelected ? COLORS.accent + '10' : COLORS.surface,
              borderRadius: 8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: isSelected ? COLORS.accent : COLORS.border,
              opacity: (!isSelected && !canSelect) ? 0.5 : 1,
            }}
            onPress={() => {
              if (isSelected) {
                onAnswer(selectedValues.filter(v => v !== option.value));
              } else if (canSelect) {
                onAnswer([...selectedValues, option.value]);
              }
            }}
            disabled={!isSelected && !canSelect}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                fontSize: 14,
                color: isSelected ? COLORS.accent : COLORS.text,
                fontWeight: isSelected ? '500' : '300',
                flex: 1,
              }}>
                {option.label}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              )}
            </View>
          </TouchableOpacity>
        );
      });
    }
  };

  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 8,
        lineHeight: 24,
      }}>
        {question.question}
        {question.required && <Text style={{ color: COLORS.accent }}> *</Text>}
      </Text>
      
      {question.type === 'multi_select' && question.maxSelections && (
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          marginBottom: 16,
        }}>
          Select up to {question.maxSelections} options
          {Array.isArray(value) && value.length > 0 && ` (${value.length} selected)`}
        </Text>
      )}

      {renderOptions()}

      {error && (
        <Text style={{
          fontSize: 12,
          color: COLORS.accent,
          marginTop: 8,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default QuestionComponent;
