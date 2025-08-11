/**
 * BLONG Premium Loading Component
 * Sophisticated loading states with elegant animations and branding
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/AppContext';
import { useLoadingContext } from '../../contexts/LoadingContext';

const { width: screenWidth } = Dimensions.get('window');

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
};

/**
 * Premium Spinner Component
 * Elegant rotating loader with BLONG branding
 */
export const PremiumSpinner = ({ 
  size = 'medium', 
  color = COLORS.accent,
  showBrand = false 
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  useEffect(() => {
    // Rotation animation
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Pulse animation for brand
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
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

    rotationAnimation.start();
    if (showBrand) {
      pulseAnimation.start();
    }

    return () => {
      rotationAnimation.stop();
      pulseAnimation.stop();
    };
  }, [showBrand]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ alignItems: 'center' }}>
      {showBrand && (
        <Animated.Text style={{
          fontSize: 18,
          fontWeight: '300',
          letterSpacing: 4,
          color: COLORS.text,
          marginBottom: 24,
          transform: [{ scale: pulseAnim }],
        }}>
          BLONG
        </Animated.Text>
      )}
      
      <Animated.View style={{
        width: spinnerSize,
        height: spinnerSize,
        borderRadius: spinnerSize / 2,
        borderWidth: 3,
        borderColor: color + '20',
        borderTopColor: color,
        transform: [{ rotate: spin }],
      }} />
    </View>
  );
};

/**
 * Full Screen Premium Loader
 * Elegant full-screen loading overlay with branding
 */
export const PremiumFullScreenLoader = ({ 
  visible = false,
  message = 'Loading...',
  subtitle = null,
  showProgress = false,
  progress = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: COLORS.background + 'F5', // 96% opacity
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: fadeAnim,
    }}>
      <Animated.View style={{
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        minWidth: 280,
        transform: [{ scale: scaleAnim }],
      }}>
        {/* BLONG Elite Logo */}
        <Text style={{
          fontSize: 24,
          fontWeight: '300',
          letterSpacing: 6,
          color: COLORS.text,
          marginBottom: 12,
        }}>
          BLONG
        </Text>

        <View style={{
          width: 32,
          height: 2,
          backgroundColor: COLORS.accent,
          marginBottom: 32,
        }} />

        {/* Premium Spinner */}
        <PremiumSpinner size="large" />

        {/* Loading Message */}
        <Text style={{
          fontSize: 16,
          fontWeight: '300',
          color: COLORS.text,
          marginTop: 24,
          marginBottom: 8,
          textAlign: 'center',
        }}>
          {message}
        </Text>

        {subtitle && (
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 18,
            marginBottom: showProgress ? 16 : 0,
          }}>
            {subtitle}
          </Text>
        )}

        {/* Progress Bar */}
        {showProgress && (
          <View style={{
            width: '100%',
            height: 4,
            backgroundColor: COLORS.border,
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <Animated.View style={{
              height: 4,
              backgroundColor: COLORS.accent,
              borderRadius: 2,
              width: `${Math.max(0, Math.min(100, progress))}%`,
            }} />
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

/**
 * Inline Premium Loader
 * Elegant inline loading state for content areas
 */
export const PremiumInlineLoader = ({ 
  message = 'Loading...',
  size = 'medium',
  style = {},
}) => {
  return (
    <View style={{
      paddingVertical: 40,
      alignItems: 'center',
      ...style,
    }}>
      <PremiumSpinner size={size} />
      
      <Text style={{
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 16,
        textAlign: 'center',
      }}>
        {message}
      </Text>
    </View>
  );
};

/**
 * Premium Loading Card
 * Elegant card-style loader for content sections
 */
export const PremiumLoadingCard = ({ 
  message = 'Loading...',
  subtitle = null,
  style = {},
}) => {
  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 32,
      alignItems: 'center',
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...style,
    }}>
      <PremiumSpinner size="medium" showBrand />
      
      <Text style={{
        fontSize: 16,
        fontWeight: '300',
        color: COLORS.text,
        marginTop: 24,
        marginBottom: 8,
        textAlign: 'center',
      }}>
        {message}
      </Text>

      {subtitle && (
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 18,
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

/**
 * Universal Loading Component
 * Automatically integrates with global loading context
 */
export const UniversalLoader = () => {
  try {
    const { activeLoading } = useLoadingContext();

    if (!activeLoading) return null;

    // Render appropriate loading component based on type
    switch (activeLoading.type) {
      case 'screen':
        return (
          <PremiumFullScreenLoader
            visible={true}
            message={activeLoading.message}
            subtitle={activeLoading.subtitle}
            showProgress={activeLoading.showProgress}
            progress={activeLoading.progress}
          />
        );

      case 'operation':
        return (
          <PremiumFullScreenLoader
            visible={true}
            message={activeLoading.message}
            subtitle={activeLoading.subtitle}
            showProgress={activeLoading.showProgress}
            progress={activeLoading.progress}
          />
        );

      case 'inline':
        return (
          <PremiumInlineLoader
            message={activeLoading.message}
            size="medium"
          />
        );

      case 'background':
        // Background loading - minimal UI
        return (
          <View style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 1000,
          }}>
            <PremiumSpinner size="small" />
          </View>
        );

      default:
        return (
          <PremiumFullScreenLoader
            visible={true}
            message={activeLoading.message}
          />
        );
    }
  } catch (error) {
    // Fallback if context not available
    return null;
  }
};

export default PremiumSpinner;
