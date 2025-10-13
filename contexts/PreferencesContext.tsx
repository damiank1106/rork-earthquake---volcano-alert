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
  notificationsEnabled: false,
  notificationCountry: undefined,
  notificationMinMagnitude: 5.0,
  volcanoNotificationsEnabled: false,
  volcanoNotificationCountry: undefined,
  customIconColor: '#000000',
  customGlowColor: '#60a5fa',
  customPlateBoundaryColor: '#ef4444',
};

export const [PreferencesProvider, usePreferences] = createContextHook(() => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    let mounted = true;
    loadPreferences(mounted);
    return () => { mounted = false; };
  }, []);

  const loadPreferences = async (mounted: boolean) => {
    try {
      const saved = await getUserPreferences();
      if (saved && mounted) {
        setPreferences(saved);
      } else if (mounted) {
        setPreferences(DEFAULT_PREFERENCES);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      if (mounted) {
        setPreferences(DEFAULT_PREFERENCES);
      }
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
    }),
    [preferences, updatePreferences]
  );
});