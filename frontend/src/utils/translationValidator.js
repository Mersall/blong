/**
 * BLONG Translation Validator
 * Utility to validate translation completeness across all languages
 */

import enTranslations from '../localization/translations/en';
import arTranslations from '../localization/translations/ar';
import frTranslations from '../localization/translations/fr';
import esTranslations from '../localization/translations/es';

const translations = {
  en: enTranslations,
  ar: arTranslations,
  fr: frTranslations,
  es: esTranslations,
};

/**
 * Get all translation keys from an object recursively
 */
function getTranslationKeys(obj, prefix = '') {
  const keys = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(...getTranslationKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }

  return keys;
}

/**
 * Check if a key exists in a translation object
 */
function hasTranslationKey(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && current.hasOwnProperty(key)) {
      current = current[key];
    } else {
      return false;
    }
  }

  return typeof current === 'string';
}

/**
 * Validate translation completeness
 */
export function validateTranslations() {
  const results = {
    isValid: true,
    missingKeys: {},
    extraKeys: {},
    summary: {},
  };

  // Get all keys from English (reference language)
  const englishKeys = getTranslationKeys(translations.en);

  // Check each language against English
  Object.keys(translations).forEach(lang => {
    if (lang === 'en') return; // Skip English as it's the reference

    const missingInLang = [];
    const extraInLang = [];

    // Check for missing keys
    englishKeys.forEach(key => {
      if (!hasTranslationKey(translations[lang], key)) {
        missingInLang.push(key);
      }
    });

    // Check for extra keys
    const langKeys = getTranslationKeys(translations[lang]);
    langKeys.forEach(key => {
      if (!hasTranslationKey(translations.en, key)) {
        extraInLang.push(key);
      }
    });

    if (missingInLang.length > 0) {
      results.isValid = false;
      results.missingKeys[lang] = missingInLang;
    }

    if (extraInLang.length > 0) {
      results.extraKeys[lang] = extraInLang;
    }

    results.summary[lang] = {
      totalKeys: langKeys.length,
      missingKeys: missingInLang.length,
      extraKeys: extraInLang.length,
      completeness: ((langKeys.length - missingInLang.length) / englishKeys.length * 100).toFixed(1),
    };
  });

  results.summary.en = {
    totalKeys: englishKeys.length,
    missingKeys: 0,
    extraKeys: 0,
    completeness: '100.0',
  };

  return results;
}

/**
 * Get translation statistics
 */
export function getTranslationStats() {
  const stats = {};

  Object.keys(translations).forEach(lang => {
    const keys = getTranslationKeys(translations[lang]);
    stats[lang] = {
      totalKeys: keys.length,
      sections: Object.keys(translations[lang]).length,
    };
  });

  return stats;
}

/**
 * Find missing translations for new components
 */
export function findMissingForComponents(componentKeys) {
  const missing = {};

  Object.keys(translations).forEach(lang => {
    const missingInLang = [];

    componentKeys.forEach(key => {
      if (!hasTranslationKey(translations[lang], key)) {
        missingInLang.push(key);
      }
    });

    if (missingInLang.length > 0) {
      missing[lang] = missingInLang;
    }
  });

  return missing;
}

/**
 * Validate specific translation keys
 */
export function validateKeys(keys) {
  const results = {};

  Object.keys(translations).forEach(lang => {
    const missing = keys.filter(key => !hasTranslationKey(translations[lang], key));
    if (missing.length > 0) {
      results[lang] = missing;
    }
  });

  return results;
}

// Export for testing
export { getTranslationKeys, hasTranslationKey };