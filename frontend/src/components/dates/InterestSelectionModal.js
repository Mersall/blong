/**
 * BLONG Interest Selection Modal - Premium Elite Design
 * Modal for users to express interest in a date with optional message
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

const InterestSelectionModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  partnerName = 'your date',
  isRTL = false 
}) => {
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSubmit = () => {
    if (selectedResponse === null) return;
    
    const isInterested = selectedResponse === 'interested';
    const message = showCustomInput ? customMessage : '';
    
    onSubmit(isInterested, message);
    
    // Reset state
    setSelectedResponse(null);
    setCustomMessage('');
    setShowCustomInput(false);
  };

  const handleClose = () => {
    setSelectedResponse(null);
    setCustomMessage('');
    setShowCustomInput(false);
    onClose();
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
        Respond to Date
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
      }}>
        Let {partnerName} know if you're interested
      </Text>
    </View>
  );

  const renderInterestOptions = () => (
    <View style={{ marginVertical: 32 }}>
      {/* Interested Option */}
      <TouchableOpacity
        onPress={() => {
          setSelectedResponse('interested');
          setShowCustomInput(true);
        }}
        style={{
          backgroundColor: selectedResponse === 'interested' ? COLORS.success + '20' : COLORS.surface,
          borderWidth: 2,
          borderColor: selectedResponse === 'interested' ? COLORS.success : COLORS.border,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: 20,
          marginBottom: 8,
        }}>
          💕
        </Text>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '500',
          color: selectedResponse === 'interested' ? COLORS.success : COLORS.text,
          marginBottom: 4,
          textAlign: 'center',
        }}>
          I'm Interested!
        </Text>
        
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          Let's schedule this date
        </Text>
      </TouchableOpacity>

      {/* Not Interested Option */}
      <TouchableOpacity
        onPress={() => {
          setSelectedResponse('not_interested');
          setShowCustomInput(false);
        }}
        style={{
          backgroundColor: selectedResponse === 'not_interested' ? COLORS.error + '10' : COLORS.surface,
          borderWidth: 2,
          borderColor: selectedResponse === 'not_interested' ? COLORS.error : COLORS.border,
          borderRadius: 12,
          padding: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{
          fontSize: 20,
          marginBottom: 8,
        }}>
          🤝
        </Text>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '500',
          color: selectedResponse === 'not_interested' ? COLORS.error : COLORS.text,
          marginBottom: 4,
          textAlign: 'center',
        }}>
          Not This Time
        </Text>
        
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          We'll find you a better match
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCustomMessage = () => {
    if (!showCustomInput) return null;

    return (
      <View style={{ marginBottom: 32 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: COLORS.text,
          marginBottom: 12,
          textAlign: isRTL ? 'right' : 'left',
        }}>
          Add a personal message (optional)
        </Text>
        
        <TextInput
          value={customMessage}
          onChangeText={setCustomMessage}
          placeholder="Say something nice..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          numberOfLines={3}
          maxLength={200}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 16,
            fontSize: 16,
            color: COLORS.text,
            borderWidth: 1,
            borderColor: COLORS.border,
            textAlignVertical: 'top',
            minHeight: 80,
            textAlign: isRTL ? 'right' : 'left',
          }}
        />
        
        <Text style={{
          fontSize: 12,
          color: COLORS.textTertiary,
          textAlign: isRTL ? 'left' : 'right',
          marginTop: 8,
        }}>
          {customMessage.length}/200
        </Text>
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
        disabled={selectedResponse === null}
        style={{
          flex: 1,
          backgroundColor: selectedResponse !== null ? COLORS.accent : COLORS.border,
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
          Send Response
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
      }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <View style={{
            backgroundColor: COLORS.background,
            borderRadius: 16,
            padding: 32,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 8,
          }}>
            {renderHeader()}
            {renderInterestOptions()}
            {renderCustomMessage()}
            {renderActionButtons()}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default InterestSelectionModal;
