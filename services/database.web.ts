// Web fallback: disable expo-sqlite usage to avoid bundling WASM in Expo Web dev
// This provides an in-memory no-op implementation so the app can render on web
import { Earthquake, SavedPlace, AlertThreshold, UserPreferences } from '@/types';

let memory = {
  earthquakes: [] as Earthquake[],
  saved_places: [] as SavedPlace[],
  alert_thresholds: [] as AlertThreshold[],
  user_preferences: null as UserPreferences | null,
};

export const initDatabase = async (): Promise<void> => {
  console.log('[web-db] init (in-memory)');
};

export const getDatabase = () => {
  throw new Error('Web database is in-memory only. Use the exported helpers instead.');
};

export const cacheEarthquakes = async (earthquakes: Earthquake[]): Promise<void> => {
  memory.earthquakes = [...earthquakes];
  console.log(`[web-db] cached ${earthquakes.length} earthquakes`);
};

export const getCachedEarthquakes = async (
  minTime?: number,
  minMagnitude?: number
): Promise<Earthquake[]> => {
  let data = memory.earthquakes;
  if (typeof minTime === 'number') {
    data = data.filter((e) => e.time >= minTime);
  }
  if (typeof minMagnitude === 'number') {
    data = data.filter((e) => e.magnitude >= minMagnitude);
  }
  return data.sort((a, b) => b.time - a.time);
};

export const savePlaceToDb = async (place: SavedPlace): Promise<void> => {
  const idx = memory.saved_places.findIndex((p) => p.id === place.id);
  if (idx >= 0) memory.saved_places[idx] = place; else memory.saved_places.push(place);
};

export const getSavedPlaces = async (): Promise<SavedPlace[]> => {
  return [...memory.saved_places].sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteSavedPlace = async (id: string): Promise<void> => {
  memory.saved_places = memory.saved_places.filter((p) => p.id !== id);
};

export const saveAlertThreshold = async (threshold: AlertThreshold): Promise<void> => {
  const idx = memory.alert_thresholds.findIndex((t) => t.id === threshold.id);
  if (idx >= 0) memory.alert_thresholds[idx] = threshold; else memory.alert_thresholds.push(threshold);
};

export const getAlertThresholds = async (): Promise<AlertThreshold[]> => {
  return [...memory.alert_thresholds];
};

export const saveUserPreferences = async (prefs: UserPreferences): Promise<void> => {
  memory.user_preferences = { ...prefs };
};

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  return memory.user_preferences ? { ...memory.user_preferences } : null;
};
