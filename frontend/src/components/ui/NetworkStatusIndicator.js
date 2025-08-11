/**
 * BLONG Network Status Indicator
 * Shows network connection status with offline queue information
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import networkManager from '../../services/networkManager';

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

const NetworkStatusIndicator = ({
  style,
  showDetails = false,
  position = 'top', // 'top' | 'bottom' | 'inline'
  onPress,
}) => {
  const { t } = useTranslation();
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    connectionType: 'unknown',
    justConnected: false,
    justDisconnected: false,
  });
  const [offlineQueueStatus, setOfflineQueueStatus] = useState({ count: 0, items: [] });
  const [slideAnim] = useState(new Animated.Value(position === 'top' ? -100 : 100));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Subscribe to network changes
    const unsubscribe = networkManager.addListener((state) => {
      setNetworkState(state);
      updateOfflineQueueStatus();

      // Show/hide indicator based on connection status
      if (!state.isConnected || state.justConnected) {
        showIndicator();
      } else if (state.isConnected && !state.justConnected) {
        // Hide after a delay when connected
        setTimeout(hideIndicator, 3000);
      }
    });

    // Initial state
    setNetworkState({
      isConnected: networkManager.isOnline(),
      connectionType: networkManager.getConnectionType(),
    });
    updateOfflineQueueStatus();

    return unsubscribe;
  }, []);

  const updateOfflineQueueStatus = () => {
    const status = networkManager.getOfflineQueueStatus();
    setOfflineQueueStatus(status);
  };

  const showIndicator = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideIndicator = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress(networkState, offlineQueueStatus);
    } else if (!networkState.isConnected) {
      networkManager.checkConnection();
    }
  };

  const getStatusConfig = () => {
    if (networkState.isConnected) {
      if (networkState.justConnected) {
        return {
          icon: 'checkmark-circle',
          color: COLORS.success,
          backgroundColor: COLORS.success + '15',
          title: t('network.connected'),
          message: offlineQueueStatus.count > 0
            ? t('network.processingQueue', { count: offlineQueueStatus.count })
            : t('network.connectionRestored'),
        };
      }
      return {
        icon: 'wifi',
        color: COLORS.success,
        backgroundColor: COLORS.success + '15',
        title: t('network.online'),
        message: t('network.connectionStable'),
      };
    } else {
      return {
        icon: 'wifi-off',
        color: COLORS.error,
        backgroundColor: COLORS.error + '15',
        title: t('network.offline'),
        message: offlineQueueStatus.count > 0
          ? t('network.queuedActions', { count: offlineQueueStatus.count })
          : t('network.noConnection'),
      };
    }
  };

  const config = getStatusConfig();

  // Don't render if inline and connected (unless showing details)
  if (position === 'inline' && networkState.isConnected && !showDetails) {
    return null;
  }

  const containerStyle = {
    position: position === 'inline' ? 'relative' : 'absolute',
    [position]: position === 'inline' ? 0 : 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingVertical: 8,
  };

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          transform: position === 'inline' ? [] : [{ translateY: slideAnim }],
          opacity: position === 'inline' ? 1 : fadeAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: config.backgroundColor,
          borderRadius: 8,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: config.color + '30',
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        activeOpacity={0.8}
      >
        <Ionicons
          name={config.icon}
          size={20}
          color={config.color}
          style={{ marginRight: 12 }}
        />

        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: config.color,
            marginBottom: 2,
          }}>
            {config.title}
          </Text>

          <Text style={{
            fontSize: 12,
            color: COLORS.textSecondary,
          }}>
            {config.message}
          </Text>

          {showDetails && (
            <Text style={{
              fontSize: 11,
              color: COLORS.textTertiary,
              marginTop: 4,
            }}>
              {t('network.connectionType')}: {networkState.connectionType}
            </Text>
          )}
        </View>

        {!networkState.isConnected && (
          <TouchableOpacity
            onPress={() => networkManager.checkConnection()}
            style={{
              backgroundColor: config.color,
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: COLORS.background,
              fontWeight: '600',
            }}>
              {t('common.retry')}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NetworkStatusIndicator;