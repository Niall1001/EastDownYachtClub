// Base API Response interface
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

// User types
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description?: string;
  eventType: 'social' | 'regatta' | 'series' | 'racing' | 'training' | 'cruising' | 'committee';
  startDate: string;
  endDate?: string;
  startTime?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
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

// Story types
export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  storyType: 'news' | 'racing' | 'training' | 'social' | 'announcement';
  featuredImageUrl?: string;
  galleryImages?: string[];
  authorName?: string;
  published: boolean;
  tags?: string[];
  eventId?: string;
  createdAt: string;
  updatedAt: string;
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
export interface YachtClass {
  id: string;
  name: string;
  description?: string;
}

export interface Race {
  id: string;
  eventId: string;
  yachtClassId: string;
  raceNumber?: number;
  raceDate: string;
  startTime?: string;
  windDirection?: string;
  windSpeed?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  yachtClass?: YachtClass;
}

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
  id?: string;
  raceId: string;
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

export interface RaceWithResults extends Race {
  results?: RaceResult[];
}

// File upload types
export interface UploadResponse {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
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

// Error types
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}