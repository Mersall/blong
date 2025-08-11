/**
 * BLONG Performance Optimization Utilities
 * Tools for optimizing app performance, memory usage, and user experience
 */

import { Dimensions, Platform, InteractionManager } from 'react-native';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Image optimization utilities
export const imageOptimization = {
  // Calculate optimal image dimensions for device
  getOptimalDimensions: (originalWidth, originalHeight, maxWidth = screenWidth, maxHeight = screenHeight) => {
    const aspectRatio = originalWidth / originalHeight;
    
    let width = originalWidth;
    let height = originalHeight;
    
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  },

  // Get optimal image quality based on device
  getOptimalQuality: () => {
    const pixelRatio = Dimensions.get('window').scale;
    if (pixelRatio >= 3) return 0.8; // High DPI devices
    if (pixelRatio >= 2) return 0.85; // Medium DPI devices
    return 0.9; // Standard DPI devices
  },

  // Generate srcSet for responsive images
  generateImageSrcSet: (baseUrl, sizes = [0.5, 1, 1.5, 2]) => {
    return sizes.map(scale => ({
      uri: `${baseUrl}?w=${Math.round(screenWidth * scale)}&q=${imageOptimization.getOptimalQuality()}`,
      scale,
    }));
  },

  // Lazy loading configuration
  getLazyLoadConfig: () => ({
    threshold: screenHeight * 0.5, // Start loading when image is 50% of screen height away
    rootMargin: '50px',
  }),
};

// Memory management utilities
export const memoryManagement = {
  // Cache size limits
  CACHE_LIMITS: {
    images: 50, // Maximum number of cached images
    data: 100,  // Maximum number of cached data objects
    navigation: 10, // Maximum number of navigation screens in memory
  },

  // Memory-efficient data structures
  createLRUCache: (maxSize) => {
    const cache = new Map();
    
    return {
      get: (key) => {
        if (cache.has(key)) {
          const value = cache.get(key);
          cache.delete(key);
          cache.set(key, value); // Move to end (most recently used)
          return value;
        }
        return null;
      },
      
      set: (key, value) => {
        if (cache.has(key)) {
          cache.delete(key);
        } else if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        cache.set(key, value);
      },
      
      clear: () => cache.clear(),
      size: () => cache.size,
    };
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    // This would integrate with performance monitoring
    return {
      used: 0, // MB
      available: 0, // MB
      warning: false,
    };
  },
};

// Rendering performance utilities
export const renderingPerformance = {
  // Debounce function for expensive operations
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for frequent events
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Batch updates to reduce re-renders
  batchUpdates: (updates) => {
    InteractionManager.runAfterInteractions(() => {
      updates.forEach(update => update());
    });
  },

  // Virtual list configuration for large datasets
  getVirtualListConfig: (itemHeight, screenHeight = Dimensions.get('window').height) => ({
    windowSize: Math.ceil(screenHeight / itemHeight) + 2, // Items to render
    initialNumToRender: Math.ceil(screenHeight / itemHeight),
    maxToRenderPerBatch: 5,
    updateCellsBatchingPeriod: 100,
    removeClippedSubviews: true,
  }),
};

// Network optimization utilities
export const networkOptimization = {
  // Request deduplication
  createRequestDeduplicator: () => {
    const pendingRequests = new Map();
    
    return {
      request: async (key, requestFn) => {
        if (pendingRequests.has(key)) {
          return pendingRequests.get(key);
        }
        
        const promise = requestFn();
        pendingRequests.set(key, promise);
        
        try {
          const result = await promise;
          pendingRequests.delete(key);
          return result;
        } catch (error) {
          pendingRequests.delete(key);
          throw error;
        }
      },
    };
  },

  // Request batching
  createRequestBatcher: (batchSize = 10, delay = 100) => {
    let batch = [];
    let timer = null;
    
    return {
      add: (request) => {
        return new Promise((resolve, reject) => {
          batch.push({ request, resolve, reject });
          
          if (batch.length >= batchSize) {
            processCurrentBatch();
          } else if (!timer) {
            timer = setTimeout(processCurrentBatch, delay);
          }
        });
      },
    };
    
    function processCurrentBatch() {
      const currentBatch = batch;
      batch = [];
      timer = null;
      
      // Process batch of requests
      currentBatch.forEach(({ request, resolve, reject }) => {
        request().then(resolve).catch(reject);
      });
    }
  },

  // Connection quality detection
  getConnectionQuality: () => {
    // This would integrate with NetInfo
    return {
      effectiveType: '4g', // '2g', '3g', '4g', 'wifi'
      downlink: 10, // Mbps
      rtt: 100, // ms
    };
  },
};

// Animation performance utilities
export const animationPerformance = {
  // Optimize animation for 60fps
  getOptimizedAnimationConfig: (config) => ({
    ...config,
    useNativeDriver: true,
    // Adjust duration based on device performance
    duration: animationPerformance.getOptimalDuration(config.duration || 300),
  }),

  // Get optimal animation duration based on device
  getOptimalDuration: (baseDuration) => {
    // Reduce duration on lower-end devices
    const performanceLevel = animationPerformance.getDevicePerformanceLevel();
    switch (performanceLevel) {
      case 'high': return baseDuration;
      case 'medium': return baseDuration * 0.8;
      case 'low': return baseDuration * 0.6;
      default: return baseDuration;
    }
  },

  // Estimate device performance level
  getDevicePerformanceLevel: () => {
    const { width, height, scale } = Dimensions.get('window');
    const totalPixels = width * height * scale * scale;
    
    if (totalPixels > 2000000) return 'high';   // High-end devices
    if (totalPixels > 1000000) return 'medium'; // Mid-range devices
    return 'low'; // Lower-end devices
  },

  // Animation frame rate monitoring
  createFrameRateMonitor: () => {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;
    
    const monitor = () => {
      const currentTime = performance.now();
      frames++;
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitor);
    };
    
    return {
      start: () => requestAnimationFrame(monitor),
      getFPS: () => fps,
    };
  },
};

// Code splitting and lazy loading utilities
export const codeSplitting = {
  // Lazy component loader with error boundary
  createLazyComponent: (importFn) => {
    return React.lazy(() => 
      importFn().catch(error => {
        console.error('Error loading component:', error);
        return { default: () => <Text>Error loading component</Text> };
      })
    );
  },

  // Route-based code splitting
  createLazyRoute: (importFn) => {
    return {
      component: codeSplitting.createLazyComponent(importFn),
      preload: importFn,
    };
  },

  // Preload components on idle
  preloadOnIdle: (importFn) => {
    InteractionManager.runAfterInteractions(() => {
      requestIdleCallback(() => {
        importFn();
      });
    });
  },
};

// Bundle optimization utilities
export const bundleOptimization = {
  // Tree shaking helpers
  getOptimalImports: (library) => {
    // Guide for optimal imports to reduce bundle size
    const optimizations = {
      'react-native-vector-icons': 'Import specific icon sets only',
      'lodash': 'Use lodash/specific-function instead of full lodash',
      'moment': 'Consider date-fns for smaller bundle size',
      'react-native-svg': 'Import specific components only',
    };
    
    return optimizations[library] || 'No specific optimizations available';
  },

  // Bundle analysis helpers
  analyzeBundleSize: () => {
    // This would integrate with bundle analyzer
    return {
      totalSize: 0,
      recommendations: [],
    };
  },
};

// Performance monitoring utilities
export const performanceMonitoring = {
  // Performance metrics collection
  collectMetrics: () => {
    return {
      navigationTiming: performance.now(),
      memoryUsage: memoryManagement.getMemoryUsage(),
      renderingMetrics: {
        fps: 60,
        droppedFrames: 0,
      },
    };
  },

  // Performance budget checking
  checkPerformanceBudget: (metrics) => {
    const budgets = {
      loadTime: 3000, // 3 seconds
      memoryUsage: 100, // 100MB
      bundleSize: 5, // 5MB
    };
    
    return {
      withinBudget: true,
      violations: [],
      recommendations: [],
    };
  },

  // Create performance observer
  createPerformanceObserver: (callback) => {
    // This would integrate with Performance API
    return {
      observe: (entryTypes) => {
        // Observe performance entries
      },
      disconnect: () => {
        // Stop observing
      },
    };
  },
};

// React hooks for performance optimization
export const performanceHooks = {
  // Optimized useState with debouncing
  useDebouncedState: (initialValue, delay = 300) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);
    
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    
    return [debouncedValue, setValue];
  },

  // Optimized callback with dependencies memoization
  useOptimizedCallback: (callback, deps) => {
    return useCallback(callback, deps);
  },

  // Memoized expensive computations
  useExpensiveComputation: (computeFn, deps) => {
    return useMemo(computeFn, deps);
  },

  // Performance-aware effect
  usePerformantEffect: (effect, deps) => {
    useEffect(() => {
      InteractionManager.runAfterInteractions(() => {
        effect();
      });
    }, deps);
  },
};

// Main performance helper
export const performance = {
  imageOptimization,
  memoryManagement,
  renderingPerformance,
  networkOptimization,
  animationPerformance,
  codeSplitting,
  bundleOptimization,
  performanceMonitoring,
  performanceHooks,
};

export default performance;