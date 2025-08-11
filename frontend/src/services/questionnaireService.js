/**
 * BLONG Questionnaire Service
 * Manages questionnaire data and phase-specific content
 */

// Sample questionnaire data for each phase
export const QUESTIONNAIRE_DATA = {
  single: {
    id: 'single_questionnaire',
    title: 'Dating Profile Setup',
    description: 'Help us understand what you\'re looking for in a partner',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What type of relationship are you looking for?',
        options: [
          { id: 'serious', text: 'Serious long-term relationship' },
          { id: 'casual', text: 'Casual dating' },
          { id: 'marriage', text: 'Marriage-minded' },
          { id: 'friendship', text: 'Friendship first' }
        ],
        required: true
      },
      {
        id: 'q2',
        type: 'text',
        question: 'Describe your ideal first date',
        placeholder: 'e.g., Coffee and conversation, outdoor adventure...',
        required: true
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'What\'s most important to you in a partner?',
        options: [
          { id: 'humor', text: 'Sense of humor' },
          { id: 'intelligence', text: 'Intelligence' },
          { id: 'kindness', text: 'Kindness' },
          { id: 'ambition', text: 'Ambition' },
          { id: 'values', text: 'Shared values' }
        ],
        required: true
      }
    ]
  },
  
  preparing: {
    id: 'preparing_questionnaire',
    title: 'Relationship Goals Assessment',
    description: 'Let\'s explore your relationship aspirations and readiness',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'How would you describe your current relationship status?',
        options: [
          { id: 'exclusive', text: 'In an exclusive relationship' },
          { id: 'dating_seriously', text: 'Dating someone seriously' },
          { id: 'considering_commitment', text: 'Considering commitment' },
          { id: 'preparing_engagement', text: 'Preparing for engagement' }
        ],
        required: true
      },
      {
        id: 'q2',
        type: 'text',
        question: 'What are your main relationship goals for the next year?',
        placeholder: 'e.g., Moving in together, meeting family...',
        required: true
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'What aspect of your relationship would you like to strengthen?',
        options: [
          { id: 'communication', text: 'Communication' },
          { id: 'trust', text: 'Trust and intimacy' },
          { id: 'future_planning', text: 'Future planning' },
          { id: 'conflict_resolution', text: 'Conflict resolution' },
          { id: 'romance', text: 'Romance and connection' }
        ],
        required: true
      }
    ]
  },
  
  engagement: {
    id: 'engagement_questionnaire',
    title: 'Wedding Planning Preferences',
    description: 'Help us personalize your wedding planning experience',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What type of wedding are you planning?',
        options: [
          { id: 'intimate', text: 'Intimate (< 50 guests)' },
          { id: 'medium', text: 'Medium (50-150 guests)' },
          { id: 'large', text: 'Large (150+ guests)' },
          { id: 'destination', text: 'Destination wedding' }
        ],
        required: true
      },
      {
        id: 'q2',
        type: 'text',
        question: 'What\'s your estimated budget range?',
        placeholder: 'e.g., $10,000 - $30,000',
        required: true
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'What\'s your wedding planning priority?',
        options: [
          { id: 'venue', text: 'Perfect venue' },
          { id: 'photography', text: 'Amazing photography' },
          { id: 'food', text: 'Exceptional catering' },
          { id: 'entertainment', text: 'Great entertainment' },
          { id: 'decor', text: 'Beautiful decorations' }
        ],
        required: true
      }
    ]
  },
  
  engagement_day_prep: {
    id: 'engagement_day_prep_questionnaire',
    title: 'Engagement Day Preparation',
    description: 'Planning your perfect engagement day',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What type of engagement are you planning?',
        options: [
          { id: 'surprise', text: 'Surprise proposal' },
          { id: 'planned_together', text: 'Planned together' },
          { id: 'public', text: 'Public proposal' },
          { id: 'private', text: 'Private and intimate' }
        ],
        required: true
      },
      {
        id: 'q2',
        type: 'text',
        question: 'Describe your ideal engagement setting',
        placeholder: 'e.g., Beach sunset, restaurant, home...',
        required: true
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'What\'s most important for your engagement day?',
        options: [
          { id: 'location', text: 'Perfect location' },
          { id: 'photography', text: 'Capturing the moment' },
          { id: 'privacy', text: 'Privacy and intimacy' },
          { id: 'celebration', text: 'Celebration afterwards' },
          { id: 'surprise', text: 'Element of surprise' }
        ],
        required: true
      }
    ]
  }
};

/**
 * Questionnaire Service Class
 */
export class QuestionnaireService {
  constructor() {
    this.data = QUESTIONNAIRE_DATA;
  }

  /**
   * Get questionnaire for a specific phase
   */
  getQuestionnaireByPhase(phase) {
    return this.data[phase] || null;
  }

  /**
   * Get all available phases
   */
  getAvailablePhases() {
    return Object.keys(this.data);
  }

  /**
   * Validate questionnaire answers
   */
  validateAnswers(phase, answers) {
    const questionnaire = this.getQuestionnaireByPhase(phase);
    if (!questionnaire) {
      return { valid: false, errors: ['Invalid phase'] };
    }

    const errors = [];
    const requiredQuestions = questionnaire.questions.filter(q => q.required);

    requiredQuestions.forEach(question => {
      if (!answers[question.id] || answers[question.id].trim() === '') {
        errors.push(`Question "${question.question}" is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Submit questionnaire answers (placeholder for API integration)
   */
  async submitAnswers(phase, answers) {
    // This would integrate with the API service
    console.log(`Submitting ${phase} questionnaire answers:`, answers);
    
    const validation = this.validateAnswers(phase, answers);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      phase,
      answersCount: Object.keys(answers).length,
      submittedAt: new Date().toISOString()
    };
  }
}

// Export default instance
export const questionnaireService = new QuestionnaireService();
export default questionnaireService;