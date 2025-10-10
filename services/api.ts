import { Earthquake, TsunamiEvent, Volcano, NuclearPlant, PlateBoundary } from '@/types';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export const fetchEarthquakes = async (timeframe: string = 'all_day'): Promise<Earthquake[]> => {
  try {
    const response = await fetch(`${USGS_BASE_URL}/${timeframe}.geojson`);
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
    }));
  } catch (error) {
    console.error('Failed to fetch earthquakes:', error);
    return [];
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

export const formatTime = (timestamp: number, format: '12h' | '24h' = '12h'): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

export const fetchTsunamis = async (): Promise<TsunamiEvent[]> => {
  try {
    const response = await fetch('https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/tsunamis');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to fetch tsunamis:', error);
    return [];
  }
};

export const fetchVolcanoes = async (): Promise<Volcano[]> => {
  try {
    const response = await fetch('https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to fetch volcanoes:', error);
    return [];
  }
};

export const fetchNuclearPlants = async (): Promise<NuclearPlant[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/cristianst85/GeoNuclearData/master/data/nuclear_pp.geojson');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.features.map((feature: any) => ({
      id: feature.properties.id || feature.properties.name,
      name: feature.properties.name,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      country: feature.properties.country,
      status: feature.properties.status,
      capacity: feature.properties.capacity,
      type: feature.properties.type,
    }));
  } catch (error) {
    console.error('Failed to fetch nuclear plants:', error);
    return [];
  }
};

export const fetchPlateBoundaries = async (): Promise<PlateBoundary[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.features.map((feature: any) => ({
      type: feature.properties.LAYER as 'transform' | 'divergent' | 'convergent',
      coordinates: feature.geometry.coordinates[0] || feature.geometry.coordinates,
    }));
  } catch (error) {
    console.error('Failed to fetch plate boundaries:', error);
    return [];
  }
};
