import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { 
  ApiResponse, 
  Race, 
  RaceWithResults,
  RaceResult,
  RaceResultsData,
  CreateRaceData 
} from '../types/api';

interface UseRacesReturn {
  races: Race[];
  isLoading: boolean;
  error: string | null;
  fetchEventRaces: (eventId: string) => Promise<void>;
  createRace: (eventId: string, data: CreateRaceData) => Promise<Race | null>;
  refreshRaces: () => Promise<void>;
}

export const useRaces = (): UseRacesReturn => {
  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const fetchEventRaces = useCallback(async (eventId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Race[]> = await apiClient.get(`/races/events/${eventId}`);
      
      if (response.success && response.data) {
        setRaces(response.data);
        setLastEventId(eventId);
      } else {
        setError(response.error || 'Failed to fetch races');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch races';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRace = useCallback(async (eventId: string, data: CreateRaceData): Promise<Race | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Race> = await apiClient.post(`/races/events/${eventId}`, data);
      
      if (response.success && response.data) {
        // Refresh the races list after creating
        await fetchEventRaces(eventId);
        return response.data;
      } else {
        setError(response.error || 'Failed to create race');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create race';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchEventRaces]);

  const refreshRaces = useCallback(async (): Promise<void> => {
    if (lastEventId) {
      await fetchEventRaces(lastEventId);
    }
  }, [fetchEventRaces, lastEventId]);

  return {
    races,
    isLoading,
    error,
    fetchEventRaces,
    createRace,
    refreshRaces,
  };
};

interface UseRaceResultsReturn {
  race: RaceWithResults | null;
  results: RaceResult[];
  isLoading: boolean;
  error: string | null;
  fetchRaceResults: (raceId: string) => Promise<void>;
  updateRaceResults: (raceId: string, results: RaceResult[]) => Promise<boolean>;
  refreshResults: () => Promise<void>;
}

export const useRaceResults = (raceId?: string): UseRaceResultsReturn => {
  const [race, setRace] = useState<RaceWithResults | null>(null);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRaceId, setLastRaceId] = useState<string | null>(raceId || null);

  const fetchRaceResults = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<RaceWithResults> = await apiClient.get(`/races/${id}/results`);
      
      if (response.success && response.data) {
        setRace(response.data);
        setResults(response.data.results || []);
        setLastRaceId(id);
      } else {
        setError(response.error || 'Failed to fetch race results');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch race results';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRaceResults = useCallback(async (id: string, resultsData: RaceResult[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payload: RaceResultsData = { results: resultsData };
      const response: ApiResponse<RaceResult[]> = await apiClient.post(`/races/${id}/results`, payload);
      
      if (response.success && response.data) {
        setResults(response.data);
        // Update the race object with new results
        if (race) {
          setRace({ ...race, results: response.data });
        }
        return true;
      } else {
        setError(response.error || 'Failed to update race results');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update race results';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [race]);

  const refreshResults = useCallback(async (): Promise<void> => {
    if (lastRaceId) {
      await fetchRaceResults(lastRaceId);
    }
  }, [fetchRaceResults, lastRaceId]);

  // Initial fetch if raceId is provided
  useEffect(() => {
    if (raceId) {
      fetchRaceResults(raceId);
    }
  }, [raceId, fetchRaceResults]);

  return {
    race,
    results,
    isLoading,
    error,
    fetchRaceResults,
    updateRaceResults,
    refreshResults,
  };
};