/**
 * BLONG Screen Cache Manager
 * Optimizes tab navigation by preserving screen instances and React Query cache
 */

import React, { useMemo, useRef, useCallback } from 'react';
import { View } from 'react-native';

export const ScreenCacheManager = ({ 
  activeTab, 
  screens, 
  screenProps,
  fallbackScreen = 'home' 
}) => {
  const screenInstancesRef = useRef({});
  const mountedScreensRef = useRef(new Set());

  // Create screen instances only once and cache them
  const getScreenInstance = useCallback((screenKey) => {
    if (!screenInstancesRef.current[screenKey]) {
      const ScreenComponent = screens[screenKey];
      if (ScreenComponent) {
        screenInstancesRef.current[screenKey] = (
          <ScreenComponent {...screenProps} />
        );
      }
    }
    return screenInstancesRef.current[screenKey];
  }, [screens, screenProps]);

  // Memoize the current screen to prevent unnecessary re-renders
  const currentScreen = useMemo(() => {
    const screenKey = activeTab || fallbackScreen;
    mountedScreensRef.current.add(screenKey);
    return getScreenInstance(screenKey);
  }, [activeTab, fallbackScreen, getScreenInstance]);

  // Render all cached screens but only show the active one
  const renderCachedScreens = useMemo(() => {
    return Object.keys(screens).map(screenKey => {
      const screen = screenInstancesRef.current[screenKey];
      const isActive = screenKey === activeTab;
      
      if (!screen || !mountedScreensRef.current.has(screenKey)) {
        return null;
      }

      return (
        <View
          key={screenKey}
          style={{
            flex: 1,
            display: isActive ? 'flex' : 'none',
          }}
        >
          {screen}
        </View>
      );
    });
  }, [activeTab, screens]);

  return (
    <View style={{ flex: 1 }}>
      {renderCachedScreens}
      {/* Fallback for new screens */}
      {!screenInstancesRef.current[activeTab] && currentScreen && (
        <View style={{ flex: 1 }}>
          {currentScreen}
        </View>
      )}
    </View>
  );
};

export default ScreenCacheManager;
