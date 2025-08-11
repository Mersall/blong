/**
 * BLONG Settings Screen - Premium Elite Design
 * User account settings and preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import EditProfileScreen from './EditProfileScreen';
import PreferencesScreen from './PreferencesScreen';
import PrivacySettingsScreen from './PrivacySettingsScreen';
import SecurityScreen from './SecurityScreen';
import HelpSupportScreen from './HelpSupportScreen';
import AboutScreen from './AboutScreen';
import {
  useUserProfile,
  useUpdateUserProfile,
  useUserPreferences,
  useUpdateUserPreferences
} from '../../services/api/userProfileApi';

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
  warning: '#FF9800',
};

const SettingsScreen = ({ user, userPreferences, onLogout, onUpdateProfile }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('main');

  // React Query hooks for data fetching and mutations
  const { data: userProfileData, isLoading: profileLoading } = useUserProfile();
  const { data: preferencesData, isLoading: preferencesLoading } = useUserPreferences();
  const updateProfileMutation = useUpdateUserProfile();
  const updatePreferencesMutation = useUpdateUserPreferences();

  // Use React Query data with fallbacks
  const userData = userProfileData?.profile || user || {};
  const preferences = preferencesData?.preferences || userPreferences || {};

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setIsLoggingOut(true);
            onLogout();
          },
        },
      ]
    );
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      // Use React Query mutation for profile updates
      await updateProfileMutation.mutateAsync(profileData);

      // Also call the original callback if provided
      if (onUpdateProfile) {
        await onUpdateProfile(profileData);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdatePreferences = async (newPreferences) => {
    try {
      // Use React Query mutation for preferences updates
      await updatePreferencesMutation.mutateAsync(newPreferences);
      console.log('Updated preferences:', newPreferences);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdatePrivacySettings = async (privacySettings) => {
    try {
      // Update privacy settings through preferences mutation
      const updatedPreferences = {
        ...preferences,
        privacy: { ...preferences.privacy, ...privacySettings }
      };
      await updatePreferencesMutation.mutateAsync(updatedPreferences);
      console.log('Updated privacy settings:', privacySettings);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateSecurity = async (securityData) => {
    try {
      if (securityData.type === 'password') {
        // Handle password change - this would need a separate API endpoint
        console.log('Password change requested');
      } else if (securityData.type === 'settings') {
        // Update security settings through preferences mutation
        const updatedPreferences = {
          ...preferences,
          security: { ...preferences.security, ...securityData.data }
        };
        await updatePreferencesMutation.mutateAsync(updatedPreferences);
        console.log('Updated security settings:', securityData.data);
      }
    } catch (error) {
      throw error;
    }
  };

  // Settings sections - Following Design Rules
  const settingsSections = [
    {
      title: 'Profile & Account',
      items: [
        {
          id: 'profile',
          icon: '👤',
          title: 'Edit Profile',
          subtitle: 'Update your personal information and details',
          action: () => setCurrentScreen('editProfile'),
          highlighted: true, // Make this prominent since it's moved from home
        },
        {
          id: 'preferences',
          icon: '⚙️',
          title: 'Preferences',
          subtitle: 'Language and relationship phase settings',
          action: () => setCurrentScreen('preferences'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'privacy',
          icon: '🔒',
          title: 'Privacy Settings',
          subtitle: 'Control your privacy and visibility',
          action: () => setCurrentScreen('privacy'),
        },
        {
          id: 'security',
          icon: '🛡️',
          title: 'Security',
          subtitle: 'Password and account security',
          action: () => setCurrentScreen('security'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: '❓',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          action: () => setCurrentScreen('help'),
        },
        {
          id: 'about',
          icon: 'ℹ️',
          title: 'About BLONG',
          subtitle: 'App version and information',
          action: () => setCurrentScreen('about'),
        },
      ],
    },
  ];

  // Handle screen navigation
  if (currentScreen === 'editProfile') {
    return (
      <EditProfileScreen
        user={userData}
        onBack={() => setCurrentScreen('main')}
        onUpdateProfile={handleUpdateProfile}
      />
    );
  }

  if (currentScreen === 'preferences') {
    return (
      <PreferencesScreen
        userPreferences={preferences}
        onBack={() => setCurrentScreen('main')}
        onUpdatePreferences={handleUpdatePreferences}
      />
    );
  }

  if (currentScreen === 'privacy') {
    return (
      <PrivacySettingsScreen
        userPreferences={preferences}
        onBack={() => setCurrentScreen('main')}
        onUpdatePrivacySettings={handleUpdatePrivacySettings}
      />
    );
  }

  if (currentScreen === 'security') {
    return (
      <SecurityScreen
        userPreferences={preferences}
        onBack={() => setCurrentScreen('main')}
        onUpdateSecurity={handleUpdateSecurity}
      />
    );
  }

  if (currentScreen === 'help') {
    return (
      <HelpSupportScreen
        onBack={() => setCurrentScreen('main')}
      />
    );
  }

  if (currentScreen === 'about') {
    return (
      <AboutScreen
        onBack={() => setCurrentScreen('main')}
      />
    );
  }

  // Show loading state while data is being fetched
  if (profileLoading || preferencesLoading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

          {/* Elite Header */}
          <View style={{
            paddingTop: 40,
            paddingBottom: 32,
            paddingHorizontal: 32,
            alignItems: 'center',
            backgroundColor: COLORS.background,
          }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '300',
              letterSpacing: 8,
              color: COLORS.text,
              marginBottom: 16,
            }}>
              BLONG
            </Text>

            <View style={{
              width: 40,
              height: 2,
              backgroundColor: COLORS.accent,
              marginBottom: 24,
            }} />

            <Text style={{
              fontSize: 20,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Loading Settings
            </Text>

            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Preparing your preferences
            </Text>
          </View>
        </SafeAreaView>
      </AppTransition>
    );
  }

  return (
    <AppTransition>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Elite Header - Following Design Rules */}
        <View style={{
          paddingTop: 40,
          paddingBottom: 32,
          paddingHorizontal: 32,
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '300',
            letterSpacing: 8,
            color: COLORS.text,
            marginBottom: 16,
          }}>
            BLONG
          </Text>

          <View style={{
            width: 40,
            height: 2,
            backgroundColor: COLORS.accent,
            marginBottom: 24,
          }} />

          <Text style={{
            fontSize: 20,
            fontWeight: '300',
            color: COLORS.text,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Settings
          </Text>

          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Settings Content - Following Design Rules */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Card */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            alignItems: 'center',
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: COLORS.accent + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>

            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              {userData?.firstName} {userData?.lastName}
            </Text>

            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 8,
            }}>
              {userData?.email}
            </Text>

            <Text style={{
              fontSize: 12,
              color: COLORS.textTertiary,
            }}>
              {preferences?.phase?.title || 'Phase not selected'}
            </Text>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '300',
                color: COLORS.text,
                marginBottom: 16,
                letterSpacing: 0.5,
              }}>
                {section.title}
              </Text>

              <View style={{
                backgroundColor: COLORS.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLORS.border,
                overflow: 'hidden',
              }}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={item.action}
                    style={{
                      padding: 20,
                      borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                      borderBottomColor: COLORS.border,
                      backgroundColor: item.highlighted ? COLORS.accent + '08' : 'transparent',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: item.highlighted ? COLORS.accent + '20' : COLORS.background,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                      }}>
                        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: item.highlighted ? '500' : '300',
                          color: item.highlighted ? COLORS.accent : COLORS.text,
                          marginBottom: 4,
                        }}>
                          {item.title}
                        </Text>
                        <Text style={{
                          fontSize: 12,
                          color: COLORS.textSecondary,
                          lineHeight: 16,
                        }}>
                          {item.subtitle}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, color: COLORS.accent }}>→</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoggingOut}
            style={{
              backgroundColor: COLORS.warning + '10',
              borderRadius: 8,
              padding: 20,
              alignItems: 'center',
              marginTop: 16,
              borderWidth: 1,
              borderColor: COLORS.warning + '30',
              opacity: isLoggingOut ? 0.6 : 1,
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: COLORS.warning,
              letterSpacing: 0.5,
            }}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default SettingsScreen;
