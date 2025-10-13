import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  const requestLocationPermission = useCallback(async () => {
    try {
      setIsLoadingLocation(true);
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
      }
    } catch (error) {
      console.error('Failed to get location permission:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (mounted) {
        requestLocationPermission();
        loadSavedPlaces();
      }
    };
    init();
    return () => { mounted = false; };
  }, [requestLocationPermission]);

  const loadSavedPlaces = async () => {
    try {
      const places = await getSavedPlaces();
      setSavedPlaces(places);
    } catch (error) {
      setSavedPlaces([]);
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
