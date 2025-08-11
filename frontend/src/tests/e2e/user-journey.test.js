/**
 * End-to-End User Journey Tests
 * Complete user flow from registration through personality assessment to matching
 */

import { apiRequest } from '../../services/api';
import quizService from '../../services/quizService';

// Mock API for E2E simulation
jest.mock('../../services/api');

describe('End-to-End User Journey', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockCategories = [
    {
      id: 'cat1',
      name: 'Personality Assessment',
      type: 'PERSONALITY',
      questions: [
        {
          id: 'q1',
          text: 'How do you prefer to spend your free time?',
          type: 'MULTIPLE_CHOICE',
          options: [
            { id: 'opt1', text: 'Reading a book', score: { openness: 1 } },
            { id: 'opt2', text: 'Socializing with friends', score: { extraversion: 1 } },
            { id: 'opt3', text: 'Exercising outdoors', score: { conscientiousness: 1 } },
            { id: 'opt4', text: 'Helping others', score: { agreeableness: 1 } },
          ],
        },
        {
          id: 'q2',
          text: 'When facing a stressful situation, you typically:',
          type: 'MULTIPLE_CHOICE',
          options: [
            { id: 'opt5', text: 'Stay calm and think logically', score: { neuroticism: -1 } },
            { id: 'opt6', text: 'Seek support from friends', score: { extraversion: 1 } },
            { id: 'opt7', text: 'Take time alone to process', score: { neuroticism: 1 } },
            { id: 'opt8', text: 'Make a detailed plan', score: { conscientiousness: 1 } },
          ],
        },
      ],
    },
  ];

  const mockPersonalityProfile = {
    userId: 'user-123',
    opennessScore: 75,
    conscientiousnessScore: 80,
    extraversionScore: 60,
    agreeablenessScore: 85,
    neuroticismScore: 40,
    primaryLoveLanguage: 'WORDS_OF_AFFIRMATION',
    attachmentStyle: 'SECURE',
    calculatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Journey: Registration → Quiz → Profile → Recommendations', () => {
    it('should complete full personality assessment journey', async () => {
      // Step 1: User discovers quiz categories
      apiRequest.mockResolvedValueOnce(mockCategories);
      const categories = await quizService.getQuizCategories();
      
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Personality Assessment');
      expect(categories[0].questions).toHaveLength(2);

      // Step 2: User starts quiz for personality category
      const personalityCategory = categories.find(cat => cat.type === 'PERSONALITY');
      apiRequest.mockResolvedValueOnce(personalityCategory);
      
      const quizQuestions = await quizService.getQuizQuestionsByCategory('PERSONALITY');
      expect(quizQuestions.questions).toHaveLength(2);

      // Step 3: User answers first question
      const firstQuestion = quizQuestions.questions[0];
      const firstAnswer = firstQuestion.options[0]; // "Reading a book" - openness
      
      apiRequest.mockResolvedValueOnce({
        id: 'response-1',
        questionId: firstQuestion.id,
        selectedOptionId: firstAnswer.id,
        userId: mockUser.id,
      });

      const response1 = await quizService.saveQuizResponse(firstQuestion.id, firstAnswer.id);
      expect(response1.questionId).toBe(firstQuestion.id);
      expect(response1.selectedOptionId).toBe(firstAnswer.id);

      // Step 4: User answers second question
      const secondQuestion = quizQuestions.questions[1];
      const secondAnswer = secondQuestion.options[0]; // "Stay calm" - low neuroticism
      
      apiRequest.mockResolvedValueOnce({
        id: 'response-2',
        questionId: secondQuestion.id,
        selectedOptionId: secondAnswer.id,
        userId: mockUser.id,
      });

      const response2 = await quizService.saveQuizResponse(secondQuestion.id, secondAnswer.id);
      expect(response2.questionId).toBe(secondQuestion.id);

      // Step 5: User checks quiz progress
      apiRequest.mockResolvedValueOnce({
        categories: [
          {
            categoryKey: 'personality',
            categoryName: 'Personality Assessment',
            totalQuestions: 2,
            answeredQuestions: 2,
            progressPercentage: 100,
            isComplete: true,
          },
        ],
        overallProgress: 100,
        isComplete: true,
      });

      const progress = await quizService.getQuizProgress();
      expect(progress.isComplete).toBe(true);
      expect(progress.overallProgress).toBe(100);

      // Step 6: System calculates personality profile
      apiRequest.mockResolvedValueOnce(mockPersonalityProfile);
      
      const calculatedProfile = await quizService.calculatePersonalityProfile();
      expect(calculatedProfile.opennessScore).toBe(75);
      expect(calculatedProfile.conscientiousnessScore).toBe(80);
      expect(calculatedProfile.primaryLoveLanguage).toBe('WORDS_OF_AFFIRMATION');

      // Step 7: User retrieves their personality profile
      apiRequest.mockResolvedValueOnce(mockPersonalityProfile);
      
      const userProfile = await quizService.getUserPersonalityProfile();
      expect(userProfile.userId).toBe(mockUser.id);
      expect(userProfile.attachmentStyle).toBe('SECURE');

      // Step 8: Generate personality insights
      const insights = quizService.getPersonalityInsights(userProfile);
      
      expect(insights.openness.level).toBe('High');
      expect(insights.conscientiousness.level).toBe('High');
      expect(insights.extraversion.level).toBe('Moderate');
      expect(insights.agreeableness.level).toBe('High');
      expect(insights.neuroticism.level).toBe('Moderate');

      expect(insights.loveLanguage.name).toBe('Words of Affirmation');
      expect(insights.attachmentStyle.name).toBe('Secure Attachment');

      // Verify insights contain actionable advice
      expect(insights.openness.traits).toContain('Creative');
      expect(insights.conscientiousness.traits).toContain('Organized');
      expect(insights.agreeableness.compatibility).toContain('kindness');
    });

    it('should handle incomplete quiz gracefully', async () => {
      // User starts quiz but doesn't complete it
      apiRequest.mockResolvedValueOnce(mockCategories);
      const categories = await quizService.getQuizCategories();

      // Answer only first question
      const firstQuestion = categories[0].questions[0];
      apiRequest.mockResolvedValueOnce({
        id: 'response-1',
        questionId: firstQuestion.id,
        selectedOptionId: firstQuestion.options[0].id,
        userId: mockUser.id,
      });

      await quizService.saveQuizResponse(firstQuestion.id, firstQuestion.options[0].id);

      // Check progress - should be incomplete
      apiRequest.mockResolvedValueOnce({
        categories: [
          {
            categoryKey: 'personality',
            categoryName: 'Personality Assessment',
            totalQuestions: 2,
            answeredQuestions: 1,
            progressPercentage: 50,
            isComplete: false,
          },
        ],
        overallProgress: 50,
        isComplete: false,
      });

      const progress = await quizService.getQuizProgress();
      expect(progress.isComplete).toBe(false);
      expect(progress.overallProgress).toBe(50);

      // Try to calculate profile with insufficient data
      apiRequest.mockRejectedValueOnce(new Error('Insufficient quiz data'));
      
      await expect(quizService.calculatePersonalityProfile()).rejects.toThrow('Insufficient quiz data');
    });
  });

  describe('User Experience Flow Validation', () => {
    it('should provide consistent user experience throughout journey', async () => {
      // Test data persistence across sessions
      const mockResponses = [
        {
          id: 'resp-1',
          questionId: 'q1',
          selectedOptionId: 'opt1',
          question: {
            id: 'q1',
            text: 'Question 1',
            category: { id: 'cat1', name: 'Personality' },
          },
          selectedOption: { id: 'opt1', text: 'Option 1' },
        },
      ];

      apiRequest.mockResolvedValueOnce(mockResponses);
      const userResponses = await quizService.getUserQuizResponses();
      
      expect(userResponses).toHaveLength(1);
      expect(userResponses[0]).toHaveProperty('question');
      expect(userResponses[0]).toHaveProperty('selectedOption');

      // Verify data integrity
      expect(userResponses[0].question.id).toBe(userResponses[0].questionId);
      expect(userResponses[0].selectedOption.id).toBe(userResponses[0].selectedOptionId);
    });

    it('should handle network errors gracefully', async () => {
      // Simulate network failure during quiz
      apiRequest.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(quizService.getQuizCategories()).rejects.toThrow('Network error');

      // Simulate recovery
      apiRequest.mockResolvedValueOnce(mockCategories);
      const categories = await quizService.getQuizCategories();
      expect(categories).toHaveLength(1);
    });

    it('should validate quiz completion requirements', async () => {
      // Test minimum questions required for profile calculation
      const insufficientProfile = {
        opennessScore: null,
        conscientiousnessScore: 50,
        extraversionScore: null,
        agreeablenessScore: null,
        neuroticismScore: null,
      };

      const insights = quizService.getPersonalityInsights(insufficientProfile);
      
      // Should only have insights for traits with scores
      expect(insights.openness).toBeUndefined();
      expect(insights.conscientiousness).toBeDefined();
      expect(insights.extraversion).toBeUndefined();
    });
  });

  describe('Personality Assessment Quality', () => {
    it('should generate meaningful personality insights', async () => {
      const testProfiles = [
        {
          // Introverted, creative, empathetic user
          opennessScore: 90,
          conscientiousnessScore: 40,
          extraversionScore: 20,
          agreeablenessScore: 95,
          neuroticismScore: 60,
          primaryLoveLanguage: 'QUALITY_TIME',
          attachmentStyle: 'ANXIOUS',
        },
        {
          // Extroverted, organized, competitive user
          opennessScore: 30,
          conscientiousnessScore: 95,
          extraversionScore: 85,
          agreeablenessScore: 30,
          neuroticismScore: 25,
          primaryLoveLanguage: 'ACTS_OF_SERVICE',
          attachmentStyle: 'SECURE',
        },
      ];

      testProfiles.forEach((profile, index) => {
        const insights = quizService.getPersonalityInsights(profile);
        
        // Verify insights match personality profile
        if (profile.opennessScore > 70) {
          expect(insights.openness.level).toBe('High');
          expect(insights.openness.traits).toContain('Creative');
        }
        
        if (profile.extraversionScore < 30) {
          expect(insights.extraversion.level).toBe('Low');
          expect(insights.extraversion.traits).toContain('Introspective');
        }
        
        if (profile.agreeablenessScore > 90) {
          expect(insights.agreeableness.level).toBe('High');
          expect(insights.agreeableness.traits).toContain('Compassionate');
        }
        
        // Verify love language insights
        expect(insights.loveLanguage).toBeDefined();
        expect(insights.loveLanguage.description).toBeTruthy();
        expect(insights.loveLanguage.tips).toBeTruthy();
        
        // Verify attachment style insights
        expect(insights.attachmentStyle).toBeDefined();
        expect(insights.attachmentStyle.strengths).toBeTruthy();
        expect(insights.attachmentStyle.tips).toBeTruthy();
      });
    });

    it('should provide balanced assessment across personality dimensions', async () => {
      const balancedProfile = {
        opennessScore: 50,
        conscientiousnessScore: 50,
        extraversionScore: 50,
        agreeablenessScore: 50,
        neuroticismScore: 50,
      };

      const insights = quizService.getPersonalityInsights(balancedProfile);
      
      // All traits should be rated as 'Moderate'
      expect(insights.openness.level).toBe('Moderate');
      expect(insights.conscientiousness.level).toBe('Moderate');
      expect(insights.extraversion.level).toBe('Moderate');
      expect(insights.agreeableness.level).toBe('Moderate');
      expect(insights.neuroticism.level).toBe('Moderate');
      
      // Moderate profiles should emphasize balance and adaptability
      Object.values(insights).forEach(insight => {
        if (insight.traits) {
          expect(insight.traits).toContain('Balanced');
        }
      });
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('should handle malformed API responses', async () => {
      // Test with malformed category response
      apiRequest.mockResolvedValueOnce({ invalid: 'data' });
      
      await expect(quizService.getQuizCategories()).rejects.toThrow();
    });

    it('should handle extremely high and low personality scores', async () => {
      const extremeProfile = {
        opennessScore: 0,
        conscientiousnessScore: 100,
        extraversionScore: 1,
        agreeablenessScore: 99,
        neuroticismScore: 100,
      };

      const insights = quizService.getPersonalityInsights(extremeProfile);
      
      expect(insights.openness.level).toBe('Low');
      expect(insights.conscientiousness.level).toBe('High');
      expect(insights.extraversion.level).toBe('Low');
      expect(insights.agreeableness.level).toBe('High');
      expect(insights.neuroticism.level).toBe('High');
      
      // Extreme scores should still provide meaningful insights
      Object.values(insights).forEach(insight => {
        expect(insight.description).toBeTruthy();
        expect(insight.traits).toBeTruthy();
        expect(insight.compatibility).toBeTruthy();
      });
    });

    it('should maintain data consistency across multiple API calls', async () => {
      // Simulate user completing quiz across multiple sessions
      const sessionData = {
        responses: [],
        progress: 0,
      };

      // First session - answer first question
      apiRequest.mockResolvedValueOnce({
        id: 'resp-1',
        questionId: 'q1',
        selectedOptionId: 'opt1',
      });

      const response1 = await quizService.saveQuizResponse('q1', 'opt1');
      sessionData.responses.push(response1);

      // Check progress
      apiRequest.mockResolvedValueOnce({
        categories: [{ progressPercentage: 50, answeredQuestions: 1 }],
        overallProgress: 50,
      });

      const progress1 = await quizService.getQuizProgress();
      expect(progress1.overallProgress).toBe(50);

      // Second session - answer second question
      apiRequest.mockResolvedValueOnce({
        id: 'resp-2',
        questionId: 'q2',
        selectedOptionId: 'opt2',
      });

      const response2 = await quizService.saveQuizResponse('q2', 'opt2');
      sessionData.responses.push(response2);

      // Verify both responses are maintained
      expect(sessionData.responses).toHaveLength(2);
      expect(sessionData.responses[0].questionId).toBe('q1');
      expect(sessionData.responses[1].questionId).toBe('q2');
    });
  });
});