/**
 * Quiz Integration Tests
 * End-to-end tests for quiz system API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Quiz Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;

  const testUser = {
    email: 'quiz-test@example.com',
    password: 'SecurePassword123!',
    firstName: 'Quiz',
    lastName: 'Tester',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();

    // Clean up any existing test data
    await cleanupTestData();

    // Create test user and get auth token
    await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
    await app.close();
  });

  const cleanupTestData = async () => {
    try {
      // Clean up in reverse dependency order
      await prisma.quizResponse.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.personalityProfile.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.user.deleteMany({
        where: { email: testUser.email },
      });
    } catch (error) {
      console.log('Cleanup error (may be expected):', error.message);
    }
  };

  const createTestUser = async () => {
    // Register test user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    authToken = registerResponse.body.accessToken;
    userId = registerResponse.body.user.id;
  };

  describe('GET /quiz/categories', () => {
    it('should get quiz categories without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const category = response.body[0];
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('type');
        expect(category).toHaveProperty('questions');
      }
    });
  });

  describe('GET /quiz/category/:categoryKey', () => {
    it('should get questions by category', async () => {
      // First get available categories
      const categoriesResponse = await request(app.getHttpServer())
        .get('/quiz/categories')
        .expect(200);

      if (categoriesResponse.body.length > 0) {
        const categoryKey = categoriesResponse.body[0].type;
        
        const response = await request(app.getHttpServer())
          .get(`/quiz/category/${categoryKey}`)
          .expect(200);

        expect(response.body).toHaveProperty('categoryId');
        expect(response.body).toHaveProperty('categoryName');
        expect(response.body).toHaveProperty('questions');
        expect(Array.isArray(response.body.questions)).toBe(true);

        if (response.body.questions.length > 0) {
          const question = response.body.questions[0];
          expect(question).toHaveProperty('id');
          expect(question).toHaveProperty('text');
          expect(question).toHaveProperty('type');
          expect(question).toHaveProperty('options');
          expect(Array.isArray(question.options)).toBe(true);
        }
      }
    });

    it('should return 404 for invalid category', async () => {
      await request(app.getHttpServer())
        .get('/quiz/category/invalid-category')
        .expect(404);
    });
  });

  describe('POST /quiz/response', () => {
    let questionId: string;
    let optionId: string;

    beforeAll(async () => {
      // Get a question to answer
      const categoriesResponse = await request(app.getHttpServer())
        .get('/quiz/categories')
        .expect(200);

      if (categoriesResponse.body.length > 0) {
        const category = categoriesResponse.body[0];
        if (category.questions && category.questions.length > 0) {
          const question = category.questions[0];
          questionId = question.id;
          if (question.options && question.options.length > 0) {
            optionId = question.options[0].id;
          }
        }
      }
    });

    it('should save quiz response with authentication', async () => {
      if (!questionId || !optionId) {
        console.log('Skipping test - no questions available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post('/quiz/response')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          questionId,
          selectedOptionId: optionId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.questionId).toBe(questionId);
      expect(response.body.selectedOptionId).toBe(optionId);
    });

    it('should reject request without authentication', async () => {
      if (!questionId || !optionId) {
        return;
      }

      await request(app.getHttpServer())
        .post('/quiz/response')
        .send({
          questionId,
          selectedOptionId: optionId,
        })
        .expect(401);
    });

    it('should validate request body', async () => {
      await request(app.getHttpServer())
        .post('/quiz/response')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });
  });

  describe('GET /quiz/responses', () => {
    it('should get user quiz responses with authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz/responses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const quizResponse = response.body[0];
        expect(quizResponse).toHaveProperty('id');
        expect(quizResponse).toHaveProperty('questionId');
        expect(quizResponse).toHaveProperty('selectedOptionId');
        expect(quizResponse).toHaveProperty('question');
        expect(quizResponse).toHaveProperty('selectedOption');
      }
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .get('/quiz/responses')
        .expect(401);
    });
  });

  describe('GET /quiz/progress', () => {
    it('should get quiz progress with authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('categories');
      expect(response.body).toHaveProperty('overallProgress');
      expect(response.body).toHaveProperty('isComplete');
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(typeof response.body.overallProgress).toBe('number');
      expect(typeof response.body.isComplete).toBe('boolean');

      if (response.body.categories.length > 0) {
        const category = response.body.categories[0];
        expect(category).toHaveProperty('categoryKey');
        expect(category).toHaveProperty('categoryName');
        expect(category).toHaveProperty('totalQuestions');
        expect(category).toHaveProperty('answeredQuestions');
        expect(category).toHaveProperty('progressPercentage');
        expect(category).toHaveProperty('isComplete');
      }
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .get('/quiz/progress')
        .expect(401);
    });
  });

  describe('POST /quiz/calculate-profile', () => {
    it('should calculate personality profile with sufficient responses', async () => {
      // First, ensure we have some quiz responses
      const responsesResponse = await request(app.getHttpServer())
        .get('/quiz/responses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (responsesResponse.body.length === 0) {
        console.log('Skipping test - no quiz responses available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post('/quiz/calculate-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.userId).toBe(userId);
      expect(response.body).toHaveProperty('calculatedAt');
      
      // Should have Big Five scores
      expect(response.body).toHaveProperty('opennessScore');
      expect(response.body).toHaveProperty('conscientiousnessScore');
      expect(response.body).toHaveProperty('extraversionScore');
      expect(response.body).toHaveProperty('agreeablenessScore');
      expect(response.body).toHaveProperty('neuroticismScore');
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .post('/quiz/calculate-profile')
        .expect(401);
    });
  });

  describe('GET /quiz/personality-profile', () => {
    it('should get user personality profile after calculation', async () => {
      // Try to calculate profile first (may fail if insufficient data)
      try {
        await request(app.getHttpServer())
          .post('/quiz/calculate-profile')
          .set('Authorization', `Bearer ${authToken}`);
      } catch (error) {
        // Profile calculation may fail with insufficient data
      }

      const response = await request(app.getHttpServer())
        .get('/quiz/personality-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body) {
        expect(response.body).toHaveProperty('userId');
        expect(response.body.userId).toBe(userId);
      }
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .get('/quiz/personality-profile')
        .expect(401);
    });
  });

  describe('Session-based Quiz Endpoints', () => {
    let sessionToken: string;

    describe('POST /quiz/session/start', () => {
      it('should start new quiz session', async () => {
        const response = await request(app.getHttpServer())
          .post('/quiz/session/start')
          .set('Authorization', `Bearer ${authToken}`)
          .send({})
          .expect(201);

        expect(response.body).toHaveProperty('sessionToken');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('progressPercentage');
        expect(response.body).toHaveProperty('answeredQuestions');
        expect(response.body).toHaveProperty('totalQuestions');
        expect(response.body).toHaveProperty('startedAt');

        sessionToken = response.body.sessionToken;
      });

      it('should start session with specific category', async () => {
        const categoriesResponse = await request(app.getHttpServer())
          .get('/quiz/categories')
          .expect(200);

        if (categoriesResponse.body.length > 0) {
          const categoryId = categoriesResponse.body[0].id;

          const response = await request(app.getHttpServer())
            .post('/quiz/session/start')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ categoryId })
            .expect(201);

          expect(response.body).toHaveProperty('sessionToken');
          expect(response.body).toHaveProperty('category');
          expect(response.body.category.id).toBe(categoryId);
        }
      });

      it('should reject request without authentication', async () => {
        await request(app.getHttpServer())
          .post('/quiz/session/start')
          .send({})
          .expect(401);
      });
    });

    describe('GET /quiz/session/:sessionToken', () => {
      it('should resume existing quiz session', async () => {
        if (!sessionToken) {
          console.log('Skipping test - no session token available');
          return;
        }

        const response = await request(app.getHttpServer())
          .get(`/quiz/session/${sessionToken}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('sessionToken');
        expect(response.body.sessionToken).toBe(sessionToken);
        expect(response.body).toHaveProperty('progressPercentage');
        expect(response.body).toHaveProperty('nextQuestion');
      });

      it('should return 404 for invalid session token', async () => {
        await request(app.getHttpServer())
          .get('/quiz/session/invalid-token')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });

      it('should reject request without authentication', async () => {
        if (!sessionToken) return;

        await request(app.getHttpServer())
          .get(`/quiz/session/${sessionToken}`)
          .expect(401);
      });
    });

    describe('POST /quiz/session/:sessionToken/answer', () => {
      let questionId: string;
      let optionId: string;

      beforeAll(async () => {
        if (sessionToken) {
          // Get the next question from the session
          const sessionResponse = await request(app.getHttpServer())
            .get(`/quiz/session/${sessionToken}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

          if (sessionResponse.body.nextQuestion) {
            questionId = sessionResponse.body.nextQuestion.id;
            if (sessionResponse.body.nextQuestion.options?.length > 0) {
              optionId = sessionResponse.body.nextQuestion.options[0].id;
            }
          }
        }
      });

      it('should answer question in session', async () => {
        if (!sessionToken || !questionId || !optionId) {
          console.log('Skipping test - session or question data not available');
          return;
        }

        const response = await request(app.getHttpServer())
          .post(`/quiz/session/${sessionToken}/answer`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            questionId,
            selectedOptionId: optionId,
            timeSpent: 15,
          })
          .expect(201);

        expect(response.body).toHaveProperty('session');
        expect(response.body).toHaveProperty('progressData');
        expect(response.body.session.sessionToken).toBe(sessionToken);
        expect(response.body.progressData).toHaveProperty('percentage');
      });

      it('should validate request body', async () => {
        if (!sessionToken) return;

        await request(app.getHttpServer())
          .post(`/quiz/session/${sessionToken}/answer`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            // Missing required fields
          })
          .expect(400);
      });

      it('should reject request without authentication', async () => {
        if (!sessionToken || !questionId || !optionId) return;

        await request(app.getHttpServer())
          .post(`/quiz/session/${sessionToken}/answer`)
          .send({
            questionId,
            selectedOptionId: optionId,
          })
          .expect(401);
      });
    });
  });

  describe('GET /quiz/analytics', () => {
    it('should get personality analytics with sufficient data', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz/analytics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Analytics might be empty if insufficient quiz data
      expect(response.body).toBeDefined();
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .get('/quiz/analytics')
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in request body', async () => {
      await request(app.getHttpServer())
        .post('/quiz/response')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    it('should handle missing content-type header', async () => {
      await request(app.getHttpServer())
        .post('/quiz/response')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          questionId: 'test',
          selectedOptionId: 'test',
        })
        .expect(400);
    });

    it('should handle invalid JWT token', async () => {
      await request(app.getHttpServer())
        .get('/quiz/responses')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should handle expired JWT token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KM';
      
      await request(app.getHttpServer())
        .get('/quiz/responses')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid requests', async () => {
      // Make several rapid requests to test rate limiting
      const promises = Array(5).fill(null).map(() =>
        request(app.getHttpServer())
          .get('/quiz/categories')
      );

      const responses = await Promise.all(promises);
      
      // All should succeed for GET requests (typically not rate limited as heavily)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('Data Validation', () => {
    it('should validate question ID format', async () => {
      await request(app.getHttpServer())
        .post('/quiz/response')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          questionId: 'invalid-format',
          selectedOptionId: 'invalid-format',
        })
        .expect(400);
    });

    it('should validate session token format', async () => {
      await request(app.getHttpServer())
        .get('/quiz/session/invalid-format-token')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});