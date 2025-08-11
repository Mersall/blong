/**
 * BLONG Profile Form Components
 * Reusable form components for profile completion
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { isCurrentLanguageRTL } from '../../localization/i18n';

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

// Helper function for date formatting
const formatDateDisplay = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Form Label Component
export const FormLabel = ({ text, required }) => (
  <Text style={{
    fontSize: 14,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.5
  }}>
    {text} {required && <Text style={{ color: COLORS.accent }}>*</Text>}
  </Text>
);

// Basic Text Input Component
export const FormInput = ({ label, required, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <View style={{ marginBottom: 24 }}>
    <FormLabel text={label} required={required} />
    <TextInput
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
        height: 56,
      }}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary}
      keyboardType={keyboardType}
    />
  </View>
);

// Dropdown Component
export const FormDropdown = ({ label, required, value, onSelect, options, placeholder }) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const isRTL = isCurrentLanguageRTL();

  return (
    <View style={{ marginBottom: 24 }}>
      <FormLabel text={label} required={required} />
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 56,
        }}
        onPress={() => setShowModal(true)}
      >
        <Text style={{
          fontSize: 16,
          color: value ? COLORS.text : COLORS.textSecondary,
        }}>
          {value || placeholder}
        </Text>
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 24, paddingTop: 60 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>{safeTranslate(t, 'form.cancel', 'Cancel')}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>
              {label}
            </Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  padding: 16,
                  backgroundColor: value === option ? COLORS.accent + '20' : COLORS.surface,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: value === option ? COLORS.accent : COLORS.border,
                }}
                onPress={() => {
                  onSelect(option);
                  setShowModal(false);
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: value === option ? COLORS.accent : COLORS.text,
                  fontWeight: value === option ? '500' : '300'
                }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

// Safe translation helper
const safeTranslate = (t, key, fallback) => {
  try {
    return t(key) || fallback;
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error);
    return fallback;
  }
};

// Date Picker Component
export const FormDatePicker = ({ label, required, value, onDateChange }) => {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  // Calculate a reasonable default date (25 years ago)
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 25);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android' || Platform.OS === 'web') {
      setShowPicker(false);
      if (selectedDate && (event.type === 'set' || Platform.OS === 'web')) {
        onDateChange(event, selectedDate);
      }
    } else {
      // iOS - store temporarily until confirmed
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    if (tempDate) {
      onDateChange({ type: 'set' }, tempDate);
    }
    setShowPicker(false);
    setTempDate(null);
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempDate(null);
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <FormLabel text={label} required={required} />
      <TouchableOpacity
        onPress={() => {
          setTempDate(value || defaultDate);
          setShowPicker(true);
        }}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 56,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 2,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '300', // BLONG typography
          color: value ? COLORS.text : COLORS.textSecondary,
          flex: 1,
        }}>
          {value ? formatDateDisplay(value) : safeTranslate(t, 'form.selectDate', 'Select your date of birth')}
        </Text>
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>📅</Text>
      </TouchableOpacity>

      {/* iOS Modal */}
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
          }}>
            {/* Header */}
            <View style={{
              paddingTop: 60,
              paddingHorizontal: 24,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
              backgroundColor: COLORS.background,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={{ fontSize: 16, color: COLORS.accent }}>{safeTranslate(t, 'form.cancel', 'Cancel')}</Text>
                </TouchableOpacity>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: COLORS.text
                }}>
                  {label}
                </Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={{
                    fontSize: 16,
                    color: COLORS.accent,
                    fontWeight: '600'
                  }}>
                    {safeTranslate(t, 'form.done', 'Done')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Picker Container */}
            <View style={{
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 24,
              backgroundColor: COLORS.background,
            }}>
              <DateTimePicker
                value={tempDate || value || defaultDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
                style={{
                  height: 200,
                  backgroundColor: COLORS.background,
                }}
                textColor={COLORS.text}
              />
            </View>

            {/* Footer spacing */}
            <View style={{ height: 40, backgroundColor: COLORS.background }} />
          </View>
        </Modal>
      )}

      {/* Android/Web Picker */}
      {(Platform.OS === 'android' || Platform.OS === 'web') && showPicker && (
        <DateTimePicker
          value={value || defaultDate}
          mode="date"
          display={Platform.OS === 'web' ? 'default' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1950, 0, 1)}
        />
      )}
    </View>
  );
};

// Multi-Select Component
export const FormMultiSelect = ({ label, required, value = [], onSelectionChange, options, placeholder }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const toggleSelection = (option) => {
    const newSelection = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    onSelectionChange(newSelection);
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <FormLabel text={label} required={required} />
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          minHeight: 56,
        }}
        onPress={() => setShowModal(true)}
      >
        <Text style={{
          fontSize: 16,
          color: value.length > 0 ? COLORS.text : COLORS.textSecondary,
        }}>
          {value.length > 0 ? value.join(', ') : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 24, paddingTop: 60 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 16, color: COLORS.accent }}>{safeTranslate(t, 'form.done', 'Done')}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '300', color: COLORS.text }}>
              {label}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
              {value.length} {safeTranslate(t, 'form.selected', 'selected')}
            </Text>
          </View>

          <ScrollView>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  padding: 16,
                  backgroundColor: value.includes(option) ? COLORS.accent + '20' : COLORS.surface,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: value.includes(option) ? COLORS.accent : COLORS.border,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={() => toggleSelection(option)}
              >
                <Text style={{
                  fontSize: 16,
                  color: value.includes(option) ? COLORS.accent : COLORS.text,
                  fontWeight: value.includes(option) ? '500' : '300'
                }}>
                  {option}
                </Text>
                {value.includes(option) && (
                  <Text style={{ fontSize: 16, color: COLORS.accent }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};
