---
type: "always_apply"
description: "BLONG Business Logic and User Flow Rules"
---

# BLONG Business Logic & User Flow Rules

## 🎯 MATRIMONIAL APP BUSINESS RULES

### RULE 1: Relationship Phase System - MANDATORY
```javascript
// ALWAYS implement three distinct relationship phases
const RELATIONSHIP_PHASES = {
  SINGLE: {
    id: 'single',
    name: 'Singles Journey',
    theme: 'Reflective, clean, airy',
    colors: ['#E8E2F0', '#F5F3F7', '#FFE4E6'], // Lavender, cool beige, soft rose
    features: ['self-reflection', 'partner-values', 'personality-tests'],
    icon: '🌸'
  },
  PREPARING: {
    id: 'preparing',
    name: 'Preparing for Engagement',
    theme: 'Hopeful, structured, playful',
    colors: ['#FFE4E6', '#FF8A80', '#1A237E'], // Blush pink, warm coral, navy blue
    features: ['vision-boards', 'relationship-timeline', 'couples-journal'],
    icon: '💕'
  },
  ENGAGED: {
    id: 'engaged',
    name: 'Before Engagement',
    theme: 'Romantic, elegant, focused',
    colors: ['#E91E63', '#1565C0', '#8E24AA'], // Rose gold, deep blue, muted plum
    features: ['wedding-planning', 'vendor-database', 'financial-planning'],
    icon: '💍'
  }
};
```

### RULE 2: User Onboarding Flow - MANDATORY
```javascript
// ALWAYS follow this exact onboarding sequence
const ONBOARDING_FLOW = [
  {
    step: 1,
    screen: 'LanguageSelection',
    required: true,
    options: ['English', 'Spanish', 'French', 'Arabic'],
    validation: 'Must select one language'
  },
  {
    step: 2,
    screen: 'ThemeSelection',
    required: false,
    options: ['light', 'dark'],
    default: 'light'
  },
  {
    step: 3,
    screen: 'RelationshipPhaseSelection',
    required: true,
    options: Object.values(RELATIONSHIP_PHASES),
    validation: 'Must select relationship phase before registration'
  }
];
```

### RULE 3: Profile Completion Requirements - MANDATORY
```javascript
// ALWAYS enforce these profile completion rules
const PROFILE_COMPLETION_REQUIREMENTS = {
  basicInfo: {
    required: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'email'],
    weight: 25 // 25% of total completion
  },
  profileDetails: {
    required: ['bio', 'height', 'education', 'occupation', 'city', 'country'],
    optional: ['interests', 'smoking', 'drinking', 'exercise'],
    weight: 35 // 35% of total completion
  },
  photos: {
    minimum: 1,
    maximum: 6,
    required: ['profilePicture'],
    weight: 20 // 20% of total completion
  },
  preferences: {
    required: ['minAge', 'maxAge', 'maxDistance'],
    optional: ['education', 'occupation', 'interests'],
    weight: 20 // 20% of total completion
  }
};

// Profile is considered "complete" with at least 70% completion
const MINIMUM_COMPLETION_PERCENTAGE = 70;
```

### RULE 4: Personality Assessment System - MANDATORY
```javascript
// ALWAYS implement comprehensive personality assessment
const PERSONALITY_ASSESSMENT_CATEGORIES = {
  BIG_FIVE: {
    key: 'big_five',
    name: 'Big Five Personality Traits',
    traits: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],
    questions: 50, // 10 questions per trait
    required: true
  },
  LOVE_LANGUAGES: {
    key: 'love_languages',
    name: 'Love Languages',
    languages: ['words_of_affirmation', 'acts_of_service', 'receiving_gifts', 'quality_time', 'physical_touch'],
    questions: 30,
    required: true
  },
  ATTACHMENT_STYLE: {
    key: 'attachment_style',
    name: 'Attachment Style',
    styles: ['secure', 'anxious', 'avoidant', 'disorganized'],
    questions: 20,
    required: true
  },
  SCENARIO_BASED: {
    key: 'scenario_based',
    name: 'Scenario-Based Questions',
    categories: ['conflict_resolution', 'financial_decisions', 'family_planning', 'lifestyle_choices'],
    questions: 40,
    required: false
  }
};
```

### RULE 5: AI-Powered Matching Logic - MANDATORY
```javascript
// ALWAYS use psychology-first matching approach
const MATCHING_ALGORITHM = {
  personalityCompatibility: {
    weight: 40, // 40% of total compatibility score
    factors: [
      'big_five_compatibility',
      'love_language_alignment',
      'attachment_style_compatibility'
    ]
  },
  preferenceMatching: {
    weight: 30, // 30% of total compatibility score
    factors: [
      'age_range_match',
      'location_proximity',
      'education_compatibility',
      'lifestyle_alignment'
    ]
  },
  valueAlignment: {
    weight: 20, // 20% of total compatibility score
    factors: [
      'family_values_match',
      'religious_compatibility',
      'life_goals_alignment'
    ]
  },
  interactionHistory: {
    weight: 10, // 10% of total compatibility score
    factors: [
      'previous_date_feedback',
      'communication_patterns',
      'mutual_interest_indicators'
    ]
  }
};

// Minimum compatibility score for automatic date arrangement
const MINIMUM_COMPATIBILITY_SCORE = 75;
```

## 💕 DATE DELIVERY SYSTEM RULES

### RULE 6: Automatic Date Arrangement - MANDATORY
```javascript
// ALWAYS follow premium date delivery approach
const DATE_DELIVERY_SYSTEM = {
  noSwiping: true, // Never implement swiping - premium service only
  automaticArrangement: true,
  paymentRequired: true, // Users pay for actual meetups after interest confirmation

  process: [
    {
      step: 1,
      action: 'personality_analysis',
      description: 'Analyze user personality from quiz responses'
    },
    {
      step: 2,
      action: 'compatibility_calculation',
      description: 'Calculate compatibility with potential matches'
    },
    {
      step: 3,
      action: 'match_notification',
      description: 'Send personality cards to both users (no contact info)'
    },
    {
      step: 4,
      action: 'mutual_interest_confirmation',
      description: 'Both users must confirm interest'
    },
    {
      step: 5,
      action: 'payment_processing',
      description: 'Process dating fees for actual meetup'
    },
    {
      step: 6,
      action: 'date_arrangement',
      description: 'Arrange venue and provide contact information'
    }
  ]
};
```

### RULE 7: Venue Selection & Booking - MANDATORY
```javascript
// ALWAYS use AI-powered venue recommendations
const VENUE_SELECTION_CRITERIA = {
  personalityBased: {
    introvert_friendly: ['quiet_cafes', 'bookstores', 'art_galleries', 'small_restaurants'],
    extrovert_friendly: ['busy_restaurants', 'entertainment_venues', 'social_events', 'outdoor_activities']
  },
  phaseAppropriate: {
    single: ['casual_cafes', 'activity_based', 'group_settings'],
    preparing: ['romantic_restaurants', 'cultural_venues', 'scenic_locations'],
    engaged: ['upscale_venues', 'private_dining', 'exclusive_experiences']
  },
  safetyFirst: {
    publicVenues: true,
    wellLitAreas: true,
    easyTransportAccess: true,
    emergencyContactSystem: true
  }
};
```