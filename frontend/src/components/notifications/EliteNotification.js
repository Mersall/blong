/**
 * BLONG Elite Notification System
 * Premium notification components with sophisticated animations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useRTL } from '../../contexts/AppContext';

const { width: screenWidth } = Dimensions.get('window');

// Notification types with their styling
const NOTIFICATION_TYPES = {
  success: {
    colors: ['#4CAF50', '#66BB6A'],
    icon: '✓',
    shadowColor: '#4CAF50',
  },
  error: {
    colors: ['#F44336', '#EF5350'],
    icon: '✕',
    shadowColor: '#F44336',
  },
  warning: {
    colors: ['#FF9800', '#FFA726'],
    icon: '⚠',
    shadowColor: '#FF9800',
  },
  info: {
    colors: ['#2196F3', '#42A5F5'],
    icon: 'ℹ',
    shadowColor: '#2196F3',
  },
};

/**
 * Elegant slide-in notification banner
 */
export const EliteNotificationBanner = ({ 
  visible, 
  type = 'info', 
  title, 
  message, 
  onDismiss,
  duration = 4000,
  action,
  onActionPress,
}) => {
  const { colors } = useTheme();
  const { isRTL, rtlStyles } = useRTL();
  const [slideAnim] = useState(new Animated.Value(-screenWidth));
  const [opacityAnim] = useState(new Animated.Value(0));

  const notificationStyle = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.info;

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          dismissNotification();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      dismissNotification();
    }
  }, [visible]);

  const dismissNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateX: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <LinearGradient
        colors={notificationStyle.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 16,
          padding: 20,
          shadowColor: notificationStyle.shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
        }}>
          {/* Icon */}
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            ...rtlStyles.marginRight(12),
          }}>
            <Text style={{
              fontSize: 16,
              color: colors.background,
              fontWeight: 'bold',
            }}>
              {notificationStyle.icon}
            </Text>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.background,
              marginBottom: 4,
              textAlign: rtlStyles.textAlign,
            }}>
              {title}
            </Text>
            
            {message && (
              <Text style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 20,
                textAlign: rtlStyles.textAlign,
              }}>
                {message}
              </Text>
            )}

            {/* Action Button */}
            {action && onActionPress && (
              <TouchableOpacity
                style={{
                  marginTop: 12,
                  alignSelf: isRTL ? 'flex-end' : 'flex-start',
                }}
                onPress={onActionPress}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.background,
                  textDecorationLine: 'underline',
                }}>
                  {action}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Dismiss Button */}
          <TouchableOpacity
            style={{
              padding: 4,
              ...rtlStyles.marginLeft(8),
            }}
            onPress={dismissNotification}
          >
            <Text style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 'bold',
            }}>
              ×
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

/**
 * Elegant modal-style notification for critical messages
 */
export const EliteNotificationModal = ({
  visible,
  type = 'info',
  title,
  message,
  primaryAction,
  secondaryAction,
  onPrimaryPress,
  onSecondaryPress,
  onDismiss,
}) => {
  const { colors } = useTheme();
  const { isRTL, rtlStyles } = useRTL();
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [opacityAnim] = useState(new Animated.Value(0));

  const notificationStyle = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.info;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const dismissModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={dismissModal}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: '100%',
            maxWidth: 400,
          }}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 20,
              padding: 32,
              alignItems: 'center',
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            {/* Icon */}
            <LinearGradient
              colors={notificationStyle.colors}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <Text style={{
                fontSize: 28,
                color: colors.background,
                fontWeight: 'bold',
              }}>
                {notificationStyle.icon}
              </Text>
            </LinearGradient>

            {/* Title */}
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: colors.text,
              textAlign: 'center',
              marginBottom: 12,
            }}>
              {title}
            </Text>

            {/* Message */}
            {message && (
              <Text style={{
                fontSize: 16,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 32,
              }}>
                {message}
              </Text>
            )}

            {/* Actions */}
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              width: '100%',
              gap: 12,
            }}>
              {secondaryAction && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (typeof secondaryAction === 'object' && secondaryAction.onPress) {
                      secondaryAction.onPress();
                    } else if (onSecondaryPress) {
                      onSecondaryPress();
                    }
                    dismissModal();
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.textSecondary,
                  }}>
                    {typeof secondaryAction === 'object' ? secondaryAction.label : secondaryAction}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  if (typeof primaryAction === 'object' && primaryAction.onPress) {
                    primaryAction.onPress();
                  } else if (onPrimaryPress) {
                    onPrimaryPress();
                  }
                  dismissModal();
                }}
              >
                <LinearGradient
                  colors={notificationStyle.colors}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.background,
                  }}>
                    {typeof primaryAction === 'object' && primaryAction.label ? primaryAction.label : (primaryAction || 'OK')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default {
  EliteNotificationBanner,
  EliteNotificationModal,
};
