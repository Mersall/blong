import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findMany(params: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
    language?: string;
  }) {
    const { page, limit, category, search, language = 'en' } = params;
    const skip = (page - 1) * limit;

    // Build where conditions
    const where: Prisma.articlesWhereInput = {
      status: 'PUBLISHED',
      publishedAt: { not: null },
    };

    // Category filter
    if (category) {
      where.article_categories = {
        some: {
          categories: {
            slug: category,
          },
        },
      };
    }

    // Search filter
    if (search) {
      where.article_translations = {
        some: {
          language,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { subtitle: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        },
      };
    }

    // Get articles with translations
    const [articles, total] = await Promise.all([
      this.prisma.articles.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          article_translations: {
            where: { language },
            take: 1,
          },
          article_categories: {
            include: {
              categories: {
                include: {
                  category_translations: {
                    where: { language },
                    take: 1,
                  },
                },
              },
            },
          },
          article_tags: {
            include: {
              tags: {
                include: {
                  tag_translations: {
                    where: { language },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.articles.count({ where }),
    ]);

    // Transform articles to include translation data
    const transformedArticles = articles.map((article) => {
      const translation = article.article_translations[0];
      const categories = article.article_categories.map((ac) => {
        const categoryTranslation = ac.categories.category_translations[0];
        return {
          id: ac.categories.id,
          slug: ac.categories.slug,
          name: categoryTranslation?.name || ac.categories.slug,
          description: categoryTranslation?.description,
          icon: ac.categories.icon,
          color: ac.categories.color,
        };
      });
      const tags = article.article_tags.map((at) => {
        const tagTranslation = at.tags.tag_translations[0];
        return {
          id: at.tags.id,
          slug: at.tags.slug,
          name: tagTranslation?.name || at.tags.slug,
          color: at.tags.color,
        };
      });

      return {
        id: article.id,
        slug: article.slug,
        title: translation?.title || 'Untitled',
        subtitle: translation?.subtitle,
        content: translation?.content,
        excerpt: translation?.excerpt,
        author: translation?.author || 'BLONG Expert',
        readTime: translation?.readTime || '5 min read',
        icon: translation?.icon || '📖',
        featured: article.featured,
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        publishedAt: article.publishedAt,
        category: categories[0]?.name || 'General',
        categories,
        tags: tags.map((tag) => tag.name),
        isBookmarked: false, // Will be set by user-specific queries
      };
    });

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      articles: transformedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    };
  }

  async findById(id: string, language = 'en') {
    const article = await this.prisma.articles.findUnique({
      where: { id },
      include: {
        article_translations: {
          where: { language },
          take: 1,
        },
        article_categories: {
          include: {
            categories: {
              include: {
                category_translations: {
                  where: { language },
                  take: 1,
                },
              },
            },
          },
        },
        article_tags: {
          include: {
            tags: {
              include: {
                tag_translations: {
                  where: { language },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!article || article.status !== 'PUBLISHED') {
      throw new NotFoundException('Article not found');
    }

    // Increment view count
    await this.prisma.articles.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const translation = article.article_translations[0];
    const categories = article.article_categories.map((ac) => {
      const categoryTranslation = ac.categories.category_translations[0];
      return {
        id: ac.categories.id,
        slug: ac.categories.slug,
        name: categoryTranslation?.name || ac.categories.slug,
        description: categoryTranslation?.description,
        icon: ac.categories.icon,
        color: ac.categories.color,
      };
    });
    const tags = article.article_tags.map((at) => {
      const tagTranslation = at.tags.tag_translations[0];
      return tagTranslation?.name || at.tags.slug;
    });

    return {
      article: {
        id: article.id,
        slug: article.slug,
        title: translation?.title || 'Untitled',
        subtitle: translation?.subtitle,
        content: translation?.content,
        excerpt: translation?.excerpt,
        author: translation?.author || 'BLONG Expert',
        readTime: translation?.readTime || '5 min read',
        icon: translation?.icon || '📖',
        featured: article.featured,
        viewCount: article.viewCount + 1,
        likeCount: article.likeCount,
        publishedAt: article.publishedAt,
        category: categories[0]?.name || 'General',
        categories,
        tags,
        isBookmarked: false, // Will be set by user-specific queries
      },
    };
  }

  async getCategories(language = 'en') {
    const categories = await this.prisma.categories.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        category_translations: {
          where: { language },
          take: 1,
        },
        _count: {
          select: {
            article_categories: {
              where: {
                articles: {
                  status: 'PUBLISHED',
                },
              },
            },
          },
        },
      },
    });

    return {
      categories: categories.map((category) => {
        const translation = category.category_translations[0];
        return {
          id: category.id,
          slug: category.slug,
          name: translation?.name || category.slug,
          description: translation?.description,
          icon: category.icon,
          color: category.color,
          articleCount: category._count.article_categories,
        };
      }),
    };
  }

  async getUserBookmarks(
    userId: string,
    params: { page: number; limit: number },
  ) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      this.prisma.article_bookmarks.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          articles: {
            include: {
              article_translations: {
                where: { language: 'en' },
                take: 1,
              },
              article_categories: {
                include: {
                  categories: {
                    include: {
                      category_translations: {
                        where: { language: 'en' },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.article_bookmarks.count({ where: { userId } }),
    ]);

    const articles = bookmarks.map((bookmark) => {
      const article = bookmark.articles;
      const translation = article.article_translations[0];
      const category = article.article_categories[0];
      const categoryTranslation = category?.categories.category_translations[0];

      return {
        id: article.id,
        slug: article.slug,
        title: translation?.title || 'Untitled',
        subtitle: translation?.subtitle,
        author: translation?.author || 'BLONG Expert',
        readTime: translation?.readTime || '5 min read',
        icon: translation?.icon || '📖',
        category: categoryTranslation?.name || 'General',
        bookmarkedAt: bookmark.createdAt,
        isBookmarked: true,
      };
    });

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    };
  }

  async getUserReadingHistory(
    userId: string,
    params: { page: number; limit: number },
  ) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      this.prisma.article_read_history.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { readAt: 'desc' },
        include: {
          articles: {
            include: {
              article_translations: {
                where: { language: 'en' },
                take: 1,
              },
              article_categories: {
                include: {
                  categories: {
                    include: {
                      category_translations: {
                        where: { language: 'en' },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.article_read_history.count({ where: { userId } }),
    ]);

    const articles = history.map((historyItem) => {
      const article = historyItem.articles;
      const translation = article.article_translations[0];
      const category = article.article_categories[0];
      const categoryTranslation = category?.categories.category_translations[0];

      return {
        id: article.id,
        slug: article.slug,
        title: translation?.title || 'Untitled',
        subtitle: translation?.subtitle,
        author: translation?.author || 'BLONG Expert',
        readTime: translation?.readTime || '5 min read',
        icon: translation?.icon || '📖',
        category: categoryTranslation?.name || 'General',
        readAt: historyItem.readAt,
        readDuration: historyItem.readDuration,
        readPercentage: historyItem.readPercentage,
      };
    });

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    };
  }

  async getRecommendedArticles(userId: string, limit: number) {
    // For now, return popular articles. In the future, this can be enhanced
    // with ML recommendations based on user preferences and reading history
    const articles = await this.prisma.articles.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { not: null },
      },
      take: limit,
      orderBy: [{ viewCount: 'desc' }, { likeCount: 'desc' }],
      include: {
        article_translations: {
          where: { language: 'en' },
          take: 1,
        },
        article_categories: {
          include: {
            categories: {
              include: {
                category_translations: {
                  where: { language: 'en' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    const recommended = articles.map((article) => {
      const translation = article.article_translations[0];
      const category = article.article_categories[0];
      const categoryTranslation = category?.categories.category_translations[0];

      return {
        id: article.id,
        slug: article.slug,
        title: translation?.title || 'Untitled',
        subtitle: translation?.subtitle,
        author: translation?.author || 'BLONG Expert',
        readTime: translation?.readTime || '5 min read',
        icon: translation?.icon || '📖',
        category: categoryTranslation?.name || 'General',
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        reason: 'Popular content',
      };
    });

    return { recommended };
  }

  async bookmarkArticle(userId: string, articleId: string) {
    // Check if article exists
    const article = await this.prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Create bookmark (will ignore if already exists due to unique constraint)
    try {
      await this.prisma.article_bookmarks.create({
        data: {
          id: `${userId}_${articleId}`,
          userId,
          articleId,
        },
      });
    } catch (error) {
      // Ignore duplicate key errors
      if (error.code !== 'P2002') {
        throw error;
      }
    }

    return { success: true, message: 'Article bookmarked successfully' };
  }

  async removeBookmark(userId: string, articleId: string) {
    try {
      await this.prisma.article_bookmarks.delete({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      });
    } catch (error) {
      // Ignore if bookmark doesn't exist
      if (error.code !== 'P2025') {
        throw error;
      }
    }

    return { success: true, message: 'Bookmark removed successfully' };
  }

  async markAsRead(userId: string, articleId: string) {
    // Check if article exists
    const article = await this.prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Create or update reading history
    await this.prisma.article_read_history.upsert({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        id: `${userId}_${articleId}_${Date.now()}`,
        userId,
        articleId,
        readAt: new Date(),
      },
    });

    return { success: true, message: 'Article marked as read' };
  }
}