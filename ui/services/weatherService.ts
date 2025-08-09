export interface WeatherData {
  temperature: number;
  description: string;
  windSpeed: number;
  windDirection: string;
  windDirectionDegrees: number;
  humidity: number;
  visibility: number;
  feelsLike: number;
  pressure: number;
  icon: string;
  location: string;
  lastUpdated: string;
}

export interface WeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
  expiresAt: number;
}

class WeatherService {
  private readonly API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  private readonly CACHE_KEY_PREFIX = 'edyc_weather_';
  
  // Coordinates for Strangford Lough area (East Down Yacht Club location)
  private readonly DEFAULT_LAT = 54.4692;
  private readonly DEFAULT_LON = -5.6342;

  private getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private convertMpsToKnots(mps: number): number {
    return Math.round(mps * 1.94384);
  }

  private formatVisibility(visibility: number): number {
    // Convert from meters to kilometers and round
    return Math.round(visibility / 1000);
  }

  private generateCacheKey(lat: number, lon: number): string {
    return `${this.CACHE_KEY_PREFIX}${lat.toFixed(4)}_${lon.toFixed(4)}`;
  }

  private generateLocationCacheKey(location: string): string {
    return `${this.CACHE_KEY_PREFIX}location_${location.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  }

  private getCachedWeather(cacheKey: string): WeatherData | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cachedData: CachedWeatherData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now < cachedData.expiresAt) {
        console.log('Using cached weather data');
        return cachedData.data;
      }

      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
      return null;
    } catch (error) {
      console.error('Error reading weather cache:', error);
      return null;
    }
  }

  private setCachedWeather(cacheKey: string, data: WeatherData): void {
    try {
      const now = Date.now();
      const cachedData: CachedWeatherData = {
        data,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION
      };

      localStorage.setItem(cacheKey, JSON.stringify(cachedData));
      console.log(`Weather data cached for 12 hours`);
    } catch (error) {
      console.error('Error caching weather data:', error);
    }
  }

  private clearExpiredCache(): void {
    try {
      const keys = Object.keys(localStorage);
      const weatherKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      const now = Date.now();

      weatherKeys.forEach(key => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cachedData: CachedWeatherData = JSON.parse(cached);
            if (now >= cachedData.expiresAt) {
              localStorage.removeItem(key);
              console.log(`Removed expired cache: ${key}`);
            }
          }
        } catch (error) {
          // If parsing fails, remove the corrupted cache entry
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }

  private transformApiResponse(data: WeatherApiResponse): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      windSpeed: this.convertMpsToKnots(data.wind.speed),
      windDirection: this.getWindDirection(data.wind.deg),
      windDirectionDegrees: data.wind.deg,
      humidity: data.main.humidity,
      visibility: this.formatVisibility(data.visibility),
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      icon: data.weather[0].icon,
      location: data.name,
      lastUpdated: new Date().toISOString()
    };
  }

  async getCurrentWeather(lat?: number, lon?: number, forceRefresh: boolean = false): Promise<WeatherData> {
    const latitude = lat || this.DEFAULT_LAT;
    const longitude = lon || this.DEFAULT_LON;
    const cacheKey = this.generateCacheKey(latitude, longitude);

    // Clear expired cache entries periodically
    this.clearExpiredCache();

    // Check cache first (unless forced refresh)
    if (!forceRefresh) {
      const cachedData = this.getCachedWeather(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // If no API key, return mock data
    if (!this.API_KEY) {
      console.warn('No OpenWeather API key configured, using mock data');
      const mockData = this.getMockWeatherData();
      // Cache mock data for consistency
      this.setCachedWeather(cacheKey, mockData);
      return mockData;
    }

    try {
      console.log('Fetching fresh weather data from API');
      const url = `${this.BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const apiData: WeatherApiResponse = await response.json();
      const weatherData = this.transformApiResponse(apiData);
      
      // Cache the fresh data
      this.setCachedWeather(cacheKey, weatherData);
      
      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      
      // Try to return cached data even if expired as fallback
      const cachedData = this.getCachedWeather(cacheKey);
      if (cachedData) {
        console.warn('API failed, using stale cached data');
        return cachedData;
      }
      
      throw error;
    }
  }

  async getWeatherByLocation(location: string, forceRefresh: boolean = false): Promise<WeatherData> {
    const cacheKey = this.generateLocationCacheKey(location);

    // Clear expired cache entries periodically
    this.clearExpiredCache();

    // Check cache first (unless forced refresh)
    if (!forceRefresh) {
      const cachedData = this.getCachedWeather(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // If no API key, return mock data
    if (!this.API_KEY) {
      console.warn('No OpenWeather API key configured, using mock data');
      const mockData = this.getMockWeatherData();
      // Cache mock data for consistency
      this.setCachedWeather(cacheKey, mockData);
      return mockData;
    }

    try {
      console.log(`Fetching fresh weather data for location: ${location}`);
      const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${this.API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const apiData: WeatherApiResponse = await response.json();
      const weatherData = this.transformApiResponse(apiData);
      
      // Cache the fresh data
      this.setCachedWeather(cacheKey, weatherData);
      
      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data by location:', error);
      
      // Try to return cached data even if expired as fallback
      const cachedData = this.getCachedWeather(cacheKey);
      if (cachedData) {
        console.warn('API failed, using stale cached data');
        return cachedData;
      }
      
      throw error;
    }
  }

  // Get weather icon URL from OpenWeatherMap
  getWeatherIconUrl(icon: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
  }

  // Clear all weather cache
  clearWeatherCache(): void {
    try {
      const keys = Object.keys(localStorage);
      const weatherKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      weatherKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`Cleared ${weatherKeys.length} weather cache entries`);
    } catch (error) {
      console.error('Error clearing weather cache:', error);
    }
  }

  // Get cache information for debugging
  getCacheInfo(): Array<{key: string, location: string, expiresAt: Date, isExpired: boolean}> {
    try {
      const keys = Object.keys(localStorage);
      const weatherKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      const now = Date.now();

      return weatherKeys.map(key => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cachedData: CachedWeatherData = JSON.parse(cached);
            return {
              key,
              location: cachedData.data.location,
              expiresAt: new Date(cachedData.expiresAt),
              isExpired: now >= cachedData.expiresAt
            };
          }
        } catch (error) {
          console.error(`Error parsing cache entry ${key}:`, error);
        }
        return {
          key,
          location: 'Unknown',
          expiresAt: new Date(),
          isExpired: true
        };
      });
    } catch (error) {
      console.error('Error getting cache info:', error);
      return [];
    }
  }

  // Fallback mock data for development/testing
  getMockWeatherData(): WeatherData {
    return {
      temperature: 14,
      description: 'partly cloudy',
      windSpeed: 12,
      windDirection: 'SW',
      windDirectionDegrees: 225,
      humidity: 76,
      visibility: 10,
      feelsLike: 12,
      pressure: 1013,
      icon: '02d',
      location: 'Strangford Lough',
      lastUpdated: new Date().toISOString()
    };
  }
}

export const weatherService = new WeatherService();