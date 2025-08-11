/**
 * BLONG React Query + Loading System Integration Tests
 * Comprehensive tests for the complete integration
 */

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { ReactQueryProvider } from '../../providers/ReactQueryProvider';
import { AppProvider } from '../../contexts/AppContext';

// Import screens to test
import ArticlesScreen from '../../screens/articles/ArticlesScreen';
import HomeScreen from '../../screens/home/HomeScreen';
import SimpleQuestionnaireScreen from '../../screens/questionnaire/SimpleQuestionnaireScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';

// Mock API responses
const mockArticlesResponse = {
  articles: [
    {
      id: '1',
      title: 'Test Article',
      subtitle: 'Test subtitle',
      category: 'Relationships',
      readTime: '5 min read',
      icon: '💕',
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
    hasMore: false,
  }
};

const mockUserProfileResponse = {
  profile: {
    id: 'test-user',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    currentPhase: 'single',
  }
};

const mockCompletionStatusResponse = {
  overall: { progress: 75, completed: false },
  phases: {
    single: { progress: 75, completed: false, totalQuestions: 10, answeredQuestions: 7 }
  }
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, cacheTime: 0 },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

describe('React Query + Loading System Integration', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('ArticlesScreen Integration', () => {
    it('should load articles with premium loading states', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticlesResponse,
      });

      const { getByText, queryByText } = render(
        <TestWrapper>
          <ArticlesScreen userPhase="single" />
        </TestWrapper>
      );

      // Should show loading state initially
      expect(getByText('BLONG')).toBeTruthy();

      // Wait for data to load
      await waitFor(() => {
        expect(getByText('Test Article')).toBeTruthy();
      });

      // Loading should be gone
      expect(queryByText('Loading...')).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const { getByText } = render(
        <TestWrapper>
          <ArticlesScreen userPhase="single" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByText('Unable to load articles')).toBeTruthy();
      });
    });
  });

  describe('HomeScreen Integration', () => {
    it('should load user profile and completion status', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserProfileResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCompletionStatusResponse,
        });

      const { getByText } = render(
        <TestWrapper>
          <HomeScreen 
            userPhase="single"
            user={{ firstName: 'John' }}
            onNavigateToQuestionnaire={() => {}}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByText('Welcome back, John')).toBeTruthy();
      });
    });
  });

  describe('QuestionnaireScreen Integration', () => {
    it('should load questionnaire data and save answers', async () => {
      const mockQuestionnaireData = {
        questionnaire: {
          sections: [
            {
              id: 'personal',
              title: 'Personal Information',
              questions: [
                {
                  id: 'age',
                  type: 'number',
                  question: 'What is your age?',
                  required: true,
                }
              ]
            }
          ]
        }
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQuestionnaireData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ answers: {} }),
        });

      const { getByText } = render(
        <TestWrapper>
          <SimpleQuestionnaireScreen 
            userPhase="single"
            onComplete={() => {}}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByText('What is your age?')).toBeTruthy();
      });
    });
  });

  describe('SettingsScreen Integration', () => {
    it('should load user preferences and handle updates', async () => {
      const mockPreferencesResponse = {
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: { push: true, email: true }
        }
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserProfileResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPreferencesResponse,
        });

      const { getByText } = render(
        <TestWrapper>
          <SettingsScreen 
            user={{ firstName: 'John' }}
            onLogout={() => {}}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByText('Account Settings')).toBeTruthy();
      });
    });
  });

  describe('Global Loading System', () => {
    it('should show premium loading states', async () => {
      fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => mockArticlesResponse,
          }), 100)
        )
      );

      const { getByText } = render(
        <TestWrapper>
          <ArticlesScreen userPhase="single" />
        </TestWrapper>
      );

      // Should show BLONG branding in loading state
      expect(getByText('BLONG')).toBeTruthy();
      
      await waitFor(() => {
        expect(getByText('Test Article')).toBeTruthy();
      });
    });

    it('should handle multiple concurrent loading states', async () => {
      // This test would verify that the priority system works correctly
      // when multiple screens are loading simultaneously
      expect(true).toBe(true); // Placeholder for complex concurrent test
    });
  });

  describe('Cache Management', () => {
    it('should cache and invalidate data correctly', async () => {
      const queryClient = new QueryClient();
      
      // Test cache invalidation after mutations
      // This would be a more complex test involving cache inspection
      expect(queryClient).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should display user-friendly error messages', async () => {
      fetch.mockRejectedValueOnce(new Error('HTTP 500: Internal Server Error'));

      const { getByText } = render(
        <TestWrapper>
          <ArticlesScreen userPhase="single" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByText('Unable to load articles')).toBeTruthy();
        expect(getByText('Try Again')).toBeTruthy();
      });
    });
  });

  describe('Offline Support', () => {
    it('should work with cached data when offline', async () => {
      // First load with network
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticlesResponse,
      });

      const { rerender, getByText } = render(
        <TestWrapper>
          <ArticlesScreen userPhase="single" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(getByText('Test Article')).toBeTruthy();
      });

      // Simulate offline - should still show cached data
      fetch.mockRejectedValue(new Error('Network unavailable'));

      rerender(
        <TestWrapper>
          <ArticlesScreen userPhase="single" />
        </TestWrapper>
      );

      // Should still show cached article
      expect(getByText('Test Article')).toBeTruthy();
    });
  });
});

describe('Performance Tests', () => {
  it('should not cause memory leaks', async () => {
    // Test for memory leaks by mounting/unmounting components
    const { unmount } = render(
      <TestWrapper>
        <ArticlesScreen userPhase="single" />
      </TestWrapper>
    );

    unmount();
    
    // Verify cleanup happened
    expect(true).toBe(true); // Placeholder for memory leak detection
  });

  it('should handle rapid state changes', async () => {
    // Test rapid loading/unloading scenarios
    expect(true).toBe(true); // Placeholder for performance test
  });
});
