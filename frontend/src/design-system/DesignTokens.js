/**
 * BLONG Design System - Design Tokens
 * Comprehensive design system with semantic tokens for consistent UX
 */

import { Platform } from 'react-native';

// Base color palette
const BASE_COLORS = {
  // Primary brand colors
  primary: {
    50: '#FFF5F2',
    100: '#FFE7E0',
    200: '#FFCCC1',
    300: '#FFA695',
    400: '#FF7A5C',
    500: '#FF6B35', // Main brand color
    600: '#E85A2B',
    700: '#CC4A1F',
    800: '#B3401A',
    900: '#993515',
  },
  
  // Neutral colors
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E0E0E0',
    300: '#CCCCCC',
    400: '#9E9E9E',
    500: '#6B6B6B',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#0A0A0A',
  },
  
  // Semantic colors
  success: {
    50: '#F0F9F0',
    100: '#C8E6C9',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
  },
  
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
  },
  
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
  },
  
  info: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
  },
  
  // Phase-specific colors
  single: {
    primary: '#E1BEE7',
    secondary: '#F3E5F5',
    accent: '#9C27B0',
  },
  
  preparing: {
    primary: '#FFCDD2',
    secondary: '#FCE4EC',
    accent: '#E91E63',
  },
  
  engaged: {
    primary: '#C8E6C9',
    secondary: '#E0F2E1',
    accent: '#4CAF50',
  },
};

// Semantic color assignments
export const COLORS = {
  // Surface colors
  background: BASE_COLORS.neutral[0],
  surface: BASE_COLORS.neutral[50],
  surfaceElevated: BASE_COLORS.neutral[100],
  
  // Text colors
  text: BASE_COLORS.neutral[900],
  textSecondary: BASE_COLORS.neutral[500],
  textTertiary: BASE_COLORS.neutral[400],
  textInverse: BASE_COLORS.neutral[0],
  
  // Border colors
  border: BASE_COLORS.neutral[200],
  borderLight: BASE_COLORS.neutral[100],
  borderStrong: BASE_COLORS.neutral[300],
  
  // Interactive colors
  primary: BASE_COLORS.primary[500],
  primaryHover: BASE_COLORS.primary[600],
  primaryActive: BASE_COLORS.primary[700],
  primaryLight: BASE_COLORS.primary[100],
  primaryDark: BASE_COLORS.primary[800],
  
  // Semantic colors
  success: BASE_COLORS.success[500],
  successLight: BASE_COLORS.success[100],
  successDark: BASE_COLORS.success[700],
  
  warning: BASE_COLORS.warning[500],
  warningLight: BASE_COLORS.warning[100],
  warningDark: BASE_COLORS.warning[700],
  
  error: BASE_COLORS.error[500],
  errorLight: BASE_COLORS.error[100],
  errorDark: BASE_COLORS.error[700],
  
  info: BASE_COLORS.info[500],
  infoLight: BASE_COLORS.info[100],
  infoDark: BASE_COLORS.info[700],
  
  // State colors
  disabled: BASE_COLORS.neutral[300],
  disabledText: BASE_COLORS.neutral[400],
  focus: BASE_COLORS.primary[500],
  
  // Shadow color
  shadow: BASE_COLORS.neutral[900],
  
  // Phase colors
  phaseColors: {
    single: BASE_COLORS.single,
    preparing: BASE_COLORS.preparing,
    engaged: BASE_COLORS.engaged,
  },
};

// Dark theme colors
export const DARK_COLORS = {
  background: BASE_COLORS.neutral[900],
  surface: BASE_COLORS.neutral[800],
  surfaceElevated: BASE_COLORS.neutral[700],
  
  text: BASE_COLORS.neutral[0],
  textSecondary: BASE_COLORS.neutral[400],
  textTertiary: BASE_COLORS.neutral[500],
  textInverse: BASE_COLORS.neutral[900],
  
  border: BASE_COLORS.neutral[700],
  borderLight: BASE_COLORS.neutral[800],
  borderStrong: BASE_COLORS.neutral[600],
  
  primary: BASE_COLORS.primary[400],
  primaryHover: BASE_COLORS.primary[300],
  primaryActive: BASE_COLORS.primary[200],
  primaryLight: BASE_COLORS.primary[800],
  primaryDark: BASE_COLORS.primary[200],
  
  // Semantic colors remain similar but adjusted for dark theme
  success: BASE_COLORS.success[400],
  successLight: BASE_COLORS.success[800],
  successDark: BASE_COLORS.success[300],
  
  warning: BASE_COLORS.warning[400],
  warningLight: BASE_COLORS.warning[800],
  warningDark: BASE_COLORS.warning[300],
  
  error: BASE_COLORS.error[400],
  errorLight: BASE_COLORS.error[800],
  errorDark: BASE_COLORS.error[300],
  
  info: BASE_COLORS.info[400],
  infoLight: BASE_COLORS.info[800],
  infoDark: BASE_COLORS.info[300],
  
  disabled: BASE_COLORS.neutral[600],
  disabledText: BASE_COLORS.neutral[500],
  focus: BASE_COLORS.primary[400],
  
  shadow: BASE_COLORS.neutral[900],
  
  phaseColors: BASE_COLORS.phaseColors, // Phase colors work in dark theme
};

// Spacing scale (in dp/pt)
export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Component-specific spacing
  component: {
    padding: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    margin: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    gap: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
  },
  
  // Layout spacing
  layout: {
    container: 16,
    section: 24,
    screen: 32,
  },
};

// Typography scale
export const TYPOGRAPHY = {
  fontFamilies: {
    default: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    monospace: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  
  fontSizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeights: {
    none: 1,
    tight: 1.2,
    snug: 1.3,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Border radius scale
export const BORDER_RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
  
  // Component-specific radius
  component: {
    button: 8,
    card: 12,
    input: 8,
    modal: 16,
    avatar: 9999,
  },
};

// Shadow system
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  xs: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },
  
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 16,
  },
  
  '2xl': {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 24,
  },
  
  // Component-specific shadows
  component: {
    button: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    card: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    modal: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 24,
      elevation: 24,
    },
  },
};

// Animation timing
export const TIMING = {
  fast: 150,
  base: 250,
  slow: 350,
  slower: 500,
  
  // Component-specific timing
  component: {
    button: 150,
    modal: 300,
    drawer: 250,
    tooltip: 150,
    toast: 200,
  },
};

// Breakpoints (for responsive design if needed)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Z-index scale
export const Z_INDEX = {
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Component variants
export const COMPONENT_VARIANTS = {
  button: {
    sizes: ['small', 'medium', 'large'],
    variants: ['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'error'],
  },
  
  card: {
    variants: ['default', 'elevated', 'surface', 'outline', 'accent', 'success', 'warning', 'error'],
  },
  
  input: {
    sizes: ['small', 'medium', 'large'],
    variants: ['default', 'filled', 'outlined'],
  },
  
  text: {
    variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'subtitle1', 'subtitle2', 'button', 'caption', 'overline'],
    colors: ['primary', 'secondary', 'tertiary', 'accent', 'success', 'warning', 'error', 'info'],
  },
};

// Export all design tokens
export const DESIGN_TOKENS = {
  colors: COLORS,
  darkColors: DARK_COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  timing: TIMING,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  variants: COMPONENT_VARIANTS,
};

export default DESIGN_TOKENS;