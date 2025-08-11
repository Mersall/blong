/**
 * BLONG Style Utilities
 * RTL-aware styling helpers with smooth transitions
 */

import { I18nManager } from 'react-native';

// Enhanced RTL-aware style utilities with immediate updates
export const createRTLStyle = (isRTL) => ({
  // Text alignment with immediate RTL support
  textAlign: (align = 'left') => {
    if (align === 'left' && isRTL) return 'right';
    if (align === 'right' && isRTL) return 'left';
    return align;
  },

  // Flex direction with immediate RTL support
  flexDirection: (direction = 'row') => {
    if (direction === 'row' && isRTL) return 'row-reverse';
    return direction;
  },

  // Writing direction for immediate text direction changes
  writingDirection: () => isRTL ? 'rtl' : 'ltr',

  // Margins
  marginLeft: (value) => ({
    [isRTL ? 'marginRight' : 'marginLeft']: value,
  }),
  marginRight: (value) => ({
    [isRTL ? 'marginLeft' : 'marginRight']: value,
  }),
  marginHorizontal: (left, right) => ({
    [isRTL ? 'marginRight' : 'marginLeft']: left,
    [isRTL ? 'marginLeft' : 'marginRight']: right || left,
  }),

  // Padding
  paddingLeft: (value) => ({
    [isRTL ? 'paddingRight' : 'paddingLeft']: value,
  }),
  paddingRight: (value) => ({
    [isRTL ? 'paddingLeft' : 'paddingRight']: value,
  }),
  paddingHorizontal: (left, right) => ({
    [isRTL ? 'paddingRight' : 'paddingLeft']: left,
    [isRTL ? 'paddingLeft' : 'paddingRight']: right || left,
  }),

  // Positioning
  left: (value) => ({
    [isRTL ? 'right' : 'left']: value,
  }),
  right: (value) => ({
    [isRTL ? 'left' : 'right']: value,
  }),

  // Alignment
  alignSelf: (align) => {
    if (align === 'flex-start' && isRTL) return 'flex-end';
    if (align === 'flex-end' && isRTL) return 'flex-start';
    return align;
  },

  // Transform
  scaleX: (value) => ({
    transform: [{ scaleX: isRTL ? -value : value }],
  }),

  // Border radius (for asymmetric borders)
  borderTopLeftRadius: (value) => ({
    [isRTL ? 'borderTopRightRadius' : 'borderTopLeftRadius']: value,
  }),
  borderTopRightRadius: (value) => ({
    [isRTL ? 'borderTopLeftRadius' : 'borderTopRightRadius']: value,
  }),
  borderBottomLeftRadius: (value) => ({
    [isRTL ? 'borderBottomRightRadius' : 'borderBottomLeftRadius']: value,
  }),
  borderBottomRightRadius: (value) => ({
    [isRTL ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: value,
  }),
});

// Theme-aware style creator
export const createThemeStyle = (colors, isDark) => ({
  // Container styles
  container: (elevated = false) => ({
    backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
    borderColor: colors.border,
  }),

  // Text styles
  text: (variant = 'primary') => {
    const variants = {
      primary: { color: colors.text },
      secondary: { color: colors.textSecondary },
      tertiary: { color: colors.textTertiary },
      accent: { color: colors.accent },
      success: { color: colors.success },
      warning: { color: colors.warning },
      error: { color: colors.error },
    };
    return variants[variant] || variants.primary;
  },

  // Shadow styles
  shadow: (elevation = 1) => {
    const shadows = {
      1: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      2: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
      3: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.5 : 0.2,
        shadowRadius: 16,
        elevation: 8,
      },
    };
    return shadows[elevation] || shadows[1];
  },

  // Button styles
  button: (variant = 'primary', size = 'medium') => {
    const variants = {
      primary: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: colors.border,
        borderWidth: 1,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    };

    const sizes = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 12, paddingHorizontal: 24 },
      large: { paddingVertical: 16, paddingHorizontal: 32 },
    };

    return {
      ...variants[variant],
      ...sizes[size],
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    };
  },

  // Input styles
  input: (focused = false, error = false) => ({
    backgroundColor: colors.surface,
    borderColor: error ? colors.error : focused ? colors.accent : colors.border,
    borderWidth: focused ? 2 : 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.text,
  }),

  // Card styles
  card: (elevated = true) => ({
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: elevated ? 0 : 1,
    borderColor: colors.border,
    ...(elevated && {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
  }),
});

// Animation utilities
export const createAnimationStyle = (progress, type = 'fade') => {
  const animations = {
    fade: {
      opacity: progress,
    },
    slideLeft: {
      opacity: progress,
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, 0],
          }),
        },
      ],
    },
    slideRight: {
      opacity: progress,
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    },
    slideUp: {
      opacity: progress,
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    },
    scale: {
      opacity: progress,
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
      ],
    },
  };

  return animations[type] || animations.fade;
};

// Responsive utilities
export const createResponsiveStyle = (screenWidth) => {
  const breakpoints = {
    small: 320,
    medium: 768,
    large: 1024,
  };

  return {
    isSmall: screenWidth < breakpoints.medium,
    isMedium: screenWidth >= breakpoints.medium && screenWidth < breakpoints.large,
    isLarge: screenWidth >= breakpoints.large,
    
    // Responsive values
    padding: screenWidth < breakpoints.medium ? 16 : 32,
    fontSize: {
      small: screenWidth < breakpoints.medium ? 12 : 14,
      medium: screenWidth < breakpoints.medium ? 14 : 16,
      large: screenWidth < breakpoints.medium ? 18 : 20,
      xlarge: screenWidth < breakpoints.medium ? 24 : 28,
    },
  };
};

// Utility to merge styles safely
export const mergeStyles = (...styles) => {
  return styles.reduce((merged, style) => {
    if (style && typeof style === 'object') {
      return { ...merged, ...style };
    }
    return merged;
  }, {});
};

// Utility to create conditional styles
export const conditionalStyle = (condition, trueStyle, falseStyle = {}) => {
  return condition ? trueStyle : falseStyle;
};

export default {
  createRTLStyle,
  createThemeStyle,
  createAnimationStyle,
  createResponsiveStyle,
  mergeStyles,
  conditionalStyle,
};
