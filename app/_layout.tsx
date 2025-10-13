import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from '@/services/database';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { EarthquakesProvider } from '@/contexts/EarthquakesContext';
import { trpc, trpcClient } from '@/lib/trpc';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", animation: 'fade' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="loading" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}



export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing database...');
      await initDatabase();
      console.log('Database initialized successfully');
    } catch (err) {
      console.error('Failed to initialize app:', err);
    } finally {
      setIsReady(true);
      SplashScreen.hideAsync().catch(console.error);
    }
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <LocationProvider>
            <EarthquakesProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                {isReady ? <RootLayoutNav /> : null}
              </GestureHandlerRootView>
            </EarthquakesProvider>
          </LocationProvider>
        </PreferencesProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

