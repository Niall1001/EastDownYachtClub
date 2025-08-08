import { Router } from 'express';
import { login, logout, getProfile, refreshToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate, loginSchema } from '../middleware/validation';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me
router.get('/me', authenticateToken, getProfile);

// POST /api/auth/refresh
router.post('/refresh', authenticateToken, refreshToken);

export default router;