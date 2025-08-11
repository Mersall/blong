import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsBoolean, IsInt, IsObject, IsPhoneNumber, IsEmail, Min, Max, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SafetyReportCategory, SafetyReportSeverity, UserBlockReason, VerificationType, SafetyCheckInStatus } from '@prisma/client';

// ============================================================================
// SAFETY REPORT DTOs
// ============================================================================

export class CreateSafetyReportDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the user being reported' })
  reportedUserId: string;

  @IsEnum(SafetyReportCategory)
  @ApiProperty({ 
    enum: SafetyReportCategory, 
    description: 'Category of the safety report',
    example: SafetyReportCategory.HARASSMENT 
  })
  category: SafetyReportCategory;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Subcategory for more specific classification' })
  subcategory?: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  @ApiProperty({ 
    description: 'Detailed description of the incident',
    minLength: 10,
    maxLength: 1000 
  })
  description: string;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ 
    description: 'Evidence such as screenshot URLs or other supporting data',
    example: { screenshots: ['url1', 'url2'], messages: ['message1'] }
  })
  evidence?: any;

  @IsOptional()
  @IsEnum(SafetyReportSeverity)
  @ApiPropertyOptional({ 
    enum: SafetyReportSeverity, 
    description: 'Severity level of the report',
    default: SafetyReportSeverity.MEDIUM 
  })
  severity?: SafetyReportSeverity;
}

// ============================================================================
// USER BLOCK DTOs
// ============================================================================

export class CreateUserBlockDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the user to block' })
  blockedUserId: string;

  @IsOptional()
  @IsEnum(UserBlockReason)
  @ApiPropertyOptional({ 
    enum: UserBlockReason, 
    description: 'Reason for blocking the user' 
  })
  reason?: UserBlockReason;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  @ApiPropertyOptional({ 
    description: 'Additional description for the block',
    maxLength: 500 
  })
  description?: string;
}

// ============================================================================
// VERIFICATION REQUEST DTOs
// ============================================================================

export class CreateVerificationRequestDto {
  @IsEnum(VerificationType)
  @ApiProperty({ 
    enum: VerificationType, 
    description: 'Type of verification being requested',
    example: VerificationType.PHOTO 
  })
  verificationType: VerificationType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Type of document for identity verification',
    example: 'passport' 
  })
  documentType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ 
    description: 'URLs to document images',
    type: [String] 
  })
  documentImages?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'URL to selfie verification image' })
  selfieImage?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'URL to live photo verification image' })
  livePhotoImage?: string;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ 
    description: 'Additional metadata for verification',
    example: { deviceInfo: 'iPhone 12', location: { lat: 40.7128, lng: -74.0060 } }
  })
  metadata?: any;
}

// ============================================================================
// SAFETY CHECK-IN DTOs
// ============================================================================

export class CreateSafetyCheckInDto {
  @IsOptional()
  @IsEnum(SafetyCheckInStatus)
  @ApiPropertyOptional({ 
    enum: SafetyCheckInStatus, 
    description: 'Status of the safety check-in',
    default: SafetyCheckInStatus.SAFE 
  })
  status?: SafetyCheckInStatus;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ 
    description: 'Location information',
    example: { latitude: 40.7128, longitude: -74.0060, address: '123 Main St, New York, NY' }
  })
  location?: any;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(480)
  @ApiPropertyOptional({ 
    description: 'Planned duration in minutes',
    minimum: 15,
    maximum: 480 
  })
  plannedDuration?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  @ApiPropertyOptional({ 
    description: 'Additional notes for the check-in',
    maxLength: 500 
  })
  notes?: string;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ 
    description: 'Additional metadata',
    example: { dateId: 'date123', venueType: 'restaurant' }
  })
  metadata?: any;
}

// ============================================================================
// EMERGENCY CONTACT DTOs
// ============================================================================

export class CreateEmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty({ 
    description: 'Name of the emergency contact',
    minLength: 2,
    maxLength: 100 
  })
  name: string;

  @IsPhoneNumber()
  @ApiProperty({ 
    description: 'Phone number of the emergency contact',
    example: '+1234567890' 
  })
  phoneNumber: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ 
    description: 'Email address of the emergency contact',
    example: 'contact@example.com' 
  })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({ 
    description: 'Relationship to the emergency contact',
    example: 'friend',
    minLength: 2,
    maxLength: 50 
  })
  relationship: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ 
    description: 'Whether this is the primary emergency contact',
    default: false 
  })
  isPrimary?: boolean;
}

// ============================================================================
// UPDATE DTOs
// ============================================================================

export class UpdateEmergencyContactDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @ApiPropertyOptional({ 
    description: 'Name of the emergency contact',
    minLength: 2,
    maxLength: 100 
  })
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional({ 
    description: 'Phone number of the emergency contact',
    example: '+1234567890' 
  })
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ 
    description: 'Email address of the emergency contact',
    example: 'contact@example.com' 
  })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  @ApiPropertyOptional({ 
    description: 'Relationship to the emergency contact',
    example: 'friend',
    minLength: 2,
    maxLength: 50 
  })
  relationship?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ 
    description: 'Whether this is the primary emergency contact',
    default: false 
  })
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ 
    description: 'Whether this contact is active',
    default: true 
  })
  isActive?: boolean;
}
