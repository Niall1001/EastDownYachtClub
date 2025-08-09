import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, User } from '../types';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'yacht-club-dev-secret';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      logger.warn('Invalid token attempt', { error: err.message, ip: req.ip });
      res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      name: decoded.name || decoded.username,
      role: decoded.role || 'user'
    } as User;

    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
    return;
  }
  next();
};