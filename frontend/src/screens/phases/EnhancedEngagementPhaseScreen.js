/**
 * BLONG Enhanced Engagement Phase Screen
 * Specialized features for engagement planning: wedding tools, milestone tracking
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

// Elite color system for Engagement phase
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FFD700',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
  warning: '#FF9800',
  rose: '#FF6B9D',
  gradient: {
    primary: ['#FFD700', '#FFA000'],
    secondary: ['#FFFDE7', '#FFFFFF'],
    rose: ['#FF6B9D', '#FF8A80'],
  },
};

const EnhancedEngagementPhaseScreen = ({ 
  userPreferences, 
  user, 
  navigation,
  onNavigateToQuestionnaire 
}) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [planningProgress, setPlanningProgress] = useState(45);
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState(['engagement', 'venue']);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateEntrance();
    startSparkleAnimation();
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

  const startSparkleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const planningTools = [
    {
      id: 'budget',
      icon: '💰',
      title: 'Budget Planner',
      subtitle: 'Track wedding expenses',
      description: 'Manage your wedding budget with smart allocation tools',
      color: COLORS.success,
      completed: true,
      progress: 85,
    },
    {
      id: 'venue',
      icon: '🏰',
      title: 'Venue Finder',
      subtitle: 'Find your perfect venue',
      description: 'Browse and compare wedding venues in your area',
      color: COLORS.accent,
      completed: true,
      progress: 100,
    },
    {
      id: 'vendors',
      icon: '👥',
      title: 'Vendor Directory',
      subtitle: 'Connect with professionals',
      description: 'Find photographers, caterers, florists, and more',
      color: COLORS.rose,
      completed: false,
      progress: 30,
    },
    {
      id: 'timeline',
      icon: '📅',
      title: 'Wedding Timeline',
      subtitle: 'Plan your perfect day',
      description: 'Create a detailed schedule for your wedding day',
      color: '#9C27B0',
      completed: false,
      progress: 60,
    },
    {
      id: 'guests',
      icon: '💌',
      title: 'Guest Management',
      subtitle: 'Track RSVPs and seating',
      description: 'Manage invitations, RSVPs, and seating arrangements',
      color: '#2196F3',
      completed: false,
      progress: 20,
    },
    {
      id: 'registry',
      icon: '🎁',
      title: 'Gift Registry',
      subtitle: 'Create your wishlist',
      description: 'Set up your wedding registry across multiple stores',
      color: COLORS.warning,
      completed: false,
      progress: 0,
    },
  ];

  const weddingMilestones = [
    {
      id: 'engagement',
      title: 'Get Engaged',
      description: 'The magical moment that started it all',
      date: '6 months ago',
      completed: completedMilestones.includes('engagement'),
      icon: '💍',
      color: COLORS.rose,
    },
    {
      id: 'venue',
      title: 'Book Venue',
      description: 'Secure your dream wedding location',
      date: '2 months ago',
      completed: completedMilestones.includes('venue'),
      icon: '🏰',
      color: COLORS.accent,
    },
    {
      id: 'dress',
      title: 'Choose Wedding Dress',
      description: 'Find the perfect dress for your special day',
      date: 'In progress',
      completed: false,
      icon: '👰',
      color: '#E91E63',
    },
    {
      id: 'invitations',
      title: 'Send Invitations',
      description: 'Share your joy with family and friends',
      date: 'Upcoming',
      completed: false,
      icon: '💌',
      color: '#9C27B0',
    },
    {
      id: 'rehearsal',
      title: 'Rehearsal Dinner',
      description: 'Practice and celebrate with close ones',
      date: 'Upcoming',
      completed: false,
      icon: '🍽️',
      color: COLORS.warning,
    },
    {
      id: 'wedding',
      title: 'Wedding Day',
      description: 'Your perfect day arrives',
      date: 'The Big Day',
      completed: false,
      icon: '✨',
      color: COLORS.accent,
    },
  ];

  const countdownData = {
    months: 4,
    weeks: 2,
    days: 5,
    hours: 14,
  };

  const handleToolPress = (tool) => {
    setSelectedTool(tool);
    
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Navigate to specific tool or show modal
    setTimeout(() => {
      setSelectedTool(null);
    }, 200);
  };

  const handleMilestonePress = (milestone) => {
    setSelectedMilestone(milestone);
    
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const completedToolsCount = planningTools.filter(tool => tool.completed).length;
  const completedMilestonesCount = weddingMilestones.filter(milestone => milestone.completed).length;

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
          <Animated.Text style={{
            fontSize: 24,
            fontWeight: '300',
            color: COLORS.text,
            letterSpacing: 2,
            marginBottom: 4,
            opacity: sparkleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }}>
            ✨ ENGAGEMENT
          </Animated.Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            letterSpacing: 1,
          }}>
            WEDDING PLANNING
          </Text>
        </View>

        <View style={{ width: 60 }} />
      </View>

      {/* Wedding Countdown */}
      <LinearGradient
        colors={COLORS.gradient.primary}
        style={{
          borderRadius: 16,
          padding: 20,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.background,
          marginBottom: 16,
        }}>
          Wedding Countdown
        </Text>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          marginBottom: 16,
        }}>
          {Object.entries(countdownData).map(([unit, value]) => (
            <View key={unit} style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: COLORS.background,
              }}>
                {value}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.background,
                opacity: 0.9,
                textTransform: 'capitalize',
              }}>
                {unit}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{
          fontSize: 14,
          color: COLORS.background,
          opacity: 0.9,
          textAlign: 'center',
        }}>
          Until your special day arrives! ✨
        </Text>
      </LinearGradient>

      {/* Planning Progress */}
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
          Planning Progress
        </Text>

        <ProgressRing
          progress={planningProgress}
          total={100}
          size={100}
          strokeWidth={6}
          color={COLORS.accent}
          showAnimation={true}
        />

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          marginTop: 12,
          lineHeight: 20,
        }}>
          {completedToolsCount}/{planningTools.length} planning tools completed
        </Text>
      </View>
    </View>
  );

  const renderPlanningTools = () => (
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
        Wedding Planning Tools
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {planningTools.map((tool, index) => (
          <TouchableOpacity
            key={tool.id}
            onPress={() => handleToolPress(tool)}
            style={{
              width: (screenWidth - 76) / 2,
              marginBottom: 12,
            }}
          >
            <LinearGradient
              colors={tool.completed 
                ? [`${tool.color}20`, `${tool.color}10`]
                : [COLORS.surface, COLORS.background]
              }
              style={{
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: tool.completed ? `${tool.color}40` : COLORS.border,
                minHeight: 160,
              }}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}>
                <Text style={{ fontSize: 24 }}>{tool.icon}</Text>
                
                {tool.completed && (
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: tool.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: 'bold' }}>
                      ✓
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 4,
              }}>
                {tool.title}
              </Text>
              
              <Text style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                marginBottom: 12,
              }}>
                {tool.subtitle}
              </Text>

              <Text style={{
                fontSize: 10,
                color: COLORS.textTertiary,
                lineHeight: 14,
                marginBottom: 12,
                flex: 1,
              }}>
                {tool.description}
              </Text>

              {/* Progress Bar */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: COLORS.border,
                  borderRadius: 2,
                  overflow: 'hidden',
                  marginRight: 8,
                }}>
                  <View
                    style={{
                      width: `${tool.progress}%`,
                      height: '100%',
                      backgroundColor: tool.color,
                      borderRadius: 2,
                    }}
                  />
                </View>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: tool.color,
                }}>
                  {tool.progress}%
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderWeddingTimeline = () => (
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
          Wedding Timeline
        </Text>

        <TouchableOpacity
          onPress={() => setShowTimelineModal(true)}
          style={{
            backgroundColor: COLORS.accent,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          }}
        >
          <Text style={{
            color: COLORS.background,
            fontSize: 10,
            fontWeight: '600',
          }}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        {weddingMilestones.slice(0, 4).map((milestone, index) => (
          <TouchableOpacity
            key={milestone.id}
            onPress={() => handleMilestonePress(milestone)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: index < 3 ? 1 : 0,
              borderBottomColor: COLORS.border,
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: milestone.completed 
                ? `${milestone.color}20` 
                : COLORS.background,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
              borderWidth: 2,
              borderColor: milestone.completed ? milestone.color : COLORS.border,
            }}>
              <Text style={{ fontSize: 16 }}>{milestone.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: milestone.completed ? COLORS.text : COLORS.textSecondary,
                marginBottom: 2,
              }}>
                {milestone.title}
              </Text>
              <Text style={{
                fontSize: 11,
                color: COLORS.textTertiary,
                marginBottom: 4,
              }}>
                {milestone.description}
              </Text>
              <Text style={{
                fontSize: 10,
                color: milestone.color,
                fontWeight: '500',
              }}>
                {milestone.date}
              </Text>
            </View>

            {milestone.completed && (
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: milestone.color,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ color: COLORS.background, fontSize: 12, fontWeight: 'bold' }}>
                  ✓
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{
          alignItems: 'center',
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            {completedMilestonesCount}/{weddingMilestones.length} milestones completed
          </Text>
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
        onPress={() => setShowPlannerModal(true)}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 8 }}>📋</Text>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 4,
        }}>
          Wedding Planner
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          Access your complete wedding planning suite
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNavigateToQuestionnaire}
        style={{
          borderRadius: 16,
          padding: 20,
          alignItems: 'center',
        }}
      >
        <LinearGradient
          colors={COLORS.gradient.primary}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 16,
          }}
        />
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.background,
          marginBottom: 4,
        }}>
          Wedding Preferences
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.background,
          opacity: 0.9,
          textAlign: 'center',
        }}>
          Share your wedding vision and preferences
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
            {renderPlanningTools()}
            {renderWeddingTimeline()}
            {renderActionButtons()}
          </ScrollView>
        </LinearGradient>

        {/* Timeline Modal */}
        <Modal
          visible={showTimelineModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimelineModal(false)}
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
              maxHeight: screenHeight * 0.8,
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
                  Complete Wedding Timeline
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimelineModal(false)}
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

              <ScrollView showsVerticalScrollIndicator={false}>
                {weddingMilestones.map((milestone, index) => (
                  <View
                    key={milestone.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 16,
                      borderBottomWidth: index < weddingMilestones.length - 1 ? 1 : 0,
                      borderBottomColor: COLORS.border,
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: milestone.completed 
                        ? milestone.color 
                        : COLORS.surface,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 16,
                    }}>
                      <Text style={{ fontSize: 20 }}>{milestone.icon}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: COLORS.text,
                        marginBottom: 4,
                      }}>
                        {milestone.title}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: COLORS.textSecondary,
                        marginBottom: 4,
                      }}>
                        {milestone.description}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: milestone.color,
                        fontWeight: '500',
                      }}>
                        {milestone.date}
                      </Text>
                    </View>

                    {milestone.completed && (
                      <View style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: milestone.color,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Text style={{ color: COLORS.background, fontSize: 14, fontWeight: 'bold' }}>
                          ✓
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </AppTransition>
  );
};

export default EnhancedEngagementPhaseScreen;