/**
 * Prisma service mock for testing
 */

import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type PrismaServiceMock = DeepMockProxy<PrismaService>;

export const createPrismaServiceMock = (): PrismaServiceMock => {
  return mockDeep<PrismaService>();
};

export const prismaServiceMock = createPrismaServiceMock();

// Common mock implementations
export const commonPrismaResponses = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  userProfile: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  userPreferences: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  photo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
  quizCategory: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  quizQuestion: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  quizOption: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  userQuizResponse: {
    findMany: jest.fn(),
    upsert: jest.fn(),
    create: jest.fn(),
  },
  userPersonalityProfile: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};