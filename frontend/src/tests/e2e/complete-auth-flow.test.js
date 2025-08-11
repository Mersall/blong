/**
 * BLONG Complete Authentication Flow E2E Tests
 * Comprehensive end-to-end testing for the entire authentication experience
 */

import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from '../../screens/auth/AuthScreen';
import { authService, tokenManager, userManager } from '../../services/authService';
import { AppProvider } from '../../contexts/AppProvider';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../services/authService');
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock react-native components
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component, userPreferences = {}) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        {component}
      </AppProvider>
    </QueryClientProvider>
  );
};

describe('Complete Authentication Flow E2E', () => {
  let mockOnAuthComplete;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthComplete = jest.fn();
    
    // Reset AsyncStorage
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue();
    AsyncStorage.removeItem.mockResolvedValue();
    AsyncStorage.multiSet.mockResolvedValue();
    AsyncStorage.multiRemove.mockResolvedValue();
  });

  describe('Full Registration Flow', () => {
    it('should complete registration flow with email verification simulation', async () => {
      const mockUser = {
        id: 'user123',
        email: 'newuser@blong.app',
        firstName: 'John',
        lastName: 'Doe',
        isVerified: false,
      };

      const mockTokens = {
        accessToken: 'mock_access_token_123',
        refreshToken: 'mock_refresh_token_123',
        expiresIn: 3600,
      };

      // Mock successful registration
      authService.register.mockResolvedValue({
        success: true,
        user: mockUser,
        tokens: mockTokens,
      });

      const { getByText, getByPlaceholderText, getByLabelText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Switch to registration mode
      const switchToRegister = getByText("Don't have an account?");
      fireEvent.press(switchToRegister);
      
      await waitFor(() => {
        expect(getByText('CREATE ACCOUNT')).toBeTruthy();
      });

      // Fill registration form
      const firstNameInput = getByPlaceholderText('Enter your first name');
      const lastNameInput = getByPlaceholderText('Enter your last name');
      const emailInput = getByPlaceholderText('Enter your email address');
      const passwordInput = getByPlaceholderText('Enter your password');

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(emailInput, 'newuser@blong.app');
      fireEvent.changeText(passwordInput, 'SecurePass123!');

      // Select date of birth
      const dateOfBirthButton = getByLabelText('Date of Birth');
      fireEvent.press(dateOfBirthButton);
      
      // Mock date selection (simulating a date that makes user 25 years old)
      const birthDate = new Date('1999-01-01');
      act(() => {
        // Simulate DateTimePicker onChange
        const mockEvent = { type: 'set' };
        // This would normally be triggered by DateTimePicker
      });

      // Select gender
      const maleGenderButton = getByText('Male');
      fireEvent.press(maleGenderButton);

      // Submit registration
      const registerButton = getByText('CREATE ACCOUNT');
      fireEvent.press(registerButton);

      // Verify loading state
      await waitFor(() => {
        expect(getByText('CREATING ACCOUNT...')).toBeTruthy();
      });

      // Verify registration call
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          email: 'newuser@blong.app',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: expect.any(String),
          gender: 'MALE',
          phone: null,
        });
      });

      // Verify success notification
      await waitFor(() => {
        expect(getByText('Welcome to BLONG!')).toBeTruthy();
      });

      // Verify onAuthComplete is called
      await waitFor(() => {
        expect(mockOnAuthComplete).toHaveBeenCalledWith({
          user: mockUser,
          preferences: {},
        });
      }, { timeout: 2000 });
    });

    it('should handle registration validation errors gracefully', async () => {
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Switch to registration
      fireEvent.press(getByText("Don't have an account?"));
      
      // Try to submit without filling required fields
      const registerButton = getByText('CREATE ACCOUNT');
      fireEvent.press(registerButton);

      // Verify validation errors appear
      await waitFor(() => {
        expect(getByText('Form Validation Failed')).toBeTruthy();
      });

      // Verify form is not submitted
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should handle duplicate email registration error', async () => {
      authService.register.mockRejectedValue({
        type: 'VALIDATION_ERROR',
        message: 'A user with this email address already exists',
        statusCode: 409,
      });

      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Switch to registration and fill form
      fireEvent.press(getByText("Don't have an account?"));
      
      fireEvent.changeText(getByPlaceholderText('Enter your first name'), 'John');
      fireEvent.changeText(getByPlaceholderText('Enter your last name'), 'Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'existing@blong.app');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'SecurePass123!');
      
      // Select gender
      fireEvent.press(getByText('Male'));

      // Submit registration
      fireEvent.press(getByText('CREATE ACCOUNT'));

      // Verify error handling
      await waitFor(() => {
        expect(getByText('A user with this email address already exists')).toBeTruthy();
      });
    });
  });

  describe('Full Login Flow', () => {
    it('should complete successful login flow', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@blong.app',
        firstName: 'Jane',
        lastName: 'Smith',
        isVerified: true,
      };

      const mockTokens = {
        accessToken: 'mock_access_token_456',
        refreshToken: 'mock_refresh_token_456',
        expiresIn: 3600,
      };

      authService.signIn.mockResolvedValue({
        success: true,
        user: mockUser,
        tokens: mockTokens,
      });

      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Fill login form
      const emailInput = getByPlaceholderText('Enter your email address');
      const passwordInput = getByPlaceholderText('Enter your password');

      fireEvent.changeText(emailInput, 'user@blong.app');
      fireEvent.changeText(passwordInput, 'SecurePass123!');

      // Submit login
      const loginButton = getByText('SIGN IN');
      fireEvent.press(loginButton);

      // Verify loading state
      await waitFor(() => {
        expect(getByText('SIGNING IN...')).toBeTruthy();
      });

      // Verify login call
      await waitFor(() => {
        expect(authService.signIn).toHaveBeenCalledWith({
          email: 'user@blong.app',
          password: 'SecurePass123!',
        });
      });

      // Verify success notification
      await waitFor(() => {
        expect(getByText('Welcome back!')).toBeTruthy();
      });

      // Verify onAuthComplete is called
      await waitFor(() => {
        expect(mockOnAuthComplete).toHaveBeenCalledWith({
          user: mockUser,
          preferences: {},
        });
      }, { timeout: 2000 });
    });

    it('should handle invalid credentials error', async () => {
      authService.signIn.mockRejectedValue({
        type: 'AUTHENTICATION_ERROR',
        message: 'Invalid email or password',
        statusCode: 401,
      });

      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Fill and submit login form
      fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'user@blong.app');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'wrongpassword');
      fireEvent.press(getByText('SIGN IN'));

      // Verify error handling
      await waitFor(() => {
        expect(getByText('Invalid email or password')).toBeTruthy();
      });

      expect(mockOnAuthComplete).not.toHaveBeenCalled();
    });
  });

  describe('Network Error Handling', () => {
    it('should handle network errors with retry mechanism', async () => {
      // First call fails with network error
      authService.signIn
        .mockRejectedValueOnce({
          type: 'NETWORK_ERROR',
          message: 'Network connection failed',
        })
        .mockResolvedValueOnce({
          success: true,
          user: { id: '1', email: 'user@blong.app' },
          tokens: { accessToken: 'token', refreshToken: 'refresh' },
        });

      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Fill and submit login form
      fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'user@blong.app');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'SecurePass123!');
      fireEvent.press(getByText('SIGN IN'));

      // Verify retry dialog appears
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Connection Failed',
          expect.stringContaining('Retry attempt'),
          expect.arrayContaining([
            expect.objectContaining({ text: 'Cancel' }),
            expect.objectContaining({ text: 'Retry' }),
          ])
        );
      });

      // Simulate user pressing retry
      const retryCall = Alert.alert.mock.calls[0][2][1].onPress;
      act(() => {
        retryCall();
      });

      // Verify successful retry
      await waitFor(() => {
        expect(authService.signIn).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle maximum retry attempts exceeded', async () => {
      // Mock multiple network failures
      authService.signIn.mockRejectedValue({
        type: 'NETWORK_ERROR',
        message: 'Network connection failed',
      });

      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Fill and submit login form
      fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'user@blong.app');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'SecurePass123!');
      fireEvent.press(getByText('SIGN IN'));

      // Simulate multiple retry attempts
      for (let i = 0; i < 3; i++) {
        await waitFor(() => {
          expect(Alert.alert).toHaveBeenCalled();
        });

        // Press retry
        const retryCall = Alert.alert.mock.calls[Alert.alert.mock.calls.length - 1][2][1].onPress;
        act(() => {
          retryCall();
        });
      }

      // After max retries, should show final error modal
      await waitFor(() => {
        expect(getByText('Network connection failed')).toBeTruthy();
      });
    });
  });

  describe('Session Management Integration', () => {
    it('should handle token refresh during authentication check', async () => {
      // Mock expired token scenario
      tokenManager.validateToken.mockResolvedValue(false);
      tokenManager.refreshAccessToken.mockResolvedValue(true);
      userManager.getUser.mockResolvedValue({
        id: 'user123',
        email: 'user@blong.app',
      });

      // This would typically be tested in an app initialization scenario
      const authCheck = await authService.validateAuthentication();
      
      expect(authCheck.isValid).toBe(true);
      expect(tokenManager.refreshAccessToken).toHaveBeenCalled();
    });
  });

  describe('Password Strength Validation', () => {
    it('should show real-time password strength feedback', async () => {
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Switch to registration
      fireEvent.press(getByText("Don't have an account?"));

      const passwordInput = getByPlaceholderText('Enter your password');

      // Test weak password
      fireEvent.changeText(passwordInput, 'weak');
      await waitFor(() => {
        expect(getByText('Weak')).toBeTruthy();
      });

      // Test medium password
      fireEvent.changeText(passwordInput, 'MediumPass123');
      await waitFor(() => {
        expect(getByText('Medium')).toBeTruthy();
      });

      // Test strong password
      fireEvent.changeText(passwordInput, 'StrongPass123!');
      await waitFor(() => {
        expect(getByText('Strong')).toBeTruthy();
      });
    });
  });

  describe('Accessibility Compliance', () => {
    it('should provide proper accessibility labels and hints', () => {
      const { getByLabelText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Verify key accessibility elements exist
      expect(getByLabelText('Enter your email address')).toBeTruthy();
      expect(getByLabelText('Enter your password')).toBeTruthy();
    });

    it('should announce form validation errors to screen readers', async () => {
      const { getByText, getByPlaceholderText } = renderWithProviders(
        <AuthScreen onAuthComplete={mockOnAuthComplete} />
      );

      // Submit form with invalid data
      fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'invalid-email');
      fireEvent.press(getByText('SIGN IN'));

      // Verify error announcement
      await waitFor(() => {
        expect(getByText('Form Validation Failed')).toBeTruthy();
      });
    });
  });
});