import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { useLocation } from '@/contexts/LocationContext';
import { useMapLayers } from '@/contexts/MapLayersContext';
import { MapOverlayPanel } from '@/components/MapOverlayPanel';
import NativeMap from '@/components/NativeMap';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { useQuery } from '@tanstack/react-query';
import { fetchVolcanoes, fetchNuclearPlants, fetchPlateBoundaries } from '@/services/api';
import { Earthquake } from '@/types';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { earthquakes, isLoading } = useEarthquakes();
  const { userLocation } = useLocation();
  const { layers, magnitudeFilter } = useMapLayers();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const slideAnim = useRef(new Animated.Value(280)).current;

  const volcanoesQuery = useQuery({
    queryKey: ['volcanoes'],
    queryFn: fetchVolcanoes,
    enabled: layers.find(l => l.id === 'volcanoes')?.enabled,
  });

  const nuclearQuery = useQuery({
    queryKey: ['nuclear'],
    queryFn: fetchNuclearPlants,
    enabled: layers.find(l => l.id === 'nuclear')?.enabled,
  });

  const platesQuery = useQuery({
    queryKey: ['plates'],
    queryFn: fetchPlateBoundaries,
    enabled: layers.find(l => l.id === 'plates')?.enabled,
  });

  const togglePanel = () => {
    const toValue = isPanelVisible ? 280 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsPanelVisible(!isPanelVisible);
  };

  const filteredEarthquakes = useMemo(() => {
    if (magnitudeFilter !== null) {
      const minMag = magnitudeFilter;
      const maxMag = magnitudeFilter + 1;
      return earthquakes.filter((eq: Earthquake) => eq.magnitude >= minMag && eq.magnitude < maxMag);
    }
    return earthquakes;
  }, [magnitudeFilter, earthquakes]);

  const handleMarkerPress = (id: string) => {
    setSelectedMarker(id);
  };

  const selectedEarthquake = filteredEarthquakes.find((eq: Earthquake) => eq.id === selectedMarker);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <NativeMap
        earthquakes={filteredEarthquakes}
        selectedMarker={selectedMarker}
        onMarkerPress={handleMarkerPress}
        userLocation={userLocation}
        volcanoes={volcanoesQuery.data || []}
        nuclearPlants={nuclearQuery.data || []}
        plateBoundaries={platesQuery.data || []}
        layers={layers}
      />

      <View style={[styles.header, { top: insets.top + SPACING.md }]}>
        <Text style={styles.headerTitle}>Seismic Monitor</Text>
        <Text style={styles.headerSubtitle}>{filteredEarthquakes.length} earthquakes</Text>
      </View>

      <TouchableOpacity style={[styles.panelToggle, { top: insets.top + 80 }]} onPress={togglePanel}>
        <Text style={styles.panelToggleText}>Layers</Text>
      </TouchableOpacity>

      <MapOverlayPanel
        isVisible={isPanelVisible}
        onToggle={togglePanel}
        slideAnim={slideAnim}
      />

      {selectedEarthquake && (
        <View style={styles.infoCard}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedMarker(null)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.infoMagnitude}>M {selectedEarthquake.magnitude.toFixed(1)}</Text>
          <Text style={styles.infoPlace}>{selectedEarthquake.place}</Text>
          <Text style={styles.infoDepth}>Depth: {selectedEarthquake.depth.toFixed(1)} km</Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    position: 'absolute',
    left: SPACING.md,
    backgroundColor: COLORS.surface.light + 'F0',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  panelToggle: {
    position: 'absolute',
    right: SPACING.md,
    backgroundColor: COLORS.surface.light + 'F0',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    zIndex: 10,
  },
  panelToggleText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary.light,
    fontWeight: FONT_WEIGHT.medium,
  },
  infoCard: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.surface.light,
    padding: SPACING.md,
    borderRadius: 12,
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text.secondary.light,
  },
  infoMagnitude: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary[600],
    marginBottom: SPACING.xs,
  },
  infoPlace: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.xs,
  },
  infoDepth: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
