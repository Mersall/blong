import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DateDeliveryService } from './date-delivery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentDto, ConfirmPaymentDto } from './dto/payments.dto';
import { AppConfigService } from '../config/config.service';


@ApiTags('Date Delivery')
@Controller('date-delivery')
@UseGuards(JwtAuthGuard)
export class DateDeliveryController {
  constructor(
    private readonly dateDeliveryService: DateDeliveryService,
    private readonly config: AppConfigService,
  ) {}

  @Get('dates')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user delivered dates', description: 'Retrieve all dates delivered to the user' })
  @ApiResponse({ status: 200, description: 'Dates retrieved successfully' })
  async getUserDates(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.dateDeliveryService.getUserDates(req.user.userId, page, limit);
  }

  @Get('dates/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get specific date details', description: 'Retrieve details for a specific delivered date' })
  @ApiResponse({ status: 200, description: 'Date details retrieved successfully' })
  async getDateById(
    @Request() req: any,
    @Param('id') dateId: string,
  ) {
    return this.dateDeliveryService.getDateById(req.user.id, dateId);
  }

  @Post('dates/interest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Express interest in a date', description: 'Express interest or decline a delivered date' })
  @ApiResponse({ status: 200, description: 'Interest expressed successfully' })
  async expressInterest(
    @Request() req: any,
    @Body(ValidationPipe) interestData: any,
  ) {
    return this.dateDeliveryService.expressInterest(req.user.id, interestData);
  }

  @Post('dates/feedback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit date feedback', description: 'Submit feedback after a date' })
  @ApiResponse({ status: 200, description: 'Feedback submitted successfully' })
  async submitFeedback(
    @Request() req: any,
    @Body(ValidationPipe) feedbackData: any,
  ) {
    return this.dateDeliveryService.submitFeedback(req.user.id, feedbackData);
  }

  @Get('matches')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get potential matches', description: 'Get AI-generated potential matches for the user' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  async getPotentialMatches(
    @Request() req: any,
    @Query('limit') limit: number = 5,
  ) {
    return this.dateDeliveryService.getPotentialMatches(req.user.id, limit);
  }

  @Post('dates/payment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create payment intent for delivered date', description: 'Initiate payment for a delivered date' })
  @ApiResponse({ status: 201, description: 'Payment initiated successfully' })
  async createPayment(
    @Request() req: any,
    @Body(ValidationPipe) createDto: CreatePaymentDto,
  ) {
    if (!this.config.paymentsEnabled) {
      return { statusCode: 501, message: 'Payments are disabled' };
    }
    return this.dateDeliveryService.createPayment(req.user.id, createDto);
  }

  @Put('dates/payment/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm payment for delivered date', description: 'Confirm a payment intent and mark as completed' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  async confirmPayment(
    @Request() req: any,
    @Body(ValidationPipe) confirmDto: ConfirmPaymentDto,
  ) {
    if (!this.config.paymentsEnabled) {
      return { statusCode: 501, message: 'Payments are disabled' };
    }
    return this.dateDeliveryService.confirmPayment(req.user.id, confirmDto);
  }



  @Post('matches/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate new matches', description: 'Trigger AI to generate new matches for the user' })
  @ApiResponse({ status: 200, description: 'Match generation initiated successfully' })
  async generateMatches(
    @Request() req: any,
  ) {
    return this.dateDeliveryService.generateMatches(req.user.id);
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get dating statistics', description: 'Get user dating statistics and insights' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getDatingStatistics(
    @Request() req: any,
  ) {
    return this.dateDeliveryService.getDatingStatistics(req.user.id);
  }
}
