import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, MapPin } from 'lucide-react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { useLocation } from '@/contexts/LocationContext';
import { getMagnitudeColor, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/constants/theme';
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

  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } } : { intensity: 80, tint: "light" as BlurTint };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webMapPlaceholder}>
          <MapPin size={48} color={COLORS.primary[600]} />
          <Text style={styles.webMapText}>Map view is available on mobile devices</Text>
          <Text style={styles.webMapSubtext}>Use the Events tab to view earthquake data</Text>
        </View>

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

        <ScrollView style={styles.webEventsList} contentContainerStyle={styles.webEventsContent}>
          {earthquakes.slice(0, 10).map((eq) => (
            <TouchableOpacity
              key={eq.id}
              style={styles.webEventCard}
              onPress={() => setSelectedMarker(eq)}
            >
              <View
                style={[
                  styles.webEventBadge,
                  { backgroundColor: getMagnitudeColor(eq.magnitude) },
                ]}
              >
                <Text style={styles.webEventBadgeText}>{eq.magnitude.toFixed(1)}</Text>
              </View>
              <View style={styles.webEventContent}>
                <Text style={styles.webEventPlace} numberOfLines={2}>
                  {eq.place}
                </Text>
                <Text style={styles.webEventTime}>
                  {formatTime(eq.time, preferences.timeFormat)} • Depth: {formatDepth(eq.depth, preferences.units)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
                <Text style={styles.tsunamiText}>⚠️ Tsunami Warning</Text>
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
              <Text style={styles.tsunamiText}>⚠️ Tsunami Warning</Text>
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
    borderRadius: 12,
    padding: SPACING.md,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary[500] + '20',
    borderRadius: 20,
  },
  infoCard: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    borderRadius: 12,
    padding: SPACING.md,
    overflow: 'hidden',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  infoBadge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoBadgeText: {
    fontSize: FONT_SIZE.lg,
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
    marginBottom: 4,
  },
  infoTime: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.text.secondary.light + '20',
    borderRadius: 16,
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.text.secondary.light,
  },
  infoDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background.light + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary.light,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  webMapText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  webMapSubtext: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  webEventsList: {
    flex: 1,
    marginTop: 100,
  },
  webEventsContent: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  webEventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface.light,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  webEventBadge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  webEventBadgeText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  webEventContent: {
    flex: 1,
    justifyContent: 'center',
  },
  webEventPlace: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary.light,
    marginBottom: 4,
  },
  webEventTime: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
});