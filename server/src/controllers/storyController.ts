import { Response, NextFunction } from 'express';
import { AuthRequest, ApiResponse, CreateStoryData, UpdateStoryData } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { generateSlug } from '../utils/slug';

export const getStories = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { type, published = 'true', limit = '10', offset = '0' } = req.query;
  
  const where: any = {};
  
  if (published === 'true') {
    where.published = true;
  }
  
  if (type && typeof type === 'string') {
    where.story_type = type;
  }

  const stories = await prisma.stories.findMany({
    where,
    include: {
      events: {
        select: {
          id: true,
          title: true,
          start_date: true
        }
      }
    },
    orderBy: [
      { publish_date: 'desc' },
      { created_at: 'desc' }
    ],
    take: parseInt(limit as string),
    skip: parseInt(offset as string)
  });

  const total = await prisma.stories.count({ where });

  const response: ApiResponse = {
    success: true,
    data: {
      stories,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    },
  };

  res.status(200).json(response);
});

export const getStory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const story = await prisma.stories.findFirst({
    where: {
      OR: [
        { id },
        { slug: id }
      ]
    },
    include: {
      events: {
        select: {
          id: true,
          title: true,
          start_date: true,
          event_type: true
        }
      }
    }
  });

  if (!story) {
    const response: ApiResponse = {
      success: false,
      error: 'Story not found',
    };
    res.status(404).json(response);
    return;
  }

  // Only return published stories unless user is admin
  if (!story.published && (!req.user || req.user.role !== 'admin')) {
    const response: ApiResponse = {
      success: false,
      error: 'Story not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse = {
    success: true,
    data: story,
  };

  res.status(200).json(response);
});

export const createStory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const storyData: CreateStoryData = req.body;

  const slug = await generateSlug(storyData.title);

  const story = await prisma.stories.create({
    data: {
      title: storyData.title,
      slug,
      excerpt: storyData.excerpt,
      content: storyData.content,
      story_type: storyData.storyType || 'news',
      featured_image_url: storyData.featuredImageUrl,
      gallery_images: storyData.galleryImages as any,
      author_name: storyData.authorName || req.user?.username,
      published: storyData.published || false,
      publish_date: storyData.published ? new Date() : null,
      event_id: storyData.eventId || null,
      tags: storyData.tags || [],
    },
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

  logger.info(`Story created: ${story.id}`, { userId: req.user?.id, storyTitle: story.title });

  const response: ApiResponse = {
    success: true,
    data: story,
    message: 'Story created successfully',
  };

  res.status(201).json(response);
});

export const updateStory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const storyData: UpdateStoryData = req.body;

  const existingStory = await prisma.stories.findUnique({
    where: { id }
  });

  if (!existingStory) {
    const response: ApiResponse = {
      success: false,
      error: 'Story not found',
    };
    res.status(404).json(response);
    return;
  }

  const updateData: any = {
    updated_at: new Date()
  };

  if (storyData.title) {
    updateData.title = storyData.title;
    updateData.slug = await generateSlug(storyData.title);
  }
  if (storyData.excerpt !== undefined) updateData.excerpt = storyData.excerpt;
  if (storyData.content) updateData.content = storyData.content;
  if (storyData.storyType) updateData.story_type = storyData.storyType;
  if (storyData.featuredImageUrl !== undefined) updateData.featured_image_url = storyData.featuredImageUrl;
  if (storyData.galleryImages !== undefined) {
    updateData.gallery_images = storyData.galleryImages as any;
  }
  if (storyData.authorName !== undefined) updateData.author_name = storyData.authorName;
  if (storyData.eventId !== undefined) updateData.event_id = storyData.eventId;
  if (storyData.tags !== undefined) updateData.tags = storyData.tags;

  // Handle publishing
  if (storyData.published !== undefined) {
    updateData.published = storyData.published;
    if (storyData.published && !existingStory.published) {
      updateData.publish_date = new Date();
    } else if (!storyData.published) {
      updateData.publish_date = null;
    }
  }

  const story = await prisma.stories.update({
    where: { id },
    data: updateData,
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

  logger.info(`Story updated: ${story.id}`, { userId: req.user?.id, storyTitle: story.title });

  const response: ApiResponse = {
    success: true,
    data: story,
    message: 'Story updated successfully',
  };

  res.status(200).json(response);
});

export const deleteStory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const story = await prisma.stories.findUnique({
    where: { id }
  });

  if (!story) {
    const response: ApiResponse = {
      success: false,
      error: 'Story not found',
    };
    res.status(404).json(response);
    return;
  }

  await prisma.stories.delete({
    where: { id }
  });

  logger.info(`Story deleted: ${id}`, { userId: req.user?.id, storyTitle: story.title });

  const response: ApiResponse = {
    success: true,
    message: 'Story deleted successfully',
  };

  res.status(200).json(response);
});