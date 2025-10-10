import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Earthquake } from '@/types';

interface NativeMapProps {
  earthquakes: Earthquake[];
  selectedMarker: Earthquake | null;
  onMarkerPress: (earthquake: Earthquake) => void;
  userLocation: { latitude: number; longitude: number } | null;
}

export default function NativeMap({ earthquakes, selectedMarker, onMarkerPress, userLocation }: NativeMapProps) {
  return <View style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
