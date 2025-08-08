import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  addBoatEntry,
  removeBoatEntry
} from '../controllers/eventController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate, eventSchema, eventUpdateSchema, boatEntrySchema } from '../middleware/validation';

const router = Router();

// GET /api/events - List events with filtering
router.get('/', getEvents);

// GET /api/events/:id - Event details
router.get('/:id', getEvent);

// POST /api/events - Create new event (Admin only)
router.post('/', authenticateToken, requireAdmin, validate(eventSchema), createEvent);

// PUT /api/events/:id - Update event (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(eventUpdateSchema), updateEvent);

// DELETE /api/events/:id - Delete event (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteEvent);

// POST /api/events/:id/entries - Add boat entry
router.post('/:id/entries', validate(boatEntrySchema), addBoatEntry);

// DELETE /api/events/:id/entries/:entryId - Remove boat entry
router.delete('/:id/entries/:entryId', removeBoatEntry);

export default router;