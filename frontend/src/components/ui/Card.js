/**
 * BLONG UI - Card Component
 * Consistent card layout with accessibility and customization options
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
};

// Card variant configurations
const CARD_VARIANTS = {
  default: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    shadow: {
      color: COLORS.shadow,
      opacity: 0.08,
      radius: 8,
      elevation: 4,
    },
  },
  elevated: {
    backgroundColor: COLORS.background,
    borderColor: 'transparent',
    shadow: {
      color: COLORS.shadow,
      opacity: 0.12,
      radius: 16,
      elevation: 8,
    },
  },
  surface: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    shadow: {
      color: COLORS.shadow,
      opacity: 0.04,
      radius: 4,
      elevation: 2,
    },
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: COLORS.border,
    shadow: null,
  },
  accent: {
    backgroundColor: COLORS.accent,
    borderColor: 'transparent',
    gradient: ['#FF6B35', '#FF8A65'],
    shadow: {
      color: COLORS.accent,
      opacity: 0.2,
      radius: 12,
      elevation: 6,
    },
  },
  success: {
    backgroundColor: COLORS.success,
    borderColor: 'transparent',
    gradient: ['#4CAF50', '#66BB6A'],
    shadow: {
      color: COLORS.success,
      opacity: 0.2,
      radius: 12,
      elevation: 6,
    },
  },
  warning: {
    backgroundColor: COLORS.warning,
    borderColor: 'transparent',
    gradient: ['#FF9800', '#FFB74D'],
    shadow: {
      color: COLORS.warning,
      opacity: 0.2,
      radius: 12,
      elevation: 6,
    },
  },
  error: {
    backgroundColor: COLORS.error,
    borderColor: 'transparent',
    gradient: ['#F44336', '#EF5350'],
    shadow: {
      color: COLORS.error,
      opacity: 0.2,
      radius: 12,
      elevation: 6,
    },
  },
};

// Spacing configurations
const SPACING = {
  none: 0,
  small: 12,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const Card = ({
  // Content
  children,
  title,
  subtitle,
  
  // Styling
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  borderRadius = 12,
  
  // Layout
  fullWidth = false,
  height,
  minHeight,
  
  // Interaction
  onPress,
  onLongPress,
  pressable = false,
  hapticFeedback = true,
  activeOpacity = 0.95,
  
  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
  
  // Custom styling
  style,
  contentStyle,
  headerStyle,
  
  // Header elements
  headerLeft,
  headerRight,
  
  ...props
}) => {
  const variantConfig = CARD_VARIANTS[variant] || CARD_VARIANTS.default;
  const paddingValue = typeof padding === 'number' ? padding : SPACING[padding] || SPACING.medium;
  const marginValue = typeof margin === 'number' ? margin : SPACING[margin] || SPACING.none;

  // Handle press with haptic feedback
  const handlePress = async () => {
    if (hapticFeedback && Haptics?.impactAsync && onPress) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    }
    onPress?.();
  };

  const handleLongPress = async () => {
    if (hapticFeedback && Haptics?.impactAsync && onLongPress) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    }
    onLongPress?.();
  };

  // Base card style
  const cardStyle = {
    borderRadius,
    backgroundColor: variantConfig.backgroundColor,
    borderWidth: variantConfig.borderColor !== 'transparent' ? 1 : 0,
    borderColor: variantConfig.borderColor,
    margin: marginValue,
    width: fullWidth ? '100%' : 'auto',
    height,
    minHeight,
    ...variantConfig.shadow && {
      shadowColor: variantConfig.shadow.color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: variantConfig.shadow.opacity,
      shadowRadius: variantConfig.shadow.radius,
      elevation: variantConfig.shadow.elevation,
    },
    ...style,
  };

  // Content style
  const cardContentStyle = {
    padding: paddingValue,
    flex: 1,
    ...contentStyle,
  };

  // Accessibility props for pressable cards
  const accessibilityProps = pressable || onPress ? {
    accessible: true,
    accessibilityRole: accessibilityRole || 'button',
    accessibilityLabel,
    accessibilityHint: accessibilityHint || a11y.screenReader.hints.button,
    ...a11y.touchTarget.getStyles(),
  } : {
    accessible: false,
  };

  // Render header if title or header elements exist
  const renderHeader = () => {
    if (!title && !subtitle && !headerLeft && !headerRight) {
      return null;
    }

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: (title || subtitle) ? 12 : 0,
        ...headerStyle,
      }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {headerLeft}
          <View style={{ flex: 1, marginLeft: headerLeft ? 12 : 0 }}>
            {title && (
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: variantConfig.gradient ? COLORS.background : COLORS.text,
                marginBottom: subtitle ? 4 : 0,
              }}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={{
                fontSize: 14,
                color: variantConfig.gradient ? 
                  `${COLORS.background}CC` : // 80% opacity
                  COLORS.textSecondary,
                lineHeight: 20,
              }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {headerRight}
      </View>
    );
  };

  // Render card content
  const renderContent = () => (
    <View style={cardContentStyle}>
      {renderHeader()}
      {children}
    </View>
  );

  // Render card with gradient background if specified
  if (variantConfig.gradient) {
    const CardWrapper = pressable || onPress ? TouchableOpacity : View;
    
    return (
      <CardWrapper
        style={[cardStyle, { overflow: 'hidden' }]}
        onPress={pressable || onPress ? handlePress : undefined}
        onLongPress={onLongPress ? handleLongPress : undefined}
        activeOpacity={activeOpacity}
        testID={testID}
        {...accessibilityProps}
        {...props}
      >
        <LinearGradient
          colors={variantConfig.gradient}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      </CardWrapper>
    );
  }

  // Render standard card
  const CardWrapper = pressable || onPress ? TouchableOpacity : View;
  
  return (
    <CardWrapper
      style={cardStyle}
      onPress={pressable || onPress ? handlePress : undefined}
      onLongPress={onLongPress ? handleLongPress : undefined}
      activeOpacity={activeOpacity}
      testID={testID}
      {...accessibilityProps}
      {...props}
    >
      {renderContent()}
    </CardWrapper>
  );
};

// Card presets for common use cases
Card.Default = (props) => <Card variant="default" {...props} />;
Card.Elevated = (props) => <Card variant="elevated" {...props} />;
Card.Surface = (props) => <Card variant="surface" {...props} />;
Card.Outline = (props) => <Card variant="outline" {...props} />;
Card.Accent = (props) => <Card variant="accent" {...props} />;
Card.Success = (props) => <Card variant="success" {...props} />;
Card.Warning = (props) => <Card variant="warning" {...props} />;
Card.Error = (props) => <Card variant="error" {...props} />;

Card.Pressable = (props) => <Card pressable {...props} />;

export default Card;