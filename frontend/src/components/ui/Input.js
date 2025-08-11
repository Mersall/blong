/**
 * BLONG UI - Input Component
 * Enhanced text input with validation, accessibility, and modern UX
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Platform,
  I18nManager 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { a11y } from '../../utils/AccessibilityUtils';

// Design system colors
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
  focus: '#FF6B35',
};

// Input variant configurations
const INPUT_VARIANTS = {
  default: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    focusColor: COLORS.focus,
  },
  filled: {
    backgroundColor: COLORS.surface,
    borderColor: 'transparent',
    focusColor: COLORS.focus,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: COLORS.border,
    focusColor: COLORS.focus,
  },
};

// Input size configurations
const INPUT_SIZES = {
  small: {
    height: 40,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    height: 48,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    height: 56,
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
};

const Input = ({
  // Content
  value,
  onChangeText,
  placeholder,
  label,
  helperText,
  errorMessage,
  successMessage,
  
  // Styling
  variant = 'default',
  size = 'medium',
  borderRadius = 8,
  
  // State
  error = false,
  success = false,
  disabled = false,
  readonly = false,
  required = false,
  
  // Input props
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  secureTextEntry = false,
  returnKeyType = 'done',
  
  // Focus handling
  autoFocus = false,
  onFocus,
  onBlur,
  onSubmitEditing,
  
  // Icons
  leftIcon,
  rightIcon,
  clearable = false,
  
  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  testID,
  
  // Validation
  validateOnChange = false,
  validator,
  
  // Custom styling
  style,
  inputStyle,
  labelStyle,
  
  // Animation
  animateLabel = true,
  hapticFeedback = true,
  
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [internalError, setInternalError] = useState('');
  
  const inputRef = useRef(null);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;
  const errorAnimation = useRef(new Animated.Value(0)).current;

  const variantConfig = INPUT_VARIANTS[variant] || INPUT_VARIANTS.default;
  const sizeConfig = INPUT_SIZES[size] || INPUT_SIZES.medium;
  const isRTL = I18nManager.isRTL;

  // Determine current state
  const hasError = error || !!errorMessage || !!internalError;
  const hasSuccess = success || !!successMessage;
  const hasValue = value && value.length > 0;
  const shouldShowClear = clearable && hasValue && isFocused && !readonly && !disabled;

  // Update clear button visibility
  useEffect(() => {
    setShowClearButton(shouldShowClear);
  }, [shouldShowClear]);

  // Animate label position
  useEffect(() => {
    const shouldFloat = isFocused || hasValue;
    Animated.timing(labelAnimation, {
      toValue: shouldFloat ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue, labelAnimation]);

  // Animate border color
  useEffect(() => {
    Animated.timing(borderAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, borderAnimation]);

  // Animate error state
  useEffect(() => {
    Animated.timing(errorAnimation, {
      toValue: hasError ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [hasError, errorAnimation]);

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    if (hapticFeedback && Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
    
    // Validate on blur if validator provided
    if (validator && value) {
      const validationResult = validator(value);
      if (validationResult !== true) {
        setInternalError(validationResult);
      } else {
        setInternalError('');
      }
    }
  };

  // Handle text change
  const handleChangeText = (text) => {
    onChangeText?.(text);
    
    // Clear internal error when user starts typing
    if (internalError) {
      setInternalError('');
    }
    
    // Validate on change if enabled
    if (validateOnChange && validator && text) {
      const validationResult = validator(text);
      if (validationResult !== true) {
        setInternalError(validationResult);
      } else {
        setInternalError('');
      }
    }
  };

  // Handle clear button
  const handleClear = () => {
    if (hapticFeedback && Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChangeText?.('');
    inputRef.current?.focus();
  };

  // Get border color based on state
  const getBorderColor = () => {
    if (hasError) return COLORS.error;
    if (hasSuccess) return COLORS.success;
    return borderAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [variantConfig.borderColor, variantConfig.focusColor],
    });
  };

  // Get text color for label
  const getLabelColor = () => {
    if (hasError) return COLORS.error;
    if (hasSuccess) return COLORS.success;
    if (isFocused) return variantConfig.focusColor;
    return COLORS.textSecondary;
  };

  // Container style
  const containerStyle = {
    marginBottom: 16,
    ...style,
  };

  // Input container style
  const inputContainerStyle = {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: variantConfig.backgroundColor,
    borderRadius,
    borderWidth: variant === 'filled' ? 0 : 1,
    borderColor: getBorderColor(),
    paddingHorizontal: sizeConfig.paddingHorizontal,
    paddingVertical: sizeConfig.paddingVertical,
    minHeight: multiline ? sizeConfig.height * numberOfLines : sizeConfig.height,
    opacity: disabled ? 0.6 : 1,
  };

  // Text input style
  const textInputStyle = {
    flex: 1,
    fontSize: sizeConfig.fontSize,
    color: disabled ? COLORS.textSecondary : COLORS.text,
    paddingLeft: leftIcon ? 8 : 0,
    paddingRight: (rightIcon || shouldShowClear) ? 8 : 0,
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
    minHeight: multiline ? sizeConfig.height * numberOfLines - (sizeConfig.paddingVertical * 2) : undefined,
    textAlignVertical: multiline ? 'top' : 'center',
    ...inputStyle,
  };

  // Animated label style
  const animatedLabelStyle = animateLabel && label ? {
    position: 'absolute',
    left: isRTL ? undefined : sizeConfig.paddingHorizontal + (leftIcon ? 32 : 0),
    right: isRTL ? sizeConfig.paddingHorizontal + (leftIcon ? 32 : 0) : undefined,
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [sizeConfig.fontSize, 12],
    }),
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [sizeConfig.paddingVertical + (sizeConfig.height - sizeConfig.fontSize) / 2 - 8, -8],
    }),
    color: getLabelColor(),
    backgroundColor: variantConfig.backgroundColor || COLORS.background,
    paddingHorizontal: 4,
    zIndex: 1,
  } : null;

  // Static label style
  const staticLabelStyle = !animateLabel && label ? {
    fontSize: 14,
    fontWeight: '500',
    color: getLabelColor(),
    marginBottom: 6,
    textAlign: isRTL ? 'right' : 'left',
    ...labelStyle,
  } : null;

  // Helper/error text style
  const helperTextStyle = {
    fontSize: 12,
    marginTop: 4,
    marginLeft: isRTL ? 0 : sizeConfig.paddingHorizontal,
    marginRight: isRTL ? sizeConfig.paddingHorizontal : 0,
    textAlign: isRTL ? 'right' : 'left',
  };

  // Get current helper text and color
  const currentHelperText = internalError || errorMessage || successMessage || helperText;
  const helperTextColor = hasError ? COLORS.error : hasSuccess ? COLORS.success : COLORS.textSecondary;

  // Accessibility props
  const accessibilityProps = {
    accessibilityLabel: accessibilityLabel || label || placeholder,
    accessibilityHint: accessibilityHint || a11y.screenReader.hints.textInput,
    ...a11y.formAccessibility.getFormFieldProps({
      label: label || placeholder,
      required,
      hasError,
      errorMessage: internalError || errorMessage,
    }),
  };

  return (
    <View style={containerStyle}>
      {/* Static Label */}
      {!animateLabel && label && (
        <Text style={staticLabelStyle}>
          {label}
          {required && <Text style={{ color: COLORS.error }}> *</Text>}
        </Text>
      )}

      {/* Input Container */}
      <View style={{ position: 'relative' }}>
        {/* Animated Label */}
        {animateLabel && label && (
          <Animated.Text style={animatedLabelStyle}>
            {label}
            {required && <Text style={{ color: COLORS.error }}> *</Text>}
          </Animated.Text>
        )}

        <Animated.View style={inputContainerStyle}>
          {/* Left Icon */}
          {leftIcon && (
            <View style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}>
              {leftIcon}
            </View>
          )}

          {/* Text Input */}
          <TextInput
            ref={inputRef}
            style={textInputStyle}
            value={value}
            onChangeText={handleChangeText}
            placeholder={animateLabel ? undefined : placeholder}
            placeholderTextColor={COLORS.textTertiary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={onSubmitEditing}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry}
            returnKeyType={returnKeyType}
            autoFocus={autoFocus}
            editable={!disabled && !readonly}
            selectTextOnFocus={!readonly}
            testID={testID}
            {...accessibilityProps}
            {...props}
          />

          {/* Clear Button */}
          {shouldShowClear && (
            <TouchableOpacity
              onPress={handleClear}
              style={{
                padding: 4,
                marginLeft: isRTL ? 0 : 4,
                marginRight: isRTL ? 4 : 0,
              }}
              accessibilityRole="button"
              accessibilityLabel="Clear text"
            >
              <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}

          {/* Right Icon */}
          {rightIcon && !shouldShowClear && (
            <View style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
              {rightIcon}
            </View>
          )}
        </Animated.View>
      </View>

      {/* Helper Text */}
      {currentHelperText && (
        <Animated.Text
          style={[
            helperTextStyle,
            { color: helperTextColor },
            hasError && {
              transform: [{
                translateY: errorAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              }],
              opacity: errorAnimation,
            },
          ]}
          {...(hasError && a11y.formAccessibility.getValidationProps(false, currentHelperText))}
        >
          {currentHelperText}
        </Animated.Text>
      )}

      {/* Character Count */}
      {maxLength && (
        <Text style={[
          helperTextStyle,
          { 
            color: COLORS.textTertiary,
            marginTop: currentHelperText ? 4 : 8,
            textAlign: isRTL ? 'left' : 'right',
            marginLeft: 0,
            marginRight: 0,
          }
        ]}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

// Input presets for common use cases
Input.Default = (props) => <Input variant="default" {...props} />;
Input.Filled = (props) => <Input variant="filled" {...props} />;
Input.Outlined = (props) => <Input variant="outlined" {...props} />;

Input.Small = (props) => <Input size="small" {...props} />;
Input.Medium = (props) => <Input size="medium" {...props} />;
Input.Large = (props) => <Input size="large" {...props} />;

Input.Email = (props) => (
  <Input 
    keyboardType="email-address" 
    autoCapitalize="none" 
    autoCorrect={false}
    {...props} 
  />
);

Input.Password = (props) => (
  <Input 
    secureTextEntry 
    autoCapitalize="none" 
    autoCorrect={false}
    {...props} 
  />
);

Input.Phone = (props) => (
  <Input 
    keyboardType="phone-pad" 
    autoCapitalize="none" 
    autoCorrect={false}
    {...props} 
  />
);

Input.Number = (props) => (
  <Input 
    keyboardType="numeric" 
    autoCapitalize="none" 
    autoCorrect={false}
    {...props} 
  />
);

Input.Multiline = (props) => (
  <Input 
    multiline 
    numberOfLines={4}
    {...props} 
  />
);

export default Input;