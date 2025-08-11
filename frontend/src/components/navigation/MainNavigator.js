import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { AppTransition } from '../AppTransition';
import BottomNavigation from './BottomNavigation';
import ScreenCacheManager from './ScreenCacheManager';
import HomeScreen from '../../screens/home/HomeScreen';
import PremiumHomeScreen from '../../screens/home/PremiumHomeScreen';
import QuizzesScreen from '../../screens/quizzes/QuizzesScreen';
import DatesScreen from '../../screens/dates/DatesScreen';
import ArticlesScreen from '../../screens/articles/ArticlesScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import QuizIntroScreen from '../quiz/QuizIntroScreen';
import QuizScreen from '../quiz/QuizScreen';
import QuizResultsScreen from '../quiz/QuizResultsScreen';
import { PremiumQuizScreen, PremiumQuizResultsScreen, QuizInterfaceManager } from '../quiz';

const MainNavigator = ({ userPreferences, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [routeParams, setRouteParams] = useState({});

  const userPhase = userPreferences?.phase?.id || 'single';

  // Check profile completion status
  useEffect(() => {
    const checkProfileCompletion = () => {
      if (!user) {
        setIsProfileComplete(false);
        return;
      }

      // Basic profile completion check
      const hasBasicInfo = user.firstName && user.lastName && user.email && user.dateOfBirth && user.gender;
      const hasLocation = user.city && user.country;

      // For now, consider profile complete if basic info and location are present
      // This can be enhanced with more comprehensive checks
      setIsProfileComplete(hasBasicInfo && hasLocation);
    };

    checkProfileCompletion();
  }, [user]);

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    setCurrentScreen(tabId);
  };

  const navigate = (screenName, params = {}) => {
    setCurrentScreen(screenName);
    setRouteParams(params);
  };

  const goBack = () => {
    if (currentScreen === 'home') return;
    
    // Navigate back to appropriate screen
    if (['QuizIntro', 'Quiz', 'QuizResults'].includes(currentScreen)) {
      setCurrentScreen('home');
      setActiveTab('home');
    } else {
      setCurrentScreen('home');
      setActiveTab('home');
    }
  };

  const handleNavigateToDateDetail = (date) => {
    setSelectedDate(date);
    // TODO: Navigate to date detail screen
    console.log('Navigate to date detail:', date);
  };

  // Memoize screen props to prevent unnecessary re-renders
  const screenProps = useMemo(() => ({
    userPreferences,
    user,
    onLogout,
    userPhase,
    isProfileComplete,
    navigation: { navigate, goBack },
    onNavigateToDateDetail: handleNavigateToDateDetail,
  }), [userPreferences, user, onLogout, userPhase, isProfileComplete, navigate, goBack, handleNavigateToDateDetail]);

  // Define tab screen components for caching
  const tabScreenComponents = useMemo(() => ({
    home: HomeScreen,
    quizzes: QuizzesScreen,
    dates: DatesScreen,
    articles: ArticlesScreen,
    settings: SettingsScreen,
  }), []);

  const renderScreen = () => {
    // Quiz screens (these are temporary and don't need caching)
    switch (currentScreen) {
      case 'QuizIntro':
        return <QuizIntroScreen navigation={{ navigate, goBack }} />;
      case 'Quiz':
        return <PremiumQuizScreen navigation={{ navigate, goBack }} route={{ params: routeParams }} />;
      case 'QuizResults':
        return <PremiumQuizResultsScreen navigation={{ navigate, goBack }} route={{ params: routeParams }} />;
      default:
        break;
    }

    // Use ScreenCacheManager for tab screens to preserve React Query cache and component state
    return (
      <ScreenCacheManager
        activeTab={activeTab}
        screens={tabScreenComponents}
        screenProps={screenProps}
        fallbackScreen="home"
      />
    );
  };

  const showBottomNavigation = !['QuizIntro', 'Quiz', 'QuizResults'].includes(currentScreen);

  return (
    <AppTransition>
      <View style={{ flex: 1 }}>
        {/* Match Notification Banner removed */}

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          {renderScreen()}
        </View>

        {/* Bottom Navigation - hide during quiz flow */}
        {showBottomNavigation && (
          <BottomNavigation
            activeTab={activeTab}
            onTabPress={handleTabPress}
            userPhase={userPhase}
            isProfileComplete={isProfileComplete}
          />
        )}
      </View>
    </AppTransition>
  );
};

export default MainNavigator;
