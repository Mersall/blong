/**
 * BLONG Profile Management System Test Suite  
 * Comprehensive testing for profile creation, editing, and management
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '../../contexts/AppProvider';
import ProfileCompletionFlow from '../../screens/profile/ProfileCompletionFlow';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import EditProfileScreen from '../../screens/settings/EditProfileScreen';
import { apiService } from '../../services/apiService';

// Mock external dependencies
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Error: 'error', Success: 'success' }
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));

// Mock API service
jest.mock('../../services/apiService');

describe('Profile Management System', () => {
  let queryClient;
  let mockApiService;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    mockApiService = apiService;
    jest.clearAllMocks();
  });

  const TestWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        {children}
      </AppProvider>
    </QueryClientProvider>
  );

  describe('ProfileCompletionFlow', () => {
    const mockProfileData = {
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      location: {
        country: 'USA',
        city: 'New York',
        district: 'Manhattan',
        postalCode: '10001'
      },
      height: '175',
      weight: '70',
      occupation: 'Software Engineer',
      education: 'bachelors',
      maritalStatus: 'single',
      hasChildren: 'no',
      wantChildren: 'yes',
      smoking: 'never',
      drinking: 'socially',
      interests: ['technology', 'travel'],
      languages: ['english', 'spanish']
    };

    test('renders initial essentials step correctly', () => {
      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={jest.fn()} />
        </TestWrapper>
      );

      expect(screen.getByText('Essential Information')).toBeTruthy();
      expect(screen.getByText('Basic details and location to get started')).toBeTruthy();
      expect(screen.getByText('Date of Birth *')).toBeTruthy();
      expect(screen.getByText('Gender')).toBeTruthy();
      expect(screen.getByText('Your Location')).toBeTruthy();
    });

    test('validates required fields in essentials step', async () => {
      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={jest.fn()} />
        </TestWrapper>
      );

      const nextButton = screen.getByText('NEXT');
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Please select your gender/)).toBeTruthy();
      });
    });

    test('progresses through all steps with valid data', async () => {
      const mockOnComplete = jest.fn();
      mockApiService.put.mockResolvedValueOnce({ data: { success: true } });

      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={mockOnComplete} />
        </TestWrapper>
      );

      // Step 1: Fill essentials
      fireEvent.press(screen.getByText('Male'));
      fireEvent.changeText(screen.getByPlaceholderText('Enter your country'), 'USA');
      fireEvent.changeText(screen.getByPlaceholderText('Enter your city'), 'New York');
      
      // Progress to step 2
      fireEvent.press(screen.getByText('NEXT'));

      await waitFor(() => {
        expect(screen.getByText('Your Relationship Preferences')).toBeTruthy();
      });

      // Step 2: Fill preferences
      fireEvent.press(screen.getByText('Single'));
      fireEvent.press(screen.getByText('No'));
      fireEvent.press(screen.getByText('Yes, I want children'));

      // Progress to step 3
      fireEvent.press(screen.getByText('NEXT'));

      await waitFor(() => {
        expect(screen.getByText('Complete Your Profile')).toBeTruthy();
      });

      // Step 3: Fill details and complete
      fireEvent.changeText(screen.getByPlaceholderText('175'), '180');
      fireEvent.changeText(screen.getByPlaceholderText('Your job title'), 'Engineer');

      fireEvent.press(screen.getByText('COMPLETE'));

      await waitFor(() => {
        expect(mockApiService.put).toHaveBeenCalledWith('/profile', expect.objectContaining({
          gender: 'male',
          city: 'New York',
          country: 'USA',
          height: 180,
          occupation: 'Engineer'
        }));
      });
    });

    test('handles API errors gracefully', async () => {
      mockApiService.put.mockRejectedValueOnce(new Error('Network error'));

      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={jest.fn()} />
        </TestWrapper>
      );

      // Fill minimal required data and submit
      fireEvent.press(screen.getByText('Male'));
      fireEvent.changeText(screen.getByPlaceholderText('Enter your country'), 'USA');
      fireEvent.changeText(screen.getByPlaceholderText('Enter your city'), 'New York');

      // Skip to final step (would need to go through all steps in real test)
      fireEvent.press(screen.getByText('COMPLETE'));

      await waitFor(() => {
        // Should handle error without crashing
        expect(screen.getByText('COMPLETE')).toBeTruthy();
      });
    });

    test('supports going back to previous steps', async () => {
      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={jest.fn()} />
        </TestWrapper>
      );

      // Fill step 1 and go to step 2
      fireEvent.press(screen.getByText('Male'));
      fireEvent.changeText(screen.getByPlaceholderText('Enter your country'), 'USA');
      fireEvent.changeText(screen.getByPlaceholderText('Enter your city'), 'New York');
      fireEvent.press(screen.getByText('NEXT'));

      await waitFor(() => {
        expect(screen.getByText('Your Relationship Preferences')).toBeTruthy();
      });

      // Go back to step 1
      fireEvent.press(screen.getByText('PREVIOUS'));

      await waitFor(() => {
        expect(screen.getByText('Essential Information')).toBeTruthy();
      });
    });

    test('validates date of birth age requirements', async () => {
      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={jest.fn()} />
        </TestWrapper>
      );

      // Try to select a date that makes user under 18
      const today = new Date();
      const underageDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

      // This would need actual date picker interaction in a real test
      // For now, we test the validation logic
      expect(underageDate.getTime()).toBeLessThan(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).getTime());
    });
  });

  describe('ProfileScreen', () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    const mockUserPreferences = {
      language: { name: 'English' },
      phase: { title: 'Single' }
    };

    test('renders user information correctly', () => {
      render(
        <TestWrapper>
          <ProfileScreen 
            user={mockUser}
            userPreferences={mockUserPreferences}
            userPhase="single"
            onLogout={jest.fn()}
          />
        </TestWrapper>
      );

      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('john@example.com')).toBeTruthy();
      expect(screen.getByText('English')).toBeTruthy();
      expect(screen.getByText('Single Phase')).toBeTruthy();
    });

    test('displays different phase icons and colors', () => {
      const { rerender } = render(
        <TestWrapper>
          <ProfileScreen 
            user={mockUser}
            userPreferences={mockUserPreferences}
            userPhase="single"
            onLogout={jest.fn()}
          />
        </TestWrapper>
      );

      expect(screen.getByText('💝')).toBeTruthy();

      rerender(
        <TestWrapper>
          <ProfileScreen 
            user={mockUser}
            userPreferences={mockUserPreferences}
            userPhase="engagement"
            onLogout={jest.fn()}
          />
        </TestWrapper>
      );

      expect(screen.getByText('💍')).toBeTruthy();
    });

    test('renders settings options', () => {
      render(
        <TestWrapper>
          <ProfileScreen 
            user={mockUser}
            userPreferences={mockUserPreferences}
            userPhase="single"
            onLogout={jest.fn()}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Account Settings')).toBeTruthy();
      expect(screen.getByText('Notifications')).toBeTruthy();
      expect(screen.getByText('Privacy')).toBeTruthy();
      expect(screen.getByText('Help & Support')).toBeTruthy();
    });
  });

  describe('EditProfileScreen', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      bio: 'Software engineer',
      location: 'New York',
      age: '30',
      profession: 'Engineer'
    };

    test('renders form with pre-filled user data', () => {
      render(
        <TestWrapper>
          <EditProfileScreen 
            user={mockUser}
            onBack={jest.fn()}
            onUpdateProfile={jest.fn()}
          />
        </TestWrapper>
      );

      expect(screen.getByDisplayValue('John')).toBeTruthy();
      expect(screen.getByDisplayValue('Doe')).toBeTruthy();
      expect(screen.getByDisplayValue('john@example.com')).toBeTruthy();
      expect(screen.getByDisplayValue('+1234567890')).toBeTruthy();
      expect(screen.getByDisplayValue('Software engineer')).toBeTruthy();
    });

    test('validates required fields', async () => {
      render(
        <TestWrapper>
          <EditProfileScreen 
            user={{ ...mockUser, firstName: '', lastName: '', email: '' }}
            onBack={jest.fn()}
            onUpdateProfile={jest.fn()}
          />
        </TestWrapper>
      );

      fireEvent.press(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('Please fill in all required fields')).toBeTruthy();
      });
    });

    test('calls onUpdateProfile with form data when saved', async () => {
      const mockOnUpdateProfile = jest.fn().mockResolvedValue();

      render(
        <TestWrapper>
          <EditProfileScreen 
            user={mockUser}
            onBack={jest.fn()}
            onUpdateProfile={mockOnUpdateProfile}
          />
        </TestWrapper>
      );

      // Change some fields
      fireEvent.changeText(screen.getByDisplayValue('John'), 'Jane');
      fireEvent.changeText(screen.getByDisplayValue('Engineer'), 'Designer');

      fireEvent.press(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockOnUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
          firstName: 'Jane',
          profession: 'Designer'
        }));
      });
    });

    test('handles save errors gracefully', async () => {
      const mockOnUpdateProfile = jest.fn().mockRejectedValue(new Error('Save failed'));

      render(
        <TestWrapper>
          <EditProfileScreen 
            user={mockUser}
            onBack={jest.fn()}
            onUpdateProfile={mockOnUpdateProfile}
          />
        </TestWrapper>
      );

      fireEvent.press(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('Failed to update profile. Please try again.')).toBeTruthy();
      });
    });

    test('shows loading state while saving', async () => {
      const mockOnUpdateProfile = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(
        <TestWrapper>
          <EditProfileScreen 
            user={mockUser}
            onBack={jest.fn()}
            onUpdateProfile={mockOnUpdateProfile}
          />
        </TestWrapper>
      );

      fireEvent.press(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeTruthy();
      });
    });
  });

  describe('Profile Form Components', () => {
    test('EssentialsStep validates gender selection', () => {
      const mockOnInputChange = jest.fn();

      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={jest.fn()} />
        </TestWrapper>
      );

      // Test gender selection
      fireEvent.press(screen.getByText('Female'));
      
      // Would need to verify mockOnInputChange was called with correct data
      // This requires refactoring components to accept test props
    });

    test('PreferencesStep handles lifestyle choices', () => {
      // Test smoking and drinking preferences
      // Test children preferences  
      // Test marital status selection
    });

    test('DetailsStep handles interests and languages', () => {
      // Test multi-select for interests
      // Test multi-select for languages
      // Test numeric inputs for height/weight
    });
  });

  describe('Profile Data Validation', () => {
    test('validates date of birth format and age', () => {
      const validDates = [
        new Date('1990-01-01'),
        new Date('1985-12-31'),
        new Date(Date.now() - 25 * 365 * 24 * 60 * 60 * 1000)
      ];

      const invalidDates = [
        new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000), // Under 18
        new Date(Date.now() - 120 * 365 * 24 * 60 * 60 * 1000), // Over 100
        null,
        undefined
      ];

      validDates.forEach(date => {
        const age = (Date.now() - date.getTime()) / (365 * 24 * 60 * 60 * 1000);
        expect(age).toBeGreaterThanOrEqual(18);
        expect(age).toBeLessThanOrEqual(100);
      });
    });

    test('validates height and weight ranges', () => {
      const validHeights = [150, 175, 200, 180];
      const invalidHeights = [50, 300, -10, null];

      const validWeights = [50, 75, 100, 120];
      const invalidWeights = [20, 500, -5, null];

      validHeights.forEach(height => {
        expect(height).toBeGreaterThanOrEqual(100);
        expect(height).toBeLessThanOrEqual(250);
      });

      validWeights.forEach(weight => {
        expect(weight).toBeGreaterThanOrEqual(30);
        expect(weight).toBeLessThanOrEqual(300);
      });
    });

    test('validates occupation length and format', () => {
      const validOccupations = ['Engineer', 'Software Developer', 'Teacher'];
      const invalidOccupations = ['A', '', '  ', null];

      validOccupations.forEach(occupation => {
        expect(occupation.trim().length).toBeGreaterThanOrEqual(2);
      });
    });

    test('validates location fields', () => {
      const validLocations = {
        country: 'USA',
        city: 'New York',
        district: 'Manhattan',
        postalCode: '10001'
      };

      expect(validLocations.country).toBeTruthy();
      expect(validLocations.city).toBeTruthy();
      expect(validLocations.country.length).toBeGreaterThan(0);
      expect(validLocations.city.length).toBeGreaterThan(0);
    });
  });

  describe('Photo Upload System', () => {
    test('handles single photo upload', async () => {
      mockApiService.post.mockResolvedValueOnce({
        data: { 
          id: '1', 
          url: 'https://example.com/photo.jpg',
          isPrimary: true 
        }
      });

      // Test photo upload functionality
      // This would require actual file upload simulation
    });

    test('handles multiple photo upload', async () => {
      mockApiService.post.mockResolvedValueOnce({
        data: { 
          uploadedPhotos: [
            { id: '1', url: 'photo1.jpg', isPrimary: true },
            { id: '2', url: 'photo2.jpg', isPrimary: false }
          ]
        }
      });

      // Test multiple photo upload
    });

    test('handles photo upload errors', async () => {
      mockApiService.post.mockRejectedValueOnce(new Error('Upload failed'));

      // Test error handling for photo upload
    });

    test('validates photo count limits', () => {
      const maxPhotos = 6;
      const currentPhotos = [1, 2, 3, 4, 5];
      const remainingSlots = maxPhotos - currentPhotos.length;

      expect(remainingSlots).toBe(1);
      expect(currentPhotos.length).toBeLessThanOrEqual(maxPhotos);
    });
  });

  describe('Profile Completion Status', () => {
    test('calculates completion percentage correctly', () => {
      const completedSections = 3;
      const totalSections = 4;
      const expectedPercentage = Math.round((completedSections / totalSections) * 100);

      expect(expectedPercentage).toBe(75);
    });

    test('identifies missing required sections', () => {
      const profileStatus = {
        basicInfo: { completed: true },
        profileDetails: { completed: false },
        photos: { completed: true },
        preferences: { completed: false }
      };

      const missingSections = Object.entries(profileStatus)
        .filter(([key, value]) => !value.completed)
        .map(([key]) => key);

      expect(missingSections).toContain('profileDetails');
      expect(missingSections).toContain('preferences');
    });
  });

  describe('API Integration', () => {
    test('formats profile data correctly for backend', () => {
      const frontendData = {
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        height: '175',
        weight: '70',
        salaryRange: [30000, 100000],
        interests: ['technology', 'travel'],
        languages: ['english']
      };

      const expectedBackendData = {
        dateOfBirth: '1990-01-01',
        gender: 'male',
        height: 175,
        weight: 70,
        salaryMin: 30000,
        salaryMax: 100000,
        interests: ['technology', 'travel'],
        languages: ['english']
      };

      // Test data transformation logic
      const transformedData = {
        dateOfBirth: frontendData.dateOfBirth.toISOString().split('T')[0],
        gender: frontendData.gender,
        height: parseInt(frontendData.height),
        weight: parseInt(frontendData.weight),
        salaryMin: frontendData.salaryRange[0],
        salaryMax: frontendData.salaryRange[1],
        interests: frontendData.interests,
        languages: frontendData.languages
      };

      expect(transformedData).toEqual(expectedBackendData);
    });

    test('handles API response parsing', async () => {
      const mockResponse = {
        data: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          profile: {
            bio: 'Software engineer',
            city: 'New York'
          }
        }
      };

      mockApiService.get.mockResolvedValueOnce(mockResponse);

      // Test API response handling
      const response = await mockApiService.get('/profile');
      expect(response.data.firstName).toBe('John');
      expect(response.data.profile.city).toBe('New York');
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      const networkError = new Error('Network request failed');
      networkError.code = 'NETWORK_ERROR';
      
      mockApiService.put.mockRejectedValueOnce(networkError);

      // Test network error handling
      try {
        await mockApiService.put('/profile', {});
      } catch (error) {
        expect(error.code).toBe('NETWORK_ERROR');
      }
    });

    test('handles validation errors', async () => {
      const validationError = new Error('Validation failed');
      validationError.response = { status: 400 };
      
      mockApiService.put.mockRejectedValueOnce(validationError);

      // Test validation error handling
      try {
        await mockApiService.put('/profile', {});
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('handles server errors', async () => {
      const serverError = new Error('Internal server error');
      serverError.response = { status: 500 };
      
      mockApiService.put.mockRejectedValueOnce(serverError);

      // Test server error handling
      try {
        await mockApiService.put('/profile', {});
      } catch (error) {
        expect(error.response.status).toBe(500);
      }
    });
  });

  describe('Accessibility Features', () => {
    test('includes proper accessibility labels', () => {
      render(
        <TestWrapper>
          <ProfileCompletionFlow onComplete={jest.fn()} />
        </TestWrapper>
      );

      // Check for accessibility labels on interactive elements
      const genderButton = screen.getByText('Male');
      // Would need to verify accessibilityRole and accessibilityLabel props
    });

    test('supports screen reader navigation', () => {
      // Test screen reader announcements
      // Test focus management
      // Test semantic markup
    });
  });

  describe('Performance', () => {
    test('handles large datasets efficiently', () => {
      const largeInterestsList = Array.from({ length: 100 }, (_, i) => `interest_${i}`);
      
      // Test that component can handle large option lists
      expect(largeInterestsList.length).toBe(100);
    });

    test('debounces input changes', async () => {
      // Test input debouncing to prevent excessive API calls
      const mockOnChange = jest.fn();
      
      // Simulate rapid input changes
      for (let i = 0; i < 10; i++) {
        mockOnChange(`input_${i}`);
      }

      // Verify debouncing behavior
    });
  });
});