import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserPreferences } from '@/types';
import { getUserPreferences, saveUserPreferences } from '@/services/database';

const DEFAULT_PREFERENCES: UserPreferences = {
  units: 'metric',
  timeFormat: '12h',
  pollingFrequency: 300000,
  earthquakesEnabled: true,
  volcanoesEnabled: false,
  heatmapEnabled: false,
  clusteringEnabled: true,
  theme: 'light',
  notificationsEnabled: true,
  notificationCountry: undefined,
  notificationMinMagnitude: 5.0,
  volcanoNotificationsEnabled: true,
  volcanoNotificationCountry: undefined,
  showMapLegend: true,
};

export const [PreferencesProvider, usePreferences] = createContextHook(() => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await getUserPreferences();
      if (saved) {
        setPreferences(saved);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...updates, lastUpdated: Date.now() };
    setPreferences(updated);

    try {
      await saveUserPreferences(updated);
      console.log('Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  return useMemo(
    () => ({
      preferences,
      updatePreferences,
      isLoading,
    }),
    [preferences, updatePreferences, isLoading]
  );
});