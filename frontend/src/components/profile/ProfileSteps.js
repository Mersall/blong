/**
 * BLONG Profile Completion Steps
 * Individual step components for profile completion flow
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormInput, FormDropdown, FormDatePicker, FormMultiSelect } from './FormComponents';
import { GeolocationInput } from './GeolocationInput';

// Export the new enhanced steps
export { EssentialsStep, PreferencesStep, DetailsStep } from './EnhancedProfileSteps';

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
};

// Step 1: Basic Information
export const BasicInfoStep = ({
  profileData,
  onInputChange,
  handleDateChange
}) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        {t('profile.completion.basicInfoSubtitle')}. Your name was already collected during registration.
      </Text>

      <FormDatePicker
        label={t('profile.form.dateOfBirth')}
        required={false}
        value={profileData.dateOfBirth}
        onDateChange={handleDateChange}
      />

      <FormDropdown
        label={t('profile.form.gender')}
        required
        value={profileData.gender}
        onSelect={(value) => onInputChange('gender', value)}
        options={[t('profile.form.male'), t('profile.form.female')]}
        placeholder={t('profile.form.genderPlaceholder')}
      />
    </View>
  );
};

// Step 2: Location
export const LocationStep = ({ profileData, onInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        {t('profile.completion.locationSubtitle')}. This helps us find better date venues near you.
      </Text>

      <GeolocationInput
        values={profileData.location || {}}
        onLocationChange={(locationData) => onInputChange('location', locationData)}
        required={true}
      />
    </View>
  );
};

// Step 3: Physical Details - SIMPLIFIED
export const PhysicalStep = ({ profileData, onInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        {t('profile.completion.physicalSubtitle')}.
      </Text>

      <FormInput
        label={t('profile.form.height')}
        required={false}
        value={profileData.height}
        onChangeText={(value) => {
          // Only allow numbers
          const numericValue = value.replace(/[^0-9]/g, '');
          onInputChange('height', numericValue);
        }}
        placeholder={t('profile.form.heightPlaceholder')}
        keyboardType="numeric"
      />
    </View>
  );
};

// Step 4: Professional Life - SIMPLIFIED
export const ProfessionalStep = ({ profileData, onInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        {t('profile.completion.professionalSubtitle')}.
      </Text>

      <FormInput
        label={t('profile.form.occupation')}
        required={false}
        value={profileData.occupation}
        onChangeText={(value) => onInputChange('occupation', value)}
        placeholder={t('profile.form.occupationPlaceholder')}
      />
    </View>
  );
};

// Step 5: Personal Background - SIMPLIFIED 
export const PersonalStep = ({ profileData, onInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        {t('profile.completion.personalSubtitle')}.
      </Text>

      <FormDropdown
        label={t('profile.form.maritalStatus')}
        required={false}
        value={profileData.maritalStatus}
        onSelect={(value) => onInputChange('maritalStatus', value)}
        options={[t('profile.form.single'), t('profile.form.divorced'), t('profile.form.widowed'), t('profile.form.separated')]}
        placeholder={t('profile.form.maritalStatusPlaceholder')}
      />
    </View>
  );
};

// Step 6: Interests & Culture - SIMPLIFIED
export const AdditionalStep = ({ profileData, onInputChange }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        {t('profile.completion.additionalSubtitle')}. Skip if you prefer to complete later.
      </Text>

      <FormMultiSelect
        label={t('profile.form.interests')}
        required={false}
        value={profileData.interests}
        onSelectionChange={(value) => onInputChange('interests', value)}
        options={[
          t('profile.form.travel'), t('profile.form.reading'), t('profile.form.sports'), 
          t('profile.form.music'), t('profile.form.movies'), t('profile.form.cooking'), 
          t('profile.form.art'), t('profile.form.photography'), t('profile.form.dancing'), 
          t('profile.form.hiking'), t('profile.form.fitness'), t('profile.form.gaming'), 
          t('profile.form.technology'), t('profile.form.fashion'), t('profile.form.food')
        ]}
        placeholder={t('profile.form.interestsPlaceholder')}
      />
    </View>
  );
};

// Salary Range Component
const SalaryRangeInput = ({ label, value = [30000, 100000], onValueChange }) => {
  const formatSalaryRange = (range) => {
    return `$${range[0].toLocaleString()} - $${range[1].toLocaleString()}`;
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: 0.5
      }}>
        {label}
      </Text>
      
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 56,
        justifyContent: 'center'
      }}>
        <Text style={{
          fontSize: 16,
          color: COLORS.text,
        }}>
          {formatSalaryRange(value)}
        </Text>
      </View>
      
      <Text style={{
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 8,
      }}>
        Salary range is kept private and used only for date recommendations
      </Text>
    </View>
  );
};
