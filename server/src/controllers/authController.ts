import { Response, NextFunction } from 'express';
import { AuthRequest, ApiResponse, LoginCredentials } from '../types';
import { authenticateUser, generateToken } from '../utils/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const login = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { username, password }: LoginCredentials = req.body;

  const user = await authenticateUser(username, password);

  if (!user) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid username or password',
    };
    res.status(401).json(response);
    return;
  }

  const token = generateToken(user);

  const response: ApiResponse = {
    success: true,
    data: {
      user,
      token,
    },
    message: 'Login successful',
  };

  res.status(200).json(response);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // In a real implementation, you might want to blacklist the token
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };

  res.status(200).json(response);
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      error: 'User not authenticated',
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
      error: 'User not authenticated',
    };
    res.status(401).json(response);
    return;
  }

  const newToken = generateToken(req.user);

  const response: ApiResponse = {
    success: true,
    data: {
      token: newToken,
      user: req.user,
    },
    message: 'Token refreshed successfully',
  };

  res.status(200).json(response);
});