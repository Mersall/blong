import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { 
  createMockPrismaService, 
  createTestUser, 
  createTestUserProfile,
  User,
  UserProfile
} from '../test/test-utils';

describe('ProfileService', () => {
  let service: ProfileService;
  let prismaService: any;

  const mockUser = createTestUser();
  const mockProfile = createTestUserProfile();

  const mockPhoto = {
    id: 'photo1',
    userId: '1',
    url: 'https://example.com/photo.jpg',
    isPrimary: false,
    order: 0,
    createdAt: new Date(),
  };

  const mockPreferences = {
    id: 'pref1',
    userId: '1',
    minAge: 25,
    maxAge: 35,
    maxDistance: 50,
    education: ['Bachelor'],
    occupation: ['Engineer'],
    interests: ['Travel', 'Reading'],
    dealBreakers: ['Smoking'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaServiceInstance = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaServiceInstance,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.getProfile('1');

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.objectContaining({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        }),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getProfile('999')).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
        select: expect.any(Object),
      });
    });
  });

  describe('updateProfile', () => {
    const updateDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Updated bio',
    };

    it('should update user profile successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...updateDto };
      
      prismaService.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.updateProfile('1', updateDto);

      // Assert
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          firstName: updateDto.firstName,
          lastName: updateDto.lastName,
        }),
        select: expect.any(Object),
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      // Arrange
      prismaService.user.update.mockRejectedValue(new Error('User not found'));

      // Act & Assert
      await expect(service.updateProfile('999', updateDto)).rejects.toThrow();
    });
  });

  describe('getPreferences', () => {
    it('should return user preferences successfully', async () => {
      // Arrange
      prismaService.userPreferences.findUnique.mockResolvedValue(mockPreferences);

      // Act
      const result = await service.getPreferences('1');

      // Assert
      expect(prismaService.userPreferences.findUnique).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
      expect(result).toEqual(mockPreferences);
    });

    it('should return default preferences if not found', async () => {
      // Arrange
      prismaService.userPreferences.findUnique.mockResolvedValue(null);

      // Act
      const result = await service.getPreferences('1');

      // Assert
      expect(result).toEqual({
        minAge: 18,
        maxAge: 80,
        maxDistance: 50,
        education: [],
        occupation: [],
        interests: [],
        dealBreakers: [],
      });
    });
  });

  describe('updatePreferences', () => {
    const preferencesDto = {
      minAge: 26,
      maxAge: 40,
      maxDistance: 60,
      education: ['Master'],
      interests: ['Sports', 'Music'],
    };

    it('should update user preferences successfully', async () => {
      // Arrange
      const updatedPreferences = {
        id: 'pref1',
        userId: '1',
        ...preferencesDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaService.userPreferences.upsert.mockResolvedValue(updatedPreferences);

      // Act
      const result = await service.updatePreferences('1', preferencesDto);

      // Assert
      expect(prismaService.userPreferences.upsert).toHaveBeenCalledWith({
        where: { userId: '1' },
        update: preferencesDto,
        create: {
          userId: '1',
          ...preferencesDto,
        },
      });
      expect(result).toEqual(updatedPreferences);
    });
  });

  describe('uploadPhoto', () => {
    const mockPhotoData = {
      url: 'https://example.com/photo.jpg',
      isPrimary: false,
    };

    it('should upload photo successfully', async () => {
      // Arrange  
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.photo.create.mockResolvedValue(mockPhoto);

      // Act
      const result = await service.uploadPhoto('1', mockPhotoData);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockPhoto);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.uploadPhoto('999', mockPhotoData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPhotos', () => {
    it('should return user photos', async () => {
      // Arrange
      const mockPhotos = [mockPhoto];
      prismaService.photo.findMany.mockResolvedValue(mockPhotos);

      // Act
      const result = await service.getPhotos('1');

      // Assert
      expect(prismaService.photo.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
        orderBy: { order: 'asc' },
      });
      expect(result).toEqual(mockPhotos);
    });
  });

  describe('deletePhoto', () => {
    it('should delete photo successfully', async () => {
      // Arrange
      prismaService.photo.findUnique.mockResolvedValue(mockPhoto);
      prismaService.photo.delete.mockResolvedValue(mockPhoto);

      // Act
      const result = await service.deletePhoto('1', 'photo1');

      // Assert
      expect(prismaService.photo.findUnique).toHaveBeenCalledWith({
        where: { 
          id: 'photo1',
          userId: '1',
        },
      });
      expect(prismaService.photo.delete).toHaveBeenCalledWith({
        where: { id: 'photo1' },
      });
      expect(result).toEqual({ message: 'Photo deleted successfully' });
    });

    it('should throw NotFoundException when photo not found', async () => {
      // Arrange
      prismaService.photo.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deletePhoto('1', 'photo999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('setPrimaryPhoto', () => {
    it('should set primary photo successfully', async () => {
      // Arrange
      prismaService.photo.findUnique.mockResolvedValue(mockPhoto);
      prismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(prismaService);
      });

      // Act
      const result = await service.setPrimaryPhoto('1', 'photo1');

      // Assert
      expect(prismaService.photo.findUnique).toHaveBeenCalledWith({
        where: { 
          id: 'photo1',
          userId: '1',
        },
      });
      expect(result).toEqual({ message: 'Primary photo updated successfully' });
    });

    it('should throw NotFoundException when photo not found', async () => {
      // Arrange
      prismaService.photo.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.setPrimaryPhoto('1', 'photo999')).rejects.toThrow(NotFoundException);
    });
  });
});