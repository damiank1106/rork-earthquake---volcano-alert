import createContextHook from '@nkzw/create-context-hook';
import { useQuery } from '@tanstack/react-query';
import { fetchEarthquakes } from '@/services/api';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useMemo } from 'react';
import { Earthquake } from '@/types';

export const [EarthquakesProvider, useEarthquakes] = createContextHook(() => {
  const { preferences } = usePreferences();

  const earthquakesQuery = useQuery({
    queryKey: ['earthquakes'],
    queryFn: () => fetchEarthquakes('all_day'),
    refetchInterval: preferences.pollingFrequency,
    enabled: preferences.earthquakesEnabled,
  });

  const earthquakes = useMemo(() => earthquakesQuery.data || [], [earthquakesQuery.data]);

  const significantEarthquakes = useMemo(() => {
    return earthquakes.filter((eq: Earthquake) => eq.magnitude >= 4.5);
  }, [earthquakes]);

  const recentEarthquakes = useMemo(() => {
    const oneHourAgo = Date.now() - 3600000;
    return earthquakes.filter((eq: Earthquake) => eq.time >= oneHourAgo);
  }, [earthquakes]);

  return useMemo(
    () => ({
      earthquakes,
      significantEarthquakes,
      recentEarthquakes,
      isLoading: earthquakesQuery.isLoading,
      isError: earthquakesQuery.isError,
      error: earthquakesQuery.error,
      refetch: earthquakesQuery.refetch,
    }),
    [earthquakes, significantEarthquakes, recentEarthquakes, earthquakesQuery.isLoading, earthquakesQuery.isError, earthquakesQuery.error, earthquakesQuery.refetch]
  );
});
