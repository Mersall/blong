---
type: "always_apply"
description: "BLONG Development Standards and Best Practices"
---

# BLONG Development Standards & Best Practices

## 🔧 CODE ORGANIZATION STANDARDS

### RULE 1: File Structure - MANDATORY
```
feature/
├── index.js                 # Main export file
├── FeatureScreen.js         # Main component
├── components/              # Feature-specific components
│   ├── FeatureCard.js
│   └── FeatureModal.js
├── services/               # API and business logic
│   └── featureService.js
├── styles/                 # Styling files
│   ├── FeatureScreen.styles.js
│   └── components.styles.js
├── hooks/                  # Custom hooks
│   └── useFeature.js
└── utils/                  # Utility functions
    └── featureUtils.js
```

### RULE 2: Import Organization - MANDATORY
```javascript
// ALWAYS organize imports in this exact order
// 1. React and React Native imports
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// 2. Third-party libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

// 3. Internal components (absolute imports)
import { AppTransition } from '../../components/AppTransition';
import { PremiumButton } from '../../components/ui/PremiumButton';

// 4. Services and utilities
import { featureService } from '../../services/featureService';
import { validateInput } from '../../utils/validation';

// 5. Contexts and hooks
import { useTheme, useLanguage } from '../../contexts/AppContext';
import { useLoading } from '../../hooks/useLoading';

// 6. Styles (always last)
import { styles } from './FeatureScreen.styles';
```

### RULE 3: Component Structure - MANDATORY
```javascript
// ALWAYS follow this component structure
const FeatureScreen = ({ navigation, route, ...props }) => {
  // 1. Hooks (in this order)
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { setLoading } = useLoading();

  // 2. State variables
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 3. Derived state and computed values
  const isLoading = !data && !error;
  const hasData = data && data.length > 0;

  // 4. Event handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await featureService.getData();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // 5. Effects
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // 6. Early returns
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={handleRefresh} />;
  }

  // 7. Main render
  return (
    <AppTransition>
      {/* Component JSX */}
    </AppTransition>
  );
};

export default FeatureScreen;
```

### RULE 4: Error Handling Pattern - MANDATORY
```javascript
// ALWAYS use this error handling pattern
const handleAsyncOperation = async (operation, options = {}) => {
  const {
    loadingMessage = 'Processing...',
    successMessage = 'Operation completed successfully',
    showLoading = true,
    showSuccess = true
  } = options;

  try {
    if (showLoading) {
      setLoading(true, loadingMessage);
    }

    const result = await operation();

    if (showSuccess && result.success) {
      showNotification(successMessage, 'success');
    }

    return result;
  } catch (error) {
    console.error('Operation failed:', error);

    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        'An unexpected error occurred';

    showNotification(errorMessage, 'error');
    throw error;
  } finally {
    if (showLoading) {
      setLoading(false);
    }
  }
};
```

## 🎨 STYLING STANDARDS

### RULE 5: Style Organization - MANDATORY
```javascript
// ALWAYS create separate style files
// FeatureScreen.styles.js
import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#0A0A0A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  accent: '#FF6B35',
  border: '#E0E0E0',
  shadow: '#000000',
  success: '#4CAF50',
  warning: '#FF9800',
};

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120, // Always include bottom padding for navigation
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
```

### RULE 6: Typography Standards - MANDATORY
```javascript
// ALWAYS use these typography styles
export const TYPOGRAPHY = {
  // Brand logo
  brand: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 8,
    color: COLORS.text,
  },

  // Headings
  h1: { fontSize: 32, fontWeight: '800', color: COLORS.text },
  h2: { fontSize: 24, fontWeight: '300', color: COLORS.text },
  h3: { fontSize: 20, fontWeight: '300', color: COLORS.text },
  h4: { fontSize: 18, fontWeight: '300', color: COLORS.text },

  // Body text
  body: { fontSize: 16, fontWeight: '300', color: COLORS.textSecondary },
  bodySmall: { fontSize: 14, color: COLORS.textSecondary },
  caption: { fontSize: 12, color: COLORS.textTertiary },

  // Button text
  button: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
};
```

## 🔒 SECURITY STANDARDS

### RULE 7: API Security - MANDATORY
```javascript
// ALWAYS implement proper API security
class SecureApiService {
  constructor() {
    this.baseURL = process.env.API_BASE_URL;
    this.timeout = 10000; // 10 second timeout
  }

  async makeRequest(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      headers = {},
      requiresAuth = true,
    } = options;

    try {
      // Always include authentication if required
      if (requiresAuth) {
        const token = await this.getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
        headers.Authorization = `Bearer ${token}`;
      }

      // Sanitize and validate data
      const sanitizedData = data ? this.sanitizeData(data) : null;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: sanitizedData ? JSON.stringify(sanitizedData) : null,
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw this.handleApiError(error);
    }
  }

  sanitizeData(data) {
    // Remove any potentially dangerous fields
    const sanitized = { ...data };
    delete sanitized.__proto__;
    delete sanitized.constructor;
    return sanitized;
  }

  async getAuthToken() {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }
}
```