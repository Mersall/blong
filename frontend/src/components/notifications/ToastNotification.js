/**
 * BLONG Toast Notification System
 * Comprehensive toast notifications for user feedback
 */

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { PremiumSpinner } from '../loading';

const { width: screenWidth } = Dimensions.get('window');

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  accent: '#FF6B35',
  success: '#10B981',
  error: '#DC2626',
  warning: '#F59E0B',
  info: '#3B82F6',
  shadow: '#000000',
};

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

// Toast positions
export const TOAST_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  CENTER: 'center',
};

// Default configuration
const DEFAULT_CONFIG = {
  duration: 4000,
  position: TOAST_POSITIONS.TOP,
  dismissible: true,
  showProgress: false,
  maxToasts: 3,
};

// Toast Context
const ToastContext = createContext(null);

// Individual Toast Component
const Toast = ({ 
  id,
  type = TOAST_TYPES.INFO,
  title,
  message,
  duration = DEFAULT_CONFIG.duration,
  dismissible = DEFAULT_CONFIG.dismissible,
  showProgress = DEFAULT_CONFIG.showProgress,
  onDismiss,
  onPress,
  position = TOAST_POSITIONS.TOP,
}) => {
  const translateY = useRef(new Animated.Value(position === TOAST_POSITIONS.TOP ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(100)).current;
  const [isVisible, setIsVisible] = useState(true);

  const getTypeConfig = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          backgroundColor: COLORS.success + 'E6',
          borderColor: COLORS.success,
          iconColor: COLORS.success,
          icon: '✅',
        };
      case TOAST_TYPES.ERROR:
        return {
          backgroundColor: COLORS.error + 'E6',
          borderColor: COLORS.error,
          iconColor: COLORS.error,
          icon: '❌',
        };
      case TOAST_TYPES.WARNING:
        return {
          backgroundColor: COLORS.warning + 'E6',
          borderColor: COLORS.warning,
          iconColor: COLORS.warning,
          icon: '⚠️',
        };
      case TOAST_TYPES.LOADING:
        return {
          backgroundColor: COLORS.info + 'E6',
          borderColor: COLORS.info,
          iconColor: COLORS.info,
          icon: null, // Will show spinner instead
        };
      default:
        return {
          backgroundColor: COLORS.info + 'E6',
          borderColor: COLORS.info,
          iconColor: COLORS.info,
          icon: 'ℹ️',
        };
    }
  };

  const typeConfig = getTypeConfig();

  useEffect(() => {
    // Show animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation for dismissible toasts
    if (showProgress && duration > 0) {
      Animated.timing(progressWidth, {
        toValue: 0,
        duration: duration,
        useNativeDriver: false,
      }).start();
    }

    // Auto-dismiss
    if (duration > 0 && type !== TOAST_TYPES.LOADING) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    if (!isVisible) return;
    
    setIsVisible(false);
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === TOAST_POSITIONS.TOP ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.(id);
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (dismissible) {
      handleDismiss();
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 1000 + parseInt(id.slice(-3)) || 1000,
        ...(position === TOAST_POSITIONS.TOP ? { top: Platform.OS === 'ios' ? 50 : 20 } : {}),
        ...(position === TOAST_POSITIONS.BOTTOM ? { bottom: Platform.OS === 'ios' ? 50 : 20 } : {}),
      }}
    >
      <TouchableOpacity
        activeOpacity={dismissible ? 0.8 : 1}
        onPress={handlePress}
        style={{
          backgroundColor: typeConfig.backgroundColor,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: typeConfig.borderColor,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
          maxWidth: screenWidth - 32,
        }}
      >
        {/* Icon or Spinner */}
        <View style={{ marginRight: 12, minWidth: 20, alignItems: 'center' }}>
          {type === TOAST_TYPES.LOADING ? (
            <PremiumSpinner size="small" color={typeConfig.iconColor} />
          ) : (
            <Text style={{ fontSize: 16 }}>{typeConfig.icon}</Text>
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {title && (
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.text,
              marginBottom: message ? 2 : 0,
            }}>
              {title}
            </Text>
          )}
          
          {message && (
            <Text style={{
              fontSize: 13,
              color: COLORS.textSecondary,
              lineHeight: 18,
            }}>
              {message}
            </Text>
          )}
        </View>

        {/* Dismiss Button */}
        {dismissible && (
          <TouchableOpacity
            onPress={handleDismiss}
            style={{
              marginLeft: 8,
              padding: 4,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>×</Text>
          </TouchableOpacity>
        )}

        {/* Progress Bar */}
        {showProgress && duration > 0 && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: typeConfig.borderColor + '30',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}>
            <Animated.View style={{
              height: 2,
              backgroundColor: typeConfig.borderColor,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              width: progressWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            }} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Toast Manager Component
export const ToastManager = ({ children, maxToasts = DEFAULT_CONFIG.maxToasts }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);

  const showToast = (config) => {
    const id = `toast_${Date.now()}_${++toastIdCounter.current}`;
    const toast = {
      id,
      ...DEFAULT_CONFIG,
      ...config,
      timestamp: Date.now(),
    };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      
      // Limit number of toasts
      if (newToasts.length > maxToasts) {
        return newToasts.slice(0, maxToasts);
      }
      
      return newToasts;
    });

    return id;
  };

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const hideAllToasts = () => {
    setToasts([]);
  };

  const updateToast = (id, updates) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  };

  // Convenience methods
  const success = (title, message, options = {}) => 
    showToast({ type: TOAST_TYPES.SUCCESS, title, message, ...options });

  const error = (title, message, options = {}) => 
    showToast({ type: TOAST_TYPES.ERROR, title, message, duration: 6000, ...options });

  const warning = (title, message, options = {}) => 
    showToast({ type: TOAST_TYPES.WARNING, title, message, ...options });

  const info = (title, message, options = {}) => 
    showToast({ type: TOAST_TYPES.INFO, title, message, ...options });

  const loading = (title, message, options = {}) => 
    showToast({ type: TOAST_TYPES.LOADING, title, message, duration: 0, dismissible: false, ...options });

  const contextValue = {
    showToast,
    hideToast,
    hideAllToasts,
    updateToast,
    success,
    error,
    warning,
    info,
    loading,
    toasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Render Toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={hideToast}
        />
      ))}
    </ToastContext.Provider>
  );
};

// Hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastManager');
  }
  return context;
};

export default ToastManager;