/**
 * BLONG Edit Questionnaire Screen - Premium Elite Design
 * Allows users to edit their questionnaire answers
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { questionnaireService, QUESTIONNAIRE_DATA } from '../../services/questionnaireService';
import QuestionRenderer from '../../components/questionnaire/QuestionRenderer';

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
};

const EditQuestionnaireScreen = ({ userPhase, onBack, onSave }) => {
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState(0);

  const currentUserPhase = userPhase || 'single';
  const questionnaireData = QUESTIONNAIRE_DATA[currentUserPhase];

  useEffect(() => {
    loadExistingAnswers();
  }, [userPhase]);

  const loadExistingAnswers = async () => {
    try {
      setIsLoading(true);
      const existingAnswers = await questionnaireService.getAnswers(currentUserPhase);
      setAnswers(existingAnswers || {});
    } catch (error) {
      console.error('Error loading existing answers:', error);
      Alert.alert('Error', 'Failed to load your existing answers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save answers
      await questionnaireService.saveAnswers(currentUserPhase, answers);
      
      // Mark as complete
      await questionnaireService.markPhaseComplete(currentUserPhase);
      
      Alert.alert(
        'Success',
        'Your answers have been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSave) onSave(answers);
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving answers:', error);
      Alert.alert('Error', 'Failed to save your answers. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getAnsweredCount = (section) => {
    return section.questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== '').length;
  };

  const getTotalAnsweredCount = () => {
    const totalQuestions = questionnaireData.sections.reduce((total, section) => total + section.questions.length, 0);
    const answeredQuestions = Object.keys(answers).filter(key => answers[key] !== undefined && answers[key] !== '').length;
    return { answered: answeredQuestions, total: totalQuestions };
  };

  if (isLoading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>Loading your answers...</Text>
        </SafeAreaView>
      </AppTransition>
    );
  }

  const { answered, total } = getTotalAnsweredCount();
  const completionPercentage = Math.round((answered / total) * 100);

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header */}
        <View style={{
          paddingTop: 20,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
              <Text style={{ fontSize: 18, color: COLORS.accent }}>←</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Edit Profile
            </Text>
            
            <TouchableOpacity 
              onPress={handleSave}
              disabled={isSaving}
              style={{ 
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: COLORS.accent,
                borderRadius: 6,
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.background,
                letterSpacing: 0.5,
              }}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress Indicator */}
          <View style={{ marginTop: 16 }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              {answered} of {total} questions answered ({completionPercentage}%)
            </Text>
            <View style={{
              height: 4,
              backgroundColor: COLORS.border,
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <View style={{
                height: '100%',
                width: `${completionPercentage}%`,
                backgroundColor: COLORS.accent,
                borderRadius: 2,
              }} />
            </View>
          </View>
        </View>

        {/* Section Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 60 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 16 }}
        >
          {questionnaireData.sections.map((section, index) => {
            const answeredCount = getAnsweredCount(section);
            const totalCount = section.questions.length;
            const isSelected = selectedSection === index;
            
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSection(index)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 12,
                  backgroundColor: isSelected ? COLORS.accent : COLORS.surface,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isSelected ? COLORS.accent : COLORS.border,
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: isSelected ? COLORS.background : COLORS.text,
                  textAlign: 'center',
                }}>
                  {section.title}
                </Text>
                <Text style={{
                  fontSize: 10,
                  color: isSelected ? COLORS.background : COLORS.textSecondary,
                  textAlign: 'center',
                  marginTop: 2,
                }}>
                  {answeredCount}/{totalCount}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Questions Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{
            fontSize: 20,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}>
            {questionnaireData.sections[selectedSection]?.title}
          </Text>
          
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            marginBottom: 32,
            lineHeight: 20,
          }}>
            Review and update your answers below
          </Text>

          {questionnaireData.sections[selectedSection]?.questions.map((question, index) => (
            <View key={question.id} style={{ marginBottom: 32 }}>
              <QuestionRenderer
                question={question}
                value={answers[question.id]}
                onAnswerChange={(value) => handleAnswerChange(question.id, value)}
                showValidation={false}
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default EditQuestionnaireScreen;
