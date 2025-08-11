/**
 * BLONG PostDateFeedbackForm Component - Premium Elite Design
 * Comprehensive post-date feedback collection with ratings and insights
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  Animated
} from 'react-native';

// MANDATORY COLORS - Following Design Rules
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

const PostDateFeedbackForm = ({ 
  date,
  onSubmit,
  onCancel,
  style,
  isRTL = false
}) => {
  const [feedback, setFeedback] = useState({
    overallRating: 0,
    venueRating: 0,
    partnerRating: 0,
    experienceRating: 0,
    chemistryRating: 0,
    connectionLevel: '',
    conversationQuality: '',
    dateLength: '',
    followUpInterest: '',
    wouldDateAgain: null,
    wouldRecommendVenue: null,
    feedback: '',
    highlights: [],
    improvements: [],
    venueCompliments: [],
    venueCriticisms: [],
  });

  const [highlightInput, setHighlightInput] = useState('');
  const [improvementInput, setImprovementInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderStarRating = (value, onSelect, size = 'medium') => {
    const starSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onSelect(i)}
          activeOpacity={0.7}
          style={styles.starButton}
        >
          <Text style={[
            styles.star,
            { fontSize: starSize },
            { color: i <= value ? COLORS.warning : COLORS.border }
          ]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={styles.ratingText}>
          {value > 0 ? `${value}/5` : 'Tap to rate'}
        </Text>
      </View>
    );
  };

  const renderMultipleChoice = (value, options, onSelect, title) => (
    <View style={styles.multipleChoiceSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              value === option.value && styles.optionButtonSelected
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              value === option.value && styles.optionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderYesNoQuestion = (value, onSelect, question) => (
    <View style={styles.yesNoSection}>
      <Text style={styles.questionText}>{question}</Text>
      <View style={styles.yesNoContainer}>
        <TouchableOpacity
          style={[
            styles.yesNoButton,
            value === true && styles.yesNoButtonSelected
          ]}
          onPress={() => onSelect(true)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.yesNoText,
            value === true && styles.yesNoTextSelected
          ]}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.yesNoButton,
            value === false && styles.yesNoButtonSelected
          ]}
          onPress={() => onSelect(false)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.yesNoText,
            value === false && styles.yesNoTextSelected
          ]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFeedback(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFeedback(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addImprovement = () => {
    if (improvementInput.trim()) {
      setFeedback(prev => ({
        ...prev,
        improvements: [...prev.improvements, improvementInput.trim()]
      }));
      setImprovementInput('');
    }
  };

  const removeImprovement = (index) => {
    setFeedback(prev => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index)
    }));
  };

  const validateFeedback = () => {
    if (feedback.overallRating === 0) {
      Alert.alert('Required', 'Please provide an overall rating for your date.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFeedback()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...feedback,
        dateId: date.id,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const connectionOptions = [
    { value: 'NO_CONNECTION', label: 'No Connection' },
    { value: 'SLIGHT_CONNECTION', label: 'Slight Connection' },
    { value: 'GOOD_CONNECTION', label: 'Good Connection' },
    { value: 'STRONG_CONNECTION', label: 'Strong Connection' },
    { value: 'AMAZING_CONNECTION', label: 'Amazing Connection' },
  ];

  const conversationOptions = [
    { value: 'AWKWARD', label: 'Awkward' },
    { value: 'OKAY', label: 'Okay' },
    { value: 'GOOD', label: 'Good' },
    { value: 'GREAT', label: 'Great' },
    { value: 'AMAZING', label: 'Amazing' },
  ];

  const dateLengthOptions = [
    { value: 'TOO_SHORT', label: 'Too Short' },
    { value: 'JUST_RIGHT', label: 'Just Right' },
    { value: 'TOO_LONG', label: 'Too Long' },
  ];

  const followUpOptions = [
    { value: 'NO_INTEREST', label: 'No Interest' },
    { value: 'MAYBE', label: 'Maybe' },
    { value: 'INTERESTED', label: 'Interested' },
    { value: 'VERY_INTERESTED', label: 'Very Interested' },
  ];

  return (
    <View style={[styles.container, style]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How was your date?</Text>
          <Text style={styles.subtitle}>
            Your feedback helps us improve future matches
          </Text>
        </View>

        {/* Overall Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Rating *</Text>
          <Text style={styles.sectionSubtitle}>
            How would you rate your overall date experience?
          </Text>
          {renderStarRating(
            feedback.overallRating,
            (rating) => setFeedback(prev => ({ ...prev, overallRating: rating })),
            'large'
          )}
        </View>

        {/* Detailed Ratings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Ratings</Text>
          
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Venue Rating</Text>
            {renderStarRating(
              feedback.venueRating,
              (rating) => setFeedback(prev => ({ ...prev, venueRating: rating }))
            )}
          </View>

          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Chemistry Rating</Text>
            {renderStarRating(
              feedback.chemistryRating,
              (rating) => setFeedback(prev => ({ ...prev, chemistryRating: rating }))
            )}
          </View>

          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Experience Rating</Text>
            {renderStarRating(
              feedback.experienceRating,
              (rating) => setFeedback(prev => ({ ...prev, experienceRating: rating }))
            )}
          </View>
        </View>

        {/* Connection Level */}
        {renderMultipleChoice(
          feedback.connectionLevel,
          connectionOptions,
          (value) => setFeedback(prev => ({ ...prev, connectionLevel: value })),
          'Connection Level'
        )}

        {/* Conversation Quality */}
        {renderMultipleChoice(
          feedback.conversationQuality,
          conversationOptions,
          (value) => setFeedback(prev => ({ ...prev, conversationQuality: value })),
          'Conversation Quality'
        )}

        {/* Date Length */}
        {renderMultipleChoice(
          feedback.dateLength,
          dateLengthOptions,
          (value) => setFeedback(prev => ({ ...prev, dateLength: value })),
          'Date Length'
        )}

        {/* Follow-up Interest */}
        {renderMultipleChoice(
          feedback.followUpInterest,
          followUpOptions,
          (value) => setFeedback(prev => ({ ...prev, followUpInterest: value })),
          'Follow-up Interest'
        )}

        {/* Yes/No Questions */}
        <View style={styles.section}>
          {renderYesNoQuestion(
            feedback.wouldDateAgain,
            (value) => setFeedback(prev => ({ ...prev, wouldDateAgain: value })),
            'Would you date this person again?'
          )}

          {renderYesNoQuestion(
            feedback.wouldRecommendVenue,
            (value) => setFeedback(prev => ({ ...prev, wouldRecommendVenue: value })),
            'Would you recommend this venue to others?'
          )}
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Highlights</Text>
          <Text style={styles.sectionSubtitle}>
            What were the best parts of your date?
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={highlightInput}
              onChangeText={setHighlightInput}
              placeholder="Add a highlight..."
              placeholderTextColor={COLORS.textTertiary}
              onSubmitEditing={addHighlight}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addHighlight}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {feedback.highlights.map((highlight, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={styles.tagText}>{highlight}</Text>
              <TouchableOpacity
                onPress={() => removeHighlight(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.removeTag}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Improvements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions for Improvement</Text>
          <Text style={styles.sectionSubtitle}>
            What could have made the date better?
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={improvementInput}
              onChangeText={setImprovementInput}
              placeholder="Add a suggestion..."
              placeholderTextColor={COLORS.textTertiary}
              onSubmitEditing={addImprovement}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addImprovement}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {feedback.improvements.map((improvement, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={styles.tagText}>{improvement}</Text>
              <TouchableOpacity
                onPress={() => removeImprovement(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.removeTag}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Additional Comments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Comments</Text>
          <TextInput
            style={styles.textArea}
            value={feedback.feedback}
            onChangeText={(text) => setFeedback(prev => ({ ...prev, feedback: text }))}
            placeholder="Share any additional thoughts about your date..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton, 
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  ratingItem: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  multipleChoiceSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.background,
    fontWeight: '600',
  },
  yesNoSection: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 12,
  },
  yesNoContainer: {
    flexDirection: 'row',
  },
  yesNoButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  yesNoButtonSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  yesNoText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  yesNoTextSelected: {
    color: COLORS.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
    marginRight: 8,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  tagText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  removeTag: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textTertiary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default PostDateFeedbackForm;