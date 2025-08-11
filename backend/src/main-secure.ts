import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppConfigService } from './config/config.service';
import { GlobalExceptionFilter } from './common/middleware/error-handling.middleware';
import { AppLoggerService } from './common/services/logger.service';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  // Create application
  const app = await NestFactory.create(AppModule, {
    // Use custom logger
    bufferLogs: true,
  });

  // Get configuration service
  const configService = app.get(AppConfigService);
  
  // Initialize custom logger
  const logger = new AppLoggerService(configService);
  app.useLogger(logger);

  // Validate configuration on startup
  try {
    configService.validateConfig();
    logger.info('Configuration validation successful', {
      nodeEnv: configService.nodeEnv,
      port: configService.port,
    });
  } catch (error) {
    logger.error('Configuration validation failed', error.message);
    process.exit(1);
  }

  // Trust proxy (important for accurate IP addresses behind reverse proxy)
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  // Security: Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", ...(configService.isProduction ? ['https:'] : ['*'])],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hidePoweredBy: true,
  }));

  // Performance: Enable compression
  app.use(compression());

  // Enable CORS with secure configuration
  app.enableCors({
    origin: configService.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  // Global validation pipe with enhanced security
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Transform payloads to DTO instances
      disableErrorMessages: configService.isProduction, // Hide validation details in production
      validateCustomDecorators: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(configService));

  // Set global API prefix
  app.setGlobalPrefix(configService.apiPrefix);

  // Graceful shutdown handling
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  // Unhandled promise rejection handling
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Promise Rejection - Reason: ${reason}`);
  });

  // Uncaught exception handling
  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception - ${error.stack || error.message}`);
    process.exit(1);
  });

  // Start server
  const port = configService.port;
  await app.listen(port, '0.0.0.0');

  // Startup logging
  logger.info(`🚀 BLONG Backend Server started successfully`, {
    port,
    environment: configService.nodeEnv,
    url: `http://localhost:${port}`,
    apiUrl: `http://localhost:${port}/${configService.apiPrefix}`,
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
  });

  // Security logging
  logger.security('Application security features enabled', {
    helmet: true,
    cors: true,
    validation: true,
    compression: true,
    errorHandling: true,
    allowedOrigins: configService.allowedOrigins,
  });

  // Performance logging
  const memoryUsage = process.memoryUsage();
  logger.performance('Application startup completed', Date.now(), {
    memoryUsage: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
    },
  });

  // Log configuration warnings for production
  if (configService.isProduction) {
    if (!configService.sentryDsn) {
      logger.warn('Sentry DSN not configured for production environment');
    }
    
    logger.info('Production environment detected - security features enhanced');
  } else {
    logger.warn('Development environment detected - some security features may be relaxed');
  }
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});