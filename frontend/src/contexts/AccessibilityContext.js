/**
 * BLONG Accessibility Context
 * Comprehensive accessibility state management and WCAG AA compliance
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AccessibilityInfo, Platform, Appearance } from 'react-native';
import { a11y } from '../utils/AccessibilityUtils';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  // Accessibility state
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isVoiceOverRunning, setIsVoiceOverRunning] = useState(false);
  const [isTalkBackRunning, setIsTalkBackRunning] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [colorScheme, setColorScheme] = useState('light');
  
  // Focus management
  const [focusedElement, setFocusedElement] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);
  const focusListeners = useRef(new Map());

  // Initialize accessibility settings
  useEffect(() => {
    const initializeAccessibility = async () => {
      try {
        // Check screen reader status
        const screenReaderEnabled = await a11y.accessibilityStatus.isScreenReaderEnabled();
        setIsScreenReaderEnabled(screenReaderEnabled);

        if (Platform.OS === 'ios') {
          const voiceOverRunning = await a11y.accessibilityStatus.isVoiceOverRunning();
          setIsVoiceOverRunning(voiceOverRunning);
        }

        if (Platform.OS === 'android') {
          const talkBackRunning = await a11y.accessibilityStatus.isTalkBackRunning();
          setIsTalkBackRunning(talkBackRunning);
        }

        // Get initial color scheme
        const initialColorScheme = Appearance.getColorScheme();
        setColorScheme(initialColorScheme || 'light');

        // Set up listeners
        setupAccessibilityListeners();
        
      } catch (error) {
        console.warn('Failed to initialize accessibility settings:', error);
      }
    };

    initializeAccessibility();
  }, []);

  // Set up accessibility event listeners
  const setupAccessibilityListeners = () => {
    // Screen reader change listener
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    // Reduce motion listener (iOS)
    let reduceMotionListener;
    if (Platform.OS === 'ios') {
      reduceMotionListener = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        setReduceMotionEnabled
      );
    }

    // Color scheme listener
    const colorSchemeListener = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme || 'light');
    });

    // Cleanup function
    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
      colorSchemeListener?.remove();
    };
  };

  // Announce message to screen reader
  const announce = (message, priority = 'polite') => {
    if (isScreenReaderEnabled) {
      a11y.focusManagement.announce(message, priority);
    }
  };

  // Set accessibility focus
  const setAccessibilityFocus = (elementRef) => {
    if (elementRef?.current && isScreenReaderEnabled) {
      try {
        AccessibilityInfo.setAccessibilityFocus(elementRef.current);
        setFocusedElement(elementRef.current);
        
        // Add to focus history
        setFocusHistory(prev => [...prev.slice(-9), elementRef.current]);
      } catch (error) {
        console.warn('Failed to set accessibility focus:', error);
      }
    }
  };

  // Navigate focus backwards
  const focusPrevious = () => {
    if (focusHistory.length > 1) {
      const previousElement = focusHistory[focusHistory.length - 2];
      if (previousElement) {
        try {
          AccessibilityInfo.setAccessibilityFocus(previousElement);
          setFocusedElement(previousElement);
          setFocusHistory(prev => prev.slice(0, -1));
        } catch (error) {
          console.warn('Failed to focus previous element:', error);
        }
      }
    }
  };

  // Register focus listener for a component
  const registerFocusListener = (id, callback) => {
    focusListeners.current.set(id, callback);
    
    return () => {
      focusListeners.current.delete(id);
    };
  };

  // Get accessible text color based on background
  const getAccessibleTextColor = (backgroundColor) => {
    return a11y.colorContrast.getHighContrastText(backgroundColor);
  };

  // Check if color combination meets WCAG standards
  const checkColorContrast = (foreground, background, isLargeText = false) => {
    return a11y.colorContrast.meetsWCAG(foreground, background, isLargeText);
  };

  // Get animation duration based on reduce motion setting
  const getAnimationDuration = (defaultDuration) => {
    return a11y.motionAccessibility.getAnimationDuration(defaultDuration);
  };

  // Get font size scaled for accessibility
  const getScaledFontSize = (baseSize) => {
    return a11y.typography.getFontSize(baseSize, fontScale);
  };

  // Get touch target size that meets accessibility standards
  const getAccessibleTouchTarget = () => {
    return a11y.touchTarget.getStyles();
  };

  // Generate accessibility props for form fields
  const getFormFieldProps = (field) => {
    return a11y.formAccessibility.getFormFieldProps(field);
  };

  // Generate accessibility props for navigation tabs
  const getTabProps = (tab, isSelected, index, totalTabs) => {
    return a11y.navigationAccessibility.getTabProps(tab, isSelected, index, totalTabs);
  };

  // Generate accessibility props for modals
  const getModalProps = (title, description) => {
    return a11y.modalAccessibility.getModalProps(title, description);
  };

  // Generate accessibility props for images
  const getImageProps = (image) => {
    return a11y.imageAccessibility.getImageProps(image);
  };

  // Generate accessibility props for lists
  const getListProps = (itemCount) => {
    return a11y.listAccessibility.getListProps(itemCount);
  };

  const getListItemProps = (item, index, totalItems) => {
    return a11y.listAccessibility.getListItemProps(item, index, totalItems);
  };

  // Enhanced screen reader announcement with context
  const announceScreenChange = (screenName, context = '') => {
    const message = context 
      ? `${screenName} screen. ${context}`
      : `Navigated to ${screenName} screen`;
    
    announce(message, 'polite');
  };

  // Announce form validation errors
  const announceValidationError = (fieldName, errorMessage) => {
    const message = `${fieldName}: ${errorMessage}`;
    announce(message, 'assertive');
  };

  // Announce success messages
  const announceSuccess = (message) => {
    announce(message, 'polite');
  };

  // Get current accessibility status
  const getAccessibilityStatus = () => {
    return {
      isScreenReaderEnabled,
      isVoiceOverRunning,
      isTalkBackRunning,
      reduceMotionEnabled,
      highContrastEnabled,
      fontScale,
      colorScheme,
      isHighContrast: highContrastEnabled || colorScheme === 'dark',
      hasAccessibilityFocus: !!focusedElement,
    };
  };

  // Context value
  const value = {
    // State
    isScreenReaderEnabled,
    isVoiceOverRunning,
    isTalkBackRunning,
    reduceMotionEnabled,
    highContrastEnabled,
    fontScale,
    colorScheme,
    focusedElement,
    
    // Methods
    announce,
    announceScreenChange,
    announceValidationError,
    announceSuccess,
    setAccessibilityFocus,
    focusPrevious,
    registerFocusListener,
    
    // Utility methods
    getAccessibleTextColor,
    checkColorContrast,
    getAnimationDuration,
    getScaledFontSize,
    getAccessibleTouchTarget,
    
    // Props generators
    getFormFieldProps,
    getTabProps,
    getModalProps,
    getImageProps,
    getListProps,
    getListItemProps,
    
    // Status
    getAccessibilityStatus,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;