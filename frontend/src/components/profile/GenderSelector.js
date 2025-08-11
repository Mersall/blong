/**
 * BLONG Gender Selector Component
 * Improved gender selection with inclusive options and better UX
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GENDER_OPTIONS } from '../../utils/profileValidation';

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

const GenderSelector = ({ 
  value, 
  onSelect, 
  required = false, 
  style = {},
  disabled = false 
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const selectedOption = GENDER_OPTIONS.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : 'Select your gender';

  const handleSelect = (selectedValue) => {
    onSelect(selectedValue);
    setShowModal(false);
  };

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
          Gender
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

      {/* Selector Button */}
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
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Gender selection. Currently selected: ${displayText}`}
        accessibilityHint="Opens gender selection options"
      >
        <Text style={{
          fontSize: 16,
          color: value ? COLORS.text : COLORS.textTertiary,
          fontWeight: value ? '400' : '300',
        }}>
          {displayText}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={disabled ? COLORS.textTertiary : COLORS.textSecondary} 
        />
      </TouchableOpacity>

      {/* Selection Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: COLORS.background,
          paddingTop: 60,
          paddingHorizontal: 24,
        }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 32,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}>
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              style={{ padding: 8 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel gender selection"
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
              Select Gender
            </Text>
            
            <View style={{ width: 60 }} />
          </View>

          {/* Options */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {GENDER_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  padding: 20,
                  backgroundColor: value === option.value ? COLORS.accent + '10' : COLORS.surface,
                  borderRadius: 8,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: value === option.value ? COLORS.accent : COLORS.border,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  shadowColor: COLORS.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: value === option.value ? 0.05 : 0.02,
                  shadowRadius: 4,
                  elevation: value === option.value ? 2 : 1,
                }}
                onPress={() => handleSelect(option.value)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Select ${option.label} as gender`}
                accessibilityState={{ selected: value === option.value }}
              >
                <Text style={{
                  fontSize: 16,
                  color: value === option.value ? COLORS.accent : COLORS.text,
                  fontWeight: value === option.value ? '500' : '300',
                }}>
                  {option.label}
                </Text>
                
                {value === option.value && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={COLORS.accent} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer Info */}
          <View style={{ 
            paddingVertical: 24,
            paddingHorizontal: 16,
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            marginTop: 24,
            marginBottom: 40,
          }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 18,
            }}>
              Your gender helps us provide better matches and experiences. 
              This information is used for matching purposes only.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GenderSelector;
