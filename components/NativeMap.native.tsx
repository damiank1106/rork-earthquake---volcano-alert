import React, { useRef, useEffect, useMemo, forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import { getMagnitudeColor, FONT_WEIGHT } from '@/constants/theme';
import { Earthquake, PlateBoundary, Volcano, NuclearPlant } from '@/types';
import { useLocalSearchParams } from 'expo-router';

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
  showSuperVolcanoes?: boolean;
  showNuclearPlants?: boolean;
  heatmapEnabled?: boolean;
  clusteringEnabled?: boolean;
  selectedVolcano?: Volcano | null;
  onVolcanoPress?: (volcano: Volcano) => void;
}

const NativeMap = forwardRef<any, NativeMapProps>(function NativeMap({ earthquakes, selectedMarker, onMarkerPress, userLocation, plateBoundaries = [], volcanoes = [], nuclearPlants = [], showPlateBoundaries = false, showVolcanoes = false, showSuperVolcanoes = false, showNuclearPlants = false, heatmapEnabled = false, clusteringEnabled = true, selectedVolcano = null, onVolcanoPress }, ref) {
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const highlightedVolcanoId = params.volcanoId as string | undefined;
  const [pulsingMarkerId, setPulsingMarkerId] = React.useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region: any, duration?: number) => {
      if (mapReady && mapRef.current) {
        mapRef.current.animateToRegion(region, duration);
      }
    },
  }), [mapReady]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const volcanoPulseAnim = useRef(new Animated.Value(1)).current;
  const volcanoPulseOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selectedMarker) {
      setPulsingMarkerId(selectedMarker.id);
    } else {
      setPulsingMarkerId(null);
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (pulsingMarkerId) {
      pulseAnim.setValue(1);
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [pulsingMarkerId, pulseAnim]);

  const pulseAnimationRef = useRef<any>(null);

  useEffect(() => {
    const activeVolcanoId = highlightedVolcanoId || selectedVolcano?.id;
    
    if (activeVolcanoId) {
      volcanoPulseAnim.setValue(1);
      volcanoPulseOpacity.setValue(1);
      
      pulseAnimationRef.current = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(volcanoPulseAnim, { toValue: 2.2, duration: 1000, useNativeDriver: true }),
            Animated.timing(volcanoPulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(volcanoPulseOpacity, { toValue: 0.2, duration: 1000, useNativeDriver: true }),
            Animated.timing(volcanoPulseOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ]),
        ])
      );
      pulseAnimationRef.current.start();
    } else {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        volcanoPulseAnim.setValue(1);
        volcanoPulseOpacity.setValue(1);
      }
    }
    
    return () => {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
      }
    };
  }, [highlightedVolcanoId, selectedVolcano?.id, volcanoPulseAnim, volcanoPulseOpacity]);

  useEffect(() => {
    if (selectedMarker && mapRef.current && mapReady) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: selectedMarker.latitude,
            longitude: selectedMarker.longitude,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }, 1000);
        }
      }, 100);
    }
  }, [selectedMarker, mapReady]);

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
    <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} showsUserLocation={true} showsMyLocationButton={false} onMapReady={() => setMapReady(true)}>
      {showPlateBoundaries && plateBoundaries.map((b) => (
        <Polyline
          key={`pb-${b.id}`}
          coordinates={Array.isArray(b.coordinates) ? b.coordinates.map((c: any) => ({ latitude: c[1], longitude: c[0] })) : []}
          strokeColor="#DC2626"
          strokeWidth={2}
        />
      ))}

      {volcanoes.map((v) => {
        const isSuperVolcano = v.category === 'super';
        const shouldShow = isSuperVolcano ? showSuperVolcanoes : showVolcanoes;
        
        if (!shouldShow) return null;
        
        const isHighlighted = highlightedVolcanoId === v.id || selectedVolcano?.id === v.id;
        const volcanoColor = isSuperVolcano ? (isHighlighted ? '#000000' : '#1F2937') : (isHighlighted ? '#DC2626' : '#EF4444');
        return (
          <Marker key={`vol-${v.id}`} coordinate={{ latitude: v.latitude, longitude: v.longitude }} onPress={() => onVolcanoPress?.(v)}>
            <View style={styles.volcanoContainer}>
              {isHighlighted && (
                <Animated.View
                  style={[
                    styles.volcanoPulse,
                    {
                      transform: [{ scale: volcanoPulseAnim }],
                      opacity: volcanoPulseOpacity,
                      backgroundColor: isSuperVolcano ? '#1F2937' : '#DC2626',
                    },
                  ]}
                />
              )}
              <View style={[styles.volcanoDot, { backgroundColor: volcanoColor, width: isHighlighted ? 32 : 24, height: isHighlighted ? 32 : 24, borderRadius: isHighlighted ? 16 : 12 }]} />
            </View>
          </Marker>
        );
      })}

      {showNuclearPlants && nuclearPlants.map((n) => (
        <Marker key={`np-${n.id}`} coordinate={{ latitude: n.latitude, longitude: n.longitude }}>
          <View style={styles.nuclearIcon}>
            <Text style={styles.nuclearText}>☢️</Text>
          </View>
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

      {!clusteringEnabled && earthquakes.map((eq) => {
        const color = getMagnitudeColor(eq.magnitude);
        const size = Math.max(20, Math.min(eq.magnitude * 8, 60));
        const isPulsing = pulsingMarkerId === eq.id;
        
        return (
          <Marker key={eq.id} coordinate={{ latitude: eq.latitude, longitude: eq.longitude }} onPress={() => onMarkerPress(eq)} tracksViewChanges={false}>
            <View style={styles.markerContainer}>
              <Animated.View style={[styles.pulse, { width: size * 2, height: size * 2, borderRadius: size, backgroundColor: color + '30', transform: [{ scale: isPulsing ? pulseAnim : 1 }] }]} />
              <View style={[styles.marker, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
                <Text style={[styles.markerText, { fontSize: size / 3 }]}>{eq.magnitude.toFixed(1)}</Text>
              </View>
            </View>
          </Marker>
        );
      })}

      {selectedMarker && (() => {
        const color = getMagnitudeColor(selectedMarker.magnitude);
        let feltRadiusKm: number;
        if (selectedMarker.magnitude < 3) {
          feltRadiusKm = 10;
        } else if (selectedMarker.magnitude < 4) {
          feltRadiusKm = 30;
        } else if (selectedMarker.magnitude < 5) {
          feltRadiusKm = 100;
        } else if (selectedMarker.magnitude < 6) {
          feltRadiusKm = 200;
        } else if (selectedMarker.magnitude < 7) {
          feltRadiusKm = 400;
        } else if (selectedMarker.magnitude < 8) {
          feltRadiusKm = 800;
        } else {
          feltRadiusKm = 1000;
        }
        const feltRadiusMeters = feltRadiusKm * 1000;
        
        return (
          <Circle
            key={`radius-${selectedMarker.id}`}
            center={{ latitude: selectedMarker.latitude, longitude: selectedMarker.longitude }}
            radius={feltRadiusMeters}
            strokeColor={color}
            strokeWidth={2}
            fillColor={color + '15'}
          />
        );
      })()}
    </MapView>
  );
});

export default NativeMap;

const styles = StyleSheet.create({
  map: { flex: 1 },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute' },
  marker: { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  markerText: { color: '#FFFFFF', fontWeight: FONT_WEIGHT.bold },
  volcanoContainer: { alignItems: 'center', justifyContent: 'center' },
  volcanoPulse: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(220, 38, 38, 0.4)', borderWidth: 4, borderColor: 'rgba(220, 38, 38, 0.9)' },
  volcanoDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: '#fff' },
  nuclearIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  nuclearText: { fontSize: 12 },
  cluster: { minWidth: 28, paddingHorizontal: 8, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  clusterText: { color: '#fff', fontWeight: FONT_WEIGHT.bold },
});