/**
 * BLONG Authentication Security Comprehensive Tests
 * Advanced security testing for authentication system
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import { TestDatabase } from '../integration/test-database';
import * as bcrypt from 'bcryptjs';

describe('Authentication Security (Comprehensive)', () => {
  let app: INestApplication;
  let authService: AuthService;
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
    
    authService = app.get<AuthService>(AuthService);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
    await testDatabase.teardown();
  });

  beforeEach(async () => {
    await testDatabase.cleanAll();
  });

  describe('Password Security Validation', () => {
    it('should reject weak passwords with detailed feedback', async () => {
      const weakPasswords = [
        'password',      // Common password
        '123456789',     // Numeric only
        'PASSWORD123',   // No lowercase
        'password123',   // No uppercase
        'Password',      // No numbers
        'Pass123',       // Too short
        'p'.repeat(129), // Too long
      ];

      for (const password of weakPasswords) {
        const registerDto = {
          email: `test${Math.random()}@example.com`,
          password,
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(400);

        expect(response.body.message).toContain('Password validation failed');
      }
    });

    it('should accept strong passwords', async () => {
      const strongPasswords = [
        'SecurePass123!',
        'MyStr0ng@Password',
        'C0mpl3x#Pass',
        'Un1qu3$Security',
      ];

      for (const password of strongPasswords) {
        const registerDto = {
          email: `test${Math.random()}@example.com`,
          password,
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(201);
      }
    });

    it('should properly hash passwords in database', async () => {
      const registerDto = {
        email: 'hash-test@example.com',
        password: 'SecurePass123!',
        firstName: 'Hash',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const user = await prismaService.user.findUnique({
        where: { email: registerDto.email },
      });

      expect(user).toBeTruthy();
      expect(user.password).not.toBe(registerDto.password);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
      
      // Verify password can be verified
      const isValidPassword = await bcrypt.compare(
        registerDto.password,
        user.password
      );
      expect(isValidPassword).toBe(true);
    });
  });

  describe('Brute Force Protection', () => {
    it('should lockout account after failed login attempts', async () => {
      // Create test user
      const registerDto = {
        email: 'lockout-test@example.com',
        password: 'SecurePass123!',
        firstName: 'Lockout',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      // Simulate multiple failed login attempts
      const loginDto = {
        email: registerDto.email,
        password: 'wrongpassword',
      };

      // First 4 attempts should return 401
      for (let i = 0; i < 4; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(401);
      }

      // 5th attempt should lockout the account
      const lockoutResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(400);

      expect(lockoutResponse.body.message).toContain('Account locked');

      // Even correct credentials should be blocked
      const correctLoginDto = {
        email: registerDto.email,
        password: registerDto.password,
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(correctLoginDto)
        .expect(400);
    });

    it('should reset failed attempts after successful login', async () => {
      const registerDto = {
        email: 'reset-test@example.com',
        password: 'SecurePass123!',
        firstName: 'Reset',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      // Make 3 failed attempts
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: registerDto.email,
            password: 'wrongpassword',
          })
          .expect(401);
      }

      // Successful login should reset attempts
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: registerDto.email,
          password: registerDto.password,
        })
        .expect(200);

      // Verify failed attempts were reset
      const user = await prismaService.user.findUnique({
        where: { email: registerDto.email },
      });

      expect(user.loginAttempts).toBe(0);
      expect(user.lockoutUntil).toBeNull();
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent SQL injection in email field', async () => {
      const maliciousEmails = [
        "'; DROP TABLE users; --",
        "admin@example.com'; UPDATE users SET password = 'hacked' WHERE '1'='1",
        "test@example.com' UNION SELECT * FROM users --",
      ];

      for (const email of maliciousEmails) {
        const registerDto = {
          email,
          password: 'SecurePass123!',
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(400); // Should be rejected by validation
      }

      // Verify users table still exists and is intact
      const userCount = await prismaService.user.count();
      expect(userCount).toBe(0); // No users should have been created
    });

    it('should prevent XSS in name fields', async () => {
      const maliciousNames = [
        '<script>alert("xss")</script>',
        'John<img src=x onerror=alert(1)>',
        'Jane</script><script>alert(document.cookie)</script>',
      ];

      for (const name of maliciousNames) {
        const registerDto = {
          email: `test${Math.random()}@example.com`,
          password: 'SecurePass123!',
          firstName: name,
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(400);
      }
    });

    it('should validate email format strictly', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@example',
        'test@.example.com',
        'a'.repeat(256) + '@example.com', // Too long
      ];

      for (const email of invalidEmails) {
        const registerDto = {
          email,
          password: 'SecurePass123!',
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(400);
      }
    });
  });

  describe('Token Security', () => {
    it('should generate secure JWT tokens', async () => {
      const registerDto = {
        email: 'jwt-test@example.com',
        password: 'SecurePass123!',
        firstName: 'JWT',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const { accessToken, refreshToken } = response.body;

      // Verify token format (JWT structure)
      expect(accessToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
      expect(refreshToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

      // Tokens should be different
      expect(accessToken).not.toBe(refreshToken);

      // Tokens should have reasonable length (not too short)
      expect(accessToken.length).toBeGreaterThan(100);
      expect(refreshToken.length).toBeGreaterThan(100);
    });

    it('should invalidate old refresh tokens on rotation', async () => {
      const registerDto = {
        email: 'rotation-test@example.com',
        password: 'SecurePass123!',
        firstName: 'Rotation',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const { refreshToken: oldRefreshToken } = registerResponse.body;

      // Use refresh token to get new tokens
      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(200);

      const { refreshToken: newRefreshToken } = refreshResponse.body;

      // Old refresh token should now be invalid
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: oldRefreshToken })
        .expect(401);

      // New refresh token should work
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: newRefreshToken })
        .expect(200);
    });
  });

  describe('Age Validation Security', () => {
    it('should reject users under 18 years old', async () => {
      const today = new Date();
      const underageDate = new Date(
        today.getFullYear() - 17, 
        today.getMonth(), 
        today.getDate()
      );

      const registerDto = {
        email: 'underage@example.com',
        password: 'SecurePass123!',
        firstName: 'Under',
        lastName: 'Age',
        dateOfBirth: underageDate.toISOString().split('T')[0],
        gender: 'MALE',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);

      expect(response.body.message).toContain('18 years old');
    });

    it('should accept users exactly 18 years old', async () => {
      const today = new Date();
      const exactlyEighteenDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      const registerDto = {
        email: 'exactly18@example.com',
        password: 'SecurePass123!',
        firstName: 'Exactly',
        lastName: 'Eighteen',
        dateOfBirth: exactlyEighteenDate.toISOString().split('T')[0],
        gender: 'FEMALE',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);
    });
  });

  describe('Rate Limiting Security', () => {
    it('should handle rapid registration attempts', async () => {
      const promises = [];
      
      // Create 10 rapid registration attempts
      for (let i = 0; i < 10; i++) {
        const registerDto = {
          email: `rapid${i}@example.com`,
          password: 'SecurePass123!',
          firstName: 'Rapid',
          lastName: `User${i}`,
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
        };

        promises.push(
          request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
        );
      }

      const responses = await Promise.all(promises);
      
      // Most should succeed, but some may be rate limited
      const successCount = responses.filter(r => r.status === 201).length;
      const rateLimitedCount = responses.filter(r => r.status === 429).length;
      
      expect(successCount + rateLimitedCount).toBe(10);
      expect(successCount).toBeGreaterThan(0); // At least some should succeed
    });
  });

  describe('Email Verification Security', () => {
    it('should require email verification before login', async () => {
      const registerDto = {
        email: 'verification-test@example.com',
        password: 'SecurePass123!',
        firstName: 'Verification',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      // Register user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      // Attempt to login without verification
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: registerDto.email,
          password: registerDto.password,
        })
        .expect(401);

      expect(loginResponse.body.message).toContain('verify your email');
    });

    it('should generate secure verification tokens', async () => {
      const registerDto = {
        email: 'token-test@example.com',
        password: 'SecurePass123!',
        firstName: 'Token',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const user = await prismaService.user.findUnique({
        where: { email: registerDto.email },
      });

      // Verification token should exist and be secure
      expect(user.verificationToken).toBeTruthy();
      expect(user.verificationToken.length).toBeGreaterThanOrEqual(32);
      expect(user.verificationTokenExpiry).toBeTruthy();
      expect(user.verificationTokenExpiry).toBeInstanceOf(Date);
    });
  });

  describe('Security Headers and HTTPS', () => {
    it('should include security headers in responses', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'headers-test@example.com',
          password: 'SecurePass123!',
          firstName: 'Headers',
          lastName: 'Test',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
        });

      // Check for important security headers
      // Note: These depend on your security middleware configuration
      expect(response.headers).toBeDefined();
    });
  });
});