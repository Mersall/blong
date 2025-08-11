import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { NotificationsService, NotificationData, NotificationPreferences } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user notifications', description: 'Retrieve paginated list of user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'unread', required: false, type: Boolean, description: 'Filter unread notifications only' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getUserNotifications(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('unread') unread?: boolean,
  ) {
    return this.notificationsService.getUserNotifications(req.user.userId, page, limit);
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send notification', description: 'Send a notification to a user' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async sendNotification(
    @Request() req: any,
    @Body(ValidationPipe) notificationData: NotificationData,
  ) {
    return this.notificationsService.sendNotification({
      ...notificationData,
      userId: req.user.userId,
    });
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send bulk notifications', description: 'Send multiple notifications at once' })
  @ApiResponse({ status: 200, description: 'Bulk notifications sent successfully' })
  async sendBulkNotifications(
    @Request() req: any,
    @Body(ValidationPipe) notifications: NotificationData[],
  ) {
    const notificationsWithUserId = notifications.map(notification => ({
      ...notification,
      userId: req.user.id,
    }));
    return this.notificationsService.sendBulkNotifications(notificationsWithUserId);
  }

  @Post('schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule notification', description: 'Schedule a notification for later delivery' })
  @ApiResponse({ status: 200, description: 'Notification scheduled successfully' })
  async scheduleNotification(
    @Request() req: any,
    @Body(ValidationPipe) notificationData: NotificationData,
  ) {
    return this.notificationsService.scheduleNotification({
      ...notificationData,
      userId: req.user.id,
    });
  }

  @Put(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notification as read', description: 'Mark a specific notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read successfully' })
  async markAsRead(
    @Request() req: any,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(req.user.userId, notificationId);
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read', description: 'Mark all user notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read successfully' })
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Get('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notification preferences', description: 'Get user notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences retrieved successfully' })
  async getPreferences(@Request() req: any) {
    const preferences = await this.notificationsService.getUserPreferences(req.user.id);
    return {
      success: true,
      data: preferences,
      message: 'Notification preferences retrieved successfully'
    };
  }

  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification preferences', description: 'Update user notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences updated successfully' })
  async updatePreferences(
    @Request() req: any,
    @Body(ValidationPipe) preferences: Partial<NotificationPreferences>,
  ) {
    return this.notificationsService.updateUserPreferences(req.user.id, preferences);
  }

  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notification analytics', description: 'Get user notification analytics and insights' })
  @ApiResponse({ status: 200, description: 'Notification analytics retrieved successfully' })
  async getAnalytics(@Request() req: any) {
    return this.notificationsService.getNotificationAnalytics(req.user.id);
  }

  @Delete('scheduled/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel scheduled notification', description: 'Cancel a scheduled notification' })
  @ApiResponse({ status: 200, description: 'Scheduled notification cancelled successfully' })
  async cancelScheduledNotification(
    @Request() req: any,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.cancelScheduledNotification(req.user.id, notificationId);
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send test notification', description: 'Send a test notification to verify setup' })
  @ApiResponse({ status: 200, description: 'Test notification sent successfully' })
  async sendTestNotification(@Request() req: any) {
    const testNotification: NotificationData = {
      userId: req.user.userId,
      type: 'TEST',
      title: 'Test Notification',
      message: 'This is a test notification to verify your notification settings.',
      priority: 'normal',
      category: 'profile',
      data: {
        testId: Date.now(),
        timestamp: new Date().toISOString()
      }
    };

    return this.notificationsService.sendNotification(testNotification);
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get unread notification count', description: 'Get the count of unread notifications' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  async getUnreadCount(@Request() req: any) {
    const result = await this.notificationsService.getUserNotifications(req.user.id, 1, 1);
    return {
      success: true,
      data: {
        unreadCount: result.data.unreadCount
      },
      message: 'Unread count retrieved successfully'
    };
  }

  @Post('register-device')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register device for push notifications', description: 'Register device token for push notifications' })
  @ApiResponse({ status: 200, description: 'Device registered successfully' })
  async registerDevice(
    @Request() req: any,
    @Body() deviceData: { token: string; platform: string; deviceId: string },
  ) {
    // Mock implementation - would store device token for push notifications
    return {
      success: true,
      data: {
        userId: req.user.id,
        deviceToken: deviceData.token,
        platform: deviceData.platform,
        deviceId: deviceData.deviceId,
        registeredAt: new Date()
      },
      message: 'Device registered for push notifications successfully'
    };
  }

  @Delete('device/:deviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unregister device', description: 'Unregister device from push notifications' })
  @ApiResponse({ status: 200, description: 'Device unregistered successfully' })
  async unregisterDevice(
    @Request() req: any,
    @Param('deviceId') deviceId: string,
  ) {
    // Mock implementation - would remove device token
    return {
      success: true,
      message: 'Device unregistered from push notifications successfully'
    };
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notification categories', description: 'Get available notification categories' })
  @ApiResponse({ status: 200, description: 'Notification categories retrieved successfully' })
  async getCategories() {
    const categories = [
      {
        id: 'dates',
        name: 'Dates',
        description: 'Date confirmations, reminders, and updates',
        icon: '💕',
        defaultEnabled: true
      },
      {
        id: 'matches',
        name: 'Matches',
        description: 'New matches and compatibility updates',
        icon: '✨',
        defaultEnabled: true
      },
      {
        id: 'messages',
        name: 'Messages',
        description: 'New messages and chat notifications',
        icon: '💬',
        defaultEnabled: true
      },
      {
        id: 'profile',
        name: 'Profile',
        description: 'Profile views, completion reminders',
        icon: '👤',
        defaultEnabled: true
      },
      {
        id: 'safety',
        name: 'Safety',
        description: 'Safety check-ins and security alerts',
        icon: '🛡️',
        defaultEnabled: true
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Promotional content and app updates',
        icon: '📢',
        defaultEnabled: false
      }
    ];

    return {
      success: true,
      data: categories,
      message: 'Notification categories retrieved successfully'
    };
  }
}
