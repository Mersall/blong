/**
 * BLONG Error Boundary Component
 * Comprehensive error boundary for crash prevention and graceful error handling
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { PremiumSpinner } from './loading';

const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  error: '#DC2626',
  errorBackground: '#FEF2F2',
  errorBorder: '#FECACA',
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log to crash reporting service (if available)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // This would integrate with crash reporting services like Crashlytics, Sentry, etc.
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator?.userAgent,
        url: window?.location?.href,
      };

      console.log('Error Report:', errorReport);
      
      // Example integration:
      // crashlytics().recordError(error);
      // Sentry.captureException(error, { contexts: { react: errorInfo } });
    } catch (loggingError) {
      console.error('Failed to log error to service:', loggingError);
    }
  };

  handleRetry = () => {
    this.setState({ 
      isRetrying: true,
      retryCount: this.state.retryCount + 1,
    });

    // Simulate loading delay for better UX
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
      });
    }, 1500);
  };

  handleReload = () => {
    // For web platforms
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    } else {
      // For React Native, restart the app
      this.handleRetry();
    }
  };

  getErrorType = () => {
    const error = this.state.error;
    if (!error) return 'unknown';

    if (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')) {
      return 'chunk';
    }
    if (error.name === 'NetworkError' || error.message?.includes('Network')) {
      return 'network';
    }
    if (error.name === 'TypeError' && error.message?.includes('undefined')) {
      return 'runtime';
    }
    return 'unknown';
  };

  getErrorMessage = () => {
    const errorType = this.getErrorType();
    const retryCount = this.state.retryCount;

    switch (errorType) {
      case 'chunk':
        return {
          title: 'App Update Required',
          message: 'A new version of the app is available. Please refresh to continue.',
          suggestion: 'This usually happens after an app update. Refreshing will load the latest version.',
          showReload: true,
        };
      case 'network':
        return {
          title: 'Connection Problem',
          message: 'Unable to connect to our servers. Please check your internet connection.',
          suggestion: 'Make sure you have a stable internet connection and try again.',
          showRetry: true,
        };
      case 'runtime':
        return {
          title: 'Something Went Wrong',
          message: retryCount > 0 
            ? `App error occurred (retry ${retryCount}). Please try refreshing the app.`
            : 'The app encountered an unexpected error.',
          suggestion: 'This is usually temporary. Try refreshing or contact support if it persists.',
          showRetry: retryCount < 3,
          showReload: retryCount >= 2,
        };
      default:
        return {
          title: 'Unexpected Error',
          message: 'The app encountered an unexpected problem.',
          suggestion: 'Please try again or contact support if the problem persists.',
          showRetry: retryCount < 2,
          showReload: true,
        };
    }
  };

  render() {
    if (this.state.isRetrying) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '300',
              letterSpacing: 6,
              color: COLORS.text,
              marginBottom: 12,
            }}>
              BLONG
            </Text>

            <View style={{
              width: 32,
              height: 2,
              backgroundColor: COLORS.accent,
              marginBottom: 32,
            }} />

            <PremiumSpinner size="large" showBrand={false} />

            <Text style={{
              fontSize: 16,
              fontWeight: '300',
              color: COLORS.text,
              marginTop: 24,
              textAlign: 'center',
            }}>
              Restarting app...
            </Text>

            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginTop: 8,
              textAlign: 'center',
            }}>
              Please wait while we recover from the error
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    if (this.state.hasError) {
      const errorDetails = this.getErrorMessage();
      const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              flexGrow: 1,
              justifyContent: 'center',
              padding: 32,
            }}
          >
            {/* BLONG Header */}
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '300',
                letterSpacing: 6,
                color: COLORS.text,
                marginBottom: 12,
              }}>
                BLONG
              </Text>

              <View style={{
                width: 32,
                height: 2,
                backgroundColor: COLORS.accent,
              }} />
            </View>

            {/* Error Icon */}
            <View style={{
              alignItems: 'center',
              marginBottom: 32,
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: COLORS.errorBackground,
                borderWidth: 2,
                borderColor: COLORS.errorBorder,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
              }}>
                <Text style={{ fontSize: 32 }}>⚠️</Text>
              </View>

              <Text style={{
                fontSize: 20,
                fontWeight: '500',
                color: COLORS.text,
                textAlign: 'center',
                marginBottom: 12,
              }}>
                {errorDetails.title}
              </Text>

              <Text style={{
                fontSize: 16,
                color: COLORS.textSecondary,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 16,
              }}>
                {errorDetails.message}
              </Text>

              <Text style={{
                fontSize: 14,
                color: COLORS.textTertiary,
                textAlign: 'center',
                lineHeight: 20,
                fontStyle: 'italic',
              }}>
                {errorDetails.suggestion}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{ marginBottom: 32 }}>
              {errorDetails.showRetry && (
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.accent,
                    borderRadius: 28,
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    marginBottom: 12,
                    shadowColor: COLORS.accent,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  onPress={this.handleRetry}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: COLORS.background,
                    textAlign: 'center',
                    letterSpacing: 1,
                  }}>
                    TRY AGAIN
                  </Text>
                </TouchableOpacity>
              )}

              {errorDetails.showReload && (
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 28,
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    marginBottom: 12,
                  }}
                  onPress={this.handleReload}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '300',
                    color: COLORS.text,
                    textAlign: 'center',
                    letterSpacing: 0.5,
                  }}>
                    REFRESH APP
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Developer Information */}
            {isDevelopment && this.state.error && (
              <View style={{
                backgroundColor: COLORS.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.text,
                  marginBottom: 12,
                }}>
                  Developer Information:
                </Text>

                <ScrollView style={{ maxHeight: 200 }}>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: COLORS.error,
                    lineHeight: 16,
                  }}>
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* Support Information */}
            <View style={{
              alignItems: 'center',
              marginTop: 24,
            }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.textTertiary,
                textAlign: 'center',
                lineHeight: 18,
              }}>
                If this problem persists, please contact{'\n'}
                support@blong.app for assistance
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;