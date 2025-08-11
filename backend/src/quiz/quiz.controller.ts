import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quiz')
@ApiTags('Quiz & Personality Assessment')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('categories')
  @ApiOperation({ 
    summary: 'Get quiz categories',
    description: 'Retrieve all available quiz categories with questions'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz categories retrieved successfully'
  })
  async getQuizCategories() {
    return this.quizService.getQuizCategories();
  }

  @Get('category/:categoryKey')
  @ApiOperation({ 
    summary: 'Get questions by category',
    description: 'Retrieve quiz questions for a specific category'
  })
  @ApiParam({ 
    name: 'categoryKey', 
    description: 'Category key (e.g., big_five, love_languages)',
    example: 'big_five'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz questions retrieved successfully'
  })
  async getQuestionsByCategory(@Param('categoryKey') categoryKey: string) {
    return this.quizService.getQuestionsByCategory(categoryKey);
  }

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user quiz progress',
    description: 'Retrieve user\'s quiz completion progress across all categories'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz progress retrieved successfully'
  })
  async getQuizProgress(@Request() req: any) {
    return this.quizService.getUserQuizProgress(req.user.userId);
  }

  @Post('response')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Save quiz response',
    description: 'Save user\'s response to a quiz question'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Quiz response saved successfully'
  })
  async saveQuizResponse(
    @Body() responseDto: { questionId: string; selectedOptionId: string },
    @Request() req: any,
  ) {
    return this.quizService.saveQuizResponse(
      req.user.userId,
      responseDto.questionId,
      responseDto.selectedOptionId
    );
  }

  @Get('responses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user quiz responses',
    description: 'Retrieve all quiz responses for the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz responses retrieved successfully'
  })
  async getUserQuizResponses(@Request() req: any) {
    return this.quizService.getUserQuizResponses(req.user.userId);
  }

  @Get('personality-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get personality profile',
    description: 'Get calculated personality profile based on quiz responses'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Personality profile retrieved successfully'
  })
  async getPersonalityProfile(@Request() req: any) {
    return this.quizService.getPersonalityProfile(req.user.userId);
  }

  @Post('calculate-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Calculate personality profile',
    description: 'Calculate and save personality profile from quiz responses'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Personality profile calculated successfully'
  })
  async calculatePersonalityProfile(@Request() req: any) {
    return this.quizService.calculatePersonalityProfile(req.user.userId);
  }
}
