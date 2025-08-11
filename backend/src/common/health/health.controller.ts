import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    const health = await this.healthService.getHealthStatus();
    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      ...health,
    };
  }

  @Get('detailed')
  async getDetailedHealth() {
    const detailedHealth = await this.healthService.getDetailedHealthStatus();
    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      ...detailedHealth,
    };
  }

  @Get('ready')
  async getReadiness() {
    const readiness = await this.healthService.getReadinessStatus();
    if (readiness.status === 'ready') {
      return {
        timestamp: new Date().toISOString(),
        ...readiness,
      };
    } else {
      throw {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Service not ready',
        details: readiness,
      };
    }
  }

  @Get('live')
  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      pid: process.pid,
      memory: process.memoryUsage(),
    };
  }
}