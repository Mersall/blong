/**
 * BLONG Phase Transition Modal
 * Handles smooth transitions between relationship phases
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
};

const PHASE_INFO = {
  single: {
    icon: '💝',
    title: 'Ready for Love',
    color: '#FF6B35',
    description: 'Focus on self-discovery and building meaningful connections',
    benefits: [
      'Personalized dating coaching',
      'Smart match recommendations',
      'Date planning assistance',
      'Communication tips'
    ]
  },
  preparing: {
    icon: '💍',
    title: 'Getting Serious',
    color: '#9C27B0',
    description: 'Building deeper relationships and preparing for commitment',
    benefits: [
      'Relationship milestone tracking',
      'Couple communication tools',
      'Future planning resources',
      'Family integration guidance'
    ]
  },
  engagement: {
    icon: '✨',
    title: 'Wedding Planning',
    color: '#FFD700',
    description: 'Planning your dream wedding and life together',
    benefits: [
      'Wedding planning tools',
      'Vendor recommendations',
      'Budget management',
      'Timeline coordination'
    ]
  }
};

const PhaseTransitionModal = ({
  visible = false,
  currentPhase = null,
  targetPhase = null,
  progress = 0,
  onConfirm = null,
  onCancel = null,
  onClose = null,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Enter animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Progress animation
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(screenHeight);
      progressAnim.setValue(0);
    }
  }, [visible, progress]);

  const handleConfirm = async () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    try {
      // Show celebration animation first
      setShowCelebration(true);
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Wait for celebration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onConfirm) {
        await onConfirm(targetPhase);
      }
    } catch (error) {
      console.error('Phase transition failed:', error);
    } finally {
      setIsTransitioning(false);
      setShowCelebration(false);
      celebrationAnim.setValue(0);
    }
  };

  const handleClose = () => {
    // Exit animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  const currentPhaseInfo = PHASE_INFO[currentPhase?.id] || PHASE_INFO.single;
  const targetPhaseInfo = PHASE_INFO[targetPhase] || PHASE_INFO.preparing;
  const canTransition = progress >= 75; // Minimum progress required

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: screenHeight * 0.85,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 24,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: COLORS.text,
            }}>
              Phase Transition
            </Text>
            
            <TouchableOpacity
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: COLORS.surface,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: COLORS.textSecondary }}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Current Phase Progress */}
            <View style={{ padding: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 16,
              }}>
                Current Phase Progress
              </Text>

              <LinearGradient
                colors={[`${currentPhaseInfo.color}15`, `${currentPhaseInfo.color}05`]}
                style={{
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: `${currentPhaseInfo.color}30`,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                  <Text style={{ fontSize: 32, marginRight: 12 }}>
                    {currentPhaseInfo.icon}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: COLORS.text,
                      marginBottom: 4,
                    }}>
                      {currentPhaseInfo.title}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: COLORS.textSecondary,
                    }}>
                      {currentPhaseInfo.description}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: currentPhaseInfo.color,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}>
                    <Text style={{
                      color: COLORS.background,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>
                      {Math.round(progress)}%
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={{
                  height: 8,
                  backgroundColor: COLORS.border,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <Animated.View
                    style={{
                      height: '100%',
                      backgroundColor: currentPhaseInfo.color,
                      borderRadius: 4,
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                    }}
                  />
                </View>
              </LinearGradient>
            </View>

            {/* Transition Arrow */}
            <View style={{
              alignItems: 'center',
              paddingVertical: 16,
            }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: canTransition ? COLORS.success : COLORS.warning,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 24,
                  color: COLORS.background,
                }}>
                  {canTransition ? '↓' : '⏱️'}
                </Text>
              </View>
            </View>

            {/* Target Phase Preview */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 16,
              }}>
                Next Phase: {targetPhaseInfo.title}
              </Text>

              <LinearGradient
                colors={[`${targetPhaseInfo.color}15`, `${targetPhaseInfo.color}05`]}
                style={{
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: `${targetPhaseInfo.color}30`,
                  opacity: canTransition ? 1 : 0.6,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                  <Text style={{ fontSize: 32, marginRight: 12 }}>
                    {targetPhaseInfo.icon}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: COLORS.text,
                      marginBottom: 4,
                    }}>
                      {targetPhaseInfo.title}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: COLORS.textSecondary,
                    }}>
                      {targetPhaseInfo.description}
                    </Text>
                  </View>
                </View>

                {/* Benefits */}
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginBottom: 12,
                }}>
                  What you'll get:
                </Text>

                {targetPhaseInfo.benefits.map((benefit, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <View style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: targetPhaseInfo.color,
                      marginRight: 12,
                    }} />
                    <Text style={{
                      fontSize: 14,
                      color: COLORS.textSecondary,
                      flex: 1,
                    }}>
                      {benefit}
                    </Text>
                  </View>
                ))}
              </LinearGradient>
            </View>

            {/* Transition Requirements */}
            {!canTransition && (
              <View style={{
                paddingHorizontal: 24,
                paddingBottom: 24,
              }}>
                <View style={{
                  backgroundColor: `${COLORS.warning}15`,
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: `${COLORS.warning}30`,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: COLORS.warning,
                    marginBottom: 8,
                  }}>
                    Requirements not met
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    lineHeight: 18,
                  }}>
                    Complete at least 75% of your current phase milestones to unlock the next phase.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            padding: 24,
            paddingTop: 16,
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}>
            <TouchableOpacity
              onPress={onCancel || handleClose}
              style={{
                flex: 1,
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.textSecondary,
              }}>
                Not Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!canTransition || isTransitioning}
              style={{
                flex: 2,
                backgroundColor: canTransition ? targetPhaseInfo.color : COLORS.border,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                opacity: (canTransition && !isTransitioning) ? 1 : 0.6,
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.background,
              }}>
                {isTransitioning ? 'Transitioning...' : `Move to ${targetPhaseInfo.title}`}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Celebration Overlay */}
        {showCelebration && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: celebrationAnim,
            }}
          >
            <Text style={{
              fontSize: 48,
              marginBottom: 16,
            }}>
              🎉
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '600',
              color: COLORS.background,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Congratulations!
            </Text>
            <Text style={{
              fontSize: 16,
              color: COLORS.background,
              textAlign: 'center',
              opacity: 0.9,
            }}>
              Welcome to {targetPhaseInfo.title}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
};

export default PhaseTransitionModal;