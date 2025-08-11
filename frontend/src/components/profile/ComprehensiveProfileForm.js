/**
 * BLONG Comprehensive Profile Form Component
 * Enhanced profile data collection with comprehensive fields
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FormInput, FormDropdown, FormDatePicker } from './FormComponents';
import { GeolocationInput } from './GeolocationInput';

// ALWAYS include COLORS constant - BLONG Design System
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
  warning: '#FF9800',
};

export const ComprehensiveProfileForm = ({ 
  profileData = {}, 
  onProfileChange,
  currentSection = 'basic'
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    physical: false,
    personality: false,
    education: false,
    lifestyle: false,
    values: false,
    family: false,
    relationships: false,
    future: false,
    preferences: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value) => {
    onProfileChange({
      ...profileData,
      [field]: value
    });
  };

  const renderSectionHeader = (title, icon, section, subtitle) => (
    <TouchableOpacity
      onPress={() => toggleSection(section)}
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginRight: 16 }}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 4,
          }}>
            {title}
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 20,
          }}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Text style={{
        fontSize: 16,
        color: COLORS.accent,
        fontWeight: '300',
      }}>
        {expandedSections[section] ? '−' : '+'}
      </Text>
    </TouchableOpacity>
  );

  const renderBasicInformation = () => (
    <View>
      {renderSectionHeader(
        'Basic Information',
        '👤',
        'basic',
        'Essential details about you'
      )}
      {expandedSections.basic && (
        <View style={{ marginBottom: 24 }}>
          <FormInput
            label="Bio"
            value={profileData.bio || ''}
            onChangeText={(value) => handleInputChange('bio', value)}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
          />

          <FormInput
            label="Height (cm)"
            value={profileData.height?.toString() || ''}
            onChangeText={(value) => handleInputChange('height', parseInt(value) || null)}
            placeholder="170"
            keyboardType="numeric"
          />

          <FormInput
            label="Weight (kg)"
            value={profileData.weight?.toString() || ''}
            onChangeText={(value) => handleInputChange('weight', parseInt(value) || null)}
            placeholder="70"
            keyboardType="numeric"
          />
        </View>
      )}
    </View>
  );

  const renderPhysicalAttributes = () => (
    <View>
      {renderSectionHeader(
        'Physical Attributes',
        '🎨',
        'physical',
        'Your physical characteristics'
      )}
      {expandedSections.physical && (
        <View style={{ marginBottom: 24 }}>
          <FormDropdown
            label="Body Type"
            value={profileData.bodyType || ''}
            onSelect={(value) => handleInputChange('bodyType', value)}
            options={[
              { label: 'Slim', value: 'slim' },
              { label: 'Athletic', value: 'athletic' },
              { label: 'Average', value: 'average' },
              { label: 'Curvy', value: 'curvy' },
              { label: 'Heavy', value: 'heavy' }
            ]}
            placeholder="Select body type"
          />

          <FormDropdown
            label="Skin Tone"
            value={profileData.skinTone || ''}
            onSelect={(value) => handleInputChange('skinTone', value)}
            options={[
              { label: 'Fair', value: 'fair' },
              { label: 'Light', value: 'light' },
              { label: 'Medium', value: 'medium' },
              { label: 'Olive', value: 'olive' },
              { label: 'Dark', value: 'dark' },
              { label: 'Deep', value: 'deep' }
            ]}
            placeholder="Select skin tone"
          />

          <FormDropdown
            label="Eye Color"
            value={profileData.eyeColor || ''}
            onSelect={(value) => handleInputChange('eyeColor', value)}
            options={[
              { label: 'Brown', value: 'brown' },
              { label: 'Blue', value: 'blue' },
              { label: 'Green', value: 'green' },
              { label: 'Hazel', value: 'hazel' },
              { label: 'Gray', value: 'gray' },
              { label: 'Amber', value: 'amber' }
            ]}
            placeholder="Select eye color"
          />

          <FormDropdown
            label="Hair Color"
            value={profileData.hairColor || ''}
            onSelect={(value) => handleInputChange('hairColor', value)}
            options={[
              { label: 'Black', value: 'black' },
              { label: 'Brown', value: 'brown' },
              { label: 'Blonde', value: 'blonde' },
              { label: 'Red', value: 'red' },
              { label: 'Gray', value: 'gray' },
              { label: 'White', value: 'white' },
              { label: 'Other', value: 'other' }
            ]}
            placeholder="Select hair color"
          />
        </View>
      )}
    </View>
  );

  const renderPersonalitySection = () => (
    <View>
      {renderSectionHeader(
        'Personality & Traits',
        '🧠',
        'personality',
        'Your personality and characteristics'
      )}
      {expandedSections.personality && (
        <View style={{ marginBottom: 24 }}>
          <FormDropdown
            label="Personality Type"
            value={profileData.personalityType || ''}
            onSelect={(value) => handleInputChange('personalityType', value)}
            options={[
              { label: 'INTJ - The Architect', value: 'INTJ' },
              { label: 'INTP - The Thinker', value: 'INTP' },
              { label: 'ENTJ - The Commander', value: 'ENTJ' },
              { label: 'ENTP - The Debater', value: 'ENTP' },
              { label: 'INFJ - The Advocate', value: 'INFJ' },
              { label: 'INFP - The Mediator', value: 'INFP' },
              { label: 'ENFJ - The Protagonist', value: 'ENFJ' },
              { label: 'ENFP - The Campaigner', value: 'ENFP' },
              { label: 'ISTJ - The Logistician', value: 'ISTJ' },
              { label: 'ISFJ - The Protector', value: 'ISFJ' },
              { label: 'ESTJ - The Executive', value: 'ESTJ' },
              { label: 'ESFJ - The Consul', value: 'ESFJ' },
              { label: 'ISTP - The Virtuoso', value: 'ISTP' },
              { label: 'ISFP - The Adventurer', value: 'ISFP' },
              { label: 'ESTP - The Entrepreneur', value: 'ESTP' },
              { label: 'ESFP - The Entertainer', value: 'ESFP' }
            ]}
            placeholder="Select personality type"
          />

          <FormDropdown
            label="Zodiac Sign"
            value={profileData.zodiacSign || ''}
            onSelect={(value) => handleInputChange('zodiacSign', value)}
            options={[
              { label: 'Aries', value: 'aries' },
              { label: 'Taurus', value: 'taurus' },
              { label: 'Gemini', value: 'gemini' },
              { label: 'Cancer', value: 'cancer' },
              { label: 'Leo', value: 'leo' },
              { label: 'Virgo', value: 'virgo' },
              { label: 'Libra', value: 'libra' },
              { label: 'Scorpio', value: 'scorpio' },
              { label: 'Sagittarius', value: 'sagittarius' },
              { label: 'Capricorn', value: 'capricorn' },
              { label: 'Aquarius', value: 'aquarius' },
              { label: 'Pisces', value: 'pisces' }
            ]}
            placeholder="Select zodiac sign"
          />

          <FormDropdown
            label="Humor Style"
            value={profileData.humorStyle || ''}
            onSelect={(value) => handleInputChange('humorStyle', value)}
            options={[
              { label: 'Witty & Sarcastic', value: 'witty' },
              { label: 'Playful & Silly', value: 'playful' },
              { label: 'Dry & Deadpan', value: 'dry' },
              { label: 'Warm & Gentle', value: 'warm' },
              { label: 'Intellectual', value: 'intellectual' },
              { label: 'Physical Comedy', value: 'physical' }
            ]}
            placeholder="Select humor style"
          />
        </View>
      )}
    </View>
  );

  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {renderBasicInformation()}
      {renderPhysicalAttributes()}
      {renderPersonalitySection()}
      
      {/* Add more sections as needed */}
    </ScrollView>
  );
};

export default ComprehensiveProfileForm;
