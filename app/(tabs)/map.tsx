import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, AlertTriangle, SlidersHorizontal } from 'lucide-react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { useLocation } from '@/contexts/LocationContext';
import { getMagnitudeColor, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { Earthquake, PlateBoundary, Volcano } from '@/types';
import { formatTime, formatDepth, fetchPlateBoundaries, fetchVolcanoes } from '@/services/api';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import NativeMap from '@/components/NativeMap';


const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { earthquakes, isLoading, refetch, lastUpdated } = useEarthquakes();
  const { userLocation } = useLocation();
  const { preferences } = usePreferences();
  const [selectedMarker, setSelectedMarker] = useState<Earthquake | null>(null);
  const [selectedVolcanoMarker, setSelectedVolcanoMarker] = useState<Volcano | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [magCategory, setMagCategory] = useState<number | null | 'all'>('all');
  const [magFilterOff, setMagFilterOff] = useState<boolean>(false);
  const [showPlates, setShowPlates] = useState<boolean>(true);
  const [showVolcanoes, setShowVolcanoes] = useState<boolean>(true);
  const [showSuperVolcanoes, setShowSuperVolcanoes] = useState<boolean>(true);
  const [hasInitializedEarthquake, setHasInitializedEarthquake] = useState<boolean>(false);
  const [showCenterRefresh, setShowCenterRefresh] = useState<boolean>(false);


  const params = useLocalSearchParams();
  const highlightedVolcanoId = params.volcanoId as string | undefined;
  const earthquakeId = params.earthquakeId as string | undefined;
  const paramMagCategory = params.magCategory as string | undefined;
  const mapRef = useRef<any>(null);
  const prevEarthquakeIdRef = useRef<string | undefined>(undefined);

  const platesQuery = useQuery({ queryKey: ['plates'], queryFn: fetchPlateBoundaries, enabled: showPlates });
  const volcanoesQuery = useQuery({ queryKey: ['volcanoes-map'], queryFn: fetchVolcanoes, enabled: true });

  const filteredVolcanoes = useMemo(() => {
    if (!volcanoesQuery.data) return [];
    return volcanoesQuery.data.filter(v => {
      if (v.category === 'active') return showVolcanoes;
      if (v.category === 'super') return showSuperVolcanoes;
      return true;
    });
  }, [volcanoesQuery.data, showVolcanoes, showSuperVolcanoes]);

  const highlightedVolcano = useMemo(() => {
    if (!highlightedVolcanoId || !volcanoesQuery.data) return null;
    return volcanoesQuery.data.find(v => v.id === highlightedVolcanoId) || null;
  }, [highlightedVolcanoId, volcanoesQuery.data]);

  useEffect(() => {
    if (highlightedVolcano) {
      if (highlightedVolcano.category === 'active') {
        setShowVolcanoes(true);
      } else if (highlightedVolcano.category === 'super') {
        setShowSuperVolcanoes(true);
      }
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.animateToRegion({
            latitude: highlightedVolcano.latitude,
            longitude: highlightedVolcano.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }, 1000);
        }, 300);
      }
    }
  }, [highlightedVolcano]);

  useEffect(() => {
    if (earthquakeId !== prevEarthquakeIdRef.current) {
      setHasInitializedEarthquake(false);
      prevEarthquakeIdRef.current = earthquakeId;
    }
  }, [earthquakeId]);



  useEffect(() => {
    if (earthquakeId) {
      if (earthquakes.length > 0 && !hasInitializedEarthquake) {
        const earthquake = earthquakes.find(eq => eq.id === earthquakeId);
        if (earthquake) {
          if (paramMagCategory) {
            const magCat = parseInt(paramMagCategory, 10);
            setMagCategory(magCat);
            setMagFilterOff(false);
          } else {
            setMagCategory('all');
            setMagFilterOff(false);
          }
          setSelectedMarker(earthquake);
          setHasInitializedEarthquake(true);
          setShowCenterRefresh(false);
          
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: earthquake.latitude,
                longitude: earthquake.longitude,
                latitudeDelta: 5,
                longitudeDelta: 5,
              }, 1000);
            }
          }, 800);
        } else if (!isLoading) {
          setShowCenterRefresh(true);
        }
      } else if (earthquakes.length === 0 && !isLoading) {
        setShowCenterRefresh(true);
      }
    } else {
      if (!hasInitializedEarthquake && earthquakes.length > 0) {
        setMagCategory('all');
        setMagFilterOff(false);
        setHasInitializedEarthquake(true);
      }
    }
  }, [earthquakeId, earthquakes, hasInitializedEarthquake, paramMagCategory, isLoading]);

  const filteredEarthquakes = useMemo(() => {
    if (magFilterOff) return [];
    if (magCategory === null) return earthquakes;
    if (magCategory === 'all') return earthquakes;
    const min = magCategory;
    const max = magCategory + 1;
    return earthquakes.filter((e) => {
      return e.magnitude >= min && e.magnitude < max;
    });
  }, [earthquakes, magCategory, magFilterOff]);

  const panelAnim = useRef(new Animated.Value(0)).current;
  const togglePanel = () => {
    const to = panelOpen ? 0 : 1;
    setPanelOpen(!panelOpen);
    Animated.timing(panelAnim, { toValue: to, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  };
  const translateX = panelAnim.interpolate({ inputRange: [0, 1], outputRange: [260, 0] });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleCenterRefresh = async () => {
    setShowCenterRefresh(false);
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleMarkerPress = (earthquake: Earthquake) => {
    setSelectedMarker(earthquake);
    setSelectedVolcanoMarker(null);
    if (panelOpen) {
      togglePanel();
    }
  };

  const handleVolcanoPress = (volcano: Volcano) => {
    setSelectedVolcanoMarker(volcano);
    setSelectedMarker(null);
    if (panelOpen) {
      togglePanel();
    }
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: volcano.latitude,
          longitude: volcano.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }, 1000);
      }, 100);
    }
  };

  const handleCloseInfo = () => {
    setSelectedMarker(null);
  };

  const handleCloseVolcanoInfo = () => {
    setSelectedVolcanoMarker(null);
  };

  const getFeltDistance = (magnitude: number): string => {
    let distanceKm: number;
    if (magnitude < 3) {
      distanceKm = 10;
    } else if (magnitude < 4) {
      distanceKm = 30;
    } else if (magnitude < 5) {
      distanceKm = 100;
    } else if (magnitude < 6) {
      distanceKm = 200;
    } else if (magnitude < 7) {
      distanceKm = 400;
    } else if (magnitude < 8) {
      distanceKm = 800;
    } else {
      distanceKm = 1000;
    }
    return `${distanceKm} km`;
  };

  const hasAftershockRisk = (earthquake: Earthquake): boolean => {
    return earthquake.magnitude > 5.5;
  };

  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(128, 128, 128, 0.7)' } } : { intensity: 80, tint: "light" as BlurTint };

  const isDataLoading = isLoading && earthquakes.length === 0;
  const shouldShowMap = earthquakes.length > 0 || !isLoading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {shouldShowMap && (
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={() => {
            if (panelOpen) {
              togglePanel();
            }
          }}
        >
          <NativeMap
            ref={mapRef}
            earthquakes={filteredEarthquakes}
            selectedMarker={selectedMarker}
            onMarkerPress={handleMarkerPress}
            userLocation={userLocation}
            plateBoundaries={(platesQuery.data as PlateBoundary[] | undefined) ?? []}
            volcanoes={filteredVolcanoes}
            nuclearPlants={[]}
            showPlateBoundaries={showPlates}
            showVolcanoes={showVolcanoes}
            showNuclearPlants={false}
            heatmapEnabled={preferences.heatmapEnabled}
            clusteringEnabled={preferences.clusteringEnabled}
            selectedVolcano={selectedVolcanoMarker}
            onVolcanoPress={handleVolcanoPress}
          />
        </TouchableOpacity>
      )}
      
      {isDataLoading && (
        <View style={styles.emptyMapContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.emptyMapText}>Loading map data...</Text>
        </View>
      )}
      
      {!isDataLoading && earthquakes.length === 0 && (
        <View style={styles.emptyMapContainer}>
          <Text style={styles.emptyMapText}>No earthquake data available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <GlassView {...glassProps} style={[styles.header, { top: insets.top + 10 }]}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Seismic Monitor</Text>
          <Text style={styles.subtitle}>
            {filteredEarthquakes.length} events • Updated {formatTime(lastUpdated, preferences.timeFormat)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity testID="btn-filters" style={[styles.refreshButton, panelOpen && styles.activeButton]} onPress={togglePanel}>
            <SlidersHorizontal size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.refreshButton, isRefreshing && styles.activeButton]}
            onPress={handleRefresh}
            disabled={isRefreshing}
            testID="btn-refresh"
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <RefreshCw size={20} color="#000000" />
            )}
          </TouchableOpacity>
        </View>
      </GlassView>

      <Animated.View style={[styles.panel, { transform: [{ translateX }], top: insets.top + 64 }]} pointerEvents={panelOpen ? 'auto' : 'none'}>
        <Text style={styles.panelTitle}>Filters</Text>
        <Text style={styles.panelLabel}>Magnitude category</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity
            key="off"
            testID="chip-mag-off"
            onPress={() => {
              setMagFilterOff(!magFilterOff);
              if (!magFilterOff) setMagCategory(null);
            }}
            style={[styles.chip, magFilterOff && styles.chipActive]}
          >
            <Text style={[styles.chipText, magFilterOff && styles.chipTextActive]}>Off</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key="all"
            testID="chip-mag-all"
            onPress={() => {
              setMagFilterOff(false);
              setMagCategory(magCategory === 'all' ? null : 'all');
            }}
            style={[styles.chip, magCategory === 'all' && !magFilterOff && styles.chipActive]}
          >
            <Text style={[styles.chipText, magCategory === 'all' && !magFilterOff && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {Array.from({ length: 11 }).map((_, i) => (
            <TouchableOpacity
              key={i}
              testID={`chip-mag-${i}`}
              onPress={() => {
                setMagFilterOff(false);
                setMagCategory(i === magCategory ? null : i);
              }}
              style={[styles.chip, magCategory === i && !magFilterOff && styles.chipActive]}
            >
              <Text style={[styles.chipText, magCategory === i && !magFilterOff && styles.chipTextActive]}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Plate boundaries</Text>
          <TouchableOpacity testID="toggle-plates" style={[styles.toggle, showPlates && styles.toggleOn]} onPress={() => setShowPlates((v) => !v)}>
            <Text style={[styles.toggleText, showPlates && styles.toggleTextOn]}>{showPlates ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Active Volcanoes</Text>
          <TouchableOpacity testID="toggle-volcanoes" style={[styles.toggle, showVolcanoes && styles.toggleOn]} onPress={() => setShowVolcanoes((v) => !v)}>
            <Text style={[styles.toggleText, showVolcanoes && styles.toggleTextOn]}>{showVolcanoes ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Super Volcanoes</Text>
          <TouchableOpacity testID="toggle-super-volcanoes" style={[styles.toggle, showSuperVolcanoes && styles.toggleOn]} onPress={() => setShowSuperVolcanoes((v) => !v)}>
            <Text style={[styles.toggleText, showSuperVolcanoes && styles.toggleTextOn]}>{showSuperVolcanoes ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {selectedMarker && (
        <GlassView {...glassProps} style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View
              style={[
                styles.infoBadge,
                { backgroundColor: getMagnitudeColor(selectedMarker.magnitude) },
              ]}
            >
              <Text style={styles.infoBadgeText}>{selectedMarker.magnitude.toFixed(1)}</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoPlace} numberOfLines={2}>
                {selectedMarker.place}
              </Text>
              <Text style={styles.infoTime}>
                {formatTime(selectedMarker.time, preferences.timeFormat)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseInfo}
              testID="btn-close-info"
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoDetails}>
            <Text style={styles.infoDetailText}>Magnitude: {selectedMarker.magnitude.toFixed(2)} {selectedMarker.magnitudeType}</Text>
            <Text style={styles.infoDetailText}>Depth: {formatDepth(selectedMarker.depth, preferences.units)}</Text>
            <Text style={styles.infoDetailText}>Location: {selectedMarker.latitude.toFixed(4)}°, {selectedMarker.longitude.toFixed(4)}°</Text>
            <Text style={styles.infoDetailText}>Felt up to: {getFeltDistance(selectedMarker.magnitude)} away</Text>
            {selectedMarker.tsunami && (
              <View style={styles.warningRow}>
                <AlertTriangle size={16} color={COLORS.alert.red} />
                <Text style={styles.tsunamiText}>Tsunami Warning</Text>
              </View>
            )}
            {hasAftershockRisk(selectedMarker) && (
              <View style={styles.warningRow}>
                <AlertTriangle size={16} color={COLORS.alert.orange} />
                <Text style={styles.aftershockText}>Aftershock Risk</Text>
              </View>
            )}
          </View>
        </GlassView>
      )}

      {(highlightedVolcano || selectedVolcanoMarker) && (() => {
        const volcano = selectedVolcanoMarker || highlightedVolcano;
        if (!volcano) return null;
        return (
          <GlassView {...glassProps} style={styles.volcanoCard}>
            <View style={styles.volcanoHeader}>
              <Text style={styles.volcanoTitle}>{volcano.name}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={selectedVolcanoMarker ? handleCloseVolcanoInfo : () => router.push('/map')} testID="btn-close-volcano">
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.volcanoDetail}>Country: {volcano.country}</Text>
            <Text style={styles.volcanoDetail}>Region: {volcano.region}</Text>
            <Text style={styles.volcanoDetail}>Elevation: {volcano.elevation} m</Text>
            <Text style={styles.volcanoDetail}>Type: {volcano.type}</Text>
            <Text style={styles.volcanoDetail}>Last Eruption: {volcano.lastEruptionDate || 'Unknown'}</Text>
            <Text style={styles.volcanoDetail}>Location: {volcano.latitude.toFixed(4)}°, {volcano.longitude.toFixed(4)}°</Text>
          </GlassView>
        );
      })()}

      {isDataLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.loadingText}>Loading earthquakes...</Text>
          <Text style={styles.loadingPercentage}>{Math.round((earthquakes.length / 100) * 100)}%</Text>
        </View>
      )}

      {showCenterRefresh && !isRefreshing && (
        <TouchableOpacity
          style={[styles.centerRefreshButton, { top: '50%' }]}
          onPress={handleCenterRefresh}
          testID="btn-center-refresh"
        >
          <RefreshCw size={32} color={COLORS.primary[600]} />
          <Text style={styles.centerRefreshText}>Tap to load data</Text>
        </TouchableOpacity>
      )}

      {isRefreshing && showCenterRefresh && (
        <View style={[styles.centerRefreshButton, { top: '50%' }]}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.centerRefreshText}>Loading...</Text>
        </View>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.light },
  header: { position: 'absolute', left: SPACING.md, right: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 16, overflow: 'hidden', zIndex: 10, ...(Platform.OS === 'web' ? { backgroundColor: 'rgba(128, 128, 128, 0.7)', maxWidth: 800, left: '50%', right: 'auto', transform: [{ translateX: '-50%' }] } : {}) },
  headerContent: { flex: 1 },
  title: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000' },
  subtitle: { fontSize: FONT_SIZE.sm, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000', marginTop: 2 },
  refreshButton: { padding: SPACING.sm },
  activeButton: { shadowColor: '#60a5fa', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 },
  panel: { position: 'absolute', right: 0, width: 260, backgroundColor: COLORS.surface.light, padding: SPACING.md, borderTopLeftRadius: 16, borderBottomLeftRadius: 16, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 }, zIndex: 12 },
  panelTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light, marginBottom: SPACING.sm },
  panelLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginBottom: 6 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.md },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: COLORS.surface.dark, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: COLORS.primary[500] },
  chipText: { color: COLORS.text.secondary.light, fontSize: FONT_SIZE.sm },
  chipTextActive: { color: '#fff' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  toggleLabel: { color: COLORS.text.primary.light, fontSize: FONT_SIZE.md },
  toggle: { minWidth: 56, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: COLORS.border.light },
  toggleOn: { backgroundColor: COLORS.primary[500] },
  toggleText: { color: COLORS.text.secondary.light, fontSize: FONT_SIZE.sm },
  toggleTextOn: { color: '#fff' },
  infoCard: { position: 'absolute', bottom: SPACING.xl, left: SPACING.md, right: SPACING.md, borderRadius: 16, overflow: 'hidden', padding: SPACING.md, zIndex: 10, ...(Platform.OS === 'web' ? { backgroundColor: 'rgba(128, 128, 128, 0.7)' } : {}) },
  infoHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  infoBadge: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoBadgeText: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: '#FFFFFF' },
  infoContent: { flex: 1 },
  infoPlace: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000' },
  infoTime: { fontSize: FONT_SIZE.sm, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000', marginTop: 2 },
  closeButton: { padding: SPACING.xs },
  closeButtonText: { fontSize: FONT_SIZE.xl, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000' },
  infoDetails: { marginTop: SPACING.sm, gap: SPACING.xs },
  infoDetailText: { fontSize: FONT_SIZE.sm, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000' },
  tsunamiText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.alert.red },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  aftershockText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.alert.orange },
  volcanoCard: { position: 'absolute', bottom: SPACING.xl, left: SPACING.md, right: SPACING.md, borderRadius: 16, overflow: 'hidden', padding: SPACING.md, zIndex: 11, ...(Platform.OS === 'web' ? { backgroundColor: 'rgba(128, 128, 128, 0.7)' } : {}) },
  volcanoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xs },
  volcanoTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000' },
  volcanoDetail: { fontSize: FONT_SIZE.sm, color: Platform.OS === 'web' ? '#FFFFFF' : '#000000', marginTop: 4 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  loadingText: { marginTop: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.text.secondary.light },
  loadingPercentage: { marginTop: SPACING.sm, fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary[600] },
  centerRefreshButton: { position: 'absolute', right: SPACING.md, backgroundColor: '#FFFFFF', padding: SPACING.lg, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8, zIndex: 15, transform: [{ translateY: -50 }] },
  centerRefreshText: { marginTop: SPACING.sm, fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, fontWeight: FONT_WEIGHT.medium },
  emptyMapContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background.light, gap: SPACING.md },
  emptyMapText: { fontSize: FONT_SIZE.lg, color: COLORS.text.secondary.light, fontWeight: FONT_WEIGHT.medium, marginTop: SPACING.sm },
  retryButton: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary[600], paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg, borderRadius: 8, marginTop: SPACING.md },
  retryButtonText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: '#FFFFFF' },
});