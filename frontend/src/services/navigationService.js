/**
 * BLONG Navigation Service
 * Global navigation service for handling auth redirects and app-wide navigation
 */

import { createRef } from 'react';

// Create a navigation ref that can be used globally
export const navigationRef = createRef();

// App state reference for tracking current navigation state
let appStateRef = null;

/**
 * Initialize navigation service with app state reference
 */
export const initializeNavigation = (appStateRef_) => {
  appStateRef = appStateRef_;
};

/**
 * Navigate to a specific screen
 */
export const navigate = (name, params = {}) => {
  if (navigationRef.current?.navigate) {
    navigationRef.current.navigate(name, params);
  } else {
    console.warn('Navigation ref not ready, cannot navigate to:', name);
  }
};

/**
 * Reset navigation stack to a specific screen
 */
export const resetToScreen = (name, params = {}) => {
  if (navigationRef.current?.reset) {
    navigationRef.current.reset({
      index: 0,
      routes: [{ name, params }],
    });
  } else {
    console.warn('Navigation ref not ready, cannot reset to:', name);
  }
};

/**
 * Go back to previous screen
 */
export const goBack = () => {
  if (navigationRef.current?.goBack) {
    navigationRef.current.goBack();
  } else {
    console.warn('Navigation ref not ready, cannot go back');
  }
};

/**
 * Check if navigation is ready
 */
export const isNavigationReady = () => {
  return navigationRef.current?.isReady?.() || false;
};

/**
 * Get current route name
 */
export const getCurrentRouteName = () => {
  if (navigationRef.current?.getCurrentRoute) {
    return navigationRef.current.getCurrentRoute()?.name;
  }
  return null;
};

/**
 * Handle automatic logout and redirect to authentication
 * This is the main function called when tokens expire
 */
export const handleTokenExpiration = async () => {
  console.log('🔐 Token expiration detected, handling logout...');
  
  try {
    // Clear any app state that depends on authentication
    if (appStateRef) {
      console.log('🔄 Clearing authenticated app state...');
      
      // Reset user state
      if (appStateRef.setUser) {
        appStateRef.setUser(null);
      }
      
      // Reset profile completion state
      if (appStateRef.setIsProfileComplete) {
        appStateRef.setIsProfileComplete(false);
      }
      
      // Clear any cached data
      if (appStateRef.clearCachedData) {
        appStateRef.clearCachedData();
      }
    }
    
    // The App.js component will automatically redirect to AuthScreen
    // when user state is set to null
    console.log('✅ Token expiration handled successfully');
    
  } catch (error) {
    console.error('❌ Error handling token expiration:', error);
  }
};

/**
 * Navigate to auth screen with optional message
 */
export const navigateToAuth = (message = null) => {
  console.log('🔐 Navigating to authentication screen');
  
  if (appStateRef?.setUser) {
    // Set user to null which will trigger the auth screen in App.js
    appStateRef.setUser(null);
    
    // Optionally show a message about session expiration
    if (message && appStateRef.showMessage) {
      appStateRef.showMessage(message);
    }
  }
};

/**
 * Show session expired message to user
 */
export const showSessionExpiredMessage = () => {
  // This could be enhanced to show a proper toast/modal
  console.log('⏰ Session expired - user will be redirected to login');
  
  // For now, we'll just log it. In a real app, you might show a toast notification
  // or modal before redirecting
};

export default {
  navigationRef,
  initializeNavigation,
  navigate,
  resetToScreen,
  goBack,
  isNavigationReady,
  getCurrentRouteName,
  handleTokenExpiration,
  navigateToAuth,
  showSessionExpiredMessage,
};