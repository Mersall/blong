/**
 * Global Jest setup
 * Runs once before all test files
 */

export default async (): Promise<void> => {
  console.log('🚀 Starting BLONG Backend Test Suite...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-purposes-only';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/blong_test';
  
  // Global test timeout
  jest.setTimeout(30000);
  
  console.log('✅ Global test setup completed');
};