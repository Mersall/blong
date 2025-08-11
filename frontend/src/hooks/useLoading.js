/**
 * BLONG Universal Loading Hook
 * Simple, powerful API for managing loading states across the application
 */

import { useCallback, useEffect, useRef } from 'react';
import { useLoadingContext, LOADING_TYPES, LOADING_PRIORITIES } from '../contexts/LoadingContext';
import { loadingManager } from '../services/loadingManager';

/**
 * Main loading hook with automatic cleanup
 */
export const useLoading = (defaultConfig = {}) => {
  const loadingContext = useLoadingContext();
  const activeLoadingIds = useRef(new Set());
  const mountedRef = useRef(true);

  // Initialize loading manager with context
  useEffect(() => {
    loadingManager.initialize(loadingContext);
  }, [loadingContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Hide all loading states created by this hook
      activeLoadingIds.current.forEach(id => {
        loadingContext.hideLoading(id);
      });
      activeLoadingIds.current.clear();
    };
  }, [loadingContext]);

  // Show loading with automatic tracking
  const showLoading = useCallback((config = {}) => {
    if (!mountedRef.current) return null;

    const finalConfig = { ...defaultConfig, ...config };
    const loadingId = loadingContext.showLoading(finalConfig);
    
    if (loadingId) {
      activeLoadingIds.current.add(loadingId);
    }
    
    return loadingId;
  }, [loadingContext, defaultConfig]);

  // Hide specific loading
  const hideLoading = useCallback((loadingId) => {
    if (!mountedRef.current || !loadingId) return;

    loadingContext.hideLoading(loadingId);
    activeLoadingIds.current.delete(loadingId);
  }, [loadingContext]);

  // Hide all loading states from this hook
  const hideAllLoading = useCallback(() => {
    if (!mountedRef.current) return;

    activeLoadingIds.current.forEach(id => {
      loadingContext.hideLoading(id);
    });
    activeLoadingIds.current.clear();
  }, [loadingContext]);

  // Execute operation with loading
  const withLoading = useCallback(async (operation, config = {}) => {
    if (!mountedRef.current) return await operation();

    return await loadingManager.withLoading(operation, {
      ...defaultConfig,
      ...config,
    });
  }, [defaultConfig]);

  return {
    // Basic API
    showLoading,
    hideLoading,
    hideAllLoading,
    withLoading,
    
    // State
    isLoading: loadingContext.isLoading,
    activeLoading: loadingContext.activeLoading,
    
    // Advanced API
    updateProgress: loadingContext.updateLoadingProgress,
    isLoadingType: loadingContext.isLoadingType,
  };
};

/**
 * Screen-level loading hook
 */
export const useScreenLoading = () => {
  const { showLoading, hideLoading, withLoading, isLoading } = useLoading({
    type: LOADING_TYPES.SCREEN,
    priority: LOADING_PRIORITIES.HIGH,
  });

  const showScreenLoading = useCallback((message = 'Loading...', subtitle = null) => {
    return showLoading({ message, subtitle });
  }, [showLoading]);

  return {
    showScreenLoading,
    hideScreenLoading: hideLoading,
    withScreenLoading: withLoading,
    isScreenLoading: isLoading,
  };
};

/**
 * Operation-level loading hook
 */
export const useOperationLoading = () => {
  const { showLoading, hideLoading, withLoading, updateProgress } = useLoading({
    type: LOADING_TYPES.OPERATION,
    priority: LOADING_PRIORITIES.MEDIUM,
  });

  const showOperationLoading = useCallback((message = 'Processing...', options = {}) => {
    return showLoading({ message, ...options });
  }, [showLoading]);

  return {
    showOperationLoading,
    hideOperationLoading: hideLoading,
    withOperationLoading: withLoading,
    updateOperationProgress: updateProgress,
  };
};

/**
 * Inline loading hook for content areas
 */
export const useInlineLoading = () => {
  const { showLoading, hideLoading, isLoadingType } = useLoading({
    type: LOADING_TYPES.INLINE,
    priority: LOADING_PRIORITIES.LOW,
  });

  const showInlineLoading = useCallback((message = 'Loading...') => {
    return showLoading({ message });
  }, [showLoading]);

  return {
    showInlineLoading,
    hideInlineLoading: hideLoading,
    isInlineLoading: isLoadingType(LOADING_TYPES.INLINE),
  };
};

/**
 * Debounced loading hook - prevents flickering
 */
export const useDebouncedLoading = (delay = 300) => {
  const keyRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const showDebouncedLoading = useCallback((config = {}) => {
    if (!mountedRef.current) return null;

    const key = `debounced_${++keyRef.current}`;
    loadingManager.showDebouncedLoading(key, config, delay);
    return key;
  }, [delay]);

  const hideDebouncedLoading = useCallback((key) => {
    if (!mountedRef.current || !key) return;
    loadingManager.hideDebouncedLoading(key);
  }, []);

  return {
    showDebouncedLoading,
    hideDebouncedLoading,
  };
};

/**
 * Batch loading hook for multiple operations
 */
export const useBatchLoading = () => {
  const withBatchLoading = useCallback(async (operations, config = {}) => {
    return await loadingManager.withBatchLoading(operations, config);
  }, []);

  return {
    withBatchLoading,
  };
};

/**
 * Retry loading hook with automatic retry logic
 */
export const useRetryLoading = () => {
  const withRetryLoading = useCallback(async (operation, config = {}) => {
    return await loadingManager.withRetryLoading(operation, config);
  }, []);

  return {
    withRetryLoading,
  };
};

/**
 * Simple loading hook for basic use cases
 */
export const useSimpleLoading = (initialLoading = false) => {
  const loadingIdRef = useRef(null);
  const { showLoading, hideLoading } = useLoading();

  const setLoading = useCallback((loading, message = 'Loading...') => {
    if (loading && !loadingIdRef.current) {
      loadingIdRef.current = showLoading({ message });
    } else if (!loading && loadingIdRef.current) {
      hideLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [showLoading, hideLoading]);

  // Initialize with initial state
  useEffect(() => {
    if (initialLoading) {
      setLoading(true);
    }
  }, [initialLoading, setLoading]);

  return {
    setLoading,
    isLoading: !!loadingIdRef.current,
  };
};

/**
 * Loading hook with automatic async operation handling
 */
export const useAsyncLoading = () => {
  const { withLoading } = useLoading();

  const executeWithLoading = useCallback(async (
    asyncOperation,
    loadingMessage = 'Processing...',
    errorHandler = null
  ) => {
    try {
      return await withLoading(asyncOperation, { message: loadingMessage });
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        console.error('Async operation failed:', error);
      }
      throw error;
    }
  }, [withLoading]);

  return {
    executeWithLoading,
  };
};

export default useLoading;
