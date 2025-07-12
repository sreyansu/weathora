import React from 'react';
import { ForecastDay } from '../types/api';

interface HourlyForecastCardProps {
  forecast: ForecastDay[];
}

export const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({ forecast }) => {
  const hourlyData = forecast[0].hour;

  return (
    <div className="bg-gradient-to-br from-cyan-700/20 to-cyan-800/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl h-full">
      <h3 className="text-2xl font-bold text-white mb-4">Hourly Forecast</h3>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {hourlyData.map((hour, index) => (
          <div key={index} className="flex-shrink-0 w-24 text-center bg-white/5 p-3 rounded-2xl">
            <p className="text-sm text-gray-300">
              {new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
            </p>
            <img src={`https:${hour.condition.icon}`} alt={hour.condition.text} className="w-10 h-10 mx-auto my-2" />
            <p className="font-semibold text-white">{Math.round(hour.temp_c)}°C</p>
            <p className="text-xs text-blue-300">{hour.chance_of_rain}% rain</p>
          </div>
        ))}
      </div>
    </div>
  );
};
