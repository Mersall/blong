import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger: winston.Logger;
  private readonly nestLogger = new Logger('HTTP');

  constructor(private readonly configService: AppConfigService) {
    // Configure Winston logger with different transports based on environment
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}] ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          })
        ),
      }),
    ];

    // In production, also log to files
    if (this.configService.isProduction) {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );
    }

    this.logger = winston.createLogger({
      level: this.configService.isProduction ? 'warn' : 'debug',
      transports,
      // Don't exit on handled exceptions
      exitOnError: false,
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';

    // Get user ID if available (from JWT token)
    const userId = (req as any).user?.id || 'anonymous';

    // Log request start (only in development or for errors)
    if (!this.configService.isProduction) {
      this.logger.info('Request started', {
        method,
        url: originalUrl,
        ip,
        userAgent,
        userId,
        timestamp: new Date().toISOString(),
      });
    }

    // Override res.end to capture response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const contentLength = res.get('Content-Length') || '0';

      // Determine log level based on status code
      let logLevel: string;
      let logMessage: string;

      if (statusCode >= 500) {
        logLevel = 'error';
        logMessage = 'Server error';
      } else if (statusCode >= 400) {
        logLevel = 'warn';
        logMessage = 'Client error';
      } else if (statusCode >= 300) {
        logLevel = 'info';
        logMessage = 'Redirection';
      } else {
        logLevel = 'info';
        logMessage = 'Success';
      }

      // Create log data
      const logData = {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        contentLength,
        ip,
        userAgent,
        userId,
        timestamp: new Date().toISOString(),
      };

      // Log based on level and environment
      if (statusCode >= 400 || !logData.url.includes('/health')) {
        (this.logger as any)[logLevel](logMessage, logData);
      }

      // Also use NestJS logger for consistency
      if (statusCode >= 500) {
        this.nestLogger.error(
          `${method} ${originalUrl} ${statusCode} - ${duration}ms`,
          logData
        );
      } else if (statusCode >= 400) {
        this.nestLogger.warn(
          `${method} ${originalUrl} ${statusCode} - ${duration}ms`
        );
      } else if (!this.configService.isProduction) {
        this.nestLogger.log(
          `${method} ${originalUrl} ${statusCode} - ${duration}ms`
        );
      }

      // Call original end method
      originalEnd.call(this, chunk, encoding);
    }.bind(this);

    next();
  }

  // Method to log security events
  logSecurityEvent(event: string, details: any, req?: Request) {
    this.logger.warn('Security Event', {
      event,
      details,
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      userId: (req as any)?.user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  }

  // Method to log business events
  logBusinessEvent(event: string, details: any, userId?: string) {
    this.logger.info('Business Event', {
      event,
      details,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  }
}