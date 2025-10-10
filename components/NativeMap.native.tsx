import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getMagnitudeColor, FONT_WEIGHT } from '@/constants/theme';
import { Earthquake } from '@/types';

interface NativeMapProps {
  earthquakes: Earthquake[];
  selectedMarker: Earthquake | null;
  onMarkerPress: (earthquake: Earthquake) => void;
  userLocation: { latitude: number; longitude: number } | null;
}

export default function NativeMap({ earthquakes, selectedMarker, onMarkerPress, userLocation }: NativeMapProps) {
  const mapRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (selectedMarker && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedMarker.latitude,
        longitude: selectedMarker.longitude,
        latitudeDelta: 5,
        longitudeDelta: 5,
      });
    }
  }, [selectedMarker]);

  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 50,
        longitudeDelta: 50,
      }
    : {
        latitude: 20,
        longitude: 0,
        latitudeDelta: 100,
        longitudeDelta: 100,
      };

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={false}
    >
      {earthquakes.map((eq) => {
        const color = getMagnitudeColor(eq.magnitude);
        const size = Math.max(20, Math.min(eq.magnitude * 8, 60));

        return (
          <Marker
            key={eq.id}
            coordinate={{
              latitude: eq.latitude,
              longitude: eq.longitude,
            }}
            onPress={() => onMarkerPress(eq)}
            tracksViewChanges={false}
          >
            <View style={styles.markerContainer}>
              <Animated.View
                style={[
                  styles.pulse,
                  {
                    width: size * 2,
                    height: size * 2,
                    borderRadius: size,
                    backgroundColor: color + '30',
                    transform: [{ scale: selectedMarker?.id === eq.id ? pulseAnim : 1 }],
                  },
                ]}
              />
              <View
                style={[
                  styles.marker,
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                  },
                ]}
              >
                <Text style={[styles.markerText, { fontSize: size / 3 }]}>
                  {eq.magnitude.toFixed(1)}
                </Text>
              </View>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
  },
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerText: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.bold,
  },
});