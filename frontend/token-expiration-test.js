/**
 * BLONG Token Expiration Test
 * Test script to verify automatic logout functionality
 */

import { authService, tokenManager } from './src/services/authService';
import { apiService } from './src/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('🧪 Starting Token Expiration Tests...\n');

// Test 1: Token Validation
async function testTokenValidation() {
  console.log('📝 Test 1: Token Validation');
  
  try {
    // Clear any existing tokens
    await tokenManager.clearTokens();
    
    // Test with no token
    console.log('  Testing with no token...');
    const isValid1 = await tokenManager.validateToken();
    console.log('  ✅ No token validation:', !isValid1 ? 'PASS' : 'FAIL');
    
    // Save a mock expired token
    console.log('  Testing with expired token...');
    const expiredTokenInfo = {
      timestamp: Date.now() - 7200000, // 2 hours ago
      expiresIn: 3600, // 1 hour expiry
    };
    
    await AsyncStorage.setItem('@blong_access_token', 'mock_expired_token');
    await AsyncStorage.setItem('@blong_token_info', JSON.stringify(expiredTokenInfo));
    
    const isExpired = await tokenManager.isTokenExpired();
    console.log('  ✅ Expired token detection:', isExpired ? 'PASS' : 'FAIL');
    
    // Test validation with expired token
    const isValid2 = await tokenManager.validateToken();
    console.log('  ✅ Expired token validation:', !isValid2 ? 'PASS' : 'FAIL');
    
  } catch (error) {
    console.log('  ❌ Token validation test failed:', error.message);
  }
  
  console.log('');
}

// Test 2: API Service Token Expiration Detection
async function testAPITokenExpiration() {
  console.log('📝 Test 2: API Service Token Expiration Detection');
  
  try {
    // Mock fetch to return 401
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      })
    );
    
    console.log('  Testing API call with 401 response...');
    
    try {
      await apiService.get('/test-endpoint');
      console.log('  ❌ API should have thrown token expiration error');
    } catch (error) {
      if (error.isTokenExpired) {
        console.log('  ✅ Token expiration error detected: PASS');
      } else {
        console.log('  ❌ Wrong error type:', error.message);
      }
    }
    
    // Restore original fetch
    global.fetch = originalFetch;
    
  } catch (error) {
    console.log('  ❌ API token expiration test failed:', error.message);
  }
  
  console.log('');
}

// Test 3: Force Logout Functionality
async function testForceLogout() {
  console.log('📝 Test 3: Force Logout Functionality');
  
  try {
    // Set up some mock data
    await AsyncStorage.setItem('@blong_access_token', 'mock_token');
    await AsyncStorage.setItem('@blong_user_data', JSON.stringify({ id: 1, email: 'test@blong.app' }));
    
    console.log('  Setting up mock authentication data...');
    const userBefore = await AsyncStorage.getItem('@blong_user_data');
    console.log('  User data before logout:', userBefore ? 'EXISTS' : 'NONE');
    
    // Test force logout
    console.log('  Testing force logout...');
    const result = await authService.forceLogout('Test session expiry');
    
    // Check if data was cleared
    const tokenAfter = await AsyncStorage.getItem('@blong_access_token');
    const userAfter = await AsyncStorage.getItem('@blong_user_data');
    
    console.log('  ✅ Force logout result:', result.success ? 'PASS' : 'FAIL');
    console.log('  ✅ Token cleared:', !tokenAfter ? 'PASS' : 'FAIL');
    console.log('  ✅ User data cleared:', !userAfter ? 'PASS' : 'FAIL');
    
  } catch (error) {
    console.log('  ❌ Force logout test failed:', error.message);
  }
  
  console.log('');
}

// Test 4: Authentication Validation
async function testAuthValidation() {
  console.log('📝 Test 4: Authentication Validation');
  
  try {
    // Test with no authentication
    console.log('  Testing validation with no auth...');
    const result1 = await authService.validateAuthentication();
    console.log('  ✅ No auth validation:', !result1.isValid ? 'PASS' : 'FAIL');
    
    // Test with valid authentication
    console.log('  Testing validation with valid auth...');
    const validTokenInfo = {
      timestamp: Date.now(),
      expiresIn: 3600, // 1 hour
    };
    
    await AsyncStorage.setItem('@blong_access_token', 'valid_token');
    await AsyncStorage.setItem('@blong_token_info', JSON.stringify(validTokenInfo));
    await AsyncStorage.setItem('@blong_user_data', JSON.stringify({ id: 1, email: 'test@blong.app' }));
    
    const result2 = await authService.validateAuthentication();
    console.log('  ✅ Valid auth validation:', result2.isValid ? 'PASS' : 'FAIL');
    console.log('  ✅ User returned:', result2.user ? 'PASS' : 'FAIL');
    
  } catch (error) {
    console.log('  ❌ Auth validation test failed:', error.message);
  }
  
  console.log('');
}

// Test 5: Error Detection
async function testErrorDetection() {
  console.log('📝 Test 5: Token Expiration Error Detection');
  
  try {
    // Test various error scenarios
    const errors = [
      { statusCode: 401, message: 'Unauthorized', expected: true },
      { statusCode: 403, message: 'Forbidden', expected: true },
      { isTokenExpired: true, expected: true },
      { message: 'Token expired', expected: true },
      { statusCode: 500, message: 'Server Error', expected: false },
      { message: 'Network Error', expected: false },
    ];
    
    errors.forEach((testError, index) => {
      const isTokenError = apiService.isTokenExpirationError(testError);
      const result = isTokenError === testError.expected ? 'PASS' : 'FAIL';
      console.log(`  ✅ Error detection ${index + 1}:`, result, `(${testError.message})`);
    });
    
  } catch (error) {
    console.log('  ❌ Error detection test failed:', error.message);
  }
  
  console.log('');
}

// Run all tests
async function runAllTests() {
  try {
    await testTokenValidation();
    await testAPITokenExpiration();
    await testForceLogout();
    await testAuthValidation();
    await testErrorDetection();
    
    console.log('🎉 All token expiration tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Token validation and expiration detection');
    console.log('- API service 401/403 response handling');
    console.log('- Automatic logout and token clearing');
    console.log('- Authentication state validation');
    console.log('- Error type detection and handling');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Mock setup for testing
const setupMocks = () => {
  // Mock AsyncStorage if not available
  if (!global.AsyncStorage) {
    const mockStorage = {};
    global.AsyncStorage = {
      getItem: jest.fn((key) => Promise.resolve(mockStorage[key] || null)),
      setItem: jest.fn((key, value) => {
        mockStorage[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete mockStorage[key];
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys) => {
        keys.forEach(key => delete mockStorage[key]);
        return Promise.resolve();
      }),
      multiSet: jest.fn((pairs) => {
        pairs.forEach(([key, value]) => mockStorage[key] = value);
        return Promise.resolve();
      }),
    };
  }
  
  // Mock console methods
  global.console = {
    ...console,
    log: jest.fn(console.log),
    error: jest.fn(console.error),
    warn: jest.fn(console.warn),
  };
};

// Export for use in test runner
export {
  runAllTests,
  setupMocks,
  testTokenValidation,
  testAPITokenExpiration,
  testForceLogout,
  testAuthValidation,
  testErrorDetection,
};

// Run tests if called directly
if (require.main === module) {
  setupMocks();
  runAllTests();
}