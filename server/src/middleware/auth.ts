import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AuthRequest, ApiResponse } from '../types';
import { createError } from './errorHandler';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: 'Access token required',
    };
    res.status(401).json(response);
    return;
  }

  const user = verifyToken(token);
  
  if (!user) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid or expired token',
    };
    res.status(403).json(response);
    return;
  }

  req.user = user;
  next();
};

export const requireRole = (roles: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Insufficient permissions',
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['Administrator']);
export const requireAdminOrCommodore = requireRole(['Administrator', 'Commodore']);