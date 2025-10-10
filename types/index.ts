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
  notificationsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  lastUpdated?: number;
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

export interface SortOption {
  field: 'time' | 'magnitude' | 'distance' | 'depth';
  direction: 'asc' | 'desc';
}

export interface TsunamiEvent {
  id: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  validity: string;
  tsunamiEventValidity: string;
  tsunamiCauseCode: number;
  earthquakeMagnitude: number;
  deposits: number;
  country: string;
  locationName: string;
  latitude: number;
  longitude: number;
  maximumWaterHeight: number;
  numberOfRunups: number;
  tsunamiMagnitude: number;
  tsunamiIntensity: number;
  deaths: number;
  deathDescription: number;
  missing: number;
  missingDescription: number;
  injuries: number;
  injuriesDescription: number;
  damageMillionsDollars: number;
  damageDescription: number;
  housesDestroyed: number;
  housesDestroyedDescription: number;
  housesDamaged: number;
  housesDamagedDescription: number;
  totalDeaths: number;
  totalDeathDescription: number;
  totalMissing: number;
  totalMissingDescription: number;
  totalInjuries: number;
  totalInjuriesDescription: number;
  totalDamageMillionsDollars: number;
  totalDamageDescription: number;
  totalHousesDestroyed: number;
  totalHousesDestroyedDescription: number;
  totalHousesDamaged: number;
  totalHousesDamagedDescription: number;
  comments: string;
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
  imageUrl?: string;
  latestNews?: string;
}

export interface NuclearPlant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  status: string;
  capacity: number;
  type: string;
}

export interface PlateBoundary {
  type: 'transform' | 'divergent' | 'convergent';
  coordinates: [number, number][];
}

export interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  type: 'earthquakes' | 'volcanoes' | 'heatmap' | 'plates' | 'nuclear';
}