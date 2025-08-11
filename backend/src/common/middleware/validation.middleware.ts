import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as createDOMPurify from 'isomorphic-dompurify';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  private readonly DOMPurify = createDOMPurify();

  use(req: Request, res: Response, next: NextFunction) {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = this.sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = this.sanitizeObject(req.params);
    }

    next();
  }

  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize the key as well
        const sanitizedKey = this.sanitizeString(key);
        sanitized[sanitizedKey] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }

  private sanitizeString(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }

    // Remove potential XSS attacks
    let sanitized = this.DOMPurify.sanitize(str);
    
    // Remove or escape SQL injection patterns
    sanitized = sanitized
      .replace(/(['";\\])/g, '\\$1') // Escape quotes and backslashes
      .replace(/(-{2,}|\/\*|\*\/)/g, '') // Remove SQL comment patterns
      .replace(/(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi, (match) => {
        // If it's part of a legitimate word, keep it, otherwise remove it
        return match.length === match.trim().length ? '' : match;
      });

    // Limit string length to prevent DoS
    if (sanitized.length > 10000) {
      sanitized = sanitized.substring(0, 10000);
    }

    return sanitized;
  }

  // Static validation rules for common endpoints
  static getAuthValidationRules() {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
      body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    ];
  }

  static getRegistrationValidationRules() {
    return [
      ...ValidationMiddleware.getAuthValidationRules(),
      body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name must be between 2-50 characters and contain only letters'),
      body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name must be between 2-50 characters and contain only letters'),
      body('dateOfBirth')
        .isISO8601()
        .custom((value) => {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18 || age > 100) {
            throw new Error('You must be between 18 and 100 years old');
          }
          return true;
        }),
      body('gender')
        .isIn(['MALE', 'FEMALE', 'OTHER'])
        .withMessage('Gender must be MALE, FEMALE, or OTHER'),
      body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    ];
  }

  static getProfileValidationRules() {
    return [
      body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/),
      body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/),
      body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
      body('location')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .matches(/^[a-zA-Z0-9\s,.-]+$/)
        .withMessage('Location contains invalid characters'),
    ];
  }

  // Middleware to check validation results
  static checkValidationResult(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined,
      }));
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    next();
  }
}