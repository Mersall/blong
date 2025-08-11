/**
 * BLONG Enhanced Single Phase Screen
 * Specialized features for singles: self-reflection tools, readiness assessments
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Haptics,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTransition } from '../../components/AppTransition';
import { ProgressRing, ExperienceBar } from '../../components/quiz/GamificationSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Elite color system for Singles phase
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
  gradient: {
    primary: ['#FF6B35', '#FF8A65'],
    secondary: ['#FFF5F0', '#FFFFFF'],
  },
};

const EnhancedSinglePhaseScreen = ({ 
  userPreferences, 
  user, 
  navigation,
  onNavigateToQuestionnaire 
}) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [readinessScore, setReadinessScore] = useState(65);
  const [reflectionEntry, setReflectionEntry] = useState('');
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [completedActivities, setCompletedActivities] = useState([]);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animateEntrance();
  }, []);

  const animateEntrance = () => {
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

    // Pulse animation for high readiness
    if (readinessScore > 70) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  };

  const selfReflectionTools = [
    {
      id: 'values',
      icon: '💎',
      title: 'Core Values Assessment',
      subtitle: 'Identify what matters most to you',
      description: 'Understand your fundamental values to find compatible partners',
      estimatedTime: '10 minutes',
      completed: completedActivities.includes('values'),
      color: COLORS.accent,
    },
    {
      id: 'goals',
      icon: '🎯',
      title: 'Life Goals Mapping',
      subtitle: 'Visualize your future aspirations',
      description: 'Map out your personal and relationship goals',
      estimatedTime: '15 minutes',
      completed: completedActivities.includes('goals'),
      color: COLORS.success,
    },
    {
      id: 'personality',
      icon: '🧠',
      title: 'Personality Deep Dive',
      subtitle: 'Explore your unique traits',
      description: 'Advanced personality assessment for better matches',
      estimatedTime: '20 minutes',
      completed: completedActivities.includes('personality'),
      color: COLORS.warning,
    },
    {
      id: 'attachment',
      icon: '❤️',
      title: 'Attachment Style',
      subtitle: 'Understand your relationship patterns',
      description: 'Learn how you connect with others emotionally',
      estimatedTime: '12 minutes',
      completed: completedActivities.includes('attachment'),
      color: '#9C27B0',
    },
  ];

  const readinessChecklist = [
    {
      id: 'profile',
      title: 'Complete your dating profile',
      completed: true,
      points: 20,
    },
    {
      id: 'photos',
      title: 'Upload 3+ quality photos',
      completed: true,
      points: 15,
    },
    {
      id: 'preferences',
      title: 'Set your dating preferences',
      completed: false,
      points: 10,
    },
    {
      id: 'values',
      title: 'Complete values assessment',
      completed: completedActivities.includes('values'),
      points: 25,
    },
    {
      id: 'goals',
      title: 'Define relationship goals',
      completed: completedActivities.includes('goals'),
      points: 20,
    },
    {
      id: 'readiness',
      title: 'Complete readiness self-check',
      completed: false,
      points: 10,
    },
  ];

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate completing the activity
    setTimeout(() => {
      if (!completedActivities.includes(tool.id)) {
        setCompletedActivities(prev => [...prev, tool.id]);
        setReadinessScore(prev => Math.min(prev + 10, 100));
      }
      setSelectedTool(null);
    }, 2000);
  };

  const handleReflectionPress = () => {
    setShowReflectionModal(true);
  };

  const handleSaveReflection = () => {
    // Save reflection entry
    setShowReflectionModal(false);
    if (Haptics?.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const completedCount = readinessChecklist.filter(item => item.completed).length;
  const totalPoints = readinessChecklist.reduce((sum, item) => sum + (item.completed ? item.points : 0), 0);

  const renderHeader = () => (
    <View style={{
      paddingTop: 20,
      paddingHorizontal: 32,
      paddingBottom: 24,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
          }}
        >
          <Text style={{
            fontSize: 16,
            color: COLORS.accent,
            fontWeight: '500',
          }}>
            ← Back
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            letterSpacing: 2,
            marginBottom: 4,
          }}>
            💝 SINGLES
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            letterSpacing: 1,
          }}>
            SELF-DISCOVERY
          </Text>
        </View>

        <View style={{ width: 60 }} />
      </View>

      {/* Readiness Score */}
      <Animated.View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 20,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: COLORS.border,
          transform: [{ scale: pulseAnim }],
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 16,
        }}>
          Dating Readiness Score
        </Text>

        <ProgressRing
          progress={readinessScore}
          total={100}
          size={120}
          strokeWidth={8}
          color={readinessScore > 70 ? COLORS.success : COLORS.accent}
          showAnimation={true}
        />

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          marginTop: 16,
          lineHeight: 20,
        }}>
          {readinessScore > 80 
            ? "You're ready for meaningful connections!"
            : readinessScore > 60
            ? "Almost there! Complete more activities."
            : "Focus on self-discovery first."
          }
        </Text>
      </Animated.View>
    </View>
  );

  const renderSelfReflectionTools = () => (
    <Animated.View
      style={{
        paddingHorizontal: 32,
        marginBottom: 32,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
      }}>
        Self-Reflection Tools
      </Text>

      {selfReflectionTools.map((tool, index) => (
        <TouchableOpacity
          key={tool.id}
          onPress={() => handleToolSelect(tool)}
          disabled={selectedTool?.id === tool.id}
          style={{
            marginBottom: 16,
          }}
        >
          <LinearGradient
            colors={tool.completed 
              ? [`${tool.color}20`, `${tool.color}10`]
              : [COLORS.surface, COLORS.background]
            }
            style={{
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: tool.completed ? `${tool.color}40` : COLORS.border,
              opacity: selectedTool?.id === tool.id ? 0.7 : 1,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: `${tool.color}20`,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Text style={{ fontSize: 20 }}>{tool.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginBottom: 4,
                }}>
                  {tool.title}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}>
                  {tool.subtitle}
                </Text>
              </View>

              {tool.completed && (
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: tool.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ color: COLORS.background, fontSize: 12, fontWeight: 'bold' }}>
                    ✓
                  </Text>
                </View>
              )}
            </View>

            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 20,
              marginBottom: 12,
            }}>
              {tool.description}
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.textTertiary,
              }}>
                ⏱️ {tool.estimatedTime}
              </Text>

              <Text style={{
                fontSize: 12,
                color: tool.completed ? tool.color : COLORS.accent,
                fontWeight: '500',
              }}>
                {selectedTool?.id === tool.id 
                  ? 'Starting...'
                  : tool.completed 
                  ? 'Completed'
                  : 'Start'
                }
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderReadinessChecklist = () => (
    <Animated.View
      style={{
        paddingHorizontal: 32,
        marginBottom: 32,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: COLORS.text,
        }}>
          Readiness Checklist
        </Text>

        <View style={{
          backgroundColor: COLORS.accent,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
        }}>
          <Text style={{
            color: COLORS.background,
            fontSize: 12,
            fontWeight: '600',
          }}>
            {totalPoints} points
          </Text>
        </View>
      </View>

      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        {readinessChecklist.map((item, index) => (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: index < readinessChecklist.length - 1 ? 1 : 0,
              borderBottomColor: COLORS.border,
            }}
          >
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: item.completed ? COLORS.success : COLORS.border,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              {item.completed ? (
                <Text style={{ color: COLORS.background, fontSize: 12, fontWeight: 'bold' }}>
                  ✓
                </Text>
              ) : (
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.textTertiary,
                }} />
              )}
            </View>

            <Text style={{
              flex: 1,
              fontSize: 14,
              color: item.completed ? COLORS.text : COLORS.textSecondary,
              fontWeight: item.completed ? '500' : '400',
            }}>
              {item.title}
            </Text>

            <Text style={{
              fontSize: 12,
              color: COLORS.accent,
              fontWeight: '600',
            }}>
              +{item.points}
            </Text>
          </View>
        ))}

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: COLORS.text,
          }}>
            Progress: {completedCount}/{readinessChecklist.length}
          </Text>

          <View style={{
            width: 100,
            height: 4,
            backgroundColor: COLORS.border,
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <View
              style={{
                width: `${(completedCount / readinessChecklist.length) * 100}%`,
                height: '100%',
                backgroundColor: COLORS.success,
                borderRadius: 2,
              }}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderActionButtons = () => (
    <View style={{
      paddingHorizontal: 32,
      paddingBottom: 32,
      gap: 16,
    }}>
      <TouchableOpacity
        onPress={handleReflectionPress}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 8 }}>📝</Text>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 4,
        }}>
          Daily Reflection
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          Take a moment to reflect on your journey
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNavigateToQuestionnaire}
        style={{
          backgroundColor: COLORS.accent,
          borderRadius: 16,
          padding: 20,
          alignItems: 'center',
          shadowColor: COLORS.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.background,
          marginBottom: 4,
        }}>
          Complete Dating Profile
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.background,
          opacity: 0.9,
          textAlign: 'center',
        }}>
          Answer questions to find your perfect match
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        <LinearGradient
          colors={COLORS.gradient.secondary}
          style={{ flex: 1 }}
        >
          {renderHeader()}

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {renderSelfReflectionTools()}
            {renderReadinessChecklist()}
            {renderActionButtons()}
          </ScrollView>
        </LinearGradient>

        {/* Reflection Modal */}
        <Modal
          visible={showReflectionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReflectionModal(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <View style={{
              backgroundColor: COLORS.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 32,
              minHeight: screenHeight * 0.5,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
              }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: COLORS.text,
                }}>
                  Daily Reflection
                </Text>
                <TouchableOpacity
                  onPress={() => setShowReflectionModal(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: COLORS.surface,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>×</Text>
                </TouchableOpacity>
              </View>

              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                marginBottom: 20,
                lineHeight: 20,
              }}>
                Take a moment to reflect on your feelings, goals, and what you're looking for in a relationship.
              </Text>

              <View style={{
                backgroundColor: COLORS.surface,
                borderRadius: 12,
                padding: 16,
                minHeight: 120,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginBottom: 24,
              }}>
                <Text style={{
                  fontSize: 14,
                  color: COLORS.text,
                  lineHeight: 20,
                }}>
                  {reflectionEntry || 'Start writing your thoughts...'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSaveReflection}
                style={{
                  backgroundColor: COLORS.accent,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: COLORS.background,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Save Reflection
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </AppTransition>
  );
};

export default EnhancedSinglePhaseScreen;