/**
 * GrowthRecommendations Component Tests
 * Tests for the personalized growth recommendations component
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GrowthRecommendations from '../../../components/quiz/GrowthRecommendations';

// Mock React Native components
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
}));

describe('GrowthRecommendations', () => {
  const mockPersonalityProfile = {
    openness: 0.3, // Low openness
    conscientiousness: 0.8, // High conscientiousness
    extraversion: 0.2, // Low extraversion (introvert)
    agreeableness: 0.9, // High agreeableness
    neuroticism: 0.7, // High neuroticism
    personalityTraits: ['analytical', 'empathetic', 'introverted'],
    primaryLoveLanguage: 'WORDS_OF_AFFIRMATION',
    attachmentStyle: 'ANXIOUS',
  };

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      expect(getByText('🌱 Growth Recommendations')).toBeTruthy();
      expect(getByText('Personalized suggestions to help you grow and thrive')).toBeTruthy();
    });

    it('should render category tabs', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      expect(getByText('Personal')).toBeTruthy();
      expect(getByText('Relationships')).toBeTruthy();
      expect(getByText('Career')).toBeTruthy();
    });

    it('should render personal category by default', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      // Should show personal growth recommendations by default
      expect(getByText('Embrace New Experiences')).toBeTruthy(); // Low openness recommendation
      expect(getByText('Stress Management')).toBeTruthy(); // High neuroticism recommendation
      expect(getByText('Strategic Social Growth')).toBeTruthy(); // Low extraversion recommendation
    });
  });

  describe('Category Navigation', () => {
    it('should switch to relationship recommendations when tab is pressed', async () => {
      const { getByText, queryByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      // Switch to relationships tab
      fireEvent.press(getByText('Relationships'));
      
      await waitFor(() => {
        expect(getByText('Build Secure Attachment')).toBeTruthy(); // Anxious attachment recommendation
        expect(getByText('Express Appreciation')).toBeTruthy(); // Words of affirmation recommendation
        
        // Personal recommendations should not be visible
        expect(queryByText('Embrace New Experiences')).toBeFalsy();
      });
    });

    it('should switch to career recommendations when tab is pressed', async () => {
      const { getByText, queryByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      // Switch to career tab
      fireEvent.press(getByText('Career'));
      
      await waitFor(() => {
        expect(getByText('Maximize Deep Work')).toBeTruthy(); // Low extraversion career recommendation
        
        // Personal recommendations should not be visible
        expect(queryByText('Embrace New Experiences')).toBeFalsy();
      });
    });
  });

  describe('Recommendation Generation', () => {
    it('should generate appropriate recommendations for low openness', () => {
      const profile = { ...mockPersonalityProfile, openness: 0.2 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      expect(getByText('Embrace New Experiences')).toBeTruthy();
      expect(getByText('Try one new activity each week to expand your comfort zone')).toBeTruthy();
    });

    it('should generate appropriate recommendations for high openness', () => {
      const profile = { ...mockPersonalityProfile, openness: 0.9 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      expect(getByText('Channel Your Creativity')).toBeTruthy();
      expect(getByText('Focus your creative energy into meaningful projects')).toBeTruthy();
    });

    it('should generate appropriate recommendations for low conscientiousness', () => {
      const profile = { ...mockPersonalityProfile, conscientiousness: 0.2 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      expect(getByText('Build Better Habits')).toBeTruthy();
      expect(getByText('Develop simple, consistent routines to improve organization')).toBeTruthy();
    });

    it('should generate appropriate recommendations for high neuroticism', () => {
      const profile = { ...mockPersonalityProfile, neuroticism: 0.8 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      expect(getByText('Stress Management')).toBeTruthy();
      expect(getByText('Develop coping strategies for emotional regulation')).toBeTruthy();
    });

    it('should generate appropriate recommendations for high extraversion', () => {
      const profile = { ...mockPersonalityProfile, extraversion: 0.9 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      expect(getByText('Cultivate Solitude')).toBeTruthy();
      expect(getByText('Balance social energy with meaningful alone time')).toBeTruthy();
    });
  });

  describe('Relationship Recommendations', () => {
    it('should generate appropriate recommendations for anxious attachment', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      // Switch to relationships tab
      fireEvent.press(getByText('Relationships'));
      
      expect(getByText('Build Secure Attachment')).toBeTruthy();
      expect(getByText('Work on self-soothing and communication skills')).toBeTruthy();
    });

    it('should generate appropriate recommendations for avoidant attachment', () => {
      const profile = { ...mockPersonalityProfile, attachmentStyle: 'AVOIDANT' };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      // Switch to relationships tab
      fireEvent.press(getByText('Relationships'));
      
      expect(getByText('Embrace Vulnerability')).toBeTruthy();
      expect(getByText('Practice opening up and sharing emotions')).toBeTruthy();
    });

    it('should generate appropriate recommendations for physical touch love language', () => {
      const profile = { ...mockPersonalityProfile, primaryLoveLanguage: 'PHYSICAL_TOUCH' };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      // Switch to relationships tab
      fireEvent.press(getByText('Relationships'));
      
      expect(getByText('Communicate Touch Preferences')).toBeTruthy();
      expect(getByText('Help partners understand your need for physical affection')).toBeTruthy();
    });

    it('should generate empathy recommendations for low agreeableness', () => {
      const profile = { ...mockPersonalityProfile, agreeableness: 0.2 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      // Switch to relationships tab
      fireEvent.press(getByText('Relationships'));
      
      expect(getByText('Develop Empathy Skills')).toBeTruthy();
      expect(getByText('Practice seeing situations from others\' perspectives')).toBeTruthy();
    });
  });

  describe('Career Recommendations', () => {
    it('should generate leadership recommendations for high conscientiousness and openness', () => {
      const profile = { 
        ...mockPersonalityProfile, 
        conscientiousness: 0.8, 
        openness: 0.7 
      };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      // Switch to career tab
      fireEvent.press(getByText('Career'));
      
      expect(getByText('Explore Leadership Roles')).toBeTruthy();
      expect(getByText('Your organization and creativity make you a natural leader')).toBeTruthy();
    });

    it('should generate networking recommendations for high extraversion', () => {
      const profile = { ...mockPersonalityProfile, extraversion: 0.8 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      // Switch to career tab
      fireEvent.press(getByText('Career'));
      
      expect(getByText('Leverage Your Social Skills')).toBeTruthy();
      expect(getByText('Use your people skills for career advancement')).toBeTruthy();
    });

    it('should generate deep work recommendations for low extraversion', () => {
      const profile = { ...mockPersonalityProfile, extraversion: 0.2 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      // Switch to career tab
      fireEvent.press(getByText('Career'));
      
      expect(getByText('Maximize Deep Work')).toBeTruthy();
      expect(getByText('Your focus and depth are valuable assets')).toBeTruthy();
    });

    it('should generate innovation recommendations for high openness', () => {
      const profile = { ...mockPersonalityProfile, openness: 0.8 };
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={profile} />
      );
      
      // Switch to career tab
      fireEvent.press(getByText('Career'));
      
      expect(getByText('Drive Innovation')).toBeTruthy();
      expect(getByText('Your creativity can solve complex problems')).toBeTruthy();
    });
  });

  describe('Default Recommendations', () => {
    it('should show default recommendations when profile has no specific traits', () => {
      const minimalProfile = {
        openness: 0.5,
        conscientiousness: 0.5,
        extraversion: 0.5,
        agreeableness: 0.5,
        neuroticism: 0.5,
      };
      
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={minimalProfile} />
      );
      
      expect(getByText('Continue Self-Discovery')).toBeTruthy();
      
      // Switch to relationships
      fireEvent.press(getByText('Relationships'));
      expect(getByText('Enhance Communication')).toBeTruthy();
      
      // Switch to career
      fireEvent.press(getByText('Career'));
      expect(getByText('Continuous Learning')).toBeTruthy();
    });

    it('should show fallback message when no personality profile provided', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={null} />
      );
      
      expect(getByText('Complete your personality profile to see personalized recommendations')).toBeTruthy();
    });
  });

  describe('Priority Levels', () => {
    it('should display high priority recommendations with appropriate styling', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      // High priority recommendations should be visible
      expect(getByText('HIGH PRIORITY')).toBeTruthy();
    });

    it('should display medium priority recommendations', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      // Medium priority recommendations should be visible
      expect(getByText('MEDIUM PRIORITY')).toBeTruthy();
    });
  });

  describe('Action Steps', () => {
    it('should display actionable steps for each recommendation', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      expect(getByText('💡 Action Step:')).toBeTruthy();
      expect(getByText('Start with small changes like trying a new cuisine or taking a different route to work')).toBeTruthy();
    });
  });

  describe('Animation and Styling', () => {
    it('should apply custom styles when provided', () => {
      const customStyle = { marginTop: 20, backgroundColor: '#f0f0f0' };
      const { getByTestId } = render(
        <GrowthRecommendations 
          personalityProfile={mockPersonalityProfile} 
          style={customStyle}
          testID="growth-recommendations"
        />
      );
      
      // Component should render with custom styles
      expect(getByTestId('growth-recommendations')).toBeTruthy();
    });
  });

  describe('Growth Journey Message', () => {
    it('should display motivational growth message', () => {
      const { getByText } = render(
        <GrowthRecommendations personalityProfile={mockPersonalityProfile} />
      );
      
      expect(getByText('✨ Remember: Growth is a Journey')).toBeTruthy();
      expect(getByText('Focus on one recommendation at a time. Small, consistent steps lead to meaningful change.')).toBeTruthy();
    });
  });
});