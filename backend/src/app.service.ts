import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to BLONG Matrimonial App Backend API! 💕';
  }
}
