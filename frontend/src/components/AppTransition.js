/**
 * BLONG App Transition Components
 * Simple wrapper component - no animations, just clean navigation
 */

import React from 'react';
import { View } from 'react-native';

// Simple wrapper component
export const AppTransition = ({ children, style = {} }) => {
  return (
    <View
      style={[
        {
          flex: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Text with transition
export const AppText = ({ children, style = {}, ...props }) => {
  const { transitionProgress } = useTransitions();

  return (
    <Animated.Text
      style={[
        {
          opacity: transitionProgress,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.Text>
  );
};

// View with theme-aware background
export const AppView = ({ children, style = {}, elevated = false, ...props }) => {
  const { colors } = useTheme();
  const { transitionProgress } = useTransitions();

  return (
    <Animated.View
      style={[
        {
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
          opacity: transitionProgress,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

// Loading overlay during transitions
export const TransitionOverlay = () => {
  const { isTransitioning } = useTransitions();
  const { colors } = useTheme();

  if (!isTransitioning) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 3,
          borderColor: colors.accent,
          borderTopColor: 'transparent',
        }}
      />
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          marginTop: 16,
        }}
      >
        Updating...
      </Text>
    </View>
  );
};

export default AppTransition;
