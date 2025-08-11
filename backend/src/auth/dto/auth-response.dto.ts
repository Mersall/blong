import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'uuid-string-here',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-15T00:00:00.000Z',
  })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'User gender',
    example: 'MALE',
    enum: ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'],
  })
  gender: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  phone?: string | null;

  @ApiProperty({
    description: 'Whether user email is verified',
    example: false,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'User verification status',
    example: 'PENDING',
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
  })
  verificationStatus: string;

  @ApiProperty({
    description: 'User relationship status',
    example: 'SINGLE',
    enum: ['SINGLE', 'DIVORCED', 'WIDOWED'],
  })
  relationshipStatus: string;

  @ApiProperty({
    description: 'User account creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Success message',
    example: 'Registration successful. Please check your email to verify your account.',
    required: false,
  })
  message?: string;
}

export class TokenResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'New JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}