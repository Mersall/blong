import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  private generalLimiter: any;
  private authLimiter: any;
  private strictLimiter: any;

  constructor(private readonly configService: AppConfigService) {
    // General API rate limiting
    this.generalLimiter = rateLimit({
      windowMs: this.configService.rateLimitWindowMs,
      max: this.configService.rateLimitMaxRequests,
      message: {
        error: 'Too many requests',
        message: 'Too many requests from this IP, please try again later',
        statusCode: 429,
        retryAfter: Math.ceil(this.configService.rateLimitWindowMs / 1000 / 60), // minutes
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/api/health';
      },
      keyGenerator: (req) => {
        // Use IP address as key, but consider X-Forwarded-For for proxied requests
        return req.ip || req.connection.remoteAddress || 'unknown';
      },
    });

    // Stricter rate limiting for authentication endpoints
    this.authLimiter = rateLimit({
      windowMs: this.configService.authRateLimitWindowMs,
      max: this.configService.authRateLimitMaxRequests,
      message: {
        error: 'Too many authentication attempts',
        message: 'Too many login attempts from this IP, please try again later',
        statusCode: 429,
        retryAfter: Math.ceil(this.configService.authRateLimitWindowMs / 1000 / 60), // minutes
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true, // Don't count successful requests
      keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress || 'unknown';
      },
    });

    // Very strict rate limiting for password reset and sensitive operations
    this.strictLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // 3 attempts per window
      message: {
        error: 'Too many sensitive requests',
        message: 'Too many attempts for this operation, please try again later',
        statusCode: 429,
        retryAfter: 15, // minutes
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress || 'unknown';
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Apply different rate limits based on the endpoint
    const path = req.path.toLowerCase();

    if (path.includes('/auth/forgot-password') || 
        path.includes('/auth/reset-password') ||
        path.includes('/auth/verify-email')) {
      // Very strict limiting for sensitive operations
      return this.strictLimiter(req, res, next);
    } else if (path.includes('/auth/')) {
      // Strict limiting for authentication endpoints
      return this.authLimiter(req, res, next);
    } else {
      // General rate limiting for all other endpoints
      return this.generalLimiter(req, res, next);
    }
  }
}