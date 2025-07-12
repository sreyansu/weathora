import React from 'react';
import { Shield, AlertTriangle, XCircle } from 'lucide-react';
import { WeatherResponse } from '../types/api';

interface AirQualityCardProps {
  data: WeatherResponse;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ data }) => {
  const { current } = data;
  const aqi = current.air_quality;

  const getAQIInfo = (index: number) => {
    if (index <= 50) {
      return {
        level: 'Good',
        description: 'Air quality is satisfactory',
        color: 'text-green-400',
        bgColor: 'from-green-500/20 to-green-600/10',
        icon: Shield
      };
    } else if (index <= 100) {
      return {
        level: 'Moderate',
        description: 'Air quality is acceptable',
        color: 'text-yellow-400',
        bgColor: 'from-yellow-500/20 to-yellow-600/10',
        icon: Shield
      };
    } else if (index <= 150) {
      return {
        level: 'Unhealthy for Sensitive Groups',
        description: 'Sensitive people may experience symptoms',
        color: 'text-orange-400',
        bgColor: 'from-orange-500/20 to-orange-600/10',
        icon: AlertTriangle
      };
    } else if (index <= 200) {
      return {
        level: 'Unhealthy',
        description: 'Everyone may experience health effects',
        color: 'text-red-400',
        bgColor: 'from-red-500/20 to-red-600/10',
        icon: XCircle
      };
    } else {
      return {
        level: 'Very Unhealthy',
        description: 'Health alert: everyone may experience serious effects',
        color: 'text-purple-400',
        bgColor: 'from-purple-500/20 to-purple-600/10',
        icon: XCircle
      };
    }
  };

  const aqiInfo = getAQIInfo(aqi['us-epa-index']);
  const Icon = aqiInfo.icon;

  const pollutants = [
    { name: 'PM2.5', value: aqi.pm2_5, unit: 'μg/m³', max: 35 },
    { name: 'PM10', value: aqi.pm10, unit: 'μg/m³', max: 150 },
    { name: 'NO₂', value: aqi.no2, unit: 'μg/m³', max: 100 },
    { name: 'SO₂', value: aqi.so2, unit: 'μg/m³', max: 350 },
    { name: 'CO', value: aqi.co, unit: 'μg/m³', max: 10000 },
    { name: 'O₃', value: aqi.o3, unit: 'μg/m³', max: 180 }
  ];

  return (
    <div className={`bg-gradient-to-br ${aqiInfo.bgColor} backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl h-full`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Air Quality Index</h3>
          <div className="flex items-center space-x-3">
            <Icon className={`w-6 h-6 ${aqiInfo.color}`} />
            <span className={`text-lg font-semibold ${aqiInfo.color}`}>{aqiInfo.level}</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">{aqiInfo.description}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${aqiInfo.color}`}>
            {aqi['us-epa-index']}
          </div>
          <div className="text-sm text-gray-300">US EPA Index</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pollutants.map((pollutant) => {
          const percentage = Math.min((pollutant.value / pollutant.max) * 100, 100);
          const isHigh = percentage > 70;
          
          return (
            <div key={pollutant.name} className="bg-white/5 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm font-medium">{pollutant.name}</span>
                <span className={`text-sm font-semibold ${isHigh ? 'text-red-400' : 'text-green-400'}`}>
                  {pollutant.value.toFixed(1)} {pollutant.unit}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isHigh ? 'bg-red-400' : percentage > 40 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-2xl">
        <h4 className="text-white font-semibold mb-2">Health Recommendations</h4>
        <div className="text-sm text-gray-300">
          {aqi['us-epa-index'] <= 50 && "Great day for outdoor activities!"}
          {aqi['us-epa-index'] > 50 && aqi['us-epa-index'] <= 100 && "Sensitive individuals should consider reducing prolonged outdoor exertion."}
          {aqi['us-epa-index'] > 100 && aqi['us-epa-index'] <= 150 && "Sensitive groups should avoid outdoor activities."}
          {aqi['us-epa-index'] > 150 && "Everyone should avoid outdoor activities and keep windows closed."}
        </div>
      </div>
    </div>
  );
};