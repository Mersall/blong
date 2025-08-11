/**
 * BLONG Enhanced API Service
 * API service with integrated error handling and premium error modal support
 */

import { apiService } from './apiService';
import ErrorProcessingService from './errorProcessingService';
import ErrorManager from './ErrorManager';
import networkManager from './networkManager';

class EnhancedApiService {
  constructor() {
    this.baseService = apiService;
  }

  /**
   * Enhanced GET request with error handling and network awareness
   */
  async get(endpoint, options = {}) {
    try {
      // Check network connectivity
      if (networkManager.isOffline()) {
        const request = {
          execute: () => this.baseService.get(endpoint, options),
          method: 'GET',
          endpoint,
          options,
        };

        // Add to offline queue
        await networkManager.addToOfflineQueue(request);

        throw new Error('No internet connection. Request queued for when online.');
      }

      return await this.baseService.get(endpoint, options);
    } catch (error) {
      return this.handleError(error, 'GET', endpoint, options);
    }
  }

  /**
   * Enhanced POST request with error handling and network awareness
   */
  async post(endpoint, data, options = {}) {
    try {
      // Check network connectivity
      if (networkManager.isOffline()) {
        const request = {
          execute: () => this.baseService.post(endpoint, data, options),
          method: 'POST',
          endpoint,
          data,
          options,
        };

        // Add to offline queue
        await networkManager.addToOfflineQueue(request);

        throw new Error('No internet connection. Request queued for when online.');
      }

      return await this.baseService.post(endpoint, data, options);
    } catch (error) {
      return this.handleError(error, 'POST', endpoint, { ...options, data });
    }
  }

  /**
   * Enhanced PUT request with error handling
   */
  async put(endpoint, data, options = {}) {
    try {
      return await this.baseService.put(endpoint, data, options);
    } catch (error) {
      return this.handleError(error, 'PUT', endpoint, { ...options, data });
    }
  }

  /**
   * Enhanced DELETE request with error handling
   */
  async delete(endpoint, options = {}) {
    try {
      return await this.baseService.delete(endpoint, options);
    } catch (error) {
      return this.handleError(error, 'DELETE', endpoint, options);
    }
  }

  /**
   * Handle API errors with intelligent processing
   */
  async handleError(error, method, endpoint, options = {}) {
    const context = {
      method,
      endpoint,
      options,
      timestamp: new Date().toISOString(),
    };

    // Process the error
    const processedError = ErrorProcessingService.processError(error, context);

    // Determine if we should show modal or throw
    const shouldShowModal = options.showErrorModal !== false;
    const shouldThrow = options.throwOnError !== false;

    if (shouldShowModal) {
      // Show appropriate error modal based on error type
      await this.showErrorModal(processedError, error, options);
    }

    if (shouldThrow) {
      // Re-throw the processed error for handling by the calling code
      const enhancedError = new Error(processedError.message);
      enhancedError.originalError = error;
      enhancedError.processedError = processedError;
      enhancedError.type = processedError.type;
      enhancedError.severity = processedError.severity;
      throw enhancedError;
    }

    return processedError;
  }

  /**
   * Show error modal based on error type
   */
  async showErrorModal(processedError, originalError, options = {}) {
    const errorOptions = {
      context: processedError.context,
      onRetry: options.onRetry,
      onContactSupport: options.onContactSupport,
      ...options.modalOptions
    };

    switch (processedError.type) {
      case 'network':
        if (options.onRetry) {
          await ErrorManager.showNetworkError(originalError, options.onRetry, errorOptions);
        } else {
          await ErrorManager.showError(originalError, errorOptions);
        }
        break;

      case 'validation':
        await ErrorManager.showValidationError(originalError, errorOptions);
        break;

      case 'authentication':
        await ErrorManager.showAuthError(originalError, errorOptions);
        break;

      case 'server':
        await ErrorManager.showServerError(originalError, errorOptions);
        break;

      default:
        await ErrorManager.showError(originalError, errorOptions);
        break;
    }
  }

  /**
   * Profile-specific API methods with enhanced error handling
   */
  async updateProfile(profileData, options = {}) {
    const enhancedOptions = {
      ...options,
      showErrorModal: true,
      modalOptions: {
        onRetry: () => this.updateProfile(profileData, options),
        onContactSupport: () => {
          // Navigate to support or show contact form
        }
      }
    };

    return this.put('/profile', profileData, enhancedOptions);
  }

  /**
   * Authentication-specific API methods
   */
  async signIn(credentials, options = {}) {
    const enhancedOptions = {
      ...options,
      showErrorModal: true,
      modalOptions: {
        onSignInAgain: () => {
          // Could clear fields or navigate to different auth method
        }
      }
    };

    return this.post('/auth/signin', credentials, enhancedOptions);
  }

  async register(userData, options = {}) {
    const enhancedOptions = {
      ...options,
      showErrorModal: true,
      modalOptions: {
        onRetry: () => this.register(userData, options)
      }
    };

    return this.post('/auth/register', userData, enhancedOptions);
  }

  /**
   * Silent API calls (no error modals)
   */
  async silentGet(endpoint, options = {}) {
    return this.get(endpoint, { ...options, showErrorModal: false });
  }

  async silentPost(endpoint, data, options = {}) {
    return this.post(endpoint, data, { ...options, showErrorModal: false });
  }

  /**
   * Batch API calls with error handling
   */
  async batchRequest(requests, options = {}) {
    const results = [];
    const errors = [];

    for (const request of requests) {
      try {
        const result = await this[request.method](
          request.endpoint, 
          request.data, 
          { ...request.options, showErrorModal: false }
        );
        results.push({ success: true, data: result, request });
      } catch (error) {
        results.push({ success: false, error, request });
        errors.push(error);
      }
    }

    // Show combined error modal if there were errors
    if (errors.length > 0 && options.showErrorModal !== false) {
      await ErrorManager.showMultipleErrors(errors, {
        context: { 
          operation: 'batch_request',
          totalRequests: requests.length,
          failedCount: errors.length 
        },
        ...options.modalOptions
      });
    }

    return {
      results,
      errors,
      hasErrors: errors.length > 0,
      successCount: results.filter(r => r.success).length,
      errorCount: errors.length
    };
  }

  /**
   * Upload with progress and error handling
   */
  async uploadWithProgress(endpoint, data, progressCallback, options = {}) {
    const enhancedOptions = {
      ...options,
      showErrorModal: true,
      modalOptions: {
        title: 'Upload Failed',
        onRetry: () => this.uploadWithProgress(endpoint, data, progressCallback, options)
      }
    };

    // Add progress handling if supported
    if (progressCallback && enhancedOptions.onUploadProgress) {
      enhancedOptions.onUploadProgress = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(progress);
      };
    }

    return this.post(endpoint, data, enhancedOptions);
  }

  /**
   * Retry wrapper for failed requests
   */
  async withRetry(requestFn, maxRetries = 3, delayMs = 1000, options = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          // Show error modal on final failure
          if (options.showErrorModal !== false) {
            await ErrorManager.showError(error, {
              context: { 
                operation: 'retry_failed',
                maxRetries,
                finalAttempt: attempt 
              },
              ...options.modalOptions
            });
          }
          break;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
    
    throw lastError;
  }

  /**
   * Health check with error reporting
   */
  async healthCheck() {
    try {
      await this.silentGet('/health');
      return { healthy: true };
    } catch (error) {
      const processedError = ErrorProcessingService.processError(error, {
        operation: 'health_check'
      });
      
      return { 
        healthy: false, 
        error: processedError,
        needsAttention: processedError.severity === 'critical'
      };
    }
  }
}

// Create and export singleton instance
const enhancedApiService = new EnhancedApiService();

export default enhancedApiService;
export { EnhancedApiService };