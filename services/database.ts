import { Platform } from 'react-native';
import type { Earthquake, SavedPlace, AlertThreshold, UserPreferences } from '@/types';
import * as NativeDb from './database.native';
import * as WebDb from './database.web';

// Select implementation at runtime to avoid importing expo-sqlite on web
// This prevents bundling the wa-sqlite.wasm file in web builds

type DbModule = typeof import('./database.native');
const impl: DbModule = Platform.OS === 'web' ? (WebDb as unknown as DbModule) : NativeDb;

export const initDatabase: () => Promise<void> = impl.initDatabase;
export const getDatabase: () => any = impl.getDatabase as unknown as () => any;
export const cacheEarthquakes: (earthquakes: Earthquake[]) => Promise<void> = impl.cacheEarthquakes;
export const getCachedEarthquakes: (
  minTime?: number,
  minMagnitude?: number
) => Promise<Earthquake[]> = impl.getCachedEarthquakes;
export const savePlaceToDb: (place: SavedPlace) => Promise<void> = impl.savePlaceToDb;
export const getSavedPlaces: () => Promise<SavedPlace[]> = impl.getSavedPlaces;
export const deleteSavedPlace: (id: string) => Promise<void> = impl.deleteSavedPlace;
export const saveAlertThreshold: (threshold: AlertThreshold) => Promise<void> = impl.saveAlertThreshold;
export const getAlertThresholds: () => Promise<AlertThreshold[]> = impl.getAlertThresholds;
export const saveUserPreferences: (prefs: UserPreferences) => Promise<void> = impl.saveUserPreferences;
export const getUserPreferences: () => Promise<UserPreferences | null> = impl.getUserPreferences;
