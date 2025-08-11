/**
 * BLONG Preferences Screen - Premium Elite Design
 * Language and relationship phase settings
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import apiService from '../../services/apiService';

// MANDATORY COLORS - Following Design Rules
const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
};

const PreferencesScreen = ({ userPreferences, onBack, onUpdatePreferences }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(userPreferences?.language || 'en');
  const [selectedPhase, setSelectedPhase] = useState(userPreferences?.phase?.id || 'single');

  const [isSaving, setIsSaving] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [phases, setPhases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load languages and phases from database - REPLACES hardcoded arrays
  useEffect(() => {
    const loadPreferencesData = async () => {
      try {
        setIsLoading(true);
        console.log('🌐 Loading languages and phases from database...');

        // Fetch languages and phases from database
        const [languagesData, phasesData] = await Promise.all([
          apiService.getLanguages(),
          apiService.getPhases()
        ]);

        // Transform database data to match UI format
        const formattedLanguages = languagesData.map(lang => ({
          id: lang.code,
          title: lang.name,
          flag: lang.flag,
          nativeName: lang.nativeName,
        }));

        const formattedPhases = phasesData.map(phase => ({
          id: phase.code,
          title: phase.name,
          subtitle: phase.description,
          icon: phase.icon,
        }));

        setLanguages(formattedLanguages);
        setPhases(formattedPhases);

        console.log(`✅ Loaded ${formattedLanguages.length} languages and ${formattedPhases.length} phases from database`);
      } catch (error) {
        console.error('❌ Error loading preferences data from database:', error);

        // Fallback to hardcoded data if database fails
        setLanguages([
          { id: 'en', title: 'English', flag: '🇺🇸' },
          { id: 'es', title: 'Español', flag: '🇪🇸' },
          { id: 'fr', title: 'Français', flag: '🇫🇷' },
          { id: 'ar', title: 'العربية', flag: '🇸🇦' },
        ]);

        setPhases([
          {
            id: 'single',
            title: 'Single',
            subtitle: 'Looking for a life partner',
            icon: '💝'
          },
          {
            id: 'engagement',
            title: 'Engagement',
            subtitle: 'Planning engagement activities',
            icon: '💍'
          },
          {
            id: 'engagement_day_prep',
            title: 'Engagement Day Prep',
            subtitle: 'Preparing for the big day',
            icon: '✨'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferencesData();
  }, []);



  const handleSave = async () => {
    setIsSaving(true);
    try {
      const selectedPhaseData = phases.find(p => p.id === selectedPhase);
      const selectedLanguageData = languages.find(l => l.id === selectedLanguage);
      
      const newPreferences = {
        language: selectedLanguage,
        languageData: selectedLanguageData,
        phase: selectedPhaseData,
      };

      await onUpdatePreferences(newPreferences);
      Alert.alert('Success', 'Preferences updated successfully');
      onBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const OptionSection = ({ title, options, selectedValue, onSelect, keyField = 'id' }) => (
    <View style={{ marginBottom: 32 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 16,
        letterSpacing: 0.5,
      }}>
        {title}
      </Text>

      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
      }}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option[keyField]}
            onPress={() => onSelect(option[keyField])}
            style={{
              padding: 20,
              borderBottomWidth: index < options.length - 1 ? 1 : 0,
              borderBottomColor: COLORS.border,
              backgroundColor: selectedValue === option[keyField] ? COLORS.accent + '10' : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, marginRight: 16 }}>{option.icon || option.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '300',
                  color: COLORS.text,
                  marginBottom: option.subtitle ? 4 : 0,
                }}>
                  {option.title}
                </Text>
                {option.subtitle && (
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    lineHeight: 16,
                  }}>
                    {option.subtitle}
                  </Text>
                )}
              </View>
              {selectedValue === option[keyField] && (
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: COLORS.accent,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 12, color: COLORS.background }}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header */}
        <View style={{
          paddingTop: 20,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
              <Text style={{ fontSize: 18, color: COLORS.accent }}>←</Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Preferences
            </Text>
            
            <TouchableOpacity 
              onPress={handleSave}
              disabled={isSaving}
              style={{ 
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: COLORS.accent,
                borderRadius: 6,
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.background,
                letterSpacing: 0.5,
              }}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60,
            }}>
              <Text style={{
                fontSize: 16,
                color: COLORS.textSecondary,
                textAlign: 'center',
              }}>
                Loading preferences from database...
              </Text>
            </View>
          ) : (
            <>
              <OptionSection
                title="Language"
                options={languages}
                selectedValue={selectedLanguage}
                onSelect={setSelectedLanguage}
              />

              <OptionSection
                title="Relationship Phase"
                options={phases}
                selectedValue={selectedPhase}
                onSelect={setSelectedPhase}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default PreferencesScreen;
