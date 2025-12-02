import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { SavedPlace } from '@/types';
import { getSavedPlaces, savePlaceToDb, deleteSavedPlace } from '@/services/database';
import { generateId } from '@/utils/helpers';

export const [LocationProvider, useLocation] = createContextHook(() => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);

  const requestLocationPermission = useCallback(async () => {
    try {
      setIsLoadingLocation(true);
      
      if (Platform.OS === 'web') {
        // Use native browser geolocation API on web
        if ('geolocation' in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
              });
            });
            setLocationPermission(true);
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            console.log('Web location obtained:', position.coords.latitude, position.coords.longitude);
          } catch (geoError: unknown) {
            const error = geoError as GeolocationPositionError;
            console.log('Web geolocation error code:', error.code, 'message:', error.message);
            setLocationPermission(false);
            // Set a default location (San Francisco) when permission denied
            setUserLocation({
              latitude: 37.7749,
              longitude: -122.4194,
            });
          }
        } else {
          console.log('Geolocation not supported on this browser');
          setLocationPermission(false);
          setUserLocation({
            latitude: 37.7749,
            longitude: -122.4194,
          });
        }
      } else {
        // Use expo-location on native platforms
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          console.log('Native location obtained:', location.coords.latitude, location.coords.longitude);
        } else {
          // Set a default location when permission denied
          setUserLocation({
            latitude: 37.7749,
            longitude: -122.4194,
          });
        }
      }
    } catch (error) {
      console.log('Location request failed, using default location:', error);
      setLocationPermission(false);
      // Set a default location on error
      setUserLocation({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    requestLocationPermission();
    loadSavedPlaces();
  }, [requestLocationPermission]);

  const loadSavedPlaces = async () => {
    try {
      const places = await getSavedPlaces();
      setSavedPlaces(places);
    } catch (error) {
      console.error('Failed to load saved places:', error);
    }
  };

  const addPlace = useCallback(
    async (
      name: string,
      latitude: number,
      longitude: number,
      radius: number = 100,
      minMagnitude: number = 4.0
    ) => {
      const newPlace: SavedPlace = {
        id: generateId(),
        name,
        latitude,
        longitude,
        radius,
        minMagnitude,
        alertsEnabled: true,
        createdAt: Date.now(),
      };

      try {
        await savePlaceToDb(newPlace);
        setSavedPlaces((prev) => [newPlace, ...prev]);
        console.log(`Added place: ${name}`);
      } catch (error) {
        console.error('Failed to add place:', error);
        throw error;
      }
    },
    []
  );

  const removePlace = useCallback(async (id: string) => {
    try {
      await deleteSavedPlace(id);
      setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
      console.log(`Removed place: ${id}`);
    } catch (error) {
      console.error('Failed to remove place:', error);
      throw error;
    }
  }, []);

  const updatePlace = useCallback(async (place: SavedPlace) => {
    try {
      await savePlaceToDb(place);
      setSavedPlaces((prev) => prev.map((p) => (p.id === place.id ? place : p)));
      console.log(`Updated place: ${place.name}`);
    } catch (error) {
      console.error('Failed to update place:', error);
      throw error;
    }
  }, []);

  return useMemo(
    () => ({
      userLocation,
      locationPermission,
      savedPlaces,
      isLoadingLocation,
      addPlace,
      removePlace,
      updatePlace,
      refreshLocation: requestLocationPermission,
    }),
    [
      userLocation,
      locationPermission,
      savedPlaces,
      isLoadingLocation,
      addPlace,
      removePlace,
      updatePlace,
      requestLocationPermission,
    ]
  );
});
