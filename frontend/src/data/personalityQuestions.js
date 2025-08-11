/**
 * BLONG Personality Assessment Questions
 * Based on Big Five personality model + matrimonial-specific traits
 */

// Question types
export const QUESTION_TYPES = {
  LIKERT_5: 'likert_5', // 1-5 scale (Strongly Disagree to Strongly Agree)
  LIKERT_7: 'likert_7', // 1-7 scale for more granular responses
  MULTIPLE_CHOICE: 'multiple_choice',
  RANKING: 'ranking',
  SLIDER: 'slider', // 0-100 slider
};

// Personality dimensions (Big Five + Matrimonial traits)
export const PERSONALITY_DIMENSIONS = {
  // Big Five
  OPENNESS: 'openness',
  CONSCIENTIOUSNESS: 'conscientiousness',
  EXTRAVERSION: 'extraversion',
  AGREEABLENESS: 'agreeableness',
  NEUROTICISM: 'neuroticism',
  
  // Matrimonial-specific
  FAMILY_ORIENTATION: 'family_orientation',
  COMMUNICATION_STYLE: 'communication_style',
  CONFLICT_RESOLUTION: 'conflict_resolution',
  EMOTIONAL_INTELLIGENCE: 'emotional_intelligence',
  LIFE_GOALS: 'life_goals',
  RELIGIOUS_SPIRITUALITY: 'religious_spirituality',
  FINANCIAL_VALUES: 'financial_values',
  SOCIAL_PREFERENCES: 'social_preferences',
};

// Assessment sections with questions
export const ASSESSMENT_SECTIONS = [
  {
    id: 'personality_core',
    titleKey: 'assessment.sections.personalityCore',
    descriptionKey: 'assessment.sections.personalityCoreDesc',
    icon: '🧠',
    estimatedTime: 8, // minutes
    questions: [
      // EXTRAVERSION
      {
        id: 'ext_1',
        textKey: 'assessment.questions.ext_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.EXTRAVERSION,
        reverse: false,
      },
      {
        id: 'ext_2',
        textKey: 'assessment.questions.ext_2',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.EXTRAVERSION,
        reverse: true, // Reverse scored
      },
      {
        id: 'ext_3',
        textKey: 'assessment.questions.ext_3',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.EXTRAVERSION,
        reverse: false,
      },
      
      // AGREEABLENESS
      {
        id: 'agr_1',
        textKey: 'assessment.questions.agr_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.AGREEABLENESS,
        reverse: false,
      },
      {
        id: 'agr_2',
        textKey: 'assessment.questions.agr_2',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.AGREEABLENESS,
        reverse: true,
      },
      {
        id: 'agr_3',
        textKey: 'assessment.questions.agr_3',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.AGREEABLENESS,
        reverse: false,
      },
      
      // CONSCIENTIOUSNESS
      {
        id: 'con_1',
        textKey: 'assessment.questions.con_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS,
        reverse: false,
      },
      {
        id: 'con_2',
        textKey: 'assessment.questions.con_2',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS,
        reverse: true,
      },
      {
        id: 'con_3',
        textKey: 'assessment.questions.con_3',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS,
        reverse: false,
      },
      
      // NEUROTICISM
      {
        id: 'neu_1',
        textKey: 'assessment.questions.neu_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.NEUROTICISM,
        reverse: false,
      },
      {
        id: 'neu_2',
        textKey: 'assessment.questions.neu_2',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.NEUROTICISM,
        reverse: true,
      },
      
      // OPENNESS
      {
        id: 'ope_1',
        textKey: 'assessment.questions.ope_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.OPENNESS,
        reverse: false,
      },
      {
        id: 'ope_2',
        textKey: 'assessment.questions.ope_2',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.OPENNESS,
        reverse: true,
      },
    ],
  },
  
  {
    id: 'relationship_values',
    titleKey: 'assessment.sections.relationshipValues',
    descriptionKey: 'assessment.sections.relationshipValuesDesc',
    icon: '💕',
    estimatedTime: 6,
    questions: [
      // FAMILY ORIENTATION
      {
        id: 'fam_1',
        textKey: 'assessment.questions.fam_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.FAMILY_ORIENTATION,
        reverse: false,
      },
      {
        id: 'fam_2',
        textKey: 'assessment.questions.fam_2',
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        dimension: PERSONALITY_DIMENSIONS.FAMILY_ORIENTATION,
        options: [
          { key: 'assessment.options.fam_2_1', value: 1 },
          { key: 'assessment.options.fam_2_2', value: 2 },
          { key: 'assessment.options.fam_2_3', value: 3 },
          { key: 'assessment.options.fam_2_4', value: 4 },
        ],
      },
      
      // COMMUNICATION STYLE
      {
        id: 'com_1',
        textKey: 'assessment.questions.com_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.COMMUNICATION_STYLE,
        reverse: false,
      },
      {
        id: 'com_2',
        textKey: 'assessment.questions.com_2',
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        dimension: PERSONALITY_DIMENSIONS.COMMUNICATION_STYLE,
        options: [
          { key: 'assessment.options.com_2_1', value: 1 },
          { key: 'assessment.options.com_2_2', value: 2 },
          { key: 'assessment.options.com_2_3', value: 3 },
          { key: 'assessment.options.com_2_4', value: 4 },
        ],
      },
      
      // CONFLICT RESOLUTION
      {
        id: 'conf_1',
        textKey: 'assessment.questions.conf_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.CONFLICT_RESOLUTION,
        reverse: false,
      },
      {
        id: 'conf_2',
        textKey: 'assessment.questions.conf_2',
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        dimension: PERSONALITY_DIMENSIONS.CONFLICT_RESOLUTION,
        options: [
          { key: 'assessment.options.conf_2_1', value: 1 },
          { key: 'assessment.options.conf_2_2', value: 2 },
          { key: 'assessment.options.conf_2_3', value: 3 },
          { key: 'assessment.options.conf_2_4', value: 4 },
        ],
      },
    ],
  },
  
  {
    id: 'lifestyle_goals',
    titleKey: 'assessment.sections.lifestyleGoals',
    descriptionKey: 'assessment.sections.lifestyleGoalsDesc',
    icon: '🎯',
    estimatedTime: 5,
    questions: [
      // LIFE GOALS
      {
        id: 'goal_1',
        textKey: 'assessment.questions.goal_1',
        type: QUESTION_TYPES.RANKING,
        dimension: PERSONALITY_DIMENSIONS.LIFE_GOALS,
        options: [
          { key: 'assessment.options.goal_1_1', value: 'career' },
          { key: 'assessment.options.goal_1_2', value: 'family' },
          { key: 'assessment.options.goal_1_3', value: 'travel' },
          { key: 'assessment.options.goal_1_4', value: 'personal_growth' },
          { key: 'assessment.options.goal_1_5', value: 'financial_security' },
        ],
      },
      
      // SOCIAL PREFERENCES
      {
        id: 'soc_1',
        textKey: 'assessment.questions.soc_1',
        type: QUESTION_TYPES.LIKERT_5,
        dimension: PERSONALITY_DIMENSIONS.SOCIAL_PREFERENCES,
        reverse: false,
      },
      {
        id: 'soc_2',
        textKey: 'assessment.questions.soc_2',
        type: QUESTION_TYPES.SLIDER,
        dimension: PERSONALITY_DIMENSIONS.SOCIAL_PREFERENCES,
        min: 0,
        max: 100,
        labelKey: 'assessment.labels.soc_2',
      },
      
      // FINANCIAL VALUES
      {
        id: 'fin_1',
        textKey: 'assessment.questions.fin_1',
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        dimension: PERSONALITY_DIMENSIONS.FINANCIAL_VALUES,
        options: [
          { key: 'assessment.options.fin_1_1', value: 1 },
          { key: 'assessment.options.fin_1_2', value: 2 },
          { key: 'assessment.options.fin_1_3', value: 3 },
          { key: 'assessment.options.fin_1_4', value: 4 },
        ],
      },
    ],
  },
];

// Likert scale labels
export const LIKERT_LABELS = {
  5: [
    { key: 'assessment.likert.stronglyDisagree', value: 1 },
    { key: 'assessment.likert.disagree', value: 2 },
    { key: 'assessment.likert.neutral', value: 3 },
    { key: 'assessment.likert.agree', value: 4 },
    { key: 'assessment.likert.stronglyAgree', value: 5 },
  ],
  7: [
    { key: 'assessment.likert.stronglyDisagree', value: 1 },
    { key: 'assessment.likert.disagree', value: 2 },
    { key: 'assessment.likert.slightlyDisagree', value: 3 },
    { key: 'assessment.likert.neutral', value: 4 },
    { key: 'assessment.likert.slightlyAgree', value: 5 },
    { key: 'assessment.likert.agree', value: 6 },
    { key: 'assessment.likert.stronglyAgree', value: 7 },
  ],
};

// Calculate total questions and estimated time
export const ASSESSMENT_STATS = {
  totalQuestions: ASSESSMENT_SECTIONS.reduce((total, section) => total + section.questions.length, 0),
  totalTime: ASSESSMENT_SECTIONS.reduce((total, section) => total + section.estimatedTime, 0),
  sections: ASSESSMENT_SECTIONS.length,
};

// ========================================
// DATABASE INTEGRATION - REPLACES HARDCODED DATA
// ========================================

import apiService from '../services/apiService';

// Cache for database questions
let databaseQuestionsCache = null;

/**
 * Get personality questions from database - REPLACES hardcoded ASSESSMENT_SECTIONS
 */
export const getPersonalityQuestionsFromDatabase = async (phase = 'single') => {
  try {
    if (!databaseQuestionsCache) {
      console.log('📋 Fetching personality questions from database...');
      const questionnaire = await apiService.getQuestionnaire(phase);
      databaseQuestionsCache = questionnaire.sections || [];
    }
    return databaseQuestionsCache;
  } catch (error) {
    console.error('Error fetching personality questions from database:', error);
    // Fallback to hardcoded questions
    return ASSESSMENT_SECTIONS;
  }
};

/**
 * Hybrid method: Get questions with database fallback
 */
export const getPersonalityQuestions = async (phase = 'single', useDatabase = true) => {
  if (useDatabase) {
    try {
      return await getPersonalityQuestionsFromDatabase(phase);
    } catch (error) {
      console.warn('Database unavailable, using local personality questions');
    }
  }

  // Return local hardcoded questions as fallback
  return ASSESSMENT_SECTIONS;
};

/**
 * Clear cache to force refresh from database
 */
export const clearPersonalityQuestionsCache = () => {
  databaseQuestionsCache = null;
};

export default {
  QUESTION_TYPES,
  PERSONALITY_DIMENSIONS,
  ASSESSMENT_SECTIONS,
  LIKERT_LABELS,
  ASSESSMENT_STATS,
  // New database methods
  getPersonalityQuestions,
  getPersonalityQuestionsFromDatabase,
  clearPersonalityQuestionsCache,
};
