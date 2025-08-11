/**
 * BLONG Location Service
 * Dynamic location data using REST Countries API and GeoDB Cities API
 */

// Free APIs for location data
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';
const GEODB_API = 'http://geodb-free-service.wirefreethought.com/v1/geo';

class LocationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Cache management
  getCacheKey(type, params) {
    return `${type}_${JSON.stringify(params)}`;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Get all countries
  async getCountries() {
    const cacheKey = this.getCacheKey('countries', {});
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${REST_COUNTRIES_API}/all?fields=name,cca2,flag`);
      const countries = await response.json();
      
      const formattedCountries = countries
        .map(country => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flag
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      this.setCache(cacheKey, formattedCountries);
      return formattedCountries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return this.getFallbackCountries();
    }
  }

  // Get regions/states for a country
  async getRegions(countryCode) {
    const cacheKey = this.getCacheKey('regions', { countryCode });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${GEODB_API}/countries/${countryCode}/regions?limit=100&sort=name`
      );
      const data = await response.json();
      
      const regions = data.data?.map(region => ({
        code: region.isoCode,
        name: region.name,
        countryCode: region.countryCode
      })) || [];

      this.setCache(cacheKey, regions);
      return regions;
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  }

  // Get cities for a region
  async getCities(countryCode, regionCode = null, namePrefix = '') {
    const cacheKey = this.getCacheKey('cities', { countryCode, regionCode, namePrefix });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      let url = `${GEODB_API}/places?countryIds=${countryCode}&types=CITY&limit=100&sort=name`;
      
      if (regionCode) {
        url += `&regionCode=${regionCode}`;
      }
      
      if (namePrefix) {
        url += `&namePrefix=${encodeURIComponent(namePrefix)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      const cities = data.data?.map(city => ({
        id: city.id,
        name: city.name,
        region: city.region,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        population: city.population
      })) || [];

      this.setCache(cacheKey, cities);
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  // Search places by name (for autocomplete)
  async searchPlaces(query, countryCode = null) {
    if (!query || query.length < 2) return [];

    const cacheKey = this.getCacheKey('search', { query, countryCode });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      let url = `${GEODB_API}/places?namePrefix=${encodeURIComponent(query)}&types=CITY&limit=20&sort=population&sortDir=DESC`;
      
      if (countryCode) {
        url += `&countryIds=${countryCode}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      const places = data.data?.map(place => ({
        id: place.id,
        name: place.name,
        region: place.region,
        country: place.country,
        fullName: `${place.name}, ${place.region}, ${place.country}`,
        latitude: place.latitude,
        longitude: place.longitude,
        population: place.population
      })) || [];

      this.setCache(cacheKey, places);
      return places;
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  // Get place details including districts/neighborhoods
  async getPlaceDetails(placeId) {
    const cacheKey = this.getCacheKey('place_details', { placeId });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${GEODB_API}/places/${placeId}`);
      const data = await response.json();
      
      const place = {
        id: data.data.id,
        name: data.data.name,
        region: data.data.region,
        country: data.data.country,
        latitude: data.data.latitude,
        longitude: data.data.longitude,
        population: data.data.population,
        timezone: data.data.timezone,
        elevation: data.data.elevationMeters
      };

      this.setCache(cacheKey, place);
      return place;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  // Validate postal code format by country
  validatePostalCode(postalCode, countryCode) {
    const patterns = {
      'US': /^\d{5}(-\d{4})?$/,
      'CA': /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      'GB': /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
      'DE': /^\d{5}$/,
      'FR': /^\d{5}$/,
      'AU': /^\d{4}$/,
      'JP': /^\d{3}-\d{4}$/,
      'IN': /^\d{6}$/,
      'BR': /^\d{5}-\d{3}$/,
      'MX': /^\d{5}$/,
      'AE': /^\d{5}$/,
      'SA': /^\d{5}$/,
      'EG': /^\d{5}$/
    };

    const pattern = patterns[countryCode];
    return pattern ? pattern.test(postalCode) : true; // Allow any format for unknown countries
  }

  // Fallback countries list
  getFallbackCountries() {
    return [
      { code: 'US', name: 'United States', flag: '🇺🇸' },
      { code: 'CA', name: 'Canada', flag: '🇨🇦' },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
      { code: 'AU', name: 'Australia', flag: '🇦🇺' },
      { code: 'DE', name: 'Germany', flag: '🇩🇪' },
      { code: 'FR', name: 'France', flag: '🇫🇷' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      { code: 'ES', name: 'Spain', flag: '🇪🇸' },
      { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
      { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
      { code: 'NO', name: 'Norway', flag: '🇳🇴' },
      { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
      { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
      { code: 'JP', name: 'Japan', flag: '🇯🇵' },
      { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
      { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
      { code: 'AE', name: 'UAE', flag: '🇦🇪' },
      { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
      { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
      { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
      { code: 'IN', name: 'India', flag: '🇮🇳' },
      { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
      { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
      { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
      { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
      { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
      { code: 'KE', name: 'Kenya', flag: '🇰🇪' }
    ];
  }
}

export const locationService = new LocationService();
