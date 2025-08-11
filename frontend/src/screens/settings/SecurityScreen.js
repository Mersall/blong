/**
 * BLONG Security Screen - Premium Elite Design
 * Password and account security settings
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert, Switch } from 'react-native';
import { AppTransition } from '../../components/AppTransition';

// Import LocalAuthentication with fallback
let LocalAuthentication;
try {
  // Try to import the actual package
  const LocalAuth = require('expo-local-authentication');
  LocalAuthentication = LocalAuth.default || LocalAuth;
} catch (error) {
  console.log('expo-local-authentication not available, using fallback');
  // Fallback implementation for development
  LocalAuthentication = {
    hasHardwareAsync: async () => true,
    isEnrolledAsync: async () => true,
    supportedAuthenticationTypesAsync: async () => [1, 2],
    authenticateAsync: async (options) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    AuthenticationType: {
      FINGERPRINT: 1,
      FACIAL_RECOGNITION: 2,
    },
  };
}

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
  warning: '#FF9800',
  danger: '#F44336',
};

const SecurityScreen = ({ userPreferences, onBack, onUpdateSecurity }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    biometricAuth: userPreferences?.security?.biometricAuth ?? false,
  });

  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      setBiometricSupported(compatible && enrolled);

      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Touch ID');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setBiometricSupported(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      await onUpdateSecurity({ type: 'password', data: passwordData });
      Alert.alert('Success', 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSecuritySettingsUpdate = async () => {
    setIsSaving(true);
    try {
      await onUpdateSecurity({ type: 'settings', data: securitySettings });
      Alert.alert('Success', 'Security settings updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update security settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (key) => {
    if (key === 'biometricAuth') {
      if (!biometricSupported) {
        Alert.alert(
          'Biometric Authentication Unavailable',
          'Your device does not support biometric authentication or no biometric data is enrolled.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (!securitySettings.biometricAuth) {
        // Enabling biometric auth - require authentication
        try {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: `Enable ${biometricType} for BLONG`,
            cancelLabel: 'Cancel',
            fallbackLabel: 'Use Password',
          });

          if (result.success) {
            setSecuritySettings(prev => ({
              ...prev,
              [key]: true
            }));
            Alert.alert('Success', `${biometricType} authentication enabled successfully!`);
          } else {
            Alert.alert('Authentication Failed', 'Biometric authentication was not successful.');
          }
        } catch (error) {
          console.error('Biometric authentication error:', error);
          Alert.alert('Error', 'Failed to enable biometric authentication.');
        }
      } else {
        // Disabling biometric auth
        setSecuritySettings(prev => ({
          ...prev,
          [key]: false
        }));
        Alert.alert('Disabled', `${biometricType} authentication has been disabled.`);
      }
    } else {
      setSecuritySettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const PasswordField = ({ label, value, onChangeText, placeholder, secureTextEntry = true }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: 0.5,
      }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        secureTextEntry={secureTextEntry}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          fontSize: 16,
          color: COLORS.text,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      />
    </View>
  );

  const SecurityOption = ({ title, subtitle, value, onToggle, icon, disabled = false }) => (
    <View style={{
      padding: 20,
      backgroundColor: COLORS.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 16,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>{icon}</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
            }}>
              {title}
            </Text>
          </View>
          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            lineHeight: 16,
          }}>
            {subtitle}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ false: COLORS.border, true: COLORS.accent + '40' }}
          thumbColor={value ? COLORS.accent : COLORS.textTertiary}
          ios_backgroundColor={COLORS.border}
          style={{ opacity: disabled ? 0.5 : 1 }}
        />
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
              Security
            </Text>
            
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Security Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Change Password Section */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Change Password
            </Text>

            <View style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              padding: 24,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <PasswordField
                label="Current Password"
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                placeholder="Enter current password"
              />

              <PasswordField
                label="New Password"
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                placeholder="Enter new password"
              />

              <PasswordField
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                placeholder="Confirm new password"
              />

              <TouchableOpacity
                onPress={handlePasswordChange}
                disabled={isChangingPassword}
                style={{
                  backgroundColor: COLORS.accent,
                  borderRadius: 8,
                  padding: 16,
                  alignItems: 'center',
                  marginTop: 8,
                  opacity: isChangingPassword ? 0.6 : 1,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: COLORS.background,
                  letterSpacing: 0.5,
                }}>
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Settings */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Security Settings
            </Text>

            <SecurityOption
              icon="📱"
              title={`${biometricType || 'Biometric'} Authentication`}
              subtitle={biometricSupported ?
                `Use ${biometricType?.toLowerCase() || 'biometric'} authentication to unlock the app` :
                'Biometric authentication not available on this device'
              }
              value={securitySettings.biometricAuth}
              onToggle={() => handleToggle('biometricAuth')}
              disabled={!biometricSupported}
            />

            <TouchableOpacity
              onPress={handleSecuritySettingsUpdate}
              disabled={isSaving}
              style={{
                backgroundColor: COLORS.success,
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
                marginTop: 16,
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: COLORS.background,
                letterSpacing: 0.5,
              }}>
                {isSaving ? 'Saving...' : 'Save Security Settings'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default SecurityScreen;
