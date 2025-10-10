import { Earthquake, EarthquakeAPIResponse } from '@/types';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Fetching: ${url} (attempt ${i + 1}/${maxRetries})`);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;
      console.error(`Fetch attempt ${i + 1} failed:`, error);

      if (i < maxRetries - 1) {
        const backoffMs = Math.min(1000 * Math.pow(2, i), 10000);
        console.log(`Retrying in ${backoffMs}ms...`);
        await sleep(backoffMs);
      }
    }
  }

  throw lastError || new Error('Failed to fetch data');
}

export const fetchEarthquakes = async (
  timeWindow: 'hour' | 'day' | 'week' | 'month' = 'day',
  minMagnitude: 'all' | 'significant' | '4.5' | '2.5' | '1.0' = 'all'
): Promise<Earthquake[]> => {
  try {
    const endpoint = `${USGS_BASE_URL}/${minMagnitude}_${timeWindow}.geojson`;
    const response = await fetchWithRetry<EarthquakeAPIResponse>(endpoint);

    console.log(`Fetched ${response.features.length} earthquakes from USGS`);

    return response.features.map((feature) => ({
      id: feature.id,
      time: feature.properties.time,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      magnitude: feature.properties.mag,
      magnitudeType: feature.properties.magType,
      depth: feature.geometry.coordinates[2],
      place: feature.properties.place,
      mmi: feature.properties.mmi,
      tsunami: feature.properties.tsunami === 1,
      url: feature.properties.url,
      source: feature.properties.net,
      status: feature.properties.status,
      type: feature.properties.type,
      felt: feature.properties.felt,
      cdi: feature.properties.cdi,
      alert: feature.properties.alert,
      sig: feature.properties.sig,
      net: feature.properties.net,
      code: feature.properties.code,
      ids: feature.properties.ids,
      sources: feature.properties.sources,
      types: feature.properties.types,
      nst: feature.properties.nst,
      dmin: feature.properties.dmin,
      rms: feature.properties.rms,
      gap: feature.properties.gap,
      magError: undefined,
      depthError: undefined,
      horizontalError: undefined,
      locationSource: feature.properties.net,
      magSource: feature.properties.net,
    }));
  } catch (error) {
    console.error('Failed to fetch earthquakes:', error);
    throw error;
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (km: number, units: 'metric' | 'imperial'): string => {
  if (units === 'imperial') {
    const miles = km * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${km.toFixed(1)} km`;
};

export const formatDepth = (km: number, units: 'metric' | 'imperial'): string => {
  if (units === 'imperial') {
    const miles = km * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${km.toFixed(1)} km`;
};

export const formatTime = (
  timestamp: number,
  format: '12h' | '24h' = '12h'
): string => {
  const date = new Date(timestamp);
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h',
  };

  return date.toLocaleString('en-US', options);
};

export const formatFullTime = (
  timestamp: number,
  format: '12h' | '24h' = '12h'
): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: format === '12h',
    timeZoneName: 'short',
  };

  return date.toLocaleString('en-US', options);
};
