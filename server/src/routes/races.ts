import { Router } from 'express';
import {
  getEventRaces,
  createRace,
  getRaceResults,
  submitRaceResults
} from '../controllers/raceController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate, raceSchema, raceResultsSchema } from '../middleware/validation';

const router = Router();

// GET /api/races/events/:eventId - List races for event
router.get('/events/:eventId', getEventRaces);

// POST /api/races/events/:eventId - Create race
router.post('/events/:eventId', authenticateToken, requireAdmin, validate(raceSchema), createRace);

// GET /api/races/:id/results - Race results
router.get('/:id/results', getRaceResults);

// POST /api/races/:id/results - Submit race results
router.post('/:id/results', authenticateToken, requireAdmin, validate(raceResultsSchema), submitRaceResults);

export default router;