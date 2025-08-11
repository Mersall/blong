/**
 * BLONG Articles System - Database Seed Script
 * Populates the database with sample articles, categories, and content
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedArticlesSystem() {
  console.log('🌱 Seeding articles system...');

  try {
    // Create categories
    console.log('📁 Creating categories...');
    
    const categories = [
      {
        id: 'cat_communication',
        slug: 'communication',
        icon: '💬',
        color: '#4A90E2',
        order: 1,
      },
      {
        id: 'cat_dating_tips',
        slug: 'dating-tips',
        icon: '💕',
        color: '#E74C3C',
        order: 2,
      },
      {
        id: 'cat_relationships',
        slug: 'relationships',
        icon: '❤️',
        color: '#9B59B6',
        order: 3,
      },
      {
        id: 'cat_self_improvement',
        slug: 'self-improvement',
        icon: '🌟',
        color: '#27AE60',
        order: 4,
      },
    ];

    for (const category of categories) {
      await prisma.categories.create({
        data: {
          ...category,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create category translations
    console.log('🌐 Creating category translations...');
    
    const categoryTranslations = [
      {
        id: 'cat_trans_comm_en',
        categoryId: 'cat_communication',
        language: 'en',
        name: 'Communication',
        description: 'Effective communication strategies for relationships',
      },
      {
        id: 'cat_trans_dating_en',
        categoryId: 'cat_dating_tips',
        language: 'en',
        name: 'Dating Tips',
        description: 'Expert advice for successful dating experiences',
      },
      {
        id: 'cat_trans_rel_en',
        categoryId: 'cat_relationships',
        language: 'en',
        name: 'Relationships',
        description: 'Building and maintaining strong relationships',
      },
      {
        id: 'cat_trans_self_en',
        categoryId: 'cat_self_improvement',
        language: 'en',
        name: 'Self Improvement',
        description: 'Personal growth and development for better relationships',
      },
    ];

    for (const translation of categoryTranslations) {
      await prisma.category_translations.create({
        data: {
          ...translation,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create tags
    console.log('🏷️ Creating tags...');
    
    const tags = [
      { id: 'tag_communication', slug: 'communication', color: '#4A90E2', name: 'Communication' },
      { id: 'tag_active_listening', slug: 'active-listening', color: '#5DADE2', name: 'Active Listening' },
      { id: 'tag_emotional_intelligence', slug: 'emotional-intelligence', color: '#85C1E9', name: 'Emotional Intelligence' },
      { id: 'tag_first_date', slug: 'first-date', color: '#E74C3C', name: 'First Date' },
      { id: 'tag_online_dating', slug: 'online-dating', color: '#EC7063', name: 'Online Dating' },
      { id: 'tag_confidence', slug: 'confidence', color: '#F1948A', name: 'Confidence' },
      { id: 'tag_trust', slug: 'trust', color: '#9B59B6', name: 'Trust' },
      { id: 'tag_long_term', slug: 'long-term', color: '#BB8FCE', name: 'Long-term Relationships' },
      { id: 'tag_self_awareness', slug: 'self-awareness', color: '#27AE60', name: 'Self Awareness' },
      { id: 'tag_personal_growth', slug: 'personal-growth', color: '#58D68D', name: 'Personal Growth' },
    ];

    for (const tag of tags) {
      await prisma.tags.create({
        data: {
          id: tag.id,
          slug: tag.slug,
          color: tag.color,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create tag translation
      await prisma.tag_translations.create({
        data: {
          id: `${tag.id}_trans_en`,
          tagId: tag.id,
          language: 'en',
          name: tag.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create articles
    console.log('📝 Creating articles...');
    
    const articles = [
      {
        id: 'art_communication_secrets',
        slug: 'communication-secrets-relationships',
        status: 'PUBLISHED',
        featured: true,
        viewCount: 1247,
        likeCount: 89,
        publishedAt: new Date('2024-01-15T10:00:00Z'),
        categories: ['cat_communication'],
        tags: ['tag_communication', 'tag_active_listening', 'tag_emotional_intelligence'],
        translation: {
          title: 'Secrets of Effective Communication in Relationships',
          subtitle: 'Master the art of meaningful conversation and deeper connection',
          content: `Effective communication is the cornerstone of any successful relationship. Whether you're navigating the early stages of dating or strengthening a long-term partnership, the ability to express yourself clearly and listen actively can make all the difference.

## The Foundation of Connection

Communication goes far beyond exchanging words. It's about creating understanding, building trust, and fostering intimacy. When partners communicate effectively, they create a safe space where both individuals can be vulnerable, honest, and authentic.

### Key Principles of Relationship Communication

#### 1. Active Listening
True listening goes beyond simply hearing words. It involves:

• Making eye contact and giving your full attention
• Avoiding interruptions and distractions
• Reflecting back what you've heard to ensure understanding
• Asking clarifying questions when needed
• Showing empathy through your body language

#### 2. Emotional Intelligence
Understanding and managing emotions is crucial:

• Recognize your own emotional triggers
• Practice empathy and try to see your partner's perspective
• Take breaks when conversations become too heated
• Express feelings using "I" statements rather than blame
• Validate your partner's emotions even when you disagree

#### 3. Timing and Environment
Knowing when and where to have important conversations:

• Choose moments when both parties are calm and receptive
• Avoid important discussions when stressed or tired
• Create a safe, private environment for sensitive topics
• Be willing to table discussions if timing isn't right

## Practical Communication Techniques

### The Mirror Technique
This involves reflecting your partner's words back to them:

"What I hear you saying is..."
"It sounds like you feel..."
"Am I understanding correctly that..."

This technique shows that you're actively listening and helps prevent misunderstandings.

### The Pause Method
When tensions rise, implement strategic pauses:

• Take three deep breaths before responding
• Ask for a moment to collect your thoughts
• Use phrases like "Let me think about that"
• Return to the conversation when emotions have settled

The journey toward better communication is ongoing, but the rewards – deeper intimacy, stronger trust, and more satisfying relationships – make the effort worthwhile.`,
          excerpt: 'Discover the essential communication skills that can transform your relationship and create deeper connections with your partner.',
          author: 'Dr. Sarah Johnson',
          readTime: '8 min read',
          icon: '💬',
        },
      },
      {
        id: 'art_first_date_success',
        slug: 'first-date-success-tips',
        status: 'PUBLISHED',
        featured: true,
        viewCount: 892,
        likeCount: 67,
        publishedAt: new Date('2024-01-10T14:30:00Z'),
        categories: ['cat_dating_tips'],
        tags: ['tag_first_date', 'tag_confidence', 'tag_online_dating'],
        translation: {
          title: 'First Date Success: 10 Essential Tips',
          subtitle: 'Make your first impression count with these proven strategies',
          content: `First dates can be nerve-wracking, but with the right preparation and mindset, they can also be exciting opportunities to connect with someone new. Here are ten essential tips to help you make the most of your first date experience.

## Before the Date

### 1. Choose the Right Setting
The location sets the tone for your entire date:

• Opt for a place that allows for conversation (avoid loud venues)
• Choose somewhere you're comfortable and familiar with
• Consider activities that can break the ice naturally
• Have a backup plan in case your first choice doesn't work out

### 2. Be Authentic
Honesty creates a foundation for genuine connection:

• Be yourself rather than trying to impress
• Share your real interests and passions
• Don't exaggerate or create false impressions
• Let your personality shine through naturally

### 3. Practice Good Manners
Small courtesies make a big difference:

• Be punctual and respectful of their time
• Offer to pay or discuss payment beforehand
• Be polite to waitstaff and others around you
• Express gratitude for their time and company

## During the Date

### 4. Be Present and Engaged
Show genuine interest in getting to know them:

• Put your phone away and focus on the conversation
• Make eye contact and use positive body language
• Ask follow-up questions to show you're listening
• Share your own experiences and thoughts

### 5. Ask Meaningful Questions
Go beyond surface-level conversation:

• "What's something you're passionate about?"
• "What's the best advice you've ever received?"
• "What would your perfect weekend look like?"
• "What's something most people don't know about you?"

Remember, the best first dates happen when both people feel comfortable being themselves. Focus on enjoying the experience and getting to know your date.`,
          excerpt: 'Transform your dating game with proven strategies that help you create authentic connections and memorable first impressions.',
          author: 'BLONG Dating Expert',
          readTime: '6 min read',
          icon: '💕',
        },
      },
      {
        id: 'art_building_trust',
        slug: 'building-trust-relationships',
        status: 'PUBLISHED',
        featured: false,
        viewCount: 654,
        likeCount: 43,
        publishedAt: new Date('2024-01-08T09:15:00Z'),
        categories: ['cat_relationships'],
        tags: ['tag_trust', 'tag_long_term', 'tag_communication'],
        translation: {
          title: 'Building Trust in Long-term Relationships',
          subtitle: 'The foundation of lasting love and partnership',
          content: `Trust is the invisible thread that weaves through every aspect of a healthy relationship. It's what allows partners to be vulnerable with each other, to feel secure in their bond, and to weather the inevitable storms that come with long-term commitment.

## Understanding Trust

Trust isn't built overnight, nor is it simply about being faithful. It encompasses reliability, honesty, emotional safety, and the confidence that your partner has your best interests at heart.

### The Components of Trust

#### Reliability
Being someone your partner can count on:

• Following through on promises and commitments
• Being consistent in your words and actions
• Showing up when you say you will
• Maintaining your responsibilities in the relationship

#### Honesty and Transparency
Creating an atmosphere of openness:

• Sharing your thoughts and feelings openly
• Being truthful even when it's difficult
• Admitting mistakes and taking responsibility
• Discussing important matters together

#### Emotional Safety
Making your partner feel secure:

• Respecting their boundaries and vulnerabilities
• Avoiding judgment when they share personal thoughts
• Supporting them through difficult times
• Creating a space where they can be authentic

## Building Trust Over Time

Trust is built through consistent small actions rather than grand gestures. Every interaction is an opportunity to either build or erode trust in your relationship.

When both partners are committed to building and maintaining trust, they create a foundation strong enough to support a lifetime of love and partnership.`,
          excerpt: 'Learn how to build and maintain the trust that forms the foundation of strong, lasting relationships.',
          author: 'Dr. Michael Chen',
          readTime: '10 min read',
          icon: '🤝',
        },
      },
      {
        id: 'art_self_confidence',
        slug: 'building-self-confidence-dating',
        status: 'PUBLISHED',
        featured: false,
        viewCount: 423,
        likeCount: 29,
        publishedAt: new Date('2024-01-05T16:45:00Z'),
        categories: ['cat_self_improvement'],
        tags: ['tag_confidence', 'tag_self_awareness', 'tag_personal_growth'],
        translation: {
          title: 'Building Self-Confidence for Better Dating',
          subtitle: 'Develop authentic confidence that attracts meaningful connections',
          content: `Self-confidence is magnetic. It's what makes someone genuinely attractive, not just physically, but as a whole person. When you're confident in who you are, you naturally draw others to you and create the foundation for healthy, meaningful relationships.

## Understanding True Confidence

Real confidence isn't about arrogance or pretending to be perfect. It's about self-acceptance, knowing your worth, and being comfortable with who you are – flaws and all.

### Building Genuine Self-Confidence

#### Know Yourself
Self-awareness is the foundation of confidence:

• Identify your core values and live by them
• Recognize your strengths and unique qualities
• Acknowledge areas where you'd like to grow
• Understand your triggers and emotional patterns

#### Develop Your Interests
Having passions and interests makes you more interesting:

• Pursue hobbies that genuinely excite you
• Learn new skills or explore new subjects
• Join groups or classes related to your interests
• Share your enthusiasm with others

#### Take Care of Yourself
Self-care directly impacts how you feel about yourself:

• Maintain good physical health through exercise and nutrition
• Practice good hygiene and dress in a way that makes you feel good
• Get enough sleep and manage stress effectively
• Engage in activities that bring you joy and relaxation

## Confidence in Dating Situations

When you're truly confident, you attract people who appreciate the real you and create relationships based on authenticity rather than pretense.

Building self-confidence is a journey, not a destination. Each small step toward greater self-confidence is a step toward the relationships and life you want to create.`,
          excerpt: 'Discover how authentic self-confidence can transform your dating life and help you build meaningful connections.',
          author: 'Lisa Rodriguez, Life Coach',
          readTime: '7 min read',
          icon: '🌟',
        },
      },
    ];

    // Create articles and their related data
    for (const article of articles) {
      // Create article
      const createdArticle = await prisma.articles.create({
        data: {
          id: article.id,
          slug: article.slug,
          status: article.status,
          featured: article.featured,
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          publishedAt: article.publishedAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create article translation
      await prisma.article_translations.create({
        data: {
          id: `${article.id}_en`,
          articleId: createdArticle.id,
          language: 'en',
          title: article.translation.title,
          subtitle: article.translation.subtitle,
          content: article.translation.content,
          excerpt: article.translation.excerpt,
          author: article.translation.author,
          readTime: article.translation.readTime,
          icon: article.translation.icon,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create article categories
      for (const categoryId of article.categories) {
        await prisma.article_categories.create({
          data: {
            id: `${article.id}_${categoryId}`,
            articleId: createdArticle.id,
            categoryId,
            createdAt: new Date(),
          },
        });
      }

      // Create article tags
      for (const tagId of article.tags) {
        await prisma.article_tags.create({
          data: {
            id: `${article.id}_${tagId}`,
            articleId: createdArticle.id,
            tagId,
            createdAt: new Date(),
          },
        });
      }
    }

    console.log('✅ Articles system seeded successfully!');
    console.log(`📝 Created ${articles.length} articles`);
    console.log(`📁 Created 4 categories`);
    console.log(`🏷️ Created ${tags.length} tags`);

  } catch (error) {
    console.error('❌ Error seeding articles system:', error);
    throw error;
  }
}

// Run the seed function
async function main() {
  try {
    await seedArticlesSystem();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();