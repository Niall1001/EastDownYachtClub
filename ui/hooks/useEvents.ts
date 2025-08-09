import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { 
  ApiResponse, 
  PaginatedResponse,
  Event, 
  CreateEventData, 
  UpdateEventData,
  QueryParams 
} from '../types/api';

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  fetchEvents: (params?: QueryParams) => Promise<void>;
  createEvent: (data: CreateEventData) => Promise<Event | null>;
  updateEvent: (id: string, data: UpdateEventData) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
}

export const useEvents = (initialParams?: QueryParams): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastParams, setLastParams] = useState<QueryParams | undefined>(initialParams);

  const fetchEvents = useCallback(async (params?: QueryParams): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      
      const endpoint = `/events${queryString ? `?${queryString}` : ''}`;
      const response: PaginatedResponse<Event> = await apiClient.get(endpoint);
      
      if (response.success && response.data) {
        // Transform API response (snake_case) to frontend format (camelCase)
        const transformedEvents = response.data.map((rawEvent: any): Event => ({
          id: rawEvent.id,
          title: rawEvent.title,
          description: rawEvent.description,
          eventType: rawEvent.event_type || rawEvent.eventType,
          startDate: rawEvent.start_date || rawEvent.startDate,
          endDate: rawEvent.end_date || rawEvent.endDate,
          startTime: rawEvent.start_time || rawEvent.startTime,
          location: rawEvent.location,
          createdAt: rawEvent.created_at || rawEvent.createdAt,
          updatedAt: rawEvent.updated_at || rawEvent.updatedAt
        }));
        setEvents(transformedEvents);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setCurrentPage(response.pagination.page);
          setTotal(response.pagination.total);
        }
        setLastParams(params);
      } else {
        setError(response.error || 'Failed to fetch events');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      // If it's an authentication error, provide a more helpful message
      if (errorMessage.includes('token') || errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        setError('Authentication required. Please log in to view events.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (data: CreateEventData): Promise<Event | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Event> = await apiClient.post('/events', data);
      
      if (response.success && response.data) {
        // Refresh the events list after creating
        await fetchEvents(lastParams);
        return response.data;
      } else {
        setError(response.error || 'Failed to create event');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchEvents, lastParams]);

  const updateEvent = useCallback(async (id: string, data: UpdateEventData): Promise<Event | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Event> = await apiClient.put(`/events/${id}`, data);
      
      if (response.success && response.data) {
        // Update the event in the local state
        setEvents(prev => prev.map(event => 
          event.id === id ? response.data! : event
        ));
        return response.data;
      } else {
        setError(response.error || 'Failed to update event');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse = await apiClient.delete(`/events/${id}`);
      
      if (response.success) {
        // Remove the event from local state
        setEvents(prev => prev.filter(event => event.id !== id));
        return true;
      } else {
        setError(response.error || 'Failed to delete event');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshEvents = useCallback(async (): Promise<void> => {
    await fetchEvents(lastParams);
  }, [fetchEvents, lastParams]);

  // Initial fetch - Fixed infinite loop by serializing params for comparison
  useEffect(() => {
    fetchEvents(initialParams);
  }, [fetchEvents, JSON.stringify(initialParams)]);

  return {
    events,
    isLoading,
    error,
    totalPages,
    currentPage,
    total,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
  };
};

interface UseEventReturn {
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  fetchEvent: (id: string) => Promise<void>;
}

export const useEvent = (id?: string): UseEventReturn => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async (eventId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Event> = await apiClient.get(`/events/${eventId}`);
      
      if (response.success && response.data) {
        // Transform API response (snake_case) to frontend format (camelCase)
        const rawEvent = response.data as any;
        const transformedEvent: Event = {
          id: rawEvent.id,
          title: rawEvent.title,
          description: rawEvent.description,
          eventType: rawEvent.event_type || rawEvent.eventType,
          startDate: rawEvent.start_date || rawEvent.startDate,
          endDate: rawEvent.end_date || rawEvent.endDate,
          startTime: rawEvent.start_time || rawEvent.startTime,
          location: rawEvent.location,
          createdAt: rawEvent.created_at || rawEvent.createdAt,
          updatedAt: rawEvent.updated_at || rawEvent.updatedAt
        };
        setEvent(transformedEvent);
      } else {
        setError(response.error || 'Failed to fetch event');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch event';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch if ID is provided
  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id, fetchEvent]);

  return {
    event,
    isLoading,
    error,
    fetchEvent,
  };
};