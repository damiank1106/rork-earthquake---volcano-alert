import { Earthquake, Volcano, TsunamiAlert, PlateBoundary, NuclearPlant } from '@/types';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export type TimeRange = 'hour' | 'day' | 'week' | 'month';
export type MagnitudeRange = 'significant' | 'all' | '4.5' | '2.5' | '1.0';

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

export const fetchVolcanoes = async (): Promise<Volcano[]> => {
  try {
    const url = 'https://raw.githubusercontent.com/datasets/volcano-global/master/data/volcano.csv';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const header = lines.shift();
    if (!header) return [];
    
    const cols = header.split(',');
    const nameIdx = cols.findIndex((c) => /volcano.*name/i.test(c) || c.toLowerCase() === 'name');
    const latIdx = cols.findIndex((c) => /latitude/i.test(c));
    const lonIdx = cols.findIndex((c) => /longitude/i.test(c));
    const countryIdx = cols.findIndex((c) => /country/i.test(c));
    const typeIdx = cols.findIndex((c) => /type/i.test(c));
    const elevIdx = cols.findIndex((c) => /elevation/i.test(c));
    const statusIdx = cols.findIndex((c) => /status/i.test(c));
    const lastEruptionIdx = cols.findIndex((c) => /last.*eruption/i.test(c));

    const volcanoes: Volcano[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(',');
      const lat = Number(parts[latIdx] ?? 0);
      const lon = Number(parts[lonIdx] ?? 0);
      if (Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0) {
        volcanoes.push({
          id: String(idx),
          name: (parts[nameIdx] ?? 'Unknown volcano').trim(),
          latitude: lat,
          longitude: lon,
          country: (parts[countryIdx] ?? 'Unknown').trim(),
          region: (parts[countryIdx] ?? 'Unknown').trim(),
          elevation: Number(parts[elevIdx] ?? 0),
          type: (parts[typeIdx] ?? 'Volcano').trim(),
          status: (parts[statusIdx] ?? 'active').trim().toLowerCase(),
          lastEruptionDate: parts[lastEruptionIdx] ?? undefined,
          activitySummary: undefined,
          alertLevel: undefined,
          vei: undefined,
          sources: ['Smithsonian GVP'],
          url: undefined,
        });
      }
    });
    return volcanoes;
  } catch (error) {
    console.error('Failed to fetch volcanoes:', error);
    return [];
  }
};

export const fetchTsunamiAlerts = async (): Promise<TsunamiAlert[]> => {
  try {
    const url = 'https://api.weather.gov/alerts/active?event=Tsunami';
    const response = await fetch(url, { headers: { Accept: 'application/geo+json' } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const features = Array.isArray(data.features) ? data.features : [];
    return features.map((f: any, idx: number) => {
      const props = f.properties ?? {};
      const geom = f.geometry ?? null;
      return {
        id: f.id?.toString() ?? String(idx),
        title: props.headline ?? props.event ?? 'Tsunami Alert',
        areaDescription: props.areaDesc ?? '',
        description: props.description ?? props.instruction ?? '',
        sent: props.sent ?? props.effective ?? props.onset ?? null,
        ends: props.ends ?? null,
        severity: props.severity ?? 'Unknown',
        certainty: props.certainty ?? 'Unknown',
        urgency: props.urgency ?? 'Unknown',
        event: props.event ?? 'Tsunami',
        geometry: geom,
      } as TsunamiAlert;
    });
  } catch (error) {
    console.error('Failed to fetch tsunami alerts:', error);
    return [];
  }
};

export const fetchPlateBoundaries = async (): Promise<PlateBoundary[]> => {
  try {
    const url = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const features = data.features ?? [];
    return features.map((f: any, i: number) => ({
      id: f.id?.toString() ?? String(i),
      coordinates: f.geometry?.coordinates ?? [],
      name: f.properties?.Name ?? 'Boundary',
      type: f.properties?.Type ?? 'Boundary',
    })) as PlateBoundary[];
  } catch (e) {
    console.error('Failed to fetch plate boundaries', e);
    return [];
  }
};

export const fetchNuclearPlants = async (): Promise<NuclearPlant[]> => {
  try {
    const url = 'https://raw.githubusercontent.com/plotly/datasets/master/nuclear_power_plants.csv';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const header = lines.shift();
    if (!header) return [];
    const cols = header.split(',');
    const latIdx = cols.findIndex((c) => /lat/i.test(c));
    const lonIdx = cols.findIndex((c) => /lon/i.test(c));
    const nameIdx = cols.findIndex((c) => /name/i.test(c));
    const countryIdx = cols.findIndex((c) => /country/i.test(c));

    const plants: NuclearPlant[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(',');
      const lat = Number(parts[latIdx] ?? 0);
      const lon = Number(parts[lonIdx] ?? 0);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        plants.push({
          id: String(idx),
          name: (parts[nameIdx] ?? 'Nuclear Plant').trim(),
          country: (parts[countryIdx] ?? 'Unknown').trim(),
          latitude: lat,
          longitude: lon,
        });
      }
    });
    return plants;
  } catch (e) {
    console.error('Failed to fetch nuclear plants', e);
    return [];
  }
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
