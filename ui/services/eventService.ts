import { apiClient } from './api';

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  location?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  location?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export const eventService = {
  async createEvent(data: CreateEventRequest): Promise<ApiResponse<Event>> {
    return apiClient.post<ApiResponse<Event>>('/events', data);
  },

  async updateEvent(id: string, data: UpdateEventRequest): Promise<ApiResponse<Event>> {
    return apiClient.put<ApiResponse<Event>>(`/events/${id}`, data);
  },

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/events/${id}`);
  },

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    return apiClient.get<ApiResponse<Event>>(`/events/${id}`);
  }
};