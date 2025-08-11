import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppConfigService } from '../../config/config.service';
import * as winston from 'winston';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
  details?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly winstonLogger: winston.Logger;

  constructor(private readonly configService: AppConfigService) {
    // Configure Winston for error logging
    this.winstonLogger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        ...(this.configService.isProduction
          ? [
              new winston.transports.File({
                filename: 'logs/errors.log',
                maxsize: 5242880, // 5MB
                maxFiles: 5,
              }),
            ]
          : []),
      ],
    });
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;
    const userAgent = request.get('User-Agent') || 'unknown';
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    const userId = (request as any).user?.id || 'anonymous';

    let status: number;
    let message: string | string[];
    let errorName: string;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
      } else {
        message = exception.message;
      }
      
      errorName = exception.constructor.name;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      // Handle standard JavaScript errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = this.configService.isProduction 
        ? 'Internal server error' 
        : exception.message;
      errorName = exception.constructor.name;
      stack = exception.stack;
    } else {
      // Handle unknown exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errorName = 'UnknownException';
      stack = undefined;
    }

    // Create standardized error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error: this.getErrorDescription(status),
      timestamp,
      path,
      method,
    };

    // Add details only in development
    if (!this.configService.isProduction) {
      errorResponse.details = {
        errorName,
        stack,
      };
    }

    // Log the error with appropriate level
    const logContext = {
      statusCode: status,
      message,
      errorName,
      path,
      method,
      ip,
      userAgent,
      userId,
      timestamp,
      stack,
    };

    if (status >= 500) {
      // Server errors - log as error
      this.logger.error(
        `${method} ${path} - ${status} ${errorName}: ${message}`,
        stack
      );
      this.winstonLogger.error('Server Error', logContext);
    } else if (status >= 400) {
      // Client errors - log as warning
      this.logger.warn(
        `${method} ${path} - ${status} ${errorName}: ${message}`
      );
      this.winstonLogger.warn('Client Error', logContext);
    }

    // Set security headers for error responses
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Cache-Control', 'no-store');

    // Send error response
    response.status(status).json(errorResponse);
  }

  private getErrorDescription(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.METHOD_NOT_ALLOWED:
        return 'Method Not Allowed';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Too Many Requests';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      case HttpStatus.BAD_GATEWAY:
        return 'Bad Gateway';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'Service Unavailable';
      case HttpStatus.GATEWAY_TIMEOUT:
        return 'Gateway Timeout';
      default:
        return 'Error';
    }
  }
}