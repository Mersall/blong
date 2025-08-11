/**
 * BLONG Quiz Interface Manager
 * Central orchestrator for all quiz experiences and flows
 */

import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import QuizDashboard from './QuizDashboard';
import QuizSelectionInterface from './QuizSelectionInterface';
import MasterQuizInterface from './MasterQuizInterface';
import EnhancedQuizResults, { QuizProgressTracker } from './EnhancedQuizResults';
import quizService from '../../services/quizService';

export const QuizInterfaceManager = ({
  userProgress = {},
  userPhase = 'single',
  onComplete,
  onBack,
  initialScreen = 'dashboard', // 'dashboard', 'selection', 'quiz', 'results'
  initialQuizId = null,
}) => {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialQuizId) {
      loadQuizById(initialQuizId);
    }
  }, [initialQuizId]);

  const loadQuizById = async (quizId) => {
    try {
      setLoading(true);
      const quiz = await quizService.getQuizById(quizId);
      setSelectedQuiz(quiz);
      setCurrentScreen('quiz');
      await loadQuizData(quiz);
    } catch (error) {
      console.error('Error loading quiz:', error);
      Alert.alert('Error', 'Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizData = async (quiz) => {
    try {
      setLoading(true);
      const data = await quizService.getQuizQuestions(quiz.id);
      setQuizData(data);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setTimeSpent(0);
    } catch (error) {
      console.error('Error loading quiz data:', error);
      Alert.alert('Error', 'Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = async (quiz) => {
    setSelectedQuiz(quiz);
    
    // Check if quiz is already in progress
    if (quiz.progress > 0 && quiz.progress < 100) {
      Alert.alert(
        'Resume Quiz',
        'You have a quiz in progress. Would you like to resume or start over?',
        [
          {
            text: 'Start Over',
            onPress: () => startQuiz(quiz),
            style: 'destructive',
          },
          {
            text: 'Resume',
            onPress: () => resumeQuiz(quiz),
          },
        ]
      );
    } else {
      startQuiz(quiz);
    }
  };

  const startQuiz = async (quiz) => {
    setCurrentScreen('quiz');
    await loadQuizData(quiz);
  };

  const resumeQuiz = async (quiz) => {
    try {
      setLoading(true);
      // For now, just start the quiz from the beginning since we don't have
      // individual quiz progress tracking implemented yet
      console.log('Resume quiz not fully implemented yet, starting from beginning');
      await startQuiz(quiz);
    } catch (error) {
      console.error('Error resuming quiz:', error);
      Alert.alert('Error', 'Failed to resume quiz. Starting from beginning.');
      startQuiz(quiz);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answerData) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerData;
    setUserAnswers(newAnswers);

    // Save progress
    try {
      await quizService.saveQuizProgress(selectedQuiz.id, {
        currentQuestion: currentQuestionIndex + 1,
        answers: newAnswers,
        timeSpent,
      });
    } catch (error) {
      console.error('Error saving quiz progress:', error);
    }

    // Move to next question
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete
      await handleQuizComplete(newAnswers);
    }
  };

  const handleQuizComplete = async (answers) => {
    try {
      setLoading(true);
      
      // Calculate results
      const results = await quizService.calculateResults(selectedQuiz.id, answers, timeSpent);
      setQuizResults(results);
      
      // Save completion
      await quizService.saveQuizCompletion(selectedQuiz.id, {
        answers,
        results,
        timeSpent,
        completedAt: new Date(),
      });

      setCurrentScreen('results');
    } catch (error) {
      console.error('Error completing quiz:', error);
      Alert.alert('Error', 'Failed to process quiz results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    Alert.alert(
      'Retake Quiz',
      'Are you sure you want to retake this quiz? Your previous results will be saved but replaced.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retake',
          onPress: () => {
            setCurrentQuestionIndex(0);
            setUserAnswers([]);
            setTimeSpent(0);
            setQuizResults(null);
            setCurrentScreen('quiz');
          },
        },
      ]
    );
  };

  const handleShareResults = async () => {
    try {
      // Implementation would depend on sharing platform
      Alert.alert('Share Results', 'Sharing functionality coming soon!');
    } catch (error) {
      console.error('Error sharing results:', error);
      Alert.alert('Error', 'Failed to share results.');
    }
  };

  const handlePauseQuiz = () => {
    setIsPaused(true);
    // Could save current state here
  };

  const handleResumeQuiz = () => {
    setIsPaused(false);
  };

  const handleBackNavigation = () => {
    switch (currentScreen) {
      case 'selection':
        setCurrentScreen('dashboard');
        break;
      case 'quiz':
        Alert.alert(
          'Exit Quiz',
          'Are you sure you want to exit? Your progress will be saved.',
          [
            { text: 'Continue Quiz', style: 'cancel' },
            {
              text: 'Exit',
              onPress: () => {
                setCurrentScreen('dashboard');
                setSelectedQuiz(null);
                setQuizData(null);
              },
            },
          ]
        );
        break;
      case 'results':
        setCurrentScreen('dashboard');
        setSelectedQuiz(null);
        setQuizData(null);
        setQuizResults(null);
        break;
      default:
        if (onBack) {
          onBack();
        }
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'selection':
        return (
          <QuizSelectionInterface
            onQuizSelect={handleQuizSelect}
            onBack={handleBackNavigation}
            userProgress={userProgress}
            userPhase={userPhase}
          />
        );

      case 'quiz':
        if (!quizData || !selectedQuiz) {
          return <View />; // Loading state
        }

        return (
          <View style={{ flex: 1 }}>
            <QuizProgressTracker
              currentQuestion={currentQuestionIndex}
              totalQuestions={quizData.length}
              timeSpent={timeSpent}
              questionsAnswered={userAnswers.length}
              quizType={selectedQuiz.category}
              onPause={handlePauseQuiz}
              onResume={handleResumeQuiz}
              isPaused={isPaused}
            />
            
            <MasterQuizInterface
              quizData={quizData}
              currentQuestionIndex={currentQuestionIndex}
              onAnswerSelect={handleAnswerSelect}
              onQuizComplete={() => handleQuizComplete(userAnswers)}
              onBack={handleBackNavigation}
              userProgress={userProgress}
              showTimer={true}
              enableSwipeNavigation={true}
              quizType={selectedQuiz.category}
            />
          </View>
        );

      case 'results':
        if (!quizResults || !selectedQuiz) {
          return <View />; // Loading state
        }

        return (
          <EnhancedQuizResults
            quizType={selectedQuiz.category}
            results={quizResults}
            onContinue={() => {
              if (onComplete) {
                onComplete(quizResults);
              } else {
                setCurrentScreen('dashboard');
              }
            }}
            onRetake={handleRetakeQuiz}
            onShare={handleShareResults}
            onBack={handleBackNavigation}
          />
        );

      default:
        return (
          <QuizDashboard
            userProgress={userProgress}
            onQuizSelect={handleQuizSelect}
            onBack={handleBackNavigation}
            userPhase={userPhase}
          />
        );
    }
  };

  return renderCurrentScreen();
};

export default QuizInterfaceManager;

// Export individual components for direct use
export {
  QuizDashboard,
  QuizSelectionInterface,
  MasterQuizInterface,
  EnhancedQuizResults,
  QuizProgressTracker,
};
