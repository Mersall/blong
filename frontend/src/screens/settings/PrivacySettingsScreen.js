/**
 * BLONG Privacy Settings Screen - Premium Elite Design
 * Privacy controls and visibility settings
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Switch, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';

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

const PrivacySettingsScreen = ({ userPreferences, onBack, onUpdatePrivacySettings }) => {
  const [settings, setSettings] = useState({
    profileVisibility: userPreferences?.privacy?.profileVisibility ?? true,
    dataCollection: userPreferences?.privacy?.dataCollection ?? true,
    marketingEmails: userPreferences?.privacy?.marketingEmails ?? false,
    pushNotifications: userPreferences?.privacy?.pushNotifications ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdatePrivacySettings(settings);
      Alert.alert('Success', 'Privacy settings updated successfully');
      onBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update privacy settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const privacySections = [
    {
      title: 'Profile Visibility',
      items: [
        {
          key: 'profileVisibility',
          title: 'Profile Visible',
          subtitle: 'Allow others to see your profile',
          value: settings.profileVisibility,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          subtitle: 'Receive push notifications',
          value: settings.pushNotifications,
        },
      ],
    },
    {
      title: 'Data & Content',
      items: [
        {
          key: 'dataCollection',
          title: 'Analytics Data',
          subtitle: 'Help improve the app with usage data',
          value: settings.dataCollection,
        },
        {
          key: 'marketingEmails',
          title: 'Marketing Emails',
          subtitle: 'Receive promotional emails',
          value: settings.marketingEmails,
        },
      ],
    },
  ];

  const PrivacySection = ({ section }) => (
    <View style={{ marginBottom: 32 }}>
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
        {section.items.map((item, index) => (
          <View
            key={item.key}
            style={{
              padding: 20,
              borderBottomWidth: index < section.items.length - 1 ? 1 : 0,
              borderBottomColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '300',
                  color: COLORS.text,
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
              <Switch
                value={item.value}
                onValueChange={() => handleToggle(item.key)}
                trackColor={{ false: COLORS.border, true: COLORS.accent + '40' }}
                thumbColor={item.value ? COLORS.accent : COLORS.textTertiary}
                ios_backgroundColor={COLORS.border}
              />
            </View>
          </View>
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
              Privacy Settings
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

        {/* Privacy Settings Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {privacySections.map((section, index) => (
            <PrivacySection key={index} section={section} />
          ))}

          {/* Privacy Notice */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            marginTop: 16,
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.text,
              marginBottom: 8,
            }}>
              Privacy Notice
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              lineHeight: 18,
            }}>
              Your privacy is important to us. These settings control how your information is shared and used within the BLONG app. You can change these settings at any time.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default PrivacySettingsScreen;
