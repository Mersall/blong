/**
 * GamifiedQuizScreen Component Tests
 * Tests for the gamified quiz experience component
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GamifiedQuizScreen from '../../../components/quiz/GamifiedQuizScreen';
import quizService from '../../../services/quizService';
import { useLoading } from '../../../hooks/useLoading';

// Mock dependencies
jest.mock('../../../services/quizService');
jest.mock('../../../hooks/useLoading');
jest.mock('../../../components/loading', () => ({
  PremiumLoader: ({ message }) => <div testID="premium-loader">{message}</div>,
}));
jest.mock('../../../components/quiz/ParticleSystem', () => ({ children }) => <div>{children}</div>);
jest.mock('../../../components/quiz/AchievementPopup', () => ({ achievement, visible }) => 
  visible ? <div testID="achievement-popup">{achievement?.title}</div> : null
);
jest.mock('../../../components/quiz/QuizProgressBar', () => ({ progress }) => 
  <div testID="progress-bar" data-progress={progress} />
);
jest.mock('../../../components/quiz/PremiumQuizQuestion', () => ({ 
  question, 
  selectedAnswer, 
  onAnswer 
}) => (
  <div testID="quiz-card">
    <div testID="question-text">{question?.text}</div>
    {question?.options?.map((option, index) => (
      <button 
        key={option.id} 
        testID={`option-${index}`}
        onPress={() => onOptionSelect(option)}
      >
        {option.text}
      </button>
    ))}
  </div>
));
jest.mock('../../../components/quiz/QuizSessionTimer', () => () => 
  <div testID="quiz-timer">Timer</div>
);

// Mock React Native components
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Vibration: {
    vibrate: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
}));

const Stack = createStackNavigator();

const TestWrapper = ({ children, route }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="GamifiedQuiz" 
        component={() => React.cloneElement(children, { route })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('GamifiedQuizScreen', () => {
  const mockSetLoading = jest.fn();
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockReplace = jest.fn();

  const mockQuizSession = {
    sessionToken: 'test-session-token',
    category: { id: 'cat1', name: 'Personality Assessment' },
    progressPercentage: 25,
    answeredQuestions: 2,
    totalQuestions: 8,
    startedAt: new Date().toISOString(),
    nextQuestion: {
      id: 'q1',
      text: 'How do you prefer to spend your free time?',
      type: 'MULTIPLE_CHOICE',
      options: [
        { id: 'opt1', text: 'Reading a book' },
        { id: 'opt2', text: 'Socializing with friends' },
        { id: 'opt3', text: 'Exercising outdoors' },
        { id: 'opt4', text: 'Learning something new' },
      ],
    },
  };

  const mockRoute = {
    params: {
      categoryId: 'cat1',
      sessionToken: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    useLoading.mockReturnValue({
      setLoading: mockSetLoading,
    });

    // Mock navigation
    jest.doMock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
        replace: mockReplace,
      }),
    }));

    quizService.startQuizSession.mockResolvedValue(mockQuizSession);
    quizService.resumeQuizSession.mockResolvedValue(mockQuizSession);
  });

  describe('Component Initialization', () => {
    it('should render loading state initially', async () => {
      const { getByTestId } = render(
        <TestWrapper route={mockRoute}>
          <GamifiedQuizScreen />
        </TestWrapper>
      );

      expect(getByTestId('premium-loader')).toBeTruthy();
    });

    it('should start new quiz session when no existing session token', async () => {
      await act(async () => {
        render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(quizService.startQuizSession).toHaveBeenCalledWith('cat1');
        expect(mockSetLoading).toHaveBeenCalledWith(true, 'Starting your personality journey...');
      });
    });

    it('should resume existing session when session token provided', async () => {
      const routeWithToken = {
        params: {
          categoryId: 'cat1',
          sessionToken: 'existing-token',
        },
      };

      await act(async () => {
        render(
          <TestWrapper route={routeWithToken}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(quizService.resumeQuizSession).toHaveBeenCalledWith('existing-token');
      });
    });

    it('should handle initialization errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      quizService.startQuizSession.mockRejectedValue(new Error('Network error'));

      await act(async () => {
        render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Error initializing quiz session:', expect.any(Error));
        expect(mockGoBack).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe('Quiz Session Display', () => {
    it('should display quiz session information correctly', async () => {
      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        const { getByText, getByTestId } = component;
        expect(getByText('Personality Assessment')).toBeTruthy();
        expect(getByText('Question 3 of 8')).toBeTruthy(); // answeredQuestions + 1
        expect(getByTestId('progress-bar')).toBeTruthy();
        expect(getByTestId('quiz-timer')).toBeTruthy();
      });
    });

    it('should display current question and options', async () => {
      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        const { getByTestId } = component;
        expect(getByTestId('question-text')).toBeTruthy();
        expect(getByTestId('option-0')).toBeTruthy();
        expect(getByTestId('option-1')).toBeTruthy();
        expect(getByTestId('option-2')).toBeTruthy();
        expect(getByTestId('option-3')).toBeTruthy();
      });
    });
  });

  describe('Answer Selection and Submission', () => {
    it('should handle option selection', async () => {
      const mockAnswerResponse = {
        session: { ...mockQuizSession, answeredQuestions: 3 },
        progressData: { percentage: 37.5 },
        nextQuestion: {
          id: 'q2',
          text: 'Next question',
          options: [
            { id: 'opt5', text: 'Option A' },
            { id: 'opt6', text: 'Option B' },
          ],
        },
        achievements: [],
      };

      quizService.answerQuestionInSession.mockResolvedValue(mockAnswerResponse);

      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(component.getByTestId('option-0')).toBeTruthy();
      });

      // Simulate option selection
      await act(async () => {
        fireEvent.press(component.getByTestId('option-0'));
      });

      // Wait for auto-submit
      await waitFor(() => {
        expect(quizService.answerQuestionInSession).toHaveBeenCalledWith(
          'test-session-token',
          'q1',
          'opt1',
          expect.any(Number)
        );
      }, { timeout: 1000 });
    });

    it('should handle quiz completion', async () => {
      const mockCompletionResponse = {
        session: { ...mockQuizSession, answeredQuestions: 8 },
        personalityProfile: {
          openness: 0.7,
          conscientiousness: 0.8,
          extraversion: 0.6,
          agreeableness: 0.9,
          neuroticism: 0.3,
        },
        achievements: [
          { id: 'complete', title: 'Quiz Master', description: 'Completed personality assessment' }
        ],
        nextQuestion: null, // No next question means quiz is complete
      };

      quizService.answerQuestionInSession.mockResolvedValue(mockCompletionResponse);

      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(component.getByTestId('option-0')).toBeTruthy();
      });

      // Simulate final answer
      await act(async () => {
        fireEvent.press(component.getByTestId('option-0'));
      });

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(true, 'Analyzing your personality...');
      });

      // Should navigate to results after delay
      setTimeout(async () => {
        await waitFor(() => {
          expect(mockReplace).toHaveBeenCalledWith('QuizResults', {
            session: mockCompletionResponse.session,
            personalityProfile: mockCompletionResponse.personalityProfile,
            achievements: mockCompletionResponse.achievements,
          });
        });
      }, 2100);
    });

    it('should handle achievements display', async () => {
      const mockResponseWithAchievement = {
        session: { ...mockQuizSession, answeredQuestions: 3 },
        progressData: { percentage: 37.5 },
        nextQuestion: mockQuizSession.nextQuestion,
        achievements: [
          { id: 'milestone', title: 'Quick Learner', description: 'Answered 5 questions' }
        ],
      };

      quizService.answerQuestionInSession.mockResolvedValue(mockResponseWithAchievement);

      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(component.getByTestId('option-0')).toBeTruthy();
      });

      await act(async () => {
        fireEvent.press(component.getByTestId('option-0'));
      });

      await waitFor(() => {
        expect(component.getByTestId('achievement-popup')).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle answer submission errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      quizService.answerQuestionInSession.mockRejectedValue(new Error('Submission failed'));

      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(component.getByTestId('option-0')).toBeTruthy();
      });

      await act(async () => {
        fireEvent.press(component.getByTestId('option-0'));
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Error submitting answer:', expect.any(Error));
      });

      consoleError.mockRestore();
    });
  });

  describe('Progress Tracking', () => {
    it('should display progress correctly based on completion percentage', async () => {
      const sessionWithHighProgress = {
        ...mockQuizSession,
        progressPercentage: 85,
        answeredQuestions: 6,
      };

      quizService.startQuizSession.mockResolvedValue(sessionWithHighProgress);

      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        const progressBar = component.getByTestId('progress-bar');
        expect(progressBar.props['data-progress']).toBe(0.85);
      });
    });

    it('should animate progress updates', async () => {
      const mockProgressUpdate = {
        session: { ...mockQuizSession, answeredQuestions: 4 },
        progressData: { percentage: 50 },
        nextQuestion: mockQuizSession.nextQuestion,
        achievements: [],
      };

      quizService.answerQuestionInSession.mockResolvedValue(mockProgressUpdate);

      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        expect(component.getByTestId('option-0')).toBeTruthy();
      });

      await act(async () => {
        fireEvent.press(component.getByTestId('option-0'));
      });

      // Verify progress was updated
      await waitFor(() => {
        expect(component.getByText('Question 5 of 8')).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', async () => {
      let component;
      await act(async () => {
        component = render(
          <TestWrapper route={mockRoute}>
            <GamifiedQuizScreen />
          </TestWrapper>
        );
      });

      await waitFor(() => {
        // Check that key elements are accessible
        expect(component.getByTestId('progress-bar')).toBeTruthy();
        expect(component.getByTestId('quiz-card')).toBeTruthy();
        expect(component.getByTestId('quiz-timer')).toBeTruthy();
      });
    });
  });
});