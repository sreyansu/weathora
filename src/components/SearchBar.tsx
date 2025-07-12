import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { WeatherAPI } from '../services/weatherApi';
import { SearchSuggestion } from '../types/api';
import toast from 'react-hot-toast';

interface SearchBarProps {
  onLocationSelect: (location: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const justSelected = useRef(false);
  const debounceRef = useRef<number>();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (justSelected.current) {
      justSelected.current = false;
      return;
    }

    if (query.length >= 3) {
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await WeatherAPI.searchLocations(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          toast.error('Failed to search locations');
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    justSelected.current = true;
    setQuery(`${suggestion.name}, ${suggestion.country}`);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(`${suggestion.lat},${suggestion.lon}`);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onLocationSelect(query.trim());
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for cities, coordinates, or locations..."
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            disabled={isLoading}
          />
          {(isSearching || isLoading) && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden z-50 shadow-2xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3 text-white border-b border-white/5 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-sm text-gray-300">
                  {suggestion.region && `${suggestion.region}, `}{suggestion.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};