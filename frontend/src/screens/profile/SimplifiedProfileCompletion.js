/**
 * BLONG Simplified Profile Completion
 * Clean, section-by-section profile completion with minimal UI
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Modal, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import GenderSelector from '../../components/profile/GenderSelector';
import BirthdayPicker from '../../components/profile/BirthdayPicker';
import { handleErrorWithLogging } from '../../utils/errorCommunication';
import * as Location from 'expo-location';

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

const SimplifiedProfileCompletion = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    dateOfBirth: null,
    gender: '',
    location: {},
    occupation: '',
    education: '',
    maritalStatus: '',
    smoking: '',
    drinking: '',
    height: '',
    interests: [],
    languages: [],
  });

  // Modal states for different selectors
  const [showOccupationInput, setShowOccupationInput] = useState(false);
  const [showEducationSelector, setShowEducationSelector] = useState(false);
  const [showMaritalStatusSelector, setShowMaritalStatusSelector] = useState(false);
  const [showSmokingSelector, setShowSmokingSelector] = useState(false);
  const [showDrinkingSelector, setShowDrinkingSelector] = useState(false);
  const [showHeightInput, setShowHeightInput] = useState(false);
  const [showInterestsSelector, setShowInterestsSelector] = useState(false);

  // Location detection state
  const [locationStatus, setLocationStatus] = useState('detecting'); // 'detecting', 'success', 'error'
  const [locationError, setLocationError] = useState(null);

  // Options data
  const educationOptions = [
    'High School',
    'Some College',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate',
    'Trade School',
    'Other'
  ];

  const maritalStatusOptions = [
    'Single',
    'Divorced',
    'Widowed',
    'Separated'
  ];

  const smokingOptions = [
    'Never',
    'Occasionally',
    'Regularly',
    'Trying to quit'
  ];

  const drinkingOptions = [
    'Never',
    'Rarely',
    'Socially',
    'Regularly'
  ];

  const interestOptions = [
    'Travel', 'Fitness', 'Cooking', 'Music', 'Movies', 'Reading',
    'Sports', 'Art', 'Technology', 'Nature', 'Photography', 'Gaming'
  ];

  const steps = [
    {
      id: 'basics',
      title: 'Basic Information',
      fields: ['dateOfBirth', 'gender']
    },
    {
      id: 'location',
      title: 'Your Location',
      fields: ['location']
    },
    {
      id: 'about',
      title: 'About You',
      fields: ['occupation', 'education']
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      fields: ['maritalStatus', 'smoking', 'drinking']
    },
    {
      id: 'details',
      title: 'Additional Details',
      fields: ['height', 'interests', 'languages']
    }
  ];

  const currentStepData = steps[currentStep];
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Automatic location detection
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      setLocationStatus('detecting');

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        setLocationStatus('error');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const locationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: address[0].city || address[0].subregion || 'Unknown',
          country: address[0].country || 'Unknown',
          region: address[0].region || address[0].administrativeArea || '',
          postalCode: address[0].postalCode || '',
        };

        setProfileData(prev => ({
          ...prev,
          location: locationData
        }));

        setLocationStatus('success');
      } else {
        setLocationError('Could not determine location');
        setLocationStatus('error');
      }
    } catch (error) {
      console.error('Location detection error:', error);

      // Use comprehensive error communication
      handleErrorWithLogging(
        error,
        {
          operation: 'location_detection',
          screen: 'ProfileCompletion'
        },
        detectLocation // Retry function
      );

      setLocationError('Unable to detect location');
      setLocationStatus('error');
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // For location step, check if location is detected
    if (currentStepData.id === 'location' && locationStatus !== 'success') {
      Alert.alert(
        'Location Required',
        'Please allow location access to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(profileData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'basics':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 48,
            }}>
              Let's start with the basics
            </Text>

            <BirthdayPicker
              value={profileData.dateOfBirth}
              onDateChange={(date) => handleInputChange('dateOfBirth', date)}
              required={true}
              style={{ marginBottom: 32 }}
            />

            <GenderSelector
              value={profileData.gender}
              onSelect={(value) => handleInputChange('gender', value)}
              required={true}
            />
          </View>
        );

      case 'location':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              Detecting your location
            </Text>

            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 48,
              lineHeight: 24,
            }}>
              This helps us find matches in your area
            </Text>

            <View style={{
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              padding: 32,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              {locationStatus === 'detecting' && (
                <>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: COLORS.accent + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                    <Text style={{ fontSize: 24 }}>📍</Text>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    color: COLORS.text,
                    textAlign: 'center',
                    marginBottom: 8,
                  }}>
                    Getting your location...
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                  }}>
                    Please allow location access
                  </Text>
                </>
              )}

              {locationStatus === 'success' && (
                <>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: COLORS.success + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                    <Text style={{ fontSize: 24 }}>✅</Text>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    color: COLORS.success,
                    textAlign: 'center',
                    marginBottom: 8,
                    fontWeight: '500',
                  }}>
                    Location detected!
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                  }}>
                    {profileData.location?.city}, {profileData.location?.country}
                  </Text>
                </>
              )}

              {locationStatus === 'error' && (
                <>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: COLORS.accent + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                    <Text style={{ fontSize: 24 }}>⚠️</Text>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    color: COLORS.accent,
                    textAlign: 'center',
                    marginBottom: 8,
                    fontWeight: '500',
                  }}>
                    Location access needed
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    textAlign: 'center',
                    marginBottom: 16,
                  }}>
                    {locationError}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.accent,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 20,
                    }}
                    onPress={detectLocation}
                  >
                    <Text style={{
                      color: COLORS.background,
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                      Try Again
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        );

      case 'about':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              Tell us about yourself
            </Text>

            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 48,
              lineHeight: 24,
            }}>
              Your professional background
            </Text>

            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.text,
                marginBottom: 8,
              }}>
                Occupation
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 8,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
                onPress={() => setShowOccupationInput(true)}
              >
                <Text style={{
                  fontSize: 16,
                  color: profileData.occupation ? COLORS.text : COLORS.textTertiary,
                }}>
                  {profileData.occupation || 'What do you do for work?'}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: COLORS.text,
                marginBottom: 8,
              }}>
                Education Level
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 8,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
                onPress={() => setShowEducationSelector(true)}
              >
                <Text style={{
                  fontSize: 16,
                  color: profileData.education ? COLORS.text : COLORS.textTertiary,
                }}>
                  {profileData.education || 'Select your education level'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'lifestyle':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              Your lifestyle
            </Text>

            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 48,
              lineHeight: 24,
            }}>
              Help us find compatible matches
            </Text>

            {/* Simplified lifestyle options */}
            <View style={{ gap: 24 }}>
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.text,
                  marginBottom: 8,
                }}>
                  Relationship Status
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => setShowMaritalStatusSelector(true)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: profileData.maritalStatus ? COLORS.text : COLORS.textTertiary,
                  }}>
                    {profileData.maritalStatus || 'Select your status'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.text,
                  marginBottom: 8,
                }}>
                  Smoking
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => setShowSmokingSelector(true)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: profileData.smoking ? COLORS.text : COLORS.textTertiary,
                  }}>
                    {profileData.smoking || 'Select preference'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.text,
                  marginBottom: 8,
                }}>
                  Drinking
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => setShowDrinkingSelector(true)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: profileData.drinking ? COLORS.text : COLORS.textTertiary,
                  }}>
                    {profileData.drinking || 'Select preference'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'details':
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '300',
              color: COLORS.text,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              Almost done!
            </Text>

            <Text style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginBottom: 48,
              lineHeight: 24,
            }}>
              Add some final details
            </Text>

            <View style={{ gap: 24 }}>
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.text,
                  marginBottom: 8,
                }}>
                  Height (optional)
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => setShowHeightInput(true)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: profileData.height ? COLORS.text : COLORS.textTertiary,
                  }}>
                    {profileData.height ? `${profileData.height} cm` : 'Enter your height'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.text,
                  marginBottom: 8,
                }}>
                  Interests (optional)
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => setShowInterestsSelector(true)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: profileData.interests?.length > 0 ? COLORS.text : COLORS.textTertiary,
                  }}>
                    {profileData.interests?.length > 0
                      ? `${profileData.interests.length} interests selected`
                      : 'Select your interests'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Simple Progress Bar at Top */}
        <View style={{
          height: 4,
          backgroundColor: COLORS.border,
          marginHorizontal: 0,
        }}>
          <View style={{
            height: '100%',
            width: `${progressPercentage}%`,
            backgroundColor: COLORS.accent,
          }} />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {renderStepContent()}
        </View>

        {/* Simple Navigation */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 32,
          paddingVertical: 24,
          backgroundColor: COLORS.background,
        }}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentStep === 0}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              opacity: currentStep === 0 ? 0.3 : 1,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: COLORS.accent,
              fontWeight: '500',
            }}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 24,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: COLORS.background,
              fontWeight: '500',
            }}>
              {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Occupation Input Modal */}
        <Modal
          visible={showOccupationInput}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ padding: 24, paddingTop: 60 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity onPress={() => setShowOccupationInput(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>Occupation</Text>
                <TouchableOpacity onPress={() => setShowOccupationInput(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
                value={profileData.occupation}
                onChangeText={(value) => handleInputChange('occupation', value)}
                placeholder="What do you do for work?"
                autoFocus
              />
            </View>
          </SafeAreaView>
        </Modal>

        {/* Education Selector Modal */}
        <Modal
          visible={showEducationSelector}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ padding: 24, paddingTop: 60 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity onPress={() => setShowEducationSelector(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>Education Level</Text>
                <View style={{ width: 50 }} />
              </View>

              <ScrollView>
                {educationOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      padding: 16,
                      backgroundColor: profileData.education === option ? COLORS.accent + '20' : COLORS.surface,
                      borderRadius: 8,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: profileData.education === option ? COLORS.accent : COLORS.border,
                    }}
                    onPress={() => {
                      handleInputChange('education', option);
                      setShowEducationSelector(false);
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: profileData.education === option ? COLORS.accent : COLORS.text,
                      fontWeight: profileData.education === option ? '500' : '300'
                    }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Marital Status Selector Modal */}
        <Modal
          visible={showMaritalStatusSelector}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ padding: 24, paddingTop: 60 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity onPress={() => setShowMaritalStatusSelector(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>Relationship Status</Text>
                <View style={{ width: 50 }} />
              </View>

              <ScrollView>
                {maritalStatusOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      padding: 16,
                      backgroundColor: profileData.maritalStatus === option ? COLORS.accent + '20' : COLORS.surface,
                      borderRadius: 8,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: profileData.maritalStatus === option ? COLORS.accent : COLORS.border,
                    }}
                    onPress={() => {
                      handleInputChange('maritalStatus', option);
                      setShowMaritalStatusSelector(false);
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: profileData.maritalStatus === option ? COLORS.accent : COLORS.text,
                      fontWeight: profileData.maritalStatus === option ? '500' : '300'
                    }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Smoking Selector Modal */}
        <Modal
          visible={showSmokingSelector}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ padding: 24, paddingTop: 60 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity onPress={() => setShowSmokingSelector(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>Smoking</Text>
                <View style={{ width: 50 }} />
              </View>

              <ScrollView>
                {smokingOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      padding: 16,
                      backgroundColor: profileData.smoking === option ? COLORS.accent + '20' : COLORS.surface,
                      borderRadius: 8,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: profileData.smoking === option ? COLORS.accent : COLORS.border,
                    }}
                    onPress={() => {
                      handleInputChange('smoking', option);
                      setShowSmokingSelector(false);
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: profileData.smoking === option ? COLORS.accent : COLORS.text,
                      fontWeight: profileData.smoking === option ? '500' : '300'
                    }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Drinking Selector Modal */}
        <Modal
          visible={showDrinkingSelector}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ padding: 24, paddingTop: 60 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity onPress={() => setShowDrinkingSelector(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>Drinking</Text>
                <View style={{ width: 50 }} />
              </View>

              <ScrollView>
                {drinkingOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      padding: 16,
                      backgroundColor: profileData.drinking === option ? COLORS.accent + '20' : COLORS.surface,
                      borderRadius: 8,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: profileData.drinking === option ? COLORS.accent : COLORS.border,
                    }}
                    onPress={() => {
                      handleInputChange('drinking', option);
                      setShowDrinkingSelector(false);
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: profileData.drinking === option ? COLORS.accent : COLORS.text,
                      fontWeight: profileData.drinking === option ? '500' : '300'
                    }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Height Input Modal */}
        <Modal
          visible={showHeightInput}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ padding: 24, paddingTop: 60 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity onPress={() => setShowHeightInput(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>Height</Text>
                <TouchableOpacity onPress={() => setShowHeightInput(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 }}>
                  Height in centimeters
                </Text>

                <TextInput
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 8,
                    padding: 20,
                    fontSize: 24,
                    fontWeight: '300',
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    textAlign: 'center',
                    width: 120,
                  }}
                  value={profileData.height}
                  onChangeText={(value) => {
                    // Only allow numbers and allow typing (validate on submit)
                    const numericValue = value.replace(/[^0-9]/g, '');
                    if (numericValue.length <= 3) {
                      handleInputChange('height', numericValue);
                    }
                  }}
                  placeholder="175"
                  keyboardType="numeric"
                  autoFocus
                  maxLength={3}
                />

                <Text style={{ fontSize: 12, color: COLORS.textTertiary, marginTop: 8 }}>
                  Between 100-250 cm
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Interests Selector Modal */}
        <Modal
          visible={showInterestsSelector}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ padding: 24, paddingTop: 60 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity onPress={() => setShowInterestsSelector(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>Interests</Text>
                <TouchableOpacity onPress={() => setShowInterestsSelector(false)}>
                  <Text style={{ fontSize: 16, color: COLORS.accent, fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, textAlign: 'center' }}>
                Select up to 5 interests that describe you
              </Text>

              <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {interestOptions.map((interest, index) => {
                    const isSelected = profileData.interests?.includes(interest);
                    const canSelect = !isSelected && (profileData.interests?.length || 0) < 5;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          backgroundColor: isSelected ? COLORS.accent : COLORS.surface,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: isSelected ? COLORS.accent : COLORS.border,
                          opacity: (!isSelected && !canSelect) ? 0.5 : 1,
                        }}
                        onPress={() => {
                          if (isSelected) {
                            // Remove interest
                            const newInterests = (profileData.interests || []).filter(i => i !== interest);
                            handleInputChange('interests', newInterests);
                          } else if (canSelect) {
                            // Add interest
                            const newInterests = [...(profileData.interests || []), interest];
                            handleInputChange('interests', newInterests);
                          }
                        }}
                        disabled={!isSelected && !canSelect}
                      >
                        <Text style={{
                          fontSize: 14,
                          color: isSelected ? COLORS.background : COLORS.text,
                          fontWeight: isSelected ? '500' : '300',
                        }}>
                          {interest}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={{ marginTop: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: COLORS.textTertiary }}>
                    {(profileData.interests?.length || 0)} of 5 selected
                  </Text>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </AppTransition>
  );
};

export default SimplifiedProfileCompletion;
