/**
 * BLONG App Transition Components
 * Simple wrapper component - no animations, just clean navigation
 */

import React from 'react';

// Simple wrapper component
export const AppTransition = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};




export default AppTransition;
