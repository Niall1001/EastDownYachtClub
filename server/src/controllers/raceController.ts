import { Response, NextFunction } from 'express';
import { AuthRequest, ApiResponse, CreateRaceData, RaceResultsData } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export const getEventRaces = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { eventId } = req.params;

  const event = await prisma.events.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  const races = await prisma.races.findMany({
    where: { event_id: eventId },
    include: {
      yacht_classes: true,
      race_results: {
        orderBy: { position: 'asc' }
      }
    },
    orderBy: [
      { race_date: 'asc' },
      { race_number: 'asc' }
    ]
  });

  const response: ApiResponse = {
    success: true,
    data: races,
  };

  res.status(200).json(response);
});

export const createRace = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { eventId } = req.params;
  const raceData: CreateRaceData = req.body;

  const event = await prisma.events.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    const response: ApiResponse = {
      success: false,
      error: 'Event not found',
    };
    res.status(404).json(response);
    return;
  }

  // Verify yacht class exists
  const yachtClass = await prisma.yacht_classes.findUnique({
    where: { id: raceData.yachtClassId }
  });

  if (!yachtClass) {
    const response: ApiResponse = {
      success: false,
      error: 'Yacht class not found',
    };
    res.status(404).json(response);
    return;
  }

  const race = await prisma.races.create({
    data: {
      event_id: eventId,
      yacht_class_id: raceData.yachtClassId,
      race_number: raceData.raceNumber || 1,
      race_date: new Date(raceData.raceDate),
      start_time: raceData.startTime ? new Date(`1970-01-01T${raceData.startTime}`) : null,
      wind_direction: raceData.windDirection || null,
      wind_speed: raceData.windSpeed || null,
      notes: raceData.notes || null
    },
    include: {
      yacht_classes: true,
      events: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  logger.info(`Race created: ${race.id}`, { 
    userId: req.user?.id, 
    eventId, 
    raceNumber: race.race_number 
  });

  const response: ApiResponse = {
    success: true,
    data: race,
    message: 'Race created successfully',
  };

  res.status(201).json(response);
});

export const getRaceResults = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id: raceId } = req.params;

  const race = await prisma.races.findUnique({
    where: { id: raceId },
    include: {
      yacht_classes: true,
      events: {
        select: {
          id: true,
          title: true
        }
      },
      race_results: {
        orderBy: [
          { position: 'asc' }
        ]
      }
    }
  });

  if (!race) {
    const response: ApiResponse = {
      success: false,
      error: 'Race not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse = {
    success: true,
    data: race,
  };

  res.status(200).json(response);
});

export const submitRaceResults = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id: raceId } = req.params;
  const resultsData: RaceResultsData = req.body;

  const race = await prisma.races.findUnique({
    where: { id: raceId }
  });

  if (!race) {
    const response: ApiResponse = {
      success: false,
      error: 'Race not found',
    };
    res.status(404).json(response);
    return;
  }

  // Use transaction to ensure all results are created or none are
  const results = await prisma.$transaction(async (tx) => {
    // Clear existing results for this race
    await tx.race_results.deleteMany({
      where: { race_id: raceId }
    });

    // Create new results
    return Promise.all(
      resultsData.results.map((result, index) =>
        tx.race_results.create({
          data: {
            race_id: raceId,
            sail_number: result.sailNumber,
            yacht_name: result.yachtName || null,
            helm_name: result.helmName || null,
            crew_names: result.crewNames || null,
            finish_time: result.finishTime ? new Date(`1970-01-01T${result.finishTime}`) : null,
            position: result.position || index + 1,
            points: result.points || null,
            disqualified: result.disqualified || false,
            dns: result.dns || false,
            dnf: result.dnf || false,
            retired: result.retired || false,
            notes: result.notes || null
          }
        })
      )
    );
  });

  logger.info(`Race results submitted: ${raceId}`, { 
    userId: req.user?.id, 
    raceId, 
    resultCount: results.length 
  });

  const response: ApiResponse = {
    success: true,
    data: results,
    message: 'Race results submitted successfully',
  };

  res.status(201).json(response);
});