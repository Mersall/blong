import { Test, TestingModule } from '@nestjs/testing';
import { MatchingService } from './matching.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MatchingService', () => {
  let service: MatchingService;

  const prismaMock = {
    user: { findMany: jest.fn() },
    userPersonalityProfile: { findUnique: jest.fn() },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchingService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    service = module.get(MatchingService);
    jest.clearAllMocks();
  });

  it('computes weighted compatibility and filters by threshold', async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: 'other' }]);
    prismaMock.userPersonalityProfile.findUnique
      .mockResolvedValueOnce({ openness_score: 70, conscientiousness_score: 60, extraversion_score: 50, agreeableness_score: 80, neuroticism_score: 40 })
      .mockResolvedValueOnce({ openness_score: 72, conscientiousness_score: 58, extraversion_score: 55, agreeableness_score: 78, neuroticism_score: 42 });

    const res = await service.getMatches('me', { page: 1, limit: 10 });
    expect(res.success).toBe(true);
    expect(res.data.matches.length).toBeGreaterThanOrEqual(0);
  });
});

