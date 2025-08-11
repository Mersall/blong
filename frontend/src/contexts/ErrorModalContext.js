/**
 * BLONG Error Modal Context
 * Global error modal management system
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import PremiumErrorModal from '../components/ui/PremiumErrorModal';
import ErrorManager from '../services/ErrorManager';

const ErrorModalContext = createContext({
  showError: () => {},
  hideError: () => {},
  showNetworkError: () => {},
  showValidationError: () => {},
  showAuthError: () => {},
  showServerError: () => {},
  showCriticalError: () => {},
  showTimeoutError: () => {},
  showPermissionError: () => {},
  showSubscriptionError: () => {},
  showMultipleErrors: () => {},
  currentError: null,
  isVisible: false,
});

export const ErrorModalProvider = ({ children }) => {
  const [currentError, setCurrentError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  // Initialize ErrorManager with callbacks
  React.useEffect(() => {
    ErrorManager.initialize(
      (config) => showErrorModal(config),
      () => hideErrorModal()
    );
  }, []);

  const showErrorModal = useCallback((config) => {
    setModalConfig(config);
    setCurrentError(config.error);
    setIsVisible(true);
  }, []);

  const hideErrorModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentError(null);
      setModalConfig({});
    }, 300); // Allow animation to complete
  }, []);

  // Error Manager wrapper functions
  const showError = useCallback((error, options = {}) => {
    return ErrorManager.showError(error, options);
  }, []);

  const hideError = useCallback(() => {
    return ErrorManager.hideError();
  }, []);

  const showNetworkError = useCallback((error, retryFunction, options = {}) => {
    return ErrorManager.showNetworkError(error, retryFunction, options);
  }, []);

  const showValidationError = useCallback((error, options = {}) => {
    return ErrorManager.showValidationError(error, options);
  }, []);

  const showAuthError = useCallback((error, options = {}) => {
    return ErrorManager.showAuthError(error, options);
  }, []);

  const showServerError = useCallback((error, options = {}) => {
    return ErrorManager.showServerError(error, options);
  }, []);

  const showCriticalError = useCallback((error, options = {}) => {
    return ErrorManager.showCriticalError(error, options);
  }, []);

  const showTimeoutError = useCallback((error, retryFunction, options = {}) => {
    return ErrorManager.showTimeoutError(error, retryFunction, options);
  }, []);

  const showPermissionError = useCallback((error, options = {}) => {
    return ErrorManager.showPermissionError(error, options);
  }, []);

  const showSubscriptionError = useCallback((error, options = {}) => {
    return ErrorManager.showSubscriptionError(error, options);
  }, []);

  const showMultipleErrors = useCallback((errors, options = {}) => {
    return ErrorManager.showMultipleErrors(errors, options);
  }, []);

  const contextValue = {
    // Core functions
    showError,
    hideError,
    
    // Specialized error functions
    showNetworkError,
    showValidationError,
    showAuthError,
    showServerError,
    showCriticalError,
    showTimeoutError,
    showPermissionError,
    showSubscriptionError,
    showMultipleErrors,
    
    // State
    currentError,
    isVisible,
  };

  return (
    <ErrorModalContext.Provider value={contextValue}>
      {children}
      
      {/* Global Error Modal */}
      <PremiumErrorModal
        visible={isVisible}
        {...modalConfig}
        testID="global-error-modal"
      />
    </ErrorModalContext.Provider>
  );
};

export const useErrorModal = () => {
  const context = useContext(ErrorModalContext);
  if (!context) {
    throw new Error('useErrorModal must be used within an ErrorModalProvider');
  }
  return context;
};

// Convenience hooks for specific error types
export const useNetworkError = () => {
  const { showNetworkError } = useErrorModal();
  return showNetworkError;
};

export const useValidationError = () => {
  const { showValidationError } = useErrorModal();
  return showValidationError;
};

export const useAuthError = () => {
  const { showAuthError } = useErrorModal();
  return showAuthError;
};

export const useServerError = () => {
  const { showServerError } = useErrorModal();
  return showServerError;
};

export default ErrorModalContext;