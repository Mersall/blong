/**
 * BLONG Personality Assessment Screen
 * Main screen for conducting personality assessment
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp, useTheme, useRTL } from '../../contexts/AppContext';
import { AppTransition } from '../../components/AppTransition';
import QuestionCard from '../../components/assessment/QuestionCard';
import { assessmentService, AssessmentProgress } from '../../services/assessmentService';
import { ASSESSMENT_SECTIONS, ASSESSMENT_STATS } from '../../data/personalityQuestions';
import { createAssessmentStyles } from './styles/AssessmentStyles';

const PersonalityAssessmentScreen = ({ onComplete, onExit }) => {
  const { t } = useApp();
  const { colors } = useTheme();
  const { isRTL } = useRTL();
  
  const [progress, setProgress] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const scrollViewRef = useRef(null);

  const styles = createAssessmentStyles(colors, isRTL);

  // Initialize assessment
  useEffect(() => {
    initializeAssessment();
    
    // Handle back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  // Update current question when progress changes
  useEffect(() => {
    if (progress) {
      const question = progress.getCurrentQuestion();
      setCurrentQuestion(question);
    }
  }, [progress]);

  const initializeAssessment = async () => {
    try {
      setIsLoading(true);
      
      // Try to load existing progress
      let existingProgress = await assessmentService.loadProgress();
      
      if (existingProgress) {
        // Ask user if they want to continue or start over
        Alert.alert(
          t('assessment.continueTitle'),
          t('assessment.continueMessage'),
          [
            {
              text: t('assessment.startOver'),
              onPress: () => startNewAssessment(),
              style: 'destructive',
            },
            {
              text: t('assessment.continue'),
              onPress: () => {
                setProgress(existingProgress);
                setIsLoading(false);
              },
            },
          ]
        );
      } else {
        startNewAssessment();
      }
    } catch (error) {
      console.error('Failed to initialize assessment:', error);
      startNewAssessment();
    }
  };

  const startNewAssessment = () => {
    const newProgress = assessmentService.createProgress();
    setProgress(newProgress);
    setIsLoading(false);
  };

  const handleBackPress = () => {
    if (progress && Object.keys(progress.answers).length > 0) {
      Alert.alert(
        t('assessment.exitTitle'),
        t('assessment.exitMessage'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('assessment.saveAndExit'),
            onPress: handleSaveAndExit,
          },
          {
            text: t('assessment.exitWithoutSaving'),
            onPress: handleExitWithoutSaving,
            style: 'destructive',
          },
        ]
      );
      return true;
    }
    
    if (onExit) {
      onExit();
    }
    return true;
  };

  const handleSaveAndExit = async () => {
    if (progress) {
      setIsSaving(true);
      await progress.save();
      setIsSaving(false);
    }
    
    if (onExit) {
      onExit();
    }
  };

  const handleExitWithoutSaving = async () => {
    if (progress) {
      await progress.clear();
    }
    
    if (onExit) {
      onExit();
    }
  };

  const handleAnswerChange = async (answer) => {
    if (!progress || !currentQuestion) return;

    // Save answer
    progress.saveAnswer(currentQuestion.question.id, answer);
    
    // Save progress
    await progress.save();
    
    // Update state to trigger re-render
    setProgress({ ...progress });
  };

  const handleNext = async () => {
    if (!progress) return;

    progress.moveNext();
    await progress.save();
    
    if (progress.isComplete) {
      await completeAssessment();
    } else {
      setProgress({ ...progress });
      scrollToTop();
    }
  };

  const handlePrevious = async () => {
    if (!progress) return;

    progress.movePrevious();
    await progress.save();
    setProgress({ ...progress });
    scrollToTop();
  };

  const completeAssessment = async () => {
    try {
      setIsSaving(true);
      
      // Calculate personality scores
      const results = assessmentService.calculatePersonality(progress.answers);
      
      // Save results
      await assessmentService.saveResults(results);
      
      // Clear progress
      await progress.clear();
      
      setIsSaving(false);
      
      if (onComplete) {
        onComplete(results);
      }
    } catch (error) {
      console.error('Failed to complete assessment:', error);
      setIsSaving(false);
      
      Alert.alert(
        t('assessment.errorTitle'),
        t('assessment.errorMessage'),
        [{ text: t('common.ok') }]
      );
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const canGoNext = () => {
    return currentQuestion && progress.getAnswer(currentQuestion.question.id) !== undefined;
  };

  const canGoPrevious = () => {
    return progress && (progress.currentSection > 0 || progress.currentQuestion > 0);
  };

  if (isLoading) {
    return (
      <AppTransition>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {t('assessment.loading')}
            </Text>
          </View>
        </SafeAreaView>
      </AppTransition>
    );
  }

  if (!progress || !currentQuestion) {
    return (
      <AppTransition>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {t('assessment.errorLoading')}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={initializeAssessment}
            >
              <Text style={styles.retryButtonText}>
                {t('common.retry')}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </AppTransition>
    );
  }

  const progressPercentage = progress.getProgressPercentage();
  const questionNumber = Object.keys(progress.answers).length + 1;

  return (
    <AppTransition>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={colors.statusBarStyle}
          backgroundColor={colors.background}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={handleBackPress}
          >
            <Text style={styles.exitButtonText}>
              {isRTL ? '→' : '←'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {t('assessment.title')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {progressPercentage}% {t('assessment.complete')}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveAndExit}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? t('common.saving') : t('assessment.save')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Question */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <QuestionCard
            question={currentQuestion.question}
            section={currentQuestion.section}
            currentAnswer={progress.getAnswer(currentQuestion.question.id)}
            onAnswerChange={handleAnswerChange}
            questionNumber={questionNumber}
            totalQuestions={ASSESSMENT_STATS.totalQuestions}
          />
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.previousButton,
              !canGoPrevious() && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={!canGoPrevious()}
          >
            <Text
              style={[
                styles.navButtonText,
                !canGoPrevious() && styles.navButtonTextDisabled,
              ]}
            >
              {t('assessment.previous')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              !canGoNext() && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canGoNext() || isSaving}
          >
            <LinearGradient
              colors={canGoNext() ? [colors.accent, colors.accentDark || colors.accent] : [colors.border, colors.border]}
              style={styles.nextButtonGradient}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  !canGoNext() && styles.navButtonTextDisabled,
                ]}
              >
                {progress.isComplete ? t('assessment.finish') : t('assessment.next')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default PersonalityAssessmentScreen;
