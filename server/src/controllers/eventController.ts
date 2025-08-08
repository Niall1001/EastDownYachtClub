import { Response, NextFunction } from 'express';
import { AuthRequest, ApiResponse, CreateEventData, UpdateEventData, BoatEntry } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export const getEvents = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { type, startDate, endDate, published = 'true' } = req.query;
  
  const where: any = {};
  
  if (type && typeof type === 'string') {
    where.event_type = type;
  }
  
  if (startDate && typeof startDate === 'string') {
    where.start_date = { gte: new Date(startDate) };
  }
  
  if (endDate && typeof endDate === 'string') {
    where.end_date = { lte: new Date(endDate) };
  }

  const events = await prisma.events.findMany({
    where,
    include: {
      races: {
        include: {
          yacht_classes: true,
          race_results: true
        }
      },
      event_documents: true,
      stories: published === 'true' ? {
        where: { published: true }
      } : true
    },
    orderBy: [
      { start_date: 'desc' }
    ]
  });

  const response: ApiResponse = {
    success: true,
    data: events,
  };

  res.status(200).json(response);
});

export const getEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const event = await prisma.events.findUnique({
    where: { id },
    include: {
      races: {
        include: {
          yacht_classes: true,
          race_results: {
            orderBy: { position: 'asc' }
          }
        }
      },
      event_documents: true,
      stories: {
        where: { published: true }
      },
      series_results: {
        include: {
          yacht_classes: true
        },
        orderBy: { position: 'asc' }
      }
    }
  });

  if (!event) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse = {
    success: true,
    data: event,
  };

  res.status(200).json(response);
});

export const createEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const eventData: CreateEventData = req.body;

  const event = await prisma.events.create({
    data: {
      title: eventData.title,
      description: eventData.description || null,
      event_type: eventData.eventType,
      start_date: new Date(eventData.startDate),
      end_date: eventData.endDate ? new Date(eventData.endDate) : null,
      start_time: eventData.startTime ? new Date(`1970-01-01T${eventData.startTime}`) : null,
      location: eventData.location || null,
    },
    include: {
      races: true,
      event_documents: true
    }
  });

  logger.info(`Event created: ${event.id}`, { userId: req.user?.id, eventTitle: event.title });

  const response: ApiResponse = {
    success: true,
    data: event,
    message: 'Event created successfully',
  };

  res.status(201).json(response);
});

export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const eventData: UpdateEventData = req.body;

  const existingEvent = await prisma.events.findUnique({
    where: { id }
  });

  if (!existingEvent) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  const updateData: any = {
    updated_at: new Date()
  };

  if (eventData.title) updateData.title = eventData.title;
  if (eventData.description !== undefined) updateData.description = eventData.description;
  if (eventData.eventType) updateData.event_type = eventData.eventType;
  if (eventData.startDate) updateData.start_date = new Date(eventData.startDate);
  if (eventData.endDate !== undefined) {
    updateData.end_date = eventData.endDate ? new Date(eventData.endDate) : null;
  }
  if (eventData.startTime !== undefined) {
    updateData.start_time = eventData.startTime ? new Date(`1970-01-01T${eventData.startTime}`) : null;
  }
  if (eventData.location !== undefined) updateData.location = eventData.location;

  const event = await prisma.events.update({
    where: { id },
    data: updateData,
    include: {
      races: true,
      event_documents: true
    }
  });

  logger.info(`Event updated: ${event.id}`, { userId: req.user?.id, eventTitle: event.title });

  const response: ApiResponse = {
    success: true,
    data: event,
    message: 'Event updated successfully',
  };

  res.status(200).json(response);
});

export const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const event = await prisma.events.findUnique({
    where: { id }
  });

  if (!event) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  await prisma.events.delete({
    where: { id }
  });

  logger.info(`Event deleted: ${id}`, { userId: req.user?.id, eventTitle: event.title });

  const response: ApiResponse = {
    success: true,
    message: 'Event deleted successfully',
  };

  res.status(200).json(response);
});

export const addBoatEntry = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // This would typically create an entry in a boat_entries table
  // For now, we'll return a placeholder response
  const { id } = req.params;
  const boatData: BoatEntry = req.body;

  const event = await prisma.events.findUnique({
    where: { id }
  });

  if (!event) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  // TODO: Implement boat entry creation logic
  // This would require a boat_entries table in the database schema

  const response: ApiResponse = {
    success: true,
    message: 'Boat entry added successfully',
    data: { eventId: id, ...boatData }
  };

  res.status(201).json(response);
});

export const removeBoatEntry = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id, entryId } = req.params;

  const event = await prisma.events.findUnique({
    where: { id }
  });

  if (!event) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  // TODO: Implement boat entry removal logic
  // This would require a boat_entries table in the database schema

  const response: ApiResponse = {
    success: true,
    message: 'Boat entry removed successfully',
  };

  res.status(200).json(response);
});