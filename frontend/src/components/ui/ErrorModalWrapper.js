/**
 * BLONG Error Modal Wrapper
 * Wrapper component that provides error modal context and handles app-wide error integration
 */

import React from 'react';
import { ErrorModalProvider } from '../../contexts/ErrorModalContext';

const ErrorModalWrapper = ({ children }) => {
  return (
    <ErrorModalProvider>
      {children}
    </ErrorModalProvider>
  );
};

export default ErrorModalWrapper;