import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'BLONG Backend API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('analytics')
  @Redirect('/api/profile/analytics', 302)
  redirectAnalytics() {
    // Redirect /api/analytics to /api/profile/analytics
  }
}
