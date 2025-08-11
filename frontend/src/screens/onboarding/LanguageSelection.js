/**
 * BLONG Elite Language Selection Screen
 * Sophisticated language selection with premium design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  I18nManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp, useTheme, useRTL } from '../../contexts/AppContext';
import { safeTranslate } from '../../localization/i18n';
import { AppTransition } from '../../components/AppTransition';
import styles from './styles/LanguageSelectionStyles';

// Languages will be loaded from translation system

const LanguageSelection = ({ onLanguageSelect }) => {
  const {
    t,
    availableLanguages,
    changeLanguage,
    isTransitioning
  } = useApp();
  const { colors } = useTheme();
  const { isRTL, rtlStyles } = useRTL();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    if (selectedLanguage && onLanguageSelect) {
      // Change the app language using context
      changeLanguage(selectedLanguage.code);
      onLanguageSelect(selectedLanguage);
    }
  };

  // RTL styles are now defined above

  return (
    <AppTransition>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Elite Header */}
      <View style={styles.header}>
        <Text style={[styles.brandText, rtlStyles.brandText]}>
          {t('onboarding.brand')}
        </Text>

        <View style={[styles.brandUnderline, rtlStyles.brandUnderline]} />

        <Text style={styles.title}>
          {t('onboarding.languageTitle')}
        </Text>

        <Text style={styles.subtitle}>
          {t('onboarding.languageSubtitle')}
        </Text>
      </View>

      {/* Language Options - Scrollable */}
      <ScrollView
        style={styles.languageContainer}
        contentContainerStyle={styles.languageScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageCard,
              rtlStyles.languageCard,
              selectedLanguage?.code === language.code
                ? styles.languageCardSelected
                : styles.languageCardDefault
            ]}
            onPress={() => handleLanguageSelect(language)}
          >
            <Text style={{
              fontSize: 28,
              marginRight: 16,
            }}>
              {language.flag}
            </Text>

            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: colors.text,
                marginBottom: 3,
              }}>
                {language.name}
              </Text>

              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 1,
              }}>
                {language.nativeName}
              </Text>

              <Text style={{
                fontSize: 11,
                color: colors.textTertiary,
              }}>
                {safeTranslate(t, `onboarding.languages.${language.code}.description`, `${language.name} language`)}
              </Text>
            </View>
            
            {selectedLanguage?.code === language.code && (
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: colors.accent,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{
                  color: colors.background,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                  ✓
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button - Fixed positioning */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        paddingHorizontal: 32,
        paddingBottom: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        zIndex: 1000,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedLanguage ? colors.text : colors.border,
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: 'center',
            opacity: selectedLanguage ? 1 : 0.5,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={handleContinue}
          disabled={!selectedLanguage || isTransitioning}
        >
          <Text style={{
            color: colors.background,
            fontSize: 16,
            fontWeight: '500',
            letterSpacing: 1,
          }}>
            {isTransitioning 
              ? safeTranslate(t, 'common.changing', 'CHANGING...') 
              : safeTranslate(t, 'common.continue', 'CONTINUE')}
          </Text>
        </TouchableOpacity>

        <Text style={{
          fontSize: 12,
          color: colors.textTertiary,
          textAlign: 'center',
          marginTop: 16,
          letterSpacing: 1,
        }}>
          {t('onboarding.languageFooter')}
        </Text>
      </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default LanguageSelection;
