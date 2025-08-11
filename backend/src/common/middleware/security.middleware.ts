import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private helmetMiddleware: any;

  constructor(private configService: AppConfigService) {
    this.helmetMiddleware = helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
          fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", ...this.configService.allowedOrigins],
        },
      },
      
      // Cross-Origin-Embedder-Policy
      crossOriginEmbedderPolicy: false, // Disable for mobile app compatibility
      
      // Cross-Origin-Opener-Policy
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      
      // Cross-Origin-Resource-Policy
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      
      // DNS Prefetch Control
      dnsPrefetchControl: { allow: false },
      
      // Frame Options
      frameguard: { action: 'deny' },
      
      // Hide Powered-By header
      hidePoweredBy: true,
      
      // HTTP Strict Transport Security (only in production)
      hsts: this.configService.isProduction ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      } : false,
      
      // IE No Open
      ieNoOpen: true,
      
      // No Sniff
      noSniff: true,
      
      // Origin Agent Cluster
      originAgentCluster: true,
      
      // Permitted Cross-Domain Policies
      permittedCrossDomainPolicies: false,
      
      // Referrer Policy
      referrerPolicy: { policy: 'no-referrer' },
      
      // X-XSS-Protection
      xssFilter: true,
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Apply helmet security headers
    this.helmetMiddleware(req, res, () => {
      // Add custom security headers
      
      // Prevent caching of sensitive data
      if (req.url.includes('/auth/') || req.url.includes('/api/profile')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      
      // Add additional security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Download-Options', 'noopen');
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
      
      // Remove server identification
      res.removeHeader('X-Powered-By');
      res.removeHeader('Server');
      
      next();
    });
  }
}