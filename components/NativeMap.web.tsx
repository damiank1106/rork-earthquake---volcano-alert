import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Earthquake, PlateBoundary, Volcano, NuclearPlant } from '@/types';
import { getMagnitudeColor } from '@/constants/theme';

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

const NativeMap = forwardRef<any, NativeMapProps>(function NativeMap(
  {
    earthquakes,
    selectedMarker,
    onMarkerPress,
    userLocation,
    plateBoundaries = [],
    volcanoes = [],
    nuclearPlants = [],
    showPlateBoundaries = false,
    showVolcanoes = false,
    showSuperVolcanoes = false,
    showNuclearPlants = false,
    heatmapEnabled = false,
    clusteringEnabled = true,
    selectedVolcano = null,
    onVolcanoPress,
  },
  ref
) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  useImperativeHandle(
    ref,
    () => ({
      animateToRegion: (region: any, duration?: number) => {
        if (mapInstanceRef.current && region) {
          mapInstanceRef.current.setView([region.latitude, region.longitude], 8, {
            animate: true,
            duration: (duration || 1000) / 1000,
          });
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    const initMap = async () => {
      const L = (window as any).L;
      if (!L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          setTimeout(() => initMap(), 100);
        };
        document.head.appendChild(script);
        return;
      }

      if (mapInstanceRef.current) return;

      const initialLat = userLocation?.latitude || 20;
      const initialLng = userLocation?.longitude || 0;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 3,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (showPlateBoundaries && plateBoundaries.length > 0) {
      plateBoundaries.forEach((boundary) => {
        if (Array.isArray(boundary.coordinates) && boundary.coordinates.length > 0) {
          const coords = boundary.coordinates.map((c: any) => [c[1], c[0]]);
          const polyline = L.polyline(coords, {
            color: '#DC2626',
            weight: 2,
            opacity: 0.8,
          }).addTo(mapInstanceRef.current);
          markersRef.current.push(polyline);
        }
      });
    }

    earthquakes.forEach((eq) => {
      const color = getMagnitudeColor(eq.magnitude);
      const size = Math.max(10, Math.min(eq.magnitude * 4, 30));

      const icon = L.divIcon({
        className: 'custom-earthquake-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size / 3}px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            ${eq.magnitude.toFixed(1)}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([eq.latitude, eq.longitude], { icon }).addTo(
        mapInstanceRef.current
      );

      marker.on('click', () => {
        onMarkerPress(eq);
      });

      markersRef.current.push(marker);
    });

    if (volcanoes.length > 0) {
      volcanoes.forEach((v) => {
        const isSuperVolcano = v.category === 'super';
        const shouldShow = isSuperVolcano ? showSuperVolcanoes : showVolcanoes;
        
        if (!shouldShow) return;
        
        const isHighlighted = selectedVolcano?.id === v.id;
        const volcanoColor = isSuperVolcano ? (isHighlighted ? '#000000' : '#1F2937') : (isHighlighted ? '#DC2626' : '#EF4444');
        const size = isHighlighted ? 32 : 24;
        const icon = L.divIcon({
          className: 'custom-volcano-marker',
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${volcanoColor};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            "></div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([v.latitude, v.longitude], { icon }).addTo(
          mapInstanceRef.current
        );

        marker.on('click', () => {
          if (onVolcanoPress) {
            onVolcanoPress(v);
          }
        });

        markersRef.current.push(marker);
      });
    }
  }, [isMapReady, earthquakes, showVolcanoes, showSuperVolcanoes, volcanoes, onMarkerPress, selectedVolcano, onVolcanoPress, showPlateBoundaries, plateBoundaries]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedMarker) return;

    const L = (window as any).L;
    if (!L) return;

    mapInstanceRef.current.setView(
      [selectedMarker.latitude, selectedMarker.longitude],
      8,
      { animate: true }
    );
  }, [isMapReady, selectedMarker]);

  return (
    <View style={styles.container}>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </View>
  );
});

export default NativeMap;

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
});
