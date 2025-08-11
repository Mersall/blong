/**
 * BLONG Article Detail Screen - Premium Elite Design
 * Full article reading experience
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Share,
  Dimensions 
} from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import EnhancedArticleReader from '../../components/articles/EnhancedArticleReader';
import {
  useArticle,
  useBookmarkArticle,
  useRemoveBookmark,
  useMarkAsRead
} from '../../services/api/articlesApi';

// MANDATORY COLORS - Following Design Rules
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
};

const { width } = Dimensions.get('window');

const ArticleDetailScreen = ({ articleId, onBack }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);

  // React Query hooks
  const { data: articleData, isLoading, error } = useArticle(articleId);
  const bookmarkMutation = useBookmarkArticle();
  const removeBookmarkMutation = useRemoveBookmark();
  const markAsReadMutation = useMarkAsRead();

  const article = articleData?.article;

  useEffect(() => {
    if (article) {
      setIsBookmarked(article.isBookmarked || false);
    }
  }, [article]);

  // Mark as read only once when article loads (separate effect)
  useEffect(() => {
    if (article && !article.isRead && !hasMarkedAsRead) {
      console.log('📖 Marking article as read:', articleId);
      markAsReadMutation.mutate(articleId);
      setHasMarkedAsRead(true);
    }
  }, [article?.id, hasMarkedAsRead]); // Only run when article ID changes

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmarkMutation.mutate(articleId, {
        onSuccess: () => setIsBookmarked(false)
      });
    } else {
      bookmarkMutation.mutate(articleId, {
        onSuccess: () => setIsBookmarked(true)
      });
    }
  };

  const handleShare = async () => {
    if (article) {
      try {
        await Share.share({
          message: `${article.title}\n\n${article.subtitle}\n\nRead more on BLONG app`,
          title: article.title,
        });
      } catch (error) {
        console.error('Error sharing article:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          
          {/* Elite Header */}
          <View style={{
            paddingTop: 40,
            paddingBottom: 32,
            paddingHorizontal: 32,
            alignItems: 'center',
            backgroundColor: COLORS.background,
          }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '300',
              letterSpacing: 8,
              color: COLORS.text,
              marginBottom: 16,
            }}>
              BLONG
            </Text>

            <View style={{
              width: 40,
              height: 2,
              backgroundColor: COLORS.accent,
              marginBottom: 24,
            }} />

            <Text style={{
              fontSize: 20,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Loading Article
            </Text>

            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Preparing your reading experience
            </Text>
          </View>
        </SafeAreaView>
      </AppTransition>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
          }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📄</Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Article Not Found
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 24,
            }}>
              This article may have been removed or is temporarily unavailable
            </Text>
            
            <TouchableOpacity
              onPress={onBack}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 24,
                backgroundColor: COLORS.accent,
              }}
            >
              <Text style={{
                fontSize: 14,
                color: COLORS.background,
                fontWeight: '500',
              }}>
                Back to Articles
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </AppTransition>
    );
  }

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header with Navigation */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={onBack}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Article
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={handleBookmarkToggle}
                style={{ marginRight: 16 }}
              >
                <Text style={{ fontSize: 20 }}>
                  {isBookmarked ? '🔖' : '📖'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleShare}>
                <Text style={{ fontSize: 20 }}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Article Content with Enhanced Reader */}
        <View style={{ flex: 1 }}>
          <EnhancedArticleReader
            content={`# ${article.title}

${article.subtitle}

**By ${article.author || 'BLONG Expert'}** • ${article.readTime}

---

${article.content || `This is the full content of "${article.title}". 

In a real implementation, this would contain the complete article text with proper formatting, paragraphs, and rich content.

## The BLONG Approach to Relationships

The article would provide valuable insights and advice for BLONG users on their relationship journey.

### Key points covered in this article:

• Expert relationship advice
• Practical dating tips  
• Communication strategies
• Building lasting connections

This premium content is designed to help BLONG users navigate their romantic relationships with confidence and success.

## Conclusion

Remember that every relationship journey is unique, and the most important thing is to stay true to yourself while being open to growth and new experiences.`}

${article.tags && article.tags.length > 0 ? `

---

**Related Topics:** ${article.tags.map(tag => `#${tag}`).join(', ')}` : ''}`}
            onReadingProgress={(progress) => {
              // Track reading progress
              if (progress > 0.8 && !hasMarkedAsRead) {
                // Mark as read when 80% complete (only once)
                console.log('📖 Marking article as read via reading progress:', articleId);
                markAsReadMutation.mutate(articleId);
                setHasMarkedAsRead(true);
              }
            }}
            readingTime={article.readTime}
          />
        </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default ArticleDetailScreen;
