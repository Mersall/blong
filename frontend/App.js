/**
 * BLONG 2024 Elite Modern App
 * Sophisticated matrimonial app with elite onboarding experience
 */

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, Alert, AppState, TouchableOpacity, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingFlow from './src/screens/onboarding/OnboardingFlow';
import AuthScreen from './src/screens/auth/AuthScreen';
import ProfileCompletionFlow from './src/screens/profile/ProfileCompletionFlow';
import MainNavigator from './src/components/navigation/MainNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { AppProvider } from './src/contexts/AppContext';
import { LoadingProvider } from './src/contexts/LoadingContext';
import { ReactQueryProvider } from './src/providers/ReactQueryProvider';
import { SuccessMessageProvider } from './src/contexts/SuccessMessageContext';
import { AppTransition } from './src/components/AppTransition';
import { UniversalLoader, PremiumFullScreenLoader } from './src/components/loading';
import { authService } from './src/services/authService';
import { apiService } from './src/services/apiService';
import { initializeNavigation } from './src/services/navigationService';
import networkManager from './src/services/networkManager';
import NetworkStatusIndicator from './src/components/ui/NetworkStatusIndicator';
import SuccessMessageManager from './src/components/ui/SuccessMessageManager';



// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_PREFERENCES: 'user_preferences',
  USER_DATA: 'user_data',
};

// Main App Content Component with Enhanced Error Handling
function AppContent() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [user, setUser] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    connectionType: 'unknown',
    justConnected: false,
    justDisconnected: false,
  });
  const [retryCount, setRetryCount] = useState(0);
  const [sessionMessage, setSessionMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const appState = useRef(AppState.currentState);
  const MAX_RETRIES = 3;

  // Initialize navigation service with app state reference
  useEffect(() => {
    const appStateRef = {
      setUser,
      setIsProfileComplete,
      showMessage: setSessionMessage,
      clearCachedData: () => {
        // Clear any cached data that depends on authentication
        setUserPreferences(null);
        setIsProfileComplete(false);
      },
    };
    
    initializeNavigation(appStateRef);
  }, []);

  // Load saved data on app start with comprehensive error handling
  useEffect(() => {
    loadSavedData();
    
    // Set up network state monitoring with NetworkManager
    const unsubscribeNetwork = networkManager.addListener((state) => {
      console.log('📡 Network state changed:', state);
      setIsOnline(state.isConnected);
      setNetworkState(state);

      // Retry loading if connection restored and we had errors
      if (state.isConnected && error?.type === 'network') {
        setError(null);
        setTimeout(() => loadSavedData(), 1000);
      }

      // Show success message when connection is restored
      if (state.justConnected) {
        setSuccessMessage({
          type: 'network_restored',
          title: 'Connection Restored',
          message: 'Your internet connection has been restored',
          duration: 3000,
        });
      }
    });

    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('📱 App has come to the foreground - refreshing data');
        // Refresh critical data when app becomes active
        if (user && !error) {
          checkProfileCompletion();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribeNetwork?.();
      subscription?.remove();
    };
  }, []);

  const loadSavedData = async (attemptNumber = 0) => {
    try {
      setError(null);
      setLoadingMessage(attemptNumber > 0 
        ? `Retrying app initialization... (${attemptNumber}/${MAX_RETRIES})`
        : 'Initializing app...');
      
      console.log('🚀 Loading saved data, attempt:', attemptNumber + 1);
      
      // Load basic app data with timeout
      const dataPromise = Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE),
        AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES),
      ]);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Storage access timeout')), 10000)
      );
      
      const [savedOnboarding, savedPreferences] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]);

      if (savedOnboarding === 'true') {
        setIsOnboardingComplete(true);
      }

      if (savedPreferences) {
        try {
          setUserPreferences(JSON.parse(savedPreferences));
        } catch (parseError) {
          console.warn('⚠️ Failed to parse user preferences, using defaults');
          setUserPreferences(null);
        }
      }

      setLoadingMessage('Checking authentication...');
      
      // Check for auto-login with timeout
      const authPromise = authService.getCurrentUser();
      const authTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication check timeout')), 15000)
      );
      
      const authData = await Promise.race([authPromise, authTimeoutPromise]);
      
      if (authData.isAuthenticated && authData.user) {
        console.log('✅ User is authenticated:', authData.user.email);
        setUser(authData.user);
        
        setLoadingMessage('Loading profile...');
        // Check profile completion status
        await checkProfileCompletion();
      } else {
        console.log('🔐 User not authenticated');
      }
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      console.error('❌ Error loading saved data:', error);
      
      const errorType = error.message?.includes('timeout') ? 'timeout' :
                       error.message?.includes('Network') ? 'network' :
                       'unknown';
      
      setError({ type: errorType, message: error.message, originalError: error });
      
      // Implement retry logic
      if (attemptNumber < MAX_RETRIES) {
        const nextAttempt = attemptNumber + 1;
        setRetryCount(nextAttempt);
        
        console.log(`🔄 Retrying in 3 seconds... (${nextAttempt}/${MAX_RETRIES})`);
        setTimeout(() => loadSavedData(nextAttempt), 3000);
        return; // Don't set loading to false yet
      }
      
      // Max retries reached - show error UI
      console.error('💥 Max retries reached, showing error UI');
    } finally {
      // Only set loading to false if we're not retrying
      if (retryCount === 0 || error) {
        setIsLoading(false);
      }
    }
  };

  const checkProfileCompletion = async (attemptNumber = 0) => {
    try {
      console.log('🔍 Checking profile completion status...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile check timeout')), 10000)
      );
      
      const completionPromise = apiService.get('/profile/completion-status');
      
      const completionStatus = await Promise.race([completionPromise, timeoutPromise]);
      console.log('📊 Profile completion status:', completionStatus);

      // Check if overall profile is completed
      const isComplete = completionStatus.data?.overall?.completed || false;
      console.log('🎯 Profile completion result:', isComplete);
      setIsProfileComplete(isComplete);
    } catch (error) {
      console.error('❌ Error checking profile completion:', error);
      
      // Retry logic for network errors
      if ((error.message?.includes('timeout') || error.message?.includes('Network')) && 
          attemptNumber < 2) {
        console.log(`🔄 Retrying profile completion check... (${attemptNumber + 1}/2)`);
        setTimeout(() => checkProfileCompletion(attemptNumber + 1), 2000);
        return;
      }
      
      // Default to incomplete if there's an error after retries
      console.log('🔄 Defaulting to profile incomplete due to error');
      setIsProfileComplete(false);
    }
  };

  const handleOnboardingComplete = async (preferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));

      setUserPreferences(preferences);
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const handleAuthComplete = async (authData) => {
    try {
      console.log('🎯 handleAuthComplete called with:', authData);

      // User data is already saved by authService, just set the state
      setUser(authData.user);
      console.log('✅ User state updated, now checking profile completion...');

      // Check profile completion status after authentication
      await checkProfileCompletion();

      console.log('✅ Profile completion check finished');
    } catch (error) {
      console.error('❌ Error handling auth completion:', error);
      // Still set user even if there's an error
      setUser(authData.user);
      setIsProfileComplete(false); // Default to incomplete on error
      console.log('🔄 Set profile incomplete due to error');
    }
  };

  const handleProfileComplete = async () => {
    try {
      console.log('🎯 Profile completion finished, checking status...');
      await checkProfileCompletion();
    } catch (error) {
      console.error('❌ Error handling profile completion:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsProfileComplete(false);
      setSessionMessage(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Clear session message after showing auth screen
  useEffect(() => {
    if (!user && sessionMessage) {
      // Clear message after a delay when showing auth screen
      const timer = setTimeout(() => {
        setSessionMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [user, sessionMessage]);

  // Enhanced loading screen with error handling
  if (isLoading) {
    return (
      <AppTransition>
        <PremiumFullScreenLoader
          visible={true}
          message={loadingMessage}
          subtitle={retryCount > 0 
            ? `Attempt ${retryCount} of ${MAX_RETRIES}` 
            : 'Please wait while we prepare your experience'
          }
        />
      </AppTransition>
    );
  }

  // Show error screen if initialization failed
  if (error && !isLoading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          padding: 32,
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: '300',
            letterSpacing: 6,
            color: '#0A0A0A',
            marginBottom: 12,
          }}>BLONG</Text>
          
          <View style={{
            width: 32,
            height: 2,
            backgroundColor: '#FF6B35',
            marginBottom: 32,
          }} />
          
          <Text style={{ fontSize: 32, marginBottom: 16 }}>⚠️</Text>
          
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '500',
            color: '#0A0A0A',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            {error.type === 'network' ? 'Connection Problem' :
             error.type === 'timeout' ? 'Loading Timeout' :
             'Initialization Failed'}
          </Text>
          
          <Text style={{ 
            fontSize: 14, 
            color: '#6B6B6B',
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 32,
          }}>
            {error.type === 'network' 
              ? 'Please check your internet connection and try again.'
              : error.type === 'timeout'
                ? 'The app is taking longer than usual to load.'
                : 'Something went wrong during app initialization.'}
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#FF6B35',
              borderRadius: 28,
              paddingVertical: 16,
              paddingHorizontal: 32,
              marginBottom: 16,
            }}
            onPress={() => {
              setIsLoading(true);
              setError(null);
              setRetryCount(0);
              loadSavedData();
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: '#FFFFFF',
              textAlign: 'center',
              letterSpacing: 1,
            }}>
              TRY AGAIN
            </Text>
          </TouchableOpacity>
          
          {!isOnline && (
            <Text style={{
              fontSize: 12,
              color: '#DC2626',
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              📵 No internet connection
            </Text>
          )}
        </SafeAreaView>
      </AppTransition>
    );
  }

  // Show onboarding if not completed
  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Show authentication if not logged in
  if (!user) {
    console.log('🔐 Showing AuthScreen - user not logged in');
    return (
      <AuthScreen
        userPreferences={userPreferences}
        onAuthComplete={handleAuthComplete}
        sessionMessage={sessionMessage}
      />
    );
  }

  // Show profile completion if user is logged in but profile is not complete
  if (user && !isProfileComplete) {
    console.log('📝 Showing ProfileCompletionFlow - profile incomplete');
    return (
      <ProfileCompletionFlow
        userPreferences={userPreferences}
        user={user}
        onComplete={handleProfileComplete}
      />
    );
  }

  // Main app with premium navigation (only if profile is complete)
  console.log('🏠 Showing MainNavigator - profile complete');
  return (
    <>
      <MainNavigator
        userPreferences={userPreferences}
        user={user}
        onLogout={handleLogout}
      />

      {/* Network Status Indicator */}
      <NetworkStatusIndicator
        position="top"
        showDetails={false}
      />

      {/* Success Message Manager */}
      <SuccessMessageManager
        visible={!!successMessage}
        type={successMessage?.type}
        title={successMessage?.title}
        message={successMessage?.message}
        duration={successMessage?.duration}
        onClose={() => setSuccessMessage(null)}
      />
    </>
  );
}

// Main App Component with Enhanced Error Boundaries and Context Providers
export default function App() {
  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <ErrorBoundary>
          <AppProvider>
            <ErrorBoundary>
              <LoadingProvider>
                <ErrorBoundary>
                  <SuccessMessageProvider>
                    <AppContent />
                    <UniversalLoader />
                  </SuccessMessageProvider>
                </ErrorBoundary>
              </LoadingProvider>
            </ErrorBoundary>
          </AppProvider>
        </ErrorBoundary>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
}
