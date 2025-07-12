import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';

import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { AirQualityCard } from './components/AirQualityCard';


import { LoadingSpinner } from './components/LoadingSpinner';
import { TemperatureChart } from './components/TemperatureChart';
import { AstronomyCard } from './components/AstronomyCard';
import { DailyForecastCard } from './components/DailyForecastCard';
import { HourlyForecastCard } from './components/HourlyForecastCard';
import { AlertsCard } from './components/AlertsCard';
import { WeatherAPI } from './services/weatherApi';
import { WeatherResponse } from './types/api';
import { StorageManager } from './utils/storage';
import toast from 'react-hot-toast';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial location
    const savedLocation = StorageManager.getLastLocation();
    if (savedLocation) {
      handleLocationSelect(savedLocation);
    } else {
      getCurrentLocation();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationSelect(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to a default location
          handleLocationSelect('New York');
          toast.error('Unable to get your location. Showing New York weather.');
        }
      );
    } else {
      handleLocationSelect('New York');
      toast.error('Geolocation not supported. Showing New York weather.');
    }
  };

  const handleLocationSelect = async (location: string) => {
    if (!isOnline) {
      toast.error('Please check your internet connection');
      return;
    }

    setIsLoading(true);


    try {
            const data = await WeatherAPI.getForecastData(location, 3);
      setWeatherData(data);
      StorageManager.setLastLocation(location);
      toast.success(`Weather data loaded for ${data.location.name}`);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 py-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                  <img src="/weathora_logo_final.png" alt="Weathora Logo" className="w-16 h-16" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Weathora</h1>
                                    <p className="text-gray-300 text-sm">Weather App</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <SearchBar onLocationSelect={handleLocationSelect} isLoading={isLoading} />
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 pb-8 md:px-8">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner message="Fetching weather data..." />
              </div>
            ) : weatherData ? (
              <div className="space-y-8">
                {/* Weather Alerts */}
                {weatherData.alerts && weatherData.alerts.alert.length > 0 && (
                  <div className="animate-fade-in">
                    <AlertsCard alerts={weatherData.alerts.alert} />
                  </div>
                )}

                {/* Weather and Air Quality Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="animate-fade-in">
                    <WeatherCard data={weatherData} />
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <AirQualityCard data={weatherData} />
                  </div>
                </div>

                {/* Temperature Chart */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <TemperatureChart forecast={weatherData.forecast.forecastday} />
                </div>

                {/* Hourly Forecast */}
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <HourlyForecastCard forecast={weatherData.forecast.forecastday} />
                </div>

                {/* Astronomy and Daily Forecast Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <AstronomyCard data={weatherData} />
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <DailyForecastCard forecast={weatherData.forecast.forecastday} />
                  </div>
                </div>

                {/* <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                   <Globe onLocationSelect={handleLocationSelect} />
                </div> */}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <img src="/weathora_logo_final.png" alt="Weathora Logo" className="w-32 h-32 mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Weathora</h2>
                <p className="text-gray-300 max-w-md">
                  Search for any city or location to get real-time weather data, air quality information, 
                  and environmental insights.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-6 md:px-8 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-white font-semibold">Weathora</p>
                  <p className="text-gray-300 text-sm">
                    Powered by WeatherAPI
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-300 text-sm">
                    Real-time weather, air quality, and carbon footprint data
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    © 2025 Weathora. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;