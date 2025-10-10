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

const ACTIVE_VOLCANOES: Volcano[] = [
  // Philippines
  { id: 'ph-mayon', name: 'Mayon', latitude: 13.2578, longitude: 123.6853, country: 'Philippines', region: 'Albay', elevation: 2462, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2023', activitySummary: 'Frequent eruptions', alertLevel: 'watch', vei: 4, sources: ['PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/Mayon' },
  { id: 'ph-taal', name: 'Taal', latitude: 14.0023, longitude: 120.9933, country: 'Philippines', region: 'Batangas', elevation: 311, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2020', activitySummary: 'Lake-filled crater', alertLevel: 'advisory', vei: 6, sources: ['PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/Taal' },
  { id: 'ph-pinatubo', name: 'Pinatubo', latitude: 15.1300, longitude: 120.3500, country: 'Philippines', region: 'Zambales', elevation: 1486, type: 'Stratovolcano', status: 'active', lastEruptionDate: '1991', activitySummary: 'Major eruption in 1991', alertLevel: 'normal', vei: 6, sources: ['PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/Pinatubo' },
  { id: 'ph-bulusan', name: 'Bulusan', latitude: 12.7697, longitude: 124.0547, country: 'Philippines', region: 'Sorsogon', elevation: 1565, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2016', activitySummary: 'Steam emissions', alertLevel: 'normal', vei: 3, sources: ['PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/Bulusan' },
  { id: 'ph-kanlaon', name: 'Kanlaon', latitude: 10.4123, longitude: 123.1320, country: 'Philippines', region: 'Negros Occidental', elevation: 2435, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2016', activitySummary: 'Frequent ash emissions', alertLevel: 'advisory', vei: 4, sources: ['PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/Kanlaon' },
  { id: 'ph-hibok-hibok', name: 'Hibok-Hibok', latitude: 9.2033, longitude: 124.6722, country: 'Philippines', region: 'Camiguin', elevation: 1332, type: 'Stratovolcano', status: 'active', lastEruptionDate: '1951', activitySummary: 'Dormant but active', alertLevel: 'normal', vei: 4, sources: ['PHIVOLCS'], url: 'https://www.phivolcs.dost.gov.ph/volcano/HibokHibok' },
  // Other countries
  { id: 'jp-fuji', name: 'Mount Fuji', latitude: 35.3606, longitude: 138.7274, country: 'Japan', region: 'Honshu', elevation: 3776, type: 'Stratovolcano', status: 'active', lastEruptionDate: '1707', activitySummary: 'Last major eruption', alertLevel: 'normal', vei: 5, sources: ['Japan Meteorological Agency'], url: 'https://www.jma.go.jp/jma/en/Activities/fuji.html' },
  { id: 'it-vesuvius', name: 'Mount Vesuvius', latitude: 40.8214, longitude: 14.4263, country: 'Italy', region: 'Campania', elevation: 1281, type: 'Stratovolcano', status: 'active', lastEruptionDate: '1944', activitySummary: 'Famous for Pompeii', alertLevel: 'normal', vei: 5, sources: ['INGV'], url: 'https://www.ingv.it/en/volcanoes/monitoring/vesuvius.html' },
  { id: 'us-kilauea', name: 'Kilauea', latitude: 19.4069, longitude: -155.2834, country: 'United States', region: 'Hawaii', elevation: 1247, type: 'Shield Volcano', status: 'active', lastEruptionDate: '2023', activitySummary: 'Continuous activity', alertLevel: 'watch', vei: 0, sources: ['USGS'], url: 'https://www.usgs.gov/volcanoes/kilauea' },
  { id: 'it-etna', name: 'Mount Etna', latitude: 37.7510, longitude: 14.9934, country: 'Italy', region: 'Sicily', elevation: 3357, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2024', activitySummary: 'Most active in Europe', alertLevel: 'watch', vei: 4, sources: ['INGV'], url: 'https://www.ingv.it/en/volcanoes/monitoring/etna.html' },
  { id: 'id-krakatoa', name: 'Krakatoa', latitude: -6.1021, longitude: 105.4230, country: 'Indonesia', region: 'Sunda Strait', elevation: 813, type: 'Caldera', status: 'active', lastEruptionDate: '2020', activitySummary: '1883 catastrophic eruption', alertLevel: 'advisory', vei: 6, sources: ['PVMBG'], url: 'https://www.vsi.esdm.go.id/' },
  { id: 'us-st-helens', name: 'Mount St. Helens', latitude: 46.1914, longitude: -122.1956, country: 'United States', region: 'Washington', elevation: 2549, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2008', activitySummary: '1980 lateral blast', alertLevel: 'normal', vei: 5, sources: ['USGS'], url: 'https://www.usgs.gov/volcanoes/mount-st-helens' },
  { id: 'mx-popocatepetl', name: 'Popocatépetl', latitude: 19.0232, longitude: -98.6278, country: 'Mexico', region: 'Central Mexico', elevation: 5426, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2024', activitySummary: 'Near Mexico City', alertLevel: 'watch', vei: 6, sources: ['CENAPRED'], url: 'https://www.gob.mx/cenapred' },
  { id: 'is-eyjafjallajokull', name: 'Eyjafjallajökull', latitude: 63.6313, longitude: -19.6083, country: 'Iceland', region: 'Southern Iceland', elevation: 1651, type: 'Stratovolcano', status: 'active', lastEruptionDate: '2010', activitySummary: '2010 air traffic disruption', alertLevel: 'normal', vei: 4, sources: ['Icelandic Meteorological Office'], url: 'https://www.vedur.is/en/earthquakes-and-volcanism' },
  // Add more as needed
];

export const fetchVolcanoes = async (): Promise<Volcano[]> => {
  // Return static list since API is failing
  return ACTIVE_VOLCANOES;
};

const fetchNOAATsunamiAlerts = async (): Promise<TsunamiAlert[]> => {
  try {
    const url = 'https://api.weather.gov/alerts/active?event=Tsunami';
    const response = await fetch(url, { headers: { Accept: 'application/geo+json', 'User-Agent': 'EarthquakeApp/1.0' } });
    if (!response.ok) {
      console.warn(`NOAA Tsunami API error: ${response.status}`);
      return [];
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('json')) {
      console.warn('NOAA Tsunami API returned non-JSON response');
      return [];
    }
    const data = await response.json();
    const features = Array.isArray(data.features) ? data.features : [];
    return features.map((f: any, idx: number) => {
      const props = f.properties ?? {};
      const geom = f.geometry ?? null;
      return {
        id: `noaa-${f.id?.toString() ?? String(idx)}`,
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
        source: 'NOAA/NWS',
      } as TsunamiAlert;
    });
  } catch (error) {
    console.warn('Failed to fetch NOAA tsunami alerts:', error);
    return [];
  }
};

const fetchUSGSTsunamiData = async (): Promise<TsunamiAlert[]> => {
  try {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`USGS Tsunami data error: ${response.status}`);
      return [];
    }
    const data = await response.json();
    const features = Array.isArray(data.features) ? data.features : [];
    const tsunamiEvents = features.filter((f: any) => f.properties?.tsunami === 1);
    
    return tsunamiEvents.map((f: any, idx: number) => {
      const props = f.properties ?? {};
      const coords = f.geometry?.coordinates ?? [0, 0];
      return {
        id: `usgs-${f.id ?? String(idx)}`,
        title: `Tsunami-generating Earthquake: ${props.place ?? 'Unknown location'}`,
        areaDescription: props.place ?? 'Unknown location',
        description: `Magnitude ${props.mag} earthquake with tsunami potential. Time: ${new Date(props.time).toLocaleString()}`,
        sent: new Date(props.time).toISOString(),
        ends: null,
        severity: props.mag >= 7.5 ? 'Extreme' : props.mag >= 7.0 ? 'Severe' : 'Moderate',
        certainty: 'Observed',
        urgency: 'Immediate',
        event: 'Tsunami',
        geometry: {
          type: 'Point',
          coordinates: [coords[0], coords[1]],
        },
        source: 'USGS',
      } as TsunamiAlert;
    });
  } catch (error) {
    console.warn('Failed to fetch USGS tsunami data:', error);
    return [];
  }
};

const getPhilippinesTsunamiInfo = (): TsunamiAlert[] => {
  const philippinesAlerts: TsunamiAlert[] = [
    {
      id: 'ph-info-1',
      title: 'Philippines Tsunami Monitoring - PHIVOLCS',
      areaDescription: 'Philippines',
      description: 'The Philippine Institute of Volcanology and Seismology (PHIVOLCS) monitors tsunami threats in the Philippines. For real-time alerts, visit https://www.phivolcs.dost.gov.ph/ or follow their official social media channels. The Philippines is at risk from tsunamis generated by earthquakes in the Philippine Trench, Manila Trench, and other nearby subduction zones.',
      sent: new Date().toISOString(),
      ends: null,
      severity: 'Unknown',
      certainty: 'Unknown',
      urgency: 'Unknown',
      event: 'Information',
      geometry: {
        type: 'Point',
        coordinates: [121.7740, 12.8797],
      },
      source: 'PHIVOLCS',
    },
  ];
  return philippinesAlerts;
};

export const fetchTsunamiAlerts = async (): Promise<TsunamiAlert[]> => {
  try {
    const [noaaAlerts, usgsAlerts, phInfo] = await Promise.all([
      fetchNOAATsunamiAlerts(),
      fetchUSGSTsunamiData(),
      Promise.resolve(getPhilippinesTsunamiInfo()),
    ]);

    const allAlerts = [...noaaAlerts, ...usgsAlerts, ...phInfo];
    
    const uniqueAlerts = allAlerts.filter((alert, index, self) => 
      index === self.findIndex((a) => a.id === alert.id)
    );

    return uniqueAlerts.sort((a, b) => {
      const timeA = a.sent ? new Date(a.sent).getTime() : 0;
      const timeB = b.sent ? new Date(b.sent).getTime() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Failed to fetch tsunami alerts from all sources:', error);
    return getPhilippinesTsunamiInfo();
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

const MOCK_NUCLEAR_PLANTS: NuclearPlant[] = [
  { id: '1', name: 'Fukushima Daiichi', country: 'Japan', latitude: 37.4217, longitude: 141.0327 },
  { id: '2', name: 'Chernobyl', country: 'Ukraine', latitude: 51.3890, longitude: 30.0990 },
  { id: '3', name: 'Three Mile Island', country: 'United States', latitude: 40.1536, longitude: -76.7250 },
  { id: '4', name: 'Diablo Canyon', country: 'United States', latitude: 35.2111, longitude: -120.8522 },
  { id: '5', name: 'Palo Verde', country: 'United States', latitude: 33.3883, longitude: -112.8650 },
  { id: '6', name: 'Bruce Nuclear', country: 'Canada', latitude: 44.3333, longitude: -81.6000 },
  { id: '7', name: 'Gravelines', country: 'France', latitude: 51.0133, longitude: 2.1333 },
  { id: '8', name: 'Zaporizhzhia', country: 'Ukraine', latitude: 47.5147, longitude: 34.5858 },
  // Add more known plants
  { id: '9', name: 'Cattenom', country: 'France', latitude: 49.4167, longitude: 6.2167 },
  { id: '10', name: 'Sizewell B', country: 'United Kingdom', latitude: 52.2150, longitude: 1.6190 },
  { id: '11', name: 'Forsmark', country: 'Sweden', latitude: 60.3833, longitude: 18.1667 },
  { id: '12', name: 'Olkiluoto', country: 'Finland', latitude: 61.2333, longitude: 21.4333 },
  { id: '13', name: 'Kashiwazaki-Kariwa', country: 'Japan', latitude: 37.4333, longitude: 138.6000 },
  { id: '14', name: 'Limerick', country: 'United States', latitude: 40.2267, longitude: -75.5850 },
  { id: '15', name: 'Ringhals', country: 'Sweden', latitude: 57.2667, longitude: 12.1167 },
];

export const fetchNuclearPlants = async (): Promise<NuclearPlant[]> => {
  try {
    const url = 'https://raw.githubusercontent.com/plotly/datasets/master/nuclear_power_plants.csv';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.warn(`Nuclear plants API returned status ${res.status}, using mock data`);
      return MOCK_NUCLEAR_PLANTS;
    }
    
    const text = await res.text();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.warn('Nuclear plants API returned empty response, using mock data');
      return MOCK_NUCLEAR_PLANTS;
    }
    
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const header = lines.shift();
    if (!header) {
      console.warn('Nuclear plants API returned no header, using mock data');
      return MOCK_NUCLEAR_PLANTS;
    }
    
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
      if (Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0) {
        plants.push({
          id: String(idx),
          name: (parts[nameIdx] ?? 'Nuclear Plant').trim(),
          country: (parts[countryIdx] ?? 'Unknown').trim(),
          latitude: lat,
          longitude: lon,
        });
      }
    });
    
    if (plants.length === 0) {
      console.warn('Nuclear plants API returned no valid data, using mock data');
      return MOCK_NUCLEAR_PLANTS;
    }
    
    return plants;
  } catch (e) {
    console.warn('Failed to fetch nuclear plants, using mock data:', e);
    return MOCK_NUCLEAR_PLANTS;
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