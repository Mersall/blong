import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  private helmetMiddleware: any;

  constructor(private readonly configService: AppConfigService) {
    // Configure helmet with security-focused settings
    this.helmetMiddleware = helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", this.configService.isProduction ? 'https:' : '*'],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: this.configService.isProduction ? [] : null,
        },
      },
      
      // HTTP Strict Transport Security (HSTS)
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      
      // X-Frame-Options
      frameguard: {
        action: 'deny',
      },
      
      // X-Content-Type-Options
      noSniff: true,
      
      // X-XSS-Protection
      xssFilter: true,
      
      // Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      
      // Hide X-Powered-By header
      hidePoweredBy: true,
      
      // DNS Prefetch Control
      dnsPrefetchControl: {
        allow: false,
      },
      
      // IE No Open
      ieNoOpen: true,
      
      // Don't allow embedding in frames/iframes (already configured above)
      
      // Cross-origin policies
      crossOriginEmbedderPolicy: false, // May interfere with some functionality
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Apply helmet security headers
    this.helmetMiddleware(req, res, () => {
      // Additional custom security headers
      
      // Prevent MIME type sniffing
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      // Prevent clickjacking
      res.setHeader('X-Frame-Options', 'DENY');
      
      // Enable XSS filtering
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      // Control referrer information
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // Prevent Adobe Flash and PDF files from including content from your site
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
      
      // Feature policy / Permissions policy
      res.setHeader(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()'
      );
      
      // Content-Type sniffing protection
      res.setHeader('X-Download-Options', 'noopen');
      
      // Prevent caching of sensitive responses
      if (req.path.includes('/auth/') || req.path.includes('/profile/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      
      next();
    });
  }
}