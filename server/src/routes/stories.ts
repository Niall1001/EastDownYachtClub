import { Router } from 'express';
import {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory
} from '../controllers/storyController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate, storySchema, storyUpdateSchema } from '../middleware/validation';

const router = Router();

// GET /api/stories - List published stories with filtering
router.get('/', getStories);

// GET /api/stories/:id - Story details
router.get('/:id', getStory);

// POST /api/stories - Create story (Admin only)
router.post('/', authenticateToken, requireAdmin, validate(storySchema), createStory);

// PUT /api/stories/:id - Update story (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(storyUpdateSchema), updateStory);

// DELETE /api/stories/:id - Delete story (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteStory);

export default router;