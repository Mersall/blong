/**
 * BLONG Assessment Question Card Component
 * Displays individual assessment questions with different input types
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp, useTheme, useRTL } from '../../contexts/AppContext';
import { QUESTION_TYPES, LIKERT_LABELS } from '../../data/personalityQuestions';
import LikertScale from './LikertScale';
import MultipleChoice from './MultipleChoice';
import RankingQuestion from './RankingQuestion';
import SliderQuestion from './SliderQuestion';

const QuestionCard = ({
  question,
  section,
  currentAnswer,
  onAnswerChange,
  questionNumber,
  totalQuestions,
  style,
}) => {
  const { t } = useApp();
  const { colors } = useTheme();
  const { isRTL } = useRTL();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Animate card entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [question.id]);

  const styles = createStyles(colors, isRTL);

  const renderQuestionInput = () => {
    switch (question.type) {
      case QUESTION_TYPES.LIKERT_5:
        return (
          <LikertScale
            scale={5}
            value={currentAnswer}
            onValueChange={onAnswerChange}
            labels={LIKERT_LABELS[5]}
            colors={colors}
            isRTL={isRTL}
            t={t}
          />
        );

      case QUESTION_TYPES.LIKERT_7:
        return (
          <LikertScale
            scale={7}
            value={currentAnswer}
            onValueChange={onAnswerChange}
            labels={LIKERT_LABELS[7]}
            colors={colors}
            isRTL={isRTL}
            t={t}
          />
        );

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <MultipleChoice
            options={question.options}
            value={currentAnswer}
            onValueChange={onAnswerChange}
            colors={colors}
            isRTL={isRTL}
            t={t}
          />
        );

      case QUESTION_TYPES.RANKING:
        return (
          <RankingQuestion
            options={question.options}
            value={currentAnswer}
            onValueChange={onAnswerChange}
            colors={colors}
            isRTL={isRTL}
            t={t}
          />
        );

      case QUESTION_TYPES.SLIDER:
        return (
          <SliderQuestion
            min={question.min || 0}
            max={question.max || 100}
            value={currentAnswer}
            onValueChange={onAnswerChange}
            labelKey={question.labelKey}
            colors={colors}
            isRTL={isRTL}
            t={t}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.surface, colors.surfaceElevated]}
        style={styles.gradient}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {t('assessment.progress', { current: questionNumber, total: totalQuestions })}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(questionNumber / totalQuestions) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Section Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <Text style={styles.sectionTitle}>
            {t(section.titleKey)}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {t(question.textKey)}
          </Text>
        </View>

        {/* Answer Input */}
        <View style={styles.answerContainer}>
          {renderQuestionInput()}
        </View>

        {/* Answer Status */}
        {currentAnswer !== undefined && (
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <Text style={styles.statusText}>✓</Text>
            </View>
            <Text style={styles.statusLabel}>
              {t('assessment.answered')}
            </Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const createStyles = (colors, isRTL) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  gradient: {
    borderRadius: 16,
    padding: 24,
  },

  progressContainer: {
    marginBottom: 20,
  },

  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },

  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },

  sectionContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionIcon: {
    fontSize: 24,
    marginRight: isRTL ? 0 : 12,
    marginLeft: isRTL ? 12 : 0,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },

  questionContainer: {
    marginBottom: 24,
  },

  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 26,
    textAlign: isRTL ? 'right' : 'left',
  },

  answerContainer: {
    marginBottom: 20,
  },

  statusContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isRTL ? 0 : 8,
    marginLeft: isRTL ? 8 : 0,
  },

  statusText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },

  statusLabel: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
});

export default QuestionCard;
