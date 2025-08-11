import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all quiz categories with questions
   */
  async getQuizCategories() {
    try {
      const categories = await this.prisma.quizCategory.findMany({
        where: { is_active: true },
        include: {
          quiz_questions: {
            where: { is_active: true },
            include: {
              quiz_options: {
                orderBy: { order_index: 'asc' },
              },
            },
            orderBy: { order_index: 'asc' },
          },
        },
        orderBy: { order_index: 'asc' },
      });

      return {
        success: true,
        data: categories.map(category => ({
          id: category.id,
          key: category.key,
          name: category.name,
          type: category.key,
          description: category.description,
          order: category.order_index,
          isActive: category.is_active,
          questions: category.quiz_questions.map(question => ({
            id: question.id,
            text: question.question_text,
            type: question.question_type,
            trait: question.trait,
            reverseScored: question.reverse_scored,
            order: question.order_index,
            options: question.quiz_options.map(option => ({
              id: option.id,
              text: option.option_text,
              value: option.score_value,
              order: option.order_index,
            })),
          })),
        })),
      };
    } catch (error) {
      console.error('Error fetching quiz categories:', error);
      throw new BadRequestException('Failed to fetch quiz categories');
    }
  }

  /**
   * Get questions by category key
   */
  async getQuestionsByCategory(categoryKey: string) {
    try {
      const category = await this.prisma.quizCategory.findFirst({
        where: {
          key: categoryKey,
          is_active: true
        },
        include: {
          quiz_questions: {
            where: { is_active: true },
            include: {
              quiz_options: {
                orderBy: { order_index: 'asc' },
              },
            },
            orderBy: { order_index: 'asc' },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Quiz category '${categoryKey}' not found`);
      }

      return {
        success: true,
        data: category.quiz_questions.map(question => ({
          id: question.id,
          text: question.question_text,
          type: question.question_type,
          trait: question.trait,
          reverseScored: question.reverse_scored,
          order: question.order_index,
          options: question.quiz_options.map(option => ({
            id: option.id,
            text: option.option_text,
            value: option.score_value,
            order: option.order_index,
          })),
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching questions by category:', error);
      throw new BadRequestException('Failed to fetch quiz questions');
    }
  }

  /**
   * Get user's quiz progress
   */
  async getUserQuizProgress(userId: string) {
    try {
      // Get all categories
      const categories = await this.prisma.quizCategory.findMany({
        where: { is_active: true },
        include: {
          quiz_questions: {
            where: { is_active: true },
          },
        },
      });

      // Get user's responses
      const userResponses = await this.prisma.userQuizResponse.findMany({
        where: { user_id: userId },
        include: {
          quiz_questions: {
            include: {
              quiz_categories: true,
            },
          },
        },
      });

      // Calculate progress for each category
      const categoryProgress = categories.map(category => {
        const categoryQuestions = category.quiz_questions;
        const categoryResponses = userResponses.filter(
          response => response.quiz_questions.category_id === category.id
        );

        const totalQuestions = categoryQuestions.length;
        const answeredQuestions = categoryResponses.length;
        const progressPercentage = totalQuestions > 0 ? 
          Math.round((answeredQuestions / totalQuestions) * 100) : 0;

        return {
          categoryKey: category.key,
          categoryName: category.name,
          totalQuestions,
          answeredQuestions,
          progressPercentage,
          isComplete: progressPercentage === 100,
        };
      });

      // Calculate overall progress
      const totalQuestions = categories.reduce((sum, cat) => sum + cat.quiz_questions.length, 0);
      const totalAnswered = userResponses.length;
      const overallProgress = totalQuestions > 0 ? 
        Math.round((totalAnswered / totalQuestions) * 100) : 0;

      return {
        success: true,
        data: {
          overallProgress,
          totalQuestions,
          totalAnswered,
          isComplete: overallProgress === 100,
          categories: categoryProgress,
        },
      };
    } catch (error) {
      console.error('Error fetching user quiz progress:', error);
      throw new BadRequestException('Failed to fetch quiz progress');
    }
  }

  /**
   * Save quiz response
   */
  async saveQuizResponse(userId: string, questionId: string, selectedOptionId: string) {
    try {
      // Validate question exists
      const question = await this.prisma.quizQuestion.findUnique({
        where: { id: questionId },
        include: {
          quiz_options: true,
        },
      });

      if (!question) {
        throw new NotFoundException('Quiz question not found');
      }

      // Validate option exists for this question
      const option = question.quiz_options.find(opt => opt.id === selectedOptionId);
      if (!option) {
        throw new BadRequestException('Invalid option for this question');
      }

      // Save or update response
      const response = await this.prisma.userQuizResponse.upsert({
        where: {
          user_id_question_id: {
            user_id: userId,
            question_id: questionId,
          },
        },
        update: {
          selected_option_id: selectedOptionId,
          score: option.score_value,
        },
        create: {
          id: `${userId}_${questionId}_${Date.now()}`,
          user_id: userId,
          question_id: questionId,
          selected_option_id: selectedOptionId,
          score: option.score_value,
        },
      });

      return {
        success: true,
        data: response,
        message: 'Quiz response saved successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error saving quiz response:', error);
      throw new BadRequestException('Failed to save quiz response');
    }
  }

  /**
   * Get user's quiz responses
   */
  async getUserQuizResponses(userId: string) {
    try {
      const responses = await this.prisma.userQuizResponse.findMany({
        where: { user_id: userId },
        include: {
          quiz_questions: {
            include: {
              quiz_categories: true,
              quiz_options: true,
            },
          },
        },
        orderBy: { completed_at: 'desc' },
      });

      return {
        success: true,
        data: responses.map(response => ({
          id: response.id,
          questionId: response.question_id,
          selectedOptionId: response.selected_option_id,
          responseValue: response.score,
          createdAt: response.completed_at,
          question: {
            text: response.quiz_questions.question_text,
            type: response.quiz_questions.question_type,
            trait: response.quiz_questions.trait,
            category: response.quiz_questions.quiz_categories.name,
          },
        })),
      };
    } catch (error) {
      console.error('Error fetching user quiz responses:', error);
      throw new BadRequestException('Failed to fetch quiz responses');
    }
  }

  /**
   * Get personality profile (placeholder)
   */
  async getPersonalityProfile(userId: string) {
    // This would contain complex personality calculation logic
    // For now, return a basic structure
    return {
      success: true,
      data: {
        userId,
        profileGenerated: false,
        message: 'Personality profile calculation not yet implemented',
      },
    };
  }

  /**
   * Calculate personality profile (placeholder)
   */
  async calculatePersonalityProfile(userId: string) {
    // This would contain complex personality calculation logic
    // For now, return a basic structure
    return {
      success: true,
      data: {
        userId,
        profileCalculated: false,
        message: 'Personality profile calculation not yet implemented',
      },
    };
  }
}
