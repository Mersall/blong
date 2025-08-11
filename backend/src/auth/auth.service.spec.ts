import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppConfigService } from '../config/config.service';
import { 
  createMockPrismaService, 
  createMockJwtService,
  createTestUser
} from '../test/test-utils';

// Mock bcrypt
jest.mock('bcryptjs');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: any;

  const mockUser = createTestUser();

  const mockRegisterDto = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
    phone: '+1234567890',
  };

  beforeEach(async () => {
    const mockPrismaServiceInstance = createMockPrismaService();
    const mockJwtServiceInstance = createMockJwtService();
    const mockConfigServiceInstance = {
      jwtSecret: 'test-secret',
      jwtRefreshSecret: 'test-refresh-secret',
      jwtExpiresIn: '15m',
      jwtRefreshExpiresIn: '7d',
      maxLoginAttempts: 5,
      lockoutTimeMinutes: 15,
      smtpHost: null,
      smtpUser: null,
      smtpPass: null,
      smtpPort: 587,
      frontendUrl: 'http://localhost:3000',
      fromEmail: 'noreply@blong.app',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaServiceInstance,
        },
        {
          provide: JwtService,
          useValue: mockJwtServiceInstance,
        },
        {
          provide: AppConfigService,
          useValue: mockConfigServiceInstance,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('$2a$12$hashedpassword' as never);
      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        password: undefined,
      });
      jwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');

      // Act
      const result = await service.register(mockRegisterDto, '127.0.0.1', 'test-agent');

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterDto.email },
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 12);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'access_token');
      expect(result).toHaveProperty('refreshToken', 'refresh_token');
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(mockRegisterDto, '127.0.0.1', 'test-agent')).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterDto.email },
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      jwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');

      // Act
      const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        select: expect.any(Object),
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
      expect(result).toHaveProperty('accessToken', 'access_token');
      expect(result).toHaveProperty('refreshToken', 'refresh_token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto, '127.0.0.1', 'test-agent')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.login(loginDto, '127.0.0.1', 'test-agent')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token with valid refresh token', async () => {
      // Arrange
      const refreshToken = 'valid_refresh_token';
      jwtService.verify.mockReturnValue({ sub: '1' });
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce('new_access_token')
        .mockResolvedValueOnce('new_refresh_token');

      // Act
      const result = await service.refreshToken(refreshToken);

      // Assert
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toHaveProperty('accessToken', 'new_access_token');
      expect(result).toHaveProperty('refreshToken', 'new_refresh_token');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      // Arrange
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(service.refreshToken('invalid_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user successfully', async () => {
      // Arrange
      const userId = '1';
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.getCurrentUser(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getCurrentUser('999')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user data for valid user ID', async () => {
      // Arrange
      const userId = '1';
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isVerified: false,
        verificationStatus: 'PENDING',
      };
      prismaService.user.findUnique.mockResolvedValue(expectedUser);

      // Act
      const result = await service.validateUser(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.any(Object),
      });
      expect(result).toEqual(expectedUser);
    });
  });
});