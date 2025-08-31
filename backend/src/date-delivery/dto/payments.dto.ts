import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Delivered date identifier', example: 'deliv_123' })
  @IsString()
  @IsNotEmpty()
  deliveredDateId: string;

  @ApiProperty({ description: 'Payment amount (in major currency units)', example: 49.99 })
  @IsNumber()
  @Min(0.5)
  amount: number;

  @ApiProperty({ description: 'ISO currency code', example: 'USD', required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'Delivered date identifier to confirm payment for', example: 'deliv_123' })
  @IsString()
  @IsNotEmpty()
  deliveredDateId: string;

  @ApiProperty({ description: 'Payment intent identifier from provider (if applicable)', example: 'pi_abc123', required: false })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}

