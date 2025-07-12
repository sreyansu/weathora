import React from 'react';
import { Sunrise, Sunset, Moon } from 'lucide-react';
import { WeatherResponse } from '../types/api';

interface AstronomyCardProps {
  data: WeatherResponse;
}

export const AstronomyCard: React.FC<AstronomyCardProps> = ({ data }) => {
  const astro = data.forecast.forecastday[0].astro;

  return (
    <div className="bg-gradient-to-br from-gray-700/20 to-gray-800/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl h-full">
      <h3 className="text-2xl font-bold text-white mb-4">Astronomy</h3>
      <div className="grid grid-cols-2 gap-4 text-white">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Sunrise className="w-8 h-8 text-yellow-400" />
          <div>
            <p className="text-gray-300 text-sm">Sunrise</p>
            <p className="font-semibold text-lg">{astro.sunrise}</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Sunset className="w-8 h-8 text-orange-400" />
          <div>
            <p className="text-gray-300 text-sm">Sunset</p>
            <p className="font-semibold text-lg">{astro.sunset}</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Moon className="w-8 h-8 text-gray-300" />
          <div>
            <p className="text-gray-300 text-sm">Moonrise</p>
            <p className="font-semibold text-lg">{astro.moonrise}</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
          <Moon className="w-8 h-8 text-gray-300" />
          <div>
            <p className="text-gray-300 text-sm">Moonset</p>
            <p className="font-semibold text-lg">{astro.moonset}</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 col-span-2">
          <p className="text-gray-300 text-sm text-center">Moon Phase</p>
          <p className="font-semibold text-lg text-center">{astro.moon_phase}</p>
        </div>
      </div>
    </div>
  );
};
