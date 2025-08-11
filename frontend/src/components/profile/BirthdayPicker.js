/**
 * BLONG Birthday Picker Component
 * Simplified and improved date picker with better UX
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

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

const BirthdayPicker = ({ 
  value, 
  onDateChange, 
  required = false, 
  style = {},
  disabled = false 
}) => {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  // Calculate reasonable date bounds
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); // 100 years ago
  const defaultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate()); // 25 years ago

  const formatDate = (date) => {
    if (!date) return null;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        onDateChange(selectedDate);
      }
    } else {
      // iOS - store temporarily
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    if (tempDate) {
      onDateChange(tempDate);
    }
    setShowPicker(false);
    setTempDate(null);
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempDate(null);
  };

  const displayText = value ? formatDate(value) : 'Select your date of birth';
  const age = calculateAge(value);

  return (
    <View style={[{ marginBottom: 24 }, style]}>
      {/* Label */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 8 
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.text,
          letterSpacing: 0.5,
        }}>
          Date of Birth
        </Text>
        {required && (
          <Text style={{ 
            color: COLORS.accent, 
            marginLeft: 4,
            fontSize: 14,
            fontWeight: '500'
          }}>
            *
          </Text>
        )}
      </View>

      {/* Date Selector Button */}
      <TouchableOpacity
        style={{
          backgroundColor: disabled ? COLORS.surface + '80' : COLORS.surface,
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: value ? COLORS.accent + '40' : COLORS.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 56,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.02,
          shadowRadius: 4,
          elevation: 1,
        }}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Date of birth. Currently selected: ${displayText}`}
        accessibilityHint="Opens date picker"
      >
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 16,
            color: value ? COLORS.text : COLORS.textTertiary,
            fontWeight: value ? '400' : '300',
            marginBottom: age ? 4 : 0,
          }}>
            {displayText}
          </Text>
          {age && (
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              fontWeight: '300',
            }}>
              Age: {age} years old
            </Text>
          )}
        </View>
        <Ionicons 
          name="calendar-outline" 
          size={20} 
          color={disabled ? COLORS.textTertiary : COLORS.textSecondary} 
        />
      </TouchableOpacity>

      {/* iOS Modal Picker */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCancel}
        >
          <View style={{ 
            flex: 1, 
            backgroundColor: COLORS.background,
            paddingTop: 60,
          }}>
            {/* Header */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingHorizontal: 24,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}>
              <TouchableOpacity 
                onPress={handleCancel}
                style={{ padding: 8 }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Cancel date selection"
              >
                <Text style={{ 
                  fontSize: 16, 
                  color: COLORS.accent,
                  fontWeight: '500'
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '300', 
                color: COLORS.text,
                letterSpacing: 0.5,
              }}>
                Select Date of Birth
              </Text>
              
              <TouchableOpacity 
                onPress={handleConfirm}
                style={{ padding: 8 }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Confirm date selection"
              >
                <Text style={{ 
                  fontSize: 16, 
                  color: COLORS.accent,
                  fontWeight: '600'
                }}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            <View style={{
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 24,
            }}>
              <DateTimePicker
                value={tempDate || value || defaultDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={maxDate}
                minimumDate={minDate}
                style={{
                  height: 200,
                  backgroundColor: COLORS.background,
                }}
                textColor={COLORS.text}
              />
            </View>

            {/* Footer Info */}
            <View style={{ 
              paddingVertical: 24,
              paddingHorizontal: 24,
              backgroundColor: COLORS.surface,
              marginHorizontal: 24,
              borderRadius: 8,
              marginBottom: 40,
            }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                textAlign: 'center',
                lineHeight: 18,
              }}>
                You must be at least 18 years old to use BLONG. 
                Your age will be calculated automatically.
              </Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Android Picker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={value || defaultDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maxDate}
          minimumDate={minDate}
        />
      )}
    </View>
  );
};

export default BirthdayPicker;
