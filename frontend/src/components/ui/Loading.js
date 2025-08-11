/**
 * BLONG UI - Loading Component
 * Enhanced loading states with animations and accessibility
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { a11y } from '../../utils/AccessibilityUtils';

const { width: screenWidth } = Dimensions.get('window');

// Design system colors
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
  error: '#F44336',
};

// Loading variants
const LOADING_VARIANTS = {
  spinner: {
    backgroundColor: 'transparent',
    showSpinner: true,
    showProgress: false,
    showSkeleton: false,
  },
  progress: {
    backgroundColor: 'transparent',
    showSpinner: false,
    showProgress: true,
    showSkeleton: false,
  },
  skeleton: {
    backgroundColor: COLORS.surface,
    showSpinner: false,
    showProgress: false,
    showSkeleton: true,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    showSpinner: true,
    showProgress: false,
    showSkeleton: false,
    overlay: true,
  },
  fullscreen: {
    backgroundColor: COLORS.background,
    showSpinner: true,
    showProgress: false,
    showSkeleton: false,
    fullscreen: true,
  },
};

// Size configurations
const SIZE_CONFIGS = {
  small: {
    spinnerSize: 'small',
    height: 40,
    padding: 8,
    fontSize: 12,
  },
  medium: {
    spinnerSize: 'large',
    height: 60,
    padding: 16,
    fontSize: 14,
  },
  large: {
    spinnerSize: 'large',
    height: 80,
    padding: 24,
    fontSize: 16,
  },
};

const Loading = ({
  // Content
  message = 'Loading...',
  subtitle,
  
  // Styling
  variant = 'spinner',
  size = 'medium',
  color = COLORS.accent,
  
  // Progress
  progress = 0,
  showProgress = false,
  
  // Layout
  fullWidth = false,
  centered = true,
  
  // Animation
  animated = true,
  pulseAnimation = true,
  
  // Accessibility
  accessibilityLabel,
  testID,
  
  // Custom styling
  style,
  contentStyle,
  
  // Skeleton specific
  skeletonLines = 3,
  skeletonWidth = '100%',
  
  ...props
}) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const variantConfig = LOADING_VARIANTS[variant] || LOADING_VARIANTS.spinner;
  const sizeConfig = SIZE_CONFIGS[size] || SIZE_CONFIGS.medium;

  // Fade in animation
  useEffect(() => {
    if (animated) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnimation.setValue(1);
    }
  }, [animated, fadeAnimation]);

  // Pulse animation
  useEffect(() => {
    if (pulseAnimation && animated) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
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
      pulse.start();

      return () => pulse.stop();
    }
  }, [pulseAnimation, animated, pulseAnim]);

  // Progress animation
  useEffect(() => {
    if (showProgress || variantConfig.showProgress) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, showProgress, variantConfig.showProgress, progressAnim]);

  // Skeleton shimmer animation
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (variantConfig.showSkeleton) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();

      return () => shimmer.stop();
    }
  }, [variantConfig.showSkeleton, shimmerAnimation]);

  // Container style
  const containerStyle = {
    backgroundColor: variantConfig.backgroundColor,
    ...(variantConfig.fullscreen && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }),
    ...(variantConfig.overlay && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
    }),
    ...(centered && {
      justifyContent: 'center',
      alignItems: 'center',
    }),
    width: fullWidth ? '100%' : 'auto',
    minHeight: sizeConfig.height,
    padding: sizeConfig.padding,
    ...style,
  };

  // Content container style
  const contentContainerStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    ...contentStyle,
  };

  // Accessibility props
  const accessibilityProps = {
    accessible: true,
    accessibilityRole: 'progressbar',
    accessibilityLabel: accessibilityLabel || `${message}${subtitle ? `, ${subtitle}` : ''}`,
    accessibilityValue: showProgress || variantConfig.showProgress ? {
      min: 0,
      max: 100,
      now: Math.round(progress * 100),
    } : undefined,
    accessibilityLiveRegion: 'polite',
  };

  // Render skeleton lines
  const renderSkeletonLines = () => {
    return Array.from({ length: skeletonLines }, (_, index) => {
      const lineWidth = index === skeletonLines - 1 ? '60%' : skeletonWidth;
      
      return (
        <Animated.View
          key={index}
          style={{
            height: 16,
            width: lineWidth,
            backgroundColor: COLORS.border,
            marginBottom: index < skeletonLines - 1 ? 8 : 0,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              transform: [{
                translateX: shimmerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-screenWidth, screenWidth],
                }),
              }],
            }}
          />
        </Animated.View>
      );
    });
  };

  // Render progress bar
  const renderProgressBar = () => {
    if (!showProgress && !variantConfig.showProgress) return null;

    return (
      <View style={{
        width: '100%',
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        marginTop: 16,
        overflow: 'hidden',
      }}>
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: 2,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    );
  };

  // Render spinner content
  const renderSpinnerContent = () => {
    if (!variantConfig.showSpinner) return null;

    return (
      <>
        <Animated.View
          style={{
            transform: [{ scale: pulseAnimation ? pulseAnim : 1 }],
          }}
        >
          <ActivityIndicator
            size={sizeConfig.spinnerSize}
            color={color}
            accessibilityLabel={`Loading spinner`}
          />
        </Animated.View>
        
        {message && (
          <Text style={{
            fontSize: sizeConfig.fontSize,
            color: COLORS.text,
            marginTop: 12,
            textAlign: 'center',
            fontWeight: '400',
          }}>
            {message}
          </Text>
        )}
        
        {subtitle && (
          <Text style={{
            fontSize: sizeConfig.fontSize - 2,
            color: COLORS.textSecondary,
            marginTop: 4,
            textAlign: 'center',
            fontWeight: '300',
          }}>
            {subtitle}
          </Text>
        )}
      </>
    );
  };

  return (
    <Animated.View
      style={[
        containerStyle,
        { opacity: fadeAnimation },
      ]}
      testID={testID}
      {...accessibilityProps}
      {...props}
    >
      <View style={contentContainerStyle}>
        {/* Skeleton Loading */}
        {variantConfig.showSkeleton && renderSkeletonLines()}
        
        {/* Spinner Loading */}
        {renderSpinnerContent()}
        
        {/* Progress Bar */}
        {renderProgressBar()}
      </View>
    </Animated.View>
  );
};

// Loading presets for common use cases
Loading.Spinner = (props) => <Loading variant="spinner" {...props} />;
Loading.Progress = (props) => <Loading variant="progress" showProgress {...props} />;
Loading.Skeleton = (props) => <Loading variant="skeleton" {...props} />;
Loading.Overlay = (props) => <Loading variant="overlay" {...props} />;
Loading.Fullscreen = (props) => <Loading variant="fullscreen" {...props} />;

Loading.Small = (props) => <Loading size="small" {...props} />;
Loading.Medium = (props) => <Loading size="medium" {...props} />;
Loading.Large = (props) => <Loading size="large" {...props} />;

// Skeleton variants
Loading.SkeletonText = (props) => (
  <Loading 
    variant="skeleton" 
    skeletonLines={1} 
    skeletonWidth="80%" 
    size="small"
    {...props} 
  />
);

Loading.SkeletonParagraph = (props) => (
  <Loading 
    variant="skeleton" 
    skeletonLines={4} 
    skeletonWidth="100%" 
    {...props} 
  />
);

Loading.SkeletonCard = (props) => (
  <Loading 
    variant="skeleton" 
    skeletonLines={3} 
    skeletonWidth="100%" 
    style={{
      borderRadius: 12,
      padding: 16,
      backgroundColor: COLORS.background,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}
    {...props} 
  />
);

export default Loading;