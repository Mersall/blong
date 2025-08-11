/**
 * Test utilities and helper functions
 */

import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

// Import types from generated Prisma client
type User = {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  isVerified: boolean;
  verificationStatus: string;
  relationshipStatus: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserProfile = {
  id: string;
  userId: string;
  bio?: string;
  occupation?: string;
  education?: string;
  location?: string;
  interests: string[];
  photos: string[];
  height?: number;
  religion?: string;
  ethnicity?: string;
  languages: string[];
  children?: string;
  smoking?: string;
  drinking?: string;
  exercise?: string;
  pets?: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserPersonalityProfile = {
  id: string;
  userId: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  personalityType: string;
  loveLanguage: string;
  attachmentStyle: string;
  communicationStyle: string;
  conflictResolution: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Creates a mock Prisma service for testing
 */
export const createMockPrismaService = () => {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userProfile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    userPersonalityProfile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    userPreferences: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    quizQuestion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userQuizResponse: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    venue: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    quizCategory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    quizSession: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    photo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  };
};

/**
 * Creates a mock JWT service for testing
 */
export const createMockJwtService = () => {
  return {
    signAsync: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };
};

/**
 * Test data factories
 */
export const createTestUser = (override: Partial<User> = {}): User => ({
  id: '1',
  email: 'test@example.com',
  password: '$2a$12$hashedpassword',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1990-01-01'),
  gender: 'MALE',
  phone: '+1234567890',
  isVerified: false,
  verificationStatus: 'PENDING',
  relationshipStatus: 'SINGLE',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...override,
});

export const createTestUserProfile = (override: Partial<UserProfile> = {}): UserProfile => ({
  id: '1',
  userId: '1',
  bio: 'Test bio',
  occupation: 'Developer',
  education: 'University',
  location: 'Test City',
  interests: ['technology', 'travel'],
  photos: ['photo1.jpg'],
  height: 180,
  religion: 'Christian',
  ethnicity: 'Caucasian',
  languages: ['English'],
  children: 'NO',
  smoking: 'NO',
  drinking: 'OCCASIONALLY',
  exercise: 'REGULARLY',
  pets: 'NONE',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...override,
});

export const createTestPersonalityProfile = (
  override: Partial<UserPersonalityProfile> = {},
): UserPersonalityProfile => ({
  id: '1',
  userId: '1',
  openness: 75,
  conscientiousness: 80,
  extraversion: 60,
  agreeableness: 85,
  neuroticism: 30,
  personalityType: 'ENFJ',
  loveLanguage: 'WORDS_OF_AFFIRMATION',
  attachmentStyle: 'SECURE',
  communicationStyle: 'DIRECT',
  conflictResolution: 'COLLABORATIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...override,
});

/**
 * Helper to extract a service from a testing module
 */
export const getService = <T>(
  module: TestingModule,
  serviceClass: new (...args: any[]) => T,
): T => {
  return module.get<T>(serviceClass);
};

/**
 * Helper to create a mock implementation
 */
export const createMockImplementation = <T extends Record<string, any>>(
  methods: Partial<T>,
): T => {
  return methods as T;
};

/**
 * Async test helper
 */
export const asyncTest = (testFn: () => Promise<void>) => {
  return async () => {
    await testFn();
  };
};

/**
 * Helper to reset all mocks
 */
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

/**
 * Helper to create test JWT tokens
 */
export const createTestTokens = () => ({
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
});

/**
 * Export types for use in tests
 */
export type { User, UserProfile, UserPersonalityProfile };