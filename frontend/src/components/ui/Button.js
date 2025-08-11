/**
 * BLONG UI - Button Component
 * Professional button component with variants, accessibility, and haptic feedback
 */

import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { a11y } from '../../utils/AccessibilityUtils';

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
  disabled: '#E0E0E0',
  disabledText: '#9E9E9E',
};

// Button variant configurations
const BUTTON_VARIANTS = {
  primary: {
    background: COLORS.accent,
    text: COLORS.background,
    gradient: ['#FF6B35', '#FF8A65'],
    shadow: {
      color: COLORS.accent,
      opacity: 0.3,
      radius: 8,
      elevation: 6,
    },
  },
  secondary: {
    background: 'transparent',
    text: COLORS.accent,
    border: {
      width: 1,
      color: COLORS.accent,
    },
    shadow: {
      color: COLORS.shadow,
      opacity: 0.1,
      radius: 4,
      elevation: 2,
    },
  },
  outline: {
    background: 'transparent',
    text: COLORS.text,
    border: {
      width: 1,
      color: COLORS.border,
    },
    shadow: {
      color: COLORS.shadow,
      opacity: 0.05,
      radius: 2,
      elevation: 1,
    },
  },
  ghost: {
    background: 'transparent',
    text: COLORS.textSecondary,
    shadow: null,
  },
  success: {
    background: COLORS.success,
    text: COLORS.background,
    gradient: ['#4CAF50', '#66BB6A'],
    shadow: {
      color: COLORS.success,
      opacity: 0.3,
      radius: 8,
      elevation: 6,
    },
  },
  warning: {
    background: COLORS.warning,
    text: COLORS.background,
    gradient: ['#FF9800', '#FFB74D'],
    shadow: {
      color: COLORS.warning,
      opacity: 0.3,
      radius: 8,
      elevation: 6,
    },
  },
  error: {
    background: COLORS.error,
    text: COLORS.background,
    gradient: ['#F44336', '#EF5350'],
    shadow: {
      color: COLORS.error,
      opacity: 0.3,
      radius: 8,
      elevation: 6,
    },
  },
};

// Button size configurations
const BUTTON_SIZES = {
  small: {
    height: 36,
    paddingHorizontal: 16,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  medium: {
    height: 44,
    paddingHorizontal: 24,
    fontSize: 14,
    letterSpacing: 1,
  },
  large: {
    height: 52,
    paddingHorizontal: 32,
    fontSize: 16,
    letterSpacing: 1,
  },
};

const Button = ({
  // Content
  title,
  children,
  
  // Styling
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  rounded = true,
  
  // State
  loading = false,
  disabled = false,
  
  // Behavior
  onPress,
  hapticFeedback = true,
  activeOpacity = 0.8,
  
  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  testID,
  
  // Custom styling
  style,
  textStyle,
  
  // Icons
  leftIcon,
  rightIcon,
  
  ...props
}) => {
  const variantConfig = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeConfig = BUTTON_SIZES[size] || BUTTON_SIZES.medium;
  
  // Handle press with haptic feedback
  const handlePress = async () => {
    if (disabled || loading) return;
    
    // Haptic feedback
    if (hapticFeedback && Haptics?.impactAsync) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    }
    
    onPress?.();
  };

  // Get button accessibility props
  const accessibilityProps = {
    accessible: true,
    accessibilityRole,
    accessibilityLabel: accessibilityLabel || title,
    accessibilityHint: accessibilityHint || a11y.screenReader.hints.button,
    accessibilityState: {
      disabled: disabled || loading,
      busy: loading,
    },
    ...a11y.touchTarget.getStyles(),
  };

  // Base button style
  const buttonStyle = {
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    borderRadius: rounded ? sizeConfig.height / 2 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: disabled ? COLORS.disabled : variantConfig.background,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    minWidth: a11y.touchTarget.MIN_SIZE,
    minHeight: a11y.touchTarget.MIN_SIZE,
    ...variantConfig.border && {
      borderWidth: variantConfig.border.width,
      borderColor: disabled ? COLORS.disabled : variantConfig.border.color,
    },
    ...variantConfig.shadow && !disabled && {
      shadowColor: variantConfig.shadow.color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: variantConfig.shadow.opacity,
      shadowRadius: variantConfig.shadow.radius,
      elevation: variantConfig.shadow.elevation,
    },
    ...style,
  };

  // Text style
  const buttonTextStyle = {
    fontSize: sizeConfig.fontSize,
    fontWeight: '500',
    letterSpacing: sizeConfig.letterSpacing,
    color: disabled ? COLORS.disabledText : variantConfig.text,
    textAlign: 'center',
    ...textStyle,
  };

  // Content with loading state
  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator 
            size="small" 
            color={disabled ? COLORS.disabledText : variantConfig.text}
            style={{ marginRight: 8 }}
          />
          <Text style={buttonTextStyle}>
            {typeof loading === 'string' ? loading : 'Loading...'}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leftIcon && (
          <View style={{ marginRight: 8 }}>
            {leftIcon}
          </View>
        )}
        
        {children || (
          <Text style={buttonTextStyle}>
            {title}
          </Text>
        )}
        
        {rightIcon && (
          <View style={{ marginLeft: 8 }}>
            {rightIcon}
          </View>
        )}
      </View>
    );
  };

  // Render button with gradient background if specified
  if (variantConfig.gradient && !disabled) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={activeOpacity}
        testID={testID}
        {...accessibilityProps}
        {...props}
      >
        <LinearGradient
          colors={variantConfig.gradient}
          style={buttonStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Render standard button
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      testID={testID}
      {...accessibilityProps}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Button presets for common use cases
Button.Primary = (props) => <Button variant="primary" {...props} />;
Button.Secondary = (props) => <Button variant="secondary" {...props} />;
Button.Outline = (props) => <Button variant="outline" {...props} />;
Button.Ghost = (props) => <Button variant="ghost" {...props} />;
Button.Success = (props) => <Button variant="success" {...props} />;
Button.Warning = (props) => <Button variant="warning" {...props} />;
Button.Error = (props) => <Button variant="error" {...props} />;

Button.Small = (props) => <Button size="small" {...props} />;
Button.Medium = (props) => <Button size="medium" {...props} />;
Button.Large = (props) => <Button size="large" {...props} />;

export default Button;