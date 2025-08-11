import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Frontend-Backend Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  // Simulate frontend data structures
  const frontendProfileData = {
    personalInfo: {
      bio: 'Passionate about life and looking for meaningful connections',
      height: 175,
      education: "Bachelor's Degree",
      occupation: 'Software Engineer',
    },
    location: {
      city: 'New York',
      country: 'United States',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    lifestyle: {
      smoking: 'never',        // Frontend uses lowercase
      drinking: 'occasionally', // Frontend uses lowercase
      exercise: 'regularly',    // Frontend uses lowercase
    },
    interests: ['technology', 'travel', 'cooking'],
    demographics: {
      maritalStatus: 'never_married', // Frontend uses snake_case
      hasChildren: false,
      wantsChildren: true,
      familyValues: 'mixed',  // Frontend uses lowercase
      religiosity: 'somewhat_religious', // Frontend uses snake_case
    }
  };

  // Transform function to convert frontend data to backend format
  const transformProfileForAPI = (frontendData: any) => {
    return {
      bio: frontendData.personalInfo?.bio,
      height: frontendData.personalInfo?.height,
      education: frontendData.personalInfo?.education,
      occupation: frontendData.personalInfo?.occupation,
      city: frontendData.location?.city,
      country: frontendData.location?.country,
      latitude: frontendData.location?.latitude,
      longitude: frontendData.location?.longitude,
      interests: frontendData.interests || [],
      smoking: frontendData.lifestyle?.smoking?.toUpperCase().replace('NEVER', 'NEVER'),
      drinking: frontendData.lifestyle?.drinking?.toUpperCase().replace('OCCASIONALLY', 'OCCASIONALLY'),
      exercise: frontendData.lifestyle?.exercise?.toUpperCase().replace('REGULARLY', 'REGULARLY'),
      maritalStatus: frontendData.demographics?.maritalStatus?.toUpperCase().replace('NEVER_MARRIED', 'NEVER_MARRIED'),
      hasChildren: frontendData.demographics?.hasChildren,
      wantsChildren: frontendData.demographics?.wantsChildren,
      familyValues: frontendData.demographics?.familyValues?.toUpperCase().replace('MIXED', 'MIXED'),
      religiosity: frontendData.demographics?.religiosity?.toUpperCase().replace('SOMEWHAT_RELIGIOUS', 'SOMEWHAT_RELIGIOUS'),
    };
  };

  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api');
    await app.init();
    
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    // Create test user
    const testUser = {
      email: `integration.test.${Date.now()}@blong.app`,
      password: 'SecurePassword123!',
      firstName: 'Integration',
      lastName: 'Test',
      dateOfBirth: '1990-01-15',
      gender: 'MALE',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    accessToken = registerResponse.body.accessToken;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    // Cleanup
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    await app.close();
  });

  describe('Profile Submission Flow Integration', () => {
    it('should handle frontend profile data structure correctly', async () => {
      // Transform frontend data to backend format
      const backendData = transformProfileForAPI(frontendProfileData);

      // Test the profile update with transformed data
      const response = await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(backendData)
        .expect(200);

      // Verify the response contains the correct data
      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId,
        bio: frontendProfileData.personalInfo.bio,
        height: frontendProfileData.personalInfo.height,
        city: frontendProfileData.location.city,
        country: frontendProfileData.location.country,
        interests: frontendProfileData.interests,
        smoking: 'NEVER',
        drinking: 'OCCASIONALLY',
        exercise: 'REGULARLY',
        maritalStatus: 'NEVER_MARRIED',
        hasChildren: false,
        wantsChildren: true,
        familyValues: 'MIXED',
        religiosity: 'SOMEWHAT_RELIGIOUS',
      });
    });

    it('should reject frontend data without transformation', async () => {
      // Try to send frontend data directly (should fail)
      const response = await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(frontendProfileData)
        .expect(400);

      // Should receive validation errors
      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
    });

    it('should validate enum values correctly', async () => {
      const invalidEnumData = {
        city: 'New York',
        country: 'United States',
        smoking: 'SOMETIMES', // Invalid enum value
        drinking: 'RARELY',   // Invalid enum value
        exercise: 'DAILY',    // Invalid enum value
      };

      await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidEnumData)
        .expect(400);
    });
  });

  describe('Data Type Validation', () => {
    it('should validate height as number', async () => {
      const invalidData = {
        city: 'New York',
        country: 'United States',
        height: '175', // String instead of number
      };

      await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should validate interests as array', async () => {
      const invalidData = {
        city: 'New York',
        country: 'United States',
        interests: 'technology,travel', // String instead of array
      };

      await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should validate boolean fields', async () => {
      const invalidData = {
        city: 'New York',
        country: 'United States',
        hasChildren: 'false', // String instead of boolean
        wantsChildren: 'true', // String instead of boolean
      };

      await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('Frontend Error Handling Scenarios', () => {
    it('should provide clear validation errors for frontend', async () => {
      const invalidData = {
        // Missing required fields
        bio: '', // Empty string
        height: -10, // Invalid range
        smoking: 'INVALID',
      };

      const response = await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400);

      // Check that validation errors are detailed
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/city|required/i),
          expect.stringMatching(/country|required/i),
        ])
      );
    });

    it('should handle network-like errors gracefully', async () => {
      // Test with malformed JSON (simulating network issues)
      await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
  });

  describe('Authentication Integration', () => {
    it('should handle token expiry scenarios', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      await request(app.getHttpServer())
        .get('/api/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('should handle missing authorization header', async () => {
      await request(app.getHttpServer())
        .get('/api/profile')
        .expect(401);
    });

    it('should handle malformed authorization header', async () => {
      await request(app.getHttpServer())
        .get('/api/profile')
        .set('Authorization', 'InvalidToken')
        .expect(401);
    });
  });

  describe('Profile Completion Status Integration', () => {
    it('should track profile completion correctly', async () => {
      // First, check initial completion status
      const initialStatus = await request(app.getHttpServer())
        .get('/api/profile/completion-status')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(initialStatus.body.completionPercentage).toBeGreaterThan(0);

      // Update profile with more data
      const completeProfileData = transformProfileForAPI(frontendProfileData);
      
      await request(app.getHttpServer())
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(completeProfileData)
        .expect(200);

      // Check updated completion status
      const updatedStatus = await request(app.getHttpServer())
        .get('/api/profile/completion-status')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(updatedStatus.body.completionPercentage).toBeGreaterThan(
        initialStatus.body.completionPercentage
      );
    });
  });

  describe('Preferences Integration', () => {
    it('should handle preferences with correct data types', async () => {
      const preferencesData = {
        minAge: 25,
        maxAge: 35,
        maxDistance: 50,
        education: ["Bachelor's Degree", "Master's Degree"],
        interests: ['technology', 'travel', 'fitness'],
        dealBreakers: ['smoking'],
      };

      const response = await request(app.getHttpServer())
        .put('/api/profile/preferences')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(preferencesData)
        .expect(200);

      expect(response.body).toMatchObject({
        minAge: 25,
        maxAge: 35,
        maxDistance: 50,
        education: expect.arrayContaining(["Bachelor's Degree", "Master's Degree"]),
        interests: expect.arrayContaining(['technology', 'travel', 'fitness']),
        dealBreakers: expect.arrayContaining(['smoking']),
      });
    });
  });

  describe('Photo Management Integration', () => {
    let photoId: string;

    it('should handle photo upload with URL validation', async () => {
      const photoData = {
        url: 'https://example.com/valid-photo.jpg',
        isPrimary: false,
      };

      const response = await request(app.getHttpServer())
        .post('/api/profile/photos')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(photoData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId,
        url: photoData.url,
        isPrimary: false,
      });

      photoId = response.body.id;
    });

    it('should reject invalid photo URLs', async () => {
      const invalidPhotoData = {
        url: 'not-a-valid-url',
        isPrimary: false,
      };

      await request(app.getHttpServer())
        .post('/api/profile/photos')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidPhotoData)
        .expect(400);
    });

    it('should handle photo operations correctly', async () => {
      // Set as primary
      await request(app.getHttpServer())
        .put(`/api/profile/photos/${photoId}/primary`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Delete photo
      await request(app.getHttpServer())
        .delete(`/api/profile/photos/${photoId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });
  });

  describe('Performance Integration', () => {
    it('should handle multiple rapid requests', async () => {
      const requests = Array(10).fill(0).map(() =>
        request(app.getHttpServer())
          .get('/api/profile/completion-status')
          .set('Authorization', `Bearer ${accessToken}`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.completionPercentage).toBeDefined();
      });
    });

    it('should respond within acceptable time limits', async () => {
      const start = Date.now();
      
      await request(app.getHttpServer())
        .get('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
        
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500); // Should respond within 500ms
    });
  });
});