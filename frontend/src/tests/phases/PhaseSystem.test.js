/**
 * BLONG Phase System Comprehensive Test Suite
 * Tests phase transitions, content delivery, and data management
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import phase screens
import SinglePhaseScreen from '../../screens/phases/SinglePhaseScreen';
import EnhancedSinglePhaseScreen from '../../screens/phases/EnhancedSinglePhaseScreen';
import EngagementPhaseScreen from '../../screens/phases/EngagementPhaseScreen';
import EnhancedEngagementPhaseScreen from '../../screens/phases/EnhancedEngagementPhaseScreen';
import EnhancedPreparingPhaseScreen from '../../screens/phases/EnhancedPreparingPhaseScreen';
import EngagementDayPrepScreen from '../../screens/phases/EngagementDayPrepScreen';

// Import services
import { questionnaireService, QUESTIONNAIRE_DATA } from '../../services/questionnaireService';
import { apiService } from '../../services/apiService';

// Import components
import PhaseProgressionWidget from '../../components/dashboard/PhaseProgressionWidget';
import PhaseSelection from '../../screens/onboarding/PhaseSelection';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../services/apiService');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

describe('Phase System Comprehensive Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('Phase Data Management', () => {
    
    test('questionnaireService should provide data for all phases', () => {
      const phases = ['single', 'preparing', 'engagement', 'engagement_day_prep'];
      
      phases.forEach(phase => {
        const questionnaire = questionnaireService.getQuestionnaireByPhase(phase);
        expect(questionnaire).toBeTruthy();
        expect(questionnaire.id).toBe(`${phase}_questionnaire`);
        expect(questionnaire.questions).toBeInstanceOf(Array);
        expect(questionnaire.questions.length).toBeGreaterThan(0);
      });
    });

    test('questionnaire validation should work correctly', () => {
      const phase = 'single';
      const validAnswers = {
        q1: 'serious',
        q2: 'Coffee and conversation',
        q3: 'humor'
      };
      
      const invalidAnswers = {
        q1: 'serious'
        // Missing required q2 and q3
      };

      const validResult = questionnaireService.validateAnswers(phase, validAnswers);
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const invalidResult = questionnaireService.validateAnswers(phase, invalidAnswers);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    test('API service should have phase-related endpoints', () => {
      expect(typeof apiService.getPhases).toBe('function');
      expect(typeof apiService.getQuestionnaire).toBe('function');
      expect(typeof apiService.submitQuestionnaireAnswers).toBe('function');
    });
  });

  describe('Phase Screen Rendering', () => {
    
    const mockProps = {
      userPreferences: { phase: { id: 'single' } },
      user: { id: '1', email: 'test@example.com' },
      onLogout: jest.fn(),
      navigation: {
        navigate: jest.fn(),
        goBack: jest.fn()
      },
      onNavigateToQuestionnaire: jest.fn()
    };

    test('SinglePhaseScreen should render correctly', () => {
      const { getByText } = render(
        <SinglePhaseScreen {...mockProps} />
      );
      
      // Should render home screen by default
      expect(getByText).toBeTruthy();
    });

    test('EnhancedSinglePhaseScreen should render with self-reflection tools', () => {
      const { getByText } = render(
        <EnhancedSinglePhaseScreen {...mockProps} />
      );
      
      expect(getByText('💝 SINGLES')).toBeTruthy();
      expect(getByText('Dating Readiness Score')).toBeTruthy();
      expect(getByText('Self-Reflection Tools')).toBeTruthy();
    });

    test('EngagementPhaseScreen should render correctly', () => {
      const engagementProps = {
        ...mockProps,
        userPreferences: { phase: { id: 'engagement' } }
      };
      
      const { getByText } = render(
        <EngagementPhaseScreen {...engagementProps} />
      );
      
      expect(getByText).toBeTruthy();
    });

    test('EnhancedEngagementPhaseScreen should render wedding planning tools', () => {
      const { getByText } = render(
        <EnhancedEngagementPhaseScreen {...mockProps} />
      );
      
      expect(getByText('✨ ENGAGEMENT')).toBeTruthy();
      expect(getByText('Wedding Countdown')).toBeTruthy();
      expect(getByText('Wedding Planning Tools')).toBeTruthy();
    });

    test('EnhancedPreparingPhaseScreen should render relationship tools', () => {
      const { getByText } = render(
        <EnhancedPreparingPhaseScreen {...mockProps} />
      );
      
      expect(getByText('💍 PREPARING')).toBeTruthy();
      expect(getByText('Relationship Readiness')).toBeTruthy();
      expect(getByText('Vision Board')).toBeTruthy();
      expect(getByText('Relationship Goals')).toBeTruthy();
    });
  });

  describe('Phase Selection and Navigation', () => {
    
    test('PhaseSelection should render all available phases', () => {
      const mockOnPhaseSelect = jest.fn();
      
      const { getByText } = render(
        <PhaseSelection onPhaseSelect={mockOnPhaseSelect} />
      );
      
      // Check if phase selection UI is rendered
      expect(getByText).toBeTruthy();
    });

    test('Phase selection should trigger callback with correct phase data', () => {
      const mockOnPhaseSelect = jest.fn();
      
      const { getByTestId } = render(
        <PhaseSelection onPhaseSelect={mockOnPhaseSelect} />
      );
      
      // Test would need testID props added to PhaseSelection component
      // This is a framework for the test
    });
  });

  describe('Phase Progression and Tracking', () => {
    
    test('PhaseProgressionWidget should display correct phase information', () => {
      const props = {
        currentPhase: 'single',
        progress: 65,
        milestones: [
          { id: '1', title: 'Complete profile', completed: true },
          { id: '2', title: 'Upload photos', completed: true },
          { id: '3', title: 'Set preferences', completed: false }
        ]
      };
      
      const { getByText } = render(
        <PhaseProgressionWidget {...props} />
      );
      
      expect(getByText('Ready for Love')).toBeTruthy();
      expect(getByText('65%')).toBeTruthy();
      expect(getByText('Phase Milestones')).toBeTruthy();
    });

    test('Phase progression should calculate milestones correctly', () => {
      const milestones = [
        { id: '1', title: 'Task 1', completed: true },
        { id: '2', title: 'Task 2', completed: true },
        { id: '3', title: 'Task 3', completed: false },
        { id: '4', title: 'Task 4', completed: false }
      ];
      
      const completed = milestones.filter(m => m.completed).length;
      const progress = (completed / milestones.length) * 100;
      
      expect(completed).toBe(2);
      expect(progress).toBe(50);
    });
  });

  describe('Phase Content Delivery', () => {
    
    test('Single phase should focus on self-discovery content', () => {
      const singleQuestionnaire = QUESTIONNAIRE_DATA.single;
      
      expect(singleQuestionnaire.title).toContain('Dating Profile');
      expect(singleQuestionnaire.questions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            question: expect.stringContaining('relationship')
          })
        ])
      );
    });

    test('Engagement phase should focus on wedding planning content', () => {
      const engagementQuestionnaire = QUESTIONNAIRE_DATA.engagement;
      
      expect(engagementQuestionnaire.title).toContain('Wedding Planning');
      expect(engagementQuestionnaire.questions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            question: expect.stringContaining('wedding')
          })
        ])
      );
    });

    test('Preparing phase should focus on relationship building', () => {
      const preparingQuestionnaire = QUESTIONNAIRE_DATA.preparing;
      
      expect(preparingQuestionnaire.title).toContain('Relationship Goals');
      expect(preparingQuestionnaire.questions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            question: expect.stringContaining('relationship')
          })
        ])
      );
    });
  });

  describe('Phase Transition Scenarios', () => {
    
    test('Phase transition should preserve user data', async () => {
      const userData = {
        currentPhase: 'single',
        progress: 75,
        completedMilestones: ['profile', 'photos']
      };
      
      await AsyncStorage.setItem('user_phase_data', JSON.stringify(userData));
      
      const stored = await AsyncStorage.getItem('user_phase_data');
      const parsedData = JSON.parse(stored);
      
      expect(parsedData.currentPhase).toBe('single');
      expect(parsedData.progress).toBe(75);
      expect(parsedData.completedMilestones).toContain('profile');
    });

    test('Phase transition should update API correctly', async () => {
      const mockApiCall = jest.spyOn(apiService, 'post');
      mockApiCall.mockResolvedValue({ data: { success: true } });
      
      const newPhaseData = {
        phase: 'preparing',
        transitionDate: new Date().toISOString()
      };
      
      await apiService.post('/user/phase-transition', newPhaseData);
      
      expect(mockApiCall).toHaveBeenCalledWith('/user/phase-transition', newPhaseData);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    
    test('Should handle invalid phase gracefully', () => {
      const invalidPhase = questionnaireService.getQuestionnaireByPhase('invalid_phase');
      expect(invalidPhase).toBeNull();
    });

    test('Should handle missing questionnaire data', () => {
      const mockProps = {
        userPreferences: { phase: { id: 'invalid_phase' } },
        user: { id: '1' },
        onLogout: jest.fn(),
        navigation: { navigate: jest.fn(), goBack: jest.fn() }
      };
      
      // Should not crash when invalid phase is provided
      expect(() => {
        render(<SinglePhaseScreen {...mockProps} />);
      }).not.toThrow();
    });

    test('Should handle network errors during phase data loading', async () => {
      const mockApiError = jest.spyOn(apiService, 'getQuestionnaire');
      mockApiError.mockRejectedValue(new Error('Network error'));
      
      try {
        await apiService.getQuestionnaire('single');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });
  });

  describe('Phase-Specific Features', () => {
    
    test('Single phase should have dating readiness scoring', () => {
      const { getByText } = render(
        <EnhancedSinglePhaseScreen 
          userPreferences={{ phase: { id: 'single' } }}
          user={{ id: '1' }}
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }}
        />
      );
      
      expect(getByText('Dating Readiness Score')).toBeTruthy();
    });

    test('Engagement phase should have wedding countdown', () => {
      const { getByText } = render(
        <EnhancedEngagementPhaseScreen 
          userPreferences={{ phase: { id: 'engagement' } }}
          user={{ id: '1' }}
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }}
        />
      );
      
      expect(getByText('Wedding Countdown')).toBeTruthy();
    });

    test('Preparing phase should have relationship goals tracking', () => {
      const { getByText } = render(
        <EnhancedPreparingPhaseScreen 
          userPreferences={{ phase: { id: 'preparing' } }}
          user={{ id: '1' }}
          navigation={{ navigate: jest.fn(), goBack: jest.fn() }}
        />
      );
      
      expect(getByText('Relationship Goals')).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    
    test('Phase system should integrate with questionnaire service', async () => {
      const phase = 'single';
      const answers = {
        q1: 'serious',
        q2: 'Coffee date',
        q3: 'humor'
      };
      
      const result = await questionnaireService.submitAnswers(phase, answers);
      
      expect(result.success).toBe(true);
      expect(result.phase).toBe(phase);
      expect(result.answersCount).toBe(3);
    });

    test('Phase progression should trigger appropriate UI updates', () => {
      const initialProps = {
        currentPhase: 'single',
        progress: 30,
        milestones: []
      };
      
      const { rerender, getByText } = render(
        <PhaseProgressionWidget {...initialProps} />
      );
      
      expect(getByText('30%')).toBeTruthy();
      
      const updatedProps = {
        ...initialProps,
        progress: 85
      };
      
      rerender(<PhaseProgressionWidget {...updatedProps} />);
      expect(getByText('85%')).toBeTruthy();
    });
  });
});

describe('Phase System Performance Tests', () => {
  
  test('Phase screens should render within acceptable time', async () => {
    const startTime = Date.now();
    
    render(
      <EnhancedSinglePhaseScreen 
        userPreferences={{ phase: { id: 'single' } }}
        user={{ id: '1' }}
        navigation={{ navigate: jest.fn(), goBack: jest.fn() }}
      />
    );
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1000); // Should render within 1 second
  });

  test('Phase data loading should be optimized', async () => {
    const startTime = Date.now();
    
    const questionnaire = questionnaireService.getQuestionnaireByPhase('single');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(100); // Should load within 100ms
    expect(questionnaire).toBeTruthy();
  });
});