/**
 * BLONG Success Message Context
 * Global success message management system
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import SuccessMessageManager, { SUCCESS_TYPES } from '../components/ui/SuccessMessageManager';

const SuccessMessageContext = createContext({
  showSuccess: () => {},
  hideSuccess: () => {},
  showProfileSuccess: () => {},
  showQuizSuccess: () => {},
  showDateSuccess: () => {},
  showPhotoSuccess: () => {},
  showPaymentSuccess: () => {},
  showGenericSuccess: () => {},
  currentSuccess: null,
  isVisible: false,
});

export const SuccessMessageProvider = ({ children }) => {
  const [currentSuccess, setCurrentSuccess] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const showSuccess = useCallback((config) => {
    setCurrentSuccess(config);
    setIsVisible(true);
  }, []);

  const hideSuccess = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentSuccess(null);
    }, 300); // Allow animation to complete
  }, []);

  // Specialized success message functions
  const showProfileSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.PROFILE_UPDATED,
      message,
      showConfetti: true,
      ...options,
    });
  }, [showSuccess]);

  const showQuizSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.QUIZ_COMPLETED,
      message,
      showConfetti: true,
      ...options,
    });
  }, [showSuccess]);

  const showDateSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.DATE_BOOKED,
      message,
      showConfetti: true,
      ...options,
    });
  }, [showSuccess]);

  const showPhotoSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.PHOTO_UPLOADED,
      message,
      ...options,
    });
  }, [showSuccess]);

  const showPaymentSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.PAYMENT_PROCESSED,
      message,
      showConfetti: true,
      ...options,
    });
  }, [showSuccess]);

  const showGenericSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.GENERIC,
      message,
      ...options,
    });
  }, [showSuccess]);

  const showAssessmentSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.ASSESSMENT_COMPLETED,
      message,
      showConfetti: true,
      ...options,
    });
  }, [showSuccess]);

  const showPreferencesSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.PREFERENCES_SAVED,
      message,
      ...options,
    });
  }, [showSuccess]);

  const showFeedbackSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.FEEDBACK_SENT,
      message,
      ...options,
    });
  }, [showSuccess]);

  const showEmailVerifiedSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.EMAIL_VERIFIED,
      message,
      showConfetti: true,
      ...options,
    });
  }, [showSuccess]);

  const showPasswordChangedSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.PASSWORD_CHANGED,
      message,
      ...options,
    });
  }, [showSuccess]);

  const showAccountCreatedSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.ACCOUNT_CREATED,
      message,
      showConfetti: true,
      ...options,
    });
  }, [showSuccess]);

  const showDataSyncedSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.DATA_SYNCED,
      message,
      ...options,
    });
  }, [showSuccess]);

  const showSettingsSavedSuccess = useCallback((message, options = {}) => {
    showSuccess({
      type: SUCCESS_TYPES.SETTINGS_SAVED,
      message,
      ...options,
    });
  }, [showSuccess]);

  const contextValue = {
    // Core functions
    showSuccess,
    hideSuccess,

    // Specialized success functions
    showProfileSuccess,
    showQuizSuccess,
    showDateSuccess,
    showPhotoSuccess,
    showPaymentSuccess,
    showGenericSuccess,
    showAssessmentSuccess,
    showPreferencesSuccess,
    showFeedbackSuccess,
    showEmailVerifiedSuccess,
    showPasswordChangedSuccess,
    showAccountCreatedSuccess,
    showDataSyncedSuccess,
    showSettingsSavedSuccess,

    // State
    currentSuccess,
    isVisible,

    // Constants
    SUCCESS_TYPES,
  };

  return (
    <SuccessMessageContext.Provider value={contextValue}>
      {children}

      {/* Global Success Message Manager */}
      <SuccessMessageManager
        visible={isVisible}
        {...currentSuccess}
        onClose={hideSuccess}
      />
    </SuccessMessageContext.Provider>
  );
};

export const useSuccessMessage = () => {
  const context = useContext(SuccessMessageContext);
  if (!context) {
    throw new Error('useSuccessMessage must be used within a SuccessMessageProvider');
  }
  return context;
};

export default SuccessMessageContext;