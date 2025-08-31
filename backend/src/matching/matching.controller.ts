import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards, Request, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchingService } from './matching.service';

@ApiTags('Matches')
@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get matches for user', description: 'Fetch paginated matches with compatibility score >= 75' })
  @ApiResponse({ status: 200, description: 'Matches retrieved' })
  async getMatches(@Request() req: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.matchingService.getMatches(req.user.id, { page: Number(page), limit: Number(limit) });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get match by id', description: 'Fetch a specific match with score breakdown' })
  @ApiResponse({ status: 200, description: 'Match retrieved' })
  async getMatch(@Request() req: any, @Param('id') id: string) {
    return this.matchingService.getMatchById(req.user.id, id);
  }
}

