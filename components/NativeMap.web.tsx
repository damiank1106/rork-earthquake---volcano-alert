import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Earthquake, Volcano, NuclearPlant, PlateBoundary, MapLayer } from '@/types';
import { COLORS, SPACING, FONT_SIZE } from '@/constants/theme';

interface NativeMapProps {
  earthquakes: Earthquake[];
  selectedMarker: string | null;
  onMarkerPress: (id: string) => void;
  userLocation: { latitude: number; longitude: number } | null;
  volcanoes: Volcano[];
  nuclearPlants: NuclearPlant[];
  plateBoundaries: PlateBoundary[];
  layers: MapLayer[];
}

export default function NativeMap({
  earthquakes,
}: NativeMapProps) {
  return (
    <View style={styles.map}>
      <Text style={styles.placeholder}>
        Map view is available on mobile devices.{'\n'}
        {earthquakes.length} earthquakes loaded.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: COLORS.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});
