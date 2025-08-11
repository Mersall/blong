import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AllowUnverified } from '../auth/allow-unverified.decorator';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get user profile
   * GET /api/profile
   */
  @Get()
  @AllowUnverified()
  async getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.userId);
  }

  /**
   * Update user profile
   * PUT /api/profile
   */
  @Put()
  @AllowUnverified()
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req: any,
    @Body(ValidationPipe) profileData: any,
  ) {
    return this.profileService.updateProfile(req.user.userId, profileData);
  }

  /**
   * Complete user profile (alias for update)
   * PUT /api/profile/complete
   */
  @Put('complete')
  @AllowUnverified()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete user profile' })
  @ApiResponse({ status: 200, description: 'Profile completed successfully' })
  async completeProfile(
    @Request() req: any,
    @Body(ValidationPipe) profileData: any,
  ) {
    return this.profileService.updateProfile(req.user.userId, profileData);
  }

  /**
   * Get user preferences
   * GET /api/profile/preferences
   */
  @Get('preferences')
  async getPreferences(@Request() req: any) {
    return this.profileService.getPreferences(req.user.userId);
  }

  /**
   * Update user preferences
   * PUT /api/profile/preferences
   */
  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @Request() req: any,
    @Body(ValidationPipe) preferencesData: any,
  ) {
    return this.profileService.updatePreferences(req.user.userId, preferencesData);
  }

  /**
   * Upload profile photo
   * POST /api/profile/photos
   */
  @Post('photos')
  @HttpCode(HttpStatus.CREATED)
  async uploadPhoto(
    @Request() req: any,
    @Body() photoData: { url: string; isPrimary?: boolean },
  ) {
    return this.profileService.uploadPhoto(req.user.userId, photoData);
  }

  /**
   * Get user photos
   * GET /api/profile/photos
   */
  @Get('photos')
  async getPhotos(@Request() req: any) {
    return this.profileService.getPhotos(req.user.userId);
  }

  /**
   * Delete photo
   * DELETE /api/profile/photos/:photoId
   */
  @Delete('photos/:photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePhoto(
    @Request() req: any,
    @Param('photoId') photoId: string,
  ) {
    return this.profileService.deletePhoto(req.user.userId, photoId);
  }

  /**
   * Set primary photo
   * PUT /api/profile/photos/:photoId/primary
   */
  @Put('photos/:photoId/primary')
  @HttpCode(HttpStatus.OK)
  async setPrimaryPhoto(
    @Request() req: any,
    @Param('photoId') photoId: string,
  ) {
    return this.profileService.setPrimaryPhoto(req.user.userId, photoId);
  }

  /**
   * Get profile completion status
   * GET /api/profile/completion-status
   */
  @Get('completion-status')
  @AllowUnverified()
  async getCompletionStatus(@Request() req: any) {
    return this.profileService.getCompletionStatus(req.user.userId);
  }

  /**
   * Get user analytics
   * GET /api/profile/analytics
   */
  @Get('analytics')
  @ApiOperation({
    summary: 'Get user analytics',
    description: 'Retrieve user analytics data including profile views, matches, and activity'
  })
  @ApiResponse({
    status: 200,
    description: 'User analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            profileViews: { type: 'number' },
            matches: { type: 'number' },
            messages: { type: 'number' },
            dates: { type: 'number' },
            completionRate: { type: 'number' },
            lastActive: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async getUserAnalytics(@Request() req: any) {
    return this.profileService.getUserAnalytics(req.user.userId);
  }

  /**
   * Update user relationship phase
   * PUT /api/profile/phase
   */
  @Put('phase')
  @ApiOperation({
    summary: 'Update user relationship phase',
    description: 'Update the user\'s current relationship phase'
  })
  @ApiResponse({ status: 200, description: 'User phase updated successfully' })
  async updateUserPhase(
    @Request() req: any,
    @Body() updatePhaseDto: { phase: string },
  ) {
    return this.profileService.updateUserPhase(req.user.userId, updatePhaseDto.phase);
  }

  /**
   * Update user preferred language
   * PUT /api/profile/language
   */
  @Put('language')
  @ApiOperation({
    summary: 'Update user preferred language',
    description: 'Update the user\'s preferred language setting'
  })
  @ApiResponse({ status: 200, description: 'User language updated successfully' })
  async updateUserLanguage(
    @Request() req: any,
    @Body() updateLanguageDto: { language: string },
  ) {
    return this.profileService.updateUserLanguage(req.user.userId, updateLanguageDto.language);
  }
}
