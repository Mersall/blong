/**
 * BLONG Theme and Cultural Sensitivity Utilities
 * Dark mode, RTL support, and cultural adaptations
 */

import { I18nManager, Dimensions } from 'react-native';
import { useState, useEffect, useContext, createContext } from 'react';

const { width: screenWidth } = Dimensions.get('window');

// Theme definitions
export const THEMES = {
  light: {
    name: 'light',
    colors: {
      // Backgrounds
      background: '#FFFFFF',
      surface: '#FAFAFA',
      surfaceVariant: '#F5F5F5',
      
      // Text colors
      text: '#0A0A0A',
      textSecondary: '#6B6B6B',
      textTertiary: '#9E9E9E',
      textInverse: '#FFFFFF',
      
      // Brand colors
      accent: '#FF6B35',
      accentSecondary: '#FF8A65',
      
      // Status colors
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#FF3B30',
      info: '#2196F3',
      
      // UI elements
      border: '#E0E0E0',
      borderSecondary: '#F0F0F0',
      shadow: '#000000',
      overlay: 'rgba(0, 0, 0, 0.5)',
      
      // Phase-specific colors
      single: '#FF6B35',
      preparing: '#9C27B0',
      engagement: '#FFD700',
      
      // Gradients
      gradients: {
        primary: ['#FF6B35', '#FF8A65'],
        secondary: ['#FAFAFA', '#FFFFFF'],
        surface: ['#FFFFFF', '#F8F8F8'],
        accent: ['#FFD700', '#FFA000'],
      },
    },
    
    // Semantic color mappings
    semantic: {
      cardBackground: '#FFFFFF',
      inputBackground: '#FAFAFA',
      buttonPrimary: '#FF6B35',
      buttonSecondary: 'transparent',
      iconPrimary: '#6B6B6B',
      iconSecondary: '#9E9E9E',
    },
    
    // Elevation shadows
    shadows: {
      small: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      large: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      },
    },
  },
  
  dark: {
    name: 'dark',
    colors: {
      // Backgrounds
      background: '#0A0A0A',
      surface: '#1C1C1E',
      surfaceVariant: '#2C2C2E',
      
      // Text colors
      text: '#FFFFFF',
      textSecondary: '#A0A0A0',
      textTertiary: '#6B6B6B',
      textInverse: '#0A0A0A',
      
      // Brand colors (adjusted for dark mode)
      accent: '#FF8A65',
      accentSecondary: '#FFB74D',
      
      // Status colors (adjusted for dark mode)
      success: '#66BB6A',
      warning: '#FFB74D',
      error: '#FF5252',
      info: '#42A5F5',
      
      // UI elements
      border: '#333333',
      borderSecondary: '#2A2A2A',
      shadow: '#000000',
      overlay: 'rgba(0, 0, 0, 0.7)',
      
      // Phase-specific colors (adjusted)
      single: '#FF8A65',
      preparing: '#BA68C8',
      engagement: '#FFE082',
      
      // Gradients
      gradients: {
        primary: ['#FF8A65', '#FFB74D'],
        secondary: ['#1C1C1E', '#2C2C2E'],
        surface: ['#2C2C2E', '#1C1C1E'],
        accent: ['#FFE082', '#FFB74D'],
      },
    },
    
    // Semantic color mappings
    semantic: {
      cardBackground: '#1C1C1E',
      inputBackground: '#2C2C2E',
      buttonPrimary: '#FF8A65',
      buttonSecondary: 'transparent',
      iconPrimary: '#A0A0A0',
      iconSecondary: '#6B6B6B',
    },
    
    // Elevation shadows (adjusted for dark theme)
    shadows: {
      small: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
      },
      large: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
      },
    },
  },
};

// RTL (Right-to-Left) support utilities
export const rtlUtils = {
  // Check if current language is RTL
  isRTL: () => I18nManager.isRTL,
  
  // Force RTL layout
  forceRTL: (enable = true) => {
    I18nManager.forceRTL(enable);
  },
  
  // Allow RTL layout
  allowRTL: (allow = true) => {
    I18nManager.allowRTL(allow);
  },
  
  // Get text alignment based on RTL
  getTextAlign: (alignment = 'left') => {
    if (!rtlUtils.isRTL()) return alignment;
    
    switch (alignment) {
      case 'left': return 'right';
      case 'right': return 'left';
      default: return alignment;
    }
  },
  
  // Get flex direction based on RTL
  getFlexDirection: (direction = 'row') => {
    if (!rtlUtils.isRTL()) return direction;
    
    switch (direction) {
      case 'row': return 'row-reverse';
      case 'row-reverse': return 'row';
      default: return direction;
    }
  },
  
  // Get margin/padding properties for RTL
  getSpacing: (property, value) => {
    if (!rtlUtils.isRTL()) return { [property]: value };
    
    const rtlMappings = {
      marginLeft: 'marginRight',
      marginRight: 'marginLeft',
      paddingLeft: 'paddingRight',
      paddingRight: 'paddingLeft',
      left: 'right',
      right: 'left',
    };
    
    const rtlProperty = rtlMappings[property] || property;
    return { [rtlProperty]: value };
  },
  
  // Transform styles for RTL
  transformStyle: (style) => {
    if (!rtlUtils.isRTL()) return style;
    
    const transformed = { ...style };
    
    // Handle flexDirection
    if (style.flexDirection === 'row') {
      transformed.flexDirection = 'row-reverse';
    } else if (style.flexDirection === 'row-reverse') {
      transformed.flexDirection = 'row';
    }
    
    // Handle text alignment
    if (style.textAlign === 'left') {
      transformed.textAlign = 'right';
    } else if (style.textAlign === 'right') {
      transformed.textAlign = 'left';
    }
    
    // Handle margins and paddings
    const spacingMappings = {
      marginLeft: 'marginRight',
      marginRight: 'marginLeft',
      paddingLeft: 'paddingRight',
      paddingRight: 'paddingLeft',
      left: 'right',
      right: 'left',
    };
    
    Object.keys(spacingMappings).forEach(key => {
      if (style[key] !== undefined) {
        transformed[spacingMappings[key]] = style[key];
        delete transformed[key];
      }
    });
    
    return transformed;
  },
};

// Cultural adaptation utilities
export const culturalUtils = {
  // Cultural preferences by region
  CULTURAL_PREFERENCES: {
    'ar': { // Arabic
      primaryFont: 'NotoSansArabic',
      secondaryFont: 'System',
      textDirection: 'rtl',
      numberFormat: 'arabic-indic',
      calendarType: 'islamic',
      colorPreferences: {
        primary: '#2E8B57', // More conservative green
        accent: '#DAA520',  // Gold for elegance
      },
      culturalColors: {
        success: '#228B22',
        celebration: '#FFD700',
        formal: '#191970',
      },
    },
    'en': { // English
      primaryFont: 'System',
      secondaryFont: 'System',
      textDirection: 'ltr',
      numberFormat: 'decimal',
      calendarType: 'gregorian',
      colorPreferences: {
        primary: '#FF6B35',
        accent: '#FF8A65',
      },
      culturalColors: {
        success: '#4CAF50',
        celebration: '#FF6B35',
        formal: '#2C3E50',
      },
    },
    'ur': { // Urdu
      primaryFont: 'NotoSansUrdu',
      secondaryFont: 'System',
      textDirection: 'rtl',
      numberFormat: 'decimal',
      calendarType: 'gregorian',
      colorPreferences: {
        primary: '#8B4513',
        accent: '#CD853F',
      },
      culturalColors: {
        success: '#32CD32',
        celebration: '#FF69B4',
        formal: '#4B0082',
      },
    },
  },

  // Get cultural preferences for language
  getCulturalPreferences: (languageCode) => {
    return culturalUtils.CULTURAL_PREFERENCES[languageCode] || 
           culturalUtils.CULTURAL_PREFERENCES['en'];
  },

  // Adapt colors for cultural context
  adaptColorsForCulture: (baseColors, languageCode) => {
    const preferences = culturalUtils.getCulturalPreferences(languageCode);
    
    return {
      ...baseColors,
      accent: preferences.colorPreferences.primary,
      accentSecondary: preferences.colorPreferences.accent,
      success: preferences.culturalColors.success,
      celebration: preferences.culturalColors.celebration,
      formal: preferences.culturalColors.formal,
    };
  },

  // Format numbers according to cultural preferences
  formatNumber: (number, languageCode) => {
    const preferences = culturalUtils.getCulturalPreferences(languageCode);
    
    if (preferences.numberFormat === 'arabic-indic') {
      // Convert to Arabic-Indic numerals
      return number.toString().replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
    }
    
    return number.toString();
  },

  // Get appropriate font family
  getFontFamily: (languageCode, weight = 'regular') => {
    const preferences = culturalUtils.getCulturalPreferences(languageCode);
    
    const fontMappings = {
      'NotoSansArabic': {
        light: 'NotoSansArabic-Light',
        regular: 'NotoSansArabic-Regular',
        medium: 'NotoSansArabic-Medium',
        bold: 'NotoSansArabic-Bold',
      },
      'NotoSansUrdu': {
        light: 'NotoSansUrdu-Light',
        regular: 'NotoSansUrdu-Regular',
        medium: 'NotoSansUrdu-Medium',
        bold: 'NotoSansUrdu-Bold',
      },
      'System': {
        light: 'System',
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
    };
    
    const fontFamily = fontMappings[preferences.primaryFont];
    return fontFamily ? fontFamily[weight] : 'System';
  },
};

// Theme context
export const ThemeContext = createContext({
  theme: THEMES.light,
  isDarkMode: false,
  toggleTheme: () => {},
  culturalPreferences: culturalUtils.CULTURAL_PREFERENCES['en'],
  language: 'en',
  setLanguage: () => {},
});

// Theme provider hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Custom hook for theme management
export const useThemeManager = (initialTheme = 'light', initialLanguage = 'en') => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [language, setLanguage] = useState(initialLanguage);

  // Get theme object
  const theme = THEMES[currentTheme] || THEMES.light;
  
  // Get cultural preferences
  const culturalPreferences = culturalUtils.getCulturalPreferences(language);
  
  // Adapt theme colors for culture
  const adaptedTheme = {
    ...theme,
    colors: culturalUtils.adaptColorsForCulture(theme.colors, language),
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Set specific theme
  const setTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Handle RTL setup
    const newPreferences = culturalUtils.getCulturalPreferences(newLanguage);
    if (newPreferences.textDirection === 'rtl') {
      rtlUtils.forceRTL(true);
    } else {
      rtlUtils.forceRTL(false);
    }
  };

  // Auto theme based on system
  const useSystemTheme = () => {
    // This would integrate with system theme detection
    // For now, default to light
    setCurrentTheme('light');
  };

  return {
    theme: adaptedTheme,
    currentTheme,
    isDarkMode: currentTheme === 'dark',
    toggleTheme,
    setTheme,
    language,
    setLanguage: handleLanguageChange,
    culturalPreferences,
    useSystemTheme,
    rtlUtils,
  };
};

// Theme-aware style utilities
export const createThemedStyles = (styleFunction) => {
  return (theme, language = 'en') => {
    const styles = styleFunction(theme, language);
    
    // Apply RTL transformations if needed
    const culturalPrefs = culturalUtils.getCulturalPreferences(language);
    if (culturalPrefs.textDirection === 'rtl') {
      const transformedStyles = {};
      Object.keys(styles).forEach(key => {
        transformedStyles[key] = rtlUtils.transformStyle(styles[key]);
      });
      return transformedStyles;
    }
    
    return styles;
  };
};

// Responsive theme utilities
export const responsiveTheme = {
  // Get responsive value based on screen size
  getResponsiveValue: (values) => {
    if (typeof values !== 'object') return values;
    
    if (screenWidth >= 768) {
      return values.tablet || values.mobile || values;
    }
    
    return values.mobile || values;
  },

  // Get responsive spacing
  getResponsiveSpacing: (baseSpacing) => {
    const multiplier = screenWidth >= 768 ? 1.2 : 1;
    return baseSpacing * multiplier;
  },

  // Get responsive font size
  getResponsiveFontSize: (baseFontSize) => {
    const multiplier = screenWidth >= 768 ? 1.1 : 1;
    return baseFontSize * multiplier;
  },
};

// High contrast theme for accessibility
export const createHighContrastTheme = (baseTheme) => {
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      text: baseTheme.name === 'light' ? '#000000' : '#FFFFFF',
      background: baseTheme.name === 'light' ? '#FFFFFF' : '#000000',
      border: baseTheme.name === 'light' ? '#000000' : '#FFFFFF',
      accent: baseTheme.name === 'light' ? '#0000FF' : '#FFFF00',
    },
    shadows: {
      // Remove shadows for high contrast
      small: {},
      medium: {},
      large: {},
    },
  };
};

// Main theme utility export
export const themeUtils = {
  THEMES,
  rtlUtils,
  culturalUtils,
  useTheme,
  useThemeManager,
  createThemedStyles,
  responsiveTheme,
  createHighContrastTheme,
  ThemeContext,
};

export default themeUtils;