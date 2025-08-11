import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionnaireService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get questionnaire by relationship phase
   */
  async getQuestionnaireByPhase(phase: string) {
    const validPhases = ['single', 'preparing', 'engaged'];
    if (!validPhases.includes(phase)) {
      throw new BadRequestException('Invalid relationship phase');
    }

    // Mock questionnaire data - in production, this would come from database
    const questionnaires = {
      single: {
        phase: 'single',
        title: 'Singles Journey Assessment',
        description: 'Help us understand your relationship goals and preferences',
        sections: [
          {
            id: 'personal_values',
            title: 'Personal Values',
            description: 'What matters most to you in life?',
            questions: [
              {
                id: 'values_1',
                text: 'What are your top 3 life values?',
                type: 'multiple_choice',
                options: [
                  { id: 'family', text: 'Family' },
                  { id: 'career', text: 'Career Success' },
                  { id: 'adventure', text: 'Adventure' },
                  { id: 'stability', text: 'Financial Stability' },
                  { id: 'creativity', text: 'Creativity' },
                  { id: 'spirituality', text: 'Spirituality' },
                ],
                maxSelections: 3,
              },
              {
                id: 'relationship_goals',
                text: 'What are you looking for in a relationship?',
                type: 'single_choice',
                options: [
                  { id: 'serious', text: 'Serious long-term relationship' },
                  { id: 'marriage', text: 'Marriage within 2-3 years' },
                  { id: 'companionship', text: 'Companionship and fun' },
                  { id: 'exploring', text: 'Still exploring what I want' },
                ],
              },
            ],
          },
          {
            id: 'lifestyle',
            title: 'Lifestyle Preferences',
            description: 'Tell us about your ideal lifestyle',
            questions: [
              {
                id: 'social_style',
                text: 'How would you describe your social style?',
                type: 'single_choice',
                options: [
                  { id: 'extrovert', text: 'Very social and outgoing' },
                  { id: 'ambivert', text: 'Balanced - social but also enjoy alone time' },
                  { id: 'introvert', text: 'Prefer smaller groups and quiet activities' },
                ],
              },
              {
                id: 'weekend_activities',
                text: 'How do you prefer to spend weekends?',
                type: 'multiple_choice',
                options: [
                  { id: 'outdoors', text: 'Outdoor activities' },
                  { id: 'cultural', text: 'Museums, galleries, cultural events' },
                  { id: 'home', text: 'Relaxing at home' },
                  { id: 'social', text: 'Socializing with friends' },
                  { id: 'fitness', text: 'Exercise and fitness' },
                  { id: 'hobbies', text: 'Personal hobbies and interests' },
                ],
                maxSelections: 3,
              },
            ],
          },
        ],
      },
      preparing: {
        phase: 'preparing',
        title: 'Preparing for Engagement',
        description: 'Questions to help you prepare for the next step in your relationship',
        sections: [
          {
            id: 'relationship_readiness',
            title: 'Relationship Readiness',
            description: 'Assess your readiness for engagement',
            questions: [
              {
                id: 'commitment_level',
                text: 'How ready do you feel for engagement?',
                type: 'scale',
                scale: { min: 1, max: 10, labels: ['Not ready', 'Very ready'] },
              },
              {
                id: 'future_planning',
                text: 'Have you discussed future plans with your partner?',
                type: 'single_choice',
                options: [
                  { id: 'extensively', text: 'Yes, extensively' },
                  { id: 'somewhat', text: 'Somewhat' },
                  { id: 'briefly', text: 'Only briefly' },
                  { id: 'not_yet', text: 'Not yet' },
                ],
              },
            ],
          },
        ],
      },
      engaged: {
        phase: 'engaged',
        title: 'Pre-Marriage Preparation',
        description: 'Prepare for your upcoming marriage',
        sections: [
          {
            id: 'marriage_preparation',
            title: 'Marriage Preparation',
            description: 'Important topics to discuss before marriage',
            questions: [
              {
                id: 'financial_planning',
                text: 'Have you discussed financial planning and budgeting?',
                type: 'single_choice',
                options: [
                  { id: 'detailed', text: 'Yes, in detail' },
                  { id: 'basic', text: 'Basic discussion' },
                  { id: 'planned', text: 'Planning to discuss' },
                  { id: 'not_yet', text: 'Not yet' },
                ],
              },
              {
                id: 'family_planning',
                text: 'Have you discussed family planning and children?',
                type: 'single_choice',
                options: [
                  { id: 'aligned', text: 'Yes, we\'re aligned' },
                  { id: 'discussing', text: 'Still discussing' },
                  { id: 'different_views', text: 'We have different views' },
                  { id: 'not_discussed', text: 'Haven\'t discussed yet' },
                ],
              },
            ],
          },
        ],
      },
    };

    return {
      success: true,
      data: questionnaires[phase] || questionnaires.single,
    };
  }

  /**
   * Get user's questionnaire answers
   */
  async getUserAnswers(userId: string, phase: string) {
    try {
      // In production, you would query a UserQuestionnaireAnswers table
      // For now, returning empty answers
      return {
        success: true,
        data: {
          userId,
          phase,
          answers: {},
          completedAt: null,
        },
      };
    } catch (error) {
      console.error('Failed to get user answers:', error);
      throw new BadRequestException('Failed to retrieve questionnaire answers');
    }
  }

  /**
   * Save user's questionnaire answers
   */
  async saveUserAnswers(userId: string, phase: string, answers: Record<string, any>) {
    try {
      const validPhases = ['single', 'preparing', 'engaged'];
      if (!validPhases.includes(phase)) {
        throw new BadRequestException('Invalid relationship phase');
      }

      // Validate user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // In production, you would save to a UserQuestionnaireAnswers table
      // For now, just return success
      return {
        success: true,
        data: {
          userId,
          phase,
          answers,
          savedAt: new Date().toISOString(),
        },
        message: 'Questionnaire answers saved successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Failed to save user answers:', error);
      throw new BadRequestException('Failed to save questionnaire answers');
    }
  }
}
