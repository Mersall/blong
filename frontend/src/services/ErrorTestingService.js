/**
 * BLONG Error Testing Service
 * Comprehensive testing utilities for the error handling system
 */

import ErrorManager from './ErrorManager';
import ErrorProcessingService from './errorProcessingService';

class ErrorTestingService {
  /**
   * Test all error modal types in sequence
   */
  static async testAllErrorTypes() {
    if (!__DEV__) {
      console.warn('Error testing is only available in development mode');
      return;
    }

    console.log('🧪 Starting comprehensive error modal testing...');

    const testCases = [
      {
        name: 'Network Error',
        error: new Error('Network request failed'),
        type: 'network',
        delay: 3000
      },
      {
        name: 'Timeout Error',
        error: { 
          message: 'Request timeout',
          code: 'TIMEOUT'
        },
        type: 'timeout',
        delay: 3000
      },
      {
        name: 'Validation Error - 400',
        error: {
          response: {
            status: 400,
            data: {
              message: 'Invalid input data',
              errors: {
                email: 'Email is required',
                password: 'Password must be at least 8 characters'
              }
            }
          }
        },
        type: 'validation',
        delay: 4000
      },
      {
        name: 'Validation Error - 422',
        error: {
          response: {
            status: 422,
            data: {
              message: 'Email already exists',
              errors: ['An account with this email already exists']
            }
          }
        },
        type: 'validation',
        delay: 4000
      },
      {
        name: 'Authentication Error - 401',
        error: {
          response: {
            status: 401,
            data: {
              message: 'Invalid credentials'
            }
          }
        },
        type: 'auth',
        delay: 3000
      },
      {
        name: 'Permission Error - 403',
        error: {
          response: {
            status: 403,
            data: {
              message: 'Insufficient permissions'
            }
          }
        },
        type: 'auth',
        delay: 3000
      },
      {
        name: 'Server Error - 500',
        error: {
          response: {
            status: 500,
            data: {
              message: 'Internal server error'
            }
          }
        },
        type: 'server',
        delay: 3000
      },
      {
        name: 'Service Unavailable - 503',
        error: {
          response: {
            status: 503,
            data: {
              message: 'Service temporarily unavailable'
            }
          }
        },
        type: 'server',
        delay: 3000
      },
      {
        name: 'Rate Limited - 429',
        error: {
          response: {
            status: 429,
            data: {
              message: 'Too many requests',
              retryAfter: 60
            }
          }
        },
        type: 'server',
        delay: 3000
      },
      {
        name: 'Unknown Error',
        error: new Error('Something unexpected happened'),
        type: 'unknown',
        delay: 3000
      }
    ];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`🧪 Testing: ${testCase.name}`);

      await ErrorManager.showError(testCase.error, {
        context: {
          test: true,
          testCase: testCase.name,
          testNumber: i + 1,
          totalTests: testCases.length
        },
        onClose: () => {
          console.log(`✅ Test completed: ${testCase.name}`);
        }
      });

      // Wait before showing next error
      await new Promise(resolve => setTimeout(resolve, testCase.delay));
    }

    console.log('🎉 All error modal tests completed!');
  }

  /**
   * Test specific error scenarios
   */
  static async testNetworkError() {
    const networkError = new Error('Network request failed');
    networkError.code = 'NETWORK_ERROR';

    await ErrorManager.showNetworkError(networkError, 
      () => {
        console.log('🔄 Retry function called');
        // Simulate retry success after 2 seconds
        setTimeout(() => {
          console.log('✅ Retry successful');
        }, 2000);
      },
      {
        context: { test: true, scenario: 'network_error' }
      }
    );
  }

  static async testValidationError() {
    const validationError = {
      response: {
        status: 422,
        data: {
          message: 'Validation failed',
          errors: {
            email: 'Please enter a valid email address',
            password: 'Password must be at least 8 characters',
            firstName: 'First name is required',
            dateOfBirth: 'Please select your date of birth'
          }
        }
      }
    };

    await ErrorManager.showValidationError(validationError, {
      context: { test: true, scenario: 'validation_error' }
    });
  }

  static async testAuthError() {
    const authError = {
      response: {
        status: 401,
        data: {
          message: 'Invalid email or password'
        }
      }
    };

    await ErrorManager.showAuthError(authError, {
      context: { test: true, scenario: 'auth_error' },
      onSignInAgain: () => {
        console.log('🔐 Sign in again action triggered');
      }
    });
  }

  static async testServerError() {
    const serverError = {
      response: {
        status: 500,
        data: {
          message: 'Internal server error',
          error: 'Database connection failed'
        }
      }
    };

    await ErrorManager.showServerError(serverError, {
      context: { test: true, scenario: 'server_error' },
      onRetry: () => {
        console.log('🔄 Server error retry triggered');
      },
      onContactSupport: () => {
        console.log('📞 Contact support triggered');
      }
    });
  }

  static async testCriticalError() {
    const criticalError = {
      response: {
        status: 503,
        data: {
          message: 'Service unavailable - critical system failure'
        }
      }
    };

    await ErrorManager.showCriticalError(criticalError, {
      context: { test: true, scenario: 'critical_error' },
      onRestartApp: () => {
        console.log('🔄 Restart app triggered');
      }
    });
  }

  static async testMultipleErrors() {
    const errors = [
      {
        response: {
          status: 400,
          data: { message: 'Invalid email format' }
        }
      },
      {
        response: {
          status: 400,
          data: { message: 'Password too weak' }
        }
      },
      new Error('Network connection lost')
    ];

    await ErrorManager.showMultipleErrors(errors, {
      context: { test: true, scenario: 'multiple_errors' }
    });
  }

  /**
   * Test error processing service
   */
  static testErrorProcessing() {
    console.log('🧪 Testing Error Processing Service...');

    const testErrors = [
      new Error('Network request failed'),
      {
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
            errors: { email: 'Invalid email' }
          }
        }
      },
      {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      },
      'Simple string error',
      { code: 'TIMEOUT', message: 'Request timed out' }
    ];

    testErrors.forEach((error, index) => {
      console.log(`\n🧪 Processing error ${index + 1}:`);
      console.log('Input:', error);
      
      const processed = ErrorProcessingService.processError(error, {
        test: true,
        errorIndex: index
      });
      
      console.log('Processed:', {
        type: processed.type,
        title: processed.title,
        message: processed.message,
        retryable: processed.retryable,
        suggestions: processed.suggestions
      });
    });

    console.log('\n✅ Error processing tests completed!');
  }

  /**
   * Test performance with many errors
   */
  static async testPerformance() {
    console.log('🧪 Testing error handling performance...');
    
    const startTime = Date.now();
    const errors = [];
    
    // Generate 100 test errors
    for (let i = 0; i < 100; i++) {
      errors.push(new Error(`Test error ${i}`));
    }
    
    // Process all errors
    const processedErrors = errors.map(error => 
      ErrorProcessingService.processError(error, { test: true, batch: true })
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Processed ${errors.length} errors in ${duration}ms`);
    console.log(`⚡ Average: ${(duration / errors.length).toFixed(2)}ms per error`);
    
    return {
      errorCount: errors.length,
      duration,
      averageTime: duration / errors.length,
      processedErrors
    };
  }

  /**
   * Test memory usage
   */
  static testMemoryUsage() {
    if (!__DEV__) return;

    console.log('🧪 Testing memory usage...');
    
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Create many error objects
    const errors = [];
    for (let i = 0; i < 1000; i++) {
      errors.push(ErrorProcessingService.processError(
        new Error(`Memory test error ${i}`),
        { test: true, memoryTest: true }
      ));
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    console.log(`📊 Memory usage increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    console.log(`📊 Average per error: ${(memoryIncrease / errors.length / 1024).toFixed(2)}KB`);
    
    // Cleanup
    errors.length = 0;
    
    return {
      initialMemory,
      finalMemory,
      memoryIncrease,
      averagePerError: memoryIncrease / 1000
    };
  }

  /**
   * Interactive testing menu
   */
  static showTestMenu() {
    if (!__DEV__) {
      console.warn('Error testing is only available in development mode');
      return;
    }

    console.log(`
🧪 BLONG Error Testing Menu
===========================

Available test functions:
1. ErrorTestingService.testAllErrorTypes() - Test all error modal types
2. ErrorTestingService.testNetworkError() - Test network error specifically
3. ErrorTestingService.testValidationError() - Test validation error
4. ErrorTestingService.testAuthError() - Test authentication error
5. ErrorTestingService.testServerError() - Test server error
6. ErrorTestingService.testCriticalError() - Test critical error
7. ErrorTestingService.testMultipleErrors() - Test multiple errors
8. ErrorTestingService.testErrorProcessing() - Test error processing
9. ErrorTestingService.testPerformance() - Test performance
10. ErrorTestingService.testMemoryUsage() - Test memory usage

Usage:
Import the service and call any of these methods in your development environment.

Example:
import ErrorTestingService from '../services/ErrorTestingService';
ErrorTestingService.testNetworkError();
    `);
  }

  /**
   * Quick smoke test
   */
  static async smokeTest() {
    console.log('🧪 Running error handling smoke test...');
    
    try {
      // Test error processing
      const testError = new Error('Smoke test error');
      const processed = ErrorProcessingService.processError(testError);
      
      if (!processed.title || !processed.message) {
        throw new Error('Error processing failed');
      }
      
      console.log('✅ Error processing: PASS');
      
      // Test error modal (silent)
      await ErrorManager.showError(testError, {
        context: { test: true, smokeTest: true },
        autoHide: true,
        autoHideDelay: 1000
      });
      
      console.log('✅ Error modal: PASS');
      console.log('🎉 Smoke test completed successfully!');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Smoke test failed:', error);
      return { success: false, error };
    }
  }
}

// Make testing service available globally in development
if (__DEV__) {
  global.ErrorTestingService = ErrorTestingService;
  console.log('🧪 ErrorTestingService available globally in development');
  console.log('Run ErrorTestingService.showTestMenu() to see available tests');
}

export default ErrorTestingService;