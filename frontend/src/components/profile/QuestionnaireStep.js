/**
 * BLONG Questionnaire Step
 * Integration component for the comprehensive questionnaire in profile completion
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text as UIText, Button } from '../ui';
import QuestionnaireManager from './QuestionnaireManager';

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
};

const QuestionnaireStep = ({ profileData, onInputChange, onNext, onSkip }) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleQuestionnaireComplete = (answers) => {
    // Save questionnaire answers to profile data
    onInputChange('personalityData', answers);
    setShowQuestionnaire(false);
    
    // Automatically proceed to next step or completion
    if (onNext) {
      onNext();
    }
  };

  const handleSkipQuestionnaire = () => {
    setShowQuestionnaire(false);
    if (onSkip) {
      onSkip();
    }
  };

  if (showQuestionnaire) {
    return (
      <QuestionnaireManager
        onComplete={handleQuestionnaireComplete}
        onSkip={handleSkipQuestionnaire}
        initialData={profileData.personalityData || {}}
        showSkipOption={true}
      />
    );
  }

  return (
    <View>
      <Card style={{ marginBottom: 24 }}>
        <View style={{
          alignItems: 'center',
          paddingVertical: 24,
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: COLORS.accent + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{ fontSize: 32 }}>🧠</Text>
          </View>

          <UIText.H4 style={{ 
            textAlign: 'center', 
            marginBottom: 16,
            color: COLORS.text 
          }}>
            Personality Questionnaire
          </UIText.H4>

          <UIText.Body1 style={{ 
            textAlign: 'center', 
            marginBottom: 24,
            color: COLORS.textSecondary,
            lineHeight: 24,
          }}>
            Take our comprehensive personality questionnaire to help us find your perfect matches. 
            This takes about 5-10 minutes and greatly improves your match quality.
          </UIText.Body1>

          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <UIText.H6 style={{ 
              marginBottom: 12,
              color: COLORS.accent,
              textAlign: 'center'
            }}>
              What you'll discover:
            </UIText.H6>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                  Your personality type and communication style
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                  Your relationship goals and values
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                  Your lifestyle preferences and interests
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
                  Better compatibility matching
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 24,
              marginBottom: 16,
              shadowColor: COLORS.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => setShowQuestionnaire(true)}
          >
            <Text style={{
              color: COLORS.background,
              fontSize: 16,
              fontWeight: '500',
              letterSpacing: 0.5,
              textAlign: 'center',
            }}>
              Start Questionnaire
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
            onPress={handleSkipQuestionnaire}
          >
            <Text style={{
              color: COLORS.textSecondary,
              fontSize: 14,
              fontWeight: '300',
              textAlign: 'center',
            }}>
              Skip for now (you can take it later in Settings)
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <UIText.H6 style={{ 
          marginBottom: 16,
          color: COLORS.accent,
          textAlign: 'center'
        }}>
          Why take the questionnaire?
        </UIText.H6>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 20,
        }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: COLORS.accent + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{ fontSize: 20 }}>🎯</Text>
            </View>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              textAlign: 'center',
              fontWeight: '500',
            }}>
              Better Matches
            </Text>
          </View>

          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: COLORS.accent + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{ fontSize: 20 }}>💡</Text>
            </View>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              textAlign: 'center',
              fontWeight: '500',
            }}>
              Self Discovery
            </Text>
          </View>

          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: COLORS.accent + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{ fontSize: 20 }}>💕</Text>
            </View>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              textAlign: 'center',
              fontWeight: '500',
            }}>
              Deeper Connections
            </Text>
          </View>
        </View>

        <Text style={{
          fontSize: 12,
          color: COLORS.textTertiary,
          textAlign: 'center',
          lineHeight: 18,
        }}>
          Users who complete the questionnaire get 3x more meaningful matches 
          and report higher satisfaction with their dating experience.
        </Text>
      </Card>
    </View>
  );
};

export default QuestionnaireStep;
