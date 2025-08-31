import { Module } from '@nestjs/common';
import { DateDeliveryController } from './date-delivery.controller';
import { DateDeliveryService } from './date-delivery.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AppConfigModule, PrismaModule],
  controllers: [DateDeliveryController],
  providers: [DateDeliveryService],
  exports: [DateDeliveryService],
})
export class DateDeliveryModule {}
