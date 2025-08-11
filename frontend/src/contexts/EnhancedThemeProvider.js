/**
 * BLONG Enhanced Theme Provider
 * Comprehensive theme management with dark mode, RTL, and cultural adaptations
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StatusBar, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeUtils, THEMES } from '../utils/ThemeUtils';

const STORAGE_KEYS = {
  THEME_PREFERENCE: 'blong_theme_preference',
  LANGUAGE_PREFERENCE: 'blong_language_preference',
  HIGH_CONTRAST: 'blong_high_contrast',
  AUTO_THEME: 'blong_auto_theme',
};

// Enhanced Theme Context
const EnhancedThemeContext = createContext({
  // Theme state
  theme: THEMES.light,
  themeName: 'light',
  isDarkMode: false,
  isHighContrast: false,
  isAutoTheme: false,
  
  // Language and cultural state
  language: 'en',
  isRTL: false,
  culturalPreferences: {},
  
  // Theme actions
  setTheme: () => {},
  toggleTheme: () => {},
  enableHighContrast: () => {},
  setAutoTheme: () => {},
  
  // Language actions
  setLanguage: () => {},
  
  // Utility functions
  getThemedStyle: () => {},
  getResponsiveStyle: () => {},
  adaptForCulture: () => {},
});

// Enhanced Theme Provider Component
export const EnhancedThemeProvider = ({ children }) => {
  // Theme state
  const [themeName, setThemeName] = useState('light');
  const [language, setLanguageState] = useState('en');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAutoTheme, setIsAutoTheme] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Derived state
  const isDarkMode = themeName === 'dark';
  const isRTL = themeUtils.culturalUtils.getCulturalPreferences(language).textDirection === 'rtl';
  const culturalPreferences = themeUtils.culturalUtils.getCulturalPreferences(language);

  // Get current theme with cultural adaptations
  const getCurrentTheme = () => {
    let baseTheme = THEMES[themeName] || THEMES.light;
    
    // Apply cultural adaptations
    baseTheme = {
      ...baseTheme,
      colors: themeUtils.culturalUtils.adaptColorsForCulture(baseTheme.colors, language),
    };
    
    // Apply high contrast if enabled
    if (isHighContrast) {
      baseTheme = themeUtils.createHighContrastTheme(baseTheme);
    }
    
    return baseTheme;
  };

  const theme = getCurrentTheme();

  // Initialize theme from storage
  useEffect(() => {
    initializeTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    if (isAutoTheme) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setThemeName(colorScheme === 'dark' ? 'dark' : 'light');
      });
      
      return () => subscription?.remove();
    }
  }, [isAutoTheme]);

  // Update status bar style based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [isDarkMode]);

  // Update RTL layout when language changes
  useEffect(() => {
    if (isInitialized) {
      const preferences = themeUtils.culturalUtils.getCulturalPreferences(language);
      themeUtils.rtlUtils.forceRTL(preferences.textDirection === 'rtl');
    }
  }, [language, isInitialized]);

  const initializeTheme = async () => {
    try {
      // Load saved preferences
      const [
        savedTheme,
        savedLanguage,
        savedHighContrast,
        savedAutoTheme,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE),
        AsyncStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST),
        AsyncStorage.getItem(STORAGE_KEYS.AUTO_THEME),
      ]);

      // Apply saved preferences
      if (savedTheme && THEMES[savedTheme]) {
        setThemeName(savedTheme);
      }

      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }

      if (savedHighContrast === 'true') {
        setIsHighContrast(true);
      }

      if (savedAutoTheme === 'true') {
        setIsAutoTheme(true);
        // Use system theme if auto theme is enabled
        const systemTheme = Appearance.getColorScheme();
        if (systemTheme) {
          setThemeName(systemTheme === 'dark' ? 'dark' : 'light');
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing theme:', error);
      setIsInitialized(true);
    }
  };

  // Theme actions
  const setTheme = async (newThemeName) => {
    if (THEMES[newThemeName]) {
      setThemeName(newThemeName);
      setIsAutoTheme(false);
      
      try {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, newThemeName),
          AsyncStorage.setItem(STORAGE_KEYS.AUTO_THEME, 'false'),
        ]);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const enableHighContrast = async (enable = true) => {
    setIsHighContrast(enable);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, enable.toString());
    } catch (error) {
      console.error('Error saving high contrast preference:', error);
    }
  };

  const setAutoTheme = async (enable = true) => {
    setIsAutoTheme(enable);
    
    if (enable) {
      const systemTheme = Appearance.getColorScheme();
      if (systemTheme) {
        setThemeName(systemTheme === 'dark' ? 'dark' : 'light');
      }
    }
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_THEME, enable.toString());
    } catch (error) {
      console.error('Error saving auto theme preference:', error);
    }
  };

  // Language actions
  const setLanguage = async (newLanguage) => {
    setLanguageState(newLanguage);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // Utility functions
  const getThemedStyle = (styleFunction) => {
    if (typeof styleFunction === 'function') {
      return styleFunction(theme, language);
    }
    return styleFunction;
  };

  const getResponsiveStyle = (baseStyle) => {
    if (typeof baseStyle === 'object') {
      const responsiveStyle = {};
      Object.keys(baseStyle).forEach(key => {
        responsiveStyle[key] = themeUtils.responsiveTheme.getResponsiveValue(baseStyle[key]);
      });
      return responsiveStyle;
    }
    return baseStyle;
  };

  const adaptForCulture = (component, culturalProps = {}) => {
    const adaptedProps = {
      ...culturalProps,
      style: [
        culturalProps.style,
        isRTL && themeUtils.rtlUtils.transformStyle(culturalProps.style || {}),
      ].filter(Boolean),
    };

    return React.cloneElement(component, adaptedProps);
  };

  // Context value
  const contextValue = {
    // Theme state
    theme,
    themeName,
    isDarkMode,
    isHighContrast,
    isAutoTheme,
    
    // Language and cultural state
    language,
    isRTL,
    culturalPreferences,
    
    // Theme actions
    setTheme,
    toggleTheme,
    enableHighContrast,
    setAutoTheme,
    
    // Language actions
    setLanguage,
    
    // Utility functions
    getThemedStyle,
    getResponsiveStyle,
    adaptForCulture,
    
    // Direct access to theme utilities
    rtlUtils: themeUtils.rtlUtils,
    culturalUtils: themeUtils.culturalUtils,
    responsiveTheme: themeUtils.responsiveTheme,
  };

  // Don't render until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <EnhancedThemeContext.Provider value={contextValue}>
      {children}
    </EnhancedThemeContext.Provider>
  );
};

// Enhanced hook to use theme context
export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within EnhancedThemeProvider');
  }
  return context;
};

// Hook for themed styles
export const useThemedStyles = (styleFunction) => {
  const { theme, language, getThemedStyle } = useEnhancedTheme();
  
  return getThemedStyle(styleFunction);
};

// Hook for responsive themed styles
export const useResponsiveThemedStyles = (styleFunction) => {
  const { theme, language, getThemedStyle, getResponsiveStyle } = useEnhancedTheme();
  
  const themedStyles = getThemedStyle(styleFunction);
  return getResponsiveStyle(themedStyles);
};

// Hook for cultural adaptations
export const useCulturalAdaptations = () => {
  const { 
    language, 
    isRTL, 
    culturalPreferences, 
    culturalUtils,
    rtlUtils 
  } = useEnhancedTheme();
  
  return {
    language,
    isRTL,
    culturalPreferences,
    formatNumber: (number) => culturalUtils.formatNumber(number, language),
    getFontFamily: (weight) => culturalUtils.getFontFamily(language, weight),
    getTextAlign: (alignment) => rtlUtils.getTextAlign(alignment),
    getFlexDirection: (direction) => rtlUtils.getFlexDirection(direction),
    transformStyle: (style) => rtlUtils.transformStyle(style),
  };
};

// HOC for theme-aware components
export const withEnhancedTheme = (Component) => {
  return function ThemedComponent(props) {
    const themeProps = useEnhancedTheme();
    return <Component {...props} {...themeProps} />;
  };
};

// Theme-aware components
export const ThemedView = ({ style, children, ...props }) => {
  const { theme, isRTL, rtlUtils } = useEnhancedTheme();
  
  const themedStyle = [
    { backgroundColor: theme.colors.background },
    isRTL && rtlUtils.transformStyle(style || {}),
    !isRTL && style,
  ].filter(Boolean);
  
  return (
    <View style={themedStyle} {...props}>
      {children}
    </View>
  );
};

export const ThemedText = ({ style, children, ...props }) => {
  const { theme, language, culturalUtils, isRTL, rtlUtils } = useEnhancedTheme();
  
  const themedStyle = [
    { 
      color: theme.colors.text,
      fontFamily: culturalUtils.getFontFamily(language),
      textAlign: isRTL ? 'right' : 'left',
    },
    isRTL && rtlUtils.transformStyle(style || {}),
    !isRTL && style,
  ].filter(Boolean);
  
  return (
    <Text style={themedStyle} {...props}>
      {children}
    </Text>
  );
};

export default {
  EnhancedThemeProvider,
  useEnhancedTheme,
  useThemedStyles,
  useResponsiveThemedStyles,
  useCulturalAdaptations,
  withEnhancedTheme,
  ThemedView,
  ThemedText,
};