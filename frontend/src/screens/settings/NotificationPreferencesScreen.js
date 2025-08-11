/**
 * BLONG Notification Preferences Screen
 * Advanced notification settings and preferences management
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar, Alert } from 'react-native';
import { AppTransition } from '../../components/AppTransition';
import { apiService } from '../../services/apiService';

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

const NotificationPreferencesScreen = ({ onBack }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadPreferences();
    loadCategories();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/notifications/preferences');
      setPreferences(response.data);
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      Alert.alert('Error', 'Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.get('/notifications/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading notification categories:', error);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      setSaving(true);
      await apiService.put('/notifications/preferences', newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      Alert.alert('Error', 'Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updatePreferences(newPreferences);
  };

  const handleCategoryToggle = (categoryKey, value) => {
    const newCategories = { ...preferences.categories, [categoryKey]: value };
    const newPreferences = { ...preferences, categories: newCategories };
    setPreferences(newPreferences);
    updatePreferences(newPreferences);
  };

  const handleQuietHoursToggle = (value) => {
    const newQuietHours = { ...preferences.quietHours, enabled: value };
    const newPreferences = { ...preferences, quietHours: newQuietHours };
    setPreferences(newPreferences);
    updatePreferences(newPreferences);
  };

  const sendTestNotification = async () => {
    try {
      await apiService.post('/notifications/test');
      Alert.alert('Success', 'Test notification sent! Check your notifications.');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const renderToggleItem = (title, subtitle, value, onToggle, icon) => (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {icon && (
            <Text style={{ fontSize: 20, marginRight: 16 }}>{icon}</Text>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 4,
            }}>
              {title}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              lineHeight: 16,
            }}>
              {subtitle}
            </Text>
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.border, true: COLORS.accent + '40' }}
          thumbColor={value ? COLORS.accent : COLORS.textTertiary}
          disabled={saving}
        />
      </View>
    </View>
  );

  const renderCategorySection = () => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 16,
        letterSpacing: 0.5,
      }}>
        Notification Categories
      </Text>

      {categories.map((category) => (
        <View key={category.id}>
          {renderToggleItem(
            category.name,
            category.description,
            preferences?.categories?.[category.id] || false,
            (value) => handleCategoryToggle(category.id, value),
            category.icon
          )}
        </View>
      ))}
    </View>
  );

  const renderQuietHoursSection = () => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 16,
        letterSpacing: 0.5,
      }}>
        Quiet Hours
      </Text>

      {renderToggleItem(
        'Enable Quiet Hours',
        'Reduce notifications during specified hours (urgent notifications will still come through)',
        preferences?.quietHours?.enabled || false,
        handleQuietHoursToggle,
        '🌙'
      )}

      {preferences?.quietHours?.enabled && (
        <View style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 20,
          marginTop: 8,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            Quiet hours: {preferences.quietHours.startTime} - {preferences.quietHours.endTime}
          </Text>
          <Text style={{
            fontSize: 12,
            color: COLORS.textTertiary,
            textAlign: 'center',
            marginTop: 4,
          }}>
            Tap to customize times (coming soon)
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <AppTransition>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>
              Loading notification preferences...
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

        {/* Header */}
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
              Notification Settings
            </Text>
            
            <TouchableOpacity onPress={sendTestNotification} style={{ padding: 8 }}>
              <Text style={{ fontSize: 12, color: COLORS.accent }}>Test</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 32, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Notification Types */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 16,
              letterSpacing: 0.5,
            }}>
              Notification Methods
            </Text>

            {renderToggleItem(
              'Push Notifications',
              'Receive notifications on your device',
              preferences?.pushNotifications || false,
              (value) => handleToggle('pushNotifications', value),
              '📱'
            )}

            {renderToggleItem(
              'Email Notifications',
              'Receive important notifications via email',
              preferences?.emailNotifications || false,
              (value) => handleToggle('emailNotifications', value),
              '📧'
            )}

            {renderToggleItem(
              'SMS Notifications',
              'Receive urgent notifications via SMS',
              preferences?.smsNotifications || false,
              (value) => handleToggle('smsNotifications', value),
              '💬'
            )}
          </View>

          {/* Notification Categories */}
          {renderCategorySection()}

          {/* Quiet Hours */}
          {renderQuietHoursSection()}

          {/* Additional Info */}
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '300',
              color: COLORS.text,
              marginBottom: 8,
            }}>
              💡 Smart Notifications
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              lineHeight: 16,
            }}>
              BLONG uses intelligent algorithms to send you the most relevant notifications at the right time. 
              Safety notifications will always be delivered regardless of your settings.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default NotificationPreferencesScreen;
