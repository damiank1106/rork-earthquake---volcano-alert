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
  showNuclearPlants?: boolean;
  heatmapEnabled?: boolean;
  clusteringEnabled?: boolean;
  selectedVolcano?: Volcano | null;
  onVolcanoPress?: (volcano: Volcano) => void;
  plateBoundaryColor?: string;
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
    showNuclearPlants = false,
    heatmapEnabled = false,
    clusteringEnabled = true,
    selectedVolcano = null,
    onVolcanoPress,
    plateBoundaryColor = '#ef4444',
  },
  ref
) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectedCircleRef = useRef<any | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const cssInjectedRef = useRef<boolean>(false);

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

      if (!cssInjectedRef.current) {
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes eqPulseScale {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.6); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          .eq-pulse-ring {
            position: absolute;
            inset: -40%;
            border-radius: 9999px;
            background: currentColor;
            opacity: 0.4;
            animation: eqPulseScale 2s ease-in-out infinite;
            filter: blur(0.5px);
          }
          .custom-earthquake-marker {
            position: relative;
          }
        `;
        document.head.appendChild(style);
        cssInjectedRef.current = true;
      }
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

    if (selectedCircleRef.current) {
      selectedCircleRef.current.remove();
      selectedCircleRef.current = null;
    }

    if (showPlateBoundaries && plateBoundaries.length > 0) {
      plateBoundaries.forEach((boundary) => {
        if (Array.isArray(boundary.coordinates) && boundary.coordinates.length > 0) {
          const coords = boundary.coordinates.map((c: any) => [c[1], c[0]]);
          const polyline = L.polyline(coords, {
            color: plateBoundaryColor,
            weight: 2,
            opacity: 0.8,
          }).addTo(mapInstanceRef.current);
          markersRef.current.push(polyline);
        }
      });
    }

    earthquakes.forEach((eq) => {
      const color = getMagnitudeColor(eq.magnitude);
      const size = Math.max(20, Math.min(eq.magnitude * 8, 60));
      const isSelected = selectedMarker?.id === eq.id;

      const icon = L.divIcon({
        className: 'custom-earthquake-marker',
        html: `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
            color: ${color};
          ">
            ${isSelected ? '<div class="eq-pulse-ring" style="color:'+color+';"></div>' : ''}
            <div style="
              width: 100%;
              height: 100%;
              background-color: ${color};
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 700;
              font-size: ${Math.round(size / 3)}px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              ${eq.magnitude.toFixed(1)}
            </div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([eq.latitude, eq.longitude], { icon }).addTo(
        mapInstanceRef.current
      );

      marker.on('click', () => {
        console.log('[NativeMap.web] Marker clicked', eq.id);
        onMarkerPress(eq);
      });

      markersRef.current.push(marker);
    });

    if (showVolcanoes && volcanoes.length > 0) {
      volcanoes.forEach((v) => {
        const isHighlighted = selectedVolcano?.id === v.id;
        const isSuperVolcano = v.category === 'super';
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
  }, [isMapReady, earthquakes, showVolcanoes, volcanoes, onMarkerPress, selectedVolcano, onVolcanoPress, showPlateBoundaries, plateBoundaries, plateBoundaryColor]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedMarker) return;

    const L = (window as any).L;
    if (!L) return;

    mapInstanceRef.current.setView(
      [selectedMarker.latitude, selectedMarker.longitude],
      8,
      { animate: true }
    );

    if (selectedCircleRef.current) {
      selectedCircleRef.current.remove();
      selectedCircleRef.current = null;
    }

    let feltRadiusKm: number;
    const m = selectedMarker.magnitude;
    if (m < 3) {
      feltRadiusKm = 10;
    } else if (m < 4) {
      feltRadiusKm = 30;
    } else if (m < 5) {
      feltRadiusKm = 100;
    } else if (m < 6) {
      feltRadiusKm = 200;
    } else if (m < 7) {
      feltRadiusKm = 400;
    } else if (m < 8) {
      feltRadiusKm = 800;
    } else {
      feltRadiusKm = 1000;
    }
    const color = getMagnitudeColor(m);
    selectedCircleRef.current = L.circle([selectedMarker.latitude, selectedMarker.longitude], {
      radius: feltRadiusKm * 1000,
      color: color,
      weight: 2,
      fillColor: color,
      fillOpacity: 0.15,
    }).addTo(mapInstanceRef.current);
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
