import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SafetyService } from './safety.service';
import { CreateSafetyReportDto, CreateUserBlockDto, CreateVerificationRequestDto, CreateSafetyCheckInDto, CreateEmergencyContactDto } from './dto/safety.dto';

@Controller('safety')
@ApiTags('Safety & Security')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  // ============================================================================
  // SAFETY REPORTS
  // ============================================================================

  @Post('reports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Submit safety report', 
    description: 'Report inappropriate behavior, fake profiles, harassment, or other safety concerns' 
  })
  @ApiResponse({ status: 201, description: 'Safety report submitted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid report data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Cannot report yourself or duplicate recent report' })
  @ApiBody({ type: CreateSafetyReportDto })
  async createSafetyReport(
    @Body(ValidationPipe) createReportDto: CreateSafetyReportDto,
    @Request() req: any,
  ) {
    return this.safetyService.createSafetyReport({
      ...createReportDto,
      reporterId: req.user.userId,
    });
  }

  @Get('reports')
  @ApiOperation({ 
    summary: 'Get user safety reports', 
    description: 'Retrieve safety reports made by or received by the user' 
  })
  @ApiResponse({ status: 200, description: 'Safety reports retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiQuery({ name: 'type', enum: ['made', 'received'], required: false, description: 'Type of reports to retrieve' })
  async getUserSafetyReports(
    @Request() req: any,
    @Query('type') type: 'made' | 'received' = 'made',
  ) {
    return this.safetyService.getUserSafetyReports(req.user.id, type);
  }

  @Get('reports/options')
  @ApiOperation({ 
    summary: 'Get safety reporting options', 
    description: 'Get available categories and subcategories for safety reports' 
  })
  @ApiResponse({ status: 200, description: 'Safety reporting options retrieved successfully' })
  async getSafetyReportingOptions() {
    return this.safetyService.getSafetyReportingOptions();
  }

  // ============================================================================
  // USER BLOCKING
  // ============================================================================

  @Post('block')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Block user', 
    description: 'Block another user to prevent them from contacting you' 
  })
  @ApiResponse({ status: 201, description: 'User blocked successfully' })
  @ApiBadRequestResponse({ description: 'Invalid block data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Cannot block yourself' })
  @ApiBody({ type: CreateUserBlockDto })
  async blockUser(
    @Body(ValidationPipe) createBlockDto: CreateUserBlockDto,
    @Request() req: any,
  ) {
    return this.safetyService.blockUser({
      ...createBlockDto,
      blockingUserId: req.user.userId,
    });
  }

  @Delete('block/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Unblock user', 
    description: 'Remove block on a previously blocked user' 
  })
  @ApiResponse({ status: 200, description: 'User unblocked successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Block not found' })
  @ApiParam({ name: 'userId', description: 'ID of the user to unblock' })
  async unblockUser(
    @Param('userId') blockedUserId: string,
    @Request() req: any,
  ) {
    return this.safetyService.unblockUser(req.user.id, blockedUserId);
  }

  @Get('blocked-users')
  @ApiOperation({ 
    summary: 'Get blocked users', 
    description: 'Retrieve list of users blocked by the current user' 
  })
  @ApiResponse({ status: 200, description: 'Blocked users retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getBlockedUsers(@Request() req: any) {
    return this.safetyService.getBlockedUsers(req.user.id);
  }

  // ============================================================================
  // VERIFICATION REQUESTS
  // ============================================================================

  @Post('verification')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Submit verification request', 
    description: 'Request photo, identity, or other verification types' 
  })
  @ApiResponse({ status: 201, description: 'Verification request submitted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid verification data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBody({ type: CreateVerificationRequestDto })
  async createVerificationRequest(
    @Body(ValidationPipe) createVerificationDto: CreateVerificationRequestDto,
    @Request() req: any,
  ) {
    return this.safetyService.createVerificationRequest({
      ...createVerificationDto,
      userId: req.user.userId,
    });
  }

  @Get('verification')
  @ApiOperation({ 
    summary: 'Get verification requests', 
    description: 'Retrieve verification requests for the current user' 
  })
  @ApiResponse({ status: 200, description: 'Verification requests retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getUserVerificationRequests(@Request() req: any) {
    return this.safetyService.getUserVerificationRequests(req.user.id);
  }

  @Get('verification/status')
  @ApiOperation({ 
    summary: 'Get verification status', 
    description: 'Get current verification status and level for the user' 
  })
  @ApiResponse({ status: 200, description: 'Verification status retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getVerificationStatus(@Request() req: any) {
    return this.safetyService.getVerificationStatus(req.user.id);
  }

  // ============================================================================
  // SAFETY CHECK-INS
  // ============================================================================

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create safety check-in', 
    description: 'Check in for safety during dates or meetings' 
  })
  @ApiResponse({ status: 201, description: 'Safety check-in created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid check-in data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBody({ type: CreateSafetyCheckInDto })
  async createSafetyCheckIn(
    @Body(ValidationPipe) createCheckInDto: CreateSafetyCheckInDto,
    @Request() req: any,
  ) {
    return this.safetyService.createSafetyCheckIn({
      ...createCheckInDto,
      userId: req.user.userId,
    });
  }

  @Get('check-ins')
  @ApiOperation({ 
    summary: 'Get safety check-ins', 
    description: 'Retrieve safety check-ins for the current user' 
  })
  @ApiResponse({ status: 200, description: 'Safety check-ins retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getUserSafetyCheckIns(@Request() req: any) {
    return this.safetyService.getUserSafetyCheckIns(req.user.id);
  }

  // ============================================================================
  // EMERGENCY CONTACTS
  // ============================================================================

  @Post('emergency-contacts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Add emergency contact', 
    description: 'Add an emergency contact for safety purposes' 
  })
  @ApiResponse({ status: 201, description: 'Emergency contact added successfully' })
  @ApiBadRequestResponse({ description: 'Invalid contact data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBody({ type: CreateEmergencyContactDto })
  async addEmergencyContact(
    @Body(ValidationPipe) createContactDto: CreateEmergencyContactDto,
    @Request() req: any,
  ) {
    return this.safetyService.addEmergencyContact({
      ...createContactDto,
      userId: req.user.id,
    });
  }

  @Get('emergency-contacts')
  @ApiOperation({ 
    summary: 'Get emergency contacts', 
    description: 'Retrieve emergency contacts for the current user' 
  })
  @ApiResponse({ status: 200, description: 'Emergency contacts retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  async getEmergencyContacts(@Request() req: any) {
    return this.safetyService.getEmergencyContacts(req.user.id);
  }

  @Delete('emergency-contacts/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Remove emergency contact', 
    description: 'Remove an emergency contact' 
  })
  @ApiResponse({ status: 200, description: 'Emergency contact removed successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Emergency contact not found' })
  @ApiParam({ name: 'contactId', description: 'ID of the emergency contact to remove' })
  async removeEmergencyContact(
    @Param('contactId') contactId: string,
    @Request() req: any,
  ) {
    return this.safetyService.removeEmergencyContact(req.user.id, contactId);
  }

  // ============================================================================
  // SAFETY RESOURCES
  // ============================================================================

  @Get('resources')
  @ApiOperation({ 
    summary: 'Get safety resources', 
    description: 'Get safety tips, emergency numbers, and support resources' 
  })
  @ApiResponse({ status: 200, description: 'Safety resources retrieved successfully' })
  async getSafetyResources(@Request() req: any) {
    const userId = req.user?.id;
    return this.safetyService.getSafetyResources(userId);
  }
}
