import { apiService } from './apiService';

class SafetyService {
  constructor() {
    this.baseURL = '/safety';
  }

  // ============================================================================
  // SAFETY REPORTS
  // ============================================================================

  async createSafetyReport(data) {
    try {
      const response = await apiService.post(`${this.baseURL}/reports`, data);
      return {
        success: true,
        data: response.data,
        message: 'Safety report submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async getSafetyReports(type = 'made') {
    try {
      const response = await apiService.get(`${this.baseURL}/reports`, { 
        params: { type } 
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async getSafetyReportingOptions() {
    try {
      const response = await apiService.get(`${this.baseURL}/reports/options`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  // ============================================================================
  // USER BLOCKING
  // ============================================================================

  async blockUser(data) {
    try {
      const response = await apiService.post(`${this.baseURL}/block`, data);
      return {
        success: true,
        data: response.data,
        message: 'User blocked successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async unblockUser(userId) {
    try {
      const response = await apiService.delete(`${this.baseURL}/block/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'User unblocked successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async getBlockedUsers() {
    try {
      const response = await apiService.get(`${this.baseURL}/blocked-users`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  // ============================================================================
  // VERIFICATION
  // ============================================================================

  async createVerificationRequest(data) {
    try {
      const response = await apiService.post(`${this.baseURL}/verification`, data);
      return {
        success: true,
        data: response.data,
        message: 'Verification request submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async getVerificationRequests() {
    try {
      const response = await apiService.get(`${this.baseURL}/verification`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async getVerificationStatus() {
    try {
      const response = await apiService.get(`${this.baseURL}/verification/status`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  // ============================================================================
  // SAFETY CHECK-INS
  // ============================================================================

  async createSafetyCheckIn(data) {
    try {
      const response = await apiService.post(`${this.baseURL}/check-in`, data);
      return {
        success: true,
        data: response.data,
        message: 'Safety check-in created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async getSafetyCheckIns() {
    try {
      const response = await apiService.get(`${this.baseURL}/check-ins`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  // ============================================================================
  // EMERGENCY CONTACTS
  // ============================================================================

  async addEmergencyContact(data) {
    try {
      const response = await apiService.post(`${this.baseURL}/emergency-contacts`, data);
      return {
        success: true,
        data: response.data,
        message: 'Emergency contact added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async getEmergencyContacts() {
    try {
      const response = await apiService.get(`${this.baseURL}/emergency-contacts`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  async removeEmergencyContact(contactId) {
    try {
      const response = await apiService.delete(`${this.baseURL}/emergency-contacts/${contactId}`);
      return {
        success: true,
        data: response.data,
        message: 'Emergency contact removed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  // ============================================================================
  // SAFETY RESOURCES
  // ============================================================================

  async getSafetyResources() {
    try {
      const response = await apiService.get(`${this.baseURL}/resources`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async isUserBlocked(userId) {
    try {
      const blockedUsers = await this.getBlockedUsers();
      if (blockedUsers.success && blockedUsers.data) {
        return blockedUsers.data.some(block => block.blockedUserId === userId);
      }
      return false;
    } catch (error) {
      console.error('Failed to check if user is blocked:', error);
      return false;
    }
  }

  // Emergency check-in with location
  async emergencyCheckIn(location = null) {
    try {
      const data = {
        status: 'EMERGENCY',
        location,
        notes: 'Emergency check-in triggered by user',
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'mobile_app',
        },
      };

      const response = await this.createSafetyCheckIn(data);
      
      if (response.success) {
        // Also notify emergency contacts if available
        await this.notifyEmergencyContacts();
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // Notify emergency contacts (placeholder for future implementation)
  async notifyEmergencyContacts() {
    try {
      // This would integrate with SMS/email services
      console.log('Emergency contacts would be notified here');
      return { success: true };
    } catch (error) {
      console.error('Failed to notify emergency contacts:', error);
      return { success: false };
    }
  }

  // Get safety score based on user's safety setup
  async getSafetyScore() {
    try {
      const [verificationStatus, emergencyContacts] = await Promise.all([
        this.getVerificationStatus(),
        this.getEmergencyContacts(),
      ]);

      let score = 0;
      let maxScore = 100;

      // Verification status (40 points)
      if (verificationStatus.success && verificationStatus.data?.isVerified) {
        score += 40;
      }

      // Emergency contacts (30 points)
      if (emergencyContacts.success && emergencyContacts.data?.length > 0) {
        score += 30;
      }

      // Profile completeness (30 points) - would need to check profile
      // This is a placeholder
      score += 20; // Assume partial profile completion

      return {
        success: true,
        data: {
          score,
          maxScore,
          percentage: Math.round((score / maxScore) * 100),
          recommendations: this.getSafetyRecommendations(score),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  getSafetyRecommendations(score) {
    const recommendations = [];

    if (score < 40) {
      recommendations.push('Complete profile verification');
    }
    if (score < 70) {
      recommendations.push('Add emergency contacts');
    }
    if (score < 90) {
      recommendations.push('Review safety settings');
    }

    return recommendations;
  }
}

export const safetyService = new SafetyService();
