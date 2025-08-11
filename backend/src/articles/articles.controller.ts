import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get articles with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async getArticles(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('language') language = 'en',
  ) {
    return this.articlesService.findMany({
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      category,
      search,
      language,
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get article categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories(@Query('language') language = 'en') {
    return this.articlesService.getCategories(language);
  }

  @Get('user/bookmarks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user bookmarked articles' })
  @ApiResponse({ status: 200, description: 'Bookmarks retrieved successfully' })
  async getUserBookmarks(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.articlesService.getUserBookmarks(req.user.userId, {
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
    });
  }

  @Get('user/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user reading history' })
  @ApiResponse({ status: 200, description: 'Reading history retrieved successfully' })
  async getUserReadingHistory(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.articlesService.getUserReadingHistory(req.user.userId, {
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
    });
  }

  @Get('user/recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recommended articles for user' })
  @ApiResponse({ status: 200, description: 'Recommended articles retrieved successfully' })
  async getRecommendedArticles(
    @Request() req,
    @Query('limit') limit = 5,
  ) {
    return this.articlesService.getRecommendedArticles(
      req.user.userId,
      parseInt(limit.toString()),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async getArticleById(
    @Param('id') id: string,
    @Query('language') language = 'en',
  ) {
    return this.articlesService.findById(id, language);
  }

  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bookmark an article' })
  @ApiResponse({ status: 200, description: 'Article bookmarked successfully' })
  async bookmarkArticle(@Request() req, @Param('id') id: string) {
    return this.articlesService.bookmarkArticle(req.user.userId, id);
  }

  @Delete(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove bookmark from article' })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully' })
  async removeBookmark(@Request() req, @Param('id') id: string) {
    return this.articlesService.removeBookmark(req.user.userId, id);
  }

  @Post(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark article as read' })
  @ApiResponse({ status: 200, description: 'Article marked as read successfully' })
  async markAsRead(@Request() req, @Param('id') id: string) {
    console.log('🔍 markAsRead - Full req.user object:', JSON.stringify(req.user, null, 2));
    console.log('🔍 markAsRead - req.user.userId:', req.user?.userId);
    console.log('🔍 markAsRead - req.user.id:', req.user?.id);
    console.log('🔍 markAsRead - articleId:', id);

    if (!req.user?.userId) {
      console.error('❌ No userId found in req.user object');
      throw new Error('User ID not found in request');
    }

    return this.articlesService.markAsRead(req.user.userId, id);
  }
}