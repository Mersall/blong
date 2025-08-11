# BLONG Quiz System Architecture

## Overview
The BLONG Quiz System replaces the old questionnaire system with a personality-based matching approach using scientifically validated psychological frameworks. This system creates meaningful connections by understanding users' core personalities rather than superficial preferences.

## 🧠 **Psychological Frameworks**

### 1. Big Five (OCEAN) Personality Traits
**Most scientifically validated personality model**

#### **Openness to Experience**
- **High**: Imaginative, curious, enjoys new experiences
- **Low**: Cautious, consistent, prefers routine
- **Questions**: Abstract thinking, creativity, trying new things
- **Matching**: Similar levels work well together

#### **Conscientiousness** 
- **High**: Organized, disciplined, reliable
- **Low**: Easy-going, spontaneous, flexible
- **Questions**: Planning, organization, attention to detail
- **Matching**: Similar levels prevent conflict

#### **Extraversion**
- **High**: Outgoing, energetic, social
- **Low**: Solitary, reserved, introspective  
- **Questions**: Social energy, party preferences, group activities
- **Matching**: Can complement or match

#### **Agreeableness**
- **High**: Friendly, compassionate, cooperative
- **Low**: Challenging, competitive, direct
- **Questions**: Conflict resolution, empathy, cooperation
- **Matching**: High agreeableness needs patience

#### **Neuroticism**
- **High**: Anxious, sensitive, emotionally reactive
- **Low**: Secure, confident, emotionally stable
- **Questions**: Stress response, mood stability, worry patterns
- **Matching**: Low neuroticism provides stability

### 2. Love Languages (Gary Chapman)
**How people express and receive love**

- **Words of Affirmation**: Verbal appreciation, compliments
- **Acts of Service**: Helpful actions, doing things for partner
- **Receiving Gifts**: Thoughtful presents, tokens of love
- **Quality Time**: Undivided attention, meaningful conversations
- **Physical Touch**: Hugs, kisses, physical closeness

### 3. Attachment Styles
**How people connect in relationships**

- **Secure**: Comfortable with intimacy and independence
- **Anxious**: Seeks closeness, fears abandonment
- **Avoidant**: Values independence, uncomfortable with closeness
- **Disorganized**: Inconsistent patterns, conflicted needs

## 🎯 **Quiz Categories**

### Category 1: Core Personality (Big Five)
**25 questions - 5 per trait**

```javascript
// Example Questions
{
  trait: "openness",
  question: "I enjoy exploring new ideas and concepts",
  type: "likert_5",
  options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
}

{
  trait: "conscientiousness", 
  question: "I always keep my living space organized",
  type: "likert_5",
  reverse_scored: false
}
```

### Category 2: Love Languages
**15 questions - 3 per language**

```javascript
// Scenario-based questions
{
  category: "love_languages",
  question: "It's your birthday. Which would make you feel most loved?",
  type: "single_choice",
  options: [
    { value: "words", text: "A heartfelt letter expressing their love" },
    { value: "service", text: "They handle all your chores for the day" },
    { value: "gifts", text: "A thoughtful gift you mentioned wanting" },
    { value: "time", text: "Uninterrupted quality time together" },
    { value: "touch", text: "Physical affection and cuddling" }
  ]
}
```

### Category 3: Attachment & Relationship Style
**12 questions**

```javascript
// Scenario-based questions
{
  category: "attachment",
  question: "Your partner doesn't reply to your text for several hours. How do you typically react?",
  type: "single_choice",
  options: [
    { value: "secure", text: "I assume they're busy and trust they'll reply when they can" },
    { value: "anxious", text: "I worry I said something wrong and might send a follow-up" },
    { value: "avoidant", text: "I feel annoyed but get busy with my own things" }
  ]
}
```

### Category 4: Lifestyle & Values
**20 questions**

```javascript
// Fun "This or That" questions
{
  category: "lifestyle",
  question: "Which sounds more appealing?",
  type: "this_or_that",
  options: [
    { value: "spontaneous", text: "Spontaneous weekend trip" },
    { value: "planned", text: "Carefully planned vacation" }
  ]
}
```

### Category 5: Relationship Scenarios
**18 questions**

```javascript
// Real-life situation questions
{
  category: "scenarios",
  question: "You and your partner have different opinions on a major decision. What's your approach?",
  type: "single_choice",
  options: [
    { value: "discuss", text: "Have an open discussion to understand both perspectives" },
    { value: "compromise", text: "Look for a middle ground that works for both" },
    { value: "research", text: "Gather more information before deciding" },
    { value: "defer", text: "Let the person who cares more make the decision" }
  ]
}
```

## 🏗️ **Database Schema**

### Quiz Framework Tables
```sql
-- Quiz Categories
CREATE TABLE quiz_categories (
  id UUID PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES quiz_categories(id),
  question_key VARCHAR(100) UNIQUE NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL, -- likert_5, single_choice, this_or_that
  trait VARCHAR(50), -- openness, conscientiousness, etc.
  reverse_scored BOOLEAN DEFAULT false,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Options
CREATE TABLE quiz_options (
  id UUID PRIMARY KEY,
  question_id UUID REFERENCES quiz_questions(id),
  option_key VARCHAR(50) NOT NULL,
  option_text TEXT NOT NULL,
  score_value INTEGER, -- for scoring
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Quiz Responses
CREATE TABLE user_quiz_responses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question_id UUID REFERENCES quiz_questions(id),
  selected_option_id UUID REFERENCES quiz_options(id),
  score INTEGER, -- calculated score
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- User Personality Profiles
CREATE TABLE user_personality_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  
  -- Big Five Scores (0-100)
  openness_score INTEGER,
  conscientiousness_score INTEGER,
  extraversion_score INTEGER,
  agreeableness_score INTEGER,
  neuroticism_score INTEGER,
  
  -- Love Language (primary and secondary)
  primary_love_language VARCHAR(20),
  secondary_love_language VARCHAR(20),
  
  -- Attachment Style
  attachment_style VARCHAR(20),
  
  -- Lifestyle preferences
  lifestyle_preferences JSONB,
  
  -- Matching preferences
  matching_preferences JSONB,
  
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 **Frontend Design Specifications**

### Quiz UI Components
- **Animated Progress Bar**: Smooth transitions between questions
- **Question Cards**: Premium card design with animations
- **Answer Buttons**: Interactive buttons with hover effects
- **Character Illustrations**: Fun avatars representing personality types
- **Results Visualization**: Beautiful charts showing personality breakdown

### Animation Specifications
- **Card Flip**: Questions slide in from right, previous slides out left
- **Progress Animation**: Smooth progress bar with glow effects
- **Button Interactions**: Scale and color transitions on selection
- **Loading States**: Skeleton screens and smooth loading animations
- **Results Reveal**: Animated personality type reveal with confetti

### Premium Design Elements
- **Elite Typography**: Clean, modern fonts with proper hierarchy
- **Color Psychology**: Colors that match personality traits
- **Micro-interactions**: Subtle animations for better engagement
- **Responsive Design**: Perfect on all device sizes
- **Accessibility**: Full screen reader and keyboard navigation support

## 🔄 **Matching Algorithm**

### Compatibility Scoring
```javascript
function calculateCompatibility(user1Profile, user2Profile) {
  let totalScore = 0;
  
  // Big Five Compatibility (40% weight)
  const bigFiveScore = calculateBigFiveCompatibility(user1Profile, user2Profile);
  totalScore += bigFiveScore * 0.4;
  
  // Love Languages Compatibility (25% weight)
  const loveLanguageScore = calculateLoveLanguageCompatibility(user1Profile, user2Profile);
  totalScore += loveLanguageScore * 0.25;
  
  // Attachment Style Compatibility (20% weight)
  const attachmentScore = calculateAttachmentCompatibility(user1Profile, user2Profile);
  totalScore += attachmentScore * 0.2;
  
  // Lifestyle Compatibility (15% weight)
  const lifestyleScore = calculateLifestyleCompatibility(user1Profile, user2Profile);
  totalScore += lifestyleScore * 0.15;
  
  return Math.round(totalScore);
}
```

### Personality Insights
- **Compatibility Explanations**: Why two people match well
- **Growth Areas**: Areas where partners can help each other grow
- **Communication Tips**: How to communicate effectively based on personalities
- **Conflict Resolution**: Strategies based on personality types

## 📱 **Implementation Phases**

### Phase 1: Core Quiz System (Week 1)
- Database schema implementation
- Basic quiz API endpoints
- Simple quiz UI components
- Big Five personality assessment

### Phase 2: Enhanced Experience (Week 2)
- Love Languages and Attachment Style quizzes
- Premium animations and interactions
- Personality profile generation
- Basic matching algorithm

### Phase 3: Advanced Features (Week 3)
- Scenario-based questions
- Advanced matching algorithm
- Personality insights and explanations
- Quiz result sharing

### Phase 4: Optimization (Week 4)
- Performance optimization
- A/B testing different question formats
- Analytics and user behavior tracking
- Continuous improvement based on data

This architecture creates a comprehensive, scientifically-backed personality assessment system that will significantly improve match quality and user satisfaction in the BLONG matrimonial app.
