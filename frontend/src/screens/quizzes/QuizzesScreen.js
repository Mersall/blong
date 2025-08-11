/**
 * BLONG Quizzes Screen
 * Main screen for the Quizzes tab navigation
 */

import React from 'react';
import { QuizInterfaceManager } from '../../components/quiz';

const QuizzesScreen = ({ 
  userPreferences, 
  user, 
  onLogout, 
  userPhase, 
  isProfileComplete,
  navigation 
}) => {
  const handleQuizComplete = (results) => {
    console.log('Quiz completed:', results);
    // Could navigate to results or back to dashboard
    // For now, just log the results
  };

  const handleBack = () => {
    // Since this is a tab screen, we don't need to navigate back
    // The user can use the tab navigation
    console.log('Back pressed from quizzes');
  };

  // Calculate user progress from user data
  const userProgress = {
    personality: user?.quizProgress?.personality || 0,
    loveLanguages: user?.quizProgress?.loveLanguages || 0,
    attachmentStyle: user?.quizProgress?.attachmentStyle || 0,
    values: user?.quizProgress?.values || 0,
    communication: user?.quizProgress?.communication || 0,
    lifestyle: user?.quizProgress?.lifestyle || 0,
    emotionalIntelligence: user?.quizProgress?.emotionalIntelligence || 0,
    relationshipGoals: user?.quizProgress?.relationshipGoals || 0,
  };

  return (
    <QuizInterfaceManager
      userProgress={userProgress}
      userPhase={userPhase || 'single'}
      onComplete={handleQuizComplete}
      onBack={handleBack}
      initialScreen="dashboard"
    />
  );
};

export default QuizzesScreen;
