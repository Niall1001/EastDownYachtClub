import { prisma } from '../utils/prisma';

export class StoryService {
  static async getFeaturedStories(limit: number = 3) {
    return prisma.stories.findMany({
      where: {
        published: true,
        featured_image_url: {
          not: null
        }
      },
      orderBy: {
        publish_date: 'desc'
      },
      take: limit,
      include: {
        events: {
          select: {
            id: true,
            title: true,
            start_date: true
          }
        }
      }
    });
  }

  static async getStoriesByType(storyType: string, limit: number = 10) {
    return prisma.stories.findMany({
      where: {
        story_type: storyType,
        published: true
      },
      orderBy: {
        publish_date: 'desc'
      },
      take: limit,
      include: {
        events: {
          select: {
            id: true,
            title: true,
            start_date: true
          }
        }
      }
    });
  }

  static async searchStories(query: string, limit: number = 10) {
    return prisma.stories.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            excerpt: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        publish_date: 'desc'
      },
      take: limit,
      include: {
        events: {
          select: {
            id: true,
            title: true,
            start_date: true
          }
        }
      }
    });
  }

  static async getRecentStories(limit: number = 5) {
    return prisma.stories.findMany({
      where: {
        published: true
      },
      orderBy: {
        publish_date: 'desc'
      },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        story_type: true,
        featured_image_url: true,
        author_name: true,
        publish_date: true,
        events: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
  }
}