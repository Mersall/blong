/**
 * BLONG UI Component Library
 * Centralized export for all UI components
 */

// Core components
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Text } from './Text';
export { default as Loading } from './Loading';

// Re-export accessibility utilities for convenience
export { a11y } from '../../utils/AccessibilityUtils';

// Design system constants
export const COLORS = {
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

export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const TYPOGRAPHY = {
  fontSizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Component presets for quick usage
export const UI = {
  // Buttons
  Button: {
    Primary: (props) => <Button variant="primary" {...props} />,
    Secondary: (props) => <Button variant="secondary" {...props} />,
    Outline: (props) => <Button variant="outline" {...props} />,
    Ghost: (props) => <Button variant="ghost" {...props} />,
    Success: (props) => <Button variant="success" {...props} />,
    Warning: (props) => <Button variant="warning" {...props} />,
    Error: (props) => <Button variant="error" {...props} />,
  },
  
  // Cards
  Card: {
    Default: (props) => <Card variant="default" {...props} />,
    Elevated: (props) => <Card variant="elevated" {...props} />,
    Surface: (props) => <Card variant="surface" {...props} />,
    Outline: (props) => <Card variant="outline" {...props} />,
    Accent: (props) => <Card variant="accent" {...props} />,
    Pressable: (props) => <Card pressable {...props} />,
  },
  
  // Inputs
  Input: {
    Default: (props) => <Input variant="default" {...props} />,
    Filled: (props) => <Input variant="filled" {...props} />,
    Outlined: (props) => <Input variant="outlined" {...props} />,
    Email: (props) => <Input.Email {...props} />,
    Password: (props) => <Input.Password {...props} />,
    Phone: (props) => <Input.Phone {...props} />,
    Number: (props) => <Input.Number {...props} />,
    Multiline: (props) => <Input.Multiline {...props} />,
  },
  
  // Text
  Text: {
    H1: (props) => <Text variant="h1" {...props} />,
    H2: (props) => <Text variant="h2" {...props} />,
    H3: (props) => <Text variant="h3" {...props} />,
    H4: (props) => <Text variant="h4" {...props} />,
    H5: (props) => <Text variant="h5" {...props} />,
    H6: (props) => <Text variant="h6" {...props} />,
    Body1: (props) => <Text variant="body1" {...props} />,
    Body2: (props) => <Text variant="body2" {...props} />,
    Caption: (props) => <Text variant="caption" {...props} />,
  },
  
  // Loading
  Loading: {
    Spinner: (props) => <Loading variant="spinner" {...props} />,
    Progress: (props) => <Loading variant="progress" {...props} />,
    Skeleton: (props) => <Loading variant="skeleton" {...props} />,
    Overlay: (props) => <Loading variant="overlay" {...props} />,
    Fullscreen: (props) => <Loading variant="fullscreen" {...props} />,
  },
};