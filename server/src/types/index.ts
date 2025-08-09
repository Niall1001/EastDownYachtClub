import { Request } from 'express';

// User types
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

// Auth types
export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Event types
export interface EventData {
  title: string;
  description: string;
  event_type: 'social' | 'regatta' | 'series';
  start_date: Date;
  end_date?: Date;
  start_time?: string;
  location: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  eventType: 'social' | 'regatta' | 'series' | 'racing' | 'training' | 'cruising' | 'committee';
  startDate: string;
  endDate?: string;
  startTime?: string;
  location?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  eventType?: 'social' | 'regatta' | 'series' | 'racing' | 'training' | 'cruising' | 'committee';
  startDate?: string;
  endDate?: string;
  startTime?: string;
  location?: string;
}

export interface BoatEntry {
  id?: string;
  boatName: string;
  skipper: string;
  sailNumber: string;
  class: string;
}

// Story types  
export interface StoryData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  story_type?: 'news' | 'announcement' | 'race_report' | 'feature' | 'newsletter';
  featured_image_url?: string;
  author_name: string;
  published?: boolean;
  tags?: string[];
  event_id?: string;
}

export interface CreateStoryData {
  title: string;
  excerpt?: string;
  content: string;
  storyType?: 'news' | 'racing' | 'training' | 'social' | 'announcement';
  featuredImageUrl?: string;
  galleryImages?: string[];
  authorName?: string;
  published?: boolean;
  tags?: string[];
  eventId?: string;
}

export interface UpdateStoryData {
  title?: string;
  excerpt?: string;
  content?: string;
  storyType?: 'news' | 'racing' | 'training' | 'social' | 'announcement';
  featuredImageUrl?: string;
  galleryImages?: string[];
  authorName?: string;
  published?: boolean;
  tags?: string[];
  eventId?: string;
}

// Race types
export interface CreateRaceData {
  yachtClassId: string;
  raceNumber?: number;
  raceDate: string;
  startTime?: string;
  windDirection?: string;
  windSpeed?: number;
  notes?: string;
}

export interface RaceResult {
  sailNumber: string;
  yachtName?: string;
  helmName?: string;
  crewNames?: string;
  finishTime?: string;
  elapsedTime?: string;
  correctedTime?: string;
  position?: number;
  points?: number;
  disqualified?: boolean;
  dns?: boolean;
  dnf?: boolean;
  retired?: boolean;
  notes?: string;
}

export interface RaceResultsData {
  results: RaceResult[];
}

// File upload types
export interface FileUpload {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  published?: boolean;
  startDate?: string;
  endDate?: string;
}