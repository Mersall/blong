import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:8081',
      'http://localhost:19000',
      'http://localhost:19001',
      'http://localhost:19002',
      'http://localhost:19006',
      'http://192.168.1.7:8081',
      'http://192.168.1.7:19000',
      'http://192.168.1.7:19001',
      'http://192.168.1.7:19002',
      'http://192.168.1.7:19006',
      'exp://192.168.1.7:8081',
      'exp://localhost:8081',
      '*', // Allow all origins in development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('BLONG API')
    .setDescription('BLONG - Personality assessment and date preparation app API documentation')
    .setVersion('1.0.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('profile', 'User profile management')
    .addTag('quiz', 'Personality quiz system')
    .addTag('dates', 'Date planning and management')
    .addTag('venues', 'Venue recommendations')
    .addTag('health', 'System health checks')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.blong.app', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'BLONG API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  // Add comprehensive request monitoring middleware
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const origin = req.headers.origin || 'No Origin';
    const userAgent = req.headers['user-agent'] || 'No User-Agent';

    console.log(`🌐 [${timestamp}] ${req.method} ${req.url}`);
    console.log(`   📍 Origin: ${origin}`);
    console.log(`   🔧 User-Agent: ${userAgent.substring(0, 50)}...`);

    // Log request body for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      console.log(`   📝 Request Body:`, JSON.stringify(req.body, null, 2));
    }

    // Log response
    const originalSend = res.send;
    res.send = function (data) {
      console.log(
        `   ✅ Response ${res.statusCode} for ${req.method} ${req.url}`,
      );
      if (res.statusCode >= 400) {
        console.log(`   ❌ Error Response:`, data);
      }
      return originalSend.call(this, data);
    };

    next();
  });

  // FIXED: Use port 3000 to match frontend configuration
  const port = process.env.PORT || 3000;
  // Listen on all interfaces (0.0.0.0) to accept connections from any IP
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 BLONG Backend Server running on: http://localhost:${port}`);
  console.log(`📱 Frontend can connect to: http://localhost:${port}/api`);
  console.log(`🔍 COMPREHENSIVE REQUEST MONITORING ENABLED`);
  console.log(`📊 All API calls, origins, and responses will be logged`);
  console.log(`⚠️  PORT FIXED: Now running on 3000 (was 3001)`);
}

bootstrap();
