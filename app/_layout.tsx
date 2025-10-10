import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase } from '@/services/database';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { EarthquakesProvider } from '@/contexts/EarthquakesContext';
import { COLORS } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing database...');
      await initDatabase();
      console.log('Database initialized successfully');
      setIsReady(true);
      await SplashScreen.hideAsync();
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError('Failed to initialize app. Please restart.');
      await SplashScreen.hideAsync();
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <LocationProvider>
          <EarthquakesProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </EarthquakesProvider>
        </LocationProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.dark,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.primary.dark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.dark,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.alert.red,
    textAlign: 'center',
  },
});
