/**
 * BLONG UI - Text Component
 * Typography component with consistent styling and accessibility
 */

import React from 'react';
import { Text as RNText, I18nManager } from 'react-native';
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

// Typography variants
const TEXT_VARIANTS = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: -0.25,
    color: COLORS.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: 0,
    color: COLORS.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: 0.15,
    color: COLORS.text,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.text,
  },
  h6: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.25,
    color: COLORS.text,
  },
  
  // Body text
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: COLORS.text,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.text,
  },
  
  // Subtitle
  subtitle1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.textSecondary,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
    color: COLORS.textSecondary,
  },
  
  // Button text
  button: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 1.25,
    color: COLORS.text,
    textTransform: 'uppercase',
  },
  
  // Caption and overline
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
    color: COLORS.textSecondary,
  },
  overline: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 1.5,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  
  // Special variants
  link: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.text,
  },
  helper: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
    color: COLORS.textSecondary,
  },
  error: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
    color: COLORS.error,
  },
  success: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
    color: COLORS.success,
  },
};

// Color variants that can be applied to any text variant
const COLOR_VARIANTS = {
  primary: COLORS.text,
  secondary: COLORS.textSecondary,
  tertiary: COLORS.textTertiary,
  accent: COLORS.accent,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  white: '#FFFFFF',
  black: '#000000',
};

const Text = ({
  // Content
  children,
  
  // Typography
  variant = 'body1',
  color,
  size,
  weight,
  
  // Styling
  align = 'auto',
  transform,
  decoration,
  italic = false,
  
  // Layout
  numberOfLines,
  ellipsizeMode = 'tail',
  
  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'text',
  accessibilityHeading,
  testID,
  
  // Behavior
  selectable = false,
  adjustsFontSizeToFit = false,
  minimumFontScale = 0.85,
  
  // Custom styling
  style,
  
  ...props
}) => {
  const isRTL = I18nManager.isRTL;
  const variantConfig = TEXT_VARIANTS[variant] || TEXT_VARIANTS.body1;
  
  // Determine text alignment
  const getTextAlign = () => {
    if (align === 'auto') {
      return isRTL ? 'right' : 'left';
    }
    return align;
  };
  
  // Get color value
  const getColor = () => {
    if (color) {
      // Check if it's a color variant name
      if (COLOR_VARIANTS[color]) {
        return COLOR_VARIANTS[color];
      }
      // Otherwise use the color as is (hex, rgb, etc.)
      return color;
    }
    return variantConfig.color;
  };

  // Build text style
  const textStyle = {
    ...variantConfig,
    textAlign: getTextAlign(),
    color: getColor(),
    writingDirection: isRTL ? 'rtl' : 'ltr',
    
    // Override with custom properties
    ...(size && { fontSize: size }),
    ...(weight && { fontWeight: weight }),
    ...(transform && { textTransform: transform }),
    ...(decoration && { textDecorationLine: decoration }),
    ...(italic && { fontStyle: 'italic' }),
    
    // Apply custom style
    ...style,
  };

  // Accessibility props
  const accessibilityProps = {
    accessible: true,
    accessibilityRole: accessibilityHeading ? 'header' : accessibilityRole,
    accessibilityLabel: accessibilityLabel || (typeof children === 'string' ? children : undefined),
    accessibilityHint,
    ...(accessibilityHeading && { accessibilityLevel: accessibilityHeading }),
  };

  // Enhanced accessibility for different variants
  const getEnhancedAccessibilityProps = () => {
    const props = { ...accessibilityProps };
    
    // Add semantic information for headers
    if (variant.startsWith('h')) {
      props.accessibilityRole = 'header';
      props.accessibilityLevel = parseInt(variant.replace('h', ''));
    }
    
    // Add semantic information for buttons
    if (variant === 'button') {
      props.accessibilityRole = 'text';
      props.accessibilityHint = props.accessibilityHint || 'Button text';
    }
    
    // Add semantic information for links
    if (variant === 'link') {
      props.accessibilityRole = 'link';
      props.accessibilityHint = props.accessibilityHint || a11y.screenReader.hints.link;
    }
    
    // Add semantic information for error/success messages
    if (variant === 'error' || variant === 'success') {
      props.accessibilityRole = 'alert';
      props.accessibilityLiveRegion = 'polite';
    }
    
    return props;
  };

  return (
    <RNText
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      testID={testID}
      {...getEnhancedAccessibilityProps()}
      {...props}
    >
      {children}
    </RNText>
  );
};

// Typography presets for common use cases
Text.H1 = (props) => <Text variant="h1" {...props} />;
Text.H2 = (props) => <Text variant="h2" {...props} />;
Text.H3 = (props) => <Text variant="h3" {...props} />;
Text.H4 = (props) => <Text variant="h4" {...props} />;
Text.H5 = (props) => <Text variant="h5" {...props} />;
Text.H6 = (props) => <Text variant="h6" {...props} />;

Text.Body1 = (props) => <Text variant="body1" {...props} />;
Text.Body2 = (props) => <Text variant="body2" {...props} />;

Text.Subtitle1 = (props) => <Text variant="subtitle1" {...props} />;
Text.Subtitle2 = (props) => <Text variant="subtitle2" {...props} />;

Text.Button = (props) => <Text variant="button" {...props} />;
Text.Caption = (props) => <Text variant="caption" {...props} />;
Text.Overline = (props) => <Text variant="overline" {...props} />;

Text.Link = (props) => <Text variant="link" {...props} />;
Text.Label = (props) => <Text variant="label" {...props} />;
Text.Helper = (props) => <Text variant="helper" {...props} />;
Text.Error = (props) => <Text variant="error" {...props} />;
Text.Success = (props) => <Text variant="success" {...props} />;

// Color variants
Text.Primary = (props) => <Text color="primary" {...props} />;
Text.Secondary = (props) => <Text color="secondary" {...props} />;
Text.Tertiary = (props) => <Text color="tertiary" {...props} />;
Text.Accent = (props) => <Text color="accent" {...props} />;

// Alignment variants
Text.Center = (props) => <Text align="center" {...props} />;
Text.Left = (props) => <Text align="left" {...props} />;
Text.Right = (props) => <Text align="right" {...props} />;

// Weight variants
Text.Light = (props) => <Text weight="300" {...props} />;
Text.Regular = (props) => <Text weight="400" {...props} />;
Text.Medium = (props) => <Text weight="500" {...props} />;
Text.SemiBold = (props) => <Text weight="600" {...props} />;
Text.Bold = (props) => <Text weight="700" {...props} />;

export default Text;