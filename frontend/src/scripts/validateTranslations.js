/**
 * BLONG Translation Validation Script
 * Run this script to validate translation completeness
 */

const { validateTranslations, getTranslationStats } = require('../utils/translationValidator');

function runValidation() {
  console.log('🌍 BLONG Translation Validation Report');
  console.log('=====================================\n');

  // Get translation statistics
  const stats = getTranslationStats();
  console.log('📊 Translation Statistics:');
  Object.entries(stats).forEach(([lang, data]) => {
    const flag = {
      en: '🇺🇸',
      ar: '🇸🇦',
      fr: '🇫🇷',
      es: '🇪🇸',
    }[lang] || '🏳️';

    console.log(`${flag} ${lang.toUpperCase()}: ${data.totalKeys} keys, ${data.sections} sections`);
  });

  console.log('\n🔍 Validation Results:');

  // Validate translations
  const validation = validateTranslations();

  if (validation.isValid) {
    console.log('✅ All translations are complete!');
  } else {
    console.log('❌ Missing translations found:');

    Object.entries(validation.missingKeys).forEach(([lang, keys]) => {
      const flag = {
        ar: '🇸🇦',
        fr: '🇫🇷',
        es: '🇪🇸',
      }[lang] || '🏳️';

      console.log(`\n${flag} ${lang.toUpperCase()} - Missing ${keys.length} keys:`);
      keys.forEach(key => console.log(`  - ${key}`));
    });
  }

  console.log('\n📈 Completeness Summary:');
  Object.entries(validation.summary).forEach(([lang, data]) => {
    const flag = {
      en: '🇺🇸',
      ar: '🇸🇦',
      fr: '🇫🇷',
      es: '🇪🇸',
    }[lang] || '🏳️';

    const status = data.completeness === '100.0' ? '✅' : '⚠️';
    console.log(`${flag} ${lang.toUpperCase()}: ${data.completeness}% complete ${status}`);
  });

  // Check for extra keys
  if (Object.keys(validation.extraKeys).length > 0) {
    console.log('\n⚠️ Extra keys found (not in English):');
    Object.entries(validation.extraKeys).forEach(([lang, keys]) => {
      const flag = {
        ar: '🇸🇦',
        fr: '🇫🇷',
        es: '🇪🇸',
      }[lang] || '🏳️';

      console.log(`\n${flag} ${lang.toUpperCase()} - Extra ${keys.length} keys:`);
      keys.forEach(key => console.log(`  + ${key}`));
    });
  }

  console.log('\n🎯 New Component Keys Validation:');

  // Validate specific keys for new components
  const newComponentKeys = [
    'network.online',
    'network.offline',
    'network.processingQueue',
    'success.profileUpdated',
    'success.quizCompleted',
    'success.dateBooked',
    'photoUpload.selectPhoto',
    'photoUpload.processing',
    'compatibility.score',
    'compatibility.breakdown',
    'compatibility.insights',
    'common.notNow',
    'common.viewDetails',
  ];

  const { validateKeys } = require('../utils/translationValidator');
  const missingNewKeys = validateKeys(newComponentKeys);

  if (Object.keys(missingNewKeys).length === 0) {
    console.log('✅ All new component keys are translated!');
  } else {
    console.log('❌ Missing new component keys:');
    Object.entries(missingNewKeys).forEach(([lang, keys]) => {
      const flag = {
        ar: '🇸🇦',
        fr: '🇫🇷',
        es: '🇪🇸',
      }[lang] || '🏳️';

      console.log(`${flag} ${lang.toUpperCase()}: ${keys.join(', ')}`);
    });
  }

  console.log('\n🏁 Validation Complete!');

  return validation.isValid;
}

// Run validation if this script is executed directly
if (require.main === module) {
  const isValid = runValidation();
  process.exit(isValid ? 0 : 1);
}

module.exports = { runValidation };