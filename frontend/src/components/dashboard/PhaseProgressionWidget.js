/**
 * BLONG Phase Progression Widget
 * Premium dashboard widget showing phase progress and milestones
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// Elite color system
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
  gold: '#FFD700',
  
  phases: {
    single: '#FF6B35',
    preparing: '#9C27B0',
    engagement: '#FFD700',
  },
};

const PhaseProgressionWidget = ({
  currentPhase = 'single',
  progress = 0,
  milestones = [],
  onPhasePress = null,
  onMilestonePress = null,
  style = {},
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Pulse animation if near completion
    if (progress > 80) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [progress]);

  const getPhaseInfo = (phase) => {
    const phases = {
      single: {
        icon: '💝',
        title: 'Ready for Love',
        subtitle: 'Building your perfect dating profile',
        description: 'Focus on self-discovery and preparing for meaningful connections',
        color: COLORS.phases.single,
        milestones: [
          'Complete personality assessment',
          'Upload quality photos',
          'Write compelling bio',
          'Set dating preferences',
          'Complete first date',
        ],
      },
      preparing: {
        icon: '💍',
        title: 'Getting Serious',
        subtitle: 'Building deeper connections',
        description: 'Nurturing relationships and preparing for commitment',
        color: COLORS.phases.preparing,
        milestones: [
          'Establish exclusive relationship',
          'Meet family and friends',
          'Discuss future goals',
          'Plan romantic getaways',
          'Consider moving in together',
        ],
      },
      engagement: {
        icon: '✨',
        title: 'Wedding Planning',
        subtitle: 'Preparing for your special day',
        description: 'Planning your dream wedding and life together',
        color: COLORS.phases.engagement,
        milestones: [
          'Get engaged',
          'Set wedding date',
          'Choose venue',
          'Plan ceremony',
          'Honeymoon planning',
        ],
      },
    };

    return phases[phase] || phases.single;
  };

  const phaseInfo = getPhaseInfo(currentPhase);
  const nextPhase = currentPhase === 'single' ? 'preparing' : 
                   currentPhase === 'preparing' ? 'engagement' : null;
  const nextPhaseInfo = nextPhase ? getPhaseInfo(nextPhase) : null;

  const completedMilestones = milestones.filter(m => m.completed).length;
  const totalMilestones = milestones.length || phaseInfo.milestones.length;
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const renderMilestones = () => {
    const displayMilestones = milestones.length > 0 ? milestones : 
      phaseInfo.milestones.map((title, index) => ({
        id: index,
        title,
        completed: index < Math.floor(totalMilestones * (progress / 100)),
      }));

    return (
      <View style={{ marginTop: 16 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 12,
        }}>
          Phase Milestones
        </Text>
        
        {displayMilestones.slice(0, 3).map((milestone, index) => (
          <TouchableOpacity
            key={milestone.id || index}
            onPress={() => onMilestonePress && onMilestonePress(milestone)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: milestone.completed 
                ? `${phaseInfo.color}10` 
                : COLORS.surface,
              borderRadius: 8,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: milestone.completed 
                ? `${phaseInfo.color}30` 
                : COLORS.border,
            }}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: milestone.completed ? phaseInfo.color : COLORS.border,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
              {milestone.completed ? (
                <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: 'bold' }}>
                  ✓
                </Text>
              ) : (
                <Text style={{ color: COLORS.textTertiary, fontSize: 8, fontWeight: 'bold' }}>
                  {index + 1}
                </Text>
              )}
            </View>
            
            <Text style={{
              flex: 1,
              fontSize: 12,
              color: milestone.completed ? COLORS.text : COLORS.textSecondary,
              fontWeight: milestone.completed ? '500' : '400',
            }}>
              {milestone.title}
            </Text>
          </TouchableOpacity>
        ))}

        {displayMilestones.length > 3 && (
          <TouchableOpacity
            onPress={() => setShowDetails(!showDetails)}
            style={{
              alignItems: 'center',
              paddingVertical: 8,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: COLORS.accent,
              fontWeight: '500',
            }}>
              {showDetails ? 'Show Less' : `+${displayMilestones.length - 3} More`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPhasePress}
      activeOpacity={0.9}
      style={[style]}
    >
      <Animated.View
        style={{
          transform: progress > 80 ? [{ scale: pulseAnim }] : [],
        }}
      >
        <LinearGradient
          colors={[`${phaseInfo.color}15`, `${phaseInfo.color}05`]}
          style={{
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: `${phaseInfo.color}30`,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 24,
              marginRight: 12,
            }}>
              {phaseInfo.icon}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 2,
              }}>
                {phaseInfo.title}
              </Text>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
              }}>
                {phaseInfo.subtitle}
              </Text>
            </View>
            
            <View style={{
              backgroundColor: phaseInfo.color,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                color: COLORS.background,
                fontSize: 10,
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
            marginBottom: 16,
          }}>
            <Animated.View
              style={{
                height: '100%',
                backgroundColor: phaseInfo.color,
                borderRadius: 4,
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              }}
            />
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: phaseInfo.color,
              }}>
                {completedMilestones}
              </Text>
              <Text style={{
                fontSize: 10,
                color: COLORS.textTertiary,
              }}>
                Completed
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.textSecondary,
              }}>
                {totalMilestones}
              </Text>
              <Text style={{
                fontSize: 10,
                color: COLORS.textTertiary,
              }}>
                Total Goals
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.accent,
              }}>
                {totalMilestones - completedMilestones}
              </Text>
              <Text style={{
                fontSize: 10,
                color: COLORS.textTertiary,
              }}>
                Remaining
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            lineHeight: 16,
            marginBottom: 16,
          }}>
            {phaseInfo.description}
          </Text>

          {/* Next Phase Preview */}
          {nextPhaseInfo && progress > 70 && (
            <View style={{
              backgroundColor: COLORS.background,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: `${nextPhaseInfo.color}30`,
              marginBottom: 16,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>
                  {nextPhaseInfo.icon}
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: COLORS.text,
                }}>
                  Next: {nextPhaseInfo.title}
                </Text>
              </View>
              <Text style={{
                fontSize: 10,
                color: COLORS.textSecondary,
                lineHeight: 14,
              }}>
                {nextPhaseInfo.description}
              </Text>
            </View>
          )}

          {/* Milestones Preview */}
          {renderMilestones()}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default PhaseProgressionWidget;