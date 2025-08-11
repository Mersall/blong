/**
 * BLONG Personality Assessment Service
 * Handles assessment logic, scoring, and data management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASSESSMENT_SECTIONS, PERSONALITY_DIMENSIONS } from '../data/personalityQuestions';

// Storage keys
const STORAGE_KEYS = {
  ASSESSMENT_PROGRESS: '@blong_assessment_progress',
  ASSESSMENT_RESULTS: '@blong_assessment_results',
  CURRENT_SECTION: '@blong_current_section',
  CURRENT_QUESTION: '@blong_current_question',
};

/**
 * Assessment Progress Manager
 */
export class AssessmentProgress {
  constructor() {
    this.currentSection = 0;
    this.currentQuestion = 0;
    this.answers = {};
    this.startTime = null;
    this.sectionStartTimes = {};
    this.isComplete = false;
  }

  // Save progress to storage
  async save() {
    try {
      const progressData = {
        currentSection: this.currentSection,
        currentQuestion: this.currentQuestion,
        answers: this.answers,
        startTime: this.startTime,
        sectionStartTimes: this.sectionStartTimes,
        isComplete: this.isComplete,
        lastSaved: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.ASSESSMENT_PROGRESS,
        JSON.stringify(progressData)
      );
    } catch (error) {
      console.error('Failed to save assessment progress:', error);
    }
  }

  // Load progress from storage
  async load() {
    try {
      const progressData = await AsyncStorage.getItem(STORAGE_KEYS.ASSESSMENT_PROGRESS);
      if (progressData) {
        const parsed = JSON.parse(progressData);
        this.currentSection = parsed.currentSection || 0;
        this.currentQuestion = parsed.currentQuestion || 0;
        this.answers = parsed.answers || {};
        this.startTime = parsed.startTime;
        this.sectionStartTimes = parsed.sectionStartTimes || {};
        this.isComplete = parsed.isComplete || false;
        return true;
      }
    } catch (error) {
      console.error('Failed to load assessment progress:', error);
    }
    return false;
  }

  // Clear progress
  async clear() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ASSESSMENT_PROGRESS,
        STORAGE_KEYS.CURRENT_SECTION,
        STORAGE_KEYS.CURRENT_QUESTION,
      ]);
      
      // Reset instance
      this.currentSection = 0;
      this.currentQuestion = 0;
      this.answers = {};
      this.startTime = null;
      this.sectionStartTimes = {};
      this.isComplete = false;
    } catch (error) {
      console.error('Failed to clear assessment progress:', error);
    }
  }

  // Get current progress percentage
  getProgressPercentage() {
    const totalQuestions = ASSESSMENT_SECTIONS.reduce(
      (total, section) => total + section.questions.length,
      0
    );
    const answeredQuestions = Object.keys(this.answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  // Get current section progress
  getCurrentSectionProgress() {
    if (this.currentSection >= ASSESSMENT_SECTIONS.length) {
      return { current: 0, total: 0, percentage: 100 };
    }

    const section = ASSESSMENT_SECTIONS[this.currentSection];
    const sectionAnswers = section.questions.filter(q => this.answers[q.id]);
    
    return {
      current: sectionAnswers.length,
      total: section.questions.length,
      percentage: Math.round((sectionAnswers.length / section.questions.length) * 100),
    };
  }

  // Check if current section is complete
  isCurrentSectionComplete() {
    if (this.currentSection >= ASSESSMENT_SECTIONS.length) {
      return true;
    }

    const section = ASSESSMENT_SECTIONS[this.currentSection];
    return section.questions.every(q => this.answers[q.id] !== undefined);
  }

  // Move to next question/section
  moveNext() {
    const currentSection = ASSESSMENT_SECTIONS[this.currentSection];
    
    if (this.currentQuestion < currentSection.questions.length - 1) {
      // Move to next question in current section
      this.currentQuestion++;
    } else if (this.currentSection < ASSESSMENT_SECTIONS.length - 1) {
      // Move to next section
      this.currentSection++;
      this.currentQuestion = 0;
      this.sectionStartTimes[this.currentSection] = new Date().toISOString();
    } else {
      // Assessment complete
      this.isComplete = true;
    }
  }

  // Move to previous question/section
  movePrevious() {
    if (this.currentQuestion > 0) {
      // Move to previous question in current section
      this.currentQuestion--;
    } else if (this.currentSection > 0) {
      // Move to previous section
      this.currentSection--;
      const prevSection = ASSESSMENT_SECTIONS[this.currentSection];
      this.currentQuestion = prevSection.questions.length - 1;
    }
  }

  // Get current question
  getCurrentQuestion() {
    if (this.currentSection >= ASSESSMENT_SECTIONS.length) {
      return null;
    }

    const section = ASSESSMENT_SECTIONS[this.currentSection];
    if (this.currentQuestion >= section.questions.length) {
      return null;
    }

    return {
      section: section,
      question: section.questions[this.currentQuestion],
      sectionIndex: this.currentSection,
      questionIndex: this.currentQuestion,
    };
  }

  // Save answer
  saveAnswer(questionId, answer) {
    this.answers[questionId] = {
      value: answer,
      timestamp: new Date().toISOString(),
    };
  }

  // Get answer
  getAnswer(questionId) {
    return this.answers[questionId]?.value;
  }
}

/**
 * Personality Scoring Engine
 */
export class PersonalityScorer {
  constructor(answers) {
    this.answers = answers;
    this.scores = {};
  }

  // Calculate scores for all dimensions
  calculateScores() {
    // Initialize scores
    Object.values(PERSONALITY_DIMENSIONS).forEach(dimension => {
      this.scores[dimension] = {
        raw: 0,
        count: 0,
        average: 0,
        percentile: 0,
      };
    });

    // Calculate raw scores
    ASSESSMENT_SECTIONS.forEach(section => {
      section.questions.forEach(question => {
        const answer = this.answers[question.id];
        if (answer) {
          const score = this.scores[question.dimension];
          let value = answer.value;

          // Handle reverse scoring
          if (question.reverse && question.type === 'likert_5') {
            value = 6 - value; // Reverse 1-5 scale
          }

          // Handle different question types
          switch (question.type) {
            case 'likert_5':
            case 'likert_7':
              score.raw += value;
              score.count++;
              break;
            case 'multiple_choice':
              score.raw += value;
              score.count++;
              break;
            case 'slider':
              score.raw += value / 20; // Convert 0-100 to 0-5 scale
              score.count++;
              break;
            case 'ranking':
              // Handle ranking differently - lower rank = higher score
              const rankValue = 6 - value; // Convert rank to score
              score.raw += rankValue;
              score.count++;
              break;
          }
        }
      });
    });

    // Calculate averages and percentiles
    Object.keys(this.scores).forEach(dimension => {
      const score = this.scores[dimension];
      if (score.count > 0) {
        score.average = score.raw / score.count;
        score.percentile = this.calculatePercentile(dimension, score.average);
      }
    });

    return this.scores;
  }

  // Calculate percentile based on normative data (simplified)
  calculatePercentile(dimension, average) {
    // This is a simplified percentile calculation
    // In production, you'd use actual normative data
    const normalized = Math.max(0, Math.min(5, average));
    return Math.round((normalized / 5) * 100);
  }

  // Get personality profile
  getPersonalityProfile() {
    const scores = this.calculateScores();
    
    return {
      bigFive: {
        openness: scores[PERSONALITY_DIMENSIONS.OPENNESS],
        conscientiousness: scores[PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS],
        extraversion: scores[PERSONALITY_DIMENSIONS.EXTRAVERSION],
        agreeableness: scores[PERSONALITY_DIMENSIONS.AGREEABLENESS],
        neuroticism: scores[PERSONALITY_DIMENSIONS.NEUROTICISM],
      },
      matrimonial: {
        familyOrientation: scores[PERSONALITY_DIMENSIONS.FAMILY_ORIENTATION],
        communicationStyle: scores[PERSONALITY_DIMENSIONS.COMMUNICATION_STYLE],
        conflictResolution: scores[PERSONALITY_DIMENSIONS.CONFLICT_RESOLUTION],
        emotionalIntelligence: scores[PERSONALITY_DIMENSIONS.EMOTIONAL_INTELLIGENCE],
        lifeGoals: scores[PERSONALITY_DIMENSIONS.LIFE_GOALS],
        religiousSpirituality: scores[PERSONALITY_DIMENSIONS.RELIGIOUS_SPIRITUALITY],
        financialValues: scores[PERSONALITY_DIMENSIONS.FINANCIAL_VALUES],
        socialPreferences: scores[PERSONALITY_DIMENSIONS.SOCIAL_PREFERENCES],
      },
      completedAt: new Date().toISOString(),
      version: '1.0',
    };
  }
}

/**
 * Main Assessment Service
 */
export const assessmentService = {
  // Create new assessment progress
  createProgress() {
    const progress = new AssessmentProgress();
    progress.startTime = new Date().toISOString();
    progress.sectionStartTimes[0] = progress.startTime;
    return progress;
  },

  // Load existing progress
  async loadProgress() {
    const progress = new AssessmentProgress();
    const loaded = await progress.load();
    return loaded ? progress : null;
  },

  // Calculate personality scores
  calculatePersonality(answers) {
    const scorer = new PersonalityScorer(answers);
    return scorer.getPersonalityProfile();
  },

  // Save assessment results
  async saveResults(results) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ASSESSMENT_RESULTS,
        JSON.stringify(results)
      );
    } catch (error) {
      console.error('Failed to save assessment results:', error);
    }
  },

  // Load assessment results
  async loadResults() {
    try {
      const results = await AsyncStorage.getItem(STORAGE_KEYS.ASSESSMENT_RESULTS);
      return results ? JSON.parse(results) : null;
    } catch (error) {
      console.error('Failed to load assessment results:', error);
      return null;
    }
  },

  // Check if user has completed assessment
  async hasCompletedAssessment() {
    const results = await this.loadResults();
    return results !== null;
  },

  // Clear all assessment data
  async clearAssessmentData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ASSESSMENT_PROGRESS,
        STORAGE_KEYS.ASSESSMENT_RESULTS,
        STORAGE_KEYS.CURRENT_SECTION,
        STORAGE_KEYS.CURRENT_QUESTION,
      ]);
    } catch (error) {
      console.error('Failed to clear assessment data:', error);
    }
  },
};

export default assessmentService;
