import createContextHook from '@nkzw/create-context-hook';
import { useQuery } from '@tanstack/react-query';
import { fetchVolcanoes } from '@/services/api';
import { useMemo } from 'react';

export const [VolcanoesProvider, useVolcanoes] = createContextHook(() => {
  const volcanoesQuery = useQuery({
    queryKey: ['volcanoes'],
    queryFn: fetchVolcanoes,
  });

  return useMemo(
    () => ({
      volcanoes: volcanoesQuery.data || [],
      isLoading: volcanoesQuery.isLoading,
      isError: volcanoesQuery.isError,
      error: volcanoesQuery.error,
      refetch: volcanoesQuery.refetch,
    }),
    [volcanoesQuery.data, volcanoesQuery.isLoading, volcanoesQuery.isError, volcanoesQuery.error, volcanoesQuery.refetch]
  );
});
