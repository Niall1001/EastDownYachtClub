import React from 'react';
import { Wind, Droplets, Thermometer, Compass } from 'lucide-react';
const WeatherWidget = () => {
  return <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-[#1e3a8a]">
          Strangford Lough Weather
        </h4>
        <span className="text-xs text-gray-500">Updated: Today, 10:00 AM</span>
      </div>
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <img src="https://cdn-icons-png.flaticon.com/512/6974/6974833.png" alt="Partly cloudy" className="w-16 h-16" />
        </div>
        <div>
          <div className="text-3xl font-bold text-[#1e3a8a]">14°C</div>
          <div className="text-sm text-gray-600">Partly Cloudy</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center">
          <Wind size={16} className="mr-2 text-[#0284c7]" />
          <span>Wind: SW 12 knots</span>
        </div>
        <div className="flex items-center">
          <Compass size={16} className="mr-2 text-[#0284c7]" />
          <span>Gusts: 18 knots</span>
        </div>
        <div className="flex items-center">
          <Droplets size={16} className="mr-2 text-[#0284c7]" />
          <span>Humidity: 76%</span>
        </div>
        <div className="flex items-center">
          <Thermometer size={16} className="mr-2 text-[#0284c7]" />
          <span>Water: 12°C</span>
        </div>
      </div>
      <div className="mt-4 text-xs text-center text-gray-500">
        Data provided by Met Office
      </div>
    </div>;
};
export default WeatherWidget;