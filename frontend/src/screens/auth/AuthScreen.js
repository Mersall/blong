/**
 * BLONG Elite Authentication Screen
 * Premium sign-in/register experience with sophisticated design
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp, useTheme, useRTL } from '../../contexts/AppContext';
import { useLoadingContext } from '../../contexts/LoadingContext';
import { authService } from '../../services/authService';
import { AppTransition } from '../../components/AppTransition';
import { EliteNotificationBanner, EliteNotificationModal } from '../../components/notifications/EliteNotification';
import { PremiumSpinner } from '../../components/loading';
import EnhancedTextInput from '../../components/forms/EnhancedTextInput';
import PasswordStrengthIndicator from '../../components/forms/PasswordStrengthIndicator';
import { getErrorMessage } from '../../utils/errorHandling';
import {
  validateAuthForm,
  validatePassword
} from '../../utils/formValidation';
import {
  createAuthStyles,
} from './styles/AuthScreenStyles';

const AuthScreen = ({ userPreferences, onAuthComplete, sessionMessage = null }) => {
  const { t } = useApp();
  const { colors } = useTheme();
  const { isRTL, rtlStyles } = useRTL();

  // ALWAYS include COLORS constant - BLONG Design System
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
  };

  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('none');
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Create styles with current theme and RTL settings
  const styles = useMemo(() => {
    return createAuthStyles(colors, isRTL);
  }, [colors, isRTL]);

  // Enhanced loading states for different operations
  const [isLoading, setIsLoading] = useState(false);
  const [operationType, setOperationType] = useState(null); // 'signin' | 'register'
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const loadingAnimation = useRef(new Animated.Value(0)).current;
  const { showLoading, hideLoading } = useLoadingContext();
  const currentLoadingId = useRef(null);

  // Auto-retry mechanism for network failures
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 2000;

  // Enhanced authentication handlers with comprehensive error handling
  const handleSignIn = async (credentials, attemptNumber = 0) => {
    try {
      setIsLoading(true);
      setOperationType('signin');
      setIsRetrying(attemptNumber > 0);
      
      // Show loading with context manager
      if (currentLoadingId.current) hideLoading(currentLoadingId.current);
      currentLoadingId.current = showLoading({
        type: 'screen',
        message: attemptNumber > 0 
          ? t('auth.retryingSignIn') || `Retrying sign in... (${attemptNumber}/${MAX_RETRY_ATTEMPTS})`
          : t('auth.signingIn') || 'Signing you in...',
        subtitle: t('auth.pleaseWait') || 'Please wait while we verify your credentials',
        priority: 4
      });

      const result = await authService.signIn(credentials);

      // Hide loading
      if (currentLoadingId.current) {
        hideLoading(currentLoadingId.current);
        currentLoadingId.current = null;
      }

      // Reset retry attempts on success
      setRetryAttempt(0);
      setIsRetrying(false);

      setNotification({
        type: 'success',
        title: t('auth.loginSuccess') || 'Welcome back!',
        message: `Welcome back, ${result.user.firstName}!`,
      });

      setTimeout(() => {
        if (onAuthComplete) {
          onAuthComplete({
            user: result.user,
            preferences: userPreferences,
          });
        }
      }, 1500);
    } catch (error) {
      // Hide loading
      if (currentLoadingId.current) {
        hideLoading(currentLoadingId.current);
        currentLoadingId.current = null;
      }

      const errorInfo = getErrorMessage(error, t);
      
      // Handle retry logic for network errors
      if (error.type === 'NETWORK_ERROR' && attemptNumber < MAX_RETRY_ATTEMPTS) {
        const nextAttempt = attemptNumber + 1;
        setRetryAttempt(nextAttempt);
        
        Alert.alert(
          t('errors.network.title') || 'Connection Failed',
          t('errors.network.retryPrompt') || `Connection failed. Retry attempt ${nextAttempt} of ${MAX_RETRY_ATTEMPTS}?`,
          [
            {
              text: t('common.cancel') || 'Cancel',
              style: 'cancel',
              onPress: () => {
                setRetryAttempt(0);
                setIsRetrying(false);
              }
            },
            {
              text: t('common.retry') || 'Retry',
              onPress: () => {
                setTimeout(() => handleSignIn(credentials, nextAttempt), RETRY_DELAY);
              }
            }
          ]
        );
        return;
      }
      
      // Show error modal for non-retryable errors or max retries reached
      setErrorModal({
        type: 'error',
        title: errorInfo.title,
        message: errorInfo.message,
        primaryAction: errorInfo.action,
        onAction: () => {
          setErrorModal(null);
          // Offer retry option for network errors
          if (error.type === 'NETWORK_ERROR') {
            setTimeout(() => handleSignIn(credentials, 0), 1000);
          }
        }
      });
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const handleRegister = async (userData, attemptNumber = 0) => {
    try {
      setIsLoading(true);
      setOperationType('register');
      setIsRetrying(attemptNumber > 0);
      console.log('🔄 Starting registration process...');
      
      // Show loading with context manager
      if (currentLoadingId.current) hideLoading(currentLoadingId.current);
      currentLoadingId.current = showLoading({
        type: 'screen',
        message: attemptNumber > 0 
          ? t('auth.retryingRegister') || `Retrying registration... (${attemptNumber}/${MAX_RETRY_ATTEMPTS})`
          : t('auth.creatingAccount') || 'Creating your account...',
        subtitle: t('auth.processingInfo') || 'Please wait while we set up your profile',
        priority: 4
      });

      const result = await authService.register(userData);
      console.log('✅ Registration successful:', result);

      // Hide loading
      if (currentLoadingId.current) {
        hideLoading(currentLoadingId.current);
        currentLoadingId.current = null;
      }

      // Reset retry attempts on success
      setRetryAttempt(0);
      setIsRetrying(false);

      setNotification({
        type: 'success',
        title: t('auth.registerSuccess') || 'Welcome to BLONG!',
        message: `Welcome to BLONG, ${result.user.firstName}!`,
      });

      setTimeout(() => {
        console.log('🚀 Calling onAuthComplete...');
        if (onAuthComplete) {
          onAuthComplete({
            user: result.user,
            preferences: userPreferences,
          });
        }
      }, 1500);
    } catch (error) {
      console.log('❌ Registration error caught:', error);
      
      // Hide loading
      if (currentLoadingId.current) {
        hideLoading(currentLoadingId.current);
        currentLoadingId.current = null;
      }

      const errorInfo = getErrorMessage(error, t);
      console.log('📝 Error info generated:', errorInfo);
      
      // Handle retry logic for network errors
      if (error.type === 'NETWORK_ERROR' && attemptNumber < MAX_RETRY_ATTEMPTS) {
        const nextAttempt = attemptNumber + 1;
        setRetryAttempt(nextAttempt);
        
        Alert.alert(
          t('errors.network.title') || 'Connection Failed',
          t('errors.network.retryPrompt') || `Connection failed. Retry attempt ${nextAttempt} of ${MAX_RETRY_ATTEMPTS}?`,
          [
            {
              text: t('common.cancel') || 'Cancel',
              style: 'cancel',
              onPress: () => {
                setRetryAttempt(0);
                setIsRetrying(false);
              }
            },
            {
              text: t('common.retry') || 'Retry',
              onPress: () => {
                setTimeout(() => handleRegister(userData, nextAttempt), RETRY_DELAY);
              }
            }
          ]
        );
        return;
      }
      
      // Show error modal for non-retryable errors or max retries reached
      setErrorModal({
        type: 'error',
        title: errorInfo.title,
        message: errorInfo.message,
        primaryAction: errorInfo.action,
        onAction: () => {
          setErrorModal(null);
          // Offer retry option for network errors
          if (error.type === 'NETWORK_ERROR') {
            setTimeout(() => handleRegister(userData, 0), 1000);
          }
        }
      });
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };




  const handleAuth = async () => {
    // Prevent multiple submissions
    if (isLoading) {
      return;
    }

    // Validate form with enhanced feedback
    const validation = validateAuthForm(formData, authMode, t);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      
      // Show validation error notification
      const firstError = Object.values(validation.errors)[0];
      setNotification({
        type: 'error',
        title: t('validation.formErrors') || 'Form Validation Failed',
        message: firstError || t('validation.pleaseFix') || 'Please fix the errors below',
      });
      
      // Auto-dismiss validation notification
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    // Clear any existing errors
    setFieldErrors({});
    setNotification(null);
    setErrorModal(null);

    try {
      // Use enhanced authentication handlers with retry logic
      if (authMode === 'signin') {
        await handleSignIn({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
      } else {
        await handleRegister({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone?.trim() || null,
        });
      }
    } catch (error) {
      console.error('❌ Unexpected error in handleAuth:', error);
      
      // Fallback error handling
      setErrorModal({
        type: 'error',
        title: t('errors.unexpected.title') || 'Unexpected Error',
        message: t('errors.unexpected.message') || 'Something went wrong. Please try again.',
        primaryAction: t('common.ok') || 'OK',
      });
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'register' : 'signin');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      gender: 'MALE',
    });
    setFieldErrors({});
    setNotification(null);
    setErrorModal(null);
    setPasswordStrength('none');
  };



  // Enhanced form data update with real-time validation
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }

    // Real-time password strength validation
    if (field === 'password' && authMode === 'register') {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AppTransition>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />

        {/* Notifications */}
        <EliteNotificationBanner
          visible={!!notification}
          type={notification?.type}
          title={notification?.title}
          message={notification?.message}
          onDismiss={() => setNotification(null)}
        />

        <EliteNotificationModal
          visible={!!errorModal}
          type={errorModal?.type}
          title={errorModal?.title}
          message={errorModal?.message}
          primaryAction={errorModal?.primaryAction}
          onPrimaryAction={errorModal?.onAction || (() => setErrorModal(null))}
          onDismiss={() => setErrorModal(null)}
        />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Elite Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.logo}>
                BLONG
              </Text>

              {/* Accent line - ALWAYS include */}
              <View style={styles.accentLine} />

              {/* Welcome Message */}
              <Text style={styles.welcomeTitle}>
                {authMode === 'signin'
                  ? t('auth.loginTitle') || 'Welcome Back'
                  : t('auth.registerTitle') || 'Create Your Profile'
                }
              </Text>

              <Text style={styles.welcomeSubtitle}>
                {authMode === 'signin'
                  ? t('auth.loginSubtitle') || 'Sign in to continue your journey'
                  : t('auth.registerSubtitle') || 'Begin your elite matrimonial experience'
                }
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Session Message */}
              {sessionMessage && (
                <View style={{
                  backgroundColor: '#FEF3F2',
                  borderColor: '#FDB5A6',
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 24,
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 14,
                    color: '#D92D20',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                    {sessionMessage}
                  </Text>
                </View>
              )}
              
              {/* Register Fields */}
              {authMode === 'register' && (
                <>
                <View style={styles.nameFieldsRow}>
                  {/* First Name */}
                  <View style={styles.nameFieldContainer}>
                    <Text style={styles.fieldLabel}>
                      {t('auth.firstName')} *
                    </Text>
                    <EnhancedTextInput
                      value={formData.firstName}
                      onChangeText={(value) => updateFormData('firstName', value)}
                      placeholder={t('auth.firstNamePlaceholder') || 'Enter your first name'}
                      placeholderTextColor={colors.textSecondary}
                      error={fieldErrors.firstName}
                      colors={colors}
                      isRTL={isRTL}
                      autoCapitalize="words"
                      textContentType="givenName"
                      maxLength={50}
                    />
                  </View>

                  {/* Last Name */}
                  <View style={styles.nameFieldContainer}>
                    <Text style={styles.fieldLabel}>
                      {t('auth.lastName')} *
                    </Text>
                    <EnhancedTextInput
                      value={formData.lastName}
                      onChangeText={(value) => updateFormData('lastName', value)}
                      placeholder={t('auth.lastNamePlaceholder') || 'Enter your last name'}
                      placeholderTextColor={colors.textSecondary}
                      error={fieldErrors.lastName}
                      colors={colors}
                      isRTL={isRTL}
                      autoCapitalize="words"
                      textContentType="familyName"
                      maxLength={50}
                    />
                  </View>
                </View>
                

                {/* Date of Birth */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {t('auth.dateOfBirth') || 'Date of Birth'} *
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.textInput,
                      fieldErrors.dateOfBirth && styles.textInputError,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }
                    ]}
                    onPress={() => setShowDatePicker(true)}
                    accessibilityLabel={t('auth.dateOfBirth') || 'Select date of birth'}
                    accessibilityRole="button"
                    accessibilityHint={t('accessibility.datePickerHint') || 'Opens date picker to select your birth date'}
                    accessibilityState={{ selected: !!formData.dateOfBirth }}
                  >
                    <Text style={[
                      styles.datePickerText,
                      !formData.dateOfBirth && { color: colors.textSecondary },
                      { flex: 1, paddingVertical: 0 }
                    ]}>
                      {formData.dateOfBirth || t('auth.dateOfBirthPlaceholder') || 'Select your date of birth'}
                    </Text>
                    <Text style={{ fontSize: 16, color: colors.accent }}>📅</Text>
                  </TouchableOpacity>
                  {showDatePicker && Platform.OS === 'ios' && (
                    <Modal
                      visible={showDatePicker}
                      animationType="slide"
                      presentationStyle="pageSheet"
                      onRequestClose={() => setShowDatePicker(false)}
                    >
                      <View style={{ flex: 1, backgroundColor: colors.background }}>
                        {/* Header */}
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: 20,
                          paddingTop: 60,
                          paddingBottom: 20,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border,
                        }}>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text style={{ fontSize: 16, color: colors.accent }}>Cancel</Text>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                            Select Date of Birth
                          </Text>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text style={{ fontSize: 16, color: colors.accent, fontWeight: '600' }}>Done</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Date Picker */}
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
                          <DateTimePicker
                            value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date(1995, 0, 1)}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                              if (selectedDate) {
                                // Calculate age to ensure 18+ requirement
                                const today = new Date();
                                const age = today.getFullYear() - selectedDate.getFullYear();
                                const monthDiff = today.getMonth() - selectedDate.getMonth();

                                if (age < 18 || (age === 18 && monthDiff < 0) ||
                                    (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                                  setFieldErrors(prev => ({
                                    ...prev,
                                    dateOfBirth: t('validation.mustBe18') || 'You must be at least 18 years old to register'
                                  }));
                                } else {
                                  setFieldErrors(prev => ({ ...prev, dateOfBirth: null }));
                                  updateFormData('dateOfBirth', selectedDate.toISOString().split('T')[0]);
                                }
                              }
                            }}
                            maximumDate={new Date()}
                            minimumDate={new Date(1950, 0, 1)}
                            style={{ height: 200 }}
                            textColor={colors.text}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}

                  {showDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                      value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date(1995, 0, 1)}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (event.type === 'set' && selectedDate) {
                          // Calculate age to ensure 18+ requirement
                          const today = new Date();
                          const age = today.getFullYear() - selectedDate.getFullYear();
                          const monthDiff = today.getMonth() - selectedDate.getMonth();

                          if (age < 18 || (age === 18 && monthDiff < 0) ||
                              (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                            setFieldErrors(prev => ({
                              ...prev,
                              dateOfBirth: t('validation.mustBe18') || 'You must be at least 18 years old to register'
                            }));
                          } else {
                            setFieldErrors(prev => ({ ...prev, dateOfBirth: null }));
                            updateFormData('dateOfBirth', selectedDate.toISOString().split('T')[0]);
                          }
                        }
                      }}
                      maximumDate={new Date()}
                      minimumDate={new Date(1950, 0, 1)}
                    />
                  )}
                  {fieldErrors.dateOfBirth && (
                    <Text style={styles.errorText}>{fieldErrors.dateOfBirth}</Text>
                  )}
                </View>

                {/* Gender Selection */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {t('auth.gender') || 'Gender'} *
                  </Text>
                  <View style={styles.genderContainer}>
                    {['MALE', 'FEMALE'].map((genderOption) => (
                      <TouchableOpacity
                        key={genderOption}
                        style={[
                          styles.genderButton,
                          formData.gender === genderOption && styles.genderButtonSelected
                        ]}
                        onPress={() => updateFormData('gender', genderOption)}
                        accessibilityLabel={`Select ${genderOption.toLowerCase()} gender`}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: formData.gender === genderOption }}
                      >
                        <Text style={[
                          styles.genderButtonText,
                          formData.gender === genderOption && styles.genderButtonTextSelected
                        ]}>
                          {t(`auth.gender.${genderOption.toLowerCase()}`) || genderOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {fieldErrors.gender && (
                    <Text style={styles.errorText}>{fieldErrors.gender}</Text>
                  )}
                </View>
                </>
              )}

              {/* Email */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  {t('auth.email')} *
                </Text>
                <EnhancedTextInput
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder={t('auth.emailPlaceholder') || 'Enter your email address'}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  error={fieldErrors.email}
                  colors={colors}
                  isRTL={isRTL}
                  maxLength={255}
                />
              </View>

              {/* Password */}
              <View style={authMode === 'register' ? styles.fieldContainer : styles.fieldContainerLast}>
                <Text style={styles.fieldLabel}>
                  {t('auth.password')} *
                </Text>
                <EnhancedTextInput
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  placeholder={t('auth.passwordPlaceholder') || 'Enter your password'}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  showPasswordToggle={true}
                  showPassword={showPassword}
                  onTogglePassword={togglePasswordVisibility}
                  error={fieldErrors.password}
                  colors={colors}
                  isRTL={isRTL}
                  textContentType={authMode === 'register' ? 'newPassword' : 'password'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={128}
                />

                {/* Password Strength Indicator for Registration */}
                {authMode === 'register' && (
                  <PasswordStrengthIndicator
                    strength={passwordStrength}
                    colors={colors}
                    isVisible={formData.password.length > 0}
                  />
                )}
              </View>

              {/* Confirm Password (Register only) */}
              {authMode === 'register' && (
                <View style={styles.fieldContainerLast}>
                  <Text style={styles.fieldLabel}>
                    {t('auth.confirmPassword')}
                  </Text>
                  <EnhancedTextInput
                    value={formData.confirmPassword || ''}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirm your password'}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={true}
                    error={fieldErrors.confirmPassword}
                    colors={colors}
                    isRTL={isRTL}
                  />
                </View>
              )}

              {/* Enhanced Auth Button with Loading States */}
              <TouchableOpacity
                style={[
                  styles.authButtonContainer,
                  isLoading && styles.authButtonDisabled
                ]}
                onPress={handleAuth}
                disabled={isLoading}
                activeOpacity={isLoading ? 1 : 0.8}
              >
                <LinearGradient
                  colors={[colors.accent, colors.accentDark || colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.authButtonGradient,
                    isLoading && { opacity: 0.7 }
                  ]}
                >
                  {isLoading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <PremiumSpinner size="small" color={colors.background} />
                      <Text style={[styles.authButtonText, { marginLeft: 12 }]}>
                        {isRetrying
                          ? (t('common.retrying') || 'RETRYING...')
                          : operationType === 'signin'
                            ? (t('auth.signingIn') || 'SIGNING IN...')
                            : (t('auth.creatingAccount') || 'CREATING ACCOUNT...')
                        }
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.authButtonText}>
                      {authMode === 'signin'
                        ? (t('auth.loginButton') || 'SIGN IN')
                        : (t('auth.registerButton') || 'CREATE ACCOUNT')
                      }
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Retry Information */}
              {isRetrying && retryAttempt > 0 && (
                <Text style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 12,
                  fontStyle: 'italic'
                }}>
                  {t('auth.retryAttempt') || `Retry attempt ${retryAttempt} of ${MAX_RETRY_ATTEMPTS}`}
                </Text>
              )}

              {/* Test Account Button - Development Only */}
              {authMode === 'signin' && __DEV__ && (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#E8F4FD',
                    borderColor: '#2196F3',
                    borderWidth: 1.5,
                    borderRadius: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    marginTop: 20,
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                  onPress={() => {
                    setFormData(prev => ({
                      ...prev,
                      email: 'test@blong.app',
                      password: 'TestUser123!'
                    }));
                  }}
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    color: '#1976D2',
                    fontSize: 15,
                    fontWeight: '700',
                  }}>
                    🧪 Fill Test Account Credentials
                  </Text>
                  <Text style={{
                    color: '#1976D2',
                    fontSize: 12,
                    marginTop: 4,
                    opacity: 0.8,
                    fontWeight: '500',
                  }}>
                    Verified account ready for testing
                  </Text>
                </TouchableOpacity>
              )}

              {/* Toggle Auth Mode */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {authMode === 'signin'
                    ? (t('auth.dontHaveAccount') || "Don't have an account?")
                    : (t('auth.alreadyHaveAccount') || 'Already have an account?')
                  }
                </Text>

                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleAuthMode}
                >
                  <Text style={styles.toggleButtonText}>
                    {authMode === 'signin'
                      ? (t('auth.createAccount') || 'Create Account')
                      : (t('auth.signIn') || 'Sign In')
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppTransition>
  );
};

export default AuthScreen;
