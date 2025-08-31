import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { AppConfigService } from '../config/config.service';
import { PaymentProvider, StubPaymentProvider } from './payment-providers/payment.provider';

@Injectable()
export class DateDeliveryService {
  private paymentProvider: PaymentProvider;

  constructor(private readonly prisma: PrismaService, private readonly config: AppConfigService) {
    // In future, branch on this.config.paymentProvider for Stripe/Paymob
    this.paymentProvider = new StubPaymentProvider();
  }

  async getUserDates(userId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      // For now, return mock data since we don't have the full dating system implemented
      const mockDates = [
        {
          id: '1',
          matchName: 'Sarah Johnson',
          age: 28,
          location: 'New York, NY',
          compatibility: 92,
          profileImage: null,
          status: 'pending',
          deliveredAt: new Date(),
          venue: {
            name: 'Central Park Café',
            address: '123 Park Ave, New York, NY',
            type: 'café'
          },
          personalityMatch: {
            primary: 'Both value deep conversations',
            secondary: 'Shared love for outdoor activities',
            compatibility: 92
          }
        },
        {
          id: '2',
          matchName: 'Emily Chen',
          age: 26,
          location: 'New York, NY',
          compatibility: 88,
          profileImage: null,
          status: 'interested',
          deliveredAt: new Date(Date.now() - 86400000), // 1 day ago
          venue: {
            name: 'Brooklyn Art Gallery',
            address: '456 Art St, Brooklyn, NY',
            type: 'gallery'
          },
          personalityMatch: {
            primary: 'Creative and artistic personalities',
            secondary: 'Both appreciate cultural experiences',
            compatibility: 88
          }
        }
      ];

      return {
        success: true,
        data: {
          dates: mockDates.slice(skip, skip + limit),
          pagination: {
            page,
            limit,
            total: mockDates.length,
            totalPages: Math.ceil(mockDates.length / limit)
          }
        },
        message: 'Dates retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching user dates:', error);
      throw new BadRequestException('Failed to fetch dates');
    }
  }

  async getDateById(userId: string, dateId: string) {
    try {
      // Mock detailed date data
      const mockDate = {
        id: dateId,
        matchName: 'Sarah Johnson',
        age: 28,
        location: 'New York, NY',
        compatibility: 92,
        profileImage: null,
        status: 'pending',
        deliveredAt: new Date(),
        venue: {
          name: 'Central Park Café',
          address: '123 Park Ave, New York, NY',
          type: 'café',
          phone: '+1 (555) 123-4567',
          hours: '8:00 AM - 8:00 PM',
          rating: 4.5
        },
        personalityMatch: {
          primary: 'Both value deep conversations',
          secondary: 'Shared love for outdoor activities',
          compatibility: 92,
          details: [
            'Both scored high on openness to experience',
            'Similar communication styles',
            'Complementary personality traits',
            'Shared values and life goals'
          ]
        },
        suggestedActivities: [
          'Coffee and conversation',
          'Walk in Central Park',
          'Visit nearby bookstore'
        ],
        safetyFeatures: {
          publicVenue: true,
          emergencyContact: true,
          backgroundCheck: true,
          reportingSystem: true
        }
      };

      return {
        success: true,
        data: mockDate,
        message: 'Date details retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching date details:', error);
      throw new NotFoundException('Date not found');
    }
  }

  async expressInterest(userId: string, interestData: any) {
    try {
      const { deliveredDateId, isInterested, response } = interestData;

      // Mock interest expression
      return {
        success: true,
        data: {
          dateId: deliveredDateId,
          userInterest: isInterested,
          response: response,
          status: isInterested ? 'interested' : 'declined',
          nextStep: isInterested ? 'waiting_for_match_response' : 'date_declined'
        },
        message: isInterested ? 'Interest expressed successfully' : 'Date declined'
      };
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw new BadRequestException('Failed to express interest');
    }
  }

  async submitFeedback(userId: string, feedbackData: any) {
    try {
      const { dateId, rating, feedback, wouldMeetAgain } = feedbackData;

      // Mock feedback submission
      return {
        success: true,
        data: {
          dateId,
          rating,
          feedback,
          wouldMeetAgain,
          submittedAt: new Date()
        },
        message: 'Feedback submitted successfully'
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new BadRequestException('Failed to submit feedback');
    }
  }

  async getPotentialMatches(userId: string, limit: number = 5) {
    try {
      // Mock potential matches
      const mockMatches = [
        {
          id: '1',
          name: 'Alex Rivera',
          age: 29,
          location: 'Manhattan, NY',
          compatibility: 94,
          profileImage: null,
          interests: ['Photography', 'Hiking', 'Cooking'],
          personalityHighlights: ['Creative', 'Adventurous', 'Empathetic']
        },
        {
          id: '2',
          name: 'Jordan Kim',
          age: 27,
          location: 'Brooklyn, NY',
          compatibility: 91,
          profileImage: null,
          interests: ['Reading', 'Yoga', 'Travel'],
          personalityHighlights: ['Thoughtful', 'Balanced', 'Curious']
        }
      ];

      return {
        success: true,
        data: {
          matches: mockMatches.slice(0, limit),
          generatedAt: new Date()
        },
        message: 'Potential matches retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching potential matches:', error);
      throw new BadRequestException('Failed to fetch potential matches');
    }
  }

  async generateMatches(userId: string) {
    try {
      // Mock match generation
      return {
        success: true,
        data: {
          status: 'generating',
          estimatedTime: '2-5 minutes',
          message: 'AI is analyzing your profile and preferences to find compatible matches'
        },
        message: 'Match generation initiated successfully'
      };
    } catch (error) {
      console.error('Error generating matches:', error);
      throw new BadRequestException('Failed to generate matches');
    }
  }

  async getDatingStatistics(userId: string) {
    try {
      // Mock dating statistics
      const mockStats = {
        totalDatesDelivered: 12,
        datesAccepted: 8,
        datesCompleted: 5,
        averageCompatibility: 89,
        successRate: 62.5,
        monthlyStats: {
          thisMonth: {
            datesDelivered: 3,
            datesAccepted: 2,
            datesCompleted: 1
          },
          lastMonth: {
            datesDelivered: 4,
            datesAccepted: 3,
            datesCompleted: 2
          }
        },
        personalityInsights: {
          topCompatibilityTraits: ['Openness', 'Agreeableness', 'Conscientiousness'],
          improvementAreas: ['Communication style', 'Shared activities'],
          matchingAccuracy: 91
        }
      };

      return {
        success: true,
        data: mockStats,
        message: 'Dating statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching dating statistics:', error);
      throw new BadRequestException('Failed to fetch dating statistics');
    }
  }

  // Payment methods
  async createPayment(userId: string, dto: { deliveredDateId: string; amount: number; currency?: string }) {
    try {
      const { deliveredDateId, amount, currency = 'USD' } = dto;

      // Idempotent: if a pending/processing payment exists, return it
      const existing = await this.prisma.date_payments.findFirst({
        where: { deliveredDateId, userId, status: { in: ['PENDING', 'PROCESSING'] } },
      });
      if (existing) {
        return {
          success: true,
          data: existing,
          message: 'Payment already initiated',
        };
      }

      // Create provider intent (stubbed)
      const intent = await this.paymentProvider.createPaymentIntent({ amount, currency, metadata: { deliveredDateId, userId } });

      const created = await this.prisma.date_payments.create({
        data: {
          id: randomUUID(),
          deliveredDateId,
          userId,
          amount,
          currency,
          paymentIntentId: intent.providerPaymentId,
          status: 'PENDING',
        },
      });

      return { success: true, data: { ...created, clientSecret: intent.clientSecret }, message: 'Payment initiated successfully' };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new BadRequestException('Failed to create payment');
    }
  }

  async confirmPayment(userId: string, dto: { deliveredDateId: string; paymentIntentId?: string }) {
    try {
      const { deliveredDateId, paymentIntentId } = dto;

      const payment = await this.prisma.date_payments.findUnique({
        where: { deliveredDateId_userId: { deliveredDateId, userId } },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.status === 'COMPLETED') {
        return { success: true, data: payment, message: 'Payment already confirmed' };
      }

      // Confirm with provider (stubbed)
      await this.paymentProvider.confirmPayment({ providerPaymentId: payment.paymentIntentId ?? paymentIntentId });

      const updated = await this.prisma.date_payments.update({
        where: { deliveredDateId_userId: { deliveredDateId, userId } },
        data: {
          status: 'COMPLETED',
          paymentIntentId: paymentIntentId ?? payment.paymentIntentId,
          paidAt: new Date(),
        },
      });

      return { success: true, data: updated, message: 'Payment confirmed successfully' };
    } catch (error) {
      console.error('Error confirming payment:', error);
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to confirm payment');
    }
  }


}
