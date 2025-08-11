/**
 * BLONG Articles System - Database Seed Script
 * Populates the database with sample articles, categories, and content
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedArticlesSystem() {
  console.log('🌱 Seeding articles system...');

  try {
    // Create categories
    console.log('📁 Creating categories...');
    
    const communicationCategory = await prisma.categories.create({
      data: {
        id: 'cat_communication',
        slug: 'communication',
        icon: '💬',
        color: '#4A90E2',
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const datingTipsCategory = await prisma.categories.create({
      data: {
        id: 'cat_dating_tips',
        slug: 'dating-tips',
        icon: '💕',
        color: '#E74C3C',
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const relationshipsCategory = await prisma.categories.create({
      data: {
        id: 'cat_relationships',
        slug: 'relationships',
        icon: '❤️',
        color: '#9B59B6',
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const selfImprovementCategory = await prisma.categories.create({
      data: {
        id: 'cat_self_improvement',
        slug: 'self-improvement',
        icon: '🌟',
        color: '#27AE60',
        order: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create category translations
    console.log('🌐 Creating category translations...');
    
    await prisma.category_translations.createMany({
      data: [
        {
          id: 'cat_trans_comm_en',
          categoryId: communicationCategory.id,
          language: 'en',
          name: 'Communication',
          description: 'Effective communication strategies for relationships',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cat_trans_dating_en',
          categoryId: datingTipsCategory.id,
          language: 'en',
          name: 'Dating Tips',
          description: 'Expert advice for successful dating experiences',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cat_trans_rel_en',
          categoryId: relationshipsCategory.id,
          language: 'en',
          name: 'Relationships',
          description: 'Building and maintaining strong relationships',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cat_trans_self_en',
          categoryId: selfImprovementCategory.id,
          language: 'en',
          name: 'Self Improvement',
          description: 'Personal growth and development for better relationships',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    // Create tags
    console.log('🏷️ Creating tags...');
    
    const tags = [
      { id: 'tag_communication', slug: 'communication', color: '#4A90E2' },
      { id: 'tag_active_listening', slug: 'active-listening', color: '#5DADE2' },
      { id: 'tag_emotional_intelligence', slug: 'emotional-intelligence', color: '#85C1E9' },
      { id: 'tag_first_date', slug: 'first-date', color: '#E74C3C' },
      { id: 'tag_online_dating', slug: 'online-dating', color: '#EC7063' },
      { id: 'tag_confidence', slug: 'confidence', color: '#F1948A' },
      { id: 'tag_trust', slug: 'trust', color: '#9B59B6' },
      { id: 'tag_long_term', slug: 'long-term', color: '#BB8FCE' },
      { id: 'tag_conflict_resolution', slug: 'conflict-resolution', color: '#D2B4DE' },
      { id: 'tag_self_awareness', slug: 'self-awareness', color: '#27AE60' },
      { id: 'tag_personal_growth', slug: 'personal-growth', color: '#58D68D' },
      { id: 'tag_mindfulness', slug: 'mindfulness', color: '#85E085' },
    ];

    for (const tag of tags) {
      await prisma.tags.create({
        data: {
          ...tag,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Create tag translations
    await prisma.tag_translations.createMany({
      data: [
        { id: 'tag_trans_comm', tagId: 'tag_communication', language: 'en', name: 'Communication', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_listen', tagId: 'tag_active_listening', language: 'en', name: 'Active Listening', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_eq', tagId: 'tag_emotional_intelligence', language: 'en', name: 'Emotional Intelligence', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_first', tagId: 'tag_first_date', language: 'en', name: 'First Date', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_online', tagId: 'tag_online_dating', language: 'en', name: 'Online Dating', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_conf', tagId: 'tag_confidence', language: 'en', name: 'Confidence', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_trust', tagId: 'tag_trust', language: 'en', name: 'Trust', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_long', tagId: 'tag_long_term', language: 'en', name: 'Long-term Relationships', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_conflict', tagId: 'tag_conflict_resolution', language: 'en', name: 'Conflict Resolution', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_aware', tagId: 'tag_self_awareness', language: 'en', name: 'Self Awareness', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_growth', tagId: 'tag_personal_growth', language: 'en', name: 'Personal Growth', createdAt: new Date(), updatedAt: new Date() },
        { id: 'tag_trans_mind', tagId: 'tag_mindfulness', language: 'en', name: 'Mindfulness', createdAt: new Date(), updatedAt: new Date() },
      ],
    });

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
        categories: [communicationCategory.id],
        tags: ['tag_communication', 'tag_active_listening', 'tag_emotional_intelligence'],
        translations: {
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

### Non-Violent Communication
Focus on expressing needs rather than making accusations:

• Observe without evaluating
• Express feelings without blame
• Identify underlying needs
• Make specific, doable requests

## Building Better Communication Habits

### Daily Check-ins
Make communication a regular practice:

• Set aside time each day for meaningful conversation
• Share highlights and challenges from your day
• Express appreciation and gratitude
• Discuss future plans and dreams together

### Conflict as Opportunity
View disagreements as chances to grow:

• Approach conflicts with curiosity, not defensiveness
• Focus on finding solutions rather than winning
• Acknowledge when you're wrong and apologize sincerely
• Learn from each disagreement to prevent future issues

## The Digital Age Challenge

In our connected world, face-to-face communication often takes a backseat to digital interactions. Make an effort to:

• Put devices away during important conversations
• Choose phone calls over text for complex topics
• Meet in person when possible for serious discussions
• Be mindful of tone in written communication

## Creating Lasting Change

Developing strong communication skills takes practice and patience. Start by implementing one or two techniques at a time, rather than trying to change everything at once. Remember that good communication is a skill that benefits both partners and strengthens your relationship foundation.

The journey toward better communication is ongoing, but the rewards – deeper intimacy, stronger trust, and more satisfying relationships – make the effort worthwhile. Every conversation is an opportunity to connect more deeply with your partner and build the relationship you both desire.`,
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
        categories: [datingTipsCategory.id],
        tags: ['tag_first_date', 'tag_confidence', 'tag_online_dating'],
        translations: {
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

### 2. Dress Appropriately
Your appearance matters, but authenticity matters more:

• Dress for the occasion and venue
• Choose something that makes you feel confident
• Pay attention to personal grooming
• Don't wear something completely out of character

### 3. Prepare Conversation Topics
Having some topics in mind can ease anxiety:

• Think of interesting stories from your life
• Prepare thoughtful questions about their interests
• Stay current with events and topics you can discuss
• Avoid controversial subjects on the first date

## During the Date

### 4. Be Present and Engaged
Show genuine interest in getting to know them:

• Put your phone away and focus on the conversation
• Make eye contact and use positive body language
• Ask follow-up questions to show you're listening
• Share your own experiences and thoughts

### 5. Be Authentic
Honesty creates a foundation for genuine connection:

• Be yourself rather than trying to impress
• Share your real interests and passions
• Don't exaggerate or create false impressions
• Let your personality shine through naturally

### 6. Practice Good Manners
Small courtesies make a big difference:

• Be punctual and respectful of their time
• Offer to pay or discuss payment beforehand
• Be polite to waitstaff and others around you
• Express gratitude for their time and company

## Creating Connection

### 7. Find Common Ground
Look for shared interests and values:

• Listen for hobbies or activities you both enjoy
• Discuss travel experiences or places you'd like to visit
• Share your goals and aspirations
• Talk about books, movies, or music you both appreciate

### 8. Show Your Sense of Humor
Laughter creates bonds and eases tension:

• Share funny stories or observations
• Don't be afraid to laugh at yourself
• Keep humor light and inclusive
• Pay attention to their sense of humor too

### 9. Ask Meaningful Questions
Go beyond surface-level conversation:

• "What's something you're passionate about?"
• "What's the best advice you've ever received?"
• "What would your perfect weekend look like?"
• "What's something most people don't know about you?"

## Ending on a High Note

### 10. Communicate Your Interest
If you enjoyed the date, let them know:

• Express that you had a good time
• Be specific about what you enjoyed
• Suggest a second date if you're interested
• Follow up within a day or two after the date

## What to Avoid

While focusing on positive behaviors is important, it's equally crucial to avoid common first date mistakes:

• Don't talk exclusively about past relationships
• Avoid checking your phone constantly
• Don't interview them with rapid-fire questions
• Resist the urge to reveal too much too soon
• Don't make assumptions about their preferences or beliefs

## The Mindset Shift

Remember that a first date is not a job interview or a performance. It's an opportunity for two people to see if they enjoy each other's company. Approach it with curiosity and openness rather than pressure and expectations.

## Dealing with Nerves

First date anxiety is completely normal. Here are some strategies to manage it:

• Arrive a few minutes early to settle in
• Take deep breaths and remind yourself to have fun
• Focus on getting to know them rather than impressing them
• Remember that they're probably nervous too

## After the Date

Regardless of how the date went, handle the aftermath with grace:

• Send a thank you message within 24 hours
• Be honest if you're not interested in a second date
• If you are interested, suggest specific plans for next time
• Don't play games or wait arbitrary amounts of time to communicate

## Building for the Future

A successful first date is just the beginning. Use it as a foundation to build something meaningful by:

• Following through on any promises or plans you made
• Continuing to be authentic as you get to know each other better
• Taking things at a pace that's comfortable for both of you
• Maintaining the positive energy and interest you showed on the first date

Remember, the best first dates happen when both people feel comfortable being themselves. Focus on enjoying the experience and getting to know your date, and you'll be well on your way to first date success.`,
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
        categories: [relationshipsCategory.id],
        tags: ['tag_trust', 'tag_long_term', 'tag_communication'],
        translations: {
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

### Start with Self-Trust
Before you can build trust with others, you must trust yourself:

• Know your own values and stick to them
• Be honest about your capabilities and limitations
• Follow through on commitments you make to yourself
• Develop self-awareness about your patterns and triggers

### Small Actions, Big Impact
Trust is built through consistent small actions rather than grand gestures:

• Remembering important details about your partner's life
• Checking in regularly about their day and feelings
• Being punctual and reliable in daily interactions
• Showing interest in their goals and supporting their dreams

### Communication as Trust-Building
How you communicate directly impacts trust levels:

• Share your thoughts and feelings regularly
• Ask for what you need rather than expecting mind-reading
• Address concerns promptly rather than letting them fester
• Listen actively and respond with empathy

## Rebuilding After Trust is Broken

When trust is damaged, rebuilding requires patience, commitment, and consistent effort from both partners.

### Acknowledge the Damage
• Take full responsibility for your actions
• Understand the impact on your partner
• Avoid making excuses or minimizing the hurt
• Express genuine remorse and commitment to change

### Create a Plan for Rebuilding
• Discuss specific changes that need to happen
• Set realistic timelines and expectations
• Establish new boundaries or agreements if needed
• Consider couples counseling for additional support

### Demonstrate Change Through Actions
• Be consistent in your new behaviors
• Be patient with your partner's healing process
• Provide reassurance when asked
• Continue working on yourself and your patterns

## Trust in Different Areas

### Financial Trust
Money matters can significantly impact relationship trust:

• Be transparent about your financial situation
• Discuss major purchases before making them
• Work together on budgeting and financial goals
• Respect agreed-upon spending limits

### Social Trust
Trust extends to how you interact with others:

• Be transparent about friendships and social activities
• Include your partner in social decisions that affect them
• Maintain appropriate boundaries with others
• Support your partner in social situations

### Digital Trust
In our connected world, digital behavior affects trust:

• Be open about your online activities
• Respect your partner's privacy while being transparent
• Avoid secretive digital communications
• Discuss and agree on social media boundaries

## Maintaining Trust Long-term

### Regular Relationship Check-ins
Schedule time to discuss the health of your relationship:

• Talk about what's working well
• Address any concerns before they become major issues
• Celebrate progress and positive changes
• Adjust expectations and agreements as needed

### Continue Growing Together
Relationships that thrive are those where partners grow together:

• Support each other's personal development
• Try new experiences together
• Learn new skills as a couple
• Maintain individual interests while sharing others

### Practice Forgiveness
Healthy relationships require forgiveness for minor disappointments:

• Choose your battles wisely
• Let go of small slights and mistakes
• Focus on your partner's intentions, not just their actions
• Work together to prevent similar issues in the future

## When Professional Help is Needed

Sometimes building or rebuilding trust requires professional guidance:

• If trust has been severely damaged
• When communication consistently breaks down
• If patterns keep repeating despite efforts to change
• When individual issues are impacting the relationship

## The Rewards of Deep Trust

Relationships built on solid trust offer incredible rewards:

• Greater intimacy and emotional connection
• Increased security and peace of mind
• Better communication and conflict resolution
• Stronger partnership in facing life's challenges

## Moving Forward

Building trust is an ongoing process that requires intention, effort, and patience from both partners. It's not about perfection but about consistent effort to be trustworthy and to extend trust to your partner.

Remember that trust deepens over time through shared experiences, overcome challenges, and countless small moments of reliability and care. When both partners are committed to building and maintaining trust, they create a foundation strong enough to support a lifetime of love and partnership.

Trust is not just about avoiding betrayal – it's about actively building a relationship where both partners feel safe, valued, and secure in their love for each other.`,
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
        categories: [selfImprovementCategory.id],
        tags: ['tag_confidence', 'tag_self_awareness', 'tag_personal_growth'],
        translations: {
          title: 'Building Self-Confidence for Better Dating',
          subtitle: 'Develop authentic confidence that attracts meaningful connections',
          content: `Self-confidence is magnetic. It's what makes someone genuinely attractive, not just physically, but as a whole person. When you're confident in who you are, you naturally draw others to you and create the foundation for healthy, meaningful relationships.

## Understanding True Confidence

Real confidence isn't about arrogance or pretending to be perfect. It's about self-acceptance, knowing your worth, and being comfortable with who you are – flaws and all.

### The Difference Between Confidence and Arrogance

#### Confidence is:
• Being comfortable with yourself
• Acknowledging both strengths and weaknesses
• Listening to others and showing genuine interest
• Being open to learning and growing

#### Arrogance is:
• Needing to prove superiority
• Dismissing others' opinions or feelings
• Refusing to admit mistakes or weaknesses
• Making everything about yourself

## Building Genuine Self-Confidence

### Know Yourself
Self-awareness is the foundation of confidence:

• Identify your core values and live by them
• Recognize your strengths and unique qualities
• Acknowledge areas where you'd like to grow
• Understand your triggers and emotional patterns

### Develop Your Interests
Having passions and interests makes you more interesting:

• Pursue hobbies that genuinely excite you
• Learn new skills or explore new subjects
• Join groups or classes related to your interests
• Share your enthusiasm with others

### Take Care of Yourself
Self-care directly impacts how you feel about yourself:

• Maintain good physical health through exercise and nutrition
• Practice good hygiene and dress in a way that makes you feel good
• Get enough sleep and manage stress effectively
• Engage in activities that bring you joy and relaxation

## Confidence in Dating Situations

### Overcoming Dating Anxiety
It's normal to feel nervous about dating, but confidence can help:

• Prepare conversation topics but stay flexible
• Focus on getting to know the other person rather than impressing them
• Remember that rejection isn't a reflection of your worth
• View each date as practice and a chance to meet someone new

### Authentic Self-Presentation
Being genuine is more attractive than trying to be perfect:

• Share your real interests and passions
• Don't hide your personality to appear more appealing
• Be honest about your experiences and background
• Let your sense of humor show naturally

### Handling Rejection Gracefully
Confident people understand that not every match will work:

• Don't take rejection personally
• Thank them for their honesty
• Learn what you can from the experience
• Move forward without dwelling on what went wrong

## Internal Confidence Building

### Challenge Negative Self-Talk
We often are our own worst critics:

• Notice when you're being overly critical of yourself
• Replace negative thoughts with balanced, realistic ones
• Focus on your accomplishments and positive qualities
• Practice self-compassion when you make mistakes

### Set and Achieve Goals
Accomplishing goals builds confidence naturally:

• Set realistic, achievable goals for yourself
• Break larger goals into smaller, manageable steps
• Celebrate your progress along the way
• Learn from setbacks rather than being discouraged by them

### Practice Self-Acceptance
Embracing who you are is key to confidence:

• Accept that you're not perfect, and that's okay
• Focus on your unique qualities rather than comparing yourself to others
• Appreciate your journey and how far you've come
• Be kind to yourself during difficult times

## External Confidence Boosters

### Body Language and Presentation
How you carry yourself affects how others perceive you:

• Stand up straight and make eye contact
• Smile genuinely and often
• Use open body language
• Dress in a way that makes you feel confident

### Social Skills Development
Being comfortable in social situations builds confidence:

• Practice active listening in conversations
• Ask questions and show genuine interest in others
• Share appropriate personal stories and experiences
• Learn to be comfortable with brief silences

### Step Outside Your Comfort Zone
Growth happens when we challenge ourselves:

• Try new activities or experiences
• Attend social events even when you feel nervous
• Speak up in group conversations
• Take on new challenges at work or in your personal life

## Confidence in Relationships

### Maintaining Independence
Healthy relationships require two whole people:

• Keep your own friends and interests
• Don't lose yourself in the relationship
• Maintain your personal goals and aspirations
• Support your partner's independence as well

### Communicating Your Needs
Confident people can express what they need:

• Be clear about your boundaries and expectations
• Ask for support when you need it
• Express appreciation and affection openly
• Address concerns directly rather than hoping they'll resolve themselves

### Handling Conflict
Confidence helps navigate disagreements constructively:

• Stay calm and focused on resolving the issue
• Listen to your partner's perspective
• Admit when you're wrong and apologize sincerely
• Work together to find solutions

## Long-term Confidence Building

### Continuous Personal Growth
Confidence grows as you develop as a person:

• Read books and learn new things regularly
• Seek feedback and be open to constructive criticism
• Reflect on your experiences and what you've learned
• Set new challenges for yourself as you accomplish current goals

### Building a Support Network
Surrounding yourself with positive people boosts confidence:

• Cultivate friendships with people who support and encourage you
• Limit time with people who consistently bring you down
• Seek mentors or role models who inspire you
• Consider joining support groups or communities aligned with your interests

### Professional Development
Success in your career can boost overall confidence:

• Set professional goals and work toward them
• Develop new skills relevant to your field
• Seek leadership opportunities when possible
• Build a network of professional contacts

## Confidence Red Flags to Avoid

While building confidence, be aware of these potential pitfalls:

• Don't become overconfident or dismissive of others
• Avoid using confidence as a mask for deeper insecurities
• Don't confuse confidence with never feeling vulnerable
• Remember that true confidence includes humility

## The Confidence-Relationship Connection

When you're truly confident, you:

• Attract people who appreciate the real you
• Create relationships based on authenticity rather than pretense
• Handle relationship challenges more effectively
• Maintain your sense of self within the relationship

## Moving Forward with Confidence

Building self-confidence is a journey, not a destination. It requires ongoing effort, self-reflection, and patience with yourself. Remember that everyone has moments of self-doubt – the difference is in how you handle those moments and continue moving forward.

True confidence makes you not just more attractive to potential partners, but also a better partner yourself. When you know and value yourself, you're better able to recognize and appreciate others, creating the foundation for meaningful, lasting relationships.

Start where you are, use what you have, and do what you can. Each small step toward greater self-confidence is a step toward the relationships and life you want to create.`,
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
          status: article.status as any,
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
          title: article.translations.title,
          subtitle: article.translations.subtitle,
          content: article.translations.content,
          excerpt: article.translations.excerpt,
          author: article.translations.author,
          readTime: article.translations.readTime,
          icon: article.translations.icon,
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

if (require.main === module) {
  main();
}

export { seedArticlesSystem };