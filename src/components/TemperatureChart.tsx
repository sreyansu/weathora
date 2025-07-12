import React from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { ForecastDay } from '../types/api';

interface TemperatureChartProps {
  forecast: ForecastDay[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 text-white p-2 rounded-lg text-xs whitespace-nowrap pointer-events-none">
        <p className="font-semibold">{`${label}`}</p>
        <p>{`Temp: ${payload[0].value}°C`}</p>
      </div>
    );
  }
  return null;
};

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const hourlyData = forecast.flatMap(day => 
    day.hour.map(h => ({ 
      time: new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: h.temp_c 
    }))
  );

  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-4">3-Day Temperature Forecast</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 12 }} unit="°C" />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="temp" stroke="#8884d8" fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
