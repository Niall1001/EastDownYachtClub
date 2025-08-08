import { prisma } from '../utils/prisma';

export class EventService {
  static async getUpcomingEvents(limit: number = 5) {
    const today = new Date();
    
    return prisma.events.findMany({
      where: {
        start_date: {
          gte: today
        }
      },
      orderBy: {
        start_date: 'asc'
      },
      take: limit,
      include: {
        races: {
          include: {
            yacht_classes: true
          }
        }
      }
    });
  }

  static async getRecentEvents(limit: number = 5) {
    const today = new Date();
    
    return prisma.events.findMany({
      where: {
        start_date: {
          lt: today
        }
      },
      orderBy: {
        start_date: 'desc'
      },
      take: limit,
      include: {
        races: {
          include: {
            yacht_classes: true,
            race_results: {
              take: 3,
              orderBy: {
                position: 'asc'
              }
            }
          }
        }
      }
    });
  }

  static async getEventsByType(eventType: string) {
    return prisma.events.findMany({
      where: {
        event_type: eventType
      },
      orderBy: {
        start_date: 'desc'
      },
      include: {
        races: {
          include: {
            yacht_classes: true
          }
        },
        stories: {
          where: {
            published: true
          }
        }
      }
    });
  }
}