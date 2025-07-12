export class StorageManager {
  private static readonly CACHE_PREFIX = 'weathora_';
  private static readonly DEFAULT_EXPIRY = 10 * 60 * 1000; // 10 minutes

  static set(key: string, value: any, expiryMs: number = this.DEFAULT_EXPIRY): void {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiry: Date.now() + expiryMs
      };
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.CACHE_PREFIX + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  static getLastLocation(): string | null {
    return this.get<string>('last_location');
  }

  static setLastLocation(location: string): void {
    this.set('last_location', location, 24 * 60 * 60 * 1000); // 24 hours
  }
}