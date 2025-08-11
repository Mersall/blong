import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret,
    });

    // Debug JWT configuration
    this.logger.debug(`JWT Strategy initialized with secret length: ${appConfigService.jwtSecret.length}`);
  }

  async validate(payload: any) {
    try {
      // Debug incoming payload
      this.logger.debug(`JWT validate called with payload: ${JSON.stringify(payload)}`);

      // Validate payload structure
      if (!payload || !payload.sub) {
        this.logger.warn('Invalid JWT payload structure');
        throw new UnauthorizedException('Invalid token payload');
      }

      // Debug token validation with more details
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      this.logger.debug(`Validating token for user ${payload.sub}, exp: ${payload.exp}, current time: ${currentTime}, time until expiry: ${timeUntilExpiry} seconds`);

      // Validate user exists and is active
      const user = await this.authService.validateUser(payload.sub);
      if (!user) {
        this.logger.warn(`User not found for token validation: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      // Email verification is now handled in JwtAuthGuard based on @AllowUnverified decorator

      // Log successful validation (without sensitive data)
      this.logger.debug(`Token validated successfully for user: ${user.email}`);

      const userObject = {
        userId: user.id,
        email: user.email,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
      };

      console.log('🔍 JWT Strategy - Returning user object:', JSON.stringify(userObject, null, 2));
      console.log('🔍 JWT Strategy - user.id value:', user.id);
      console.log('🔍 JWT Strategy - userObject.userId value:', userObject.userId);

      return userObject;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.logger.warn(`Token validation failed: ${error.message}`);
        throw error;
      }

      this.logger.error('Unexpected error during token validation:', error.message);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
