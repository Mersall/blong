/**
 * BLONG Language Selection Styles
 * Elite styling for language selection screen
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

  // Language options section
  languageContainer: {
    flex: 1,
  },

  languageScrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 120,
  },

  // Language option card
  languageCard: {
    borderRadius: 8,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },

  languageCardDefault: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowOpacity: 0.05,
    elevation: 2,
  },

  languageCardSelected: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.accent,
    shadowOpacity: 0.1,
    elevation: 4,
  },

  // Language card content
  languageFlag: {
    fontSize: 28,
    marginRight: 16,
  },

  languageContent: {
    flex: 1,
  },

  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 3,
  },

  languageNativeName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 1,
  },

  languageDescription: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },

  // Selection indicator
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectionCheckmark: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
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

// RTL-aware style helpers
export const getRTLStyles = (isRTL) => ({
  brandText: {
    textAlign: isRTL ? 'right' : 'left',
  },
  
  brandUnderline: {
    alignSelf: isRTL ? 'flex-end' : 'flex-start',
  },
  
  languageCard: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },
  
  languageFlag: {
    marginRight: isRTL ? 0 : 16,
    marginLeft: isRTL ? 16 : 0,
  },
  
  languageName: {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  languageNativeName: {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  languageDescription: {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
  
  footerText: {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  },
});

export { COLORS };
export default styles;
