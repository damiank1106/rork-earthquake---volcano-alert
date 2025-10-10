import React, { useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import { getMagnitudeColor, FONT_WEIGHT } from '@/constants/theme';
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

export default function NativeMap({ earthquakes, selectedMarker, onMarkerPress, userLocation, plateBoundaries = [], volcanoes = [], nuclearPlants = [], showPlateBoundaries = false, showVolcanoes = false, showNuclearPlants = false, heatmapEnabled = false, clusteringEnabled = true }: NativeMapProps) {
  const mapRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
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
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 50, longitudeDelta: 50 }
    : { latitude: 20, longitude: 0, latitudeDelta: 100, longitudeDelta: 100 };

  const clusters = useMemo(() => {
    return earthquakes.reduce((acc: { lat: number; lon: number; count: number; maxMag: number }[], e) => {
      const keyLat = Math.round(e.latitude * 2) / 2;
      const keyLon = Math.round(e.longitude * 2) / 2;
      const idx = acc.findIndex((c) => c.lat === keyLat && c.lon === keyLon);
      if (idx >= 0) {
        acc[idx].count += 1;
        acc[idx].maxMag = Math.max(acc[idx].maxMag, e.magnitude);
      } else {
        acc.push({ lat: keyLat, lon: keyLon, count: 1, maxMag: e.magnitude });
      }
      return acc;
    }, []);
  }, [earthquakes]);

  return (
    <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} showsUserLocation={true} showsMyLocationButton={false}>
      {showPlateBoundaries && plateBoundaries.map((b) => (
        <Polyline
          key={`pb-${b.id}`}
          coordinates={Array.isArray(b.coordinates) ? b.coordinates.map((c: any) => ({ latitude: c[1], longitude: c[0] })) : []}
          strokeColor="#3B82F6"
          strokeWidth={2}
        />
      ))}

      {showVolcanoes && volcanoes.map((v) => (
        <Marker key={`vol-${v.id}`} coordinate={{ latitude: v.latitude, longitude: v.longitude }}>
          <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
        </Marker>
      ))}

      {showNuclearPlants && nuclearPlants.map((n) => (
        <Marker key={`np-${n.id}`} coordinate={{ latitude: n.latitude, longitude: n.longitude }}>
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
        </Marker>
      ))}

      {heatmapEnabled && earthquakes.map((eq) => (
        <Circle
          key={`heat-${eq.id}`}
          center={{ latitude: eq.latitude, longitude: eq.longitude }}
          radius={Math.max(5000, Math.min(40000, eq.magnitude * 8000))}
          strokeColor="transparent"
          fillColor={`rgba(239,68,68,${0.05 + Math.min(0.45, eq.magnitude / 20)})`}
        />
      ))}

      {clusteringEnabled && (clusters.length > 0 ? clusters : []).map((c, i) => (
        <Marker key={`cl-${i}`} coordinate={{ latitude: c.lat, longitude: c.lon }}>
          <View style={[styles.cluster, { backgroundColor: getMagnitudeColor(c.maxMag) }]}>
            <Text style={styles.clusterText}>{c.count}</Text>
          </View>
        </Marker>
      ))}

      {earthquakes.map((eq) => {
        const color = getMagnitudeColor(eq.magnitude);
        const size = Math.max(20, Math.min(eq.magnitude * 8, 60));
        return (
          <Marker key={eq.id} coordinate={{ latitude: eq.latitude, longitude: eq.longitude }} onPress={() => onMarkerPress(eq)} tracksViewChanges={false}>
            <View style={styles.markerContainer}>
              <Animated.View style={[styles.pulse, { width: size * 2, height: size * 2, borderRadius: size, backgroundColor: color + '30', transform: [{ scale: selectedMarker?.id === eq.id ? pulseAnim : 1 }] }]} />
              <View style={[styles.marker, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
                <Text style={[styles.markerText, { fontSize: size / 3 }]}>{eq.magnitude.toFixed(1)}</Text>
              </View>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute' },
  marker: { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  markerText: { color: '#FFFFFF', fontWeight: FONT_WEIGHT.bold },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: '#fff' },
  cluster: { minWidth: 28, paddingHorizontal: 8, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  clusterText: { color: '#fff', fontWeight: FONT_WEIGHT.bold },
});