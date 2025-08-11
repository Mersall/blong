import { Injectable, NestMiddleware, ForbiddenException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { AppConfigService } from '../../config/config.service';

interface CSRFRequest extends Request {
  csrfToken?: string;
  session?: {
    csrfSecret?: string;
  };
}

@Injectable()
export class CSRFProtectionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CSRFProtectionMiddleware.name);
  private readonly tokenStorage = new Map<string, { secret: string; timestamp: number }>(); // In production, use Redis

  constructor(private readonly configService: AppConfigService) {
    // Clean up expired tokens every hour
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60 * 60 * 1000);
  }

  use(req: CSRFRequest, res: Response, next: NextFunction) {
    // Skip CSRF protection for safe methods and certain endpoints
    if (this.shouldSkipCSRFProtection(req)) {
      return next();
    }

    const method = req.method.toLowerCase();
    
    if (method === 'get' || method === 'head' || method === 'options') {
      // For safe methods, generate and provide CSRF token
      this.generateAndSetCSRFToken(req, res);
      return next();
    }

    // For unsafe methods, validate CSRF token
    try {
      this.validateCSRFToken(req);
      next();
    } catch (error) {
      this.logger.warn(`CSRF validation failed for ${req.method} ${req.path} from IP: ${req.ip}`);
      throw new ForbiddenException('CSRF token validation failed');
    }
  }

  private shouldSkipCSRFProtection(req: CSRFRequest): boolean {
    const path = req.path.toLowerCase();
    
    // Skip for health checks and public endpoints
    const skipPaths = [
      '/health',
      '/api/health',
      '/auth/verify-email', // Email verification links don't need CSRF
    ];

    return skipPaths.some(skipPath => path.includes(skipPath));
  }

  private generateAndSetCSRFToken(req: CSRFRequest, res: Response): void {
    // Generate a secret and token
    const secret = crypto.randomBytes(32).toString('hex');
    const token = this.generateToken(secret);
    const sessionId = this.getSessionId(req);

    // Store the secret (in production, use Redis with TTL)
    this.tokenStorage.set(sessionId, {
      secret,
      timestamp: Date.now(),
    });

    // Set token in response header and make it available to the request
    res.setHeader('X-CSRF-Token', token);
    req.csrfToken = token;

    // Also provide it as a cookie for client-side access (with proper flags)
    res.cookie('csrf-token', token, {
      httpOnly: false, // Allow client-side access
      secure: this.configService.isProduction, // HTTPS only in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  }

  private validateCSRFToken(req: CSRFRequest): void {
    const sessionId = this.getSessionId(req);
    const tokenData = this.tokenStorage.get(sessionId);

    if (!tokenData) {
      throw new Error('No CSRF secret found for session');
    }

    // Get token from header or body
    const token = req.headers['x-csrf-token'] as string || 
                  req.body?._csrf || 
                  req.query._csrf as string;

    if (!token) {
      throw new Error('CSRF token not provided');
    }

    // Validate token
    if (!this.verifyToken(token, tokenData.secret)) {
      throw new Error('Invalid CSRF token');
    }

    // Check token age (1 hour max)
    const tokenAge = Date.now() - tokenData.timestamp;
    if (tokenAge > 60 * 60 * 1000) {
      this.tokenStorage.delete(sessionId);
      throw new Error('CSRF token expired');
    }
  }

  private generateToken(secret: string): string {
    // Create HMAC-based token
    const timestamp = Date.now().toString();
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(timestamp);
    const signature = hmac.digest('hex');
    
    // Combine timestamp and signature
    return Buffer.from(`${timestamp}:${signature}`).toString('base64');
  }

  private verifyToken(token: string, secret: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [timestamp, signature] = decoded.split(':');
      
      if (!timestamp || !signature) {
        return false;
      }

      // Recreate expected signature
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(timestamp);
      const expectedSignature = hmac.digest('hex');

      // Constant-time comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }

  private getSessionId(req: CSRFRequest): string {
    // Use IP + User-Agent as session identifier (simplified)
    // In production, use proper session management
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const userId = (req as any).user?.id || 'anonymous';
    
    return crypto
      .createHash('sha256')
      .update(`${ip}:${userAgent}:${userId}`)
      .digest('hex');
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    const expiredThreshold = 60 * 60 * 1000; // 1 hour

    let cleanedCount = 0;
    for (const [sessionId, tokenData] of this.tokenStorage.entries()) {
      if (now - tokenData.timestamp > expiredThreshold) {
        this.tokenStorage.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired CSRF tokens`);
    }
  }

  // Static method to generate CSRF token for controllers
  static generateCSRFTokenForResponse(res: Response): string {
    const secret = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now().toString();
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(timestamp);
    const signature = hmac.digest('hex');
    const token = Buffer.from(`${timestamp}:${signature}`).toString('base64');

    res.setHeader('X-CSRF-Token', token);
    return token;
  }
}