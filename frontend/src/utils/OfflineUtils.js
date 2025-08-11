/**
 * BLONG Offline Support Utilities
 * Comprehensive offline functionality and data synchronization
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  OFFLINE_QUEUE: 'blong_offline_queue',
  CACHED_DATA: 'blong_cached_data',
  USER_PREFERENCES: 'blong_user_preferences',
  OFFLINE_ACTIONS: 'blong_offline_actions',
  SYNC_STATUS: 'blong_sync_status',
};

// Offline data management
export const offlineStorage = {
  // Store data with expiration
  setItem: async (key, data, expirationHours = 24) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiration: Date.now() + (expirationHours * 60 * 60 * 1000),
      };
      await AsyncStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error storing offline data:', error);
      return false;
    }
  },

  // Retrieve data with expiration check
  getItem: async (key) => {
    try {
      const itemString = await AsyncStorage.getItem(key);
      if (!itemString) return null;

      const item = JSON.parse(itemString);
      
      // Check if expired
      if (Date.now() > item.expiration) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Error retrieving offline data:', error);
      return null;
    }
  },

  // Remove expired items
  cleanExpiredItems: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const blongKeys = keys.filter(key => key.startsWith('blong_'));
      
      for (const key of blongKeys) {
        const item = await offlineStorage.getItem(key);
        if (!item) {
          // Item was expired and removed by getItem
          continue;
        }
      }
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  },

  // Get storage usage
  getStorageUsage: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const blongKeys = keys.filter(key => key.startsWith('blong_'));
      
      let totalSize = 0;
      for (const key of blongKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      }

      return {
        keys: blongKeys.length,
        sizeBytes: totalSize,
        sizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { keys: 0, sizeBytes: 0, sizeMB: '0.00' };
    }
  },
};

// Offline queue management
export const offlineQueue = {
  // Add action to offline queue
  addAction: async (action) => {
    try {
      const queue = await offlineQueue.getQueue();
      const actionWithId = {
        ...action,
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: 'pending',
      };
      
      queue.push(actionWithId);
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
      return actionWithId.id;
    } catch (error) {
      console.error('Error adding action to offline queue:', error);
      return null;
    }
  },

  // Get offline queue
  getQueue: async () => {
    try {
      const queueString = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return queueString ? JSON.parse(queueString) : [];
    } catch (error) {
      console.error('Error getting offline queue:', error);
      return [];
    }
  },

  // Update action status
  updateActionStatus: async (actionId, status, result = null) => {
    try {
      const queue = await offlineQueue.getQueue();
      const actionIndex = queue.findIndex(action => action.id === actionId);
      
      if (actionIndex !== -1) {
        queue[actionIndex].status = status;
        queue[actionIndex].result = result;
        queue[actionIndex].updatedAt = Date.now();
        
        await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating action status:', error);
      return false;
    }
  },

  // Remove completed actions
  cleanCompletedActions: async () => {
    try {
      const queue = await offlineQueue.getQueue();
      const pendingActions = queue.filter(action => 
        action.status === 'pending' || action.status === 'retrying'
      );
      
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(pendingActions));
      return queue.length - pendingActions.length; // Number of cleaned actions
    } catch (error) {
      console.error('Error cleaning completed actions:', error);
      return 0;
    }
  },

  // Clear all actions
  clearQueue: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return true;
    } catch (error) {
      console.error('Error clearing offline queue:', error);
      return false;
    }
  },
};

// Network status monitoring
export const networkMonitoring = {
  // Connection states
  CONNECTION_STATES: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    SLOW: 'slow',
    UNKNOWN: 'unknown',
  },

  // Get current connection info
  getConnectionInfo: async () => {
    try {
      // This would integrate with @react-native-community/netinfo
      return {
        isConnected: true,
        type: 'wifi',
        effectiveType: '4g',
        speed: 'fast',
      };
    } catch (error) {
      console.error('Error getting connection info:', error);
      return {
        isConnected: false,
        type: null,
        effectiveType: null,
        speed: 'unknown',
      };
    }
  },

  // Check if connection is suitable for sync
  isSuitableForSync: (connectionInfo) => {
    if (!connectionInfo.isConnected) return false;
    
    // Don't sync on slow connections to preserve user data
    if (connectionInfo.effectiveType === '2g') return false;
    
    // Check if user is on cellular and has data restrictions
    if (connectionInfo.type === 'cellular') {
      // This could be configured by user preferences
      return true; // For now, allow cellular sync
    }
    
    return true;
  },
};

// Data synchronization
export const dataSynchronization = {
  // Sync strategies
  SYNC_STRATEGIES: {
    IMMEDIATE: 'immediate',      // Sync as soon as online
    SCHEDULED: 'scheduled',      // Sync at scheduled intervals
    USER_TRIGGERED: 'user',      // Sync when user requests
    SMART: 'smart',             // Sync based on usage patterns
  },

  // Sync offline actions
  syncOfflineActions: async (strategy = dataSynchronization.SYNC_STRATEGIES.SMART) => {
    try {
      const connectionInfo = await networkMonitoring.getConnectionInfo();
      
      if (!networkMonitoring.isSuitableForSync(connectionInfo)) {
        return { success: false, reason: 'unsuitable_connection' };
      }

      const queue = await offlineQueue.getQueue();
      const pendingActions = queue.filter(action => action.status === 'pending');
      
      let syncedCount = 0;
      let failedCount = 0;

      for (const action of pendingActions) {
        try {
          await offlineQueue.updateActionStatus(action.id, 'syncing');
          
          // Execute the action
          const result = await dataSynchronization.executeAction(action);
          
          await offlineQueue.updateActionStatus(action.id, 'completed', result);
          syncedCount++;
        } catch (error) {
          console.error('Error syncing action:', error);
          await offlineQueue.updateActionStatus(action.id, 'failed', { error: error.message });
          failedCount++;
        }
      }

      // Clean completed actions
      await offlineQueue.cleanCompletedActions();

      return {
        success: true,
        syncedCount,
        failedCount,
        totalProcessed: syncedCount + failedCount,
      };
    } catch (error) {
      console.error('Error during sync:', error);
      return { success: false, reason: 'sync_error', error: error.message };
    }
  },

  // Execute individual action
  executeAction: async (action) => {
    switch (action.type) {
      case 'quiz_response':
        // Sync quiz response
        return await dataSynchronization.syncQuizResponse(action.data);
      
      case 'profile_update':
        // Sync profile update
        return await dataSynchronization.syncProfileUpdate(action.data);
      
      case 'preference_update':
        // Sync preference update
        return await dataSynchronization.syncPreferenceUpdate(action.data);
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  },

  // Sync quiz response
  syncQuizResponse: async (data) => {
    // Implementation would call the actual API
    console.log('Syncing quiz response:', data);
    return { success: true, id: data.questionId };
  },

  // Sync profile update
  syncProfileUpdate: async (data) => {
    // Implementation would call the actual API
    console.log('Syncing profile update:', data);
    return { success: true, fields: Object.keys(data) };
  },

  // Sync preference update
  syncPreferenceUpdate: async (data) => {
    // Implementation would call the actual API
    console.log('Syncing preference update:', data);
    return { success: true, preferences: data };
  },
};

// Conflict resolution
export const conflictResolution = {
  // Conflict resolution strategies
  STRATEGIES: {
    CLIENT_WINS: 'client_wins',     // Local changes take precedence
    SERVER_WINS: 'server_wins',     // Server changes take precedence
    MERGE: 'merge',                 // Attempt to merge changes
    USER_CHOICE: 'user_choice',     // Let user decide
  },

  // Resolve data conflicts
  resolveConflict: async (localData, serverData, strategy = conflictResolution.STRATEGIES.MERGE) => {
    switch (strategy) {
      case conflictResolution.STRATEGIES.CLIENT_WINS:
        return localData;
      
      case conflictResolution.STRATEGIES.SERVER_WINS:
        return serverData;
      
      case conflictResolution.STRATEGIES.MERGE:
        return conflictResolution.mergeData(localData, serverData);
      
      case conflictResolution.STRATEGIES.USER_CHOICE:
        return await conflictResolution.promptUserChoice(localData, serverData);
      
      default:
        return serverData;
    }
  },

  // Merge data intelligently
  mergeData: (localData, serverData) => {
    // Simple merge strategy - server wins for conflicts, local additions preserved
    const merged = { ...serverData };
    
    Object.keys(localData).forEach(key => {
      if (!(key in serverData)) {
        merged[key] = localData[key];
      }
    });
    
    return merged;
  },

  // Prompt user for conflict resolution
  promptUserChoice: async (localData, serverData) => {
    // This would show a UI for user to choose
    // For now, default to server data
    return serverData;
  },
};

// React hooks for offline functionality
export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    // Monitor network state
    const updateConnectionInfo = async () => {
      const info = await networkMonitoring.getConnectionInfo();
      setConnectionInfo(info);
      setIsOnline(info.isConnected);
    };

    updateConnectionInfo();
    
    // Set up network state listener
    // This would integrate with NetInfo
    
    return () => {
      // Cleanup listener
    };
  }, []);

  return {
    isOnline,
    connectionInfo,
    isSlowConnection: connectionInfo?.effectiveType === '2g',
    isCellular: connectionInfo?.type === 'cellular',
  };
};

// Hook for offline queue management
export const useOfflineQueue = () => {
  const [queueSize, setQueueSize] = useState(0);
  const [isSync, setIsSyncing] = useState(false);

  const addToQueue = useCallback(async (action) => {
    const actionId = await offlineQueue.addAction(action);
    if (actionId) {
      setQueueSize(prev => prev + 1);
    }
    return actionId;
  }, []);

  const syncQueue = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await dataSynchronization.syncOfflineActions();
      if (result.success) {
        setQueueSize(prev => Math.max(0, prev - result.syncedCount));
      }
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const getQueueStatus = useCallback(async () => {
    const queue = await offlineQueue.getQueue();
    setQueueSize(queue.length);
    return {
      total: queue.length,
      pending: queue.filter(a => a.status === 'pending').length,
      failed: queue.filter(a => a.status === 'failed').length,
    };
  }, []);

  useEffect(() => {
    getQueueStatus();
  }, []);

  return {
    queueSize,
    isSync,
    addToQueue,
    syncQueue,
    getQueueStatus,
  };
};

// Main offline utility
export const offline = {
  offlineStorage,
  offlineQueue,
  networkMonitoring,
  dataSynchronization,
  conflictResolution,
  useOffline,
  useOfflineQueue,
};

export default offline;