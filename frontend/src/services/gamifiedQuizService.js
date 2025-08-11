/**
 * BLONG Gamified Quiz Service
 * Enhanced quiz service with session management and analytics
 */

import { apiClient } from './api';

class GamifiedQuizService {
  constructor() {
    this.baseURL = '/quiz';
  }

  /**
   * Start a new quiz session
   * @param {string} categoryId - Optional category ID for specific quiz type
   * @returns {Promise<Object>} Session data with first question
   */
  async startQuizSession(categoryId = null) {
    try {
      const response = await apiClient.post(`${this.baseURL}/session/start`, {
        categoryId,
      });

      return response.data;
    } catch (error) {
      console.error('Error starting quiz session:', error);
      throw new Error('Failed to start quiz session');
    }
  }

  /**
   * Resume an existing quiz session
   * @param {string} sessionToken - Session token to resume
   * @returns {Promise<Object>} Session data with next question
   */
  async resumeQuizSession(sessionToken) {
    try {
      const response = await apiClient.get(`${this.baseURL}/session/${sessionToken}`);
      return response.data;
    } catch (error) {
      console.error('Error resuming quiz session:', error);
      throw new Error('Failed to resume quiz session');
    }
  }

  /**
   * Answer a question in a session
   * @param {string} sessionToken - Session token
   * @param {string} questionId - Question ID
   * @param {string} selectedOptionId - Selected option ID
   * @param {number} timeSpent - Time spent on question in seconds
   * @returns {Promise<Object>} Updated session with next question and achievements
   */
  async answerQuestionInSession(sessionToken, questionId, selectedOptionId, timeSpent = 0) {
    try {
      const response = await apiClient.post(`${this.baseURL}/session/${sessionToken}/answer`, {
        questionId,
        selectedOptionId,
        timeSpent,
      });

      return response.data;
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to submit answer');
    }
  }

  /**
   * Get comprehensive personality analytics
   * @returns {Promise<Object>} Complete personality analytics with insights
   */
  async getPersonalityAnalytics() {
    try {
      const response = await apiClient.get(`${this.baseURL}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personality analytics:', error);
      throw new Error('Failed to fetch personality analytics');
    }
  }

  /**
   * Get quiz categories with progress tracking
   * @returns {Promise<Array>} Quiz categories with user progress
   */
  async getQuizCategoriesWithProgress() {
    try {
      const [categoriesResponse, progressResponse] = await Promise.all([
        apiClient.get(`${this.baseURL}/categories`),
        apiClient.get(`${this.baseURL}/progress`),
      ]);

      const categories = categoriesResponse.data;
      const progress = progressResponse.data;

      // Merge progress data with categories
      return categories.map(category => {
        const categoryProgress = progress.categories.find(
          p => p.categoryKey === category.type
        );
        
        return {
          ...category,
          progress: categoryProgress || {
            totalQuestions: category.questions?.length || 0,
            answeredQuestions: 0,
            progressPercentage: 0,
            isComplete: false,
          },
        };
      });
    } catch (error) {
      console.error('Error fetching quiz categories with progress:', error);
      throw new Error('Failed to fetch quiz categories');
    }
  }

  /**
   * Get user's personality profile with insights
   * @returns {Promise<Object>} Personality profile with detailed insights
   */
  async getPersonalityProfile() {
    try {
      const response = await apiClient.get(`${this.baseURL}/personality-profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personality profile:', error);
      throw new Error('Failed to fetch personality profile');
    }
  }

  /**
   * Calculate personality profile (after quiz completion)
   * @returns {Promise<Object>} Calculated personality profile
   */
  async calculatePersonalityProfile() {
    try {
      const response = await apiClient.post(`${this.baseURL}/calculate-profile`);
      return response.data;
    } catch (error) {
      console.error('Error calculating personality profile:', error);
      throw new Error('Failed to calculate personality profile');
    }
  }

  /**
   * Get detailed quiz progress
   * @returns {Promise<Object>} Detailed progress across all categories
   */
  async getQuizProgress() {
    try {
      const response = await apiClient.get(`${this.baseURL}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz progress:', error);
      throw new Error('Failed to fetch quiz progress');
    }
  }

  /**
   * Save quiz session data locally (for offline support)
   * @param {Object} sessionData - Session data to save
   */
  saveSessionLocally(sessionData) {
    try {
      const savedSessions = this.getSavedSessions();
      savedSessions[sessionData.sessionToken] = {
        ...sessionData,
        lastSaved: new Date().toISOString(),
      };
      
      localStorage.setItem('blongQuizSessions', JSON.stringify(savedSessions));
    } catch (error) {
      console.error('Error saving session locally:', error);
    }
  }

  /**
   * Get saved quiz sessions from local storage
   * @returns {Object} Saved sessions object
   */
  getSavedSessions() {
    try {
      const saved = localStorage.getItem('blongQuizSessions');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error getting saved sessions:', error);
      return {};
    }
  }

  /**
   * Clear saved session data
   * @param {string} sessionToken - Optional session token to clear specific session
   */
  clearSavedSessions(sessionToken = null) {
    try {
      if (sessionToken) {
        const savedSessions = this.getSavedSessions();
        delete savedSessions[sessionToken];
        localStorage.setItem('blongQuizSessions', JSON.stringify(savedSessions));
      } else {
        localStorage.removeItem('blongQuizSessions');
      }
    } catch (error) {
      console.error('Error clearing saved sessions:', error);
    }
  }

  /**
   * Check if user has incomplete quiz sessions
   * @returns {Array} Array of incomplete sessions
   */
  getIncompleteSessions() {
    const savedSessions = this.getSavedSessions();
    return Object.values(savedSessions).filter(
      session => session.status === 'IN_PROGRESS'
    );
  }

  /**
   * Get quiz insights based on user responses
   * @param {Array} responses - User quiz responses
   * @returns {Object} Generated insights
   */
  generateQuizInsights(responses) {
    const insights = {
      totalResponses: responses.length,
      averageResponseTime: 0,
      consistencyScore: 0,
      categories: {},
      patterns: [],
    };

    // Calculate average response time
    const responseTimes = responses.map(r => r.timeSpent || 0);
    insights.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    // Analyze consistency (variance in response times)
    const variance = responseTimes.reduce((acc, time) => {
      return acc + Math.pow(time - insights.averageResponseTime, 2);
    }, 0) / responseTimes.length;
    
    insights.consistencyScore = Math.max(0, 100 - (variance / 10));

    // Group by categories
    responses.forEach(response => {
      const category = response.question?.category?.type;
      if (category) {
        if (!insights.categories[category]) {
          insights.categories[category] = {
            count: 0,
            averageTime: 0,
            scores: [],
          };
        }
        
        insights.categories[category].count++;
        insights.categories[category].scores.push(response.selectedOption?.value || 0);
      }
    });

    // Calculate category averages
    Object.keys(insights.categories).forEach(category => {
      const categoryData = insights.categories[category];
      const times = responses
        .filter(r => r.question?.category?.type === category)
        .map(r => r.timeSpent || 0);
      
      categoryData.averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    });

    // Identify patterns
    if (insights.averageResponseTime < 15) {
      insights.patterns.push('Quick Decision Maker');
    } else if (insights.averageResponseTime > 45) {
      insights.patterns.push('Thoughtful Responder');
    }

    if (insights.consistencyScore > 80) {
      insights.patterns.push('Consistent Response Pattern');
    }

    return insights;
  }

  /**
   * Get achievement progress
   * @param {Object} userProfile - User's personality profile
   * @param {Array} sessions - User's quiz sessions
   * @returns {Object} Achievement progress data
   */
  getAchievementProgress(userProfile, sessions) {
    const achievements = {
      unlocked: [],
      available: [],
      progress: {},
    };

    // Define available achievements
    const availableAchievements = [
      {
        id: 'first_quiz',
        title: 'First Steps',
        description: 'Complete your first personality quiz',
        icon: '🌟',
        condition: (profile, sessions) => sessions.some(s => s.status === 'COMPLETED'),
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete a quiz in under 5 minutes',
        icon: '⚡',
        condition: (profile, sessions) => sessions.some(s => s.timeSpent < 300),
      },
      {
        id: 'thorough_explorer',
        title: 'Thorough Explorer',
        description: 'Complete all quiz categories',
        icon: '🎯',
        condition: (profile, sessions) => {
          const completedCategories = new Set(
            sessions.filter(s => s.status === 'COMPLETED').map(s => s.categoryId)
          );
          return completedCategories.size >= 4; // Assuming 4 categories
        },
      },
      {
        id: 'consistent_performer',
        title: 'Consistent Performer',
        description: 'Maintain consistent response times',
        icon: '📊',
        condition: (profile, sessions) => {
          // Calculate based on response consistency
          return true; // Placeholder logic
        },
      },
    ];

    // Check which achievements are unlocked
    availableAchievements.forEach(achievement => {
      if (achievement.condition(userProfile, sessions)) {
        achievements.unlocked.push(achievement);
      } else {
        achievements.available.push(achievement);
      }
    });

    return achievements;
  }
}

// Create singleton instance
const gamifiedQuizService = new GamifiedQuizService();

export default gamifiedQuizService;