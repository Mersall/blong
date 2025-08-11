/**
 * Auth Controller Integration Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestDatabase } from './test-database';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let testDatabase: TestDatabase;

  beforeAll(async () => {
    testDatabase = TestDatabase.getInstance();
    await testDatabase.setup();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(testDatabase.getPrismaClient())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
    await testDatabase.teardown();
  });

  beforeEach(async () => {
    await testDatabase.cleanAll();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        phone: '+1234567890',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(registerDto.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 409 if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'FEMALE',
        phone: '+1234567891',
      };

      // Create user first
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      // Try to register again
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body.message).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        email: 'invalid-email',
        password: '123', // Too short
        firstName: '',
        // Missing required fields
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('email'),
          expect.stringContaining('password'),
          expect.stringContaining('firstName'),
        ])
      );
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
          firstName: 'Login',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
          phone: '+1234567892',
        });
    });

    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        email: 'login@example.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(loginDto.email);
    });

    it('should return 401 for invalid email', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const loginDto = {
        email: 'login@example.com',
        password: 'WrongPassword!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Register and get refresh token
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'refresh@example.com',
          password: 'Password123!',
          firstName: 'Refresh',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
          phone: '+1234567893',
        });

      refreshToken = response.body.refreshToken;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.refreshToken).not.toBe(refreshToken); // Should be new token
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.message).toContain('Invalid refresh token');
    });
  });

  describe('GET /auth/me', () => {
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'me@example.com',
          password: 'Password123!',
          firstName: 'Me',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'FEMALE',
          phone: '+1234567894',
        });

      accessToken = response.body.accessToken;
      userId = response.body.user.id;
    });

    it('should return current user info', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe('me@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('Performance Tests', () => {
    it('should register user within 200ms', async () => {
      const registerDto = {
        email: 'perf@example.com',
        password: 'Password123!',
        firstName: 'Perf',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        phone: '+1234567895',
      };

      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(200);
    });

    it('should login within 100ms', async () => {
      // Create user first
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'perf-login@example.com',
          password: 'Password123!',
          firstName: 'Perf',
          lastName: 'Login',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
          phone: '+1234567896',
        });

      const loginDto = {
        email: 'perf-login@example.com',
        password: 'Password123!',
      };

      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(100);
    });
  });
});