import React, { useState, useEffect, useMemo } from 'react'; // eslint-disable-line no-unused-vars
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppTransition } from '../AppTransition';
import BottomNavigation from './BottomNavigation';
import ScreenCacheManager from './ScreenCacheManager';
import HomeScreen from '../../screens/home/HomeScreen';
import QuizzesScreen from '../../screens/quizzes/QuizzesScreen';
import DatesScreen from '../../screens/dates/DatesScreen';
import ArticlesScreen from '../../screens/articles/ArticlesScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import QuizIntroScreen from '../quiz/QuizIntroScreen';
import { PremiumQuizScreen, PremiumQuizResultsScreen } from '../quiz';

const Stack = createStackNavigator();

const MainNavigator = ({ userPreferences, user, onLogout }) => {
  const userPhase = userPreferences?.phase?.id || 'single';

  // Inner component that renders the tabbed content with existing BottomNavigation
  const MainTabs = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    // Check profile completion status
    useEffect(() => {
      const checkProfileCompletion = () => {
        if (!user) {
          setIsProfileComplete(false);
          return;
        }
        const hasBasicInfo = user.firstName && user.lastName && user.email && user.dateOfBirth && user.gender;
        const hasLocation = user.city && user.country;
        setIsProfileComplete(!!(hasBasicInfo && hasLocation));
      };
      checkProfileCompletion();
       
    }, []);

    const handleTabPress = (tabId) => {
      setActiveTab(tabId);
    };

    const handleNavigateToDateDetail = (date) => {
      // TODO: implement date detail screen navigation
      console.log('Navigate to date detail:', date);
    };

    // Props passed to tab screens
    const screenProps = useMemo(() => ({
      userPreferences,
      user,
      onLogout,
      userPhase,
      isProfileComplete,
      navigation, // pass stack navigation down
      onNavigateToDateDetail: handleNavigateToDateDetail,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    // Define tab screen components for caching
    const tabScreenComponents = useMemo(() => ({
      home: HomeScreen,
      quizzes: QuizzesScreen,
      dates: DatesScreen,
      articles: ArticlesScreen,
      settings: SettingsScreen,
    }), []);

    return (
      <AppTransition>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ScreenCacheManager
              activeTab={activeTab}
              screens={tabScreenComponents}
              screenProps={screenProps}
              fallbackScreen="home"
            />
          </View>

          <BottomNavigation
            activeTab={activeTab}
            onTabPress={handleTabPress}
            userPhase={userPhase}
            isProfileComplete={isProfileComplete}
          />
        </View>
      </AppTransition>
    );
  };

  return (
    <AppTransition>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="QuizIntro" component={QuizIntroScreen} />
        <Stack.Screen name="Quiz" component={PremiumQuizScreen} />
        <Stack.Screen name="QuizResults" component={PremiumQuizResultsScreen} />
      </Stack.Navigator>
    </AppTransition>
  );
};

export default MainNavigator;
