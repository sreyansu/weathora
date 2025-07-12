import React from 'react';
import { Wind, Droplets, Eye, Sun, Gauge } from 'lucide-react';
import { WeatherResponse } from '../types/api';

interface WeatherCardProps {
  data: WeatherResponse;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const { location, current } = data;

  const getUVIndexLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-400' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-400' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { level: 'Very High', color: 'text-red-400' };
    return { level: 'Extreme', color: 'text-purple-400' };
  };

  const uvInfo = getUVIndexLevel(current.uv);

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{location.name}</h2>
          <p className="text-gray-300">{location.region}, {location.country}</p>
          <p className="text-sm text-gray-400">{new Date(current.last_updated).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <img 
            src={`https:${current.condition.icon}`} 
            alt={current.condition.text}
            className="w-16 h-16 mb-2"
          />
          <p className="text-gray-300 text-sm">{current.condition.text}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-white">{Math.round(current.temp_c)}°C</span>
            <span className="text-lg text-gray-300">Feels like {Math.round(current.feelslike_c)}°C</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Wind className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-gray-300 text-sm">Wind</p>
            <p className="text-white font-semibold">{current.wind_kph} km/h</p>
            <p className="text-xs text-gray-400">{current.wind_dir}</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Droplets className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-gray-300 text-sm">Humidity</p>
            <p className="text-white font-semibold">{current.humidity}%</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Eye className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-gray-300 text-sm">Visibility</p>
            <p className="text-white font-semibold">{current.vis_km} km</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Sun className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-gray-300 text-sm">UV Index</p>
            <p className={`font-semibold ${uvInfo.color}`}>{current.uv} ({uvInfo.level})</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Gauge className="w-6 h-6 text-purple-400" />
          <div>
            <p className="text-gray-300 text-sm">Pressure</p>
            <p className="text-white font-semibold">{current.pressure_mb} mb</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Droplets className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-gray-300 text-sm">Precipitation</p>
            <p className="text-white font-semibold">{current.precip_mm} mm</p>
          </div>
        </div>
      </div>
    </div>
  );
};