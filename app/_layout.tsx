import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { EarthquakesProvider } from '@/contexts/EarthquakesContext';
import { MapLayersProvider } from '@/contexts/MapLayersContext';
import { VolcanoesProvider } from '@/contexts/VolcanoesContext';
import { useEffect } from 'react';
import { initDatabase } from '@/services/database';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 60000,
    },
  },
});

function RootLayoutNav() {
  useEffect(() => {
    initDatabase().catch((error) => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <LocationProvider>
          <MapLayersProvider>
            <EarthquakesProvider>
              <VolcanoesProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <RootLayoutNav />
                </GestureHandlerRootView>
              </VolcanoesProvider>
            </EarthquakesProvider>
          </MapLayersProvider>
        </LocationProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
