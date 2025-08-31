import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

// Note: This is a minimal e2e to validate wiring; assumes auth guard can be bypassed/mocked

describe('Date Delivery Payments (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
    );
    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/date-delivery/dates/payment should return 501 when disabled', async () => {
    await request(app.getHttpServer())
      .post('/api/date-delivery/dates/payment')
      .send({ deliveredDateId: 'x', amount: 10 })
      .expect(501);
  });
});

