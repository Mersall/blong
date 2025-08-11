/**
 * BLONG Premium Error Modal
 * Beautiful, user-friendly error modal with modern design and comprehensive error handling
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions, 
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Share,
  Clipboard,
  Alert,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, TIMING } from '../../design-system/DesignTokens';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Error type configurations with icons and colors
const ERROR_CONFIGS = {
  network: {
    icon: 'wifi-off',
    iconSet: 'Ionicons',
    color: COLORS.info,
    backgroundColor: COLORS.infoLight,
    borderColor: COLORS.info,
    gradient: [COLORS.infoLight, COLORS.info + '10'],
  },
  validation: {
    icon: 'alert-circle',
    iconSet: 'Ionicons',
    color: COLORS.warning,
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    gradient: [COLORS.warningLight, COLORS.warning + '10'],
  },
  authentication: {
    icon: 'lock-closed',
    iconSet: 'Ionicons',
    color: COLORS.error,
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
    gradient: [COLORS.errorLight, COLORS.error + '10'],
  },
  server: {
    icon: 'server',
    iconSet: 'Ionicons',
    color: COLORS.error,
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
    gradient: [COLORS.errorLight, COLORS.error + '10'],
  },
  timeout: {
    icon: 'time',
    iconSet: 'Ionicons',
    color: COLORS.warning,
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    gradient: [COLORS.warningLight, COLORS.warning + '10'],
  },
  permission: {
    icon: 'shield-off',
    iconSet: 'Ionicons',
    color: COLORS.warning,
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    gradient: [COLORS.warningLight, COLORS.warning + '10'],
  },
  unknown: {
    icon: 'help-circle',
    iconSet: 'Ionicons',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    gradient: [COLORS.surface, COLORS.textTertiary + '10'],
  },
};

const PremiumErrorModal = ({
  visible = false,
  onClose,
  onRetry,
  onContactSupport,
  error = null,
  title,
  message,
  errorType = 'unknown',
  showRetry = false,
  showSupport = false,
  showCopyDetails = true,
  autoHide = false,
  autoHideDelay = 5000,
  customActions = [],
  testID = 'premium-error-modal',
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(visible);
  const [showDetails, setShowDetails] = useState(false);
  
  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(screenHeight)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const detailsHeight = useRef(new Animated.Value(0)).current;

  // Auto-hide timer
  const autoHideTimer = useRef(null);

  const config = ERROR_CONFIGS[errorType] || ERROR_CONFIGS.unknown;

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      showModal();
      startIconPulse();
      
      if (autoHide) {
        autoHideTimer.current = setTimeout(() => {
          handleClose();
        }, autoHideDelay);
      }
    } else {
      hideModal();
    }

    return () => {
      if (autoHideTimer.current) {
        clearTimeout(autoHideTimer.current);
      }
    };
  }, [visible]);

  const startIconPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(iconPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const showModal = () => {
    const animations = [
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: TIMING.component.modal,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: TIMING.component.modal,
          useNativeDriver: true,
        }),
      ]),
    ];

    Animated.sequence(animations).start();

    // Haptic feedback
    if (Haptics?.notificationAsync) {
      const feedbackType = errorType === 'validation' || errorType === 'network' 
        ? Haptics.NotificationFeedbackType.Warning 
        : Haptics.NotificationFeedbackType.Error;
      Haptics.notificationAsync(feedbackType);
    }
  };

  const hideModal = () => {
    const animations = [
      Animated.parallel([
        Animated.timing(modalScale, {
          toValue: 0.8,
          duration: TIMING.fast,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: TIMING.fast,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: TIMING.fast,
        useNativeDriver: true,
      }),
    ];

    Animated.sequence(animations).start(() => {
      setIsVisible(false);
      setShowDetails(false);
      detailsHeight.setValue(0);
    });
  };

  const handleClose = () => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
    }
    hideModal();
    setTimeout(() => onClose?.(), TIMING.fast);
  };

  const handleRetry = () => {
    handleClose();
    setTimeout(() => onRetry?.(), TIMING.fast);
  };

  const handleContactSupport = () => {
    handleClose();
    setTimeout(() => onContactSupport?.(), TIMING.fast);
  };

  const toggleDetails = () => {
    const newShowDetails = !showDetails;
    setShowDetails(newShowDetails);
    
    Animated.timing(detailsHeight, {
      toValue: newShowDetails ? 150 : 0,
      duration: TIMING.base,
      useNativeDriver: false,
    }).start();

    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const copyErrorDetails = async () => {
    const errorDetails = `
Error Type: ${errorType}
Title: ${title || 'Unknown Error'}
Message: ${message || 'No details available'}
${error ? `Raw Error: ${JSON.stringify(error, null, 2)}` : ''}
Timestamp: ${new Date().toISOString()}
Platform: ${Platform.OS} ${Platform.Version}
    `.trim();

    try {
      await Clipboard.setStringAsync(errorDetails);
      
      Alert.alert(
        t('common.success') || 'Success',
        t('errors.details.copied') || 'Error details copied to clipboard',
        [{ text: t('common.ok') || 'OK' }]
      );

      if (Haptics?.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (copyError) {
      console.error('Failed to copy error details:', copyError);
    }
  };

  const shareErrorDetails = async () => {
    const errorDetails = `BLONG Error Report\n\nType: ${errorType}\nTitle: ${title}\nMessage: ${message}\nTime: ${new Date().toLocaleString()}`;
    
    try {
      await Share.share({
        message: errorDetails,
        title: 'BLONG Error Report',
      });
    } catch (shareError) {
      console.error('Failed to share error details:', shareError);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.View 
        style={[
          styles.iconContainer,
          { 
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
            transform: [{ scale: iconPulse }],
          }
        ]}
      >
        <Ionicons 
          name={config.icon} 
          size={32} 
          color={config.color} 
        />
      </Animated.View>
      
      <Text style={[styles.title, { color: config.color }]}>
        {title || t(`errors.${errorType}.title`) || t('errors.unknown.title') || 'Error Occurred'}
      </Text>
      
      <Text style={styles.message}>
        {message || t(`errors.${errorType}.message`) || t('errors.unknown.message') || 'An unexpected error occurred. Please try again.'}
      </Text>
    </View>
  );

  const renderRecoverySteps = () => {
    if (!error?.recoverySteps || error.recoverySteps.length === 0) {
      return null;
    }

    return (
      <View style={styles.recoveryContainer}>
        <Text style={styles.recoveryTitle}>
          {t('errors.recoverySteps') || 'How to fix this:'}
        </Text>
        {error.recoverySteps.map((step, index) => (
          <View key={index} style={styles.recoveryStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
        {error.estimatedResolutionTime && (
          <Text style={styles.resolutionTime}>
            ⏱️ {error.estimatedResolutionTime}
          </Text>
        )}
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      {/* Primary Actions */}
      <View style={styles.primaryActions}>
        {showRetry && (
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: config.color }]}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color={COLORS.textInverse} />
            <Text style={styles.primaryButtonText}>
              {t('common.tryAgain') || 'Try Again'}
            </Text>
          </TouchableOpacity>
        )}

        {customActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.primaryButton, { backgroundColor: action.color || config.color }]}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            {action.icon && (
              <Ionicons name={action.icon} size={20} color={COLORS.textInverse} />
            )}
            <Text style={styles.primaryButtonText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Secondary Actions */}
      <View style={styles.secondaryActions}>
        {showSupport && (
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleContactSupport}
            activeOpacity={0.7}
          >
            <Ionicons name="headset" size={18} color={config.color} />
            <Text style={[styles.secondaryButtonText, { color: config.color }]}>
              {t('help.contact.support') || 'Contact Support'}
            </Text>
          </TouchableOpacity>
        )}

        {showCopyDetails && (
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={toggleDetails}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={showDetails ? "chevron-up" : "chevron-down"} 
              size={18} 
              color={COLORS.textSecondary} 
            />
            <Text style={styles.secondaryButtonText}>
              {showDetails ? (t('errors.hideDetails') || 'Hide Details') : (t('errors.showDetails') || 'Show Details')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <Text style={styles.closeButtonText}>
          {t('common.close') || 'Close'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDetails = () => (
    <Animated.View style={[styles.detailsContainer, { height: detailsHeight }]}>
      <ScrollView 
        style={styles.detailsScrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailsContent}>
          <Text style={styles.detailsTitle}>Technical Details</Text>
          <Text style={styles.detailsText}>
            Error Type: {errorType}{'\n'}
            Timestamp: {new Date().toLocaleString()}{'\n'}
            Platform: {Platform.OS} {Platform.Version}
            {error && `\nDetails: ${typeof error === 'string' ? error : JSON.stringify(error, null, 2)}`}
          </Text>
          
          <View style={styles.detailsActions}>
            <TouchableOpacity 
              style={styles.detailsActionButton}
              onPress={copyErrorDetails}
            >
              <Ionicons name="copy" size={16} color={config.color} />
              <Text style={[styles.detailsActionText, { color: config.color }]}>
                Copy Details
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.detailsActionButton}
              onPress={shareErrorDetails}
            >
              <Ionicons name="share" size={16} color={config.color} />
              <Text style={[styles.detailsActionText, { color: config.color }]}>
                Share Report
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
      testID={testID}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: overlayOpacity }
        ]}
      >
        <BlurView 
          intensity={80} 
          style={styles.blurOverlay}
          experimentalBlurMethod="dimezisBlurView"
        />
        
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            onPress={handleClose}
            activeOpacity={1}
          />
          
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: modalScale }],
                opacity: modalOpacity,
              }
            ]}
          >
            <LinearGradient
              colors={config.gradient}
              style={styles.gradientBorder}
            >
              <View style={styles.modalInner}>
                {renderHeader()}
                {renderRecoverySteps()}
                {renderActions()}
                {showCopyDetails && renderDetails()}
              </View>
            </LinearGradient>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
  },
  gradientBorder: {
    borderRadius: BORDER_RADIUS.component.modal,
    padding: 2,
  },
  modalInner: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.component.modal - 2,
    ...SHADOWS.component.modal,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.lineHeights.tight * TYPOGRAPHY.fontSizes['2xl'],
  },
  message: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.fontSizes.md,
  },
  actionsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  primaryActions: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.component.padding.md,
    paddingHorizontal: SPACING.component.padding.lg,
    borderRadius: BORDER_RADIUS.component.button,
    gap: SPACING.sm,
    ...SHADOWS.component.button,
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.textInverse,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  // Recovery steps styles
  recoveryContainer: {
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  recoveryTitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  recoveryStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.background,
  },
  stepText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  resolutionTime: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  detailsContainer: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailsScrollView: {
    flex: 1,
  },
  detailsContent: {
    padding: SPACING.md,
  },
  detailsTitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  detailsText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamilies.monospace,
    lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.fontSizes.xs,
    marginBottom: SPACING.sm,
  },
  detailsActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  detailsActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  detailsActionText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
});

export default PremiumErrorModal;