import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthScreen from '../../../screens/auth/AuthScreen';
import { authService } from '../../../services/authService';

// Mock the auth service
jest.mock('../../../services/authService', () => ({
  authService: {
    signIn: jest.fn(),
    register: jest.fn(),
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe('AuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Form', () => {
    it('should render login form by default', () => {
      const { getByText, getByPlaceholderText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      expect(getByText('Sign In')).toBeTruthy();
      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
    });

    it('should handle login form submission', async () => {
      const mockLoginResponse = {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token123',
      };
      authService.signIn.mockResolvedValue(mockLoginResponse);

      const { getByPlaceholderText, getByText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Sign In');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(authService.signIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show error message on login failure', async () => {
      authService.signIn.mockRejectedValue(new Error('Invalid credentials'));

      const { getByPlaceholderText, getByText, findByText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Sign In');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      await waitFor(async () => {
        const errorMessage = await findByText(/invalid credentials/i);
        expect(errorMessage).toBeTruthy();
      });
    });

    it('should validate email format', async () => {
      const { getByPlaceholderText, getByText, findByText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Sign In');

      fireEvent.changeText(emailInput, 'invalidemail');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(async () => {
        const errorMessage = await findByText(/please enter a valid email/i);
        expect(errorMessage).toBeTruthy();
      });
    });
  });

  describe('Registration Form', () => {
    it('should switch to registration form', () => {
      const { getByText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      const switchToRegister = getByText(/don't have an account/i);
      fireEvent.press(switchToRegister);

      expect(getByText('Create Account')).toBeTruthy();
      expect(getByText('First Name')).toBeTruthy();
      expect(getByText('Last Name')).toBeTruthy();
    });

    it('should handle registration form submission', async () => {
      const mockRegisterResponse = {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token123',
      };
      authService.register.mockResolvedValue(mockRegisterResponse);

      const { getByText, getByPlaceholderText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      // Switch to registration form
      const switchToRegister = getByText(/don't have an account/i);
      fireEvent.press(switchToRegister);

      const firstNameInput = getByPlaceholderText('First Name');
      const lastNameInput = getByPlaceholderText('Last Name');
      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const registerButton = getByText('Create Account');

      fireEvent.changeText(firstNameInput, 'John');
      fireEvent.changeText(lastNameInput, 'Doe');
      fireEvent.changeText(emailInput, 'john@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(registerButton);

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
        });
      });
    });

    it('should validate required fields for registration', async () => {
      const { getByText, findByText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      // Switch to registration form
      const switchToRegister = getByText(/don't have an account/i);
      fireEvent.press(switchToRegister);

      const registerButton = getByText('Create Account');
      fireEvent.press(registerButton);

      await waitFor(async () => {
        const errorMessage = await findByText(/please fill in all required fields/i);
        expect(errorMessage).toBeTruthy();
      });
    });
  });

  describe('Password Strength Validation', () => {
    it('should show password strength indicator', () => {
      const { getByText, getByPlaceholderText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      // Switch to registration form
      const switchToRegister = getByText(/don't have an account/i);
      fireEvent.press(switchToRegister);

      const passwordInput = getByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, 'weak');

      expect(getByText(/weak/i)).toBeTruthy();
    });

    it('should accept strong passwords', () => {
      const { getByText, getByPlaceholderText } = renderWithQueryClient(
        <AuthScreen navigation={mockNavigation} />
      );

      // Switch to registration form
      const switchToRegister = getByText(/don't have an account/i);
      fireEvent.press(switchToRegister);

      const passwordInput = getByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, 'StrongP@ssw0rd123');

      expect(getByText(/strong/i)).toBeTruthy();
    });
  });
});