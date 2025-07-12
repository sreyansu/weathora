import React from 'react';
import { ForecastDay } from '../types/api';

interface DailyForecastCardProps {
  forecast: ForecastDay[];
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ forecast }) => {
  return (
    <div className="bg-gradient-to-br from-purple-700/20 to-purple-800/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl h-full">
      <h3 className="text-2xl font-bold text-white mb-4">3-Day Forecast</h3>
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl">
            <div className="flex items-center space-x-4">
              <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} className="w-10 h-10" />
              <div>
                <p className="font-semibold text-white">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p className="text-sm text-gray-300">{day.day.condition.text}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">{Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
