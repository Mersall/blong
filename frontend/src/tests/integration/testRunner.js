/**
 * BLONG Integration Test Runner
 * Simple test runner to verify React Query + Loading system integration
 */

import { QueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

// Test configuration
const TEST_CONFIG = {
  timeout: 5000,
  retries: 3,
};

class IntegrationTestRunner {
  constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, cacheTime: 0 },
        mutations: { retry: false },
      },
    });
    this.results = [];
  }

  async runTest(testName, testFn) {
    console.log(`🧪 Running test: ${testName}`);
    const startTime = Date.now();
    
    try {
      await Promise.race([
        testFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), TEST_CONFIG.timeout)
        )
      ]);
      
      const duration = Date.now() - startTime;
      console.log(`✅ ${testName} - PASSED (${duration}ms)`);
      this.results.push({ name: testName, status: 'PASSED', duration });
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`❌ ${testName} - FAILED (${duration}ms): ${error.message}`);
      this.results.push({ name: testName, status: 'FAILED', duration, error: error.message });
    }
  }

  async testApiClientConnection() {
    // Test basic API client functionality
    try {
      // This would normally make a real API call
      // For now, we'll just test the client exists and has the right methods
      if (!apiClient || typeof apiClient.request !== 'function') {
        throw new Error('API client not properly configured');
      }
      return true;
    } catch (error) {
      throw new Error(`API client test failed: ${error.message}`);
    }
  }

  async testQueryClientSetup() {
    // Test React Query client setup
    try {
      if (!this.queryClient) {
        throw new Error('Query client not initialized');
      }
      
      // Test basic query client functionality
      const cache = this.queryClient.getQueryCache();
      if (!cache) {
        throw new Error('Query cache not available');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Query client test failed: ${error.message}`);
    }
  }

  async testLoadingSystemIntegration() {
    // Test loading system integration
    try {
      // Import loading context (this would be more complex in a real test)
      const { LoadingProvider } = await import('../../contexts/LoadingContext');
      
      if (!LoadingProvider) {
        throw new Error('Loading provider not available');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Loading system test failed: ${error.message}`);
    }
  }

  async testApiServiceHooks() {
    // Test that all API service hooks are properly exported
    try {
      const apiServices = await import('../../services/api');
      
      const requiredHooks = [
        'useArticles',
        'useInfiniteArticles',
        'useUserProfile',
        'useCompletionStatus',
        'useQuestionnaireData',
        'useUserPreferences',
      ];
      
      for (const hookName of requiredHooks) {
        if (typeof apiServices[hookName] !== 'function') {
          throw new Error(`Hook ${hookName} not properly exported`);
        }
      }
      
      return true;
    } catch (error) {
      throw new Error(`API service hooks test failed: ${error.message}`);
    }
  }

  async testScreenImports() {
    // Test that all screens can be imported without errors
    try {
      const screens = [
        '../../screens/articles/ArticlesScreen',
        '../../screens/home/HomeScreen',
        '../../screens/questionnaire/SimpleQuestionnaireScreen',
        '../../screens/settings/SettingsScreen',
      ];
      
      for (const screenPath of screens) {
        const screen = await import(screenPath);
        if (!screen.default) {
          throw new Error(`Screen ${screenPath} not properly exported`);
        }
      }
      
      return true;
    } catch (error) {
      throw new Error(`Screen imports test failed: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting BLONG Integration Tests...\n');
    
    await this.runTest('API Client Connection', () => this.testApiClientConnection());
    await this.runTest('Query Client Setup', () => this.testQueryClientSetup());
    await this.runTest('Loading System Integration', () => this.testLoadingSystemIntegration());
    await this.runTest('API Service Hooks', () => this.testApiServiceHooks());
    await this.runTest('Screen Imports', () => this.testScreenImports());
    
    this.printResults();
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAILED')
        .forEach(result => {
          console.log(`  - ${result.name}: ${result.error}`);
        });
    }
    
    console.log('\n🎯 Integration Status:', failed === 0 ? '✅ READY' : '❌ NEEDS ATTENTION');
  }
}

// Export for use in other files
export default IntegrationTestRunner;

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const runner = new IntegrationTestRunner();
  runner.runAllTests().catch(console.error);
}
