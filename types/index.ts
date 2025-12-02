export interface Earthquake {
  id: string;
  time: number;
  latitude: number;
  longitude: number;
  magnitude: number;
  magnitudeType: string;
  depth: number;
  place: string;
  mmi?: number;
  tsunami: boolean;
  url: string;
  source: string;
  status: string;
  type: string;
  felt?: number;
  cdi?: number;
  alert?: 'green' | 'yellow' | 'orange' | 'red';
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst?: number;
  dmin?: number;
  rms?: number;
  gap?: number;
  magError?: number;
  depthError?: number;
  horizontalError?: number;
  locationSource: string;
  magSource: string;
}

export interface Volcano {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  elevation: number;
  type: string;
  status: string;
  lastEruptionDate?: string;
  activitySummary?: string;
  alertLevel?: 'normal' | 'advisory' | 'watch' | 'warning';
  vei?: number;
  sources: string[];
  url?: string;
  category: 'active' | 'super';
  description?: string;
  calderaSize?: string;
  lastMajorEruption?: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  minMagnitude: number;
  alertsEnabled: boolean;
  createdAt: number;
}

export interface AlertThreshold {
  id: string;
  type: 'global' | 'location';
  minMagnitude: number;
  radius?: number;
  locationId?: string;
  enabled: boolean;
  earthquakesEnabled: boolean;
  volcanoesEnabled: boolean;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  timeFormat: '12h' | '24h';
  pollingFrequency: number;
  earthquakesEnabled: boolean;
  volcanoesEnabled: boolean;
  heatmapEnabled: boolean;
  clusteringEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  lastUpdated?: number;
}

export interface EarthquakeFilter {
  minMagnitude: number;
  maxMagnitude: number;
  minDepth: number;
  maxDepth: number;
  timeWindow: 'hour' | 'day' | 'week' | 'month';
  region?: string;
  maxDistance?: number;
  significantOnly: boolean;
}

export interface SortOption {
  field: 'time' | 'magnitude' | 'distance' | 'depth';
  direction: 'asc' | 'desc';
}

export interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  type: 'earthquakes' | 'volcanoes' | 'heatmap' | 'plates' | 'nuclear';
}

export interface NotificationPayload {
  eventId: string;
  eventType: 'earthquake' | 'volcano';
  title: string;
  body: string;
  data: {
    magnitude?: number;
    place?: string;
    distance?: number;
    latitude: number;
    longitude: number;
  };
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

export interface APIResponse<T> {
  data: T;
  etag?: string;
  lastModified?: string;
}

export interface EarthquakeAPIResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: {
    type: string;
    properties: {
      mag: number;
      place: string;
      time: number;
      updated: number;
      tz?: number;
      url: string;
      detail: string;
      felt?: number;
      cdi?: number;
      mmi?: number;
      alert?: 'green' | 'yellow' | 'orange' | 'red';
      status: string;
      tsunami: number;
      sig: number;
      net: string;
      code: string;
      ids: string;
      sources: string;
      types: string;
      nst?: number;
      dmin?: number;
      rms?: number;
      gap?: number;
      magType: string;
      type: string;
      title: string;
    };
    geometry: {
      type: string;
      coordinates: [number, number, number];
    };
    id: string;
  }[];
  bbox: [number, number, number, number, number, number];
}

export interface MagnitudeInfo {
  value: number;
  label: string;
  description: string;
  effects: string;
  frequency: string;
  color: string;
  examples: string[];
}

export interface SafetyGuide {
  id: string;
  title: string;
  category: 'before' | 'during' | 'after';
  eventType: 'earthquake' | 'volcano' | 'both';
  icon: string;
  steps: string[];
  sources: string[];
}

export interface EducationContent {
  magnitudeScale: MagnitudeInfo[];
  safetyGuides: SafetyGuide[];
}

export interface TsunamiAlert {
  id: string;
  title: string;
  areaDescription: string;
  description: string;
  sent: string | null;
  ends: string | null;
  severity: string;
  certainty: string;
  urgency: string;
  event: string;
  geometry: any;
  source?: string;
}

export interface PlateBoundary {
  id: string;
  name: string;
  type: string;
  coordinates: any[];
}

export interface NuclearPlant {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface VolcanoWarning {
  id: string;
  volcanoName: string;
  country: string;
  region: string;
  alertLevel: 'normal' | 'advisory' | 'watch' | 'warning';
  activityType: string;
  description: string;
  lastUpdate: string;
  source: string;
  latitude?: number;
  longitude?: number;
}
