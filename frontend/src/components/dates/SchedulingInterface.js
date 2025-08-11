/**
 * BLONG Scheduling Interface - Premium Elite Design
 * Interface for users to select preferred date times
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  error: '#F44336',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const SchedulingInterface = ({ 
  visible, 
  onClose, 
  onSubmit, 
  date,
  isRTL = false 
}) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleClose = () => {
    setSelectedDates([]);
    setShowDatePicker(false);
    setShowTimePicker(false);
    onClose();
  };

  const handleSubmit = () => {
    if (selectedDates.length === 0) {
      Alert.alert('Please select at least one preferred time');
      return;
    }

    const preferredDates = selectedDates.map(dateTime => dateTime.toISOString());
    const availability = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferences: 'flexible',
    };

    onSubmit(preferredDates, availability);
    handleClose();
  };

  const addDateTime = () => {
    // Combine current date and time
    const combinedDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    );

    // Check if it's in the future
    if (combinedDateTime <= new Date()) {
      Alert.alert('Please select a future date and time');
      return;
    }

    // Check if already selected
    const alreadySelected = selectedDates.some(
      selectedDate => Math.abs(selectedDate.getTime() - combinedDateTime.getTime()) < 60000
    );

    if (alreadySelected) {
      Alert.alert('This time slot is already selected');
      return;
    }

    setSelectedDates([...selectedDates, combinedDateTime]);
  };

  const removeDateTime = (index) => {
    const newDates = selectedDates.filter((_, i) => i !== index);
    setSelectedDates(newDates);
  };

  const formatDateTime = (dateTime) => {
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date} at ${time}`;
  };

  const renderHeader = () => (
    <View style={{
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: '300',
        color: COLORS.text,
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
      }}>
        Schedule Your Date
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
      }}>
        Select your preferred times with {date?.partner?.firstName}
      </Text>
    </View>
  );

  const renderDateTimeSelector = () => (
    <View style={{ marginVertical: 32 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 16,
        textAlign: isRTL ? 'right' : 'left',
      }}>
        Add Preferred Times
      </Text>

      {/* Date Selection */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{
          fontSize: 16,
          color: COLORS.text,
        }}>
          📅 {currentDate.toLocaleDateString()}
        </Text>
        <Text style={{
          fontSize: 14,
          color: COLORS.accent,
          fontWeight: '500',
        }}>
          Change Date
        </Text>
      </TouchableOpacity>

      {/* Time Selection */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{
          fontSize: 16,
          color: COLORS.text,
        }}>
          🕐 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={{
          fontSize: 14,
          color: COLORS.accent,
          fontWeight: '500',
        }}>
          Change Time
        </Text>
      </TouchableOpacity>

      {/* Add Button */}
      <TouchableOpacity
        onPress={addDateTime}
        style={{
          backgroundColor: COLORS.accent,
          borderRadius: 8,
          padding: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.background,
        }}>
          Add This Time Slot
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSelectedTimes = () => {
    if (selectedDates.length === 0) {
      return (
        <View style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 20,
          alignItems: 'center',
          marginBottom: 32,
        }}>
          <Text style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            textAlign: 'center',
          }}>
            No times selected yet
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.textTertiary,
            textAlign: 'center',
            marginTop: 4,
          }}>
            Add at least one preferred time
          </Text>
        </View>
      );
    }

    return (
      <View style={{ marginBottom: 32 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '500',
          color: COLORS.text,
          marginBottom: 16,
          textAlign: isRTL ? 'right' : 'left',
        }}>
          Your Preferred Times ({selectedDates.length})
        </Text>

        {selectedDates.map((dateTime, index) => (
          <View
            key={index}
            style={{
              backgroundColor: COLORS.success + '10',
              borderRadius: 8,
              padding: 16,
              marginBottom: 8,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: COLORS.success + '30',
            }}
          >
            <Text style={{
              fontSize: 16,
              color: COLORS.success,
              fontWeight: '500',
            }}>
              {formatDateTime(dateTime)}
            </Text>

            <TouchableOpacity
              onPress={() => removeDateTime(index)}
              style={{
                backgroundColor: COLORS.error + '20',
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{
                fontSize: 16,
                color: COLORS.error,
                fontWeight: 'bold',
              }}>
                ×
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderActionButtons = () => (
    <View style={{
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 16,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    }}>
      <TouchableOpacity
        onPress={handleClose}
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          paddingVertical: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}>
          Cancel
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={selectedDates.length === 0}
        style={{
          flex: 1,
          backgroundColor: selectedDates.length > 0 ? COLORS.success : COLORS.border,
          paddingVertical: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.background,
          textAlign: 'center',
        }}>
          Submit Schedule
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: COLORS.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '90%',
          paddingTop: 32,
          paddingHorizontal: 32,
          paddingBottom: 32,
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderHeader()}
            {renderDateTimeSelector()}
            {renderSelectedTimes()}
            {renderActionButtons()}
          </ScrollView>
        </View>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setCurrentDate(selectedDate);
            }
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={currentTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setCurrentTime(selectedTime);
            }
          }}
        />
      )}
    </Modal>
  );
};

export default SchedulingInterface;
