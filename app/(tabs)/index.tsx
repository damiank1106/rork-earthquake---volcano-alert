import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, MapPin } from 'lucide-react-native';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { useLocation } from '@/contexts/LocationContext';
import { getMagnitudeColor, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { Earthquake } from '@/types';
import { formatTime } from '@/services/api';
import { usePreferences } from '@/contexts/PreferencesContext';
import NativeMap from '@/components/NativeMap';

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

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webMapPlaceholder}>
          <MapPin size={48} color={COLORS.primary[500]} />
          <Text style={styles.webMapText}>Map view is available on mobile devices</Text>
          <Text style={styles.webMapSubtext}>Use the Events tab to view earthquake data</Text>
        </View>

        <View style={[styles.header, { top: insets.top + 10 }]}>
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
              <ActivityIndicator size="small" color={COLORS.primary[500]} />
            ) : (
              <RefreshCw size={20} color={COLORS.primary[500]} />
            )}
          </TouchableOpacity>
        </View>

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
                  {formatTime(eq.time, preferences.timeFormat)} • Depth: {eq.depth.toFixed(1)} km
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedMarker && (
          <View style={styles.infoCard}>
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
              <Text style={styles.infoDetailText}>Depth: {selectedMarker.depth.toFixed(1)} km</Text>
              {selectedMarker.tsunami && (
                <Text style={styles.tsunamiText}>⚠️ Tsunami Warning</Text>
              )}
            </View>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary[500]} />
            <Text style={styles.loadingText}>Loading earthquakes...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NativeMap
        earthquakes={earthquakes}
        selectedMarker={selectedMarker}
        onMarkerPress={handleMarkerPress}
        userLocation={userLocation}
      />

      <View style={[styles.header, { top: insets.top + 10 }]}>
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
            <ActivityIndicator size="small" color={COLORS.primary[500]} />
          ) : (
            <RefreshCw size={20} color={COLORS.primary[500]} />
          )}
        </TouchableOpacity>
      </View>

      {selectedMarker && (
        <View style={styles.infoCard}>
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
            <Text style={styles.infoDetailText}>Depth: {selectedMarker.depth.toFixed(1)} km</Text>
            {selectedMarker.tsunami && (
              <Text style={styles.tsunamiText}>⚠️ Tsunami Warning</Text>
            )}
          </View>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
          <Text style={styles.loadingText}>Loading earthquakes...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
  },
  header: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface.dark + 'F0',
    borderRadius: 12,
    padding: SPACING.md,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        }
      : {}),
    ...(Platform.OS === 'android' ? { elevation: 5 } : {}),
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.dark,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.dark,
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
    backgroundColor: COLORS.surface.dark,
    borderRadius: 12,
    padding: SPACING.md,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        }
      : {}),
    ...(Platform.OS === 'android' ? { elevation: 8 } : {}),
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
    color: COLORS.text.primary.dark,
    marginBottom: 4,
  },
  infoTime: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.dark,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.text.secondary.dark + '20',
    borderRadius: 16,
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.text.secondary.dark,
  },
  infoDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  infoDetailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.dark,
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
    backgroundColor: COLORS.background.dark + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary.dark,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  webMapText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary.dark,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  webMapSubtext: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.dark,
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
    backgroundColor: COLORS.surface.dark,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }
      : {}),
    ...(Platform.OS === 'android' ? { elevation: 2 } : {}),
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
    color: COLORS.text.primary.dark,
    marginBottom: 4,
  },
  webEventTime: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.dark,
  },
});
