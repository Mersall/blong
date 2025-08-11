/**
 * BLONG Personality Analytics Service (Frontend Only)
 * Generates personality insights for display - Real matching happens on backend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class PersonalityAnalyticsService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    console.log('📊 Personality Analytics Service initialized');
    this.initialized = true;
  }

  // Generate personality analytics for display purposes only
  async analyzePersonalityForDisplay(answers) {
    await this.initialize();
    
    console.log('🧠 Generating personality analytics for display...', answers);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate personality insights for display
    const personalityInsights = this.generatePersonalityInsights(answers);
    const personalityType = this.determinePersonalityType(answers);
    const compatibilityProfile = this.generateCompatibilityProfile(answers);
    
    const analytics = {
      personalityType,
      personalityInsights,
      compatibilityProfile,
      strengths: this.identifyStrengths(answers),
      idealPartnerTraits: this.generateIdealPartnerTraits(answers),
      relationshipStyle: this.analyzeRelationshipStyle(answers),
      timestamp: new Date().toISOString()
    };
    
    // Save analytics locally for display
    await AsyncStorage.setItem('personality_analytics', JSON.stringify(analytics));
    
    console.log('✅ Personality analytics generated:', analytics);
    return analytics;
  }

  generatePersonalityInsights(answers) {
    const insights = {
      communication: this.analyzeCommunicationStyle(answers),
      lifestyle: this.analyzeLifestylePreferences(answers),
      values: this.analyzeValues(answers),
      goals: this.analyzeRelationshipGoals(answers)
    };
    
    return insights;
  }

  analyzeCommunicationStyle(answers) {
    const style = answers.communication_style || 'Balanced';
    
    const styles = {
      'Direct and honest': {
        description: 'You value transparency and straightforward communication',
        strengths: ['Clear expectations', 'Honest feedback', 'Efficient problem-solving'],
        tips: 'Your direct approach builds trust, but remember to balance honesty with empathy'
      },
      'Gentle and understanding': {
        description: 'You prioritize emotional connection and empathetic communication',
        strengths: ['Emotional intelligence', 'Conflict resolution', 'Supportive nature'],
        tips: 'Your caring approach creates safety, but ensure your needs are also heard'
      },
      'Humorous and light': {
        description: 'You bring joy and positivity to conversations',
        strengths: ['Stress relief', 'Social connection', 'Optimistic outlook'],
        tips: 'Your humor brightens relationships, but know when to be serious for deeper topics'
      },
      'Deep and meaningful': {
        description: 'You seek authentic, profound connections through conversation',
        strengths: ['Intellectual intimacy', 'Emotional depth', 'Meaningful bonds'],
        tips: 'Your depth creates strong connections, but balance with lighter moments too'
      }
    };
    
    return styles[style] || styles['Direct and honest'];
  }

  analyzeLifestylePreferences(answers) {
    const lifestyleTypes = Array.isArray(answers.lifestyle_type) 
      ? answers.lifestyle_type 
      : [answers.lifestyle_type || 'Balanced'];
    
    const preferences = {
      primary: lifestyleTypes[0] || 'Balanced',
      description: this.getLifestyleDescription(lifestyleTypes),
      compatibility: this.getLifestyleCompatibility(lifestyleTypes),
      activities: this.suggestActivities(lifestyleTypes, answers.interests)
    };
    
    return preferences;
  }

  getLifestyleDescription(types) {
    const descriptions = {
      'Active/Sporty': 'You enjoy physical activities and maintaining an active lifestyle',
      'Homebody': 'You find comfort and joy in intimate, home-based activities',
      'Social butterfly': 'You thrive in social settings and enjoy meeting new people',
      'Career-focused': 'You are ambitious and dedicated to professional growth',
      'Family-oriented': 'You prioritize family relationships and creating a loving home',
      'Adventurous': 'You seek new experiences and enjoy exploring the unknown'
    };
    
    if (types.length === 1) {
      return descriptions[types[0]] || 'You have a balanced approach to lifestyle choices';
    }
    
    return `You blend ${types.join(' and ').toLowerCase()} qualities in your lifestyle`;
  }

  getLifestyleCompatibility(types) {
    const compatibility = [];
    
    types.forEach(type => {
      switch (type) {
        case 'Active/Sporty':
          compatibility.push('Partners who enjoy fitness and outdoor activities');
          break;
        case 'Homebody':
          compatibility.push('Partners who appreciate quiet, intimate moments');
          break;
        case 'Social butterfly':
          compatibility.push('Partners who enjoy social events and meeting people');
          break;
        case 'Career-focused':
          compatibility.push('Partners who understand professional ambitions');
          break;
        case 'Family-oriented':
          compatibility.push('Partners who share family values and priorities');
          break;
        case 'Adventurous':
          compatibility.push('Partners who love exploring and trying new things');
          break;
      }
    });
    
    return compatibility;
  }

  suggestActivities(lifestyleTypes, interests) {
    const activities = new Set();
    
    lifestyleTypes.forEach(type => {
      switch (type) {
        case 'Active/Sporty':
          activities.add('Hiking dates');
          activities.add('Fitness classes together');
          activities.add('Outdoor adventures');
          break;
        case 'Homebody':
          activities.add('Cooking together');
          activities.add('Movie nights');
          activities.add('Board game evenings');
          break;
        case 'Social butterfly':
          activities.add('Double dates');
          activities.add('Social events');
          activities.add('Group activities');
          break;
        case 'Career-focused':
          activities.add('Professional networking events');
          activities.add('Industry conferences');
          activities.add('Business dinners');
          break;
        case 'Family-oriented':
          activities.add('Family gatherings');
          activities.add('Community events');
          activities.add('Volunteer work');
          break;
        case 'Adventurous':
          activities.add('Travel planning');
          activities.add('New restaurant exploration');
          activities.add('Cultural experiences');
          break;
      }
    });
    
    // Add interest-based activities
    if (interests) {
      interests.forEach(interest => {
        switch (interest) {
          case 'Music':
            activities.add('Concert dates');
            break;
          case 'Art':
            activities.add('Museum visits');
            break;
          case 'Technology':
            activities.add('Tech meetups');
            break;
          case 'Cooking':
            activities.add('Cooking classes');
            break;
        }
      });
    }
    
    return Array.from(activities).slice(0, 6);
  }

  analyzeValues(answers) {
    const values = {
      family: this.analyzeFamilyValues(answers),
      religion: this.analyzeReligiousValues(answers),
      education: this.analyzeEducationValues(answers),
      career: this.analyzeCareerValues(answers)
    };
    
    return values;
  }

  analyzeFamilyValues(answers) {
    const familyPlans = answers.family_plans;
    
    const values = {
      'Yes, definitely': {
        priority: 'High',
        description: 'Family is a central priority in your life vision',
        compatibility: 'Best with partners who also want children'
      },
      'Maybe in the future': {
        priority: 'Moderate',
        description: 'You\'re open to family but not in a rush',
        compatibility: 'Compatible with various family planning approaches'
      },
      'Already have children': {
        priority: 'High',
        description: 'Family is already part of your life experience',
        compatibility: 'Best with partners who embrace blended families'
      },
      'No, never': {
        priority: 'Clear',
        description: 'You prefer a child-free lifestyle',
        compatibility: 'Best with partners who share this preference'
      }
    };
    
    return values[familyPlans] || values['Maybe in the future'];
  }

  analyzeReligiousValues(answers) {
    const importance = answers.religion_importance;
    
    const values = {
      'Very important': {
        priority: 'High',
        description: 'Faith plays a central role in your life decisions',
        compatibility: 'Best with partners who share similar religious values'
      },
      'Somewhat important': {
        priority: 'Moderate',
        description: 'You value spiritual connection but remain flexible',
        compatibility: 'Compatible with various levels of religious involvement'
      },
      'Not important': {
        priority: 'Low',
        description: 'You prioritize other values over religious practices',
        compatibility: 'Compatible with secular or flexible spiritual approaches'
      },
      'Prefer not to say': {
        priority: 'Private',
        description: 'You keep spiritual matters personal',
        compatibility: 'Open to partners with various religious backgrounds'
      }
    };
    
    return values[importance] || values['Somewhat important'];
  }

  analyzeEducationValues(answers) {
    const level = answers.education_level;
    
    const values = {
      'PhD': {
        priority: 'High',
        description: 'You highly value intellectual growth and academic achievement',
        compatibility: 'Best with partners who appreciate intellectual pursuits'
      },
      "Master's Degree": {
        priority: 'High',
        description: 'You value education and continuous learning',
        compatibility: 'Compatible with educated, growth-minded partners'
      },
      "Bachelor's Degree": {
        priority: 'Moderate',
        description: 'You appreciate education as a foundation for success',
        compatibility: 'Compatible with various educational backgrounds'
      },
      'High School': {
        priority: 'Practical',
        description: 'You value practical skills and life experience',
        compatibility: 'Compatible with partners who value real-world experience'
      },
      'No preference': {
        priority: 'Flexible',
        description: 'You value character over credentials',
        compatibility: 'Open to partners with diverse educational paths'
      }
    };
    
    return values[level] || values["Bachelor's Degree"];
  }

  analyzeCareerValues(answers) {
    const professionPrefs = answers.profession_preference || [];
    const lifestyleTypes = answers.lifestyle_type || [];
    
    const isCareerFocused = lifestyleTypes.includes('Career-focused');
    
    return {
      priority: isCareerFocused ? 'High' : 'Moderate',
      description: isCareerFocused 
        ? 'Professional success is important to your identity and goals'
        : 'You value work-life balance and career satisfaction',
      preferences: professionPrefs.length > 0 
        ? `Interested in partners in: ${professionPrefs.join(', ')}`
        : 'Open to partners in various professional fields',
      compatibility: isCareerFocused
        ? 'Best with ambitious, goal-oriented partners'
        : 'Compatible with partners who value balance'
    };
  }

  analyzeRelationshipGoals(answers) {
    const timeline = answers.relationship_timeline;
    const type = answers.relationship_type;
    
    return {
      timeline: {
        preference: timeline,
        description: this.getTimelineDescription(timeline),
        urgency: this.getTimelineUrgency(timeline)
      },
      type: {
        preference: type,
        description: this.getRelationshipTypeDescription(type),
        approach: this.getRelationshipApproach(type)
      }
    };
  }

  getTimelineDescription(timeline) {
    const descriptions = {
      'Within 1 year': 'You\'re ready to commit and move forward quickly',
      '1-2 years': 'You prefer a thoughtful but steady progression',
      '2-5 years': 'You believe in taking time to build a strong foundation',
      'No specific timeline': 'You let relationships develop naturally'
    };
    
    return descriptions[timeline] || descriptions['2-5 years'];
  }

  getTimelineUrgency(timeline) {
    const urgency = {
      'Within 1 year': 'High',
      '1-2 years': 'Moderate-High',
      '2-5 years': 'Moderate',
      'No specific timeline': 'Low'
    };
    
    return urgency[timeline] || 'Moderate';
  }

  getRelationshipTypeDescription(type) {
    const descriptions = {
      'Marriage': 'You\'re focused on finding a life partner for marriage',
      'Long-term commitment': 'You seek serious, committed relationships',
      'Getting to know first': 'You prefer to build friendship before romance',
      'Friendship that leads to marriage': 'You believe the best marriages start as friendships'
    };
    
    return descriptions[type] || descriptions['Long-term commitment'];
  }

  getRelationshipApproach(type) {
    const approaches = {
      'Marriage': 'Direct and goal-oriented',
      'Long-term commitment': 'Serious but flexible',
      'Getting to know first': 'Gradual and exploratory',
      'Friendship that leads to marriage': 'Foundation-building'
    };
    
    return approaches[type] || approaches['Long-term commitment'];
  }

  // Determine personality type based on answers
  determinePersonalityType(answers) {
    const traits = answers.personality_traits || [];
    const communication = answers.communication_style || '';
    const lifestyle = answers.lifestyle_type || [];

    // AI logic to determine personality type
    if (traits.includes('Practical') && communication === 'Deep and meaningful') {
      return 'Thoughtful Communicator';
    } else if (traits.includes('Outgoing') && lifestyle.includes('Social butterfly')) {
      return 'Social Connector';
    } else if (traits.includes('Analytical') && traits.includes('Independent')) {
      return 'Independent Thinker';
    } else if (lifestyle.includes('Family-oriented') && traits.includes('Empathetic')) {
      return 'Nurturing Partner';
    } else if (traits.includes('Creative') && lifestyle.includes('Adventurous')) {
      return 'Creative Explorer';
    } else {
      return 'Balanced Individual';
    }
  }

  // Identify strengths based on answers
  identifyStrengths(answers) {
    const strengths = [];
    const traits = answers.personality_traits || [];
    const communication = answers.communication_style || '';

    if (traits.includes('Empathetic')) strengths.push('Excellent emotional intelligence');
    if (traits.includes('Practical')) strengths.push('Problem-solving abilities');
    if (traits.includes('Optimistic')) strengths.push('Positive outlook on life');
    if (communication === 'Deep and meaningful') strengths.push('Meaningful conversations');
    if (traits.includes('Independent')) strengths.push('Self-reliance and confidence');

    return strengths.length > 0 ? strengths : ['Good communication', 'Relationship-focused'];
  }

  // Generate ideal partner traits
  generateIdealPartnerTraits(answers) {
    const traits = [];
    const dealBreakers = answers.deal_breakers || [];
    const communication = answers.communication_style || '';
    const relationshipType = answers.relationship_type || '';

    // Determine ideal traits based on preferences and deal breakers
    if (!dealBreakers.includes('Poor communication')) traits.push('Excellent communicator');
    if (!dealBreakers.includes('No career ambition')) traits.push('Career-driven');
    if (communication === 'Deep and meaningful') traits.push('Emotionally intelligent');
    if (relationshipType === 'Friendship that leads to marriage') traits.push('Patient and understanding');

    // Add complementary traits
    traits.push('Shared values', 'Mutual respect', 'Similar life goals');

    return traits;
  }
}

export const personalityAnalyticsService = new PersonalityAnalyticsService();
