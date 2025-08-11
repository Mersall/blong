import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { AppTransition } from '../../components/AppTransition';
// Matching services removed

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
};

const QuestionnaireSuccessScreen = ({ answers, onContinue, onReviewAnswers, userPhase }) => {

  useEffect(() => {
    // Process AI matching when component mounts
    // Matching functionality removed
  }, []);

  // Matching functionality removed

  // Simulated matches functionality removed

  const handleContinue = () => {
    // Call the continue handler from MainNavigator
    if (onContinue) {
      onContinue();
    }
  };

  const handleReviewAnswers = () => {
    // Call the review answers handler from MainNavigator
    if (onReviewAnswers) {
      onReviewAnswers();
    }
  };

  const getAnswerSummary = () => {
    if (!answers) return 0;
    return Object.keys(answers).length;
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        {/* Success Content */}
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
        }}>
          {/* Success Icon */}
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: COLORS.accent + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <Text style={{
              fontSize: 48,
              color: COLORS.accent,
            }}>
              ✓
            </Text>
          </View>

          {/* Success Title */}
          <Text style={{
            fontSize: 28,
            fontWeight: '300',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: 16,
          }}>
            Profile Complete!
          </Text>

          {/* Success Message */}
          <Text style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 8,
          }}>
            Thank you for completing your questionnaire.
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textTertiary,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 48,
          }}>
            You answered {getAnswerSummary()} questions to help us find your perfect match.
          </Text>

          {/* Stats Cards */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            marginBottom: 48,
          }}>
            {/* Questions Answered */}
            <View style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              padding: 20,
              alignItems: 'center',
              flex: 1,
              marginHorizontal: 8,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '300',
                color: COLORS.accent,
                marginBottom: 4,
              }}>
                {getAnswerSummary()}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                textAlign: 'center',
              }}>
                Questions
                Answered
              </Text>
            </View>

            {/* Profile Completion */}
            <View style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              padding: 20,
              alignItems: 'center',
              flex: 1,
              marginHorizontal: 8,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '300',
                color: COLORS.accent,
                marginBottom: 4,
              }}>
                100%
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                textAlign: 'center',
              }}>
                Profile
                Complete
              </Text>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              paddingHorizontal: 48,
              paddingVertical: 16,
              borderRadius: 24,
              backgroundColor: COLORS.accent,
              shadowColor: COLORS.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
              minWidth: 200,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              color: COLORS.background,
              fontWeight: '500',
              letterSpacing: 0.5,
            }}>
              Continue to BLONG
            </Text>
          </TouchableOpacity>

          {/* Secondary Action */}
          <TouchableOpacity
            onPress={handleReviewAnswers}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              marginTop: 16,
            }}
          >
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
            }}>
              Review Answers
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default QuestionnaireSuccessScreen;
