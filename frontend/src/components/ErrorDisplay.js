/**
 * BLONG Error Display Component
 * User-friendly error display with actionable buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getUserErrorMessage } from '../utils/errorHandler';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  onDismiss, 
  context = {},
  style = {},
  compact = false 
}) => {
  if (!error) return null;

  const errorInfo = getUserErrorMessage(error, context);

  const COLORS = {
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#0A0A0A',
    textSecondary: '#6B6B6B',
    textTertiary: '#9E9E9E',
    accent: '#FF6B35',
    border: '#E0E0E0',
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
  };

  const getErrorColor = (type) => {
    switch (type) {
      case 'NETWORK_ERROR':
      case 'TIMEOUT_ERROR':
        return COLORS.warning;
      case 'SERVER_ERROR':
      case 'UNKNOWN_ERROR':
        return COLORS.error;
      case 'VALIDATION_ERROR':
        return COLORS.warning;
      case 'SESSION_EXPIRED':
      case 'UNAUTHORIZED':
        return COLORS.accent;
      default:
        return COLORS.error;
    }
  };

  const errorColor = getErrorColor(errorInfo.type);

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <View style={styles.compactContent}>
          <Text style={styles.compactIcon}>{errorInfo.icon}</Text>
          <View style={styles.compactText}>
            <Text style={styles.compactTitle}>{errorInfo.title}</Text>
            <Text style={styles.compactMessage}>{errorInfo.message}</Text>
          </View>
          {onRetry && (
            <TouchableOpacity
              style={[styles.compactButton, { backgroundColor: errorColor }]}
              onPress={onRetry}
            >
              <Text style={styles.compactButtonText}>{errorInfo.action}</Text>
            </TouchableOpacity>
          )}
        </View>
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.icon}>{errorInfo.icon}</Text>
        <Text style={styles.title}>{errorInfo.title}</Text>
        <Text style={styles.message}>{errorInfo.message}</Text>
        
        <View style={styles.actions}>
          {onRetry && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: errorColor }]}
              onPress={onRetry}
            >
              <Text style={styles.primaryButtonText}>{errorInfo.action}</Text>
            </TouchableOpacity>
          )}
          
          {onDismiss && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onDismiss}
            >
              <Text style={styles.secondaryButtonText}>Dismiss</Text>
            </TouchableOpacity>
          )}
        </View>

        {__DEV__ && errorInfo.id && (
          <Text style={styles.errorId}>ID: {errorInfo.id}</Text>
        )}
      </View>
    </View>
  );
};

const styles = {
  // Full error display
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#0A0A0A',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
  },
  secondaryButton: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButtonText: {
    color: '#6B6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  errorId: {
    fontSize: 10,
    color: '#9E9E9E',
    fontFamily: 'monospace',
  },

  // Compact error display
  compactContainer: {
    backgroundColor: '#FFF3F0',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  compactText: {
    flex: 1,
    marginRight: 12,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0A0A0A',
    marginBottom: 2,
  },
  compactMessage: {
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 16,
  },
  compactButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
  },
  compactButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissButtonText: {
    color: '#9E9E9E',
    fontSize: 16,
    fontWeight: '500',
  },
};

export default ErrorDisplay;
