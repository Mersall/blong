/**
 * BLONG Safety and Verification Service
 * Comprehensive safety features including photo verification, reporting system, and safety resources
 */

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PhotoVerificationRequest {
  userId: string;
  photoUrl: string;
  verificationType: 'identity' | 'selfie' | 'live_photo';
  metadata?: {
    deviceInfo?: string;
    location?: { latitude: number; longitude: number };
    timestamp: string;
  };
}

export interface SafetyReport {
  reporterId: string;
  reportedUserId: string;
  category: SafetyReportCategory;
  subcategory?: string;
  description: string;
  evidence?: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: any;
}

export enum SafetyReportCategory {
  INAPPROPRIATE_PHOTOS = 'inappropriate_photos',
  HARASSMENT = 'harassment',
  FAKE_PROFILE = 'fake_profile',
  SPAM = 'spam',
  OFFLINE_BEHAVIOR = 'offline_behavior',
  SAFETY_CONCERN = 'safety_concern',
  IDENTITY_THEFT = 'identity_theft',
  MINOR_SAFETY = 'minor_safety',
  OTHER = 'other'
}

export interface SafetyCheckIn {
  userId: string;
  dateId?: string;
  location?: { latitude: number; longitude: number };
  status: 'safe' | 'help_needed' | 'emergency';
  message?: string;
  emergencyContacts?: string[];
}

@Injectable()
export class SafetyService {
  private readonly logger = new Logger(SafetyService.name);

  constructor(private prisma: PrismaService) {}

  // ============================================================================
  // PHOTO VERIFICATION SYSTEM
  // ============================================================================

  /**
   * Request photo verification
   */
  async requestPhotoVerification(request: PhotoVerificationRequest) {
    const { userId, photoUrl, verificationType, metadata } = request;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if there's already a pending verification
    // In production, would check VerificationRequest table
    
    // Create verification request record
    const verificationRequest = {
      id: this.generateVerificationId(),
      userId,
      photoUrl,
      verificationType,
      status: 'pending',
      submittedAt: new Date(),
      metadata: {
        ...metadata,
        ipAddress: '127.0.0.1', // Would get from request
        userAgent: 'BLONG Mobile App'
      }
    };

    // In production, would save to database
    // await this.prisma.photoVerificationRequest.create({ data: verificationRequest });

    // Initiate AI verification process
    const aiResult = await this.performAIPhotoVerification(photoUrl, verificationType);

    if (aiResult.confidence > 0.8) {
      // Auto-approve high-confidence verifications
      return this.approveVerification(verificationRequest.id, 'ai_auto_approved');
    } else {
      // Queue for manual review
      await this.queueForManualReview(verificationRequest.id, aiResult);
      
      return {
        success: true,
        verificationId: verificationRequest.id,
        status: 'pending_review',
        estimatedReviewTime: '1-3 business days',
        message: 'Your photo has been submitted for verification'
      };
    }
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(userId: string) {
    // In production, would fetch from database
    return {
      isVerified: false, // user.verificationStatus === 'VERIFIED'
      verificationLevel: 'none', // 'basic', 'photo', 'identity', 'premium'
      pendingRequests: [],
      verificationHistory: [],
      availableVerifications: [
        {
          type: 'photo',
          title: 'Photo Verification',
          description: 'Verify your photos represent your profile',
          requirements: ['Clear face photo', 'Good lighting', 'Recent photo'],
          estimatedTime: '1-3 business days',
          benefits: ['Increased trust', 'Higher visibility', 'Verification badge']
        },
        {
          type: 'identity',
          title: 'Identity Verification',
          description: 'Verify your identity with government ID',
          requirements: ['Government-issued ID', 'Selfie photo', 'Clear images'],
          estimatedTime: '3-5 business days',
          benefits: ['Maximum trust', 'Premium features', 'Priority support']
        }
      ]
    };
  }

  // ============================================================================
  // REPORTING SYSTEM
  // ============================================================================

  /**
   * Submit safety report
   */
  async submitSafetyReport(report: SafetyReport) {
    const {
      reporterId,
      reportedUserId,
      category,
      subcategory,
      description,
      evidence,
      severity,
      metadata
    } = report;

    // Validate users exist
    const [reporter, reportedUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: reporterId } }),
      this.prisma.user.findUnique({ where: { id: reportedUserId } })
    ]);

    if (!reporter || !reportedUser) {
      throw new NotFoundException('User not found');
    }

    // Check for duplicate reports
    const existingReport = await this.checkForDuplicateReport(reporterId, reportedUserId, category);
    if (existingReport) {
      return {
        success: false,
        message: 'You have already reported this user for this issue',
        reportId: existingReport.id
      };
    }

    // Create safety report
    const safetyReport = {
      id: this.generateReportId(),
      reporterId,
      reportedUserId,
      category,
      subcategory,
      description,
      evidence: evidence || [],
      severity,
      status: 'pending',
      submittedAt: new Date(),
      metadata: {
        ...metadata,
        reporterProfile: {
          accountAge: this.calculateAccountAge(reporter.createdAt),
          verificationStatus: reporter.verificationStatus
        }
      }
    };

    // In production, would save to database
    // await this.prisma.safetyReport.create({ data: safetyReport });

    // Auto-triage based on severity and category
    const triageResult = await this.triageSafetyReport(safetyReport);

    // Take immediate action if necessary
    if (triageResult.immediateAction) {
      await this.takeImmediateSafetyAction(reportedUserId, triageResult.action);
    }

    // Notify safety team
    await this.notifySafetyTeam(safetyReport, triageResult);

    return {
      success: true,
      reportId: safetyReport.id,
      status: safetyReport.status,
      message: 'Your report has been submitted and will be reviewed by our safety team',
      referenceNumber: safetyReport.id.slice(-8).toUpperCase(),
      expectedResponse: this.getExpectedResponseTime(severity)
    };
  }

  /**
   * Get safety reporting options
   */
  async getSafetyReportingOptions() {
    return {
      categories: [
        {
          id: SafetyReportCategory.INAPPROPRIATE_PHOTOS,
          title: 'Inappropriate Photos',
          description: 'Inappropriate, explicit, or offensive images',
          subcategories: ['Explicit content', 'Inappropriate for dating', 'Not of the person', 'Offensive material'],
          severity: 'high'
        },
        {
          id: SafetyReportCategory.HARASSMENT,
          title: 'Harassment or Abuse',
          description: 'Threatening, harassing, or abusive behavior',
          subcategories: ['Threats', 'Verbal abuse', 'Unwanted contact', 'Stalking behavior'],
          severity: 'high'
        },
        {
          id: SafetyReportCategory.FAKE_PROFILE,
          title: 'Fake Profile',
          description: 'Profile appears to be fake or using stolen photos',
          subcategories: ['Stolen photos', 'False information', 'Catfishing', 'Bot account'],
          severity: 'medium'
        },
        {
          id: SafetyReportCategory.SPAM,
          title: 'Spam or Scam',
          description: 'Spam messages, scams, or promotional content',
          subcategories: ['Romance scam', 'Financial scam', 'Promotional content', 'External links'],
          severity: 'medium'
        },
        {
          id: SafetyReportCategory.OFFLINE_BEHAVIOR,
          title: 'Offline Behavior',
          description: 'Concerning behavior during in-person meetings',
          subcategories: ['Inaccurate profile', 'Inappropriate behavior', 'Safety concern', 'Made me uncomfortable'],
          severity: 'high'
        },
        {
          id: SafetyReportCategory.SAFETY_CONCERN,
          title: 'Safety Concern',
          description: 'General safety or security concerns',
          subcategories: ['Feels dangerous', 'Suspicious activity', 'Privacy violation', 'Location concern'],
          severity: 'high'
        }
      ],
      evidenceTypes: [
        { type: 'screenshot', title: 'Screenshots', description: 'Screenshots of messages or profile' },
        { type: 'photos', title: 'Photos', description: 'Relevant photos as evidence' },
        { type: 'conversation', title: 'Conversation Log', description: 'Chat conversation history' },
        { type: 'profile_link', title: 'Profile Link', description: 'Link to the reported profile' }
      ],
      tips: [
        'Be as specific as possible in your description',
        'Include relevant evidence like screenshots',
        'Report as soon as possible after the incident',
        'Block the user if you feel unsafe',
        'Contact emergency services if in immediate danger'
      ]
    };
  }

  // ============================================================================
  // SAFETY CHECK-IN SYSTEM
  // ============================================================================



  /**
   * Get safety resources
   */
  async getSafetyResources(userId?: string) {
    return {
      emergencyContacts: [
        { name: 'Emergency Services', number: '911', type: 'emergency' },
        { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', type: 'support' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', type: 'support' }
      ],
      safetyTips: {
        beforeDate: [
          'Meet in a public place for the first few dates',
          'Tell a friend or family member about your plans',
          'Have your own transportation arranged',
          'Keep your phone charged and accessible',
          'Trust your instincts if something feels wrong'
        ],
        duringDate: [
          'Stay in public places until you feel comfortable',
          'Don\'t leave your drink unattended',
          'Be aware of your surroundings',
          'Have a safety check-in with a friend',
          'Listen to your gut feelings'
        ],
        afterDate: [
          'Let someone know you arrived home safely',
          'Report any concerning behavior',
          'Block users who make you uncomfortable',
          'Take time to process the experience',
          'Seek support if needed'
        ]
      },
      resources: [
        {
          title: 'Dating Safety Guide',
          description: 'Comprehensive guide to staying safe while dating',
          type: 'guide',
          url: '/safety/dating-guide'
        },
        {
          title: 'Recognizing Red Flags',
          description: 'How to identify potentially dangerous behavior',
          type: 'article',
          url: '/safety/red-flags'
        },
        {
          title: 'Emergency Procedures',
          description: 'What to do in emergency situations',
          type: 'guide',
          url: '/safety/emergency'
        }
      ],
      features: [
        {
          name: 'Safety Check-in',
          description: 'Let friends know you\'re safe during dates',
          enabled: true
        },
        {
          name: 'Emergency Contacts',
          description: 'Quick access to emergency contacts',
          enabled: true
        },
        {
          name: 'Location Sharing',
          description: 'Share your location with trusted contacts',
          enabled: false // Would be user preference
        },
        {
          name: 'Profile Verification',
          description: 'Verify profiles for added safety',
          enabled: true
        }
      ]
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async performAIPhotoVerification(photoUrl: string, verificationType: string) {
    // Simulate AI photo verification
    // In production, would integrate with AI services like Amazon Rekognition, Google Vision, etc.
    
    const mockResults = {
      faceDetected: Math.random() > 0.1,
      faceCount: Math.floor(Math.random() * 3) + 1,
      qualityScore: Math.random() * 0.4 + 0.6, // 0.6-1.0
      livenessScore: Math.random() * 0.3 + 0.7, // 0.7-1.0
      matchScore: Math.random() * 0.5 + 0.5, // 0.5-1.0
      confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
      flags: [] as string[]
    };

    // Add flags based on results
    if (mockResults.faceCount !== 1) mockResults.flags.push('multiple_faces');
    if (mockResults.qualityScore < 0.7) mockResults.flags.push('low_quality');
    if (mockResults.livenessScore < 0.8) mockResults.flags.push('liveness_check_failed');

    this.logger.debug(`AI verification result for ${photoUrl}:`, mockResults);

    return mockResults;
  }

  private async approveVerification(verificationId: string, approvalReason: string) {
    // Update verification status
    // In production, would update database
    
    return {
      success: true,
      verificationId,
      status: 'approved',
      approvalReason,
      approvedAt: new Date(),
      message: 'Your photo has been verified successfully!'
    };
  }

  private async queueForManualReview(verificationId: string, aiResult: any) {
    // Queue for manual review by safety team
    // In production, would add to review queue
    
    this.logger.debug(`Queued verification ${verificationId} for manual review`);
  }

  private async checkForDuplicateReport(reporterId: string, reportedUserId: string, category: SafetyReportCategory): Promise<{ id: string } | null> {
    // In production, would check database for existing reports
    return null;
  }

  private async triageSafetyReport(report: any) {
    // Automatic triage based on severity, category, and user history
    const triageRules = {
      [SafetyReportCategory.MINOR_SAFETY]: { priority: 'critical', immediateAction: true, action: 'suspend' },
      [SafetyReportCategory.IDENTITY_THEFT]: { priority: 'high', immediateAction: true, action: 'investigate' },
      [SafetyReportCategory.HARASSMENT]: { priority: 'high', immediateAction: false },
      [SafetyReportCategory.INAPPROPRIATE_PHOTOS]: { priority: 'medium', immediateAction: false },
      [SafetyReportCategory.FAKE_PROFILE]: { priority: 'medium', immediateAction: false },
      [SafetyReportCategory.SPAM]: { priority: 'low', immediateAction: false }
    };

    const rule = triageRules[report.category] || { priority: 'medium', immediateAction: false };

    return {
      priority: rule.priority,
      immediateAction: rule.immediateAction,
      action: rule.action,
      assignedTo: 'safety_team',
      estimatedReviewTime: this.getEstimatedReviewTime(rule.priority)
    };
  }

  private async takeImmediateSafetyAction(userId: string, action: string) {
    switch (action) {
      case 'suspend':
        // Temporarily suspend account
        this.logger.warn(`Taking immediate suspension action for user ${userId}`);
        break;
      case 'investigate':
        // Flag for immediate investigation
        this.logger.warn(`Flagging user ${userId} for immediate investigation`);
        break;
      default:
        this.logger.debug(`No immediate action taken for user ${userId}`);
    }
  }

  private async notifySafetyTeam(report: any, triageResult: any) {
    // Notify safety team about new report
    this.logger.log(`Safety team notified about report ${report.id} with priority ${triageResult.priority}`);
  }

  private async handleEmergencyCheckIn(checkIn: any) {
    // Handle emergency check-in
    this.logger.error(`Emergency check-in received from user ${checkIn.userId}`);
    
    // In production, would:
    // 1. Alert emergency contacts
    // 2. Notify safety team immediately
    // 3. Potentially contact emergency services
    // 4. Track location if available
  }

  private async scheduleFollowUpCheck(checkIn: any) {
    // Schedule follow-up check based on check-in type
    const followUpTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    
    this.logger.debug(`Scheduled follow-up check for ${checkIn.id} at ${followUpTime}`);
  }

  private calculateAccountAge(createdAt: Date): number {
    return Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  }

  private getExpectedResponseTime(severity: string): string {
    const responseTime = {
      'low': '3-5 business days',
      'medium': '1-3 business days',
      'high': '24-48 hours',
      'critical': '2-6 hours'
    };
    
    return responseTime[severity] || '3-5 business days';
  }

  private getEstimatedReviewTime(priority: string): string {
    const reviewTime = {
      'low': '5-7 business days',
      'medium': '2-3 business days',
      'high': '24-48 hours',
      'critical': '2-6 hours'
    };
    
    return reviewTime[priority] || '2-3 business days';
  }

  private getCheckInMessage(status: string): string {
    const messages = {
      'safe': 'Great! Your safety check-in has been recorded.',
      'help_needed': 'We\'ve noted you need help. Our safety team will follow up soon.',
      'emergency': 'Emergency check-in received. Help is on the way.'
    };
    
    return messages[status] || 'Check-in recorded successfully.';
  }

  private generateVerificationId(): string {
    return `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCheckInId(): string {
    return `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // NEW DATABASE-INTEGRATED METHODS
  // ============================================================================

  /**
   * Create safety report using database
   */
  async createSafetyReport(data: {
    reporterId: string;
    reportedUserId: string;
    category: any;
    subcategory?: string;
    description: string;
    evidence?: any;
    severity?: any;
  }) {
    try {
      // Prevent self-reporting
      if (data.reporterId === data.reportedUserId) {
        throw new BadRequestException('Cannot report yourself');
      }

      // Check for duplicate recent reports
      const existingReport = await this.prisma.safetyReport.findFirst({
        where: {
          reporterId: data.reporterId,
          reportedUserId: data.reportedUserId,
          category: data.category,
          submittedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      if (existingReport) {
        throw new BadRequestException('You have already reported this user for this category recently');
      }

      const report = await this.prisma.safetyReport.create({
        data: {
          reporterId: data.reporterId,
          reportedUserId: data.reportedUserId,
          category: data.category,
          subcategory: data.subcategory,
          description: data.description,
          evidence: data.evidence,
          severity: data.severity || 'MEDIUM',
        },
        include: {
          reporter: {
            select: { id: true, firstName: true, lastName: true },
          },
          reportedUser: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });

      return {
        success: true,
        data: report,
        message: 'Safety report submitted successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Failed to create safety report:', error);
      throw new BadRequestException('Failed to submit safety report');
    }
  }

  /**
   * Get user safety reports from database
   */
  async getUserSafetyReports(userId: string, type: 'made' | 'received' = 'made') {
    try {
      const reports = await this.prisma.safetyReport.findMany({
        where: type === 'made' ? { reporterId: userId } : { reportedUserId: userId },
        include: {
          reporter: {
            select: { id: true, firstName: true, lastName: true },
          },
          reportedUser: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { submittedAt: 'desc' },
      });

      return {
        success: true,
        data: reports,
      };
    } catch (error) {
      this.logger.error('Failed to fetch safety reports:', error);
      throw new BadRequestException('Failed to fetch safety reports');
    }
  }

  /**
   * Block user using database
   */
  async blockUser(data: {
    blockingUserId: string;
    blockedUserId: string;
    reason?: any;
    description?: string;
  }) {
    try {
      // Prevent self-blocking
      if (data.blockingUserId === data.blockedUserId) {
        throw new BadRequestException('Cannot block yourself');
      }

      // Check if already blocked
      const existingBlock = await this.prisma.userBlock.findUnique({
        where: {
          blockingUserId_blockedUserId: {
            blockingUserId: data.blockingUserId,
            blockedUserId: data.blockedUserId,
          },
        },
      });

      if (existingBlock && existingBlock.isActive) {
        throw new BadRequestException('User is already blocked');
      }

      // Create or reactivate block
      const block = await this.prisma.userBlock.upsert({
        where: {
          blockingUserId_blockedUserId: {
            blockingUserId: data.blockingUserId,
            blockedUserId: data.blockedUserId,
          },
        },
        update: {
          isActive: true,
          reason: data.reason,
          description: data.description,
          blockedAt: new Date(),
        },
        create: {
          blockingUserId: data.blockingUserId,
          blockedUserId: data.blockedUserId,
          reason: data.reason,
          description: data.description,
        },
        include: {
          blockedUser: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });

      return {
        success: true,
        data: block,
        message: 'User blocked successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Failed to block user:', error);
      throw new BadRequestException('Failed to block user');
    }
  }

  /**
   * Unblock user using database
   */
  async unblockUser(blockingUserId: string, blockedUserId: string) {
    try {
      const block = await this.prisma.userBlock.findUnique({
        where: {
          blockingUserId_blockedUserId: {
            blockingUserId,
            blockedUserId,
          },
        },
      });

      if (!block || !block.isActive) {
        throw new NotFoundException('Block not found or already inactive');
      }

      await this.prisma.userBlock.update({
        where: {
          blockingUserId_blockedUserId: {
            blockingUserId,
            blockedUserId,
          },
        },
        data: {
          isActive: false,
        },
      });

      return {
        success: true,
        message: 'User unblocked successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to unblock user:', error);
      throw new BadRequestException('Failed to unblock user');
    }
  }

  /**
   * Get blocked users from database
   */
  async getBlockedUsers(userId: string) {
    try {
      const blocks = await this.prisma.userBlock.findMany({
        where: {
          blockingUserId: userId,
          isActive: true,
        },
        include: {
          blockedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
        },
        orderBy: { blockedAt: 'desc' },
      });

      return {
        success: true,
        data: blocks,
      };
    } catch (error) {
      this.logger.error('Failed to fetch blocked users:', error);
      throw new BadRequestException('Failed to fetch blocked users');
    }
  }

  /**
   * Create verification request using database
   */
  async createVerificationRequest(data: {
    userId: string;
    verificationType: any;
    documentType?: string;
    documentImages?: string[];
    selfieImage?: string;
    livePhotoImage?: string;
    metadata?: any;
  }) {
    try {
      // Check for existing pending request
      const existingRequest = await this.prisma.verificationRequest.findFirst({
        where: {
          userId: data.userId,
          verificationType: data.verificationType,
          status: 'PENDING',
        },
      });

      if (existingRequest) {
        throw new BadRequestException('A verification request of this type is already pending');
      }

      const request = await this.prisma.verificationRequest.create({
        data: {
          userId: data.userId,
          verificationType: data.verificationType,
          documentType: data.documentType,
          documentImages: data.documentImages || [],
          selfieImage: data.selfieImage,
          livePhotoImage: data.livePhotoImage,
          metadata: data.metadata,
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      return {
        success: true,
        data: request,
        message: 'Verification request submitted successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Failed to create verification request:', error);
      throw new BadRequestException('Failed to submit verification request');
    }
  }

  /**
   * Get user verification requests from database
   */
  async getUserVerificationRequests(userId: string) {
    try {
      const requests = await this.prisma.verificationRequest.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
      });

      return {
        success: true,
        data: requests,
      };
    } catch (error) {
      this.logger.error('Failed to fetch verification requests:', error);
      throw new BadRequestException('Failed to fetch verification requests');
    }
  }

  /**
   * Create safety check-in using database
   */
  async createSafetyCheckIn(data: {
    userId: string;
    status?: any;
    location?: any;
    plannedDuration?: number;
    notes?: string;
    metadata?: any;
  }) {
    try {
      const checkIn = await this.prisma.safetyCheckIn.create({
        data: {
          userId: data.userId,
          status: data.status || 'SAFE',
          location: data.location,
          plannedDuration: data.plannedDuration,
          notes: data.notes,
          metadata: data.metadata,
          expectedEndTime: data.plannedDuration
            ? new Date(Date.now() + data.plannedDuration * 60 * 1000)
            : undefined,
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });

      // Handle emergency check-ins
      if (data.status === 'EMERGENCY' || data.status === 'HELP_NEEDED') {
        await this.handleEmergencyCheckIn(checkIn);
      }

      return {
        success: true,
        data: checkIn,
        message: 'Safety check-in created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create safety check-in:', error);
      throw new BadRequestException('Failed to create safety check-in');
    }
  }

  /**
   * Get user safety check-ins from database
   */
  async getUserSafetyCheckIns(userId: string) {
    try {
      const checkIns = await this.prisma.safetyCheckIn.findMany({
        where: { userId },
        orderBy: { checkInTime: 'desc' },
        take: 50, // Limit to last 50 check-ins
      });

      return {
        success: true,
        data: checkIns,
      };
    } catch (error) {
      this.logger.error('Failed to fetch safety check-ins:', error);
      throw new BadRequestException('Failed to fetch safety check-ins');
    }
  }

  /**
   * Add emergency contact using database
   */
  async addEmergencyContact(data: {
    userId: string;
    name: string;
    phoneNumber: string;
    email?: string;
    relationship: string;
    isPrimary?: boolean;
  }) {
    try {
      // If setting as primary, unset other primary contacts
      if (data.isPrimary) {
        await this.prisma.emergencyContact.updateMany({
          where: {
            userId: data.userId,
            isPrimary: true,
          },
          data: {
            isPrimary: false,
          },
        });
      }

      const contact = await this.prisma.emergencyContact.create({
        data: {
          userId: data.userId,
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          relationship: data.relationship,
          isPrimary: data.isPrimary || false,
        },
      });

      return {
        success: true,
        data: contact,
        message: 'Emergency contact added successfully',
      };
    } catch (error) {
      this.logger.error('Failed to add emergency contact:', error);
      throw new BadRequestException('Failed to add emergency contact');
    }
  }

  /**
   * Get emergency contacts from database
   */
  async getEmergencyContacts(userId: string) {
    try {
      const contacts = await this.prisma.emergencyContact.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: [
          { isPrimary: 'desc' },
          { createdAt: 'asc' },
        ],
      });

      return {
        success: true,
        data: contacts,
      };
    } catch (error) {
      this.logger.error('Failed to fetch emergency contacts:', error);
      throw new BadRequestException('Failed to fetch emergency contacts');
    }
  }

  /**
   * Remove emergency contact from database
   */
  async removeEmergencyContact(userId: string, contactId: string) {
    try {
      const contact = await this.prisma.emergencyContact.findFirst({
        where: {
          id: contactId,
          userId,
        },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      await this.prisma.emergencyContact.update({
        where: { id: contactId },
        data: { isActive: false },
      });

      return {
        success: true,
        message: 'Emergency contact removed successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to remove emergency contact:', error);
      throw new BadRequestException('Failed to remove emergency contact');
    }
  }
}