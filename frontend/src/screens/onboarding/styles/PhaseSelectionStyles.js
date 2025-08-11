/**
 * BLONG Phase Selection Styles
 * Elite styling for relationship phase selection screen
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
};

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header section
  header: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
  },

  brandText: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 8,
    color: COLORS.text,
    marginBottom: 16,
  },

  brandUnderline: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Phase options section
  phaseContainer: {
    flex: 1,
  },

  phaseScrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 140,
  },

  // Phase option card
  phaseCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },

  phaseCardDefault: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowOpacity: 0.08,
  },

  phaseCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    shadowOpacity: 0.15,
    elevation: 8,
  },

  // Phase card content
  phaseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  phaseIcon: {
    fontSize: 32,
    marginRight: 16,
  },

  phaseTextContent: {
    flex: 1,
  },

  phaseTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
  },

  phaseTitleDefault: {
    color: COLORS.text,
  },

  phaseTitleSelected: {
    color: COLORS.background,
  },

  phaseSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1,
  },

  phaseSubtitleDefault: {
    color: COLORS.textSecondary,
  },

  phaseSubtitleSelected: {
    color: COLORS.background,
  },

  // Selection indicator
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectionCheckmark: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Phase description
  phaseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  phaseDescriptionDefault: {
    color: COLORS.textSecondary,
    opacity: 1,
  },

  phaseDescriptionSelected: {
    color: COLORS.background,
    opacity: 0.9,
  },

  // Fixed bottom section
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    zIndex: 1000,
  },

  // Continue button
  continueButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  continueButtonEnabled: {
    backgroundColor: COLORS.text,
    opacity: 1,
  },

  continueButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },

  continueButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
  },

  // Footer text
  footerText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
  },
});

// Phase gradient configurations
export const PHASE_GRADIENTS = {
  single: ['#FF6B35', '#FF8A65'],
  engagement: ['#FFD700', '#FFA000'],
  wedding: ['#FF6B35', '#FFD700'],
};

// RTL-aware style helpers
export const getRTLStyles = (isRTL) => ({
  brandText: {
    textAlign: isRTL ? 'right' : 'left',
  },
  
  brandUnderline: {
    alignSelf: isRTL ? 'flex-end' : 'flex-start',
  },
  
  title: {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  subtitle: {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  phaseCardContent: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },
  
  phaseIcon: {
    marginRight: isRTL ? 0 : 16,
    marginLeft: isRTL ? 16 : 0,
  },
  
  phaseTitle: {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  phaseSubtitle: {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  phaseDescription: {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  footerText: {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
});

export { COLORS };
export default styles;
