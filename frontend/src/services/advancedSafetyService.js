/**
 * BLONG Advanced Safety Service
 * Comprehensive safety monitoring, threat detection, and user protection
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './apiService';
import networkManager from './networkManager';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';

// Safety threat levels
const THREAT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Safety check-in statuses
const CHECK_IN_STATUS = {
  SAFE: 'safe',
  DELAYED: 'delayed',
  HELP_NEEDED: 'help_needed',
  EMERGENCY: 'emergency',
  NO_RESPONSE: 'no_response',
};

// Report categories
const REPORT_CATEGORIES = {
  HARASSMENT: 'harassment',
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  FAKE_PROFILE: 'fake_profile',
  SCAM: 'scam',
  VIOLENCE_THREAT: 'violence_threat',
  UNDERAGE: 'underage',
  SPAM: 'spam',
  OTHER: 'other',
};

class AdvancedSafetyService {
  constructor() {
    this.emergencyContacts = [];
    this.safetySettings = {};
    this.activeCheckIns = new Map();
    this.threatDetectionEnabled = true;
    this.locationSharingEnabled = false;
    this.autoCheckInEnabled = false;

    this.initialize();
  }

  /**
   * Initialize safety service
   */
  async initialize() {
    try {
      await this.loadSafetySettings();
      await this.loadEmergencyContacts();
      await this.setupNotifications();
      await this.startThreatMonitoring();

      console.log('🛡️ Advanced Safety Service initialized');
    } catch (error) {
      console.error('Failed to initialize safety service:', error);
    }
  }

  // ============================================================================
  // PROFILE VERIFICATION & IDENTITY PROTECTION
  // ============================================================================

  /**
   * Request advanced profile verification
   */
  async requestProfileVerification(verificationType, additionalData = {}) {
    try {
      const verificationRequest = {
        type: verificationType,
        timestamp: new Date().toISOString(),
        deviceInfo: await this.getDeviceInfo(),
        ...additionalData,
      };

      if (verificationType === 'biometric') {
        verificationRequest.biometricData = await this.captureBiometricData();
      }

      if (verificationType === 'document') {
        verificationRequest.documentData = additionalData.documentData;
      }

      const response = await apiService.post('/api/safety/verification/request', verificationRequest);

      return {
        success: true,
        verificationId: response.data.verificationId,
        status: response.data.status,
        estimatedTime: response.data.estimatedTime,
        nextSteps: response.data.nextSteps,
      };

    } catch (error) {
      console.error('Profile verification request failed:', error);
      throw new Error('Failed to request profile verification');
    }
  }

  /**
   * Perform real-time identity verification
   */
  async performLiveVerification() {
    try {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission required for live verification');
      }

      // Capture live photo with liveness detection
      const livePhoto = await this.captureLivePhoto();

      // Perform facial recognition against profile photos
      const verificationResult = await this.performFacialRecognition(livePhoto);

      // Submit for verification
      const response = await apiService.post('/api/safety/verification/live', {
        livePhoto: livePhoto.uri,
        verificationData: verificationResult,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        confidence: response.data.confidence,
        verified: response.data.verified,
        verificationLevel: response.data.verificationLevel,
      };

    } catch (error) {
      console.error('Live verification failed:', error);
      throw error;
    }
  }

  /**
   * Check profile authenticity score
   */
  async checkProfileAuthenticity(userId) {
    try {
      const response = await apiService.get(`/api/safety/authenticity/${userId}`);

      return {
        authenticityScore: response.data.score,
        riskFactors: response.data.riskFactors,
        verificationStatus: response.data.verificationStatus,
        trustLevel: response.data.trustLevel,
        recommendations: response.data.recommendations,
      };

    } catch (error) {
      console.error('Failed to check profile authenticity:', error);
      return {
        authenticityScore: 0,
        riskFactors: ['Unable to verify'],
        verificationStatus: 'unknown',
        trustLevel: 'low',
        recommendations: ['Exercise caution when interacting'],
      };
    }
  }

  // ============================================================================
  // THREAT DETECTION & MONITORING
  // ============================================================================

  /**
   * Start real-time threat monitoring
   */
  async startThreatMonitoring() {
    if (!this.threatDetectionEnabled) return;

    try {
      // Monitor conversation patterns
      this.startConversationMonitoring();

      // Monitor behavioral patterns
      this.startBehaviorMonitoring();

      // Monitor location-based threats
      this.startLocationMonitoring();

      console.log('🔍 Threat monitoring started');
    } catch (error) {
      console.error('Failed to start threat monitoring:', error);
    }
  }

  /**
   * Analyze conversation for threats
   */
  async analyzeConversationThreat(messageData) {
    try {
      const analysis = {
        message: messageData.content,
        senderId: messageData.senderId,
        timestamp: messageData.timestamp,
        metadata: {
          messageLength: messageData.content.length,
          hasLinks: this.containsLinks(messageData.content),
          hasPhoneNumbers: this.containsPhoneNumbers(messageData.content),
          hasEmails: this.containsEmails(messageData.content),
        },
      };

      // Perform AI-based threat analysis
      const threatAnalysis = await this.performThreatAnalysis(analysis);

      if (threatAnalysis.threatLevel !== THREAT_LEVELS.LOW) {
        await this.handleThreatDetection(threatAnalysis);
      }

      return threatAnalysis;

    } catch (error) {
      console.error('Conversation threat analysis failed:', error);
      return { threatLevel: THREAT_LEVELS.LOW, confidence: 0 };
    }
  }

  /**
   * Detect suspicious behavior patterns
   */
  async detectSuspiciousBehavior(userInteractions) {
    try {
      const behaviorAnalysis = {
        rapidMessaging: this.detectRapidMessaging(userInteractions),
        pressurePatterns: this.detectPressurePatterns(userInteractions),
        informationHarvesting: this.detectInformationHarvesting(userInteractions),
        locationRequests: this.detectLocationRequests(userInteractions),
        financialRequests: this.detectFinancialRequests(userInteractions),
      };

      const riskScore = this.calculateBehaviorRiskScore(behaviorAnalysis);

      if (riskScore > 70) {
        await this.triggerSafetyAlert({
          type: 'suspicious_behavior',
          riskScore,
          analysis: behaviorAnalysis,
          userId: userInteractions.userId,
        });
      }

      return {
        riskScore,
        analysis: behaviorAnalysis,
        recommendations: this.generateSafetyRecommendations(behaviorAnalysis),
      };

    } catch (error) {
      console.error('Behavior detection failed:', error);
      return { riskScore: 0, analysis: {}, recommendations: [] };
    }
  }

  // ============================================================================
  // EMERGENCY FEATURES & SAFETY CHECK-INS
  // ============================================================================

  /**
   * Start safety check-in for a date
   */
  async startSafetyCheckIn(dateDetails) {
    try {
      const checkInId = `checkin_${Date.now()}`;
      const checkIn = {
        id: checkInId,
        dateId: dateDetails.dateId,
        partnerId: dateDetails.partnerId,
        location: dateDetails.location,
        startTime: new Date(),
        expectedDuration: dateDetails.expectedDuration || 120, // 2 hours default
        status: CHECK_IN_STATUS.SAFE,
        checkInInterval: 30, // minutes
        emergencyContacts: this.emergencyContacts,
        autoCheckInEnabled: this.autoCheckInEnabled,
      };

      // Store check-in
      this.activeCheckIns.set(checkInId, checkIn);
      await this.saveCheckInToStorage(checkIn);

      // Schedule automatic check-ins
      if (checkIn.autoCheckInEnabled) {
        this.scheduleAutoCheckIns(checkIn);
      }

      // Notify emergency contacts
      await this.notifyEmergencyContactsStart(checkIn);

      // Submit to backend
      await apiService.post('/api/safety/checkin/start', checkIn);

      return {
        success: true,
        checkInId,
        nextCheckIn: new Date(Date.now() + checkIn.checkInInterval * 60000),
        emergencyNumber: this.getEmergencyNumber(),
      };

    } catch (error) {
      console.error('Failed to start safety check-in:', error);
      throw error;
    }
  }

  /**
   * Update safety check-in status
   */
  async updateCheckInStatus(checkInId, status, additionalInfo = {}) {
    try {
      const checkIn = this.activeCheckIns.get(checkInId);
      if (!checkIn) {
        throw new Error('Check-in not found');
      }

      checkIn.status = status;
      checkIn.lastUpdate = new Date();
      checkIn.additionalInfo = additionalInfo;

      // Handle different status types
      switch (status) {
        case CHECK_IN_STATUS.SAFE:
          await this.handleSafeCheckIn(checkIn);
          break;
        case CHECK_IN_STATUS.DELAYED:
          await this.handleDelayedCheckIn(checkIn);
          break;
        case CHECK_IN_STATUS.HELP_NEEDED:
          await this.handleHelpNeededCheckIn(checkIn);
          break;
        case CHECK_IN_STATUS.EMERGENCY:
          await this.handleEmergencyCheckIn(checkIn);
          break;
      }

      // Update storage and backend
      await this.saveCheckInToStorage(checkIn);
      await apiService.post('/api/safety/checkin/update', {
        checkInId,
        status,
        timestamp: new Date(),
        additionalInfo,
      });

      return { success: true, status, nextAction: checkIn.nextAction };

    } catch (error) {
      console.error('Failed to update check-in status:', error);
      throw error;
    }
  }

  /**
   * Trigger emergency alert
   */
  async triggerEmergencyAlert(alertData = {}) {
    try {
      const emergency = {
        id: `emergency_${Date.now()}`,
        type: alertData.type || 'general',
        severity: THREAT_LEVELS.CRITICAL,
        timestamp: new Date(),
        location: await this.getCurrentLocation(),
        userInfo: await this.getUserInfo(),
        additionalData: alertData,
      };

      // Immediately notify emergency contacts
      await this.notifyEmergencyContacts(emergency);

      // Send to emergency services if configured
      if (this.safetySettings.autoContactEmergencyServices) {
        await this.contactEmergencyServices(emergency);
      }

      // Submit to backend for immediate response
      await apiService.post('/api/safety/emergency/alert', emergency);

      // Start location tracking
      await this.startEmergencyLocationTracking();

      // Send push notifications to safety network
      await this.notifySafetyNetwork(emergency);

      return {
        success: true,
        emergencyId: emergency.id,
        contactsNotified: this.emergencyContacts.length,
        emergencyNumber: this.getEmergencyNumber(),
      };

    } catch (error) {
      console.error('Failed to trigger emergency alert:', error);
      throw error;
    }
  }

  // ============================================================================
  // REPORTING & CONTENT MODERATION
  // ============================================================================

  /**
   * Submit comprehensive safety report
   */
  async submitSafetyReport(reportData) {
    try {
      const report = {
        id: `report_${Date.now()}`,
        category: reportData.category,
        subcategory: reportData.subcategory,
        reportedUserId: reportData.reportedUserId,
        description: reportData.description,
        evidence: reportData.evidence || [],
        severity: this.calculateReportSeverity(reportData),
        timestamp: new Date(),
        reporterInfo: await this.getReporterInfo(),
        additionalData: reportData.additionalData || {},
      };

      // Add screenshots if provided
      if (reportData.screenshots) {
        report.evidence.push(...reportData.screenshots);
      }

      // Add conversation history if relevant
      if (reportData.includeConversation) {
        report.conversationHistory = await this.getConversationHistory(reportData.reportedUserId);
      }

      // Submit to backend
      const response = await apiService.post('/api/safety/report', report);

      // Take immediate action if high severity
      if (report.severity === THREAT_LEVELS.HIGH || report.severity === THREAT_LEVELS.CRITICAL) {
        await this.takeImmediateAction(report);
      }

      return {
        success: true,
        reportId: response.data.reportId,
        status: response.data.status,
        estimatedReviewTime: response.data.estimatedReviewTime,
        supportResources: this.getSupportResources(report.category),
      };

    } catch (error) {
      console.error('Failed to submit safety report:', error);
      throw error;
    }
  }

  /**
   * Block and report user
   */
  async blockAndReportUser(userId, reason, additionalData = {}) {
    try {
      // Block user immediately
      await this.blockUser(userId);

      // Submit report
      const reportResult = await this.submitSafetyReport({
        category: REPORT_CATEGORIES.HARASSMENT,
        reportedUserId: userId,
        description: reason,
        additionalData,
      });

      // Remove from all interactions
      await this.removeUserFromInteractions(userId);

      return {
        success: true,
        blocked: true,
        reported: true,
        reportId: reportResult.reportId,
      };

    } catch (error) {
      console.error('Failed to block and report user:', error);
      throw error;
    }
  }

  // ============================================================================
  // PRIVACY CONTROLS & DATA PROTECTION
  // ============================================================================

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(settings) {
    try {
      const privacySettings = {
        profileVisibility: settings.profileVisibility || 'verified_only',
        locationSharing: settings.locationSharing || false,
        lastSeenVisibility: settings.lastSeenVisibility || false,
        readReceiptsEnabled: settings.readReceiptsEnabled || false,
        allowScreenshots: settings.allowScreenshots || false,
        dataRetentionPeriod: settings.dataRetentionPeriod || 365, // days
        anonymousMode: settings.anonymousMode || false,
        incognitoMode: settings.incognitoMode || false,
      };

      // Save locally
      await AsyncStorage.setItem('privacy_settings', JSON.stringify(privacySettings));

      // Update backend
      await apiService.post('/api/safety/privacy/update', privacySettings);

      this.privacySettings = privacySettings;

      return { success: true, settings: privacySettings };

    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw error;
    }
  }

  /**
   * Enable incognito mode
   */
  async enableIncognitoMode(duration = 24) { // hours
    try {
      const incognitoSession = {
        enabled: true,
        startTime: new Date(),
        duration: duration * 60 * 60 * 1000, // convert to milliseconds
        features: {
          hideLastSeen: true,
          hideReadReceipts: true,
          preventScreenshots: true,
          limitDataCollection: true,
        },
      };

      await AsyncStorage.setItem('incognito_session', JSON.stringify(incognitoSession));
      await apiService.post('/api/safety/incognito/enable', incognitoSession);

      // Schedule auto-disable
      setTimeout(() => {
        this.disableIncognitoMode();
      }, incognitoSession.duration);

      return { success: true, session: incognitoSession };

    } catch (error) {
      console.error('Failed to enable incognito mode:', error);
      throw error;
    }
  }

  /**
   * Request data deletion
   */
  async requestDataDeletion(deletionType = 'partial') {
    try {
      const deletionRequest = {
        type: deletionType, // 'partial', 'complete', 'anonymize'
        timestamp: new Date(),
        reason: 'user_request',
        retentionPeriod: deletionType === 'complete' ? 0 : 30, // days
      };

      const response = await apiService.post('/api/safety/data/deletion', deletionRequest);

      return {
        success: true,
        requestId: response.data.requestId,
        estimatedCompletionTime: response.data.estimatedCompletionTime,
        dataTypes: response.data.dataTypes,
      };

    } catch (error) {
      console.error('Failed to request data deletion:', error);
      throw error;
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Load safety settings from storage
   */
  async loadSafetySettings() {
    try {
      const stored = await AsyncStorage.getItem('safety_settings');
      this.safetySettings = stored ? JSON.parse(stored) : {
        threatDetectionEnabled: true,
        autoCheckInEnabled: false,
        locationSharingEnabled: false,
        emergencyServicesEnabled: false,
        safetyNetworkEnabled: true,
      };
    } catch (error) {
      console.error('Failed to load safety settings:', error);
      this.safetySettings = {};
    }
  }

  /**
   * Load emergency contacts
   */
  async loadEmergencyContacts() {
    try {
      const stored = await AsyncStorage.getItem('emergency_contacts');
      this.emergencyContacts = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load emergency contacts:', error);
      this.emergencyContacts = [];
    }
  }

  /**
   * Get device information for verification
   */
  async getDeviceInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get current location
   */
  async getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp),
      };
    } catch (error) {
      console.error('Failed to get location:', error);
      return null;
    }
  }

  /**
   * Calculate behavior risk score
   */
  calculateBehaviorRiskScore(analysis) {
    let score = 0;

    if (analysis.rapidMessaging) score += 20;
    if (analysis.pressurePatterns) score += 30;
    if (analysis.informationHarvesting) score += 25;
    if (analysis.locationRequests) score += 15;
    if (analysis.financialRequests) score += 40;

    return Math.min(100, score);
  }

  /**
   * Generate safety recommendations
   */
  generateSafetyRecommendations(analysis) {
    const recommendations = [];

    if (analysis.rapidMessaging) {
      recommendations.push('Take time to respond - avoid feeling pressured');
    }
    if (analysis.pressurePatterns) {
      recommendations.push('Be cautious of users who pressure you for personal information');
    }
    if (analysis.informationHarvesting) {
      recommendations.push('Avoid sharing personal details too quickly');
    }
    if (analysis.locationRequests) {
      recommendations.push('Meet in public places for first dates');
    }
    if (analysis.financialRequests) {
      recommendations.push('Never send money or financial information');
    }

    return recommendations;
  }

  /**
   * Get emergency number based on location
   */
  getEmergencyNumber() {
    // This would be determined by user's location
    return '911'; // Default for US
  }

  /**
   * Get support resources based on report category
   */
  getSupportResources(category) {
    const resources = {
      [REPORT_CATEGORIES.HARASSMENT]: [
        { name: 'National Domestic Violence Hotline', number: '1-800-799-7233' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
      ],
      [REPORT_CATEGORIES.VIOLENCE_THREAT]: [
        { name: 'Emergency Services', number: '911' },
        { name: 'National Suicide Prevention Lifeline', number: '988' },
      ],
      [REPORT_CATEGORIES.SCAM]: [
        { name: 'FTC Fraud Hotline', number: '1-877-382-4357' },
        { name: 'Internet Crime Complaint Center', url: 'https://ic3.gov' },
      ],
    };

    return resources[category] || [
      { name: 'BLONG Safety Support', email: 'safety@blong.com' },
    ];
  }
}

// Create singleton instance
const advancedSafetyService = new AdvancedSafetyService();

export default advancedSafetyService;
export { THREAT_LEVELS, CHECK_IN_STATUS, REPORT_CATEGORIES };