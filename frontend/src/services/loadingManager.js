/**
 * BLONG Loading Manager Service
 * Advanced loading state management with queuing and smart consolidation
 */

import { LOADING_TYPES, LOADING_PRIORITIES } from '../contexts/LoadingContext';

class LoadingManager {
  constructor() {
    this.loadingContext = null;
    this.operationQueue = new Map();
    this.operationHistory = new Map();
    this.debounceTimers = new Map();
  }

  // Initialize with loading context
  initialize(loadingContext) {
    this.loadingContext = loadingContext;
  }

  // Smart loading with automatic management
  async withLoading(operation, config = {}) {
    if (!this.loadingContext) {
      console.warn('LoadingManager not initialized with context');
      return await operation();
    }

    const operationId = this.generateOperationId();
    const loadingConfig = this.buildLoadingConfig(config);
    
    try {
      // Show loading
      const loadingId = this.loadingContext.showLoading({
        ...loadingConfig,
        operationId,
      });

      // Store operation reference
      this.operationQueue.set(operationId, {
        loadingId,
        startTime: Date.now(),
        config: loadingConfig,
      });

      // Execute operation
      const result = await operation((progress, message) => {
        this.updateProgress(operationId, progress, message);
      });

      // Success - hide loading
      this.completeOperation(operationId, true);
      return result;

    } catch (error) {
      // Error - hide loading and handle
      this.completeOperation(operationId, false, error);
      throw error;
    }
  }

  // Screen-level loading management
  showScreenLoading(message = 'Loading...', subtitle = null) {
    if (!this.loadingContext) return null;

    return this.loadingContext.showLoading({
      type: LOADING_TYPES.SCREEN,
      priority: LOADING_PRIORITIES.HIGH,
      message,
      subtitle,
    });
  }

  // Operation-level loading
  showOperationLoading(message = 'Processing...', options = {}) {
    if (!this.loadingContext) return null;

    return this.loadingContext.showLoading({
      type: LOADING_TYPES.OPERATION,
      priority: LOADING_PRIORITIES.MEDIUM,
      message,
      ...options,
    });
  }

  // Background loading (low priority)
  showBackgroundLoading(message = 'Syncing...') {
    if (!this.loadingContext) return null;

    return this.loadingContext.showLoading({
      type: LOADING_TYPES.BACKGROUND,
      priority: LOADING_PRIORITIES.LOW,
      message,
    });
  }

  // Inline loading for content areas
  showInlineLoading(message = 'Loading...') {
    if (!this.loadingContext) return null;

    return this.loadingContext.showLoading({
      type: LOADING_TYPES.INLINE,
      priority: LOADING_PRIORITIES.LOW,
      message,
    });
  }

  // Hide specific loading
  hideLoading(loadingId) {
    if (!this.loadingContext || !loadingId) return;
    this.loadingContext.hideLoading(loadingId);
  }

  // Debounced loading - prevents flickering for quick operations
  showDebouncedLoading(key, config, delay = 300) {
    if (!this.loadingContext) return null;

    // Clear existing timer
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      const loadingId = this.loadingContext.showLoading(config);
      this.debounceTimers.set(key, { loadingId, timer: null });
    }, delay);

    this.debounceTimers.set(key, { loadingId: null, timer });
    return key; // Return key for hiding
  }

  // Hide debounced loading
  hideDebouncedLoading(key) {
    const entry = this.debounceTimers.get(key);
    if (!entry) return;

    if (entry.timer) {
      // Cancel pending loading
      clearTimeout(entry.timer);
    } else if (entry.loadingId) {
      // Hide active loading
      this.hideLoading(entry.loadingId);
    }

    this.debounceTimers.delete(key);
  }

  // Batch operations with consolidated loading
  async withBatchLoading(operations, config = {}) {
    if (!this.loadingContext) {
      return await Promise.all(operations.map(op => op()));
    }

    const batchConfig = {
      type: LOADING_TYPES.OPERATION,
      priority: LOADING_PRIORITIES.MEDIUM,
      message: 'Processing multiple operations...',
      showProgress: true,
      progress: 0,
      ...config,
    };

    const loadingId = this.loadingContext.showLoading(batchConfig);
    
    try {
      const results = [];
      const total = operations.length;

      for (let i = 0; i < operations.length; i++) {
        const result = await operations[i]();
        results.push(result);

        // Update progress
        const progress = Math.round(((i + 1) / total) * 100);
        this.loadingContext.updateLoadingProgress(
          loadingId, 
          progress, 
          `Processing ${i + 1} of ${total}...`
        );
      }

      this.hideLoading(loadingId);
      return results;

    } catch (error) {
      this.hideLoading(loadingId);
      throw error;
    }
  }

  // Smart retry with loading feedback
  async withRetryLoading(operation, config = {}) {
    const retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      ...config,
    };

    let attempt = 0;
    let lastError;

    while (attempt <= retryConfig.maxRetries) {
      try {
        const message = attempt === 0 
          ? (config.message || 'Processing...')
          : `Retrying... (${attempt}/${retryConfig.maxRetries})`;

        return await this.withLoading(operation, {
          ...config,
          message,
        });

      } catch (error) {
        lastError = error;
        attempt++;

        if (attempt <= retryConfig.maxRetries) {
          // Wait before retry
          const delay = retryConfig.retryDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  // Utility methods
  generateOperationId() {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  buildLoadingConfig(config) {
    return {
      type: LOADING_TYPES.OPERATION,
      priority: LOADING_PRIORITIES.MEDIUM,
      message: 'Loading...',
      timeout: 30000,
      ...config,
    };
  }

  updateProgress(operationId, progress, message) {
    const operation = this.operationQueue.get(operationId);
    if (!operation || !this.loadingContext) return;

    this.loadingContext.updateLoadingProgress(
      operation.loadingId,
      progress,
      message
    );
  }

  completeOperation(operationId, success, error = null) {
    const operation = this.operationQueue.get(operationId);
    if (!operation) return;

    // Hide loading
    if (this.loadingContext) {
      this.loadingContext.hideLoading(operation.loadingId);
    }

    // Store in history for analytics
    this.operationHistory.set(operationId, {
      ...operation,
      endTime: Date.now(),
      duration: Date.now() - operation.startTime,
      success,
      error: error?.message,
    });

    // Clean up
    this.operationQueue.delete(operationId);

    // Keep history limited
    if (this.operationHistory.size > 100) {
      const oldestKey = this.operationHistory.keys().next().value;
      this.operationHistory.delete(oldestKey);
    }
  }

  // Analytics and debugging
  getOperationStats() {
    const history = Array.from(this.operationHistory.values());
    const successful = history.filter(op => op.success).length;
    const failed = history.filter(op => !op.success).length;
    const avgDuration = history.reduce((sum, op) => sum + op.duration, 0) / history.length;

    return {
      total: history.length,
      successful,
      failed,
      successRate: history.length > 0 ? (successful / history.length) * 100 : 0,
      averageDuration: Math.round(avgDuration),
      activeOperations: this.operationQueue.size,
    };
  }

  // Cleanup
  cleanup() {
    this.operationQueue.clear();
    this.operationHistory.clear();
    this.debounceTimers.forEach(entry => {
      if (entry.timer) clearTimeout(entry.timer);
    });
    this.debounceTimers.clear();
  }
}

// Create singleton instance
export const loadingManager = new LoadingManager();

export default loadingManager;
