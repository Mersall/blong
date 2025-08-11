/**
 * BLONG Quiz Service
 * Handles personality-based quiz API interactions
 */

import { apiClient } from './api';

class QuizService {
  /**
   * Get all quiz categories with questions
   */
  async getQuizCategories() {
    try {
      const response = await apiClient.get('/quiz/categories');
      return response;
    } catch (error) {
      console.error('❌ Error fetching quiz categories:', error);
      throw error;
    }
  }

  /**
   * Get quiz questions by category
   */
  async getQuizQuestionsByCategory(categoryKey) {
    try {
      const response = await apiClient.get(`/quiz/category/${categoryKey}`);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching quiz questions for ${categoryKey}:`, error);
      throw error;
    }
  }

  /**
   * Get quiz by ID (returns quiz metadata)
   */
  async getQuizById(quizId) {
    try {
      // Updated quiz metadata with actual backend categories
      const quizzes = [
        {
          id: 'core_values',
          title: 'Core Values Assessment',
          subtitle: 'Identify your fundamental values and life priorities',
          category: 'values',
          icon: '💎',
          color: '#9C27B0',
          duration: '20-25 min',
          questions: 25,
          difficulty: 'Medium',
          description: 'Discover what truly matters to you and how your values shape your decisions and relationships.',
          tags: ['values', 'priorities', 'life goals'],
        },
        {
          id: 'communication_style',
          title: 'Communication Style',
          subtitle: 'Understand your communication patterns',
          category: 'communication',
          icon: '💬',
          color: '#E91E63',
          duration: '15-20 min',
          questions: 20,
          difficulty: 'Easy',
          description: 'Learn about your communication preferences and how you interact with others in relationships.',
          tags: ['communication', 'relationships', 'interaction'],
        },
        {
          id: 'lifestyle_compatibility',
          title: 'Lifestyle Preferences',
          subtitle: 'Share your lifestyle and activity interests',
          category: 'lifestyle',
          icon: '🌟',
          color: '#FF5722',
          duration: '15-20 min',
          questions: 20,
          difficulty: 'Easy',
          description: 'Explore your lifestyle preferences and find compatibility with potential partners.',
          tags: ['lifestyle', 'activities', 'compatibility'],
        },
        {
          id: 'emotional_intelligence',
          title: 'Emotional Intelligence',
          subtitle: 'Assess your emotional awareness and management',
          category: 'emotional',
          icon: '🧠',
          color: '#4CAF50',
          duration: '15-20 min',
          questions: 20,
          difficulty: 'Medium',
          description: 'Understand your ability to recognize, understand, and manage emotions in yourself and others.',
          tags: ['emotions', 'intelligence', 'relationships'],
        },
        // Legacy quiz IDs for backward compatibility
        {
          id: 'big_five_personality',
          title: 'Core Values Assessment',
          subtitle: 'Identify your fundamental values and life priorities',
          category: 'values',
          icon: '💎',
          color: '#9C27B0',
          duration: '20-25 min',
          questions: 25,
          difficulty: 'Medium',
          description: 'Discover what truly matters to you and how your values shape your decisions and relationships.',
          tags: ['values', 'priorities', 'life goals'],
        },
        {
          id: 'love_languages',
          title: 'Communication Style',
          subtitle: 'Understand your communication patterns',
          category: 'communication',
          icon: '💬',
          color: '#E91E63',
          duration: '15-20 min',
          questions: 20,
          difficulty: 'Easy',
          description: 'Learn about your communication preferences and how you interact with others in relationships.',
          tags: ['communication', 'relationships', 'interaction'],
        },
        {
          id: 'attachment_style',
          title: 'Emotional Intelligence',
          subtitle: 'Assess your emotional awareness and management',
          category: 'emotional',
          icon: '🧠',
          color: '#4CAF50',
          duration: '15-20 min',
          questions: 20,
          difficulty: 'Medium',
          description: 'Understand your ability to recognize, understand, and manage emotions in yourself and others.',
          tags: ['emotions', 'intelligence', 'relationships'],
        },
      ];

      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) {
        throw new Error(`Quiz not found: ${quizId}`);
      }

      return quiz;
    } catch (error) {
      console.error(`❌ Error fetching quiz by ID ${quizId}:`, error);
      throw error;
    }
  }

  /**
   * Get quiz questions by quiz ID (maps to category)
   */
  async getQuizQuestions(quizId) {
    try {
      // Map quiz IDs to category keys (updated with actual backend categories)
      const categoryMap = {
        'core_values': 'core_values',
        'communication_style': 'communication_style',
        'lifestyle_compatibility': 'lifestyle_compatibility',
        'emotional_intelligence': 'emotional_intelligence',
        // Legacy mappings for backward compatibility
        'big_five_personality': 'core_values', // fallback to core values
        'love_languages': 'communication_style', // fallback to communication
        'attachment_style': 'emotional_intelligence', // fallback to emotional intelligence
        'personality': 'core_values', // fallback
      };

      const categoryKey = categoryMap[quizId];

      if (!categoryKey) {
        throw new Error(`Quiz category not available: ${quizId}. Available quizzes: ${Object.keys(categoryMap).join(', ')}`);
      }

      const response = await apiClient.get(`/quiz/category/${categoryKey}`);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching quiz questions for quiz ${quizId}:`, error);
      throw error;
    }
  }

  /**
   * Save quiz response
   */
  async saveQuizResponse(questionId, selectedOptionId) {
    try {
      const response = await apiClient.post('/quiz/response', {
        questionId,
        selectedOptionId,
      });
      return response;
    } catch (error) {
      console.error('❌ Error saving quiz response:', error);
      throw error;
    }
  }

  /**
   * Get user's quiz responses
   */
  async getUserQuizResponses() {
    try {
      const response = await apiClient.get('/quiz/responses');
      return response;
    } catch (error) {
      console.error('❌ Error fetching user quiz responses:', error);
      throw error;
    }
  }

  /**
   * Calculate personality profile
   */
  async calculatePersonalityProfile() {
    try {
      const response = await apiClient.post('/quiz/calculate-profile');
      return response;
    } catch (error) {
      console.error('❌ Error calculating personality profile:', error);
      throw error;
    }
  }

  /**
   * Get user's personality profile
   */
  async getUserPersonalityProfile() {
    try {
      const response = await apiClient.get('/quiz/personality-profile');
      return response;
    } catch (error) {
      console.error('❌ Error fetching personality profile:', error);
      throw error;
    }
  }

  /**
   * Get quiz progress
   */
  async getQuizProgress() {
    try {
      const response = await apiClient.get('/quiz/progress');
      return response;
    } catch (error) {
      console.error('❌ Error fetching quiz progress:', error);
      throw error;
    }
  }

  /**
   * Get personality insights based on Big Five scores
   */
  getPersonalityInsights(personalityProfile) {
    const insights = {};

    // Big Five Insights
    if (personalityProfile.opennessScore !== null) {
      insights.openness = this.getOpennessInsight(personalityProfile.opennessScore);
    }
    if (personalityProfile.conscientiousnessScore !== null) {
      insights.conscientiousness = this.getConscientiousnessInsight(personalityProfile.conscientiousnessScore);
    }
    if (personalityProfile.extraversionScore !== null) {
      insights.extraversion = this.getExtraversionInsight(personalityProfile.extraversionScore);
    }
    if (personalityProfile.agreeablenessScore !== null) {
      insights.agreeableness = this.getAgreeablenessInsight(personalityProfile.agreeablenessScore);
    }
    if (personalityProfile.neuroticismScore !== null) {
      insights.neuroticism = this.getNeuroticismInsight(personalityProfile.neuroticismScore);
    }

    // Love Language Insights
    if (personalityProfile.primaryLoveLanguage) {
      insights.loveLanguage = this.getLoveLanguageInsight(personalityProfile.primaryLoveLanguage);
    }

    // Attachment Style Insights
    if (personalityProfile.attachmentStyle) {
      insights.attachmentStyle = this.getAttachmentStyleInsight(personalityProfile.attachmentStyle);
    }

    return insights;
  }

  getOpennessInsight(score) {
    if (score >= 70) {
      return {
        level: 'High',
        description: 'You love exploring new ideas, experiences, and creative pursuits.',
        traits: ['Creative', 'Curious', 'Adventurous', 'Open-minded'],
        compatibility: 'You connect well with partners who appreciate intellectual discussions and new experiences.',
      };
    } else if (score >= 30) {
      return {
        level: 'Moderate',
        description: 'You balance openness to new experiences with appreciation for familiar routines.',
        traits: ['Balanced', 'Selective', 'Practical', 'Thoughtful'],
        compatibility: 'You work well with both adventurous and traditional partners.',
      };
    } else {
      return {
        level: 'Low',
        description: 'You prefer familiar experiences and established routines.',
        traits: ['Traditional', 'Practical', 'Consistent', 'Reliable'],
        compatibility: 'You connect best with partners who value stability and shared traditions.',
      };
    }
  }

  getConscientiousnessInsight(score) {
    if (score >= 70) {
      return {
        level: 'High',
        description: 'You are highly organized, disciplined, and goal-oriented.',
        traits: ['Organized', 'Disciplined', 'Reliable', 'Goal-oriented'],
        compatibility: 'You work best with partners who appreciate structure and planning.',
      };
    } else if (score >= 30) {
      return {
        level: 'Moderate',
        description: 'You balance organization with flexibility and spontaneity.',
        traits: ['Flexible', 'Adaptable', 'Balanced', 'Practical'],
        compatibility: 'You can adapt to both structured and spontaneous partners.',
      };
    } else {
      return {
        level: 'Low',
        description: 'You prefer flexibility and spontaneity over rigid planning.',
        traits: ['Spontaneous', 'Flexible', 'Easy-going', 'Adaptable'],
        compatibility: 'You connect well with partners who enjoy spontaneous adventures.',
      };
    }
  }

  getExtraversionInsight(score) {
    if (score >= 70) {
      return {
        level: 'High',
        description: 'You are energetic, outgoing, and thrive in social situations.',
        traits: ['Outgoing', 'Energetic', 'Social', 'Enthusiastic'],
        compatibility: 'You enjoy partners who can match your social energy or provide grounding.',
      };
    } else if (score >= 30) {
      return {
        level: 'Moderate',
        description: 'You enjoy both social activities and quiet time alone.',
        traits: ['Balanced', 'Adaptable', 'Selective', 'Versatile'],
        compatibility: 'You work well with both introverted and extraverted partners.',
      };
    } else {
      return {
        level: 'Low',
        description: 'You prefer quiet, intimate settings and deep one-on-one connections.',
        traits: ['Introspective', 'Thoughtful', 'Deep', 'Intimate'],
        compatibility: 'You connect best with partners who appreciate meaningful conversations.',
      };
    }
  }

  getAgreeablenessInsight(score) {
    if (score >= 70) {
      return {
        level: 'High',
        description: 'You are compassionate, cooperative, and prioritize harmony.',
        traits: ['Compassionate', 'Cooperative', 'Empathetic', 'Supportive'],
        compatibility: 'You work well with partners who appreciate kindness and emotional support.',
      };
    } else if (score >= 30) {
      return {
        level: 'Moderate',
        description: 'You balance compassion with healthy assertiveness.',
        traits: ['Balanced', 'Fair', 'Honest', 'Direct'],
        compatibility: 'You can work with both gentle and assertive partners.',
      };
    } else {
      return {
        level: 'Low',
        description: 'You are direct, competitive, and value honesty over harmony.',
        traits: ['Direct', 'Honest', 'Independent', 'Competitive'],
        compatibility: 'You connect with partners who appreciate directness and independence.',
      };
    }
  }

  getNeuroticismInsight(score) {
    if (score >= 70) {
      return {
        level: 'High',
        description: 'You are emotionally sensitive and may experience stress more intensely.',
        traits: ['Sensitive', 'Emotional', 'Passionate', 'Intuitive'],
        compatibility: 'You benefit from partners who provide emotional stability and understanding.',
      };
    } else if (score >= 30) {
      return {
        level: 'Moderate',
        description: 'You experience normal emotional ups and downs.',
        traits: ['Balanced', 'Resilient', 'Adaptable', 'Stable'],
        compatibility: 'You work well with partners across different emotional styles.',
      };
    } else {
      return {
        level: 'Low',
        description: 'You are emotionally stable and handle stress well.',
        traits: ['Calm', 'Stable', 'Resilient', 'Confident'],
        compatibility: 'You can provide emotional stability for more sensitive partners.',
      };
    }
  }

  getLoveLanguageInsight(loveLanguage) {
    const insights = {
      words: {
        name: 'Words of Affirmation',
        description: 'You feel most loved through verbal appreciation and encouragement.',
        tips: 'Express your feelings verbally and appreciate when your partner does the same.',
      },
      service: {
        name: 'Acts of Service',
        description: 'You feel most loved when your partner does helpful things for you.',
        tips: 'Show love through actions and appreciate when your partner helps you.',
      },
      gifts: {
        name: 'Receiving Gifts',
        description: 'You feel most loved through thoughtful gifts and tokens of affection.',
        tips: 'Thoughtful gestures and meaningful gifts speak to your heart.',
      },
      time: {
        name: 'Quality Time',
        description: 'You feel most loved through undivided attention and meaningful time together.',
        tips: 'Prioritize focused time together without distractions.',
      },
      touch: {
        name: 'Physical Touch',
        description: 'You feel most loved through physical affection and closeness.',
        tips: 'Physical connection and affectionate touch are important to you.',
      },
    };

    return insights[loveLanguage] || null;
  }

  getAttachmentStyleInsight(attachmentStyle) {
    const insights = {
      secure: {
        name: 'Secure Attachment',
        description: 'You are comfortable with intimacy and independence in relationships.',
        strengths: ['Trusting', 'Communicative', 'Emotionally available', 'Supportive'],
        tips: 'You create healthy, balanced relationships and can help partners feel secure.',
      },
      anxious: {
        name: 'Anxious Attachment',
        description: 'You seek closeness but may worry about your partner\'s feelings.',
        strengths: ['Caring', 'Attentive', 'Emotionally expressive', 'Committed'],
        tips: 'Open communication about your needs can help build security in relationships.',
      },
      avoidant: {
        name: 'Avoidant Attachment',
        description: 'You value independence and may find too much closeness uncomfortable.',
        strengths: ['Independent', 'Self-reliant', 'Calm under pressure', 'Logical'],
        tips: 'Gradually building intimacy and expressing emotions can strengthen relationships.',
      },
    };

    return insights[attachmentStyle] || null;
  }
}

export default new QuizService();
