# BLONG API Integration Guide

## Overview

This guide provides comprehensive information for integrating with the BLONG API, including authentication flows, error handling, and best practices.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.blong.app/api`

## Authentication

### JWT Token-Based Authentication

BLONG API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid Bearer token in the Authorization header.

#### Authentication Flow

1. **Register/Login** to obtain tokens
2. **Include Bearer token** in subsequent requests
3. **Refresh tokens** when expired
4. **Handle token expiration** gracefully

#### Token Structure

```javascript
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

#### Header Format

```
Authorization: Bearer <access-token>
```

### Registration Flow

```javascript
// 1. Register new user
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE"
}

// Response
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "...",
  "message": "Registration successful..."
}
```

### Login Flow

```javascript
// 2. Login existing user
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

// Response
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Token Refresh Flow

```javascript
// 3. Refresh expired token
POST /api/auth/refresh
{
  "refreshToken": "existing-refresh-token"
}

// Response
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

## Profile Management

### Profile Completion Flow

The BLONG app requires users to complete their profiles in stages. The typical flow is:

1. **Basic Registration** (handled in auth)
2. **Profile Information** (demographics, lifestyle)
3. **Preferences** (matching criteria)
4. **Photos** (profile images)
5. **Personality Assessment** (coming soon)

#### Profile Update

```javascript
PUT /api/profile
{
  "bio": "Passionate about life and looking for meaningful connections",
  "height": 175,
  "education": "Bachelor's Degree",
  "occupation": "Software Engineer",
  "city": "New York",
  "country": "United States",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "interests": ["technology", "travel", "cooking"],
  "smoking": "NEVER",
  "drinking": "OCCASIONALLY",
  "exercise": "REGULARLY",
  "diet": "NONE",
  "maritalStatus": "NEVER_MARRIED",
  "hasChildren": false,
  "wantsChildren": true,
  "familyValues": "MIXED",
  "religion": "Christianity",
  "religiosity": "SOMEWHAT_RELIGIOUS",
  "prayerFrequency": "WEEKLY",
  "ethnicity": "Mixed",
  "languages": ["English", "Spanish"],
  "salaryMin": 50000,
  "salaryMax": 100000,
  "weight": 70
}
```

#### Profile Completion Status

```javascript
GET /api/profile/completion-status

// Response
{
  "completionPercentage": 75.5,
  "completedSections": ["basicInfo", "preferences", "photos"],
  "missingSections": ["personality", "lifestyle"],
  "isComplete": false,
  "nextStep": "Complete personality assessment"
}
```

### Photo Management

#### Upload Photos

```javascript
POST /api/profile/photos
{
  "url": "https://example.com/photo.jpg",
  "isPrimary": false
}
```

#### Set Primary Photo

```javascript
PUT /api/profile/photos/{photoId}/primary
```

#### Delete Photo

```javascript
DELETE /api/profile/photos/{photoId}
```

## Error Handling

### Standard Error Response Format

All API errors follow a consistent format:

```javascript
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2025-08-01T23:44:07.000Z",
  "path": "/api/profile"
}
```

### Validation Errors

Validation errors return an array of specific error messages:

```javascript
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters",
    "gender must be one of the following values: MALE, FEMALE, NON_BINARY, OTHER"
  ],
  "error": "Bad Request"
}
```

## Frontend Integration Patterns

### React/React Native Integration

#### API Service Setup

```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth header if token exists
    if (this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 401 && this.refreshToken) {
        const newTokens = await this.refreshTokens();
        if (newTokens) {
          // Retry original request with new token
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          return fetch(url, config);
        }
      }

      return response;
    } catch (error) {
      throw new Error(`Network Error: ${error.message}`);
    }
  }

  async refreshTokens() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const tokens = await response.json();
        this.setTokens(tokens.accessToken, tokens.refreshToken);
        return tokens;
      }
    } catch (error) {
      // Handle refresh failure - redirect to login
      this.logout();
    }
    return null;
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    // Redirect to login screen
  }
}

export default new ApiService();
```

#### Profile Update Implementation

```javascript
// services/profileService.js
import ApiService from './api';

export const updateProfile = async (profileData) => {
  try {
    const response = await ApiService.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

export const getProfileCompletionStatus = async () => {
  try {
    const response = await ApiService.request('/profile/completion-status');
    
    if (!response.ok) {
      throw new Error('Failed to get completion status');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get profile completion:', error);
    throw error;
  }
};
```

#### React Component Example

```javascript
// components/ProfileForm.js
import React, { useState, useEffect } from 'react';
import { updateProfile, getProfileCompletionStatus } from '../services/profileService';

const ProfileForm = () => {
  const [profileData, setProfileData] = useState({});
  const [completionStatus, setCompletionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompletionStatus();
  }, []);

  const loadCompletionStatus = async () => {
    try {
      const status = await getProfileCompletionStatus();
      setCompletionStatus(status);
    } catch (err) {
      setError('Failed to load profile status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProfile(profileData);
      await loadCompletionStatus(); // Refresh completion status
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {completionStatus && (
        <div>
          Profile {completionStatus.completionPercentage}% complete
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default ProfileForm;
```

## Data Validation

### Field Requirements and Constraints

#### User Registration
- **email**: Valid email format, unique
- **password**: Minimum 8 characters
- **firstName**: Required, non-empty string
- **lastName**: Required, non-empty string
- **dateOfBirth**: Valid date string (ISO format)
- **gender**: One of: MALE, FEMALE, NON_BINARY, OTHER

#### Profile Fields
- **height**: Integer (centimeters)
- **city**: Required string
- **country**: Required string
- **interests**: Array of strings
- **smoking/drinking/exercise**: NEVER, OCCASIONALLY, REGULARLY
- **diet**: VEGETARIAN, VEGAN, HALAL, KOSHER, NONE
- **maritalStatus**: NEVER_MARRIED, DIVORCED, WIDOWED
- **familyValues**: TRADITIONAL, MODERN, MIXED
- **religiosity**: VERY_RELIGIOUS, SOMEWHAT_RELIGIOUS, NOT_RELIGIOUS

### Frontend Validation

```javascript
// utils/validation.js
export const validateProfile = (data) => {
  const errors = [];

  if (data.height && (data.height < 100 || data.height > 250)) {
    errors.push('Height must be between 100-250 cm');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  const validLifestyleChoices = ['NEVER', 'OCCASIONALLY', 'REGULARLY'];
  if (data.smoking && !validLifestyleChoices.includes(data.smoking)) {
    errors.push('Invalid smoking preference');
  }

  return errors;
};
```

## Rate Limiting and Performance

### Rate Limits
- **Authentication endpoints**: 5 requests/minute per IP
- **Profile endpoints**: 30 requests/minute per user
- **Health endpoints**: 100 requests/minute per IP

### Best Practices
1. **Cache user data** locally when possible
2. **Implement exponential backoff** for failed requests
3. **Use batch operations** when available
4. **Monitor response times** and implement timeouts

### Performance Optimization

```javascript
// Implement request caching
const cache = new Map();

const cachedRequest = async (url, options, cacheTime = 60000) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data;
  }

  const response = await ApiService.request(url, options);
  const data = await response.json();
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });

  return data;
};
```

## Testing API Integration

### Unit Testing API Calls

```javascript
// __tests__/profileService.test.js
import { updateProfile } from '../services/profileService';

// Mock fetch
global.fetch = jest.fn();

describe('Profile Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should update profile successfully', async () => {
    const mockResponse = { id: '1', bio: 'Updated bio' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await updateProfile({ bio: 'Updated bio' });
    
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/profile',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ bio: 'Updated bio' }),
      })
    );
    
    expect(result).toEqual(mockResponse);
  });

  test('should handle API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Validation failed' }),
    });

    await expect(updateProfile({})).rejects.toThrow('Validation failed');
  });
});
```

### Integration Testing

Use the provided Postman collection for comprehensive API testing:
1. Import `BLONG-API-Postman-Collection.json`
2. Set environment variables (baseUrl, etc.)
3. Run the entire collection for full integration testing

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check token validity
   - Ensure Bearer prefix in Authorization header
   - Implement token refresh logic

2. **400 Bad Request**
   - Validate request payload against API schema
   - Check Content-Type header
   - Ensure required fields are included

3. **404 Not Found**
   - Verify endpoint URL
   - Check if resource exists
   - Ensure user has access to resource

4. **500 Internal Server Error**
   - Check server logs
   - Verify database connectivity
   - Implement retry logic with exponential backoff

### Debug Tools

1. **Network Inspector**: Monitor API calls in browser dev tools
2. **Postman**: Test endpoints manually
3. **API Logs**: Check server logs for detailed error information
4. **Health Endpoints**: Use `/health` endpoints to verify API status

### Error Recovery Patterns

```javascript
// Implement retry with exponential backoff
const retryRequest = async (fn, maxRetries = 3) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage
const updateProfileWithRetry = (data) => 
  retryRequest(() => updateProfile(data));
```

## API Versioning

Currently using v1.0.0. Future versions will maintain backward compatibility when possible. Breaking changes will be introduced in new major versions with migration guides.

## Support

For API integration support:
- Email: api-support@blong.app
- Documentation: This guide and OpenAPI specification
- Status Page: https://status.blong.app

## Changelog

### Version 1.0.0
- Initial API release
- Authentication with JWT
- Profile management endpoints
- Photo upload/management
- Health check endpoints