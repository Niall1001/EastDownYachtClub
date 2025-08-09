import { Response, NextFunction } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';

// Simple development credentials - in production, this would use a proper user database
const ADMIN_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, this would be hashed
    name: 'Club Administrator',
    role: 'admin'
  },
  {
    id: '2', 
    username: 'commodore',
    password: 'sailing2024',
    name: 'Commodore',
    role: 'admin'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'yacht-club-dev-secret';

export const login = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const response: ApiResponse = {
      success: false,
      error: 'Username and password are required',
    };
    res.status(400).json(response);
    return;
  }

  // Find user
  const user = ADMIN_USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    logger.warn(`Failed login attempt for username: ${username}`, { ip: req.ip });
    const response: ApiResponse = {
      success: false,
      error: 'Invalid username or password',
    };
    res.status(401).json(response);
    return;
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  logger.info(`Successful login for user: ${username}`, { userId: user.id, ip: req.ip });

  const response: ApiResponse = {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    },
    message: 'Login successful',
  };

  res.status(200).json(response);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // In a production app, you might invalidate the token server-side
  logger.info('User logout', { userId: req.user?.id, ip: req.ip });

  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };

  res.status(200).json(response);
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      error: 'Not authenticated',
    };
    res.status(401).json(response);
    return;
  }

  const response: ApiResponse = {
    success: true,
    data: req.user,
  };

  res.status(200).json(response);
});

export const refreshToken = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      error: 'Not authenticated',
    };
    res.status(401).json(response);
    return;
  }

  // Generate new token
  const token = jwt.sign(
    { 
      id: req.user.id, 
      username: req.user.username, 
      role: req.user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const response: ApiResponse = {
    success: true,
    data: {
      token,
      user: req.user
    },
    message: 'Token refreshed',
  };

  res.status(200).json(response);
});