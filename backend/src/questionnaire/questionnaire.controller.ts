import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { QuestionnaireService } from './questionnaire.service';

@Controller('questionnaire')
@ApiTags('Questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Get(':phase')
  @ApiOperation({ 
    summary: 'Get questionnaire for relationship phase',
    description: 'Retrieve questionnaire questions for a specific relationship phase'
  })
  @ApiParam({ 
    name: 'phase', 
    description: 'Relationship phase',
    enum: ['single', 'preparing', 'engaged']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Questionnaire retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            phase: { type: 'string' },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  questions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        text: { type: 'string' },
                        type: { type: 'string' },
                        options: { type: 'array' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async getQuestionnaire(@Param('phase') phase: string) {
    return this.questionnaireService.getQuestionnaireByPhase(phase);
  }

  @Get(':phase/answers')
  @ApiOperation({ 
    summary: 'Get user questionnaire answers',
    description: 'Retrieve user\'s answers for a specific questionnaire phase'
  })
  @ApiParam({ 
    name: 'phase', 
    description: 'Relationship phase',
    enum: ['single', 'preparing', 'engaged']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Questionnaire answers retrieved successfully'
  })
  async getQuestionnaireAnswers(
    @Param('phase') phase: string,
    @Request() req: any,
  ) {
    return this.questionnaireService.getUserAnswers(req.user.id, phase);
  }

  @Post(':phase/answers')
  @ApiOperation({ 
    summary: 'Save questionnaire answers',
    description: 'Save user\'s answers for a specific questionnaire phase'
  })
  @ApiParam({ 
    name: 'phase', 
    description: 'Relationship phase',
    enum: ['single', 'preparing', 'engaged']
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Questionnaire answers saved successfully'
  })
  async saveQuestionnaireAnswers(
    @Param('phase') phase: string,
    @Body() answersDto: { answers: Record<string, any> },
    @Request() req: any,
  ) {
    return this.questionnaireService.saveUserAnswers(
      req.user.userId,
      phase,
      answersDto.answers
    );
  }
}
