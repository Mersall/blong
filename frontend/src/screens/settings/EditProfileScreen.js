/**
 * BLONG Edit Profile Screen - Premium Elite Design
 * User profile editing with sophisticated form design
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
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

const EditProfileScreen = ({ user, onBack, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    age: user?.age || '',
    profession: user?.profession || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      onBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const FormField = ({ label, value, onChangeText, placeholder, required = false, multiline = false }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: 0.5,
      }}>
        {label} {required && <Text style={{ color: COLORS.accent }}>*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          fontSize: 16,
          color: COLORS.text,
          borderWidth: 1,
          borderColor: COLORS.border,
          textAlignVertical: multiline ? 'top' : 'center',
          minHeight: multiline ? 100 : 50,
        }}
      />
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
              Edit Profile
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

        {/* Form Content */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <FormField
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            placeholder="Enter your first name"
            required
          />

          <FormField
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            placeholder="Enter your last name"
            required
          />

          <FormField
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email address"
            required
          />

          <FormField
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Enter your phone number"
          />

          <FormField
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            placeholder="Enter your location"
          />

          <FormField
            label="Age"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter your age"
          />

          <FormField
            label="Profession"
            value={formData.profession}
            onChangeText={(text) => setFormData({ ...formData, profession: text })}
            placeholder="Enter your profession"
          />

          <FormField
            label="Bio"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            placeholder="Tell us about yourself..."
            multiline
          />
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default EditProfileScreen;
