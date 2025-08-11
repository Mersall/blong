import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AppConfigService } from '../config/config.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: nodemailer.Transporter;
  private readonly refreshTokensMap = new Map<string, string>(); // In production, use Redis
  private readonly tokenBlacklist = new Set<string>(); // In production, use Redis with TTL
  private readonly deviceSessions = new Map<string, Set<string>>(); // Track active sessions per user

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {
    // Initialize email transporter
    this.initializeEmailTransporter();
    
    // Start cleanup tasks
    this.startCleanupTasks();
  }

  private initializeEmailTransporter() {
    if (this.configService.smtpHost && this.configService.smtpUser) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.smtpHost,
        port: this.configService.smtpPort,
        secure: false, // true for 465, false for other ports
        auth: {
          user: this.configService.smtpUser,
          pass: this.configService.smtpPass,
        },
      });
    }
  }

  /**
   * Start background cleanup tasks
   */
  private startCleanupTasks() {
    // Clean up expired tokens every hour
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60 * 60 * 1000); // 1 hour

    this.logger.log('Background cleanup tasks started');
  }

  /**
   * Clean up expired tokens and sessions
   */
  private cleanupExpiredTokens() {
    try {
      // In production, this would be handled by Redis TTL
      // For now, we'll keep this as a placeholder for the cleanup logic
      this.logger.debug('Cleaning up expired tokens and sessions');
      
      // Clear expired refresh tokens (simplified approach)
      const expiredTokens: string[] = [];
      for (const [token] of this.refreshTokensMap) {
        try {
          this.jwtService.verify(token, { secret: this.configService.jwtRefreshSecret });
        } catch {
          expiredTokens.push(token);
        }
      }
      
      expiredTokens.forEach(token => {
        this.refreshTokensMap.delete(token);
      });

      if (expiredTokens.length > 0) {
        this.logger.debug(`Cleaned up ${expiredTokens.length} expired refresh tokens`);
      }
    } catch (error) {
      this.logger.error('Error during token cleanup:', error);
    }
  }

  /**
   * Check if access token is blacklisted
   */
  private isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  /**
   * Add token to blacklist (for logout)
   */
  private blacklistToken(token: string) {
    this.tokenBlacklist.add(token);
    // In production, set TTL in Redis to automatically remove expired tokens
  }

  /**
   * Register new user with enhanced security
   */
  async register(registerDto: any, ipAddress?: string, userAgent?: string) {
    const { email, password, firstName, lastName, dateOfBirth, gender } =
      registerDto;

    try {
      // Enhanced input validation
      this.validateRegistrationInput(registerDto);

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        this.logger.warn(`Registration attempt with existing email: ${email} from IP: ${ipAddress}`);
        throw new ConflictException('A user with this email address already exists');
      }

      // Validate password strength
      this.validatePasswordStrength(password);

      // Hash password with configurable rounds
      const saltRounds = 10; // Fixed salt rounds for now
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          isVerified: true,
          verificationStatus: true,
          relationshipStatus: true,
          createdAt: true,
        },
      });

      // Generate tokens with device tracking
      const tokens = await this.generateTokensWithRotation(user.id);

      // Log successful registration
      this.logger.log(`New user registered: ${email} from IP: ${ipAddress}`);

      // Send verification email automatically
      try {
        await this.sendEmailVerification(user.id);
        this.logger.log(`Verification email sent to: ${email}`);
      } catch (error) {
        this.logger.warn(`Failed to send verification email to ${email}:`, error.message);
        // Don't fail registration if email sending fails
      }

      return {
        user,
        ...tokens,
        message: 'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      this.logger.error(`Registration failed for ${email} from IP: ${ipAddress}:`, error.message);
      throw error;
    }
  }

  /**
   * Login user with enhanced security measures
   */
  async login(loginDto: any, ipAddress: string, userAgent?: string) {
    const { email, password } = loginDto;

    try {
      // Input validation
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }

      // Check for account lockout
      await this.checkAccountLockout(email);

      // Find user with security fields
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          isVerified: true,
          verificationStatus: true,
          relationshipStatus: true,
          createdAt: true,
        },
      });

      if (!user) {
        // Increment failed attempts even for non-existent users to prevent user enumeration
        await this.handleFailedLogin(email, ipAddress);
        this.logger.warn(`Login attempt with non-existent email: ${email} from IP: ${ipAddress}`);
        throw new UnauthorizedException('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await this.handleFailedLogin(email, ipAddress);
        this.logger.warn(`Failed login attempt for ${email} from IP: ${ipAddress} - Invalid password`);
        throw new UnauthorizedException('Invalid email or password');
      }

      // Reset failed login attempts on successful login
      await this.resetFailedLoginAttempts(user.id);

      // Check if email is verified
      if (!user.isVerified) {
        this.logger.warn(`Login attempt with unverified email: ${email} from IP: ${ipAddress}`);
        throw new UnauthorizedException('Please verify your email address before logging in. Check your inbox for the verification link.');
      }

      // Remove sensitive fields from response
      const { password: _, ...userWithoutPassword } = user;

      // Generate tokens with rotation
      const tokens = await this.generateTokensWithRotation(user.id);

      // Track user session (simplified - in production use Redis)
      if (!this.deviceSessions.has(user.id)) {
        this.deviceSessions.set(user.id, new Set());
      }
      this.deviceSessions.get(user.id)?.add(tokens.refreshToken);

      // Log successful login
      this.logger.log(`Successful login for ${email} from IP: ${ipAddress}`);

      return {
        user: userWithoutPassword,
        ...tokens,
        message: 'Login successful',
      };
    } catch (error) {
      // Log failed login attempt
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        this.logger.warn(`Login failed for ${email} from IP: ${ipAddress}: ${error.message}`);
      } else {
        this.logger.error(`Login error for ${email} from IP: ${ipAddress}:`, error);
      }
      throw error;
    }
  }

  /**
   * Refresh access token with rotation
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.jwtRefreshSecret,
      });

      // Check if token is in our valid tokens map (in production, use Redis)
      const storedUserId = this.refreshTokensMap.get(refreshToken);
      if (!storedUserId || storedUserId !== payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, isVerified: true },
      });

      if (!user || !user.isVerified) {
        // Remove invalid token
        this.refreshTokensMap.delete(refreshToken);
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Remove old refresh token
      this.refreshTokensMap.delete(refreshToken);

      // Generate new tokens
      return this.generateTokensWithRotation(user.id);
    } catch (error) {
      // Clean up potentially compromised token
      this.refreshTokensMap.delete(refreshToken);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user and invalidate tokens
   */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Remove the refresh token from our store
      this.refreshTokensMap.delete(refreshToken);
    }

    // In production, you would also:
    // 1. Add access token to blacklist in Redis with TTL
    // 2. Clear session data
    // 3. Log security event

    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        profilePicture: true,
        isVerified: true,
        verificationStatus: true,
        relationshipStatus: true,
        createdAt: true,
        // profile: true,
        // preferences: true,
        // personalityProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Forgot password with secure token generation
   */
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists, but still return success
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token (in production, consider using Redis for better performance)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset email if transporter is configured
    if (this.transporter) {
      try {
        await this.sendPasswordResetEmail(user.email, user.firstName, resetToken);
      } catch (error) {
        console.error('Failed to send password reset email:', error);
        // Don't throw error to prevent information leakage
      }
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  /**
   * Reset password with token verification
   */
  async resetPassword(token: string, newPassword: string) {
    // Find user with valid reset token
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Validate password strength (basic validation)
    this.validatePasswordStrength(newPassword);

    // Hash new password
    const saltRounds = 10; // Fixed salt rounds for now
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        // Clear any existing login attempts
        loginAttempts: 0,
        lockoutUntil: null,
      },
    });

    return { message: 'Password reset successfully' };
  }

  /**
   * Generate JWT tokens with rotation support
   */
  private async generateTokensWithRotation(userId: string) {
    const payload = { sub: userId };

    // Add debugging for JWT configuration
    this.logger.debug(`JWT Config - ExpiresIn: ${this.configService.jwtExpiresIn}, Secret length: ${this.configService.jwtSecret.length}`);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.jwtExpiresIn,
        secret: this.configService.jwtSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.jwtRefreshExpiresIn,
        secret: this.configService.jwtRefreshSecret,
      }),
    ]);

    // Store refresh token for validation (in production, use Redis with TTL)
    this.refreshTokensMap.set(refreshToken, userId);

    // Convert JWT expiration time to seconds
    const expiresInSeconds = this.parseExpirationTime(this.configService.jwtExpiresIn);

    // Debug token generation
    this.logger.debug(`Generated token for user ${userId}, expires in ${expiresInSeconds} seconds`);

    return {
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
    };
  }

  /**
   * Parse JWT expiration time string to seconds
   */
  private parseExpirationTime(expiresIn: string): number {
    // Handle different formats: '2h', '120m', '7200s', '7200'
    const match = expiresIn.match(/^(\d+)([smhd]?)$/);
    if (!match) {
      console.warn(`Invalid JWT expiration format: ${expiresIn}, defaulting to 3600 seconds`);
      return 3600; // Default to 1 hour
    }

    const value = parseInt(match[1]);
    const unit = match[2] || 's'; // Default to seconds

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: return value; // Assume seconds if no unit
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  private async generateTokens(userId: string) {
    return this.generateTokensWithRotation(userId);
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, isVerified: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours

    // Store verification token
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    if (this.transporter) {
      try {
        await this.sendVerificationEmail(user.email, user.firstName, verificationToken);
      } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new BadRequestException('Failed to send verification email');
      }
    }

    return { message: 'Verification email sent successfully' };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Update user as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
        verificationStatus: 'VERIFIED',
      },
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Check account lockout status
   */
  private async checkAccountLockout(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { lockoutUntil: true },
    });

    if (user?.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (1000 * 60));
      throw new BadRequestException(
        `Account is locked due to too many failed login attempts. Try again in ${remainingTime} minutes.`
      );
    }
  }

  /**
   * Handle failed login attempts
   */
  private async handleFailedLogin(email: string, ipAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, loginAttempts: true },
    });

    if (user) {
      const attempts = (user.loginAttempts || 0) + 1;
      const maxAttempts = this.configService.maxLoginAttempts;

      if (attempts >= maxAttempts) {
        // Lock the account
        const lockoutTime = new Date(
          Date.now() + this.configService.lockoutTimeMinutes * 60 * 1000
        );
        
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: attempts,
            lockoutUntil: lockoutTime,
          },
        });

        throw new BadRequestException(
          `Account locked due to ${maxAttempts} failed login attempts. Try again in ${this.configService.lockoutTimeMinutes} minutes.`
        );
      } else {
        // Increment attempts
        await this.prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: attempts },
        });
      }
    }

    // Log failed attempt for monitoring
    console.log(`Failed login attempt for ${email} from IP: ${ipAddress}`);
  }

  /**
   * Reset failed login attempts
   */
  private async resetFailedLoginAttempts(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockoutUntil: null,
      },
    });
  }

  /**
   * Validate registration input
   */
  private validateRegistrationInput(registerDto: any) {
    const { email, password, firstName, lastName, dateOfBirth, gender } = registerDto;

    // Email validation
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Email is required and must be a valid string');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Please provide a valid email address');
    }

    if (email.length > 255) {
      throw new BadRequestException('Email address is too long');
    }

    // Name validation
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 1) {
      throw new BadRequestException('First name is required');
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 1) {
      throw new BadRequestException('Last name is required');
    }

    if (firstName.length > 50 || lastName.length > 50) {
      throw new BadRequestException('Names cannot exceed 50 characters');
    }

    // Password validation
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password is required');
    }

    // Date of birth validation
    if (!dateOfBirth) {
      throw new BadRequestException('Date of birth is required');
    }

    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException('Please provide a valid date of birth');
    }

    // Check if user is at least 18 years old
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0) || 
        (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      throw new BadRequestException('You must be at least 18 years old to register');
    }

    // Gender validation
    if (!gender || !['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'].includes(gender)) {
      throw new BadRequestException('Please select a valid gender option');
    }
  }

  /**
   * Enhanced password strength validation
   */
  private validatePasswordStrength(password: string) {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password cannot exceed 128 characters');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&=#])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&=#)');
    }

    // Check for common weak patterns
    const commonPasswords = [
      'password', '123456', 'qwerty', 'abc123', 'letmein', 
      'welcome', 'monkey', '1234567890', 'password123'
    ];

    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      errors.push('Password contains common words or patterns. Please choose a more secure password');
    }

    // Check for repeated characters
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain more than 2 consecutive identical characters');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Password validation failed: ${errors.join('. ')}`);
    }
  }

  /**
   * Send password reset email
   */
  private async sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
    const resetUrl = `${this.configService.frontendUrl}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: this.configService.fromEmail,
      to: email,
      subject: 'Password Reset - BLONG',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #e91e63;">Password Reset Request</h2>
          <p>Hello ${firstName},</p>
          <p>You requested a password reset for your BLONG account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #e91e63; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, please ignore this email. This link will expire in 1 hour.</p>
          <p>For security, this link can only be used once.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message from BLONG. Please do not reply to this email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send email verification
   */
  private async sendVerificationEmail(email: string, firstName: string, verificationToken: string) {
    const verificationUrl = `${this.configService.frontendUrl}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: this.configService.fromEmail,
      to: email,
      subject: 'Verify Your Email - BLONG',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #e91e63;">Welcome to BLONG!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for joining BLONG. To complete your registration and start your journey to finding meaningful connections, please verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #e91e63; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>If you didn't create an account with BLONG, please ignore this email.</p>
          <p>This verification link will expire in 24 hours.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message from BLONG. Please do not reply to this email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Validate user for JWT strategy
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        verificationStatus: true,
      },
    });

    return user;
  }
}
