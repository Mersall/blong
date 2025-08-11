import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { AppConfigService } from '../../config/config.service';
import * as path from 'path';
import * as fs from 'fs';

export interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

@Injectable()
export class AppLoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;
  private readonly context: string = 'Application';

  constructor(private readonly configService?: AppConfigService) {
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logLevel = this.configService?.logLevel || 'info';
    const logFormat = this.configService?.logFormat || 'json';
    const logFileEnabled = this.configService?.logFileEnabled ?? true;
    const logConsoleEnabled = this.configService?.logConsoleEnabled ?? true;

    // Define log format
    const baseFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] })
    );

    const jsonFormat = winston.format.combine(
      baseFormat,
      winston.format.json()
    );

    const simpleFormat = winston.format.combine(
      baseFormat,
      winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
        let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
        
        if (metadata && Object.keys(metadata).length > 0) {
          log += ` | ${JSON.stringify(metadata)}`;
        }
        
        if (stack) {
          log += `\n${stack}`;
        }
        
        return log;
      })
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
        let log = `${timestamp} ${level} ${message}`;
        
        if (metadata && Object.keys(metadata).length > 0) {
          const metaObj = metadata as any;
          const context = metaObj.context || '';
          const requestInfo = metaObj.method && metaObj.url ? ` ${metaObj.method} ${metaObj.url}` : '';
          const userInfo = metaObj.userId ? ` (User: ${metaObj.userId})` : '';
          log += `${context}${requestInfo}${userInfo}`;
        }
        
        if (stack) {
          log += `\n${stack}`;
        }
        
        return log;
      })
    );

    // Configure transports
    const transports: winston.transport[] = [];

    // Console transport
    if (logConsoleEnabled) {
      transports.push(
        new winston.transports.Console({
          level: logLevel,
          format: consoleFormat,
        })
      );
    }

    // File transports
    if (logFileEnabled) {
      const fileFormat = logFormat === 'json' ? jsonFormat : simpleFormat;

      // Combined logs (all levels)
      transports.push(
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          level: logLevel,
          format: fileFormat,
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          tailable: true,
        })
      );

      // Error logs only
      transports.push(
        new winston.transports.File({
          filename: path.join(logsDir, 'errors.log'),
          level: 'error',
          format: fileFormat,
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          tailable: true,
        })
      );

      // Security logs (for audit trail)
      transports.push(
        new winston.transports.File({
          filename: path.join(logsDir, 'security.log'),
          level: 'warn',
          format: fileFormat,
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 10, // Keep more security logs
          tailable: true,
        })
      );
    }

    return winston.createLogger({
      level: logLevel,
      format: jsonFormat,
      transports,
      // Handle uncaught exceptions and unhandled rejections
      exceptionHandlers: logFileEnabled ? [
        new winston.transports.File({
          filename: path.join(logsDir, 'exceptions.log'),
          format: jsonFormat,
        })
      ] : [],
      rejectionHandlers: logFileEnabled ? [
        new winston.transports.File({
          filename: path.join(logsDir, 'rejections.log'),
          format: jsonFormat,
        })
      ] : [],
    });
  }

  // NestJS LoggerService interface implementation
  log(message: any, context?: string): void {
    this.info(message, { context: context || this.context });
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, {
      context: context || this.context,
      stack: trace,
    });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, {
      context: context || this.context,
    });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, {
      context: context || this.context,
    });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, {
      context: context || this.context,
    });
  }

  // Enhanced logging methods with context
  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  // Security-specific logging
  security(message: string, context?: LogContext): void {
    this.logger.warn(`[SECURITY] ${message}`, {
      ...context,
      security: true,
    });
  }

  // Performance logging
  performance(message: string, duration: number, context?: LogContext): void {
    this.logger.info(`[PERFORMANCE] ${message}`, {
      ...context,
      duration,
      performance: true,
    });
  }

  // Audit logging
  audit(action: string, userId: string, context?: LogContext): void {
    this.logger.info(`[AUDIT] ${action}`, {
      ...context,
      userId,
      action,
      audit: true,
    });
  }

  // HTTP request logging
  http(method: string, url: string, statusCode: number, duration: number, context?: LogContext): void {
    const level = statusCode >= 400 ? 'warn' : 'info';
    this.logger[level](`${method} ${url} ${statusCode}`, {
      ...context,
      method,
      url,
      statusCode,
      duration,
      http: true,
    });
  }

  // Database operation logging
  database(operation: string, table: string, duration?: number, context?: LogContext): void {
    this.logger.debug(`[DATABASE] ${operation} on ${table}`, {
      ...context,
      operation,
      table,
      duration,
      database: true,
    });
  }

  // Authentication logging
  auth(event: string, email?: string, success: boolean = true, context?: LogContext): void {
    const level = success ? 'info' : 'warn';
    this.logger[level](`[AUTH] ${event}${email ? ` for ${email}` : ''}`, {
      ...context,
      event,
      email,
      success,
      auth: true,
    });
  }

  // Create child logger with persistent context
  child(defaultContext: LogContext): AppLoggerService {
    const childLogger = new AppLoggerService(this.configService);
    
    // Override methods to include default context
    const originalMethods = ['info', 'error', 'warn', 'debug', 'verbose', 'security', 'performance', 'audit', 'http', 'database', 'auth'];
    
    originalMethods.forEach(method => {
      const originalMethod = childLogger[method as keyof AppLoggerService] as Function;
      childLogger[method as keyof AppLoggerService] = (...args: any[]) => {
        if (args.length > 1 && typeof args[1] === 'object') {
          args[1] = { ...defaultContext, ...args[1] };
        } else if (args.length === 1) {
          args.push(defaultContext);
        }
        return originalMethod.apply(childLogger, args);
      };
    });

    return childLogger;
  }

  // Get underlying Winston logger for advanced usage
  getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}