import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { HealthModule } from './common/health/health.module';
import { ArticlesModule } from './articles/articles.module';
import { SafetyModule } from './safety/safety.module';
import { SystemModule } from './system/system.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { QuizModule } from './quiz/quiz.module';
import { DateDeliveryModule } from './date-delivery/date-delivery.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    ProfileModule,
    HealthModule,
    ArticlesModule,
    SafetyModule,
    SystemModule,
    QuestionnaireModule,
    QuizModule,
    DateDeliveryModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
