import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface NotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  actionUrl?: string;
  imageUrl?: string;
  scheduledFor?: Date;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    dates: boolean;
    matches: boolean;
    messages: boolean;
    profile: boolean;
    safety: boolean;
    marketing: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send notification to user
   */
  async sendNotification(data: NotificationData) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
        select: { id: true, firstName: true, email: true }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get user notification preferences
      const preferences = await this.getUserPreferences(data.userId);

      // Check if user wants this type of notification
      if (!this.shouldSendNotification(data, preferences)) {
        return {
          success: true,
          message: 'Notification skipped due to user preferences',
          sent: false
        };
      }

      // Create notification record
      const notification = await this.createNotificationRecord(data);

      // Send push notification if enabled
      if (preferences.pushNotifications) {
        await this.sendPushNotification(data, user);
      }

      // Send email notification if enabled
      if (preferences.emailNotifications && this.shouldSendEmail(data)) {
        await this.sendEmailNotification(data, user);
      }

      // Send SMS notification if enabled and urgent
      if (preferences.smsNotifications && data.priority === 'urgent') {
        await this.sendSMSNotification(data, user);
      }

      return {
        success: true,
        data: notification,
        message: 'Notification sent successfully',
        sent: true
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new BadRequestException('Failed to send notification');
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      // Mock notifications for now
      const mockNotifications = [
        {
          id: '1',
          type: 'DATE_AVAILABLE',
          title: 'New Date Available! 💕',
          message: 'We found someone special for you. Check out your new date opportunity!',
          data: {
            type: 'date_confirmation',
            matchName: 'Sarah',
            venue: 'Central Park Café',
            date: new Date(Date.now() + 86400000) // Tomorrow
          },
          priority: 'high',
          category: 'dates',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          actionUrl: '/dates/new',
          imageUrl: null
        },
        {
          id: '2',
          type: 'PROFILE_VIEW',
          title: 'Profile View',
          message: 'Someone viewed your profile! They might be interested.',
          data: {
            viewerName: 'Anonymous',
            compatibility: 89
          },
          priority: 'normal',
          category: 'profile',
          isRead: false,
          createdAt: new Date(Date.now() - 7200000), // 2 hours ago
          actionUrl: '/profile/views',
          imageUrl: null
        },
        {
          id: '3',
          type: 'SAFETY_REMINDER',
          title: 'Safety Check-in',
          message: 'Remember to check in during your date tonight. Stay safe!',
          data: {
            type: 'pre_date_reminder',
            dateTime: new Date(Date.now() + 14400000) // 4 hours from now
          },
          priority: 'high',
          category: 'safety',
          isRead: true,
          createdAt: new Date(Date.now() - 10800000), // 3 hours ago
          actionUrl: '/safety/checkin',
          imageUrl: null
        },
        {
          id: '4',
          type: 'MATCH_UPDATE',
          title: 'New Match! ✨',
          message: 'You have a new highly compatible match. Check them out!',
          data: {
            matchName: 'Alex',
            compatibility: 94,
            sharedInterests: ['Photography', 'Hiking']
          },
          priority: 'high',
          category: 'matches',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          actionUrl: '/matches/new',
          imageUrl: null
        }
      ];

      const notifications = mockNotifications.slice(skip, skip + limit);
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;

      return {
        success: true,
        data: {
          notifications,
          pagination: {
            page,
            limit,
            total: mockNotifications.length,
            totalPages: Math.ceil(mockNotifications.length / limit),
            hasMore: skip + limit < mockNotifications.length
          },
          unreadCount
        },
        message: 'Notifications retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new BadRequestException('Failed to fetch notifications');
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    try {
      // Mock implementation
      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new BadRequestException('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    try {
      // Mock implementation
      return {
        success: true,
        message: 'All notifications marked as read'
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new BadRequestException('Failed to mark all notifications as read');
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      // Mock preferences for now
      return {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        categories: {
          dates: true,
          matches: true,
          messages: true,
          profile: true,
          safety: true,
          marketing: false
        },
        quietHours: {
          enabled: true,
          startTime: '22:00',
          endTime: '08:00'
        },
        frequency: 'immediate'
      };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>) {
    try {
      // Mock implementation
      return {
        success: true,
        data: { ...await this.getUserPreferences(userId), ...preferences },
        message: 'Notification preferences updated successfully'
      };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw new BadRequestException('Failed to update notification preferences');
    }
  }

  /**
   * Get notification analytics
   */
  async getNotificationAnalytics(userId: string) {
    try {
      // Mock analytics
      const analytics = {
        totalSent: 45,
        totalRead: 32,
        readRate: 71,
        averageReadTime: '2.5 minutes',
        topCategories: [
          { category: 'dates', count: 15, readRate: 85 },
          { category: 'matches', count: 12, readRate: 78 },
          { category: 'profile', count: 10, readRate: 65 },
          { category: 'safety', count: 8, readRate: 95 }
        ],
        weeklyTrend: [
          { day: 'Mon', sent: 8, read: 6 },
          { day: 'Tue', sent: 6, read: 5 },
          { day: 'Wed', sent: 7, read: 5 },
          { day: 'Thu', sent: 9, read: 7 },
          { day: 'Fri', sent: 8, read: 6 },
          { day: 'Sat', sent: 4, read: 2 },
          { day: 'Sun', sent: 3, read: 1 }
        ]
      };

      return {
        success: true,
        data: analytics,
        message: 'Notification analytics retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching notification analytics:', error);
      throw new BadRequestException('Failed to fetch notification analytics');
    }
  }

  // Private helper methods
  private shouldSendNotification(data: NotificationData, preferences: NotificationPreferences): boolean {
    // Check category preferences
    if (data.category && !preferences.categories[data.category]) {
      return false;
    }

    // Check quiet hours
    if (preferences.quietHours.enabled && this.isQuietHours(preferences.quietHours)) {
      return data.priority === 'urgent';
    }

    return true;
  }

  private shouldSendEmail(data: NotificationData): boolean {
    return ['high', 'urgent'].includes(data.priority || 'normal') ||
           ['DATE_AVAILABLE', 'SAFETY_ALERT'].includes(data.type);
  }

  private isQuietHours(quietHours: { startTime: string; endTime: string }): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = this.parseTime(quietHours.startTime);
    const endTime = this.parseTime(quietHours.endTime);

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 100 + minutes;
  }

  private async createNotificationRecord(data: NotificationData) {
    // Mock implementation - would create actual database record
    return {
      id: Date.now().toString(),
      ...data,
      isRead: false,
      createdAt: new Date()
    };
  }

  private async sendPushNotification(data: NotificationData, user: any) {
    // Mock implementation - would integrate with push notification service
    console.log(`📱 Push notification sent to ${user.firstName}: ${data.title}`);
  }

  private async sendEmailNotification(data: NotificationData, user: any) {
    // Mock implementation - would send actual email
    console.log(`📧 Email notification sent to ${user.email}: ${data.title}`);
  }

  private async sendSMSNotification(data: NotificationData, user: any) {
    // Mock implementation - would send actual SMS
    console.log(`📱 SMS notification sent to ${user.firstName}: ${data.title}`);
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      categories: {
        dates: true,
        matches: true,
        messages: true,
        profile: true,
        safety: true,
        marketing: false
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      frequency: 'immediate'
    };
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: NotificationData[]) {
    try {
      const results = await Promise.allSettled(
        notifications.map(notification => this.sendNotification(notification))
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      return {
        success: true,
        data: {
          total: notifications.length,
          successful,
          failed,
          results
        },
        message: `Bulk notifications processed: ${successful} successful, ${failed} failed`
      };
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw new BadRequestException('Failed to send bulk notifications');
    }
  }

  /**
   * Schedule notification for later delivery
   */
  async scheduleNotification(data: NotificationData) {
    try {
      if (!data.scheduledFor) {
        throw new BadRequestException('Scheduled time is required');
      }

      // Mock implementation - would store in database with scheduled time
      const scheduledNotification = {
        id: Date.now().toString(),
        ...data,
        status: 'scheduled',
        createdAt: new Date()
      };

      return {
        success: true,
        data: scheduledNotification,
        message: 'Notification scheduled successfully'
      };
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw new BadRequestException('Failed to schedule notification');
    }
  }

  /**
   * Cancel scheduled notification
   */
  async cancelScheduledNotification(userId: string, notificationId: string) {
    try {
      // Mock implementation
      return {
        success: true,
        message: 'Scheduled notification cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling scheduled notification:', error);
      throw new BadRequestException('Failed to cancel scheduled notification');
    }
  }
}
