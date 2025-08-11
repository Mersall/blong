/**
 * BLONG Unified App Provider
 * Single, clean context provider
 */

import React from 'react';
import { AppProvider as UnifiedAppProvider } from './AppContext';

// Simple wrapper for the unified context
export const AppProvider = ({ children }) => {
  return (
    <UnifiedAppProvider>
      {children}
    </UnifiedAppProvider>
  );
};

export default AppProvider;
