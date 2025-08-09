import React, { useState } from 'react';
import { Wind, Droplets, Thermometer, Navigation, RefreshCw, AlertCircle, Database } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { weatherService } from '../../services/weatherService';

const WeatherWidget: React.FC = () => {
  const { weather, isLoading, error, refresh, forceRefresh, lastUpdated, isCached } = useWeather({
    location: 'Strangford Lough,GB'
  });
  
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const handleForceRefresh = async () => {
    setIsForceRefreshing(true);
    try {
      await forceRefresh();
    } finally {
      setIsForceRefreshing(false);
    }
  };

  if (isLoading && !weather) {
    return (
      <div className="bg-gradient-to-br from-maritime-mist/20 to-maritime-mist/10 p-4 rounded-lg border border-maritime-silver/20">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center gap-3 text-maritime-slate-600">
            <RefreshCw size={20} className="animate-spin" />
            <span>Loading weather...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
        <div className="flex items-center gap-3 text-red-700 mb-3">
          <AlertCircle size={18} />
          <span className="font-semibold">Weather Unavailable</span>
        </div>
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button 
          onClick={refresh}
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-maritime-mist/20 to-maritime-mist/10 p-6 rounded-xl border border-maritime-silver/20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-maritime-midnight text-lg">
          Current Conditions
        </h4>
        <div className="flex items-center gap-2">
          {isCached && (
            <div className="flex items-center gap-1 text-maritime-slate-400" title="Data from cache (refreshes every 12 hours)">
              <Database size={12} />
            </div>
          )}
          <span className="text-xs text-maritime-slate-500">
            {formatLastUpdated(lastUpdated)}
          </span>
          <button
            onClick={handleForceRefresh}
            className="text-maritime-slate-400 hover:text-maritime-deep-navy transition-colors"
            title="Refresh weather data"
            disabled={isForceRefreshing}
          >
            <RefreshCw size={14} className={isForceRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="mr-4">
          <img 
            src={weatherService.getWeatherIconUrl(weather.icon, '4x')} 
            alt={weather.description}
            className="w-16 h-16"
          />
        </div>
        <div>
          <div className="text-3xl font-bold text-maritime-deep-navy">
            {weather.temperature}°C
          </div>
          <div className="text-sm text-maritime-slate-600 capitalize">
            {weather.description}
          </div>
          <div className="text-xs text-maritime-slate-500 mt-1">
            Feels like {weather.feelsLike}°C
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center p-3 bg-white/50 rounded-lg">
          <Wind size={16} className="mr-2 text-maritime-royal" />
          <div>
            <div className="font-medium text-maritime-deep-navy">
              {weather.windSpeed} kts
            </div>
            <div className="text-maritime-slate-500 text-xs">
              Wind {weather.windDirection}
            </div>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white/50 rounded-lg">
          <Navigation size={16} className="mr-2 text-maritime-royal" />
          <div>
            <div className="font-medium text-maritime-deep-navy">
              {weather.windDirectionDegrees}°
            </div>
            <div className="text-maritime-slate-500 text-xs">Direction</div>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white/50 rounded-lg">
          <Droplets size={16} className="mr-2 text-maritime-royal" />
          <div>
            <div className="font-medium text-maritime-deep-navy">
              {weather.humidity}%
            </div>
            <div className="text-maritime-slate-500 text-xs">Humidity</div>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white/50 rounded-lg">
          <Thermometer size={16} className="mr-2 text-maritime-royal" />
          <div>
            <div className="font-medium text-maritime-deep-navy">
              {weather.visibility} km
            </div>
            <div className="text-maritime-slate-500 text-xs">Visibility</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center text-xs text-maritime-slate-400">
        <span>Data provided by OpenWeatherMap</span>
        {isCached && (
          <span className="text-maritime-slate-400">
            Cached • Updates every 12h
          </span>
        )}
      </div>
    </div>
  );
};
export default WeatherWidget;