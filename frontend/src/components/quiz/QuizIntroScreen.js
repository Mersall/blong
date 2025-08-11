/**
 * BLONG Quiz Introduction Screen
 * Explains the personality assessment process
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { AppTransition } from '../AppTransition';
import AnimatedQuizButton from './AnimatedQuizButton';
import quizService from '../../services/quizService';

const { width: screenWidth } = Dimensions.get('window');

const QuizIntroScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  useEffect(() => {
    loadQuizProgress();
    animateEntrance();
  }, []);

  const loadQuizProgress = async () => {
    try {
      const progressData = await quizService.getQuizProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading quiz progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getContinueButtonText = () => {
    if (!progress) return 'Start Personality Assessment';
    if (progress.isComplete) return 'View Your Results';
    if (progress.overallProgress > 0) return `Continue Assessment (${progress.overallProgress}%)`;
    return 'Start Personality Assessment';
  };

  const getNavigationTarget = () => {
    if (!progress) return 'Quiz';
    if (progress.isComplete) return 'QuizResults';
    return 'Quiz';
  };

  const features = [
    {
      icon: '🧠',
      title: 'Big Five Personality',
      description: 'Discover your core traits using the most scientifically validated personality model.',
      badge: 'Scientific',
      color: COLORS.accent,
    },
    {
      icon: '💕',
      title: 'Love Languages',
      description: 'Learn how you express and receive love for deeper emotional connections.',
      badge: 'Emotional',
      color: '#E91E63',
    },
    {
      icon: '🤝',
      title: 'Attachment Style',
      description: 'Understand your relationship patterns and how you connect with others.',
      badge: 'Relational',
      color: '#9C27B0',
    },
    {
      icon: '🎯',
      title: 'Smart Matching',
      description: 'Get matched with people who truly complement your unique personality.',
      badge: 'AI-Powered',
      color: '#4CAF50',
    },
  ];

  const renderFeature = (feature, index) => {
    const animDelay = index * 200;
    const [featureAnim] = useState(new Animated.Value(0));
    
    useEffect(() => {
      Animated.timing(featureAnim, {
        toValue: 1,
        duration: 600,
        delay: animDelay,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View 
        key={index} 
        style={{
          opacity: featureAnim,
          transform: [{
            translateY: featureAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          borderLeftWidth: 4,
          borderLeftColor: feature.color,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${feature.color}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <Text style={{ fontSize: 24 }}>
              {feature.icon}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 6,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.text,
                flex: 1,
              }}>
                {feature.title}
              </Text>
              <View style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                backgroundColor: `${feature.color}20`,
                borderRadius: 12,
              }}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: feature.color,
                  textTransform: 'uppercase',
                }}>
                  {feature.badge}
                </Text>
              </View>
            </View>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
            }}>
              {feature.description}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={{
          paddingTop: 20,
          paddingBottom: 16,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>← Back</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Personality Quiz
            </Text>
            
            <View style={{ width: 50 }} />
          </View>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 32, 
            paddingVertical: 40,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: 'center',
            marginBottom: 48,
          }}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: `${COLORS.accent}15`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              shadowColor: COLORS.accent,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 8,
            }}>
              <Text style={{ fontSize: 48 }}>🎯</Text>
            </View>

            <Text style={{
              fontSize: 28,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 36,
            }}>
              {progress && progress.isComplete ? 'Your Personality Awaits' : 'Discover Your True Self'}
            </Text>

            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              paddingHorizontal: 16,
            }}>
              {progress && progress.isComplete 
                ? 'Your personality profile is ready! View your detailed results and insights.'
                : 'Take our scientifically-backed personality assessment to discover what makes you unique and find truly compatible matches.'
              }
            </Text>

            {/* Progress Indicator */}
            {progress && progress.overallProgress > 0 && !progress.isComplete && (
              <View style={{
                marginTop: 20,
                paddingHorizontal: 20,
                paddingVertical: 12,
                backgroundColor: `${COLORS.accent}10`,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: `${COLORS.accent}30`,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.accent,
                  textAlign: 'center',
                }}>
                  🚀 {progress.overallProgress}% Complete
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Features */}
          <View style={{ marginBottom: 40 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '500',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              What You'll Discover
            </Text>
            
            {features.map((feature, index) => renderFeature(feature, index))}
          </View>

          {/* Quiz Details */}
          <View style={{
            backgroundColor: `${COLORS.accent}08`,
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: `${COLORS.accent}20`,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.text,
              marginBottom: 12,
              textAlign: 'center',
            }}>
              📊 Assessment Details
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 16,
            }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${COLORS.accent}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: COLORS.accent,
                  }}>
                    42
                  </Text>
                </View>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                }}>
                  Questions
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${COLORS.accent}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: COLORS.accent,
                  }}>
                    8
                  </Text>
                </View>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                }}>
                  Minutes
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${COLORS.accent}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: COLORS.accent,
                  }}>
                    3
                  </Text>
                </View>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                }}>
                  Categories
                </Text>
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.success,
                marginRight: 8,
              }} />
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                fontWeight: '500',
              }}>
                Save & Resume Anytime
              </Text>
            </View>
            <Text style={{
              fontSize: 13,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 18,
            }}>
              Your responses are private and secure. Pause whenever you need a break.
            </Text>
          </View>

          {/* Privacy Note */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 32,
          }}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.text,
                marginBottom: 4,
              }}>
                Your Privacy Matters
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                lineHeight: 16,
              }}>
                Your personality data is encrypted and only used to improve your matching experience.
              </Text>
            </View>
          </View>

          {/* Continue/Start Button */}
          <AnimatedQuizButton
            onPress={() => navigation.navigate(getNavigationTarget())}
            variant="primary"
            size="large"
            style={{
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {getContinueButtonText()}
          </AnimatedQuizButton>

          {/* Skip/Home Option */}
          {!progress || !progress.isComplete ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{
                alignItems: 'center',
                paddingVertical: 16,
                marginTop: 16,
              }}
            >
              <Text style={{
                fontSize: 14,
                color: COLORS.textTertiary,
                textDecorationLine: 'underline',
              }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{
                alignItems: 'center',
                paddingVertical: 16,
                marginTop: 16,
              }}
            >
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
              }}>
                Back to Home
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default QuizIntroScreen;
