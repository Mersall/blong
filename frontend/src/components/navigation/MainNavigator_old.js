import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { AppTransition } from '../AppTransition';
import BottomNavigation from './BottomNavigation';
import HomeScreen from '../../screens/home/HomeScreen';
import DatesScreen from '../../screens/dates/DatesScreen';
import ArticlesScreen from '../../screens/articles/ArticlesScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import MatchNotificationBanner from '../MatchNotificationBanner';
import QuizIntroScreen from '../quiz/QuizIntroScreen';
import QuizScreen from '../quiz/QuizScreen';
import QuizResultsScreen from '../quiz/QuizResultsScreen';

const MainNavigator = ({ userPreferences, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const userPhase = userPreferences?.phase?.id || 'single';

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    setCurrentScreen(tabId);
  };

  const navigate = (screenName) => {
    setCurrentScreen(screenName);
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
      setShowQuestionnaire(false);
      setQuestionnaireAnswers(answers);
      setShowQuestionnaireSuccess(true);
    }
  };

  const handleQuestionnaireSuccessComplete = () => {
    setShowQuestionnaireSuccess(false);
    setQuestionnaireAnswers(null);
    setActiveTab('home');
  };

  const handleNavigateToQuestionnaire = () => {
    if (showQuestionnaire) {
      // If questionnaire is already showing, this means close was clicked
      setShowQuestionnaire(false);
      setActiveTab('home');
    } else {
      // Open questionnaire
      setShowQuestionnaire(true);
      setShowQuestionnaireSuccess(false);
    }
  };

  const handleNavigateToDateDetail = (date) => {
    setSelectedDate(date);
    // TODO: Navigate to date detail screen
    console.log('Navigate to date detail:', date);
  };

  const renderScreen = () => {
    const screenProps = {
      userPreferences,
      user,
      onLogout,
      userPhase,
      isProfileComplete,
      onQuestionnaireComplete: handleQuestionnaireComplete,
      onNavigateToQuestionnaire: handleNavigateToQuestionnaire,
      onNavigateToDateDetail: handleNavigateToDateDetail,
    };

    // Show questionnaire success screen if requested
    if (showQuestionnaireSuccess) {
      return (
        <QuestionnaireSuccessScreen
          answers={questionnaireAnswers}
          userPhase={userPhase}
          onContinue={handleQuestionnaireSuccessComplete}
          onReviewAnswers={() => {
            setShowQuestionnaireSuccess(false);
            setShowQuestionnaire(true);
          }}
        />
      );
    }

    // Show questionnaire if requested
    if (showQuestionnaire) {
      return <SimpleQuestionnaireScreen {...screenProps} />;
    }

    // Show main tabs
    switch (activeTab) {
      case 'home':
        return <HomeScreen {...screenProps} />;
      case 'dates':
        return <DatesScreen {...screenProps} />;
      case 'articles':
        return <ArticlesScreen {...screenProps} />;
      case 'settings':
        return <SettingsScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  };

  return (
    <AppTransition>
      <View style={{ flex: 1 }}>
        {renderScreen()}

        {/* Hide bottom navigation when showing questionnaire or success screen */}
        {!showQuestionnaire && !showQuestionnaireSuccess && (
          <BottomNavigation
            activeTab={activeTab}
            onTabPress={handleTabPress}
            isProfileComplete={isProfileComplete}
          />
        )}

        {/* Match Notification Banner - Show on all screens except questionnaire */}
        {!showQuestionnaire && (
          <MatchNotificationBanner
            userId="current_user" // This would come from auth context
            onViewMatches={() => {
              console.log('📱 User wants to view matches');
              // Navigate to matches screen when implemented
              setActiveTab('home');
            }}
            onDismiss={() => {
              console.log('📱 User dismissed match notification');
            }}
          />
        )}
      </View>
    </AppTransition>
  );
};

export default MainNavigator;
