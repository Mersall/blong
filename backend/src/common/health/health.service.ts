import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  details?: any;
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: HealthCheck[];
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: AppConfigService,
  ) {}

  async getHealthStatus(): Promise<{ status: string }> {
    try {
      // Simple health check - just verify basic functionality
      await this.checkDatabase();
      return { status: 'healthy' };
    } catch {
      return { status: 'unhealthy' };
    }
  }

  async getDetailedHealthStatus(): Promise<HealthStatus> {
    const checks: HealthCheck[] = [];
    
    // Database health check
    checks.push(await this.performDatabaseCheck());
    
    // Memory health check
    checks.push(this.performMemoryCheck());
    
    // Environment health check
    checks.push(this.performEnvironmentCheck());
    
    // External services health check (if any)
    // checks.push(await this.performExternalServicesCheck());

    // Determine overall status
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');
    
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
    if (hasUnhealthy) {
      overallStatus = 'unhealthy';
    } else if (hasDegraded) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      status: overallStatus,
      checks,
    };
  }

  async getReadinessStatus(): Promise<{ status: string; checks: HealthCheck[] }> {
    const checks: HealthCheck[] = [];
    
    // Check critical dependencies for readiness
    checks.push(await this.performDatabaseCheck());
    checks.push(this.performEnvironmentCheck());
    
    const isReady = checks.every(check => check.status === 'healthy');
    
    return {
      status: isReady ? 'ready' : 'not_ready',
      checks,
    };
  }

  private async performDatabaseCheck(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Simple query to test database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'database',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        details: {
          connection: 'active',
          provider: 'postgresql',
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error('Database health check failed', error);
      
      return {
        name: 'database',
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown database error',
      };
    }
  }

  private performMemoryCheck(): HealthCheck {
    const memoryUsage = process.memoryUsage();
    const memoryUsageInMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };

    // Alert if memory usage is high (adjust thresholds as needed)
    const heapUsedPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    let status: 'healthy' | 'unhealthy' | 'degraded';
    if (heapUsedPercentage > 90) {
      status = 'unhealthy';
    } else if (heapUsedPercentage > 75) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return {
      name: 'memory',
      status,
      details: {
        usage: memoryUsageInMB,
        heapUsedPercentage: Math.round(heapUsedPercentage),
      },
    };
  }

  private performEnvironmentCheck(): HealthCheck {
    try {
      // Check critical environment variables
      this.configService.validateConfig();
      
      return {
        name: 'environment',
        status: 'healthy',
        details: {
          nodeEnv: this.configService.nodeEnv,
          port: this.configService.port,
          configValid: true,
        },
      };
    } catch (error) {
      return {
        name: 'environment',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Configuration validation failed',
      };
    }
  }

  private async checkDatabase(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`;
  }

  // Example external service check (uncomment and modify as needed)
  /*
  private async performExternalServicesCheck(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Example: Check if email service is available
      if (this.configService.smtpHost) {
        // Perform actual check here
        const responseTime = Date.now() - startTime;
        return {
          name: 'email_service',
          status: 'healthy',
          responseTime,
          details: {
            host: this.configService.smtpHost,
            port: this.configService.smtpPort,
          },
        };
      }
      
      return {
        name: 'email_service',
        status: 'degraded',
        details: {
          message: 'Email service not configured',
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        name: 'email_service',
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'Email service check failed',
      };
    }
  }
  */
}