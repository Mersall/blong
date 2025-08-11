/**
 * BLONG Offline Manager
 * Comprehensive offline detection and messaging system
 */

import { useState, useEffect, useRef } from 'react';
import { AppState, Alert } from 'react-native';

// Conditional NetInfo import for better compatibility
let NetInfo;
try {
  NetInfo = require('@react-native-community/netinfo');
} catch (error) {
  console.warn('NetInfo not available, offline detection disabled');
  NetInfo = null;
}

// Offline Manager Class
class OfflineManager {
  constructor() {
    this.isOnline = true;
    this.listeners = new Set();
    this.retryQueue = [];
    this.appStateListener = null;
    this.netInfoUnsubscribe = null;
    this.lastOnlineTime = Date.now();
    this.offlineStartTime = null;
    
    this.initialize();
  }

  initialize() {
    // Set up network state monitoring
    if (NetInfo) {
      this.netInfoUnsubscribe = NetInfo.addEventListener(this.handleNetworkChange.bind(this));
      
      // Get initial network state
      NetInfo.fetch().then(state => {
        this.isOnline = state.isConnected;
        console.log('🌐 Initial network state:', this.isOnline ? 'online' : 'offline');
      }).catch(error => {
        console.warn('Failed to get initial network state:', error);
      });
    }

    // Set up app state monitoring
    this.appStateListener = AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  handleNetworkChange(state) {
    const wasOnline = this.isOnline;
    this.isOnline = state.isConnected;
    
    console.log('🌐 Network state changed:', {
      from: wasOnline ? 'online' : 'offline',
      to: this.isOnline ? 'online' : 'offline',
      type: state.type,
      details: state.details
    });

    if (wasOnline && !this.isOnline) {
      // Just went offline
      this.offlineStartTime = Date.now();
      this.notifyListeners({
        type: 'offline',
        isOnline: false,
        offlineDuration: 0,
        networkType: state.type,
        networkDetails: state.details,
      });
    } else if (!wasOnline && this.isOnline) {
      // Just came back online
      const offlineDuration = this.offlineStartTime ? Date.now() - this.offlineStartTime : 0;
      this.lastOnlineTime = Date.now();
      this.offlineStartTime = null;
      
      this.notifyListeners({
        type: 'online',
        isOnline: true,
        offlineDuration,
        networkType: state.type,
        networkDetails: state.details,
      });

      // Process retry queue
      this.processRetryQueue();
    }
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active' && NetInfo) {
      // Check network state when app becomes active
      NetInfo.fetch().then(state => {
        if (state.isConnected !== this.isOnline) {
          this.handleNetworkChange(state);
        }
      }).catch(error => {
        console.warn('Failed to check network state on app focus:', error);
      });
    }
  }

  addListener(listener) {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyListeners(networkState) {
    this.listeners.forEach(listener => {
      try {
        listener(networkState);
      } catch (error) {
        console.error('Error in network state listener:', error);
      }
    });
  }

  addToRetryQueue(operation) {
    this.retryQueue.push({
      operation,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    });
    
    console.log(`📋 Added operation to retry queue (${this.retryQueue.length} total)`);
  }

  async processRetryQueue() {
    if (this.retryQueue.length === 0) return;
    
    console.log(`🔄 Processing retry queue (${this.retryQueue.length} operations)`);
    
    const operations = [...this.retryQueue];
    this.retryQueue = [];
    
    for (const { operation, id } of operations) {
      try {
        console.log(`🔄 Retrying operation ${id}`);
        await operation();
        console.log(`✅ Operation ${id} completed successfully`);
      } catch (error) {
        console.error(`❌ Operation ${id} failed again:`, error);
        // Could add back to queue or show user notification
      }
    }
  }

  getNetworkState() {
    return {
      isOnline: this.isOnline,
      lastOnlineTime: this.lastOnlineTime,
      offlineStartTime: this.offlineStartTime,
      offlineDuration: this.offlineStartTime ? Date.now() - this.offlineStartTime : 0,
    };
  }

  showOfflineAlert(options = {}) {
    const {
      title = 'You\'re Offline',
      message = 'Please check your internet connection and try again.',
      retryAction = null,
      cancelAction = null,
    } = options;

    const buttons = [];
    
    if (cancelAction) {
      buttons.push({
        text: 'Cancel',
        style: 'cancel',
        onPress: cancelAction,
      });
    }
    
    if (retryAction) {
      buttons.push({
        text: 'Retry',
        onPress: retryAction,
      });
    } else {
      buttons.push({
        text: 'OK',
        onPress: () => {},
      });
    }

    Alert.alert(title, message, buttons);
  }

  cleanup() {
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
    }
    
    if (this.appStateListener) {
      this.appStateListener.remove();
    }
    
    this.listeners.clear();
    this.retryQueue = [];
  }
}

// Singleton instance
const offlineManager = new OfflineManager();

// React Hook for using offline manager
export const useOfflineManager = () => {
  const [networkState, setNetworkState] = useState(() => offlineManager.getNetworkState());
  const listenerRef = useRef(null);

  useEffect(() => {
    // Subscribe to network changes
    listenerRef.current = offlineManager.addListener((state) => {
      setNetworkState({
        ...offlineManager.getNetworkState(),
        ...state,
      });
    });

    // Update initial state
    setNetworkState(offlineManager.getNetworkState());

    // Cleanup on unmount
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
      }
    };
  }, []);

  return {
    ...networkState,
    addToRetryQueue: offlineManager.addToRetryQueue.bind(offlineManager),
    showOfflineAlert: offlineManager.showOfflineAlert.bind(offlineManager),
  };
};

// Utility functions
export const isOnline = () => offlineManager.isOnline;
export const getNetworkState = () => offlineManager.getNetworkState();
export const addToRetryQueue = (operation) => offlineManager.addToRetryQueue(operation);

export default offlineManager;