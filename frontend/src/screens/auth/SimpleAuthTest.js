/**
 * Simple Auth Test Screen
 * Testing basic authentication UI without complex styling
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useApp, useTheme } from '../../contexts/AppContext';

const SimpleAuthTest = ({ userPreferences, onAuthComplete }) => {
  const { t } = useApp();
  const { colors } = useTheme();
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    
    // Simple mock authentication
    setTimeout(() => {
      console.log('Auth attempt:', { authMode, email, password });
      
      if (onAuthComplete) {
        onAuthComplete({
          user: {
            id: '1',
            email: email,
            firstName: 'Test',
            lastName: 'User',
          },
          preferences: userPreferences,
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'register' : 'signin');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 32,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '300',
      letterSpacing: 8,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 48,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    welcomeTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    button: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    toggleContainer: {
      alignItems: 'center',
      marginTop: 16,
    },
    toggleText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    toggleButton: {
      padding: 8,
    },
    toggleButtonText: {
      fontSize: 14,
      color: colors.accent,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={colors.background}
      />
      
      <View style={styles.content}>
        {/* Logo */}
        <Text style={styles.title}>BLONG</Text>
        <Text style={styles.subtitle}>Elite Matrimonial</Text>

        {/* Welcome Message */}
        <Text style={styles.welcomeTitle}>
          {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </Text>
        <Text style={styles.welcomeSubtitle}>
          {authMode === 'signin' 
            ? 'Sign in to continue your journey' 
            : 'Join our elite community'
          }
        </Text>

        {/* Form */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleAuth}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading 
              ? 'Loading...' 
              : (authMode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </Text>
        </TouchableOpacity>

        {/* Toggle Auth Mode */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {authMode === 'signin' 
              ? "Don't have an account?" 
              : 'Already have an account?'
            }
          </Text>
          
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleAuthMode}
          >
            <Text style={styles.toggleButtonText}>
              {authMode === 'signin' ? 'Create Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SimpleAuthTest;
