/**
 * BLONG Unified App Context
 * Single source of truth for language, theme, RTL, and transitions
 * Clean, simple, and Expo-friendly
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, isRTL, getLanguageConfig } from '../localization/translations';
import '../localization/i18n'; // Initialize i18n

// ===== CONSTANTS =====
const STORAGE_KEYS = {
  LANGUAGE: 'app_language',
  PREFERENCES: 'app_preferences',
};

// ===== COLOR SYSTEM =====
const createColors = (language) => {
  const colors = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    surfaceElevated: '#F5F5F5',
    text: '#0A0A0A',
    textSecondary: '#6B6B6B',
    textTertiary: '#9E9E9E',
    border: '#E0E0E0',
    shadow: '#000000',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  };

  // Fixed brand accent color per BLONG rules
  colors.accent = '#FF6B35';
  colors.accentLight = '#FF6B35';
  colors.accentDark = '#FF6B35';

  return colors;
};

// ===== UNIFIED APP CONTEXT =====
const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const { i18n, t } = useTranslation();

  // ===== CORE STATE =====
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // ===== COMPUTED VALUES =====
  const isRTLActive = useMemo(() => isRTL(currentLanguage), [currentLanguage]);
  const languageConfig = useMemo(() => getLanguageConfig(currentLanguage), [currentLanguage]);
  const colors = useMemo(() => createColors(currentLanguage), [currentLanguage]);

  // ===== AVAILABLE OPTIONS =====
  const availableLanguages = useMemo(() =>
    Object.values(LANGUAGES).map(code => ({
      code,
      ...getLanguageConfig(code),
    })), []
  );

  // ===== RTL STYLES (IMMEDIATE UPDATES) =====
  const rtlStyles = useMemo(() => ({
    textAlign: isRTLActive ? 'right' : 'left',
    textAlignCenter: 'center',
    flexDirection: isRTLActive ? 'row-reverse' : 'row',
    alignSelf: isRTLActive ? 'flex-end' : 'flex-start',
    writingDirection: isRTLActive ? 'rtl' : 'ltr',
    marginLeft: (value) => ({ [isRTLActive ? 'marginRight' : 'marginLeft']: value }),
    marginRight: (value) => ({ [isRTLActive ? 'marginLeft' : 'marginRight']: value }),
    paddingLeft: (value) => ({ [isRTLActive ? 'paddingRight' : 'paddingLeft']: value }),
    paddingRight: (value) => ({ [isRTLActive ? 'paddingLeft' : 'paddingRight']: value }),
  }), [isRTLActive]);

  // ===== LANGUAGE ACTIONS =====
  const changeLanguage = useCallback(async (languageCode) => {
    if (currentLanguage === languageCode) return false;

    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, languageCode);
      console.log(`Language changed to: ${languageCode}`);
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  }, [currentLanguage, i18n]);



  // ===== INITIALIZATION =====
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);

        if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
        }

        console.log('App initialized:', { language: savedLanguage });
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [i18n]);



  // ===== CONTEXT VALUE =====
  const contextValue = useMemo(() => ({
    // Language
    currentLanguage,
    availableLanguages,
    changeLanguage,
    t,

    // Colors (single theme)
    colors,

    // RTL
    isRTL: isRTLActive,
    languageConfig,
    rtlStyles,
  }), [
    currentLanguage,
    availableLanguages,
    changeLanguage,
    t,
    colors,
    isRTLActive,
    languageConfig,
    rtlStyles,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// ===== MAIN HOOK =====
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// ===== SPECIALIZED HOOKS =====
export const useLanguage = () => {
  const { currentLanguage, availableLanguages, changeLanguage, t } = useApp();
  return { currentLanguage, availableLanguages, changeLanguage, t };
};

export const useTheme = () => {
  const { colors } = useApp();
  return { colors };
};

export const useRTL = () => {
  const { isRTL, languageConfig, rtlStyles } = useApp();
  return { isRTL, languageConfig, rtlStyles };
};

export default AppContext;
