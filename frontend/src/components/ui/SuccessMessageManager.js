/**
 * BLONG Success Message Manager
 * Comprehensive success notification system with animations and context-aware messages
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  error: '#F44336',
};

const SUCCESS_TYPES = {
  PROFILE_UPDATED: 'profile_updated',
  QUIZ_COMPLETED: 'quiz_completed',
  DATE_BOOKED: 'date_booked',
  PHOTO_UPLOADED: 'photo_uploaded',
  PREFERENCES_SAVED: 'preferences_saved',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  FEEDBACK_SENT: 'feedback_sent',
  PAYMENT_PROCESSED: 'payment_processed',
  EMAIL_VERIFIED: 'email_verified',
  PASSWORD_CHANGED: 'password_changed',
  ACCOUNT_CREATED: 'account_created',
  DATA_SYNCED: 'data_synced',
  BACKUP_CREATED: 'backup_created',
  SETTINGS_SAVED: 'settings_saved',
  GENERIC: 'generic',
};

const SuccessMessageManager = ({
  visible = false,
  type = SUCCESS_TYPES.GENERIC,
  title,
  message,
  subtitle,
  icon,
  duration = 4000,
  position = 'top', // 'top', 'center', 'bottom'
  style = 'card', // 'card', 'banner', 'toast', 'modal'
  showConfetti = false,
  onClose,
  onAction,
  actionText,
  autoHide = true,
  hapticFeedback = true,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(visible);
  const [showContent, setShowContent] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      showMessage();
    } else {
      hideMessage();
    }
  }, [visible]);

  useEffect(() => {
    if (isVisible && autoHide && duration > 0) {
      const timer = setTimeout(() => {
        hideMessage();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration]);

  const showMessage = () => {
    setIsVisible(true);
    setShowContent(true);

    // Haptic feedback
    if (hapticFeedback) {
      try {
        const Haptics = require('expo-haptics');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        // Haptics not available
      }
    }

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti animation
    if (showConfetti) {
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const hideMessage = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      setShowContent(false);
      onClose?.();
    });
  };

  const getSuccessConfig = () => {
    const configs = {
      [SUCCESS_TYPES.PROFILE_UPDATED]: {
        icon: 'person-circle',
        title: t('success.profileUpdated'),
        message: t('success.profileUpdatedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.QUIZ_COMPLETED]: {
        icon: 'checkmark-circle',
        title: t('success.quizCompleted'),
        message: t('success.quizCompletedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.DATE_BOOKED]: {
        icon: 'calendar',
        title: t('success.dateBooked'),
        message: t('success.dateBookedMessage'),
        color: COLORS.accent,
      },
      [SUCCESS_TYPES.PHOTO_UPLOADED]: {
        icon: 'camera',
        title: t('success.photoUploaded'),
        message: t('success.photoUploadedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.PREFERENCES_SAVED]: {
        icon: 'settings',
        title: t('success.preferencesUpdated'),
        message: t('success.preferencesUpdatedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.ASSESSMENT_COMPLETED]: {
        icon: 'trophy',
        title: t('success.assessmentCompleted'),
        message: t('success.assessmentCompletedMessage'),
        color: COLORS.accent,
      },
      [SUCCESS_TYPES.FEEDBACK_SENT]: {
        icon: 'chatbubble',
        title: t('success.feedbackSent'),
        message: t('success.feedbackSentMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.PAYMENT_PROCESSED]: {
        icon: 'card',
        title: t('success.paymentProcessed'),
        message: t('success.paymentProcessedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.EMAIL_VERIFIED]: {
        icon: 'mail',
        title: t('success.emailVerified'),
        message: t('success.emailVerifiedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.PASSWORD_CHANGED]: {
        icon: 'lock-closed',
        title: t('success.passwordChanged'),
        message: t('success.passwordChangedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.ACCOUNT_CREATED]: {
        icon: 'person-add',
        title: t('success.accountCreated'),
        message: t('success.accountCreatedMessage'),
        color: COLORS.accent,
      },
      [SUCCESS_TYPES.DATA_SYNCED]: {
        icon: 'sync',
        title: t('success.dataSynced'),
        message: t('success.dataSyncedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.BACKUP_CREATED]: {
        icon: 'cloud-upload',
        title: t('success.backupCreated'),
        message: t('success.backupCreatedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.SETTINGS_SAVED]: {
        icon: 'checkmark',
        title: t('success.settingsSaved'),
        message: t('success.settingsSavedMessage'),
        color: COLORS.success,
      },
      [SUCCESS_TYPES.GENERIC]: {
        icon: 'checkmark-circle',
        title: t('success.success'),
        message: t('success.operationCompleted'),
        color: COLORS.success,
      },
    };

    return configs[type] || configs[SUCCESS_TYPES.GENERIC];
  };

  if (!isVisible || !showContent) {
    return null;
  }

  const config = getSuccessConfig();
  const finalTitle = title || config.title;
  const finalMessage = message || config.message;
  const finalIcon = icon || config.icon;
  const finalColor = config.color;

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: 60, left: 16, right: 16 };
      case 'center':
        return {
          top: screenHeight / 2 - 100,
          left: 32,
          right: 32,
          alignSelf: 'center'
        };
      case 'bottom':
        return { bottom: 100, left: 16, right: 16 };
      default:
        return { top: 60, left: 16, right: 16 };
    }
  };

  const renderContent = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    }}>
      {/* Icon */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          marginRight: 16,
        }}
      >
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: finalColor + '15',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons
            name={finalIcon}
            size={24}
            color={finalColor}
          />
        </View>
      </Animated.View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 4,
        }}>
          {finalTitle}
        </Text>

        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          lineHeight: 20,
        }}>
          {finalMessage}
        </Text>

        {subtitle && (
          <Text style={{
            fontSize: 12,
            color: COLORS.textTertiary,
            marginTop: 4,
          }}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Action Button */}
      {actionText && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={{
            backgroundColor: finalColor,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginLeft: 12,
          }}
        >
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: COLORS.background,
          }}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}

      {/* Close Button */}
      <TouchableOpacity
        onPress={hideMessage}
        style={{
          padding: 8,
          marginLeft: 8,
        }}
      >
        <Ionicons
          name="close"
          size={20}
          color={COLORS.textTertiary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: 1000,
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
        getPositionStyle(),
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onAction || hideMessage}
        style={{
          backgroundColor: COLORS.background,
          borderRadius: 12,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: finalColor + '20',
        }}
      >
        {renderContent()}
      </TouchableOpacity>

      {/* Confetti Effect */}
      {showConfetti && (
        <Animated.View
          style={{
            position: 'absolute',
            top: -20,
            left: 0,
            right: 0,
            height: 100,
            opacity: confettiAnim,
            pointerEvents: 'none',
          }}
        >
          {/* Simple confetti representation */}
          {[...Array(20)].map((_, index) => (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                width: 6,
                height: 6,
                backgroundColor: [COLORS.accent, COLORS.success, COLORS.warning][index % 3],
                borderRadius: 3,
                left: Math.random() * screenWidth,
                top: Math.random() * 50,
                transform: [
                  {
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  },
                  {
                    rotate: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
            />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

// Export success types for easy usage
SuccessMessageManager.TYPES = SUCCESS_TYPES;

export default SuccessMessageManager;
export { SUCCESS_TYPES };