/**
 * BLONG 2024 Elite Modern Localization
 * Multi-language support with RTL/LTR handling and cultural sensitivity
 * Separated translation files for better maintainability
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Import translations and language configuration
import { 
  TRANSLATION_RESOURCES, 
  LANGUAGES, 
  isRTL, 
  getLanguageDirection,
  getLanguageConfig 
} from './translations';

// Export for use in components
export { LANGUAGES, isRTL, getLanguageDirection, getLanguageConfig };

// ===== RTL SUPPORT FUNCTIONS =====
const setupRTL = (languageCode) => {
  const shouldBeRTL = isRTL(languageCode);
  
  // Only change RTL if it's different from current state
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    
    // Note: In production, you might want to restart the app
    // RNRestart.Restart(); // Uncomment if using react-native-restart
  }
};

// ===== LANGUAGE CHANGE HANDLER =====
export const changeLanguage = async (languageCode) => {
  try {
    // Setup RTL/LTR
    setupRTL(languageCode);
    
    // Change i18n language
    await i18n.changeLanguage(languageCode);
    
    // Save to AsyncStorage
    await AsyncStorage.setItem('selectedLanguage', languageCode);
    
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

// ===== I18N CONFIGURATION =====
const initI18n = async () => {
  let savedLanguage = LANGUAGES.ENGLISH; // Default
  
  try {
    // Try to get saved language
    const stored = await AsyncStorage.getItem('selectedLanguage');
    if (stored && Object.values(LANGUAGES).includes(stored)) {
      savedLanguage = stored;
    }
  } catch (error) {
    console.warn('Could not load saved language:', error);
  }

  // Setup RTL for initial language
  setupRTL(savedLanguage);

  // Initialize i18n
  await i18n
    .use(initReactI18next)
    .init({
      resources: TRANSLATION_RESOURCES,
      lng: savedLanguage,
      fallbackLng: LANGUAGES.ENGLISH,
      
      // Namespace configuration
      defaultNS: 'translation',
      ns: ['translation'],
      
      // Interpolation configuration
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      
      // React configuration
      react: {
        useSuspense: false, // Disable suspense for React Native
      },
      
      // Debug in development
      debug: __DEV__,
      
      // Cache configuration
      cache: {
        enabled: true,
      },
      
      // Detection configuration
      detection: {
        order: ['asyncStorage'],
        caches: ['asyncStorage'],
        asyncStorage: AsyncStorage,
      },
    });

  return i18n;
};

// Initialize i18n
initI18n().catch(error => {
  console.error('Failed to initialize i18n:', error);
});

// ===== UTILITY FUNCTIONS =====

// Get current language info
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language || LANGUAGES.ENGLISH;
  return getLanguageConfig(currentLang);
};

// Check if current language is RTL
export const isCurrentLanguageRTL = () => {
  const currentLang = i18n.language || LANGUAGES.ENGLISH;
  return isRTL(currentLang);
};

// Get available languages for selection
export const getAvailableLanguages = () => {
  return Object.values(LANGUAGES).map(code => ({
    code,
    ...getLanguageConfig(code),
  }));
};

// Enhanced translation helper with comprehensive fallback system
export const safeTranslate = (t, key, fallback, options = {}) => {
  try {
    const translation = t(key, options);
    // Check if translation exists and is not the key itself
    if (translation && translation !== key && translation.trim() !== '') {
      return translation;
    }
    console.warn(`Translation missing or empty for key: ${key}`);
    return fallback || key;
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error);
    return fallback || key;
  }
};

// Translation helper with fallback (legacy support)
export const t = (key, options = {}) => {
  try {
    return i18n.t(key, options);
  } catch (error) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
};

export default i18n;
