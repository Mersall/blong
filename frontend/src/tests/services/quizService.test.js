/**
 * QuizService Tests
 * Tests for quiz-related API service functionality
 */

import quizService from '../../services/quizService';
import { apiClient } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('QuizService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQuizCategories', () => {
    it('should fetch quiz categories successfully', async () => {
      const mockCategories = [
        {
          id: 'cat1',
          name: 'Personality Assessment',
          type: 'PERSONALITY',
          description: 'Assess your Big Five personality traits',
          questions: [
            { id: 'q1', text: 'Question 1', options: [] },
            { id: 'q2', text: 'Question 2', options: [] },
          ],
        },
        {
          id: 'cat2',
          name: 'Love Languages',
          type: 'LOVE_LANGUAGE',
          description: 'Discover your primary love language',
          questions: [
            { id: 'q3', text: 'Question 3', options: [] },
          ],
        },
      ];

      apiRequest.mockResolvedValue(mockCategories);

      const result = await quizService.getQuizCategories();

      expect(apiRequest).toHaveBeenCalledWith('/quiz/categories', {
        method: 'GET',
      });
      expect(result).toEqual(mockCategories);
    });

    it('should handle API errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Network error');
      apiRequest.mockRejectedValue(error);

      await expect(quizService.getQuizCategories()).rejects.toThrow('Network error');
      expect(consoleError).toHaveBeenCalledWith('❌ Error fetching quiz categories:', error);
      
      consoleError.mockRestore();
    });
  });

  describe('getQuizQuestionsByCategory', () => {
    it('should fetch questions by category successfully', async () => {
      const mockQuestions = {
        categoryId: 'cat1',
        categoryName: 'Personality Assessment',
        questions: [
          {
            id: 'q1',
            text: 'How do you prefer to spend your free time?',
            type: 'MULTIPLE_CHOICE',
            options: [
              { id: 'opt1', text: 'Reading a book', score: { openness: 1 } },
              { id: 'opt2', text: 'Socializing with friends', score: { extraversion: 1 } },
            ],
          },
        ],
      };

      apiRequest.mockResolvedValue(mockQuestions);

      const result = await quizService.getQuizQuestionsByCategory('personality');

      expect(apiRequest).toHaveBeenCalledWith('/quiz/category/personality', {
        method: 'GET',
      });
      expect(result).toEqual(mockQuestions);
    });

    it('should handle category not found errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Category not found');
      apiRequest.mockRejectedValue(error);

      await expect(quizService.getQuizQuestionsByCategory('invalid')).rejects.toThrow('Category not found');
      expect(consoleError).toHaveBeenCalledWith('❌ Error fetching quiz questions for invalid:', error);
      
      consoleError.mockRestore();
    });
  });

  describe('saveQuizResponse', () => {
    it('should save quiz response successfully', async () => {
      const mockResponse = {
        id: 'resp1',
        questionId: 'q1',
        selectedOptionId: 'opt1',
        userId: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      apiRequest.mockResolvedValue(mockResponse);

      const result = await quizService.saveQuizResponse('q1', 'opt1');

      expect(apiRequest).toHaveBeenCalledWith('/quiz/response', {
        method: 'POST',
        body: JSON.stringify({
          questionId: 'q1',
          selectedOptionId: 'opt1',
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle save errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Save failed');
      apiRequest.mockRejectedValue(error);

      await expect(quizService.saveQuizResponse('q1', 'opt1')).rejects.toThrow('Save failed');
      expect(consoleError).toHaveBeenCalledWith('❌ Error saving quiz response:', error);
      
      consoleError.mockRestore();
    });
  });

  describe('getUserQuizResponses', () => {
    it('should fetch user responses successfully', async () => {
      const mockResponses = [
        {
          id: 'resp1',
          questionId: 'q1',
          selectedOptionId: 'opt1',
          question: {
            id: 'q1',
            text: 'Question 1',
            category: { id: 'cat1', name: 'Personality' },
          },
          selectedOption: {
            id: 'opt1',
            text: 'Option 1',
          },
        },
      ];

      apiRequest.mockResolvedValue(mockResponses);

      const result = await quizService.getUserQuizResponses();

      expect(apiRequest).toHaveBeenCalledWith('/quiz/responses', {
        method: 'GET',
      });
      expect(result).toEqual(mockResponses);
    });
  });

  describe('calculatePersonalityProfile', () => {
    it('should calculate personality profile successfully', async () => {
      const mockProfile = {
        userId: 'user1',
        opennessScore: 75,
        conscientiousnessScore: 80,
        extraversionScore: 60,
        agreeablenessScore: 85,
        neuroticismScore: 40,
        primaryLoveLanguage: 'WORDS_OF_AFFIRMATION',
        attachmentStyle: 'SECURE',
        personalityTraits: ['creative', 'organized', 'empathetic'],
        calculatedAt: '2024-01-01T00:00:00Z',
      };

      apiRequest.mockResolvedValue(mockProfile);

      const result = await quizService.calculatePersonalityProfile();

      expect(apiRequest).toHaveBeenCalledWith('/quiz/calculate-profile', {
        method: 'POST',
      });
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getUserPersonalityProfile', () => {
    it('should fetch user personality profile successfully', async () => {
      const mockProfile = {
        userId: 'user1',
        opennessScore: 75,
        conscientiousnessScore: 80,
        extraversionScore: 60,
        agreeablenessScore: 85,
        neuroticismScore: 40,
        primaryLoveLanguage: 'WORDS_OF_AFFIRMATION',
        attachmentStyle: 'SECURE',
      };

      apiRequest.mockResolvedValue(mockProfile);

      const result = await quizService.getUserPersonalityProfile();

      expect(apiRequest).toHaveBeenCalledWith('/quiz/personality-profile', {
        method: 'GET',
      });
      expect(result).toEqual(mockProfile);
    });

    it('should handle profile not found', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Profile not found');
      apiRequest.mockRejectedValue(error);

      await expect(quizService.getUserPersonalityProfile()).rejects.toThrow('Profile not found');
      expect(consoleError).toHaveBeenCalledWith('❌ Error fetching personality profile:', error);
      
      consoleError.mockRestore();
    });
  });

  describe('getQuizProgress', () => {
    it('should fetch quiz progress successfully', async () => {
      const mockProgress = {
        categories: [
          {
            categoryKey: 'personality',
            categoryName: 'Personality Assessment',
            totalQuestions: 10,
            answeredQuestions: 7,
            progressPercentage: 70,
            isComplete: false,
          },
          {
            categoryKey: 'love_language',
            categoryName: 'Love Languages',
            totalQuestions: 5,
            answeredQuestions: 5,
            progressPercentage: 100,
            isComplete: true,
          },
        ],
        overallProgress: 85,
        isComplete: false,
      };

      apiRequest.mockResolvedValue(mockProgress);

      const result = await quizService.getQuizProgress();

      expect(apiRequest).toHaveBeenCalledWith('/quiz/progress', {
        method: 'GET',
      });
      expect(result).toEqual(mockProgress);
    });
  });

  describe('getPersonalityInsights', () => {
    const mockPersonalityProfile = {
      opennessScore: 75,
      conscientiousnessScore: 40,
      extraversionScore: 80,
      agreeablenessScore: 60,
      neuroticismScore: 25,
      primaryLoveLanguage: 'WORDS_OF_AFFIRMATION',
      attachmentStyle: 'SECURE',
    };

    it('should generate insights for high openness', () => {
      const insights = quizService.getPersonalityInsights(mockPersonalityProfile);

      expect(insights.openness).toEqual({
        level: 'High',
        description: 'You love exploring new ideas, experiences, and creative pursuits.',
        traits: ['Creative', 'Curious', 'Adventurous', 'Open-minded'],
        compatibility: 'You connect well with partners who appreciate intellectual discussions and new experiences.',
      });
    });

    it('should generate insights for low conscientiousness', () => {
      const insights = quizService.getPersonalityInsights(mockPersonalityProfile);

      expect(insights.conscientiousness).toEqual({
        level: 'Moderate',
        description: 'You balance organization with flexibility and spontaneity.',
        traits: ['Flexible', 'Adaptable', 'Balanced', 'Practical'],
        compatibility: 'You can adapt to both structured and spontaneous partners.',
      });
    });

    it('should generate insights for high extraversion', () => {
      const insights = quizService.getPersonalityInsights(mockPersonalityProfile);

      expect(insights.extraversion).toEqual({
        level: 'High',
        description: 'You are energetic, outgoing, and thrive in social situations.',
        traits: ['Outgoing', 'Energetic', 'Social', 'Enthusiastic'],
        compatibility: 'You enjoy partners who can match your social energy or provide grounding.',
      });
    });

    it('should generate insights for moderate agreeableness', () => {
      const insights = quizService.getPersonalityInsights(mockPersonalityProfile);

      expect(insights.agreeableness).toEqual({
        level: 'Moderate',
        description: 'You balance compassion with healthy assertiveness.',
        traits: ['Balanced', 'Fair', 'Honest', 'Direct'],
        compatibility: 'You can work with both gentle and assertive partners.',
      });
    });

    it('should generate insights for low neuroticism', () => {
      const insights = quizService.getPersonalityInsights(mockPersonalityProfile);

      expect(insights.neuroticism).toEqual({
        level: 'Low',
        description: 'You are emotionally stable and handle stress well.',
        traits: ['Calm', 'Stable', 'Resilient', 'Confident'],
        compatibility: 'You can provide emotional stability for more sensitive partners.',
      });
    });

    it('should generate love language insights', () => {
      const insights = quizService.getPersonalityInsights(mockPersonalityProfile);

      expect(insights.loveLanguage).toEqual({
        name: 'Words of Affirmation',
        description: 'You feel most loved through verbal appreciation and encouragement.',
        tips: 'Express your feelings verbally and appreciate when your partner does the same.',
      });
    });

    it('should generate attachment style insights', () => {
      const insights = quizService.getPersonalityInsights(mockPersonalityProfile);

      expect(insights.attachmentStyle).toEqual({
        name: 'Secure Attachment',
        description: 'You are comfortable with intimacy and independence in relationships.',
        strengths: ['Trusting', 'Communicative', 'Emotionally available', 'Supportive'],
        tips: 'You create healthy, balanced relationships and can help partners feel secure.',
      });
    });

    it('should handle missing personality scores', () => {
      const incompleteProfile = {
        opennessScore: null,
        conscientiousnessScore: 50,
        extraversionScore: null,
      };

      const insights = quizService.getPersonalityInsights(incompleteProfile);

      expect(insights.openness).toBeUndefined();
      expect(insights.extraversion).toBeUndefined();
      expect(insights.conscientiousness).toBeDefined();
    });

    it('should handle different love languages correctly', () => {
      const profiles = [
        { primaryLoveLanguage: 'service' },
        { primaryLoveLanguage: 'gifts' },
        { primaryLoveLanguage: 'time' },
        { primaryLoveLanguage: 'touch' },
      ];

      profiles.forEach(profile => {
        const insights = quizService.getPersonalityInsights(profile);
        expect(insights.loveLanguage).toBeDefined();
        expect(insights.loveLanguage.name).toBeTruthy();
        expect(insights.loveLanguage.description).toBeTruthy();
        expect(insights.loveLanguage.tips).toBeTruthy();
      });
    });

    it('should handle different attachment styles correctly', () => {
      const profiles = [
        { attachmentStyle: 'anxious' },
        { attachmentStyle: 'avoidant' },
        { attachmentStyle: 'secure' },
      ];

      profiles.forEach(profile => {
        const insights = quizService.getPersonalityInsights(profile);
        expect(insights.attachmentStyle).toBeDefined();
        expect(insights.attachmentStyle.name).toBeTruthy();
        expect(insights.attachmentStyle.description).toBeTruthy();
        expect(insights.attachmentStyle.strengths).toBeTruthy();
        expect(insights.attachmentStyle.tips).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle extreme personality scores', () => {
      const extremeProfile = {
        opennessScore: 0,
        conscientiousnessScore: 100,
        extraversionScore: 15,
        agreeablenessScore: 95,
        neuroticismScore: 85,
      };

      const insights = quizService.getPersonalityInsights(extremeProfile);

      expect(insights.openness.level).toBe('Low');
      expect(insights.conscientiousness.level).toBe('High');
      expect(insights.extraversion.level).toBe('Low');
      expect(insights.agreeableness.level).toBe('High');
      expect(insights.neuroticism.level).toBe('High');
    });

    it('should handle undefined love language and attachment style', () => {
      const profileWithoutExtras = {
        opennessScore: 50,
        primaryLoveLanguage: 'unknown',
        attachmentStyle: 'unknown',
      };

      const insights = quizService.getPersonalityInsights(profileWithoutExtras);

      expect(insights.loveLanguage).toBeNull();
      expect(insights.attachmentStyle).toBeNull();
    });
  });
});