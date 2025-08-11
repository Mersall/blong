import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('BLONG API Comprehensive Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  // Test data
  const testUser = {
    email: `test.${Date.now()}@blong.app`,
    password: 'SecurePassword123!',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-15',
    gender: 'MALE',
  };

  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let photoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same validation pipes as main application
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Set global prefix
    app.setGlobalPrefix('api');
    
    await app.init();
    
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    // Clean up any existing test data
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await app.close();
  });

  async function cleanupTestData() {
    try {
      if (userId) {
        // Delete user and all related data (cascade should handle this)
        await prisma.user.delete({
          where: { id: userId },
        });
      }
      
      // Clean up any test users that might exist
      await prisma.user.deleteMany({
        where: {
          email: {
            contains: '@blong.app',
          },
        },
      });
    } catch (error) {
      // Ignore errors during cleanup
    }
  }

  describe('Health Check Endpoints', () => {
    describe('GET /api/health', () => {
      it('should return basic health status', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/health')
          .expect(200);

        expect(response.body).toEqual({
          status: 'ok',
          message: 'BLONG Backend API is running',
          timestamp: expect.any(String),
          version: '1.0.0',
        });
      });
    });

    describe('GET /api/health/detailed', () => {
      it('should return detailed health status', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/health/detailed')
          .expect(200);

        expect(response.body).toMatchObject({
          timestamp: expect.any(String),
          uptime: expect.any(Number),
        });

        expect(response.body.uptime).toBeGreaterThan(0);
      });
    });

    describe('GET /api/health/ready', () => {
      it('should return readiness status', async () => {
        await request(app.getHttpServer())
          .get('/api/health/ready')
          .expect(200);
      });
    });

    describe('GET /api/health/live', () => {
      it('should return liveness status', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/health/live')
          .expect(200);

        expect(response.body).toMatchObject({
          status: 'alive',
          timestamp: expect.any(String),
          uptime: expect.any(Number),
          pid: expect.any(Number),
          memory: expect.objectContaining({
            rss: expect.any(Number),
            heapTotal: expect.any(Number),
            heapUsed: expect.any(Number),
            external: expect.any(Number),
          }),
        });
      });
    });
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(testUser)
          .expect(201);

        expect(response.body).toMatchObject({
          user: {
            id: expect.any(String),
            email: testUser.email,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            gender: testUser.gender,
            isVerified: false,
            verificationStatus: 'PENDING',
            relationshipStatus: 'SINGLE',
            createdAt: expect.any(String),
          },
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        // Store tokens for future tests
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        userId = response.body.user.id;
      });

      it('should return 400 for invalid registration data', async () => {
        const invalidUser = {
          email: 'invalid-email',
          password: '123', // Too short
          firstName: '',
          lastName: '',
          dateOfBirth: 'invalid-date',
          gender: 'INVALID',
        };

        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(invalidUser)
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          message: expect.any(Array),
          error: 'Bad Request',
        });

        expect(response.body.message.length).toBeGreaterThan(0);
      });

      it('should return 409 for duplicate email', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(testUser)
          .expect(409);

        expect(response.body).toMatchObject({
          statusCode: 409,
          message: expect.stringContaining('already exists'),
          error: 'Conflict',
        });
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login user successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password,
          })
          .expect(200);

        expect(response.body).toMatchObject({
          user: {
            id: userId,
            email: testUser.email,
          },
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        // Update tokens
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
      });

      it('should return 401 for invalid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword',
          })
          .expect(401);

        expect(response.body).toMatchObject({
          statusCode: 401,
          message: expect.any(String),
          error: 'Unauthorized',
        });
      });

      it('should return 400 for invalid login data', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'invalid-email',
            password: '',
          })
          .expect(400);

        expect(response.body).toMatchObject({
          statusCode: 400,
          message: expect.any(Array),
          error: 'Bad Request',
        });
      });
    });

    describe('GET /api/auth/me', () => {
      it('should return current user info', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toMatchObject({
          id: userId,
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          gender: testUser.gender,
        });
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/auth/me')
          .expect(401);
      });

      it('should return 401 with invalid token', async () => {
        await request(app.getHttpServer())
          .get('/api/auth/me')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
      });
    });

    describe('POST /api/auth/refresh', () => {
      it('should refresh tokens successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/refresh')
          .send({ refreshToken })
          .expect(200);

        expect(response.body).toMatchObject({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });

        // Update tokens
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
      });

      it('should return 401 for invalid refresh token', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/refresh')
          .send({ refreshToken: 'invalid-token' })
          .expect(401);
      });
    });
  });

  describe('Profile Management Endpoints', () => {
    describe('GET /api/profile', () => {
      it('should return 404 for user without profile', async () => {
        await request(app.getHttpServer())
          .get('/api/profile')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/profile')
          .expect(401);
      });
    });

    describe('PUT /api/profile', () => {
      const profileData = {
        bio: 'Passionate about life and looking for meaningful connections',
        height: 175,
        education: "Bachelor's Degree",
        occupation: 'Software Engineer',
        city: 'New York',
        country: 'United States',
        interests: ['technology', 'travel', 'cooking'],
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        exercise: 'REGULARLY',
        maritalStatus: 'NEVER_MARRIED',
        hasChildren: false,
        wantsChildren: true,
        familyValues: 'MIXED',
        religiosity: 'SOMEWHAT_RELIGIOUS',
      };

      it('should create/update profile successfully', async () => {
        const response = await request(app.getHttpServer())
          .put('/api/profile')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(profileData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: expect.any(String),
          userId,
          bio: profileData.bio,
          height: profileData.height,
          city: profileData.city,
          country: profileData.country,
          interests: profileData.interests,
          smoking: profileData.smoking,
          drinking: profileData.drinking,
          exercise: profileData.exercise,
        });
      });

      it('should return profile after creation', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/profile')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toMatchObject({
          userId,
          bio: profileData.bio,
          city: profileData.city,
        });
      });

      it('should return 400 for invalid profile data', async () => {
        const invalidData = {
          height: 'invalid',
          smoking: 'INVALID_VALUE',
          drinking: 'INVALID_VALUE',
        };

        await request(app.getHttpServer())
          .put('/api/profile')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .put('/api/profile')
          .send(profileData)
          .expect(401);
      });
    });

    describe('GET /api/profile/preferences', () => {
      it('should return 404 for user without preferences', async () => {
        await request(app.getHttpServer())
          .get('/api/profile/preferences')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });

    describe('PUT /api/profile/preferences', () => {
      const preferencesData = {
        minAge: 25,
        maxAge: 35,
        maxDistance: 50,
        education: ["Bachelor's Degree", "Master's Degree"],
        interests: ['technology', 'travel', 'fitness'],
        dealBreakers: ['smoking'],
      };

      it('should create/update preferences successfully', async () => {
        const response = await request(app.getHttpServer())
          .put('/api/profile/preferences')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(preferencesData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: expect.any(String),
          userId,
          minAge: preferencesData.minAge,
          maxAge: preferencesData.maxAge,
          maxDistance: preferencesData.maxDistance,
          education: preferencesData.education,
          interests: preferencesData.interests,
          dealBreakers: preferencesData.dealBreakers,
        });
      });

      it('should return preferences after creation', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/profile/preferences')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toMatchObject({
          userId,
          minAge: preferencesData.minAge,
          maxAge: preferencesData.maxAge,
        });
      });
    });

    describe('GET /api/profile/completion-status', () => {
      it('should return profile completion status', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/profile/completion-status')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toMatchObject({
          completionPercentage: expect.any(Number),
          completedSections: expect.any(Array),
          missingSections: expect.any(Array),
          isComplete: expect.any(Boolean),
        });

        expect(response.body.completionPercentage).toBeGreaterThanOrEqual(0);
        expect(response.body.completionPercentage).toBeLessThanOrEqual(100);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/profile/completion-status')
          .expect(401);
      });
    });
  });

  describe('Photo Management Endpoints', () => {
    describe('GET /api/profile/photos', () => {
      it('should return empty array for user without photos', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/profile/photos')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toEqual([]);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/profile/photos')
          .expect(401);
      });
    });

    describe('POST /api/profile/photos', () => {
      const photoData = {
        url: 'https://example.com/test-photo.jpg',
        isPrimary: false,
      };

      it('should upload photo successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/profile/photos')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(photoData)
          .expect(201);

        expect(response.body).toMatchObject({
          id: expect.any(String),
          userId,
          url: photoData.url,
          isPrimary: photoData.isPrimary,
          order: expect.any(Number),
          uploadedAt: expect.any(String),
        });

        photoId = response.body.id;
      });

      it('should return photos after upload', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/profile/photos')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
          id: photoId,
          url: photoData.url,
        });
      });

      it('should return 400 for invalid photo data', async () => {
        const invalidData = {
          url: 'invalid-url',
        };

        await request(app.getHttpServer())
          .post('/api/profile/photos')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .post('/api/profile/photos')
          .send(photoData)
          .expect(401);
      });
    });

    describe('PUT /api/profile/photos/:photoId/primary', () => {
      it('should set photo as primary', async () => {
        const response = await request(app.getHttpServer())
          .put(`/api/profile/photos/${photoId}/primary`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toMatchObject({
          id: photoId,
          isPrimary: true,
        });
      });

      it('should return 404 for non-existent photo', async () => {
        await request(app.getHttpServer())
          .put('/api/profile/photos/non-existent-id/primary')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .put(`/api/profile/photos/${photoId}/primary`)
          .expect(401);
      });
    });

    describe('DELETE /api/profile/photos/:photoId', () => {
      it('should delete photo successfully', async () => {
        await request(app.getHttpServer())
          .delete(`/api/profile/photos/${photoId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(204);
      });

      it('should return empty array after deletion', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/profile/photos')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body).toEqual([]);
      });

      it('should return 404 for non-existent photo', async () => {
        await request(app.getHttpServer())
          .delete(`/api/profile/photos/${photoId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .delete(`/api/profile/photos/${photoId}`)
          .expect(401);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      await request(app.getHttpServer())
        .get('/api/non-existent-endpoint')
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{ malformed json }')
        .expect(400);
    });

    it('should handle missing content-type', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send('plain text')
        .expect(400);
    });
  });

  describe('Response Time Performance', () => {
    it('should respond to health check quickly', async () => {
      const start = Date.now();
      await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100); // Should respond within 100ms
    });

    it('should handle authentication quickly', async () => {
      const start = Date.now();
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(200); // Should respond within 200ms
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle multiple simultaneous requests', async () => {
      const requests = Array(10).fill(0).map(() =>
        request(app.getHttpServer())
          .get('/api/health')
          .expect(200)
      );

      const responses = await Promise.all(requests);
      expect(responses).toHaveLength(10);
      responses.forEach(response => {
        expect(response.body.status).toBe('ok');
      });
    });

    it('should handle concurrent authenticated requests', async () => {
      const requests = Array(5).fill(0).map(() =>
        request(app.getHttpServer())
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
      );

      const responses = await Promise.all(requests);
      expect(responses).toHaveLength(5);
      responses.forEach(response => {
        expect(response.body.id).toBe(userId);
      });
    });
  });
});