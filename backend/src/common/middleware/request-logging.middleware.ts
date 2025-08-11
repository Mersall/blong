import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../services/logger.service';
import * as crypto from 'crypto';

interface LoggingRequest extends Request {
  requestId?: string;
  startTime?: number;
}

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: LoggingRequest, res: Response, next: NextFunction) {
    // Generate unique request ID
    req.requestId = crypto.randomBytes(16).toString('hex');
    req.startTime = Date.now();

    // Extract request information
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const contentLength = req.get('Content-Length') || '0';
    const userId = (req as any).user?.id || 'anonymous';
    const referer = req.get('Referer') || 'direct';

    // Skip logging for health checks and static assets
    if (this.shouldSkipLogging(url)) {
      return next();
    }

    // Log incoming request
    this.logger.info(`Incoming request: ${method} ${url}`, {
      requestId: req.requestId,
      method,
      url,
      ip,
      userAgent,
      userId,
      referer,
      contentLength: parseInt(contentLength, 10),
      headers: this.sanitizeHeaders(req.headers),
      query: req.query,
      timestamp: new Date().toISOString(),
    });

    // Log request body for certain methods (with sanitization)
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
      this.logger.debug(`Request body for ${method} ${url} - RequestID: ${req.requestId}`);
    }

    // Capture response
    const originalSend = res.send;
    const originalJson = res.json;
    let responseBody: any;

    // Override res.send to capture response
    res.send = function(data: any) {
      responseBody = data;
      return originalSend.call(this, data);
    };

    // Override res.json to capture JSON response
    res.json = function(data: any) {
      responseBody = data;
      return originalJson.call(this, data);
    };

    // Log response when request finishes
    res.on('finish', () => {
      const duration = Date.now() - (req.startTime || 0);
      const statusCode = res.statusCode;
      const responseSize = res.get('Content-Length') || '0';

      // Determine log level based on status code
      const logLevel = this.getLogLevel(statusCode);

      this.logger[logLevel](`${method} ${url} ${statusCode} - ${duration}ms - RequestID: ${req.requestId}`);

      // Log response body for errors or if debug level
      if (statusCode >= 400 || this.logger.getWinstonLogger().level === 'debug') {
        this.logger.debug(`Response body for ${method} ${url} - RequestID: ${req.requestId}`);
      }

      // Log slow requests
      if (duration > 1000) {
        this.logger.performance(`Slow request detected: ${method} ${url}`, duration, {
          requestId: req.requestId,
          method,
          url,
          statusCode,
          ip,
          userId,
        });
      }

      // Log errors
      if (statusCode >= 500) {
        this.logger.error(`Server error: ${method} ${url} ${statusCode} - RequestID: ${req.requestId}`);
      }

      // Log security events
      if (statusCode === 401 || statusCode === 403) {
        this.logger.security(`Access denied: ${method} ${url} ${statusCode}`, {
          requestId: req.requestId,
          method,
          url,
          statusCode,
          ip,
          userAgent,
          userId,
        });
      }
    });

    // Handle request errors
    res.on('error', (error) => {
      const duration = Date.now() - (req.startTime || 0);
      
      this.logger.error(`Request error: ${method} ${url} - RequestID: ${req.requestId} - ${error.message}`, error.stack);
    });

    next();
  }

  private shouldSkipLogging(url: string): boolean {
    const skipPaths = [
      '/health',
      '/api/health',
      '/favicon.ico',
      '/robots.txt',
      '/.well-known',
    ];

    return skipPaths.some(path => url.startsWith(path));
  }

  private getLogLevel(statusCode: number): 'info' | 'warn' | 'error' {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    return 'info';
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'set-cookie',
      'x-api-key',
      'x-auth-token',
    ];

    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeRequestBody(body: any, url: string): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };

    // Always redact password fields
    if (sanitized.password) {
      sanitized.password = '[REDACTED]';
    }

    if (sanitized.currentPassword) {
      sanitized.currentPassword = '[REDACTED]';
    }

    if (sanitized.newPassword) {
      sanitized.newPassword = '[REDACTED]';
    }

    if (sanitized.confirmPassword) {
      sanitized.confirmPassword = '[REDACTED]';
    }

    // Redact other sensitive fields
    const sensitiveFields = [
      'token',
      'refreshToken',
      'accessToken',
      'secret',
      'apiKey',
      'privateKey',
      'creditCard',
      'ssn',
      'socialSecurityNumber',
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    // For profile updates, be more selective about what we log
    if (url.includes('/profile') || url.includes('/user')) {
      const allowedFields = [
        'firstName',
        'lastName',
        'dateOfBirth',
        'gender',
        'bio',
        'location',
        'interests',
        'preferences',
      ];

      const filteredBody: any = {};
      allowedFields.forEach(field => {
        if (sanitized[field] !== undefined) {
          filteredBody[field] = sanitized[field];
        }
      });

      return filteredBody;
    }

    return sanitized;
  }

  private sanitizeResponseBody(body: any, statusCode: number): any {
    if (!body) return body;

    // For successful responses, limit what we log
    if (statusCode < 400) {
      if (typeof body === 'string') {
        try {
          const parsed = JSON.parse(body);
          return this.sanitizeSuccessResponse(parsed);
        } catch {
          return '[NON-JSON RESPONSE]';
        }
      }
      
      if (typeof body === 'object') {
        return this.sanitizeSuccessResponse(body);
      }
    }

    // For error responses, log more details but still sanitize
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        return this.sanitizeErrorResponse(parsed);
      } catch {
        return body.length > 500 ? body.substring(0, 500) + '...' : body;
      }
    }

    if (typeof body === 'object') {
      return this.sanitizeErrorResponse(body);
    }

    return body;
  }

  private sanitizeSuccessResponse(response: any): any {
    if (!response || typeof response !== 'object') {
      return response;
    }

    const sanitized = { ...response };

    // Remove sensitive fields from successful responses
    const sensitiveFields = [
      'password',
      'accessToken',
      'refreshToken',
      'token',
      'secret',
      'privateKey',
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    // If response has a user object, sanitize it
    if (sanitized.user && typeof sanitized.user === 'object') {
      const userFields = ['id', 'email', 'firstName', 'lastName', 'isVerified'];
      const sanitizedUser: any = {};
      
      userFields.forEach(field => {
        if (sanitized.user[field] !== undefined) {
          sanitizedUser[field] = sanitized.user[field];
        }
      });
      
      sanitized.user = sanitizedUser;
    }

    return sanitized;
  }

  private sanitizeErrorResponse(response: any): any {
    if (!response || typeof response !== 'object') {
      return response;
    }

    // For error responses, we want to preserve the error structure
    // but still remove any sensitive data that might have leaked
    const sanitized = { ...response };

    if (sanitized.stack && process.env.NODE_ENV === 'production') {
      delete sanitized.stack;
    }

    return sanitized;
  }
}