/**
 * BLONG API Services Index
 * Centralized exports for all API services and React Query hooks
 */

// Articles API
export {
  articlesApi,
  useArticles,
  useInfiniteArticles,
  useArticle,
  useArticleCategories,
  useUserBookmarks,
  useUserReadingHistory,
  useRecommendedArticles,
  useBookmarkArticle,
  useRemoveBookmark,
  useMarkAsRead,
  articlesCache,
} from './articlesApi';

// User Profile API
export {
  userProfileApi,
  useUserProfile,
  useUpdateUserProfile,
  useQuestionnaireData,
  useQuestionnaireAnswers,
  useSaveQuestionnaireAnswers,
  useCompletionStatus,
  useUserPreferences,
  useUpdateUserPreferences,
  useUserAnalytics,
  useUpdateUserPhase,
  useOnboardingStatus,
  useUpdateOnboardingStatus,
  userProfileCache,
} from './userProfileApi';

// Date Delivery API (existing)
export { dateDeliveryService } from '../dateDeliveryService';

// Re-export React Query configuration
export {
  queryClient,
  queryKeys,
  cacheUtils,
  queryErrorHandler,
} from '../../config/reactQueryConfig';

// Re-export loading hooks
export {
  useQueryWithLoading,
  useMutationWithLoading,
  useInfiniteQueryWithLoading,
  useScreenQuery,
  useInlineQuery,
} from '../../hooks/useQueryWithLoading';

// Re-export existing API configuration
export { API_CONFIG } from '../api';

// Common API utilities
export const apiUtils = {
  // Build query string from object
  buildQueryString: (params) => {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return new URLSearchParams(filtered).toString();
  },

  // Handle API errors consistently
  handleApiError: (error) => {
    console.error('API Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Network error. Please check your connection.';
    }
    
    if (error.message.includes('401')) {
      return 'Authentication required. Please log in.';
    }
    
    if (error.message.includes('403')) {
      return 'Access denied. You do not have permission.';
    }
    
    if (error.message.includes('404')) {
      return 'Resource not found.';
    }
    
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
    
    return error.message || 'An unexpected error occurred.';
  },

  // Format API response for consistent structure
  formatResponse: (response) => {
    return {
      data: response.data || response,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },
};

export default {
  articles: articlesApi,
  userProfile: userProfileApi,
  dateDelivery: dateDeliveryService,
};
