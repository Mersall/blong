/**
 * BLONG React Query Configuration
 * TanStack Query v4 setup optimized for React Native with premium loading integration
 */

import { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager, focusManager } from '@tanstack/react-query';

// React Query Configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data is fresh for 10 minutes (increased for better caching)
      staleTime: 10 * 60 * 1000,

      // Cache time - data stays in cache for 30 minutes after becoming unused (increased)
      cacheTime: 30 * 60 * 1000,

      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus (disabled for better tab switching)
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Background refetch interval (disabled by default)
      refetchInterval: false,

      // Refetch on mount only if data is stale (improved caching behavior)
      refetchOnMount: 'stale',
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// React Native specific configurations
export const setupReactQueryForReactNative = () => {
  // Online status management
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(!!state.isConnected);
    });
  });

  // App focus management
  const onAppStateChange = (status) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  };

  const subscription = AppState.addEventListener('change', onAppStateChange);
  
  return () => subscription?.remove();
};

// Custom hook for React Native focus management
export const useReactQueryFocus = () => {
  useEffect(() => {
    const cleanup = setupReactQueryForReactNative();
    return cleanup;
  }, []);
};

// Query key factory for consistent key management
export const queryKeys = {
  // User related queries
  user: {
    all: ['user'],
    profile: () => [...queryKeys.user.all, 'profile'],
    preferences: () => [...queryKeys.user.all, 'preferences'],
    questionnaire: (phase) => [...queryKeys.user.all, 'questionnaire', phase],
  },
  
  // Dates related queries
  dates: {
    all: ['dates'],
    list: (filters) => [...queryKeys.dates.all, 'list', filters],
    detail: (id) => [...queryKeys.dates.all, 'detail', id],
    history: () => [...queryKeys.dates.all, 'history'],
  },
  
  // Matches related queries
  matches: {
    all: ['matches'],
    list: (filters) => [...queryKeys.matches.all, 'list', filters],
    detail: (id) => [...queryKeys.matches.all, 'detail', id],
    compatibility: (id) => [...queryKeys.matches.all, 'compatibility', id],
  },
  
  // Articles related queries
  articles: {
    all: ['articles'],
    list: (category) => [...queryKeys.articles.all, 'list', category],
    detail: (id) => [...queryKeys.articles.all, 'detail', id],
  },
  
  // Auth related queries
  auth: {
    all: ['auth'],
    currentUser: () => [...queryKeys.auth.all, 'currentUser'],
    session: () => [...queryKeys.auth.all, 'session'],
  },
};

// Error handling configuration
export const queryErrorHandler = (error) => {
  console.error('React Query Error:', error);
  
  // You can integrate with your error reporting service here
  // Example: Sentry.captureException(error);
  
  // Return user-friendly error message
  if (error?.status === 401) {
    return 'Please log in to continue';
  } else if (error?.status === 403) {
    return 'You do not have permission to access this resource';
  } else if (error?.status === 404) {
    return 'The requested resource was not found';
  } else if (error?.status >= 500) {
    return 'Server error. Please try again later';
  } else if (!navigator.onLine) {
    return 'Please check your internet connection';
  }
  
  return error?.message || 'An unexpected error occurred';
};

// Cache management utilities
export const cacheUtils = {
  // Invalidate all queries for a specific key
  invalidateQueries: (queryKey) => {
    return queryClient.invalidateQueries({ queryKey });
  },
  
  // Remove specific query from cache
  removeQueries: (queryKey) => {
    return queryClient.removeQueries({ queryKey });
  },
  
  // Clear all cache
  clearCache: () => {
    return queryClient.clear();
  },
  
  // Get cached data
  getQueryData: (queryKey) => {
    return queryClient.getQueryData(queryKey);
  },
  
  // Set cached data
  setQueryData: (queryKey, data) => {
    return queryClient.setQueryData(queryKey, data);
  },
  
  // Prefetch query
  prefetchQuery: (options) => {
    return queryClient.prefetchQuery(options);
  },
};

// Development helpers
export const devTools = {
  // Log cache contents (development only)
  logCache: () => {
    if (__DEV__) {
      console.log('🔍 React Query Cache:', queryClient.getQueryCache().getAll());
    }
  },

  // Get cache statistics
  getCacheStats: () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    const stats = {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      loadingQueries: queries.filter(q => q.state.status === 'loading').length,
      successQueries: queries.filter(q => q.state.status === 'success').length,
    };

    if (__DEV__) {
      console.log('📊 React Query Cache Stats:', stats);
    }

    return stats;
  },

  // Monitor cache performance
  monitorCachePerformance: () => {
    if (__DEV__) {
      const cache = queryClient.getQueryCache();

      // Log cache hits/misses
      const originalGet = cache.get.bind(cache);
      cache.get = (queryHash) => {
        const result = originalGet(queryHash);
        if (result) {
          console.log('✅ Cache HIT for:', queryHash);
        } else {
          console.log('❌ Cache MISS for:', queryHash);
        }
        return result;
      };

      console.log('🔍 React Query cache monitoring enabled');
    }
  },
};

export default queryClient;
