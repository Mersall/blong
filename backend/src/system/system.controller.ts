import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SystemService } from './system.service';

@Controller('system')
@ApiTags('System Configuration')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('languages')
  @ApiOperation({ 
    summary: 'Get available languages',
    description: 'Retrieve list of supported languages for the application'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Languages retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'en' },
              name: { type: 'string', example: 'English' },
              nativeName: { type: 'string', example: 'English' },
              flag: { type: 'string', example: '🇺🇸' },
              isDefault: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  async getLanguages() {
    return this.systemService.getAvailableLanguages();
  }

  @Get('phases')
  @ApiOperation({ 
    summary: 'Get relationship phases',
    description: 'Retrieve available relationship phases for user selection'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Relationship phases retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'single' },
              name: { type: 'string', example: 'Singles Journey' },
              description: { type: 'string' },
              theme: { type: 'string' },
              colors: { type: 'array', items: { type: 'string' } },
              features: { type: 'array', items: { type: 'string' } },
              icon: { type: 'string', example: '🌸' },
            },
          },
        },
      },
    },
  })
  async getRelationshipPhases() {
    return this.systemService.getRelationshipPhases();
  }

  @Get('icebreakers')
  @ApiOperation({ 
    summary: 'Get ice breaker questions',
    description: 'Retrieve ice breaker questions for conversations'
  })
  @ApiQuery({ 
    name: 'language', 
    required: false, 
    description: 'Language code for localized questions',
    example: 'en'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ice breaker questions retrieved successfully'
  })
  async getIceBreakers(@Query('language') language = 'en') {
    return this.systemService.getIceBreakers(language);
  }

  @Get('date-activities')
  @ApiOperation({ 
    summary: 'Get date activity suggestions',
    description: 'Retrieve suggested date activities'
  })
  @ApiQuery({ 
    name: 'language', 
    required: false, 
    description: 'Language code for localized activities',
    example: 'en'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Date activities retrieved successfully'
  })
  async getDateActivities(@Query('language') language = 'en') {
    return this.systemService.getDateActivities(language);
  }
}
