import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { useTranslation } from 'react-i18next';
import QuestionnaireComponent from '../../components/questionnaire/QuestionnaireComponent';
import HomeScreen from '../home/HomeScreen';
import { QUESTIONNAIRE_DATA } from '../../services/questionnaireService';

const EngagementPhaseScreen = ({ userPreferences, user, onLogout }) => {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [progress, setProgress] = useState(0);

  const questionnaireData = QUESTIONNAIRE_DATA.engagement;

  const handleNavigateToQuestionnaire = () => {
    setCurrentScreen('questionnaire');
  };

  const handleNavigateToHome = () => {
    setCurrentScreen('home');
  };

  const handleQuestionnaireComplete = (answers) => {
    console.log('Engagement phase questionnaire completed:', answers);
    setCurrentScreen('home');
  };

  const handleProgress = (percentage) => {
    setProgress(percentage);
  };

  if (currentScreen === 'questionnaire') {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5E5',
          }}>
            <TouchableOpacity onPress={handleNavigateToHome}>
              <Text style={{ fontSize: 18, color: '#FFD700' }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>💍 Plan Your Wedding</Text>
            <TouchableOpacity onPress={onLogout}>
              <Text style={{ color: '#FFD700', fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
          </View>

          <QuestionnaireComponent
            phase="engagement"
            questionnaireData={questionnaireData}
            onComplete={handleQuestionnaireComplete}
            onProgress={handleProgress}
          />
        </SafeAreaView>
      </AppTransition>
    );
  }

  return (
    <HomeScreen
      userPreferences={userPreferences}
      user={user}
      onLogout={onLogout}
      onNavigateToQuestionnaire={handleNavigateToQuestionnaire}
    />
  );


};

export default EngagementPhaseScreen;
