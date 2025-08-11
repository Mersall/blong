/**
 * BLONG React Query + Loading Integration
 * Seamlessly integrates React Query with our global loading system
 */

import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';
import { useLoading, useScreenLoading, useOperationLoading, useInlineLoading } from './useLoading';
import { LOADING_TYPES } from '../contexts/LoadingContext';
import { queryErrorHandler } from '../config/reactQueryConfig';

/**
 * Enhanced useQuery with integrated loading states
 */
export const useQueryWithLoading = (options = {}) => {
  const {
    loadingType = LOADING_TYPES.INLINE,
    loadingMessage = 'Loading...',
    loadingSubtitle = null,
    showLoadingOnRefetch = false,
    showLoadingOnBackground = false,
    ...queryOptions
  } = options;

  const { showLoading, hideLoading } = useLoading();
  const loadingIdRef = useRef(null);

  const query = useQuery({
    ...queryOptions,
    onError: (error) => {
      // Hide loading on error
      if (loadingIdRef.current) {
        hideLoading(loadingIdRef.current);
        loadingIdRef.current = null;
      }
      
      // Call original error handler if provided
      if (queryOptions.onError) {
        queryOptions.onError(error);
      }
    },
    onSuccess: (data) => {
      // Hide loading on success
      if (loadingIdRef.current) {
        hideLoading(loadingIdRef.current);
        loadingIdRef.current = null;
      }
      
      // Call original success handler if provided
      if (queryOptions.onSuccess) {
        queryOptions.onSuccess(data);
      }
    },
  });

  // Handle loading states
  useEffect(() => {
    const shouldShowLoading = 
      query.isLoading || 
      (showLoadingOnRefetch && query.isFetching && !query.isLoading) ||
      (showLoadingOnBackground && query.isRefetching);

    if (shouldShowLoading && !loadingIdRef.current) {
      loadingIdRef.current = showLoading({
        type: loadingType,
        message: loadingMessage,
        subtitle: loadingSubtitle,
      });
    } else if (!shouldShowLoading && loadingIdRef.current) {
      hideLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [
    query.isLoading,
    query.isFetching,
    query.isRefetching,
    showLoadingOnRefetch,
    showLoadingOnBackground,
    loadingType,
    loadingMessage,
    loadingSubtitle,
    showLoading,
    hideLoading,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingIdRef.current) {
        hideLoading(loadingIdRef.current);
      }
    };
  }, [hideLoading]);

  return {
    ...query,
    // Enhanced error message
    errorMessage: query.error ? queryErrorHandler(query.error) : null,
  };
};

/**
 * Screen-level query with full screen loading
 */
export const useScreenQuery = (options = {}) => {
  return useQueryWithLoading({
    loadingType: LOADING_TYPES.SCREEN,
    loadingMessage: 'Loading...',
    loadingSubtitle: 'Please wait while we prepare your content',
    ...options,
  });
};

/**
 * Inline query for content areas
 */
export const useInlineQuery = (options = {}) => {
  return useQueryWithLoading({
    loadingType: LOADING_TYPES.INLINE,
    loadingMessage: 'Loading...',
    ...options,
  });
};

/**
 * Enhanced useMutation with integrated loading states
 */
export const useMutationWithLoading = (options = {}) => {
  const {
    loadingType = LOADING_TYPES.OPERATION,
    loadingMessage = 'Processing...',
    loadingSubtitle = null,
    showProgress = false,
    ...mutationOptions
  } = options;

  const { showLoading, hideLoading, updateProgress } = useLoading();
  const loadingIdRef = useRef(null);

  const mutation = useMutation({
    ...mutationOptions,
    onMutate: async (variables) => {
      // Show loading
      loadingIdRef.current = showLoading({
        type: loadingType,
        message: loadingMessage,
        subtitle: loadingSubtitle,
        showProgress,
        progress: 0,
      });

      // Call original onMutate if provided
      if (mutationOptions.onMutate) {
        return await mutationOptions.onMutate(variables);
      }
    },
    onSuccess: (data, variables, context) => {
      // Hide loading
      if (loadingIdRef.current) {
        hideLoading(loadingIdRef.current);
        loadingIdRef.current = null;
      }

      // Call original onSuccess if provided
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Hide loading
      if (loadingIdRef.current) {
        hideLoading(loadingIdRef.current);
        loadingIdRef.current = null;
      }

      // Call original onError if provided
      if (mutationOptions.onError) {
        mutationOptions.onError(error, variables, context);
      }
    },
  });

  // Progress update function
  const updateMutationProgress = useCallback((progress, message) => {
    if (loadingIdRef.current) {
      updateProgress(loadingIdRef.current, progress, message);
    }
  }, [updateProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingIdRef.current) {
        hideLoading(loadingIdRef.current);
      }
    };
  }, [hideLoading]);

  return {
    ...mutation,
    updateProgress: updateMutationProgress,
    errorMessage: mutation.error ? queryErrorHandler(mutation.error) : null,
  };
};

/**
 * Enhanced useInfiniteQuery with pagination loading
 */
export const useInfiniteQueryWithLoading = (options = {}) => {
  const {
    loadingType = LOADING_TYPES.INLINE,
    loadingMessage = 'Loading...',
    paginationMessage = 'Loading more...',
    ...queryOptions
  } = options;

  const { showInlineLoading, hideInlineLoading } = useInlineLoading();
  const initialLoadingIdRef = useRef(null);
  const paginationLoadingIdRef = useRef(null);

  const query = useInfiniteQuery({
    ...queryOptions,
    onError: (error) => {
      // Hide all loading states
      if (initialLoadingIdRef.current) {
        hideInlineLoading(initialLoadingIdRef.current);
        initialLoadingIdRef.current = null;
      }
      if (paginationLoadingIdRef.current) {
        hideInlineLoading(paginationLoadingIdRef.current);
        paginationLoadingIdRef.current = null;
      }
      
      if (queryOptions.onError) {
        queryOptions.onError(error);
      }
    },
  });

  // Handle initial loading
  useEffect(() => {
    if (query.isLoading && !initialLoadingIdRef.current) {
      initialLoadingIdRef.current = showInlineLoading(loadingMessage);
    } else if (!query.isLoading && initialLoadingIdRef.current) {
      hideInlineLoading(initialLoadingIdRef.current);
      initialLoadingIdRef.current = null;
    }
  }, [query.isLoading, loadingMessage, showInlineLoading, hideInlineLoading]);

  // Handle pagination loading
  useEffect(() => {
    if (query.isFetchingNextPage && !paginationLoadingIdRef.current) {
      paginationLoadingIdRef.current = showInlineLoading(paginationMessage);
    } else if (!query.isFetchingNextPage && paginationLoadingIdRef.current) {
      hideInlineLoading(paginationLoadingIdRef.current);
      paginationLoadingIdRef.current = null;
    }
  }, [query.isFetchingNextPage, paginationMessage, showInlineLoading, hideInlineLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (initialLoadingIdRef.current) {
        hideInlineLoading(initialLoadingIdRef.current);
      }
      if (paginationLoadingIdRef.current) {
        hideInlineLoading(paginationLoadingIdRef.current);
      }
    };
  }, [hideInlineLoading]);

  return {
    ...query,
    errorMessage: query.error ? queryErrorHandler(query.error) : null,
  };
};

/**
 * Utility hook for React Navigation screen focus refetch
 */
export const useRefreshOnFocus = (refetch) => {
  const { useFocusEffect } = require('@react-navigation/native');
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );
};

export default useQueryWithLoading;
