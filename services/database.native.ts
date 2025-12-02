import * as SQLite from 'expo-sqlite';
import { Earthquake, SavedPlace, AlertThreshold, UserPreferences } from '@/types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('seismic_monitor.db');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS earthquakes (
        id TEXT PRIMARY KEY,
        time INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        magnitude REAL NOT NULL,
        magnitudeType TEXT,
        depth REAL NOT NULL,
        place TEXT NOT NULL,
        mmi REAL,
        tsunami INTEGER NOT NULL,
        url TEXT NOT NULL,
        source TEXT NOT NULL,
        status TEXT NOT NULL,
        type TEXT NOT NULL,
        felt INTEGER,
        cdi REAL,
        alert TEXT,
        sig INTEGER NOT NULL,
        net TEXT NOT NULL,
        code TEXT NOT NULL,
        ids TEXT NOT NULL,
        sources TEXT NOT NULL,
        types TEXT NOT NULL,
        nst INTEGER,
        dmin REAL,
        rms REAL,
        gap REAL,
        magError REAL,
        depthError REAL,
        horizontalError REAL,
        locationSource TEXT NOT NULL,
        magSource TEXT NOT NULL,
        cached_at INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_earthquakes_time ON earthquakes(time DESC);
      CREATE INDEX IF NOT EXISTS idx_earthquakes_magnitude ON earthquakes(magnitude DESC);
      CREATE INDEX IF NOT EXISTS idx_earthquakes_location ON earthquakes(latitude, longitude);
      
      CREATE TABLE IF NOT EXISTS volcanoes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        country TEXT NOT NULL,
        region TEXT NOT NULL,
        elevation REAL NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        lastEruptionDate TEXT,
        activitySummary TEXT,
        alertLevel TEXT,
        vei INTEGER,
        sources TEXT NOT NULL,
        url TEXT,
        cached_at INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_volcanoes_name ON volcanoes(name);
      CREATE INDEX IF NOT EXISTS idx_volcanoes_status ON volcanoes(status);
      
      CREATE TABLE IF NOT EXISTS saved_places (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        radius REAL NOT NULL,
        minMagnitude REAL NOT NULL,
        alertsEnabled INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS alert_thresholds (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        minMagnitude REAL NOT NULL,
        radius REAL,
        locationId TEXT,
        enabled INTEGER NOT NULL,
        earthquakesEnabled INTEGER NOT NULL,
        volcanoesEnabled INTEGER NOT NULL,
        FOREIGN KEY (locationId) REFERENCES saved_places(id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        units TEXT NOT NULL,
        timeFormat TEXT NOT NULL,
        pollingFrequency INTEGER NOT NULL,
        earthquakesEnabled INTEGER NOT NULL,
        volcanoesEnabled INTEGER NOT NULL,
        heatmapEnabled INTEGER NOT NULL,
        clusteringEnabled INTEGER NOT NULL,
        theme TEXT NOT NULL,
        notificationsEnabled INTEGER NOT NULL,
        notificationCountry TEXT,
        notificationMinMagnitude REAL,
        volcanoNotificationsEnabled INTEGER,
        volcanoNotificationCountry TEXT,
        lastUpdated INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS cache_metadata (
        key TEXT PRIMARY KEY,
        etag TEXT,
        lastModified TEXT,
        timestamp INTEGER NOT NULL
      );
    `);

    try {
      const columns = await db.getAllAsync<{ name: string }>(
        `PRAGMA table_info(user_preferences)`
      );
      const columnNames = columns.map(col => col.name);
      
      if (!columnNames.includes('notificationCountry')) {
        await db.execAsync(`
          ALTER TABLE user_preferences ADD COLUMN notificationCountry TEXT;
          ALTER TABLE user_preferences ADD COLUMN notificationMinMagnitude REAL;
        `);
        console.log('Migrated user_preferences table to new schema');
      }
      
      if (!columnNames.includes('volcanoNotificationsEnabled')) {
        await db.execAsync(`
          ALTER TABLE user_preferences ADD COLUMN volcanoNotificationsEnabled INTEGER;
          ALTER TABLE user_preferences ADD COLUMN volcanoNotificationCountry TEXT;
        `);
        console.log('Migrated user_preferences table to add volcano notification columns');
      }
      
      const hasOldColumns = columnNames.includes('quietHoursEnabled');
      if (hasOldColumns) {
        await db.execAsync(`
          CREATE TABLE user_preferences_new (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            units TEXT NOT NULL,
            timeFormat TEXT NOT NULL,
            pollingFrequency INTEGER NOT NULL,
            earthquakesEnabled INTEGER NOT NULL,
            volcanoesEnabled INTEGER NOT NULL,
            heatmapEnabled INTEGER NOT NULL,
            clusteringEnabled INTEGER NOT NULL,
            theme TEXT NOT NULL,
            notificationsEnabled INTEGER NOT NULL,
            notificationCountry TEXT,
            notificationMinMagnitude REAL,
            volcanoNotificationsEnabled INTEGER,
            volcanoNotificationCountry TEXT,
            lastUpdated INTEGER
          );
          
          INSERT INTO user_preferences_new 
            (id, units, timeFormat, pollingFrequency, earthquakesEnabled, volcanoesEnabled,
             heatmapEnabled, clusteringEnabled, theme, notificationsEnabled, lastUpdated)
          SELECT id, units, timeFormat, pollingFrequency, earthquakesEnabled, volcanoesEnabled,
                 heatmapEnabled, clusteringEnabled, theme, notificationsEnabled, lastUpdated
          FROM user_preferences;
          
          DROP TABLE user_preferences;
          ALTER TABLE user_preferences_new RENAME TO user_preferences;
        `);
        console.log('Migrated user_preferences from old schema');
      }
    } catch (migrationError) {
      console.log('Migration check/execution:', migrationError);
    }

    console.log('Database initialized and migrated successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const cacheEarthquakes = async (earthquakes: Earthquake[]): Promise<void> => {
  const database = getDatabase();
  const now = Date.now();

  try {
    await database.withTransactionAsync(async () => {
      for (const eq of earthquakes) {
        await database.runAsync(
          `INSERT OR REPLACE INTO earthquakes (
            id, time, latitude, longitude, magnitude, magnitudeType, depth, place,
            mmi, tsunami, url, source, status, type, felt, cdi, alert, sig,
            net, code, ids, sources, types, nst, dmin, rms, gap,
            magError, depthError, horizontalError, locationSource, magSource, cached_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            eq.id,
            eq.time,
            eq.latitude,
            eq.longitude,
            eq.magnitude,
            eq.magnitudeType,
            eq.depth,
            eq.place,
            eq.mmi ?? null,
            eq.tsunami ? 1 : 0,
            eq.url,
            eq.source,
            eq.status,
            eq.type,
            eq.felt ?? null,
            eq.cdi ?? null,
            eq.alert ?? null,
            eq.sig,
            eq.net,
            eq.code,
            eq.ids,
            eq.sources,
            eq.types,
            eq.nst ?? null,
            eq.dmin ?? null,
            eq.rms ?? null,
            eq.gap ?? null,
            eq.magError ?? null,
            eq.depthError ?? null,
            eq.horizontalError ?? null,
            eq.locationSource,
            eq.magSource,
            now,
          ]
        );
      }
    });

    const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
    await database.runAsync('DELETE FROM earthquakes WHERE cached_at < ?', [threeDaysAgo]);

    console.log(`Cached ${earthquakes.length} earthquakes`);
  } catch (error) {
    console.error('Failed to cache earthquakes:', error);
    throw error;
  }
};

export const getCachedEarthquakes = async (
  minTime?: number,
  minMagnitude?: number
): Promise<Earthquake[]> => {
  const database = getDatabase();

  try {
    let query = 'SELECT * FROM earthquakes WHERE 1=1';
    const params: (number | string)[] = [];

    if (minTime) {
      query += ' AND time >= ?';
      params.push(minTime);
    }

    if (minMagnitude) {
      query += ' AND magnitude >= ?';
      params.push(minMagnitude);
    }

    query += ' ORDER BY time DESC';

    const rows = await database.getAllAsync<{
      id: string;
      time: number;
      latitude: number;
      longitude: number;
      magnitude: number;
      magnitudeType: string;
      depth: number;
      place: string;
      mmi: number | null;
      tsunami: number;
      url: string;
      source: string;
      status: string;
      type: string;
      felt: number | null;
      cdi: number | null;
      alert: string | null;
      sig: number;
      net: string;
      code: string;
      ids: string;
      sources: string;
      types: string;
      nst: number | null;
      dmin: number | null;
      rms: number | null;
      gap: number | null;
      magError: number | null;
      depthError: number | null;
      horizontalError: number | null;
      locationSource: string;
      magSource: string;
    }>(query, params);

    return rows.map((row) => ({
      ...row,
      mmi: row.mmi ?? undefined,
      tsunami: row.tsunami === 1,
      felt: row.felt ?? undefined,
      cdi: row.cdi ?? undefined,
      alert: (row.alert as 'green' | 'yellow' | 'orange' | 'red' | undefined) ?? undefined,
      nst: row.nst ?? undefined,
      dmin: row.dmin ?? undefined,
      rms: row.rms ?? undefined,
      gap: row.gap ?? undefined,
      magError: row.magError ?? undefined,
      depthError: row.depthError ?? undefined,
      horizontalError: row.horizontalError ?? undefined,
    }));
  } catch (error) {
    console.error('Failed to get cached earthquakes:', error);
    return [];
  }
};

export const savePlaceToDb = async (place: SavedPlace): Promise<void> => {
  const database = getDatabase();

  try {
    await database.runAsync(
      `INSERT OR REPLACE INTO saved_places (id, name, latitude, longitude, radius, minMagnitude, alertsEnabled, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        place.id,
        place.name,
        place.latitude,
        place.longitude,
        place.radius,
        place.minMagnitude,
        place.alertsEnabled ? 1 : 0,
        place.createdAt,
      ]
    );
    console.log(`Saved place: ${place.name}`);
  } catch (error) {
    console.error('Failed to save place:', error);
    throw error;
  }
};

export const getSavedPlaces = async (): Promise<SavedPlace[]> => {
  const database = getDatabase();

  try {
    const rows = await database.getAllAsync<{
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      radius: number;
      minMagnitude: number;
      alertsEnabled: number;
      createdAt: number;
    }>('SELECT * FROM saved_places ORDER BY createdAt DESC');

    return rows.map((row) => ({
      ...row,
      alertsEnabled: row.alertsEnabled === 1,
    }));
  } catch (error) {
    console.error('Failed to get saved places:', error);
    return [];
  }
};

export const deleteSavedPlace = async (id: string): Promise<void> => {
  const database = getDatabase();

  try {
    await database.runAsync('DELETE FROM saved_places WHERE id = ?', [id]);
    console.log(`Deleted place: ${id}`);
  } catch (error) {
    console.error('Failed to delete place:', error);
    throw error;
  }
};

export const saveAlertThreshold = async (threshold: AlertThreshold): Promise<void> => {
  const database = getDatabase();

  try {
    await database.runAsync(
      `INSERT OR REPLACE INTO alert_thresholds (id, type, minMagnitude, radius, locationId, enabled, earthquakesEnabled, volcanoesEnabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        threshold.id,
        threshold.type,
        threshold.minMagnitude,
        threshold.radius ?? null,
        threshold.locationId ?? null,
        threshold.enabled ? 1 : 0,
        threshold.earthquakesEnabled ? 1 : 0,
        threshold.volcanoesEnabled ? 1 : 0,
      ]
    );
    console.log(`Saved alert threshold: ${threshold.id}`);
  } catch (error) {
    console.error('Failed to save alert threshold:', error);
    throw error;
  }
};

export const getAlertThresholds = async (): Promise<AlertThreshold[]> => {
  const database = getDatabase();

  try {
    const rows = await database.getAllAsync<{
      id: string;
      type: string;
      minMagnitude: number;
      radius: number | null;
      locationId: string | null;
      enabled: number;
      earthquakesEnabled: number;
      volcanoesEnabled: number;
    }>('SELECT * FROM alert_thresholds');

    return rows.map((row) => ({
      ...row,
      type: row.type as 'global' | 'location',
      radius: row.radius ?? undefined,
      locationId: row.locationId ?? undefined,
      enabled: row.enabled === 1,
      earthquakesEnabled: row.earthquakesEnabled === 1,
      volcanoesEnabled: row.volcanoesEnabled === 1,
    }));
  } catch (error) {
    console.error('Failed to get alert thresholds:', error);
    return [];
  }
};

export const saveUserPreferences = async (prefs: UserPreferences): Promise<void> => {
  const database = getDatabase();

  try {
    await database.runAsync(
      `INSERT OR REPLACE INTO user_preferences (
        id, units, timeFormat, pollingFrequency, earthquakesEnabled, volcanoesEnabled,
        heatmapEnabled, clusteringEnabled, theme, lastUpdated
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prefs.units,
        prefs.timeFormat,
        prefs.pollingFrequency,
        prefs.earthquakesEnabled ? 1 : 0,
        prefs.volcanoesEnabled ? 1 : 0,
        prefs.heatmapEnabled ? 1 : 0,
        prefs.clusteringEnabled ? 1 : 0,
        prefs.theme,
        prefs.lastUpdated ?? null,
      ]
    );
    console.log('Saved user preferences');
  } catch (error) {
    console.error('Failed to save user preferences:', error);
    throw error;
  }
};

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const database = getDatabase();

  try {
    const row = await database.getFirstAsync<{
      units: string;
      timeFormat: string;
      pollingFrequency: number;
      earthquakesEnabled: number;
      volcanoesEnabled: number;
      heatmapEnabled: number;
      clusteringEnabled: number;
      theme: string;
      lastUpdated: number | null;
    }>('SELECT * FROM user_preferences WHERE id = 1');

    if (!row) return null;

    return {
      units: row.units as 'metric' | 'imperial',
      timeFormat: row.timeFormat as '12h' | '24h',
      pollingFrequency: row.pollingFrequency,
      earthquakesEnabled: row.earthquakesEnabled === 1,
      volcanoesEnabled: row.volcanoesEnabled === 1,
      heatmapEnabled: row.heatmapEnabled === 1,
      clusteringEnabled: row.clusteringEnabled === 1,
      theme: row.theme as 'light' | 'dark' | 'auto',
      lastUpdated: row.lastUpdated ?? undefined,
    };
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    return null;
  }
};
