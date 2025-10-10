import { Earthquake } from '@/types';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

type TimeRange = 'hour' | 'day' | 'week' | 'month';
type MagnitudeRange = 'significant' | 'all' | '4.5' | '2.5' | '1.0';

export const fetchEarthquakes = async (
  timeRange: TimeRange,
  magnitudeRange: MagnitudeRange
): Promise<Earthquake[]> => {
  const url = `${USGS_BASE_URL}/${magnitudeRange}_${timeRange}.geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.features.map((feature: any) => ({
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
      magError: feature.properties.magError,
      depthError: feature.properties.depthError,
      horizontalError: feature.properties.horizontalError,
      locationSource: feature.properties.net,
      magSource: feature.properties.net,
    }));
  } catch (error) {
    console.error('Failed to fetch earthquakes:', error);
    throw error;
  }
};

export const fetchVolcanoes = async (): Promise<any[]> => {
  console.log('Volcano fetching not implemented yet');
  return [];
};

export const formatTime = (timestamp: number, format: '12h' | '24h'): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${date.toLocaleDateString()} ${displayHours}:${minutes} ${period}`;
  }

  return `${date.toLocaleDateString()} ${hours.toString().padStart(2, '0')}:${minutes}`;
};

export const formatDepth = (depth: number, units: 'metric' | 'imperial'): string => {
  if (units === 'imperial') {
    const miles = depth * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${depth.toFixed(1)} km`;
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
