/**
 * BLONG Enhanced Preparing Phase Screen
 * Specialized features for relationship preparation: vision boards, relationship goals
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
import { ProgressRing } from '../../components/quiz/GamificationSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Elite color system for Preparing phase
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#9C27B0',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
  warning: '#FF9800',
  gradient: {
    primary: ['#9C27B0', '#BA68C8'],
    secondary: ['#F3E5F5', '#FFFFFF'],
  },
};

const EnhancedPreparingPhaseScreen = ({ 
  userPreferences, 
  user, 
  navigation,
  onNavigateToQuestionnaire 
}) => {
  const [selectedVisionItem, setSelectedVisionItem] = useState(null);
  const [relationshipScore, setRelationshipScore] = useState(78);
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [completedGoals, setCompletedGoals] = useState(['communication', 'trust']);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const visionAnim = useRef(new Animated.Value(0)).current;

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
  };

  const visionBoardItems = [
    {
      id: 'home',
      icon: '🏡',
      title: 'Dream Home',
      description: 'Visualize your shared living space',
      color: COLORS.success,
      completed: false,
    },
    {
      id: 'travel',
      icon: '✈️',
      title: 'Travel Adventures',
      description: 'Places to explore together',
      color: COLORS.warning,
      completed: true,
    },
    {
      id: 'family',
      icon: '👨‍👩‍👧‍👦',
      title: 'Future Family',
      description: 'Your family planning vision',
      color: COLORS.accent,
      completed: false,
    },
    {
      id: 'career',
      icon: '🎯',
      title: 'Career Goals',
      description: 'Supporting each other\'s ambitions',
      color: '#2196F3',
      completed: true,
    },
    {
      id: 'lifestyle',
      icon: '🌟',
      title: 'Lifestyle',
      description: 'Your ideal way of living',
      color: '#FF6B35',
      completed: false,
    },
    {
      id: 'values',
      icon: '💎',
      title: 'Shared Values',
      description: 'Core beliefs that unite you',
      color: '#4CAF50',
      completed: true,
    },
  ];

  const relationshipGoals = [
    {
      id: 'communication',
      title: 'Master Communication',
      description: 'Learn effective listening and expression',
      progress: 85,
      completed: completedGoals.includes('communication'),
      color: COLORS.success,
      skills: ['Active listening', 'Emotional expression', 'Conflict resolution'],
    },
    {
      id: 'trust',
      title: 'Build Deep Trust',
      description: 'Create a foundation of mutual trust',
      progress: 92,
      completed: completedGoals.includes('trust'),
      color: COLORS.accent,
      skills: ['Transparency', 'Reliability', 'Vulnerability'],
    },
    {
      id: 'intimacy',
      title: 'Emotional Intimacy',
      description: 'Deepen your emotional connection',
      progress: 65,
      completed: false,
      color: '#E91E63',
      skills: ['Emotional sharing', 'Physical affection', 'Quality time'],
    },
    {
      id: 'growth',
      title: 'Mutual Growth',
      description: 'Support each other\'s development',
      progress: 40,
      completed: false,
      color: COLORS.warning,
      skills: ['Goal setting', 'Encouragement', 'Personal space'],
    },
    {
      id: 'future',
      title: 'Plan Your Future',
      description: 'Align your long-term visions',
      progress: 30,
      completed: false,
      color: '#2196F3',
      skills: ['Financial planning', 'Life goals', 'Decision making'],
    },
  ];

  const handleVisionItemPress = (item) => {
    setSelectedVisionItem(item);
    setShowVisionModal(true);
    
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGoalPress = (goal) => {
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Navigate to goal details or start goal activity
  };

  const completedVisionItems = visionBoardItems.filter(item => item.completed).length;
  const completedGoalsCount = relationshipGoals.filter(goal => goal.completed).length;

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
            💍 PREPARING
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            letterSpacing: 1,
          }}>
            RELATIONSHIP READY
          </Text>
        </View>

        <View style={{ width: 60 }} />
      </View>

      {/* Relationship Readiness Score */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 16,
        }}>
          Relationship Readiness
        </Text>

        <ProgressRing
          progress={relationshipScore}
          total={100}
          size={120}
          strokeWidth={8}
          color={COLORS.accent}
          showAnimation={true}
        />

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          marginTop: 16,
          lineHeight: 20,
        }}>
          You're well-prepared for a meaningful relationship!
        </Text>
      </View>
    </View>
  );

  const renderVisionBoard = () => (
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
          Vision Board
        </Text>

        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
        }}>
          {completedVisionItems}/{visionBoardItems.length} completed
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {visionBoardItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleVisionItemPress(item)}
            style={{
              width: (screenWidth - 76) / 2,
              marginBottom: 12,
            }}
          >
            <LinearGradient
              colors={item.completed 
                ? [`${item.color}20`, `${item.color}10`]
                : [COLORS.surface, COLORS.background]
              }
              style={{
                borderRadius: 16,
                padding: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: item.completed ? `${item.color}40` : COLORS.border,
                minHeight: 140,
                justifyContent: 'center',
              }}
            >
              <Text style={{ 
                fontSize: 32, 
                marginBottom: 12,
                opacity: item.completed ? 1 : 0.7,
              }}>
                {item.icon}
              </Text>
              
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                {item.title}
              </Text>
              
              <Text style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                textAlign: 'center',
                lineHeight: 14,
              }}>
                {item.description}
              </Text>

              {item.completed && (
                <View style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: item.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: 'bold' }}>
                    ✓
                  </Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderRelationshipGoals = () => (
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
          Relationship Goals
        </Text>

        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
        }}>
          {completedGoalsCount}/{relationshipGoals.length} mastered
        </Text>
      </View>

      {relationshipGoals.map((goal, index) => (
        <TouchableOpacity
          key={goal.id}
          onPress={() => handleGoalPress(goal)}
          style={{
            marginBottom: 16,
          }}
        >
          <LinearGradient
            colors={goal.completed 
              ? [`${goal.color}20`, `${goal.color}10`]
              : [COLORS.surface, COLORS.background]
            }
            style={{
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: goal.completed ? `${goal.color}40` : COLORS.border,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginBottom: 4,
                }}>
                  {goal.title}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}>
                  {goal.description}
                </Text>
              </View>

              {goal.completed && (
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: goal.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 12,
                }}>
                  <Text style={{ color: COLORS.background, fontSize: 14, fontWeight: 'bold' }}>
                    ✓
                  </Text>
                </View>
              )}
            </View>

            {/* Progress Bar */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <View style={{
                flex: 1,
                height: 6,
                backgroundColor: COLORS.border,
                borderRadius: 3,
                overflow: 'hidden',
                marginRight: 12,
              }}>
                <View
                  style={{
                    width: `${goal.progress}%`,
                    height: '100%',
                    backgroundColor: goal.color,
                    borderRadius: 3,
                  }}
                />
              </View>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: goal.color,
                minWidth: 35,
              }}>
                {goal.progress}%
              </Text>
            </View>

            {/* Skills */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              {goal.skills.map((skill, skillIndex) => (
                <View
                  key={skillIndex}
                  style={{
                    backgroundColor: `${goal.color}15`,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{
                    fontSize: 10,
                    color: goal.color,
                    fontWeight: '500',
                  }}>
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderActionButtons = () => (
    <View style={{
      paddingHorizontal: 32,
      paddingBottom: 32,
      gap: 16,
    }}>
      <TouchableOpacity
        onPress={() => setShowGoalsModal(true)}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 8 }}>🎯</Text>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 4,
        }}>
          Set New Goals
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          Define what you want to achieve together
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
          Relationship Assessment
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.background,
          opacity: 0.9,
          textAlign: 'center',
        }}>
          Evaluate your relationship readiness
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
            {renderVisionBoard()}
            {renderRelationshipGoals()}
            {renderActionButtons()}
          </ScrollView>
        </LinearGradient>

        {/* Vision Modal */}
        <Modal
          visible={showVisionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowVisionModal(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingHorizontal: 32,
          }}>
            {selectedVisionItem && (
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 20,
                padding: 32,
                maxWidth: screenWidth * 0.9,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>
                  {selectedVisionItem.icon}
                </Text>
                
                <Text style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  {selectedVisionItem.title}
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 20,
                }}>
                  {selectedVisionItem.description}
                </Text>

                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                }}>
                  <TouchableOpacity
                    onPress={() => setShowVisionModal(false)}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.surface,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      color: COLORS.textSecondary,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                      Later
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      // Mark as completed and close modal
                      setShowVisionModal(false);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: selectedVisionItem.color,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      color: COLORS.background,
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                      Create Vision
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </AppTransition>
  );
};

export default EnhancedPreparingPhaseScreen;