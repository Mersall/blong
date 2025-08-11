# BLONG API Error Code Reference

## Overview

This document provides a comprehensive reference for all error codes, status codes, and error handling patterns in the BLONG API.

## HTTP Status Codes

### Success Codes (2xx)

| Code | Status | Description | Usage |
|------|--------|-------------|-------|
| 200 | OK | Request successful | GET, PUT requests |
| 201 | Created | Resource created successfully | POST requests (registration, photo upload) |
| 204 | No Content | Request successful, no content to return | DELETE requests |

### Client Error Codes (4xx)

| Code | Status | Description | Common Causes |
|------|--------|-------------|---------------|
| 400 | Bad Request | Invalid request data | Validation errors, malformed JSON |
| 401 | Unauthorized | Authentication required or failed | Missing/invalid token, expired token |
| 403 | Forbidden | Access denied | Insufficient permissions |
| 404 | Not Found | Resource not found | Invalid endpoint, non-existent resource |
| 409 | Conflict | Resource conflict | Duplicate email registration |
| 422 | Unprocessable Entity | Validation failed | Business logic validation errors |
| 429 | Too Many Requests | Rate limit exceeded | API rate limiting |

### Server Error Codes (5xx)

| Code | Status | Description | Common Causes |
|------|--------|-------------|---------------|
| 500 | Internal Server Error | Server-side error | Unhandled exceptions, database errors |
| 502 | Bad Gateway | Gateway error | Upstream service unavailable |
| 503 | Service Unavailable | Service temporarily unavailable | Maintenance, overload |
| 504 | Gateway Timeout | Gateway timeout | Slow upstream services |

## Error Response Format

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2025-08-01T23:44:07.000Z",
  "path": "/api/profile"
}
```

### Validation Error Response

```json
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

## Authentication Errors

### 401 Unauthorized

#### Missing Authorization Header
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Cause**: No Authorization header provided
**Solution**: Include `Authorization: Bearer <token>` header

#### Invalid Token Format
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Cause**: Token format is invalid (not JWT)
**Solution**: Ensure token is a valid JWT

#### Expired Token
```json
{
  "statusCode": 401,
  "message": "Token expired",
  "error": "Unauthorized"
}
```

**Cause**: Access token has expired
**Solution**: Use refresh token to get new access token

#### Invalid Credentials (Login)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Cause**: Wrong email or password
**Solution**: Verify credentials and retry

#### Invalid Refresh Token
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

**Cause**: Refresh token is expired or invalid
**Solution**: User must login again

## Validation Errors

### 400 Bad Request - Field Validation

#### Registration Validation Errors

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters",
    "firstName should not be empty",
    "lastName should not be empty",
    "dateOfBirth must be a valid ISO 8601 date string",
    "gender must be one of the following values: MALE, FEMALE, NON_BINARY, OTHER"
  ],
  "error": "Bad Request"
}
```

**Common Validation Rules**:
- Email: Must be valid email format
- Password: Minimum 8 characters
- Names: Non-empty strings
- Date of Birth: Valid ISO 8601 date
- Gender: Must be from allowed enum values

#### Profile Validation Errors

```json
{
  "statusCode": 400,
  "message": [
    "height must be a number conforming to the specified constraints",
    "smoking must be one of the following values: NEVER, OCCASIONALLY, REGULARLY",
    "city should not be empty",
    "country should not be empty"
  ],
  "error": "Bad Request"
}
```

**Profile Field Constraints**:
- Height: Must be integer between 100-250 cm
- Lifestyle choices: NEVER, OCCASIONALLY, REGULARLY
- Location: City and country required
- Interests: Array of strings

#### Photo Upload Validation

```json
{
  "statusCode": 400,
  "message": [
    "url must be a URL address",
    "isPrimary must be a boolean value"
  ],
  "error": "Bad Request"
}
```

**Photo Constraints**:
- URL: Must be valid URL format
- isPrimary: Boolean value

### 400 Bad Request - Malformed JSON

```json
{
  "statusCode": 400,
  "message": "Unexpected token } in JSON at position 15",
  "error": "Bad Request"
}
```

**Cause**: Invalid JSON syntax in request body
**Solution**: Validate JSON syntax before sending

## Resource Errors

### 404 Not Found

#### Profile Not Found
```json
{
  "statusCode": 404,
  "message": "Profile not found",
  "error": "Not Found"
}
```

**Cause**: User has not created a profile yet
**Solution**: Create profile using PUT /api/profile

#### Photo Not Found
```json
{
  "statusCode": 404,
  "message": "Photo not found",
  "error": "Not Found"
}
```

**Cause**: Photo ID doesn't exist or doesn't belong to user
**Solution**: Verify photo ID and user ownership

#### Preferences Not Found
```json
{
  "statusCode": 404,
  "message": "Preferences not found",
  "error": "Not Found"
}
```

**Cause**: User has not set preferences yet
**Solution**: Create preferences using PUT /api/profile/preferences

### 409 Conflict

#### Duplicate Email Registration
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

**Cause**: Email already registered
**Solution**: Use different email or login with existing account

## Rate Limiting Errors

### 429 Too Many Requests

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Too Many Requests",
  "retryAfter": 60
}
```

**Rate Limits**:
- Authentication: 5 requests/minute per IP
- Profile operations: 30 requests/minute per user
- Health checks: 100 requests/minute per IP

**Solution**: Wait for the specified time before retrying

## Server Errors

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

**Common Causes**:
- Database connection issues
- Unhandled exceptions
- Configuration errors

**Client Action**: Retry with exponential backoff

### 503 Service Unavailable

```json
{
  "statusCode": 503,
  "message": "Service temporarily unavailable",
  "error": "Service Unavailable"
}
```

**Causes**:
- Server maintenance
- System overload
- Database unavailable

**Client Action**: Check status page, retry after delay

## Business Logic Errors

### Profile Completion Errors

While not returned as HTTP errors, the profile completion status endpoint provides information about missing required fields:

```json
{
  "completionPercentage": 45.0,
  "completedSections": ["basicInfo"],
  "missingSections": ["preferences", "photos", "personality"],
  "isComplete": false,
  "nextStep": "Add profile preferences",
  "errors": [
    "Profile must have at least 2 photos",
    "Location information is required",
    "At least 3 interests must be selected"
  ]
}
```

## Error Handling Best Practices

### Frontend Error Handling

```javascript
const handleApiError = (error, response) => {
  switch (response.status) {
    case 400:
      // Validation errors
      if (Array.isArray(error.message)) {
        return {
          type: 'VALIDATION_ERROR',
          errors: error.message,
          title: 'Please fix the following errors:'
        };
      }
      return {
        type: 'BAD_REQUEST',
        message: error.message,
        title: 'Invalid Request'
      };

    case 401:
      // Authentication errors
      if (error.message.includes('expired')) {
        return {
          type: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please login again.',
          action: 'REFRESH_TOKEN'
        };
      }
      return {
        type: 'UNAUTHORIZED',
        message: 'Authentication required',
        action: 'LOGIN_REQUIRED'
      };

    case 404:
      return {
        type: 'NOT_FOUND',
        message: 'The requested resource was not found',
        title: 'Resource Not Found'
      };

    case 409:
      return {
        type: 'CONFLICT',
        message: error.message,
        title: 'Conflict Error'
      };

    case 429:
      return {
        type: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.',
        retryAfter: error.retryAfter || 60
      };

    case 500:
      return {
        type: 'SERVER_ERROR',
        message: 'Something went wrong on our end. Please try again.',
        title: 'Server Error'
      };

    default:
      return {
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        title: 'Error'
      };
  }
};
```

### Retry Logic Implementation

```javascript
const retryableStatuses = [408, 429, 500, 502, 503, 504];

const makeRequestWithRetry = async (requestFn, maxRetries = 3) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await requestFn();
      
      if (response.ok) {
        return response;
      }
      
      if (!retryableStatuses.includes(response.status)) {
        // Don't retry client errors (4xx except 408, 429)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      attempt++;
      
      if (attempt >= maxRetries) {
        throw new Error(`Request failed after ${maxRetries} attempts`);
      }
      
      // Exponential backoff with jitter
      const baseDelay = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * 1000;
      const delay = baseDelay + jitter;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
    } catch (error) {
      if (attempt >= maxRetries - 1) {
        throw error;
      }
      attempt++;
    }
  }
};
```

### Error Logging and Monitoring

```javascript
const logError = (error, context) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context: {
      url: context.url,
      method: context.method,
      userId: context.userId,
      userAgent: context.userAgent
    },
    response: {
      status: context.response?.status,
      statusText: context.response?.statusText
    }
  };

  // Send to logging service
  console.error('API Error:', errorData);
  
  // Send to error tracking service (e.g., Sentry)
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      extra: errorData
    });
  }
};
```

## Error Testing

### Test Cases for Error Scenarios

```javascript
describe('API Error Handling', () => {
  test('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: '123'
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining('email must be an email'),
        expect.stringContaining('password must be longer')
      ])
    );
  });

  test('should handle unauthorized requests', async () => {
    await request(app)
      .get('/api/profile')
      .expect(401);
  });

  test('should handle resource not found', async () => {
    await request(app)
      .get('/api/profile/photos/non-existent-id')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(404);
  });
});
```

## Common Error Scenarios and Solutions

### Scenario 1: Profile Update Failing

**Error**: 400 Bad Request with validation errors
**Common Causes**:
- Invalid enum values (smoking: "SOMETIMES" instead of "OCCASIONALLY")
- Missing required fields (city, country)
- Invalid data types (height as string instead of number)

**Solution**:
```javascript
const validateProfileData = (data) => {
  const validLifestyleChoices = ['NEVER', 'OCCASIONALLY', 'REGULARLY'];
  const validGenders = ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'];
  
  if (data.smoking && !validLifestyleChoices.includes(data.smoking)) {
    throw new Error('Invalid smoking preference');
  }
  
  if (data.height && typeof data.height !== 'number') {
    throw new Error('Height must be a number');
  }
  
  if (!data.city || !data.country) {
    throw new Error('City and country are required');
  }
};
```

### Scenario 2: Token Expiration During Form Submission

**Error**: 401 Unauthorized during long form filling
**Solution**: Implement background token refresh

```javascript
const refreshTokenPeriodically = () => {
  setInterval(async () => {
    if (shouldRefreshToken()) {
      await refreshAccessToken();
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};

const shouldRefreshToken = () => {
  if (!accessToken) return false;
  
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  // Refresh if token expires within 2 minutes
  return (expirationTime - currentTime) < 2 * 60 * 1000;
};
```

### Scenario 3: Network Connectivity Issues

**Error**: Network request failed
**Solution**: Implement offline handling

```javascript
const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    return {
      type: 'OFFLINE',
      message: 'You appear to be offline. Please check your connection.',
      canRetry: true
    };
  }
  
  return {
    type: 'NETWORK_ERROR',
    message: 'Network error occurred. Please try again.',
    canRetry: true
  };
};
```

## Error Codes Summary

| Code | Category | Description | Action Required |
|------|----------|-------------|-----------------|
| 400 | Validation | Invalid request data | Fix request format/data |
| 401 | Auth | Authentication failed | Login or refresh token |
| 403 | Auth | Access denied | Check permissions |
| 404 | Resource | Resource not found | Verify resource exists |
| 409 | Business | Resource conflict | Use different data |
| 422 | Validation | Business rule violation | Fix business logic |
| 429 | Rate Limit | Too many requests | Wait and retry |
| 500 | Server | Internal server error | Retry with backoff |
| 503 | Server | Service unavailable | Check status, retry later |

This error reference should be used alongside the main API documentation to ensure proper error handling in your application.