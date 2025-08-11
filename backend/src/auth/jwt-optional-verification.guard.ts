import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ALLOW_UNVERIFIED_KEY } from './allow-unverified.decorator';

@Injectable()
export class JwtOptionalVerificationGuard extends JwtAuthGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, run normal JWT validation
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // Check if this route allows unverified users
    const allowUnverified = false; // For now, disable unverified access check in this guard

    if (allowUnverified) {
      // For routes that allow unverified users, we've already validated the JWT
      // so we just need to ensure the user object is available
      return true;
    }

    // For routes that require verification, the default JWT strategy will handle it
    return true;
  }
}