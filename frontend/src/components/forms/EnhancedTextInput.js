/**
 * Enhanced Text Input Component
 * Premium text input with password visibility toggle and elegant styling
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const EnhancedTextInput = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  secureTextEntry = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  error,
  style = {},
  inputStyle = {},
  colors,
  isRTL = false,
  ...props
}) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    inputContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? '#EF4444' : colors.border,
      borderRadius: 12,
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      minHeight: 56,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      textAlign: isRTL ? 'right' : 'left',
      paddingVertical: 16,
      outline: 'none', // Remove web focus outline
      minHeight: 24, // Ensure consistent height on web
    },
    toggleButton: {
      padding: 8,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
    },
    toggleText: {
      fontSize: 14,
      color: colors.accent,
      fontWeight: '500',
    },
    errorText: {
      fontSize: 12,
      color: '#EF4444',
      marginTop: 4,
      marginHorizontal: 4,
      textAlign: isRTL ? 'right' : 'left',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={onTogglePassword}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.toggleText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default EnhancedTextInput;
