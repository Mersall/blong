/**
 * BLONG Articles API Service
 * React Query integration for articles functionality
 */

import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys, cacheUtils } from '../../config/reactQueryConfig';
import { useQueryWithLoading, useMutationWithLoading, useInfiniteQueryWithLoading } from '../../hooks/useQueryWithLoading';
import { LOADING_TYPES } from '../../contexts/LoadingContext';
import { apiClient } from '../api';

// Helper function to build query string
const buildQueryString = (params) => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return new URLSearchParams(filtered).toString();
};

// Articles API functions using existing apiClient
export const articlesApi = {
  getArticles: async (params = {}) => {
    const queryString = buildQueryString(params);
    const endpoint = `/articles${queryString ? `?${queryString}` : ''}`;
    return await apiClient.request(endpoint);
  },

  getArticleById: async (id) => {
    return await apiClient.request(`/articles/${id}`);
  },

  getCategories: async () => {
    return await apiClient.request('/articles/categories');
  },

  getUserBookmarks: async (params = {}) => {
    const queryString = buildQueryString(params);
    const endpoint = `/articles/user/bookmarks${queryString ? `?${queryString}` : ''}`;
    return await apiClient.request(endpoint);
  },

  getUserReadingHistory: async (params = {}) => {
    const queryString = buildQueryString(params);
    const endpoint = `/articles/user/history${queryString ? `?${queryString}` : ''}`;
    return await apiClient.request(endpoint);
  },

  getRecommendedArticles: async (limit) => {
    return await apiClient.request(`/articles/user/recommended?limit=${limit}`);
  },

  bookmarkArticle: async (id) => {
    return await apiClient.request(`/articles/${id}/bookmark`, { method: 'POST' });
  },

  removeBookmark: async (id) => {
    return await apiClient.request(`/articles/${id}/bookmark`, { method: 'DELETE' });
  },

  markAsRead: async (id) => {
    return await apiClient.request(`/articles/${id}/read`, { method: 'POST' });
  },
};

// React Query Hooks for Articles

/**
 * Get articles list with pagination and filtering
 */
export const useArticles = (filters = {}) => {
  return useQueryWithLoading({
    queryKey: queryKeys.articles.list(filters),
    queryFn: () => articlesApi.getArticles(filters),
    loadingType: LOADING_TYPES.INLINE,
    loadingMessage: 'Loading articles...',
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get articles with infinite scroll pagination
 */
export const useInfiniteArticles = (filters = {}) => {
  return useInfiniteQueryWithLoading({
    queryKey: queryKeys.articles.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      articlesApi.getArticles({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.hasMore ? pagination.page + 1 : undefined;
    },
    loadingMessage: 'Loading articles...',
    paginationMessage: 'Loading more articles...',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get single article by ID
 */
export const useArticle = (id, options = {}) => {
  return useQueryWithLoading({
    queryKey: queryKeys.articles.detail(id),
    queryFn: () => articlesApi.getArticleById(id),
    loadingType: LOADING_TYPES.SCREEN,
    loadingMessage: 'Loading article...',
    loadingSubtitle: 'Preparing your content',
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes for individual articles
    ...options,
  });
};

/**
 * Get article categories
 */
export const useArticleCategories = () => {
  return useQuery({
    queryKey: queryKeys.articles.all.concat('categories'),
    queryFn: articlesApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Get user's bookmarked articles
 */
export const useUserBookmarks = (params = {}) => {
  return useQueryWithLoading({
    queryKey: queryKeys.articles.all.concat('bookmarks', params),
    queryFn: () => articlesApi.getUserBookmarks(params),
    loadingType: LOADING_TYPES.INLINE,
    loadingMessage: 'Loading bookmarks...',
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get user's reading history
 */
export const useUserReadingHistory = (params = {}) => {
  return useQueryWithLoading({
    queryKey: queryKeys.articles.all.concat('history', params),
    queryFn: () => articlesApi.getUserReadingHistory(params),
    loadingType: LOADING_TYPES.INLINE,
    loadingMessage: 'Loading reading history...',
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Get recommended articles
 */
export const useRecommendedArticles = (limit = 5) => {
  return useQuery({
    queryKey: queryKeys.articles.all.concat('recommended', limit),
    queryFn: () => articlesApi.getRecommendedArticles(limit),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Bookmark article mutation
 */
export const useBookmarkArticle = () => {
  return useMutationWithLoading({
    mutationFn: articlesApi.bookmarkArticle,
    loadingMessage: 'Bookmarking article...',
    onSuccess: (data, articleId) => {
      // Invalidate bookmarks and article queries
      cacheUtils.invalidateQueries(queryKeys.articles.all.concat('bookmarks'));
      cacheUtils.invalidateQueries(queryKeys.articles.detail(articleId));
    },
  });
};

/**
 * Remove bookmark mutation
 */
export const useRemoveBookmark = () => {
  return useMutationWithLoading({
    mutationFn: articlesApi.removeBookmark,
    loadingMessage: 'Removing bookmark...',
    onSuccess: (data, articleId) => {
      // Invalidate bookmarks and article queries
      cacheUtils.invalidateQueries(queryKeys.articles.all.concat('bookmarks'));
      cacheUtils.invalidateQueries(queryKeys.articles.detail(articleId));
    },
  });
};

/**
 * Mark article as read mutation
 */
export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: articlesApi.markAsRead,
    onSuccess: (data, articleId) => {
      // Invalidate reading history
      cacheUtils.invalidateQueries(queryKeys.articles.all.concat('history'));
      cacheUtils.invalidateQueries(queryKeys.articles.detail(articleId));
    },
  });
};

// Utility functions for cache management
export const articlesCache = {
  // Prefetch article for better UX
  prefetchArticle: (id) => {
    return cacheUtils.prefetchQuery({
      queryKey: queryKeys.articles.detail(id),
      queryFn: () => articlesApi.getArticleById(id),
      staleTime: 10 * 60 * 1000,
    });
  },

  // Invalidate all articles cache
  invalidateAll: () => {
    return cacheUtils.invalidateQueries(queryKeys.articles.all);
  },

  // Get cached article data
  getCachedArticle: (id) => {
    return cacheUtils.getQueryData(queryKeys.articles.detail(id));
  },

  // Set article data in cache
  setCachedArticle: (id, data) => {
    return cacheUtils.setQueryData(queryKeys.articles.detail(id), data);
  },
};

export default articlesApi;
