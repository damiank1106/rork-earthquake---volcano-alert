import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Earthquake } from '@/types';
import { fetchEarthquakes } from '@/services/api';
import { cacheEarthquakes, getCachedEarthquakes } from '@/services/database';
import { usePreferences } from './PreferencesContext';

export const [EarthquakesProvider, useEarthquakes] = createContextHook(() => {
  const { preferences } = usePreferences();
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const earthquakesQuery = useQuery({
    queryKey: ['earthquakes', 'day', 'all'],
    queryFn: async () => {
      try {
        const data = await fetchEarthquakes('day', 'all');
        await cacheEarthquakes(data);
        setLastUpdated(Date.now());
        return data;
      } catch (error) {
        console.error('Failed to fetch earthquakes, using cache:', error);
        const cached = await getCachedEarthquakes();
        return cached;
      }
    },
    refetchInterval: preferences.pollingFrequency,
    staleTime: 60000,
  });

  const earthquakes = useMemo(() => {
    return earthquakesQuery.data || [];
  }, [earthquakesQuery.data]);

  const significantEarthquakes = useMemo(() => {
    return earthquakes.filter((eq) => eq.sig >= 600 || eq.magnitude >= 5.5);
  }, [earthquakes]);

  const recentEarthquakes = useMemo(() => {
    const oneHourAgo = Date.now() - 3600000;
    return earthquakes.filter((eq) => eq.time >= oneHourAgo);
  }, [earthquakes]);

  const { refetch: queryRefetch } = earthquakesQuery;

  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  const selectEarthquake = useCallback((earthquake: Earthquake | null) => {
    setSelectedEarthquake(earthquake);
  }, []);

  return useMemo(
    () => ({
      earthquakes,
      significantEarthquakes,
      recentEarthquakes,
      selectedEarthquake,
      selectEarthquake,
      isLoading: earthquakesQuery.isLoading,
      isError: earthquakesQuery.isError,
      error: earthquakesQuery.error,
      refetch,
      lastUpdated,
    }),
    [
      earthquakes,
      significantEarthquakes,
      recentEarthquakes,
      selectedEarthquake,
      selectEarthquake,
      earthquakesQuery.isLoading,
      earthquakesQuery.isError,
      earthquakesQuery.error,
      refetch,
      lastUpdated,
    ]
  );
});
