import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  // Database Configuration
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  // JWT Configuration
  get jwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret || secret === 'your-super-secret-jwt-key-change-this-in-production') {
      throw new Error('JWT_SECRET must be set and changed from default value');
    }
    return secret;
  }

  get jwtRefreshSecret(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret || secret === 'your-super-secret-refresh-jwt-key-change-this-in-production') {
      throw new Error('JWT_REFRESH_SECRET must be set and changed from default value');
    }
    return secret;
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
  }

  // App Configuration
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX') || 'api';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  // Security Configuration
  get bcryptRounds(): number {
    return this.configService.get<number>('BCRYPT_ROUNDS') || 12;
  }

  get maxLoginAttempts(): number {
    return this.configService.get<number>('MAX_LOGIN_ATTEMPTS') || 5;
  }

  get lockoutTimeMinutes(): number {
    return this.configService.get<number>('LOCKOUT_TIME_MINUTES') || 15;
  }

  // Email Configuration
  get smtpHost(): string {
    return this.configService.get<string>('SMTP_HOST') || '';
  }

  get smtpPort(): number {
    return this.configService.get<number>('SMTP_PORT') || 587;
  }

  get smtpUser(): string {
    return this.configService.get<string>('SMTP_USER') || '';
  }

  get smtpPass(): string {
    return this.configService.get<string>('SMTP_PASS') || '';
  }

  get fromEmail(): string {
    return this.configService.get<string>('FROM_EMAIL') || 'noreply@yourdomain.com';
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8081';
  }

  // Redis Configuration
  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
  }

  // Rate Limiting Configuration
  get rateLimitWindowMs(): number {
    return this.configService.get<number>('RATE_LIMIT_WINDOW_MS') || 900000; // 15 minutes
  }

  get rateLimitMaxRequests(): number {
    return this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS') || 100;
  }

  get authRateLimitWindowMs(): number {
    return this.configService.get<number>('AUTH_RATE_LIMIT_WINDOW_MS') || 900000; // 15 minutes
  }

  get authRateLimitMaxRequests(): number {
    return this.configService.get<number>('AUTH_RATE_LIMIT_MAX_REQUESTS') || 5;
  }

  // CORS Configuration
  get allowedOrigins(): string[] {
    const origins = this.configService.get<string>('ALLOWED_ORIGINS');
    if (!origins) {
      return ['http://localhost:8081', 'http://192.168.1.11:8081', 'exp://192.168.1.11:8081'];
    }
    return origins.split(',').map(origin => origin.trim());
  }

  // File Upload Configuration
  get maxFileSize(): number {
    return this.configService.get<number>('MAX_FILE_SIZE') || 5242880; // 5MB
  }

  get uploadPath(): string {
    return this.configService.get<string>('UPLOAD_PATH') || './uploads';
  }

  // Logging Configuration
  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL') || 'info';
  }

  get logFormat(): string {
    return this.configService.get<string>('LOG_FORMAT') || 'json';
  }

  get logFileEnabled(): boolean {
    return this.configService.get<string>('LOG_FILE_ENABLED') === 'true';
  }

  get logConsoleEnabled(): boolean {
    return this.configService.get<string>('LOG_CONSOLE_ENABLED') !== 'false';
  }

  // Sentry Configuration
  get sentryDsn(): string {
    return this.configService.get<string>('SENTRY_DSN') || '';
  }

  // Health Check Configuration
  get healthCheckTimeout(): number {
    return this.configService.get<number>('HEALTH_CHECK_TIMEOUT') || 5000;
  }

  get healthCheckMemoryThreshold(): number {
    return this.configService.get<number>('HEALTH_CHECK_MEMORY_THRESHOLD') || 0.8;
  }

  // Validation method to ensure all required environment variables are set
  validateConfig(): void {
    const requiredVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
    ];

    const missingVars = requiredVars.filter(varName => {
      const value = this.configService.get<string>(varName);
      return !value || value === '';
    });

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Validate that secrets are not using default values
    try {
      this.jwtSecret;
      this.jwtRefreshSecret;
    } catch (error) {
      throw error;
    }

    // Additional validation for insecure default values
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (jwtSecret && jwtSecret.includes('REPLACE_WITH_STRONG_RANDOM_SECRET')) {
      throw new Error('JWT_SECRET must be replaced with a secure random value. Use: openssl rand -base64 64');
    }

    if (jwtRefreshSecret && jwtRefreshSecret.includes('REPLACE_WITH_DIFFERENT_STRONG_RANDOM_SECRET')) {
      throw new Error('JWT_REFRESH_SECRET must be replaced with a secure random value. Use: openssl rand -base64 64');
    }

    if (this.isProduction) {
      const productionRequiredVars = [
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASS',
      ];

      const missingProdVars = productionRequiredVars.filter(varName => {
        const value = this.configService.get<string>(varName);
        return !value || value === '';
      });

      if (missingProdVars.length > 0) {
        throw new Error(`Missing required production environment variables: ${missingProdVars.join(', ')}`);
      }

      // Additional production validations
      if (!this.sentryDsn) {
        console.warn('WARNING: SENTRY_DSN not configured for production environment');
      }
    }
  }
}