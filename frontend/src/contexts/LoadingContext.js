/**
 * BLONG Global Loading Context
 * Centralized loading state management for the entire application
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// Loading Types
export const LOADING_TYPES = {
  SCREEN: 'screen',           // Full screen loading
  OPERATION: 'operation',     // Specific operation loading
  BACKGROUND: 'background',   // Background process loading
  INLINE: 'inline',          // Inline content loading
};

// Loading Priorities
export const LOADING_PRIORITIES = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

// Default loading configuration
const DEFAULT_CONFIG = {
  type: LOADING_TYPES.OPERATION,
  priority: LOADING_PRIORITIES.MEDIUM,
  message: 'Loading...',
  subtitle: null,
  showProgress: false,
  progress: 0,
  timeout: 30000, // 30 seconds default timeout
};

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState(new Map());
  const [activeLoading, setActiveLoading] = useState(null);
  const timeoutRefs = useRef(new Map());
  const loadingCounter = useRef(0);

  // Generate unique loading ID
  const generateLoadingId = useCallback(() => {
    loadingCounter.current += 1;
    return `loading_${Date.now()}_${loadingCounter.current}`;
  }, []);

  // Determine which loading should be active based on priority
  const determineActiveLoading = useCallback((states) => {
    if (states.size === 0) return null;

    let highestPriority = 0;
    let activeState = null;

    states.forEach((state) => {
      if (state.priority > highestPriority) {
        highestPriority = state.priority;
        activeState = state;
      }
    });

    return activeState;
  }, []);

  // Show loading with configuration
  const showLoading = useCallback((config = {}) => {
    const loadingId = generateLoadingId();
    const loadingConfig = { ...DEFAULT_CONFIG, ...config, id: loadingId };

    setLoadingStates(prev => {
      const newStates = new Map(prev);
      newStates.set(loadingId, loadingConfig);
      
      // Update active loading
      const newActive = determineActiveLoading(newStates);
      setActiveLoading(newActive);
      
      return newStates;
    });

    // Set timeout if specified
    if (loadingConfig.timeout > 0) {
      const timeoutId = setTimeout(() => {
        hideLoading(loadingId);
      }, loadingConfig.timeout);
      
      timeoutRefs.current.set(loadingId, timeoutId);
    }

    return loadingId;
  }, [generateLoadingId, determineActiveLoading]);

  // Hide specific loading
  const hideLoading = useCallback((loadingId) => {
    if (!loadingId) return;

    setLoadingStates(prev => {
      const newStates = new Map(prev);
      newStates.delete(loadingId);
      
      // Update active loading
      const newActive = determineActiveLoading(newStates);
      setActiveLoading(newActive);
      
      return newStates;
    });

    // Clear timeout
    const timeoutId = timeoutRefs.current.get(loadingId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(loadingId);
    }
  }, [determineActiveLoading]);

  // Hide all loading states
  const hideAllLoading = useCallback(() => {
    setLoadingStates(new Map());
    setActiveLoading(null);
    
    // Clear all timeouts
    timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current.clear();
  }, []);

  // Update loading progress
  const updateLoadingProgress = useCallback((loadingId, progress, message) => {
    setLoadingStates(prev => {
      const newStates = new Map(prev);
      const existingState = newStates.get(loadingId);
      
      if (existingState) {
        const updatedState = {
          ...existingState,
          progress: Math.max(0, Math.min(100, progress)),
          ...(message && { message }),
        };
        newStates.set(loadingId, updatedState);
        
        // Update active loading if this is the active one
        if (activeLoading?.id === loadingId) {
          setActiveLoading(updatedState);
        }
      }
      
      return newStates;
    });
  }, [activeLoading]);

  // Get loading state by ID
  const getLoadingState = useCallback((loadingId) => {
    return loadingStates.get(loadingId) || null;
  }, [loadingStates]);

  // Check if any loading is active
  const isLoading = loadingStates.size > 0;

  // Check if specific type is loading
  const isLoadingType = useCallback((type) => {
    for (const state of loadingStates.values()) {
      if (state.type === type) return true;
    }
    return false;
  }, [loadingStates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
    };
  }, []);

  const contextValue = {
    // State
    isLoading,
    activeLoading,
    loadingStates: Array.from(loadingStates.values()),
    
    // Actions
    showLoading,
    hideLoading,
    hideAllLoading,
    updateLoadingProgress,
    
    // Queries
    getLoadingState,
    isLoadingType,
    
    // Constants
    LOADING_TYPES,
    LOADING_PRIORITIES,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook to use loading context
export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;
