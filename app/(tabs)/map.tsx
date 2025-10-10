import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, AlertTriangle } from 'lucide-react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { useLocation } from '@/contexts/LocationContext';
import { getMagnitudeColor, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { Earthquake } from '@/types';
import { formatTime, formatDepth } from '@/services/api';
import { usePreferences } from '@/contexts/PreferencesContext';
import NativeMap from '@/components/NativeMap';

const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { earthquakes, isLoading, refetch, lastUpdated } = useEarthquakes();
  const { userLocation } = useLocation();
  const { preferences } = usePreferences();
  const [selectedMarker, setSelectedMarker] = useState<Earthquake | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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
        earthquakes={earthquakes}
        selectedMarker={selectedMarker}
        onMarkerPress={handleMarkerPress}
        userLocation={userLocation}
      />

      <GlassView {...glassProps} style={[styles.header, { top: insets.top + 10 }]}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Seismic Monitor</Text>
          <Text style={styles.subtitle}>
            {earthquakes.length} events • Updated {formatTime(lastUpdated, preferences.timeFormat)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={COLORS.primary[600]} />
          ) : (
            <RefreshCw size={20} color={COLORS.primary[600]} />
          )}
        </TouchableOpacity>
      </GlassView>

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
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoDetails}>
            <Text style={styles.infoDetailText}>Depth: {formatDepth(selectedMarker.depth, preferences.units)}</Text>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  header: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    marginTop: 2,
  },
  refreshButton: {
    padding: SPACING.sm,
  },
  infoCard: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.md,
    right: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    padding: SPACING.md,
    zIndex: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  infoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBadgeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  infoContent: {
    flex: 1,
  },
  infoPlace: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary.light,
  },
  infoTime: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    marginTop: 2,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  closeButtonText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.text.secondary.light,
  },
  infoDetails: {
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  infoDetailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  tsunamiText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.alert.red,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  aftershockText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.alert.orange,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
  },
});
