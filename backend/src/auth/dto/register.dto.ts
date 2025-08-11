import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsDateString, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 1,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-15',
    format: 'date',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description: 'User gender',
    example: 'MALE',
    enum: ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'],
  })
  @IsString()
  @IsIn(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'])
  gender: string;

  // phone field temporarily removed for testing
}