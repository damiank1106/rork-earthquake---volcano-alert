import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Earthquake, Volcano, NuclearPlant, PlateBoundary, MapLayer } from '@/types';
import { COLORS } from '@/constants/theme';

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

const getMagnitudeColor = (magnitude: number): string => {
  if (magnitude < 2) return COLORS.magnitude.micro;
  if (magnitude < 3) return COLORS.magnitude.minor;
  if (magnitude < 4) return COLORS.magnitude.light;
  if (magnitude < 5) return COLORS.magnitude.moderate;
  if (magnitude < 6) return COLORS.magnitude.strong;
  if (magnitude < 7) return COLORS.magnitude.major;
  if (magnitude < 8) return COLORS.magnitude.great;
  return COLORS.magnitude.epic;
};

export default function NativeMap({
  earthquakes,
  selectedMarker,
  onMarkerPress,
  userLocation,
  volcanoes,
  nuclearPlants,
  layers,
}: NativeMapProps) {
  const initialRegion = {
    latitude: userLocation?.latitude || 0,
    longitude: userLocation?.longitude || 0,
    latitudeDelta: 50,
    longitudeDelta: 50,
  };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {earthquakes.map((earthquake) => (
        <Marker
          key={earthquake.id}
          coordinate={{
            latitude: earthquake.latitude,
            longitude: earthquake.longitude,
          }}
          onPress={() => onMarkerPress(earthquake.id)}
          pinColor={getMagnitudeColor(earthquake.magnitude)}
          opacity={selectedMarker === earthquake.id ? 1 : 0.7}
        />
      ))}

      {layers.find(l => l.id === 'volcanoes')?.enabled && volcanoes.map((volcano) => (
        <Marker
          key={volcano.id}
          coordinate={{
            latitude: volcano.latitude,
            longitude: volcano.longitude,
          }}
          pinColor="#FF6B00"
          title={volcano.name}
        />
      ))}

      {layers.find(l => l.id === 'nuclear')?.enabled && nuclearPlants.map((plant) => (
        <Marker
          key={plant.id}
          coordinate={{
            latitude: plant.latitude,
            longitude: plant.longitude,
          }}
          pinColor="#FFD700"
          title={plant.name}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
