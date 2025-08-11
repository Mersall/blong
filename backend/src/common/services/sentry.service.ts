import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
// import { ProfilingIntegration } from '@sentry/profiling-node';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class SentryService {
  private readonly logger = new Logger(SentryService.name);
  private initialized = false;

  constructor(private readonly configService: AppConfigService) {
    this.initializeSentry();
  }

  private initializeSentry() {
    const dsn = this.configService.sentryDsn;
    
    if (!dsn) {
      if (this.configService.isProduction) {
        this.logger.warn('Sentry DSN not configured - error monitoring disabled');
      } else {
        this.logger.debug('Sentry DSN not configured - running without error monitoring');
      }
      return;
    }

    try {
      Sentry.init({
        dsn,
        environment: this.configService.nodeEnv,
        debug: !this.configService.isProduction,
        
        // Performance monitoring
        tracesSampleRate: this.configService.isProduction ? 0.1 : 1.0,
        
        // Profiling
        profilesSampleRate: this.configService.isProduction ? 0.1 : 1.0,
        integrations: [
          // new ProfilingIntegration(),
        ],

        // Filter out sensitive information
        beforeSend: (event, hint) => {
          return this.filterSensitiveData(event as Sentry.ErrorEvent, hint);
        },

        // Custom error filtering
        beforeSendTransaction: (event) => {
          // Filter out health check transactions
          if (event.transaction?.includes('/health')) {
            return null;
          }
          return event;
        },

        // Release information
        release: process.env.npm_package_version || '1.0.0',

        // Server name
        serverName: process.env.SERVER_NAME || 'blong-backend',

        // Max breadcrumbs
        maxBreadcrumbs: 50,

        // Capture unhandled rejections - handled by Node.js process events

        // Additional tags
        initialScope: {
          tags: {
            component: 'backend',
            service: 'blong-api',
          },
        },
      });

      this.initialized = true;
      this.logger.log('Sentry initialized successfully', {
        environment: this.configService.nodeEnv,
        dsn: dsn.substring(0, 20) + '...',
      });
    } catch (error) {
      this.logger.error('Failed to initialize Sentry', error.message);
    }
  }

  private filterSensitiveData(event: Sentry.ErrorEvent, hint?: Sentry.EventHint): Sentry.ErrorEvent | null {
    // Remove sensitive information from event
    if (event.request) {
      // Remove sensitive headers
      if (event.request.headers) {
        const sensitiveHeaders = [
          'authorization',
          'cookie',
          'x-api-key',
          'x-auth-token',
        ];
        
        sensitiveHeaders.forEach(header => {
          if (event.request?.headers?.[header]) {
            event.request.headers[header] = '[Filtered]';
          }
        });
      }

      // Remove sensitive data from request body
      if (event.request.data && typeof event.request.data === 'object') {
        const sensitiveFields = [
          'password',
          'currentPassword',
          'newPassword',
          'confirmPassword',
          'token',
          'refreshToken',
          'accessToken',
          'secret',
          'privateKey',
        ];

        sensitiveFields.forEach(field => {
          if (event.request?.data?.[field]) {
            event.request.data[field] = '[Filtered]';
          }
        });
      }
    }

    // Remove sensitive context information
    if (event.contexts) {
      // Remove sensitive runtime context
      if (event.contexts.runtime && event.contexts.runtime.name === 'node') {
        delete event.contexts.runtime.version;
      }
    }

    // Filter out specific error types in production
    if (this.configService.isProduction) {
      const errorMessage = event.message || (event.exception?.values?.[0]?.value) || '';
      
      // Don't send validation errors to Sentry in production
      if (errorMessage.includes('validation failed') || 
          errorMessage.includes('Bad Request') ||
          event.level === 'warning') {
        return null;
      }
    }

    return event;
  }

  // Capture exception with additional context
  captureException(error: Error, context?: Record<string, any>, user?: { id: string; email?: string }) {
    if (!this.initialized) {
      this.logger.error('Sentry not initialized, logging error locally', error.message);
      return;
    }

    Sentry.withScope((scope) => {
      // Add user context
      if (user) {
        scope.setUser({
          id: user.id,
          email: user.email,
        });
      }

      // Add additional context
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setContext(key, context[key]);
        });
      }

      // Add tags based on error type
      if (error.name) {
        scope.setTag('error_type', error.name);
      }

      Sentry.captureException(error);
    });
  }

  // Capture message with level
  captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
    if (!this.initialized) {
      this.logger.log(`Sentry not initialized, logging message locally: ${message}`);
      return;
    }

    Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setContext(key, context[key]);
        });
      }

      Sentry.captureMessage(message);
    });
  }

  // Add breadcrumb for tracking user actions
  addBreadcrumb(message: string, category: string, data?: Record<string, any>, level: Sentry.SeverityLevel = 'info') {
    if (!this.initialized) return;

    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
  }

  // Set user context
  setUser(user: { id: string; email?: string; username?: string }) {
    if (!this.initialized) return;

    Sentry.setUser(user);
  }

  // Set custom tag
  setTag(key: string, value: string) {
    if (!this.initialized) return;

    Sentry.setTag(key, value);
  }

  // Set custom context
  setContext(key: string, context: Record<string, any>) {
    if (!this.initialized) return;

    Sentry.setContext(key, context);
  }

  // Start transaction for performance monitoring
  startTransaction(name: string, op: string, description?: string) {
    if (!this.initialized) return null;

    return Sentry.startSpan({
      name,
      op,
    }, () => {});
  }

  // Capture performance metrics
  capturePerformanceMetric(name: string, value: number, unit: string = 'millisecond', tags?: Record<string, string>) {
    if (!this.initialized) return;

    this.addBreadcrumb(`Performance: ${name}`, 'performance', {
      value,
      unit,
      ...tags,
    });
  }

  // Security event logging
  captureSecurityEvent(event: string, details: Record<string, any>, user?: { id: string; email?: string }) {
    if (!this.initialized) {
      this.logger.warn(`Security event: ${event}`, details);
      return;
    }

    Sentry.withScope((scope) => {
      scope.setTag('event_type', 'security');
      scope.setLevel('warning');
      
      if (user) {
        scope.setUser({
          id: user.id,
          email: user.email,
        });
      }

      scope.setContext('security_event', {
        event,
        ...details,
        timestamp: new Date().toISOString(),
      });

      Sentry.captureMessage(`Security Event: ${event}`, 'warning');
    });
  }

  // Business logic error tracking
  captureBusinessError(error: string, context: Record<string, any>, user?: { id: string; email?: string }) {
    if (!this.initialized) {
      this.logger.warn(`Business error: ${error}`, context);
      return;
    }

    Sentry.withScope((scope) => {
      scope.setTag('error_category', 'business');
      scope.setLevel('warning');
      
      if (user) {
        scope.setUser({
          id: user.id,
          email: user.email,
        });
      }

      scope.setContext('business_context', context);

      Sentry.captureMessage(`Business Error: ${error}`, 'warning');
    });
  }

  // Close Sentry (for graceful shutdown)
  async close(timeout: number = 2000) {
    if (!this.initialized) return;

    try {
      await Sentry.close(timeout);
      this.logger.log('Sentry closed successfully');
    } catch (error) {
      this.logger.error('Error closing Sentry', error.message);
    }
  }

  // Health check for Sentry
  isHealthy(): boolean {
    return this.initialized;
  }
}