/**
 * BLONG Profile Completion Flow - Premium Elite Design
 * Multi-step profile completion after registration
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppTransition } from '../../components/AppTransition';
import { apiService } from '../../services/apiService';
import LocationPicker from '../../components/forms/LocationPicker';

// Professional form data options
const GENDER_OPTIONS = ['Male', 'Female'];

// Note: Location data is now handled by LocationPicker component using dynamic APIs

const MARITAL_STATUS_OPTIONS = ['Single', 'Divorced', 'Widowed', 'Separated'];

const CHILDREN_OPTIONS = ['No children', '1 child', '2 children', '3 children', '4+ children'];

const WANT_CHILDREN_OPTIONS = ['Yes, definitely', 'Yes, maybe', 'Not sure', 'No, never'];

const SMOKING_OPTIONS = ['Never', 'Occasionally', 'Socially', 'Regularly', 'Trying to quit'];

const DRINKING_OPTIONS = ['Never', 'Rarely', 'Socially', 'Regularly', 'Prefer not to say'];

const EDUCATION_LEVELS = [
  'High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
  'Doctorate (PhD)', 'Professional Degree', 'Trade/Vocational School', 'Other'
];

const RELIGIONS = [
  'Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 'Sikhism',
  'Atheist', 'Agnostic', 'Spiritual', 'Other', 'Prefer not to say'
];

const ETHNICITIES = [
  'White/Caucasian', 'Black/African American', 'Hispanic/Latino', 'Asian',
  'Middle Eastern', 'Native American', 'Pacific Islander', 'Mixed/Multiracial',
  'Other', 'Prefer not to say'
];

const INTERESTS_OPTIONS = [
  'Travel', 'Reading', 'Cooking', 'Sports', 'Music', 'Movies', 'Art', 'Photography',
  'Dancing', 'Hiking', 'Fitness', 'Gaming', 'Technology', 'Fashion', 'Food',
  'Nature', 'Animals', 'Volunteering', 'Learning', 'Business'
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Turkish', 'Other'
];

// Professional Form Components
const FormLabel = ({ text, required = false, style = {} }) => (
  <Text style={{
    fontSize: 14,
    fontWeight: '500',
    color: '#0A0A0A',
    marginBottom: 8,
    ...style
  }}>
    {text} {required && <Text style={{ color: '#FF6B35' }}>*</Text>}
  </Text>
);

const FormInput = ({ label, required, value, onChangeText, placeholder, keyboardType = 'default', multiline = false, style = {} }) => (
  <View style={{ marginBottom: 16, ...style }}>
    <FormLabel text={label} required={required} />
    <TextInput
      style={{
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
        color: '#0A0A0A',
        height: multiline ? 100 : 56,
        textAlignVertical: multiline ? 'top' : 'center',
        paddingHorizontal: 16,
      }}
      placeholder={placeholder}
      placeholderTextColor="#9E9E9E"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

// Helper function for date formatting
const formatDateDisplay = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};



const FormDatePicker = ({ label, required, value, onDateChange, showPicker, setShowPicker }) => {
  // Calculate a reasonable default date (25 years ago)
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 25);

  return (
    <View style={{ marginBottom: 16 }}>
      <FormLabel text={label} required={required} />
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{
          backgroundColor: '#FAFAFA',
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 56,
        }}
      >
        <Text style={{
          fontSize: 16,
          color: value ? '#0A0A0A' : '#9E9E9E',
        }}>
          {value ? formatDateDisplay(value) : 'Select your date of birth'}
        </Text>
        <Text style={{ fontSize: 16, color: '#6B6B6B' }}>📅</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || defaultDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1950, 0, 1)}
        />
      )}
    </View>
  );
};

const FormSalaryRange = ({ label, required, value, onValueChange }) => {
  const [showMinModal, setShowMinModal] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);

  const salaryOptions = [
    20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000,
    120000, 150000, 200000, 250000, 300000, 400000, 500000
  ];

  const formatSalaryRange = (range) => {
    return `$${range[0].toLocaleString()} - $${range[1].toLocaleString()}`;
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <FormLabel text={label} required={required} />
      <View style={{
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
      }}>
        <Text style={{
          fontSize: 14,
          color: '#6B6B6B',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          {formatSalaryRange(value)} per year
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 12, color: '#9E9E9E', marginBottom: 4 }}>Minimum</Text>
            <TouchableOpacity
              onPress={() => setShowMinModal(true)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 6,
                padding: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#0A0A0A' }}>${value[0].toLocaleString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ fontSize: 12, color: '#9E9E9E', marginBottom: 4 }}>Maximum</Text>
            <TouchableOpacity
              onPress={() => setShowMaxModal(true)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 6,
                padding: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#0A0A0A' }}>${value[1].toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Minimum Salary Modal */}
      <Modal visible={showMinModal} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 32 }}
          onPress={() => setShowMinModal(false)}
        >
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            maxHeight: 400,
          }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
              <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
                Select Minimum Salary
              </Text>
            </View>
            <ScrollView>
              {salaryOptions.filter(option => option < value[1]).map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onValueChange([option, value[1]]);
                    setShowMinModal(false);
                  }}
                  style={{
                    padding: 16,
                    borderBottomWidth: index < salaryOptions.length - 1 ? 1 : 0,
                    borderBottomColor: '#E0E0E0',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: value[0] === option ? '#FF6B35' : '#0A0A0A',
                    fontWeight: value[0] === option ? '500' : '400',
                    textAlign: 'center',
                  }}>
                    ${option.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Maximum Salary Modal */}
      <Modal visible={showMaxModal} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 32 }}
          onPress={() => setShowMaxModal(false)}
        >
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            maxHeight: 400,
          }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
              <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
                Select Maximum Salary
              </Text>
            </View>
            <ScrollView>
              {salaryOptions.filter(option => option > value[0]).map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onValueChange([value[0], option]);
                    setShowMaxModal(false);
                  }}
                  style={{
                    padding: 16,
                    borderBottomWidth: index < salaryOptions.length - 1 ? 1 : 0,
                    borderBottomColor: '#E0E0E0',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: value[1] === option ? '#FF6B35' : '#0A0A0A',
                    fontWeight: value[1] === option ? '500' : '400',
                    textAlign: 'center',
                  }}>
                    ${option.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const FormDropdown = ({ label, required, value, onSelect, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <FormLabel text={label} required={required} />
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: '#FAFAFA',
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
        }}
      >
        <Text style={{
          fontSize: 16,
          color: value ? '#0A0A0A' : '#9E9E9E',
        }}>
          {value || placeholder}
        </Text>
        <Text style={{ fontSize: 16, color: '#6B6B6B' }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 32 }}
          onPress={() => setIsOpen(false)}
        >
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            maxHeight: 400,
          }}>
            <ScrollView>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: 16,
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    borderBottomColor: '#E0E0E0',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: value === option ? '#FF6B35' : '#0A0A0A',
                    fontWeight: value === option ? '500' : '400',
                  }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const FormMultiSelect = ({ label, required, selectedItems, onSelectionChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleItem = (item) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];
    onSelectionChange(newSelection);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <FormLabel text={label} required={required} />
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: '#FAFAFA',
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          minHeight: 50,
        }}
      >
        {selectedItems.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {selectedItems.map((item, index) => (
              <View key={index} style={{
                backgroundColor: '#FF6B35',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 8,
                marginBottom: 4,
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 12 }}>{item}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 16, color: '#9E9E9E' }}>{placeholder}</Text>
        )}
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 32 }}
          onPress={() => setIsOpen(false)}
        >
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            maxHeight: 400,
          }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
              <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>
                Select {label} ({selectedItems.length} selected)
              </Text>
            </View>
            <ScrollView>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleItem(option)}
                  style={{
                    padding: 16,
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    borderBottomColor: '#E0E0E0',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: '#0A0A0A',
                  }}>
                    {option}
                  </Text>
                  {selectedItems.includes(option) && (
                    <Text style={{ color: '#FF6B35', fontSize: 18 }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={{
                padding: 16,
                backgroundColor: '#FF6B35',
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
              }}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: '500' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ProfileCompletionFlow = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    // Basic Info (skip firstName, lastName as already collected in registration)
    dateOfBirth: null,
    gender: '',

    // Enhanced Location (using LocationPicker)
    location: {
      country: null,
      region: null,
      city: null,
      postalCode: '',
      coordinates: null
    },

    // Physical Info
    height: '', // in cm
    weight: '', // in kg

    // Professional Info
    occupation: '',
    education: '',
    salaryRange: [30000, 100000], // [min, max] in USD

    // Personal Background
    maritalStatus: '',
    hasChildren: '',
    wantChildren: '',
    smoking: '',
    drinking: '',

    // Additional Info
    interests: [],
    languages: [],
    religion: '',
    ethnicity: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const steps = [
    {
      id: 'basic',
      title: 'Basic Information',
      subtitle: 'Essential details about you',
      fields: ['dateOfBirth', 'gender']
    },
    {
      id: 'location',
      title: 'Location',
      subtitle: 'Where are you located?',
      fields: ['location']
    },
    {
      id: 'physical',
      title: 'Physical Details',
      subtitle: 'Your physical characteristics',
      fields: ['height', 'weight']
    },
    {
      id: 'professional',
      title: 'Professional Life',
      subtitle: 'Your career and education',
      fields: ['occupation', 'education', 'salaryRange']
    },
    {
      id: 'personal',
      title: 'Personal Background',
      subtitle: 'Your life situation and preferences',
      fields: ['maritalStatus', 'hasChildren', 'wantChildren', 'smoking', 'drinking']
    },
    {
      id: 'additional',
      title: 'Interests & Culture',
      subtitle: 'Complete your profile',
      fields: ['interests', 'languages', 'religion', 'ethnicity']
    }
  ];

  const currentStepData = steps[currentStep];
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setProfileData(prev => ({
        ...prev,
        dateOfBirth: selectedDate
      }));
    }
  };



  const handleNext = async () => {
    // Validate current step based on step ID
    let isValid = true;
    let errorMessage = '';

    switch (currentStepData.id) {
      case 'basic':
        if (!profileData.dateOfBirth || !profileData.gender) {
          isValid = false;
          errorMessage = 'Please fill in all basic information fields.';
        }
        break;
      case 'location':
        if (!profileData.location.country || !profileData.location.city) {
          isValid = false;
          errorMessage = 'Please select your location.';
        }
        break;
      case 'physical':
        if (!profileData.height || !profileData.weight) {
          isValid = false;
          errorMessage = 'Please enter your height and weight.';
        }
        break;
      case 'professional':
        if (!profileData.occupation || !profileData.education) {
          isValid = false;
          errorMessage = 'Please fill in your occupation and education.';
        }
        break;
      case 'personal':
        if (!profileData.maritalStatus || !profileData.hasChildren || !profileData.wantChildren || !profileData.smoking || !profileData.drinking) {
          isValid = false;
          errorMessage = 'Please answer all personal background questions.';
        }
        break;
      case 'additional':
        // Additional fields are optional
        break;
    }

    if (!isValid) {
      Alert.alert('Required Fields', errorMessage);
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 Completing profile with data:', profileData);

      // Prepare data with proper types for backend
      const cleanedData = {
        // Basic Info (firstName, lastName already collected in registration)
        dateOfBirth: profileData.dateOfBirth.toISOString().split('T')[0], // Format as YYYY-MM-DD
        gender: profileData.gender,

        // Enhanced Location
        city: profileData.location.city?.name || '',
        country: profileData.location.country?.name || '',
        postalCode: profileData.location.postalCode || null,
        latitude: profileData.location.coordinates?.latitude || null,
        longitude: profileData.location.coordinates?.longitude || null,

        // Physical Info
        height: profileData.height ? parseInt(profileData.height) : null,
        weight: profileData.weight ? parseInt(profileData.weight) : null,

        // Professional Info
        occupation: profileData.occupation.trim() || null,
        education: profileData.education || null,
        salaryMin: profileData.salaryRange[0],
        salaryMax: profileData.salaryRange[1],

        // Personal Background
        maritalStatus: profileData.maritalStatus || null,
        hasChildren: profileData.hasChildren || null,
        wantChildren: profileData.wantChildren || null,
        smoking: profileData.smoking || null,
        drinking: profileData.drinking || null,

        // Additional Info
        interests: profileData.interests.filter(interest => interest.trim()),
        languages: profileData.languages.filter(language => language.trim()),
        religion: profileData.religion || null,
        ethnicity: profileData.ethnicity || null,
      };

      console.log('🔧 Cleaned profile data:', cleanedData);

      // Save profile data to backend
      await apiService.put('/user/profile', cleanedData);

      console.log('✅ Profile completed successfully');
      onComplete();
    } catch (error) {
      console.error('❌ Error completing profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBasicInfoStep = () => (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        Complete your basic profile information. Your name was already collected during registration.
      </Text>

      <FormDatePicker
        label="Date of Birth"
        required
        value={profileData.dateOfBirth}
        onDateChange={handleDateChange}
        showPicker={showDatePicker}
        setShowPicker={setShowDatePicker}
      />

      <FormDropdown
        label="Gender"
        required
        value={profileData.gender}
        onSelect={(value) => handleInputChange('gender', value)}
        options={GENDER_OPTIONS}
        placeholder="Select your gender"
      />
    </View>
  );

  const renderLocationStep = () => (
    <View>
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 24
      }}>
        Select your precise location including country, region/state, city, and optionally postal code for better matching.
      </Text>

      <LocationPicker
        label="Location"
        required
        value={profileData.location}
        onLocationChange={(locationData) => handleInputChange('location', locationData)}
        placeholder="Select your location"
        colors={COLORS}
      />
    </View>
  );

  const renderPhysicalStep = () => (
    <View>
      <FormInput
        label="Height"
        required
        value={profileData.height}
        onChangeText={(value) => {
          // Only allow numbers
          const numericValue = value.replace(/[^0-9]/g, '');
          handleInputChange('height', numericValue);
        }}
        placeholder="Height in cm (e.g., 175)"
        keyboardType="numeric"
      />

      <FormInput
        label="Weight"
        required
        value={profileData.weight}
        onChangeText={(value) => {
          // Only allow numbers
          const numericValue = value.replace(/[^0-9]/g, '');
          handleInputChange('weight', numericValue);
        }}
        placeholder="Weight in kg (e.g., 70)"
        keyboardType="numeric"
      />
    </View>
  );

  const renderProfessionalStep = () => (
    <View>
      <FormInput
        label="Occupation"
        required
        value={profileData.occupation}
        onChangeText={(value) => handleInputChange('occupation', value)}
        placeholder="What do you do for work?"
      />

      <FormDropdown
        label="Education Level"
        required
        value={profileData.education}
        onSelect={(value) => handleInputChange('education', value)}
        options={EDUCATION_LEVELS}
        placeholder="Select your education level"
      />

      <FormSalaryRange
        label="Salary Range"
        required
        value={profileData.salaryRange}
        onValueChange={(value) => handleInputChange('salaryRange', value)}
      />
    </View>
  );

  const renderPersonalStep = () => (
    <View>
      <FormDropdown
        label="Marital Status"
        required
        value={profileData.maritalStatus}
        onSelect={(value) => handleInputChange('maritalStatus', value)}
        options={MARITAL_STATUS_OPTIONS}
        placeholder="Select your marital status"
      />

      <FormDropdown
        label="Do you have children?"
        required
        value={profileData.hasChildren}
        onSelect={(value) => handleInputChange('hasChildren', value)}
        options={CHILDREN_OPTIONS}
        placeholder="Select if you have children"
      />

      <FormDropdown
        label="Do you want children?"
        required
        value={profileData.wantChildren}
        onSelect={(value) => handleInputChange('wantChildren', value)}
        options={WANT_CHILDREN_OPTIONS}
        placeholder="Select your preference about having children"
      />

      <FormDropdown
        label="Smoking"
        required
        value={profileData.smoking}
        onSelect={(value) => handleInputChange('smoking', value)}
        options={SMOKING_OPTIONS}
        placeholder="Select your smoking habits"
      />

      <FormDropdown
        label="Drinking"
        required
        value={profileData.drinking}
        onSelect={(value) => handleInputChange('drinking', value)}
        options={DRINKING_OPTIONS}
        placeholder="Select your drinking habits"
      />
    </View>
  );

  const renderAdditionalStep = () => (
    <View>
      <FormMultiSelect
        label="Interests"
        selectedItems={profileData.interests}
        onSelectionChange={(value) => handleInputChange('interests', value)}
        options={INTERESTS_OPTIONS}
        placeholder="Select your interests (tap to choose multiple)"
      />

      <FormMultiSelect
        label="Languages"
        selectedItems={profileData.languages}
        onSelectionChange={(value) => handleInputChange('languages', value)}
        options={LANGUAGES}
        placeholder="Select languages you speak"
      />

      <FormDropdown
        label="Religion"
        value={profileData.religion}
        onSelect={(value) => handleInputChange('religion', value)}
        options={RELIGIONS}
        placeholder="Select your religion (optional)"
      />

      <FormDropdown
        label="Ethnicity"
        value={profileData.ethnicity}
        onSelect={(value) => handleInputChange('ethnicity', value)}
        options={ETHNICITIES}
        placeholder="Select your ethnicity (optional)"
      />
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStepData.id) {
      case 'basic':
        return renderBasicInfoStep();
      case 'location':
        return renderLocationStep();
      case 'physical':
        return renderPhysicalStep();
      case 'professional':
        return renderProfessionalStep();
      case 'personal':
        return renderPersonalStep();
      case 'additional':
        return renderAdditionalStep();
      default:
        return null;
    }
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header with Back Button */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 24,
          paddingHorizontal: 32,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={handlePrevious} disabled={currentStep === 0}>
              <Text style={{
                fontSize: 16,
                color: currentStep === 0 ? COLORS.textTertiary : COLORS.accent
              }}>
                ← Back
              </Text>
            </TouchableOpacity>

            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              letterSpacing: 1,
            }}>
              Complete Profile
            </Text>

            <View style={{ width: 50 }} />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={{
          paddingHorizontal: 32,
          paddingVertical: 16,
          backgroundColor: COLORS.surface,
        }}>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            marginBottom: 8,
          }}>
            Section {currentStep + 1} of {totalSteps}
          </Text>
          <View style={{
            height: 4,
            backgroundColor: COLORS.border,
            borderRadius: 2,
          }}>
            <View style={{
              height: 4,
              backgroundColor: COLORS.accent,
              borderRadius: 2,
              width: `${progressPercentage}%`,
            }} />
          </View>
        </View>

        {/* Form Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 24, paddingBottom: 120 }}
        >
          {renderCurrentStep()}
        </ScrollView>

        {/* Navigation Footer */}
        <View style={{
          paddingHorizontal: 32,
          paddingVertical: 16,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentStep === 0}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
              backgroundColor: currentStep === 0 ? COLORS.border : COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{ 
              fontSize: 14, 
              color: currentStep === 0 ? COLORS.textTertiary : COLORS.textSecondary 
            }}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={isLoading}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
              backgroundColor: isLoading ? COLORS.border : COLORS.accent,
            }}
          >
            <Text style={{ 
              fontSize: 14, 
              color: COLORS.background, 
              fontWeight: '500' 
            }}>
              {isLoading ? 'Saving...' : currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AppTransition>
  );
};

export default ProfileCompletionFlow;
