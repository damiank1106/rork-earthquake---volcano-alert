import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, AlertTriangle, SlidersHorizontal } from 'lucide-react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { useLocation } from '@/contexts/LocationContext';
import { getMagnitudeColor, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { Earthquake, PlateBoundary, Volcano, NuclearPlant } from '@/types';
import { formatTime, formatDepth, fetchPlateBoundaries, fetchVolcanoes, fetchNuclearPlants } from '@/services/api';
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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [magCategory, setMagCategory] = useState<number | null | 'all'>(null);
  const [magFilterOff, setMagFilterOff] = useState<boolean>(false);
  const [showPlates, setShowPlates] = useState<boolean>(false);
  const [showVolcanoes, setShowVolcanoes] = useState<boolean>(false);
  const [showNuclear, setShowNuclear] = useState<boolean>(false);

  const params = useLocalSearchParams();
  const highlightedVolcanoId = params.volcanoId as string | undefined;
  const mapRef = useRef<any>(null);

  const platesQuery = useQuery({ queryKey: ['plates'], queryFn: fetchPlateBoundaries, enabled: showPlates });
  const volcanoesQuery = useQuery({ queryKey: ['volcanoes-map'], queryFn: fetchVolcanoes, enabled: true });
  const nuclearQuery = useQuery({ queryKey: ['nuclear-plants'], queryFn: fetchNuclearPlants, enabled: showNuclear });

  const highlightedVolcano = useMemo(() => {
    if (!highlightedVolcanoId || !volcanoesQuery.data) return null;
    return volcanoesQuery.data.find(v => v.id === highlightedVolcanoId) || null;
  }, [highlightedVolcanoId, volcanoesQuery.data]);

  useEffect(() => {
    if (highlightedVolcano && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: highlightedVolcano.latitude,
          longitude: highlightedVolcano.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }, 1000);
      }, 300);
    }
  }, [highlightedVolcano]);

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

  const handleMarkerPress = (earthquake: Earthquake) => {
    setSelectedMarker(earthquake);
  };

  const hasAftershockRisk = (earthquake: Earthquake): boolean => {
    return earthquake.magnitude > 5.5;
  };

  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } } : { intensity: 80, tint: "light" as BlurTint };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <NativeMap
        ref={mapRef}
        earthquakes={filteredEarthquakes}
        selectedMarker={selectedMarker}
        onMarkerPress={handleMarkerPress}
        userLocation={userLocation}
        plateBoundaries={(platesQuery.data as PlateBoundary[] | undefined) ?? []}
        volcanoes={(volcanoesQuery.data as Volcano[] | undefined) ?? []}
        nuclearPlants={(nuclearQuery.data as NuclearPlant[] | undefined) ?? []}
        showPlateBoundaries={showPlates}
        showVolcanoes={showVolcanoes}
        showNuclearPlants={showNuclear}
        heatmapEnabled={preferences.heatmapEnabled}
        clusteringEnabled={preferences.clusteringEnabled}
      />

      <GlassView {...glassProps} style={[styles.header, { top: insets.top + 10 }]}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Seismic Monitor</Text>
          <Text style={styles.subtitle}>
            {filteredEarthquakes.length} events • Updated {formatTime(lastUpdated, preferences.timeFormat)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity testID="btn-filters" style={styles.refreshButton} onPress={togglePanel}>
            <SlidersHorizontal size={20} color={COLORS.primary[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isRefreshing}
            testID="btn-refresh"
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={COLORS.primary[600]} />
            ) : (
              <RefreshCw size={20} color={COLORS.primary[600]} />
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
          <Text style={styles.toggleLabel}>Volcanoes</Text>
          <TouchableOpacity testID="toggle-volcanoes" style={[styles.toggle, showVolcanoes && styles.toggleOn]} onPress={() => setShowVolcanoes((v) => !v)}>
            <Text style={[styles.toggleText, showVolcanoes && styles.toggleTextOn]}>{showVolcanoes ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Nuclear plants</Text>
          <TouchableOpacity testID="toggle-nuclear" style={[styles.toggle, showNuclear && styles.toggleOn]} onPress={() => setShowNuclear((v) => !v)}>
            <Text style={[styles.toggleText, showNuclear && styles.toggleTextOn]}>{showNuclear ? 'On' : 'Off'}</Text>
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
              onPress={() => setSelectedMarker(null)}
              testID="btn-close-info"
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoDetails}>
            <Text style={styles.infoDetailText}>Magnitude: {selectedMarker.magnitude.toFixed(2)} {selectedMarker.magnitudeType}</Text>
            <Text style={styles.infoDetailText}>Depth: {formatDepth(selectedMarker.depth, preferences.units)}</Text>
            <Text style={styles.infoDetailText}>Location: {selectedMarker.latitude.toFixed(4)}°, {selectedMarker.longitude.toFixed(4)}°</Text>
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

      {highlightedVolcano && (
        <GlassView {...glassProps} style={styles.volcanoCard}>
          <View style={styles.volcanoHeader}>
            <Text style={styles.volcanoTitle}>{highlightedVolcano.name}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/map')} testID="btn-close-volcano">
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.volcanoDetail}>Country: {highlightedVolcano.country}</Text>
          <Text style={styles.volcanoDetail}>Region: {highlightedVolcano.region}</Text>
          <Text style={styles.volcanoDetail}>Elevation: {highlightedVolcano.elevation} m</Text>
          <Text style={styles.volcanoDetail}>Type: {highlightedVolcano.type}</Text>
          <Text style={styles.volcanoDetail}>Last Eruption: {highlightedVolcano.lastEruptionDate || 'Unknown'}</Text>
          <Text style={styles.volcanoDetail}>Location: {highlightedVolcano.latitude.toFixed(4)}°, {highlightedVolcano.longitude.toFixed(4)}°</Text>
        </GlassView>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.loadingText}>Loading earthquakes...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.light },
  header: { position: 'absolute', left: SPACING.md, right: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 16, overflow: 'hidden', zIndex: 10 },
  headerContent: { flex: 1 },
  title: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  refreshButton: { padding: SPACING.sm },
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
  infoCard: { position: 'absolute', bottom: SPACING.xl, left: SPACING.md, right: SPACING.md, borderRadius: 16, overflow: 'hidden', padding: SPACING.md, zIndex: 10 },
  infoHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  infoBadge: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoBadgeText: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: '#FFFFFF' },
  infoContent: { flex: 1 },
  infoPlace: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light },
  infoTime: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  closeButton: { padding: SPACING.xs },
  closeButtonText: { fontSize: FONT_SIZE.xl, color: COLORS.text.secondary.light },
  infoDetails: { marginTop: SPACING.sm, gap: SPACING.xs },
  infoDetailText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  tsunamiText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.alert.red },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  aftershockText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.alert.orange },
  volcanoCard: { position: 'absolute', bottom: SPACING.xl, left: SPACING.md, right: SPACING.md, borderRadius: 16, overflow: 'hidden', padding: SPACING.md, zIndex: 11 },
  volcanoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xs },
  volcanoTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  volcanoDetail: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 4 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  loadingText: { marginTop: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.text.secondary.light },
});