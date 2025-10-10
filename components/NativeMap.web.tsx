import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Earthquake, PlateBoundary, Volcano, NuclearPlant } from '@/types';

interface NativeMapProps {
  earthquakes: Earthquake[];
  selectedMarker: Earthquake | null;
  onMarkerPress: (earthquake: Earthquake) => void;
  userLocation: { latitude: number; longitude: number } | null;
  plateBoundaries?: PlateBoundary[];
  volcanoes?: Volcano[];
  nuclearPlants?: NuclearPlant[];
  showPlateBoundaries?: boolean;
  showVolcanoes?: boolean;
  showNuclearPlants?: boolean;
  heatmapEnabled?: boolean;
  clusteringEnabled?: boolean;
}

export default function NativeMap({}: NativeMapProps) {
  return <View style={styles.map} testID="web-map-placeholder" />;
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
