/**
 * BLONG Enhanced Profile Steps
 * Optimized 3-step profile completion flow with improved UX
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Input, Button, Card, Text as UIText } from '../ui';
import { a11y } from '../../utils/AccessibilityUtils';
import GenderSelector from './GenderSelector';
import BirthdayPicker from './BirthdayPicker';

// Design system colors
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
  error: '#F44336',
};

// Common option selector component
const OptionSelector = ({ 
  title, 
  options, 
  selectedValue, 
  onSelect, 
  multiSelect = false,
  required = false,
  accessibilityLabel 
}) => {
  const handleSelect = async (value) => {
    if (Haptics?.impactAsync) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (multiSelect) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onSelect(newValues);
    } else {
      onSelect(value);
    }
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <UIText.Label style={{ marginBottom: 12 }}>
        {title}
        {required && <Text style={{ color: COLORS.error }}> *</Text>}
      </UIText.Label>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((option) => {
          const isSelected = multiSelect 
            ? Array.isArray(selectedValue) && selectedValue.includes(option.value)
            : selectedValue === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSelect(option.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: isSelected ? COLORS.accent : COLORS.border,
                backgroundColor: isSelected ? `${COLORS.accent}10` : COLORS.background,
                minWidth: 80,
                alignItems: 'center',
                ...a11y.touchTarget.getStyles(),
              }}
              accessibilityRole="button"
              accessibilityLabel={`${accessibilityLabel || title}: ${option.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={{
                fontSize: 14,
                color: isSelected ? COLORS.accent : COLORS.text,
                fontWeight: isSelected ? '500' : '400',
                textAlign: 'center',
              }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Step 1: Essential Information
export const EssentialsStep = ({ 
  profileData, 
  onInputChange, 
  handleDateChange, 
  showDatePicker = false, 
  setShowDatePicker = () => {} 
}) => {
  // Enhanced debugging for development - can be removed in production
  useEffect(() => {
    if (__DEV__) {
      console.log('🔍 DatePicker state:', showDatePicker, 'Platform:', Platform.OS);
    }
  }, [showDatePicker]);

  // Gender options are now handled by the GenderSelector component

  const handleLocationChange = (field, value) => {
    onInputChange('location', {
      ...profileData.location,
      [field]: value
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={{ marginBottom: 24 }}>
        <UIText.H5 style={{ marginBottom: 16, color: COLORS.accent }}>
          Let's start with the basics
        </UIText.H5>
        
        <UIText.Body2 style={{ marginBottom: 24, color: COLORS.textSecondary }}>
          This information helps us create your profile and find compatible matches.
        </UIText.Body2>

        {/* Date of Birth */}
        <BirthdayPicker
          value={profileData.dateOfBirth}
          onDateChange={(date) => onInputChange('dateOfBirth', date)}
          required={true}
        />

        {/* Gender Selection */}
        <GenderSelector
          value={profileData.gender}
          onSelect={(value) => onInputChange('gender', value)}
          required={true}
        />
      </Card>

      <Card>
        <UIText.H6 style={{ marginBottom: 16, color: COLORS.accent }}>
          Your Location
        </UIText.H6>
        
        <UIText.Body2 style={{ marginBottom: 20, color: COLORS.textSecondary }}>
          We use this to find matches in your area.
        </UIText.Body2>

        <Input
          label="Country"
          value={profileData.location.country}
          onChangeText={(value) => handleLocationChange('country', value)}
          placeholder="Enter your country"
          required
          style={{ marginBottom: 16 }}
        />

        <Input
          label="City"
          value={profileData.location.city}
          onChangeText={(value) => handleLocationChange('city', value)}
          placeholder="Enter your city"
          required
          style={{ marginBottom: 16 }}
        />

        <Input
          label="District (Optional)"
          value={profileData.location.district}
          onChangeText={(value) => handleLocationChange('district', value)}
          placeholder="Enter your district"
        />
      </Card>

      {/* Date picker is now rendered in parent component for proper positioning */}
    </ScrollView>
  );
};

// Step 2: About You - Personal and Professional Information
export const PreferencesStep = ({ profileData, onInputChange }) => {
  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'separated', label: 'Separated' },
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const childrenWantOptions = [
    { value: 'yes', label: 'Yes, I want children' },
    { value: 'no', label: 'No, I don\'t want children' },
    { value: 'maybe', label: 'Maybe/Undecided' },
    { value: 'already-have', label: 'I already have children and that\'s enough' },
  ];

  const smokingOptions = [
    { value: 'never', label: 'Never' },
    { value: 'occasionally', label: 'Occasionally' },
    { value: 'regularly', label: 'Regularly' },
    { value: 'trying-to-quit', label: 'Trying to quit' },
  ];

  const drinkingOptions = [
    { value: 'never', label: 'Never' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'socially', label: 'Socially' },
    { value: 'regularly', label: 'Regularly' },
  ];

  const educationOptions = [
    { value: 'high-school', label: 'High School' },
    { value: 'some-college', label: 'Some College' },
    { value: 'bachelors', label: 'Bachelor\'s Degree' },
    { value: 'masters', label: 'Master\'s Degree' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'trade-school', label: 'Trade School' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={{ marginBottom: 24 }}>
        <UIText.H5 style={{ marginBottom: 16, color: COLORS.accent }}>
          Professional Background
        </UIText.H5>

        <UIText.Body2 style={{ marginBottom: 24, color: COLORS.textSecondary }}>
          Tell us about your career and education.
        </UIText.Body2>

        <Input
          label="Occupation"
          value={profileData.occupation}
          onChangeText={(value) => onInputChange('occupation', value)}
          placeholder="What do you do for work?"
          style={{ marginBottom: 20 }}
        />

        <OptionSelector
          title="Education Level"
          options={educationOptions}
          selectedValue={profileData.education}
          onSelect={(value) => onInputChange('education', value)}
          accessibilityLabel="Education level"
        />
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <UIText.H5 style={{ marginBottom: 16, color: COLORS.accent }}>
          Personal Information
        </UIText.H5>

        <UIText.Body2 style={{ marginBottom: 24, color: COLORS.textSecondary }}>
          Help us understand your current situation and preferences.
        </UIText.Body2>

        <OptionSelector
          title="Current Marital Status"
          options={maritalStatusOptions}
          selectedValue={profileData.maritalStatus}
          onSelect={(value) => onInputChange('maritalStatus', value)}
          accessibilityLabel="Marital status"
        />
      </Card>

      <Card>
        <UIText.H6 style={{ marginBottom: 16, color: COLORS.accent }}>
          Lifestyle Preferences
        </UIText.H6>

        <UIText.Body2 style={{ marginBottom: 20, color: COLORS.textSecondary }}>
          These help us find compatible matches.
        </UIText.Body2>

        <OptionSelector
          title="Smoking"
          options={smokingOptions}
          selectedValue={profileData.smoking}
          onSelect={(value) => onInputChange('smoking', value)}
          accessibilityLabel="Smoking preference"
        />

        <OptionSelector
          title="Drinking"
          options={drinkingOptions}
          selectedValue={profileData.drinking}
          onSelect={(value) => onInputChange('drinking', value)}
          accessibilityLabel="Drinking preference"
        />
      </Card>
    </ScrollView>
  );
};

// Step 3: Complete Your Profile - Final Details
export const DetailsStep = ({ profileData, onInputChange }) => {
  const interestOptions = [
    { value: 'travel', label: 'Travel' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'music', label: 'Music' },
    { value: 'movies', label: 'Movies' },
    { value: 'reading', label: 'Reading' },
    { value: 'sports', label: 'Sports' },
    { value: 'art', label: 'Art' },
    { value: 'technology', label: 'Technology' },
    { value: 'nature', label: 'Nature' },
    { value: 'photography', label: 'Photography' },
    { value: 'gaming', label: 'Gaming' },
  ];

  const languageOptions = [
    { value: 'arabic', label: 'Arabic' },
    { value: 'english', label: 'English' },
    { value: 'french', label: 'French' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'mandarin', label: 'Mandarin' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={{ marginBottom: 24 }}>
        <UIText.H5 style={{ marginBottom: 16, color: COLORS.accent }}>
          Physical Details
        </UIText.H5>

        <UIText.Body2 style={{ marginBottom: 24, color: COLORS.textSecondary }}>
          Optional information to help with compatibility.
        </UIText.Body2>

        <Input
          label="Height (cm)"
          value={profileData.height}
          onChangeText={(value) => {
            // Only allow numbers
            const numericValue = value.replace(/[^0-9]/g, '');
            onInputChange('height', numericValue);
          }}
          placeholder="175"
          keyboardType="numeric"
          style={{ marginBottom: 20 }}
        />
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <UIText.H5 style={{ marginBottom: 16, color: COLORS.accent }}>
          Interests & Hobbies
        </UIText.H5>

        <UIText.Body2 style={{ marginBottom: 20, color: COLORS.textSecondary }}>
          Select your interests to help us find compatible matches.
        </UIText.Body2>

        <OptionSelector
          title="Your Interests"
          options={interestOptions}
          selectedValue={profileData.interests}
          onSelect={(value) => onInputChange('interests', value)}
          multiSelect={true}
          accessibilityLabel="Interests selection"
        />
      </Card>

      <Card>
        <UIText.H6 style={{ marginBottom: 16, color: COLORS.accent }}>
          Languages
        </UIText.H6>

        <UIText.Body2 style={{ marginBottom: 20, color: COLORS.textSecondary }}>
          What languages do you speak?
        </UIText.Body2>

        <OptionSelector
          title="Languages I Speak"
          options={languageOptions}
          selectedValue={profileData.languages}
          onSelect={(value) => onInputChange('languages', value)}
          multiSelect={true}
          accessibilityLabel="Languages selection"
        />
      </Card>
    </ScrollView>
  );
};