import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ALLOW_UNVERIFIED_KEY } from './allow-unverified.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.debug(`JWT Guard canActivate called for ${request.method} ${request.url}`);
    this.logger.debug(`Authorization header present: ${!!authHeader}`);

    if (authHeader) {
      this.logger.debug(`Auth header: ${authHeader.substring(0, 20)}...`);
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    this.logger.debug(`JWT Guard handleRequest called for ${request.method} ${request.url}`);
    this.logger.debug(`Error: ${err?.message || 'none'}, User: ${user ? 'present' : 'none'}, Info: ${info?.message || 'none'}`);

    if (err || !user) {
      this.logger.warn(`JWT authentication failed: ${err?.message || info?.message || 'Unknown error'}`);
      throw err || new UnauthorizedException('Invalid or expired token');
    }

    // Check if this route allows unverified users
    const allowUnverified = this.reflector.get<boolean>(
      ALLOW_UNVERIFIED_KEY,
      context.getHandler(),
    );

    // If route requires verification and user is not verified, block access
    if (!allowUnverified && user && !user.isVerified) {
      throw new UnauthorizedException('Email verification required');
    }

    this.logger.debug(`JWT authentication successful for user: ${user.email}`);
    return user;
  }
}
