/**
 * BLONG React Query Provider
 * Wraps the app with QueryClient and React Native optimizations
 */

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, useReactQueryFocus, devTools } from '../config/reactQueryConfig';

// React Query Provider with React Native setup
export const ReactQueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQuerySetup>
        {children}
      </ReactQuerySetup>
    </QueryClientProvider>
  );
};

// Internal component to handle React Native specific setup
const ReactQuerySetup = ({ children }) => {
  // Setup React Native focus and online management
  useReactQueryFocus();

  // Enable cache monitoring in development
  useEffect(() => {
    if (__DEV__) {
      devTools.monitorCachePerformance();

      // Log cache stats every 30 seconds in development
      const interval = setInterval(() => {
        devTools.getCacheStats();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, []);

  return children;
};

export default ReactQueryProvider;
