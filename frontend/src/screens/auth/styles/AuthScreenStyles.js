/**
 * BLONG Elite Authentication Screen Styles
 * Premium styling for sophisticated authentication experience
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Create dynamic styles based on theme colors and RTL support
 */
export const createAuthStyles = (colors, isRTL) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  keyboardContainer: {
    flex: 1,
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
  },

  // Elite Header Styles - Following BLONG Design System
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 32,
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  logo: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 8,        // MANDATORY 8px spacing
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },

  accentLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.accent,
    marginBottom: 24,
  },
  
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },

  // Form Styles - Following BLONG Design System
  formContainer: {
    paddingHorizontal: 32,
    paddingBottom: 120, // Always include bottom padding for navigation
    flex: 1,
  },

  nameFieldsRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    marginBottom: 24, // 8px multiples
    marginHorizontal: -8, // Compensate for child margins
  },

  nameFieldContainer: {
    flex: 1,
    marginHorizontal: 8, // Instead of gap
  },

  fieldContainer: {
    marginBottom: 24, // 8px multiples
  },

  fieldContainerLast: {
    marginBottom: 32,
  },
  
  fieldLabel: {
    fontSize: 14,
    fontWeight: '300', // BLONG typography
    color: colors.text,
    marginBottom: 8,
    textAlign: isRTL ? 'right' : 'left',
  },

  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 8, // ALWAYS 8px for cards/inputs
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '300', // BLONG typography
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: isRTL ? 'right' : 'left',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  
  textInputError: {
    borderColor: colors.error,
  },
  
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    textAlign: isRTL ? 'right' : 'left',
  },

  // Button Styles - Following BLONG Design System
  authButtonContainer: {
    marginBottom: 24,
  },

  authButtonDisabled: {
    opacity: 0.5,
  },

  authButtonGradient: {
    backgroundColor: colors.accent,
    borderRadius: 24, // ALWAYS 24px for buttons
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  authButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Toggle Auth Mode Styles - Following BLONG Design System
  toggleContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },

  toggleText: {
    fontSize: 14,
    fontWeight: '300', // BLONG typography
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  
  toggleButton: {
    // No additional styles needed, just TouchableOpacity
  },
  
  toggleButtonText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Loading States
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
    fontWeight: '500',
  },

  // Date Picker Styles - Following BLONG Design System
  datePickerText: {
    fontSize: 16,
    fontWeight: '300', // BLONG typography
    color: colors.text,
    textAlign: isRTL ? 'right' : 'left',
    paddingVertical: 16,
  },

  genderButtonTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
});

/**
 * Animation configurations
 */
export const ANIMATION_CONFIG = {
  // Form field focus animations
  fieldFocus: {
    duration: 200,
    useNativeDriver: false,
  },
  
  // Button press animations
  buttonPress: {
    duration: 150,
    useNativeDriver: true,
  },
  
  // Mode toggle animations
  modeToggle: {
    duration: 300,
    useNativeDriver: true,
  },
  
  // Loading state animations
  loading: {
    duration: 1000,
    useNativeDriver: true,
  },
};

/**
 * Form validation styling helpers
 */
export const getFieldStyle = (baseStyle, hasError, colors) => [
  baseStyle,
  hasError && { borderColor: colors.error },
];

/**
 * Cultural theming adjustments
 */
export const getCulturalStyles = (language, colors) => {
  const culturalAdjustments = {};
  
  // Arabic-specific adjustments
  if (language === 'ar') {
    culturalAdjustments.authButtonGradient = {
      shadowColor: colors.accent, // Gold shadow for Arabic
    };
    
    culturalAdjustments.logo = {
      letterSpacing: 8, // Slightly tighter for Arabic
    };
  }
  
  return culturalAdjustments;
};

/**
 * Responsive design helpers
 */
export const getResponsiveStyles = () => {
  const isSmallScreen = screenHeight < 700;
  const isLargeScreen = screenWidth > 400;
  
  return {
    headerContainer: {
      paddingTop: isSmallScreen ? 40 : 60,
      paddingBottom: isSmallScreen ? 24 : 40,
    },
    
    formContainer: {
      paddingHorizontal: isLargeScreen ? 40 : 32,
    },
    
    logo: {
      fontSize: isSmallScreen ? 28 : 32,
    },
    
    welcomeTitle: {
      fontSize: isSmallScreen ? 20 : 24,
    },
  };
};

/**
 * Accessibility styles
 */
export const getAccessibilityStyles = () => ({
  textInput: {
    minHeight: 48, // Minimum touch target
  },
  
  authButtonGradient: {
    minHeight: 48, // Minimum touch target
  },
  
  toggleButton: {
    minHeight: 44, // Minimum touch target
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  // Gender Selection Styles - Following BLONG Design System
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginHorizontal: -4, // Compensate for button margins
  },

  genderButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8, // ALWAYS 8px for cards
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minWidth: 80,
    alignItems: 'center',
    margin: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },

  genderButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.2,
    elevation: 4,
  },

  genderButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '300', // BLONG typography
  },

  genderButtonTextSelected: {
    color: colors.background,
    fontWeight: '500',
  },
});

/**
 * Platform-specific styles
 */
export const getPlatformStyles = () => ({
  // iOS specific
  ios: {
    textInput: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
    },
  },
  
  // Android specific
  android: {
    textInput: {
      elevation: 1,
    },
    
    authButtonGradient: {
      elevation: 8,
    },
  },
});

export default {
  createAuthStyles,
  ANIMATION_CONFIG,
  getFieldStyle,
  getCulturalStyles,
  getResponsiveStyles,
  getAccessibilityStyles,
  getPlatformStyles,
};
