/**
 * BLONG Translation Index
 * Centralized export for all language translations
 */

import enTranslations from './en';
import arTranslations from './ar';
import frTranslations from './fr';
import esTranslations from './es';

// Language configuration with RTL support
export const LANGUAGE_CONFIG = {
  en: {
    translation: enTranslations,
    isRTL: false,
    direction: 'ltr',
    fontFamily: 'Inter',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  ar: {
    translation: arTranslations,
    isRTL: true,
    direction: 'rtl',
    fontFamily: 'Inter', // You can specify Arabic fonts here
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
  },
  fr: {
    translation: frTranslations,
    isRTL: false,
    direction: 'ltr',
    fontFamily: 'Inter',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
  es: {
    translation: esTranslations,
    isRTL: false,
    direction: 'ltr',
    fontFamily: 'Inter',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
};

// Export language constants
export const LANGUAGES = {
  ENGLISH: 'en',
  ARABIC: 'ar',
  FRENCH: 'fr',
  SPANISH: 'es',
};

// Export RTL languages
export const RTL_LANGUAGES = ['ar'];

// Export translation resources for i18n
export const TRANSLATION_RESOURCES = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  fr: { translation: frTranslations },
  es: { translation: esTranslations },
};

// Helper function to check if language is RTL
export const isRTL = (languageCode) => {
  return RTL_LANGUAGES.includes(languageCode);
};

// Helper function to get language direction
export const getLanguageDirection = (languageCode) => {
  return isRTL(languageCode) ? 'rtl' : 'ltr';
};

// Helper function to get language config
export const getLanguageConfig = (languageCode) => {
  return LANGUAGE_CONFIG[languageCode] || LANGUAGE_CONFIG.en;
};

export default TRANSLATION_RESOURCES;
