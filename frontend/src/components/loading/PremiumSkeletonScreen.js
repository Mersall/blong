/**
 * BLONG Premium Skeleton Screen
 * Sophisticated loading states with branded animations
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// Elite color system
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  skeleton: '#F0F0F0',
  skeletonLight: '#F8F8F8',
  border: '#E0E0E0',
  accent: '#FF6B35',
};

const PremiumSkeletonScreen = ({ 
  type = 'dashboard', // dashboard, profile, quiz, list, card
  style = {} 
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Shimmer animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();
    pulseAnimation.start();

    return () => {
      shimmerAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const createShimmerGradient = () => {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-screenWidth, screenWidth],
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    );
  };

  const SkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 8, 
    style: boxStyle = {},
    shimmer = true 
  }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: COLORS.skeleton,
          borderRadius,
          overflow: 'hidden',
          transform: [{ scale: pulseAnim }],
        },
        boxStyle,
      ]}
    >
      {shimmer && createShimmerGradient()}
    </Animated.View>
  );

  const SkeletonCircle = ({ size, style: circleStyle = {} }) => (
    <SkeletonBox
      width={size}
      height={size}
      borderRadius={size / 2}
      style={circleStyle}
    />
  );

  const SkeletonLine = ({ 
    width = '100%', 
    height = 16, 
    marginBottom = 8,
    style: lineStyle = {} 
  }) => (
    <SkeletonBox
      width={width}
      height={height}
      borderRadius={height / 2}
      style={[{ marginBottom }, lineStyle]}
    />
  );

  const renderDashboardSkeleton = () => (
    <View style={{ padding: 32 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <View>
          <SkeletonLine width={120} height={20} marginBottom={8} />
          <SkeletonLine width={200} height={14} />
        </View>
        <SkeletonCircle size={40} />
      </View>

      {/* Progress Card */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
      }}>
        <SkeletonLine width={150} height={18} marginBottom={16} />
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <SkeletonCircle size={100} />
        </View>
        <SkeletonLine width="80%" height={14} />
      </View>

      {/* Widget Cards */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
      }}>
        {[1, 2, 3, 4].map(index => (
          <View
            key={index}
            style={{
              width: (screenWidth - 76) / 2,
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              padding: 16,
              height: 120,
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <SkeletonCircle size={24} />
              <SkeletonCircle size={20} />
            </View>
            <SkeletonLine width="90%" height={14} marginBottom={8} />
            <SkeletonLine width="70%" height={12} />
          </View>
        ))}
      </View>

      {/* List Items */}
      {[1, 2, 3].map(index => (
        <View
          key={index}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <SkeletonCircle size={48} style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <SkeletonLine width="80%" height={16} marginBottom={8} />
            <SkeletonLine width="60%" height={12} marginBottom={4} />
            <SkeletonLine width="40%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderProfileSkeleton = () => (
    <View style={{ padding: 32 }}>
      {/* Profile Header */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <SkeletonCircle size={120} style={{ marginBottom: 16 }} />
        <SkeletonLine width={180} height={20} marginBottom={8} />
        <SkeletonLine width={120} height={14} />
      </View>

      {/* Stats Row */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
      }}>
        {[1, 2, 3].map(index => (
          <View key={index} style={{ alignItems: 'center' }}>
            <SkeletonLine width={40} height={24} marginBottom={8} />
            <SkeletonLine width={60} height={12} />
          </View>
        ))}
      </View>

      {/* Form Fields */}
      {[1, 2, 3, 4, 5].map(index => (
        <View key={index} style={{ marginBottom: 20 }}>
          <SkeletonLine width={100} height={14} marginBottom={8} />
          <SkeletonBox
            width="100%"
            height={48}
            borderRadius={12}
            style={{ backgroundColor: COLORS.surface }}
          />
        </View>
      ))}
    </View>
  );

  const renderQuizSkeleton = () => (
    <View style={{ padding: 32 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <SkeletonLine width={60} height={16} />
        <SkeletonLine width={120} height={16} />
        <SkeletonLine width={60} height={16} />
      </View>

      {/* Progress Bar */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
      }}>
        <SkeletonLine width={150} height={16} marginBottom={16} />
        <SkeletonLine width="100%" height={8} borderRadius={4} marginBottom={16} />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          {[1, 2, 3, 4, 5].map(index => (
            <SkeletonCircle key={index} size={24} />
          ))}
        </View>
      </View>

      {/* Question Card */}
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
      }}>
        <SkeletonLine width="90%" height={20} marginBottom={32} />
        <SkeletonLine width="100%" height={18} marginBottom={48} />

        {/* Options */}
        {[1, 2, 3, 4].map(index => (
          <SkeletonBox
            key={index}
            width="100%"
            height={56}
            borderRadius={16}
            style={{ 
              marginBottom: 16,
              backgroundColor: COLORS.skeletonLight,
            }}
          />
        ))}
      </View>
    </View>
  );

  const renderListSkeleton = () => (
    <View style={{ padding: 16 }}>
      {Array.from({ length: 8 }).map((_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <SkeletonCircle size={56} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <SkeletonLine width="80%" height={16} marginBottom={8} />
              <SkeletonLine width="60%" height={12} marginBottom={4} />
              <SkeletonLine width="40%" height={10} />
            </View>
            <SkeletonBox width={24} height={24} borderRadius={12} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderCardSkeleton = () => (
    <View style={{ padding: 16 }}>
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
      }}>
        <SkeletonCircle size={80} style={{ marginBottom: 16 }} />
        <SkeletonLine width={120} height={18} marginBottom={8} />
        <SkeletonLine width={180} height={14} marginBottom={16} />
        <SkeletonLine width="100%" height={12} marginBottom={8} />
        <SkeletonLine width="80%" height={12} marginBottom={20} />
        
        {/* Action Buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
          <SkeletonBox width="45%" height={44} borderRadius={22} />
          <SkeletonBox width="45%" height={44} borderRadius={22} />
        </View>
      </View>
    </View>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return renderDashboardSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'quiz':
        return renderQuizSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'card':
        return renderCardSkeleton();
      default:
        return renderDashboardSkeleton();
    }
  };

  return (
    <View style={[{ 
      flex: 1, 
      backgroundColor: COLORS.background 
    }, style]}>
      {renderSkeleton()}
    </View>
  );
};

export default PremiumSkeletonScreen;