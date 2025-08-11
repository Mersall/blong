/**
 * BLONG Accessibility Utilities
 * WCAG AA compliance helpers and accessibility enhancements
 */

import { Dimensions, Platform, AccessibilityInfo } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getLuminance: (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio between two colors
  getContrastRatio: (color1, color2) => {
    const lum1 = colorContrast.getLuminance(color1);
    const lum2 = colorContrast.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
  meetsWCAG: (foreground, background, isLargeText = false) => {
    const ratio = colorContrast.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },

  // Get high contrast color for text on given background
  getHighContrastText: (backgroundColor) => {
    const whiteContrast = colorContrast.getContrastRatio('#FFFFFF', backgroundColor);
    const blackContrast = colorContrast.getContrastRatio('#000000', backgroundColor);
    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
  },
};

// Touch target utilities
export const touchTarget = {
  // Minimum touch target size (44pt on iOS, 48dp on Android)
  MIN_SIZE: Platform.OS === 'ios' ? 44 : 48,

  // Ensure touch target meets minimum size requirements
  ensureMinimumSize: (size) => Math.max(size, touchTarget.MIN_SIZE),

  // Get touch target padding to reach minimum size
  getPadding: (currentSize) => {
    const minSize = touchTarget.MIN_SIZE;
    const padding = Math.max(0, (minSize - currentSize) / 2);
    return padding;
  },

  // Touch target style with minimum size enforcement
  getStyles: (size = touchTarget.MIN_SIZE) => ({
    minWidth: touchTarget.MIN_SIZE,
    minHeight: touchTarget.MIN_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  }),
};

// Screen reader utilities
export const screenReader = {
  // Generate accessibility label for complex components
  generateLabel: (elements) => {
    return elements.filter(Boolean).join(', ');
  },

  // Common accessibility hints
  hints: {
    button: 'Double tap to activate',
    link: 'Double tap to open',
    textInput: 'Double tap to edit',
    slider: 'Swipe up or down to adjust value',
    switch: 'Double tap to toggle',
    tab: 'Double tap to select tab',
    back: 'Double tap to go back',
    close: 'Double tap to close',
    menu: 'Double tap to open menu',
    search: 'Double tap to search',
  },

  // Get role for component type
  getRoles: () => ({
    button: 'button',
    link: 'link',
    text: 'text',
    heading: 'header',
    image: 'image',
    list: 'list',
    listItem: 'listitem',
    textInput: 'textbox',
    switch: 'switch',
    slider: 'slider',
    tab: 'tab',
    tabPanel: 'tabpanel',
    alert: 'alert',
    dialog: 'dialog',
    menu: 'menu',
    menuItem: 'menuitem',
    progressBar: 'progressbar',
    search: 'search',
  }),
};

// Focus management utilities
export const focusManagement = {
  // Focus trap for modals
  createFocusTrap: (containerRef) => {
    // Implementation would depend on specific focus trap library
    // This is a placeholder for the structure
    return {
      activate: () => {
        // Activate focus trap
      },
      deactivate: () => {
        // Deactivate focus trap
      },
    };
  },

  // Announce to screen reader
  announce: (message, priority = 'polite') => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      AccessibilityInfo.announceForAccessibility(message);
    }
  },
};

// Typography accessibility
export const typography = {
  // Accessible font sizes based on user preferences
  getFontSize: (baseSize, scale = 1) => {
    // This would integrate with user's font size preferences
    // AccessibilityInfo.getRecommendedTimeoutMillis() could be used
    return baseSize * scale;
  },

  // Line height for readability
  getLineHeight: (fontSize) => fontSize * 1.4,

  // Accessible text styles
  getAccessibleTextStyle: (fontSize, color, backgroundColor) => ({
    fontSize: typography.getFontSize(fontSize),
    lineHeight: typography.getLineHeight(fontSize),
    color: colorContrast.meetsWCAG(color, backgroundColor) 
      ? color 
      : colorContrast.getHighContrastText(backgroundColor),
  }),
};

// Animation and motion utilities
export const motionAccessibility = {
  // Check if user prefers reduced motion
  prefersReducedMotion: false, // This would be set based on system preferences

  // Get animation duration based on user preferences
  getAnimationDuration: (normalDuration) => {
    return motionAccessibility.prefersReducedMotion ? 0 : normalDuration;
  },

  // Accessible animation config
  getAccessibleAnimationConfig: (config) => ({
    ...config,
    duration: motionAccessibility.getAnimationDuration(config.duration || 300),
  }),
};

// Form accessibility utilities
export const formAccessibility = {
  // Generate form field accessibility props
  getFormFieldProps: (field) => ({
    accessibilityLabel: field.label,
    accessibilityHint: field.hint || screenReader.hints.textInput,
    accessibilityRequired: field.required,
    accessibilityInvalid: field.hasError,
    accessibilityErrorMessage: field.errorMessage,
  }),

  // Validation message accessibility
  getValidationProps: (isValid, errorMessage) => ({
    accessibilityRole: 'alert',
    accessibilityLiveRegion: 'polite',
    accessibilityLabel: isValid ? 'Field is valid' : `Error: ${errorMessage}`,
  }),
};

// Navigation accessibility
export const navigationAccessibility = {
  // Generate tab accessibility props
  getTabProps: (tab, isSelected, index, totalTabs) => ({
    accessibilityRole: 'tab',
    accessibilityLabel: tab.label,
    accessibilityHint: screenReader.hints.tab,
    accessibilityState: { selected: isSelected },
    accessibilityValue: {
      text: `${index + 1} of ${totalTabs}`,
    },
  }),

  // Generate back button props
  getBackButtonProps: (screenName) => ({
    accessibilityRole: 'button',
    accessibilityLabel: `Go back from ${screenName}`,
    accessibilityHint: screenReader.hints.back,
  }),
};

// Image accessibility
export const imageAccessibility = {
  // Generate image accessibility props
  getImageProps: (image) => ({
    accessibilityRole: 'image',
    accessibilityLabel: image.alt || image.description || 'Image',
    accessible: true,
  }),

  // Decorative image props (hidden from screen readers)
  getDecorativeImageProps: () => ({
    accessible: false,
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  }),
};

// List accessibility
export const listAccessibility = {
  // Generate list props
  getListProps: (itemCount) => ({
    accessibilityRole: 'list',
    accessibilityLabel: `List with ${itemCount} items`,
  }),

  // Generate list item props
  getListItemProps: (item, index, totalItems) => ({
    accessibilityRole: 'listitem',
    accessibilityLabel: item.label || item.title,
    accessibilityValue: {
      text: `${index + 1} of ${totalItems}`,
    },
  }),
};

// Modal accessibility
export const modalAccessibility = {
  // Generate modal props
  getModalProps: (title, description) => ({
    accessibilityRole: 'dialog',
    accessibilityModal: true,
    accessibilityLabel: title,
    accessibilityHint: description,
  }),

  // Handle modal focus
  handleModalFocus: (modalRef) => {
    // Focus management for modal opening/closing
    if (modalRef.current) {
      // Implementation would focus the modal
    }
  },
};

// Utility to check if accessibility features are enabled
export const accessibilityStatus = {
  // Check if screen reader is running
  isScreenReaderEnabled: async () => {
    try {
      return await AccessibilityInfo.isScreenReaderEnabled();
    } catch (error) {
      console.warn('Could not check screen reader status:', error);
      return false;
    }
  },

  // Check if voice over is running (iOS)
  isVoiceOverRunning: async () => {
    try {
      if (Platform.OS === 'ios') {
        return await AccessibilityInfo.isVoiceOverRunning();
      }
      return false;
    } catch (error) {
      console.warn('Could not check VoiceOver status:', error);
      return false;
    }
  },

  // Check if talk back is running (Android)
  isTalkBackRunning: async () => {
    try {
      if (Platform.OS === 'android') {
        return await AccessibilityInfo.isTalkBackRunning();
      }
      return false;
    } catch (error) {
      console.warn('Could not check TalkBack status:', error);
      return false;
    }
  },

  // Get current accessibility status
  getAccessibilityStatus: async () => {
    return {
      screenReaderEnabled: await accessibilityStatus.isScreenReaderEnabled(),
      voiceOverRunning: await accessibilityStatus.isVoiceOverRunning(),
      talkBackRunning: await accessibilityStatus.isTalkBackRunning(),
    };
  },
};

// Main accessibility helper
export const a11y = {
  colorContrast,
  touchTarget,
  screenReader,
  focusManagement,
  typography,
  motionAccessibility,
  formAccessibility,
  navigationAccessibility,
  imageAccessibility,
  listAccessibility,
  modalAccessibility,
  accessibilityStatus,
};

export default a11y;