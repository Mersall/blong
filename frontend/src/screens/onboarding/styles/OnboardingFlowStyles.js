/**
 * BLONG Onboarding Flow Styles
 * Elite styling for onboarding navigation and progress
 */

import { StyleSheet } from 'react-native';

// Elite color system
const COLORS = {
  // Pure minimalist backgrounds
  background: '#FFFFFF',      // Pure white for maximum elegance
  surface: '#FAFAFA',         // Subtle off-white for cards
  
  // Elite text hierarchy
  text: '#0A0A0A',           // Deep black for maximum contrast
  textSecondary: '#6B6B6B',  // Sophisticated gray
  textTertiary: '#9E9E9E',   // Light gray for subtle text
  
  // Premium accent colors
  accent: '#FF6B35',         // Vibrant coral for actions
  border: '#E0E0E0',         // Subtle borders
  shadow: '#000000',         // Pure black shadows
  success: '#4CAF50',        // Success green
};

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Progress indicator section
  progressContainer: {
    position: 'absolute',
    top: 60,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  // Progress dots
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },

  progressDotInactive: {
    backgroundColor: COLORS.textTertiary,
    opacity: 0.3,
  },

  progressDotActive: {
    backgroundColor: COLORS.accent,
    opacity: 1,
  },

  progressDotCompleted: {
    backgroundColor: COLORS.success,
    opacity: 1,
  },

  // Progress connecting line
  progressLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },

  progressLineInactive: {
    backgroundColor: COLORS.textTertiary,
    opacity: 0.2,
  },

  progressLineActive: {
    backgroundColor: COLORS.accent,
    opacity: 0.5,
  },

  progressLineCompleted: {
    backgroundColor: COLORS.success,
    opacity: 1,
  },

  // Screen transition container
  screenContainer: {
    flex: 1,
  },

  // Slide animation wrapper
  slideWrapper: {
    flex: 1,
  },

  // Screen content
  screenContent: {
    flex: 1,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    letterSpacing: 1,
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 32,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },

  errorMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  errorButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },

  errorButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
});

// Animation configurations
export const ANIMATION_CONFIG = {
  // Slide transition timing
  duration: 300,
  
  // Easing curves
  easing: {
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
  
  // Transform values
  transform: {
    slideDistance: 100,
    fadeOpacity: 0.8,
  },
};

// Onboarding steps configuration
export const ONBOARDING_STEPS = {
  LANGUAGE: 'language',
  PHASE: 'phase',
};

// Step progress mapping
export const STEP_PROGRESS = {
  [ONBOARDING_STEPS.LANGUAGE]: 0,
  [ONBOARDING_STEPS.PHASE]: 1,
};

// RTL-aware style helpers
export const getRTLStyles = (isRTL) => ({
  progressContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },
  
  slideWrapper: {
    transform: [
      {
        translateX: isRTL ? -ANIMATION_CONFIG.transform.slideDistance : ANIMATION_CONFIG.transform.slideDistance,
      },
    ],
  },
  
  errorTitle: {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  errorMessage: {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  loadingText: {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
});

export { COLORS, ONBOARDING_STEPS, STEP_PROGRESS, ANIMATION_CONFIG };
export default styles;
