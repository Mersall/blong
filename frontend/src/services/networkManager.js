/**
 * BLONG Network Manager
 * Comprehensive network state management with offline support
 */

import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

class NetworkManager {
  constructor() {
    this.isConnected = true;
    this.connectionType = 'unknown';
    this.listeners = new Set();
    this.offlineQueue = [];
    this.retryAttempts = new Map();
    this.maxRetryAttempts = 3;
    this.retryDelay = 1000; // Start with 1 second
    this.maxRetryDelay = 30000; // Max 30 seconds

    this.initialize();
  }

  /**
   * Initialize network monitoring
   */
  async initialize() {
    try {
      // Get initial network state
      const netInfoState = await NetInfo.fetch();
      this.updateNetworkState(netInfoState);

      // Subscribe to network state changes
      this.unsubscribe = NetInfo.addEventListener(this.handleNetworkChange.bind(this));

      // Load offline queue from storage
      await this.loadOfflineQueue();
    } catch (error) {
      console.error('Failed to initialize NetworkManager:', error);
    }
  }

  /**
   * Handle network state changes
   */
  handleNetworkChange = (state) => {
    const wasConnected = this.isConnected;
    this.updateNetworkState(state);

    // If we just came back online, process offline queue
    if (!wasConnected && this.isConnected) {
      this.processOfflineQueue();
    }

    // Notify listeners
    this.notifyListeners({
      isConnected: this.isConnected,
      connectionType: this.connectionType,
      wasConnected,
      justConnected: !wasConnected && this.isConnected,
      justDisconnected: wasConnected && !this.isConnected,
    });
  };

  /**
   * Update internal network state
   */
  updateNetworkState(state) {
    this.isConnected = state.isConnected && state.isInternetReachable;
    this.connectionType = state.type;
    this.connectionDetails = {
      type: state.type,
      isWifiEnabled: state.isWifiEnabled,
      details: state.details,
    };
  }

  /**
   * Add network state listener
   */
  addListener(callback) {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of network changes
   */
  notifyListeners(networkState) {
    this.listeners.forEach(callback => {
      try {
        callback(networkState);
      } catch (error) {
        console.error('Error in network listener:', error);
      }
    });
  }

  /**
   * Check if device is currently online
   */
  isOnline() {
    return this.isConnected;
  }

  /**
   * Check if device is currently offline
   */
  isOffline() {
    return !this.isConnected;
  }

  /**
   * Get current connection type
   */
  getConnectionType() {
    return this.connectionType;
  }

  /**
   * Get detailed connection information
   */
  getConnectionDetails() {
    return this.connectionDetails;
  }

  /**
   * Add request to offline queue
   */
  async addToOfflineQueue(request) {
    try {
      const queueItem = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        request,
        attempts: 0,
      };

      this.offlineQueue.push(queueItem);
      await this.saveOfflineQueue();

      return queueItem.id;
    } catch (error) {
      console.error('Failed to add request to offline queue:', error);
      return null;
    }
  }

  /**
   * Process offline queue when connection is restored
   */
  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    console.log(`Processing ${this.offlineQueue.length} offline requests...`);

    const processPromises = this.offlineQueue.map(async (queueItem) => {
      try {
        await this.retryRequest(queueItem);
        return { success: true, id: queueItem.id };
      } catch (error) {
        console.error('Failed to process offline request:', error);
        return { success: false, id: queueItem.id, error };
      }
    });

    const results = await Promise.allSettled(processPromises);

    // Remove successfully processed items
    const successfulIds = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => result.value.id);

    this.offlineQueue = this.offlineQueue.filter(
      item => !successfulIds.includes(item.id)
    );

    await this.saveOfflineQueue();
  }

  /**
   * Retry a failed request with exponential backoff
   */
  async retryRequest(queueItem) {
    const { request, id } = queueItem;
    const currentAttempts = this.retryAttempts.get(id) || 0;

    if (currentAttempts >= this.maxRetryAttempts) {
      throw new Error(`Max retry attempts reached for request ${id}`);
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.retryDelay * Math.pow(2, currentAttempts),
      this.maxRetryDelay
    );

    // Wait before retry
    if (currentAttempts > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      // Attempt the request
      const result = await request.execute();

      // Success - remove from retry tracking
      this.retryAttempts.delete(id);

      return result;
    } catch (error) {
      // Update retry count
      this.retryAttempts.set(id, currentAttempts + 1);
      throw error;
    }
  }

  /**
   * Save offline queue to storage
   */
  async saveOfflineQueue() {
    try {
      await AsyncStorage.setItem(
        'networkManager_offlineQueue',
        JSON.stringify(this.offlineQueue)
      );
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Load offline queue from storage
   */
  async loadOfflineQueue() {
    try {
      const stored = await AsyncStorage.getItem('networkManager_offlineQueue');
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.offlineQueue = [];
    }
  }

  /**
   * Clear offline queue
   */
  async clearOfflineQueue() {
    this.offlineQueue = [];
    this.retryAttempts.clear();
    await this.saveOfflineQueue();
  }

  /**
   * Get offline queue status
   */
  getOfflineQueueStatus() {
    return {
      count: this.offlineQueue.length,
      items: this.offlineQueue.map(item => ({
        id: item.id,
        timestamp: item.timestamp,
        attempts: this.retryAttempts.get(item.id) || 0,
      })),
    };
  }

  /**
   * Show offline mode alert
   */
  showOfflineAlert() {
    Alert.alert(
      'You\'re Offline',
      'No internet connection detected. Your actions will be saved and processed when connection is restored.',
      [
        { text: 'OK', style: 'default' },
        {
          text: 'Retry Connection',
          onPress: () => this.checkConnection(),
          style: 'default'
        }
      ]
    );
  }

  /**
   * Manually check connection
   */
  async checkConnection() {
    try {
      const state = await NetInfo.fetch();
      this.handleNetworkChange(state);
      return this.isConnected;
    } catch (error) {
      console.error('Failed to check connection:', error);
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.listeners.clear();
    this.retryAttempts.clear();
  }
}

// Create singleton instance
const networkManager = new NetworkManager();

export default networkManager;