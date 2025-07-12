import axios from 'axios';
import { WeatherResponse, SearchSuggestion } from '../types/api';

const API_KEY = 'dbf17f050fba4dc0887164126251207';
const BASE_URL = 'https://api.weatherapi.com/v1';

export class WeatherAPI {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private static getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private static isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  static async getCurrentWeather(location: string): Promise<WeatherResponse> {
    const cacheKey = this.getCacheKey('current', { location });
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${BASE_URL}/current.json`, {
        params: {
          key: API_KEY,
          q: location,
          aqi: 'yes'
        }
      });

      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Failed to fetch weather data. Please try again.');
    }
  }

  static async searchLocations(query: string): Promise<SearchSuggestion[]> {
    if (query.length < 3) return [];

    const cacheKey = this.getCacheKey('search', { query });
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${BASE_URL}/search.json`, {
        params: {
          key: API_KEY,
          q: query
        }
      });

      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      console.error('Search API Error:', error);
      return [];
    }
  }

  static async getForecastData(location: string, days: number = 3): Promise<WeatherResponse> {
    const cacheKey = this.getCacheKey('forecast', { location, days });
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${BASE_URL}/forecast.json`, {
        params: {
          key: API_KEY,
          q: location,
          days,
          aqi: 'yes',
          alerts: 'yes'
        }
      });

      this.cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    } catch (error) {
      console.error('Forecast API Error:', error);
      throw new Error('Failed to fetch forecast data.');
    }
  }

  static async getAstronomyData(location: string) {
    try {
      const response = await axios.get(`${BASE_URL}/astronomy.json`, {
        params: {
          key: API_KEY,
          q: location,
          dt: new Date().toISOString().split('T')[0]
        }
      });
      return response.data;
    } catch (error) {
      console.error('Astronomy API Error:', error);
      return null;
    }
  }
}