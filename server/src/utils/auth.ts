import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Mock users database - replace with actual database in production
const mockUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: '$2a$10$8ZrQOyGqgXm4LoYG9Kp.5ODvQJ8rHq5W9m4L8YpGqKxKzEJKzgBKS', // yacht123
    user: {
      id: '1',
      username: 'admin',
      name: 'Admin User',
      role: 'Administrator'
    }
  },
  commodore: {
    password: '$2a$10$QXx4lk8rL5yJvNGt3pKrVOzYGj5K9lHx3oKzBqGzRjFwEqZxPmR4W', // sailing456
    user: {
      id: '2',
      username: 'commodore',
      name: 'Commodore Smith',
      role: 'Commodore'
    }
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user: User): string => {
  const payload = { 
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '24h' });
};

export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as User;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  const userData = mockUsers[username];
  
  if (!userData) {
    return null;
  }

  const isValidPassword = await comparePassword(password, userData.password);
  
  if (!isValidPassword) {
    return null;
  }

  return userData.user;
};

// Initialize password hashes on server start (for development)
export const initializePasswordHashes = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    try {
      mockUsers.admin.password = await hashPassword('yacht123');
      mockUsers.commodore.password = await hashPassword('sailing456');
    } catch (error) {
      console.error('Error initializing password hashes:', error);
    }
  }
};