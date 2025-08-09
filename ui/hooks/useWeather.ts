import { useState, useEffect } from 'react';
import { weatherService, WeatherData } from '../services/weatherService';

interface UseWeatherOptions {
  // Refresh interval in milliseconds (default: disabled, relies on 12-hour cache)
  refreshInterval?: number;
  // Geographic coordinates (defaults to East Down Yacht Club)
  lat?: number;
  lon?: number;
  // Location name (alternative to coordinates)
  location?: string;
  // Enable auto-refresh (default: false, since we now use 12-hour caching)
  autoRefresh?: boolean;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  lastUpdated: Date | null;
  isCached: boolean;
}

export const useWeather = (options: UseWeatherOptions = {}): UseWeatherReturn => {
  const {
    refreshInterval,
    lat,
    lon,
    location,
    autoRefresh = false // Disabled by default since we now use 12-hour caching
  } = options;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isCached, setIsCached] = useState(false);

  const fetchWeather = async (forceRefresh: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      let weatherData: WeatherData;
      let wasFromCache = false;
      
      // Check if data will come from cache (for UI feedback)
      if (!forceRefresh && weather === null) {
        // This is the initial load, check if we have cached data
        const testCacheKey = location 
          ? weatherService['generateLocationCacheKey'](location)
          : weatherService['generateCacheKey'](lat || 54.4692, lon || -5.6342);
        const cached = localStorage.getItem(testCacheKey);
        wasFromCache = !!cached;
      }
      
      if (location) {
        weatherData = await weatherService.getWeatherByLocation(location, forceRefresh);
      } else {
        weatherData = await weatherService.getCurrentWeather(lat, lon, forceRefresh);
      }

      setWeather(weatherData);
      setLastUpdated(new Date());
      setIsCached(wasFromCache && !forceRefresh);
    } catch (err) {
      console.error('Weather fetch error:', err);
      
      // If API fails, try to use mock data for better UX
      if (import.meta.env.MODE === 'development') {
        console.warn('Using mock weather data due to API error');
        const mockData = weatherService.getMockWeatherData();
        setWeather(mockData);
        setLastUpdated(new Date());
        setIsCached(false);
        setError('Using demo data - API unavailable');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        setWeather(null);
        setIsCached(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchWeather();
  }, [lat, lon, location]);

  // Auto-refresh setup (only if explicitly enabled and interval provided)
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      fetchWeather(); // This will check cache first
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, lat, lon, location]);

  const refresh = async (): Promise<void> => {
    await fetchWeather(); // Will use cache if available and not expired
  };

  const forceRefresh = async (): Promise<void> => {
    await fetchWeather(true); // Forces fresh API call
  };

  return {
    weather,
    isLoading,
    error,
    refresh,
    forceRefresh,
    lastUpdated,
    isCached
  };
};