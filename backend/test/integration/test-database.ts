/**
 * Test database utilities for integration tests
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';

export class TestDatabase {
  private static instance: TestDatabase;
  private prisma: PrismaClient;
  private databaseUrl: string;

  private constructor() {
    // Generate unique database name for this test run
    const testId = randomBytes(8).toString('hex');
    const baseDatabaseUrl = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/blong_test';
    this.databaseUrl = `${baseDatabaseUrl}_${testId}`;
    
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: this.databaseUrl,
        },
      },
    });
  }

  static getInstance(): TestDatabase {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new TestDatabase();
    }
    return TestDatabase.instance;
  }

  async setup(): Promise<void> {
    try {
      // Create test database
      await this.createDatabase();
      
      // Run migrations
      await this.runMigrations();
      
      // Connect Prisma client
      await this.prisma.$connect();
    } catch (error) {
      console.error('Failed to setup test database:', error);
      throw error;
    }
  }

  async teardown(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      await this.dropDatabase();
    } catch (error) {
      console.error('Failed to teardown test database:', error);
    }
  }

  getPrismaClient(): PrismaClient {
    return this.prisma;
  }

  getDatabaseUrl(): string {
    return this.databaseUrl;
  }

  private async createDatabase(): Promise<void> {
    try {
      // Extract database name from URL
      const url = new URL(this.databaseUrl);
      const dbName = url.pathname.slice(1);
      
      // Create database using psql command
      execSync(`createdb ${dbName}`, { stdio: 'ignore' });
    } catch (error) {
      // Database might already exist, which is fine for tests
      console.warn('Database creation failed (might already exist):', error);
    }
  }

  private async runMigrations(): Promise<void> {
    try {
      // Set environment variable for Prisma
      process.env.DATABASE_URL = this.databaseUrl;
      
      // Run Prisma migrations
      execSync('npx prisma migrate deploy', { stdio: 'ignore' });
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  private async dropDatabase(): Promise<void> {
    try {
      const url = new URL(this.databaseUrl);
      const dbName = url.pathname.slice(1);
      
      execSync(`dropdb ${dbName}`, { stdio: 'ignore' });
    } catch (error) {
      console.warn('Database drop failed:', error);
    }
  }

  async cleanAll(): Promise<void> {
    const tablenames = await this.prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.log({ error });
    }
  }

  async seed(): Promise<void> {
    // Add basic seed data for tests
    await this.prisma.quizCategory.createMany({
      data: [
        {
          id: 'big-five-category',
          name: 'Big Five Personality',
          description: 'Assess the five major personality dimensions',
          type: 'BIG_FIVE',
          order: 1,
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });
  }
}