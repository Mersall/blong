/**
 * BLONG Date Delivery Service
 * Frontend service for date delivery system API calls
 */

import { apiService } from './apiService';

class DateDeliveryService {
  constructor() {
    this.baseUrl = '/date-delivery';
  }

  /**
   * Get user's delivered dates
   */
  async getUserDates(page = 1, limit = 10) {
    try {
      const response = await apiService.get(`${this.baseUrl}/dates`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user dates:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get specific date details
   */
  async getDateById(dateId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/dates/${dateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching date details:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Express interest in a date
   */
  async expressInterest(deliveredDateId, isInterested, response = '') {
    try {
      const result = await apiService.post(`${this.baseUrl}/dates/interest`, {
        deliveredDateId,
        isInterested,
        response
      });
      return result.data;
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Submit preferred time slots for scheduling
   */
  async submitSchedule(deliveredDateId, preferredDates, availability = {}) {
    try {
      const response = await apiService.post(`${this.baseUrl}/dates/schedule`, {
        deliveredDateId,
        preferredDates,
        availability
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting schedule:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create payment intent for date confirmation
   */
  async createPayment(deliveredDateId, amount, currency = 'USD') {
    try {
      const response = await apiService.post(`${this.baseUrl}/dates/payment`, {
        deliveredDateId,
        amount,
        currency
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Confirm payment status
   */
  async confirmPayment(deliveredDateId, status, paymentIntentId) {
    try {
      const response = await apiService.put(`${this.baseUrl}/dates/payment/confirm`, {
        deliveredDateId,
        status,
        paymentIntentId
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Process refund for cancelled date
   */
  async processRefund(dateId) {
    try {
      const response = await apiService.post(`${this.baseUrl}/dates/${dateId}/refund`);
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw this.handleError(error);
    }
  }

  // ==================== DATE EXPERIENCE ====================

  /**
   * Get date experience details
   */
  async getExperience(dateId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/dates/${dateId}/experience`);
      return response.data;
    } catch (error) {
      console.error('Error fetching experience:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check in to date location
   */
  async checkIn(dateId) {
    try {
      const response = await apiService.post(`${this.baseUrl}/dates/${dateId}/checkin`);
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update experience details
   */
  async updateExperience(deliveredDateId, updateData) {
    try {
      const response = await apiService.put(`${this.baseUrl}/dates/experience`, {
        deliveredDateId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get ice breaker questions
   */
  async getIceBreakers(dateId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/dates/${dateId}/icebreakers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ice breakers:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get date activities
   */
  async getActivities(dateId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/dates/${dateId}/activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Start conversation timer
   */
  async startConversationTimer(dateId) {
    try {
      const response = await apiService.post(`${this.baseUrl}/dates/${dateId}/timer`);
      return response.data;
    } catch (error) {
      console.error('Error starting timer:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Complete date experience
   */
  async completeExperience(dateId) {
    try {
      const response = await apiService.post(`${this.baseUrl}/dates/${dateId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing experience:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get experience statistics
   */
  async getExperienceStats(dateId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/dates/${dateId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw this.handleError(error);
    }
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Get user notifications
   */
  async getNotifications(page = 1, limit = 20) {
    try {
      const response = await apiService.get(`${this.baseUrl}/notifications`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId) {
    try {
      const response = await apiService.put(`${this.baseUrl}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead() {
    try {
      const response = await apiService.put(`${this.baseUrl}/notifications/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw this.handleError(error);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Handle API errors consistently
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Authentication required. Please log in again.');
        case 403:
          return new Error('Access denied. You don\'t have permission for this action.');
        case 404:
          return new Error('The requested resource was not found.');
        case 429:
          return new Error('Too many requests. Please try again later.');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(data?.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }

  /**
   * Format date for API calls
   */
  formatDateForAPI(date) {
    return date instanceof Date ? date.toISOString() : date;
  }

  /**
   * Parse date from API response
   */
  parseDateFromAPI(dateString) {
    return dateString ? new Date(dateString) : null;
  }
}

// Export singleton instance
export const dateDeliveryService = new DateDeliveryService();
export default dateDeliveryService;
