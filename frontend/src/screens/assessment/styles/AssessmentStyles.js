/**
 * BLONG Assessment Screen Styles
 * Comprehensive styling for personality assessment screens
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const createAssessmentStyles = (colors, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  loadingText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },

  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  exitButtonText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: 'bold',
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.surfaceElevated,
  },

  saveButtonText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },

  // Content
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingVertical: 20,
    minHeight: screenHeight * 0.7,
  },

  // Navigation
  navigationContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },

  navButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },

  previousButton: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },

  nextButton: {
    overflow: 'hidden',
  },

  nextButtonGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  navButtonDisabled: {
    opacity: 0.5,
  },

  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },

  navButtonTextDisabled: {
    color: colors.textTertiary,
  },
});

// Assessment Introduction Styles
export const createIntroStyles = (colors, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Hero Section
  heroContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },

  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },

  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },

  // Stats Section
  statsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    paddingVertical: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Sections Preview
  sectionsContainer: {
    marginBottom: 40,
  },

  sectionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: isRTL ? 'right' : 'left',
  },

  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  sectionHeader: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionIcon: {
    fontSize: 20,
    marginRight: isRTL ? 0 : 12,
    marginLeft: isRTL ? 12 : 0,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },

  sectionTime: {
    fontSize: 12,
    color: colors.textTertiary,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: isRTL ? 'right' : 'left',
  },

  // Privacy Section
  privacyContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },

  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: isRTL ? 'right' : 'left',
  },

  privacyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: isRTL ? 'right' : 'left',
  },

  // Start Button
  startButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  startButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },

  startButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },

  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
    marginRight: isRTL ? 0 : 8,
    marginLeft: isRTL ? 8 : 0,
  },

  startButtonIcon: {
    fontSize: 20,
    color: colors.surface,
  },
});

export default {
  createAssessmentStyles,
  createIntroStyles,
};
