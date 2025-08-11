/**
 * BLONG Articles Screen - Premium Elite Design
 * Dating advice and relationship articles
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import {
  useInfiniteArticles,
  useArticleCategories,
  useRecommendedArticles,
  useBookmarkArticle,
  useRemoveBookmark,
  useMarkAsRead
} from '../../services/api/articlesApi';
import { PremiumInlineLoader } from '../../components/loading';
import ArticleDetailScreen from './ArticleDetailScreen';

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

const ArticlesScreen = ({ userPhase, onNavigateToArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [showArticleDetail, setShowArticleDetail] = useState(false);

  // React Query hooks
  const {
    data: articlesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useInfiniteArticles({
    category: selectedCategory,
    search: searchQuery,
    limit: 10,
  });

  const { data: categoriesData } = useArticleCategories();
  const { data: recommendedData } = useRecommendedArticles(3);

  // Mutations
  const bookmarkMutation = useBookmarkArticle();
  const removeBookmarkMutation = useRemoveBookmark();
  const markAsReadMutation = useMarkAsRead();

  // Flatten articles from all pages
  const articles = articlesData?.pages?.flatMap(page => page.articles) || [];
  const categories = categoriesData?.categories || [];
  const recommendedArticles = recommendedData?.recommended || [];

  // Event handlers
  const handleArticlePress = (article) => {
    // Mark as read
    markAsReadMutation.mutate(article.id);

    // Show article detail screen
    setSelectedArticleId(article.id);
    setShowArticleDetail(true);

    // Also call the prop callback if provided
    if (onNavigateToArticle) {
      onNavigateToArticle(article);
    }
  };

  const handleBackFromArticle = () => {
    setShowArticleDetail(false);
    setSelectedArticleId(null);
  };

  const handleBookmarkToggle = (article) => {
    if (article.isBookmarked) {
      removeBookmarkMutation.mutate(article.id);
    } else {
      bookmarkMutation.mutate(article.id);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Show article detail if selected
  if (showArticleDetail && selectedArticleId) {
    return (
      <ArticleDetailScreen
        articleId={selectedArticleId}
        onBack={handleBackFromArticle}
      />
    );
  }

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header - Following Design Rules */}
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
            Dating Articles
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Expert advice for your relationship journey
          </Text>
        </View>

        {/* Articles List with React Query - Following Design Rules */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={COLORS.accent}
            />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

            if (isCloseToBottom) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {/* Error State */}
          {error && (
            <View style={{
              alignItems: 'center',
              paddingVertical: 40,
            }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
              <Text style={{
                fontSize: 16,
                color: COLORS.text,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                Unable to load articles
              </Text>
              <TouchableOpacity
                onPress={handleRefresh}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 24,
                  backgroundColor: COLORS.accent,
                  marginTop: 16,
                }}
              >
                <Text style={{
                  fontSize: 14,
                  color: COLORS.background,
                  fontWeight: '500',
                }}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Articles List */}
          {!error && articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              onPress={() => handleArticlePress(article)}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Text style={{
                  fontSize: 20,
                  marginRight: 12,
                }}>
                  {article.icon}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.accent,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}>
                    {article.category.toUpperCase()}
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '300',
                    color: COLORS.text,
                    marginBottom: 4,
                  }}>
                    {article.title}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  color: COLORS.accent,
                  fontWeight: '300',
                }}>
                  →
                </Text>
              </View>

              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                lineHeight: 20,
                marginBottom: 12,
              }}>
                {article.subtitle}
              </Text>

              <Text style={{
                fontSize: 12,
                color: COLORS.textTertiary,
              }}>
                {article.readTime}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Loading More Indicator */}
          {isFetchingNextPage && (
            <PremiumInlineLoader
              message="Loading more articles..."
              size="small"
              style={{ paddingVertical: 20 }}
            />
          )}

          {/* Empty State */}
          {!isLoading && !error && articles.length === 0 && (
            <View style={{
              alignItems: 'center',
              paddingVertical: 60,
            }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📚</Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '300',
                color: COLORS.text,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                No Articles Found
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
              }}>
                Check back soon for expert dating advice
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default ArticlesScreen;
