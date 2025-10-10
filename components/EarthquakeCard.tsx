import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { MapPin, Clock, Layers } from 'lucide-react-native';
import { Earthquake } from '@/types';
import { getMagnitudeColor, COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { formatTime, formatDepth, calculateDistance } from '@/services/api';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useLocation } from '@/contexts/LocationContext';

const GlassView = Platform.OS === 'web' ? View : BlurView;

interface EarthquakeCardProps {
  earthquake: Earthquake;
  onPress: () => void;
}

export const EarthquakeCard: React.FC<EarthquakeCardProps> = ({ earthquake, onPress }) => {
  const { preferences } = usePreferences();
  const { userLocation } = useLocation();

  const magnitudeColor = getMagnitudeColor(earthquake.magnitude);

  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        earthquake.latitude,
        earthquake.longitude
      )
    : null;

  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } } : { intensity: 80, tint: "light" as BlurTint };

  return (
    <GlassView {...glassProps} style={styles.card}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Earthquake magnitude ${earthquake.magnitude.toFixed(1)} in ${earthquake.place}`}
      >
        <View style={styles.header}>
          <View style={[styles.magnitudeBadge, { backgroundColor: magnitudeColor }]}>
            <Text style={styles.magnitudeText}>{earthquake.magnitude.toFixed(1)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.place} numberOfLines={2}>
              {earthquake.place}
            </Text>
            <View style={styles.metaRow}>
              <Clock size={14} color={COLORS.text.secondary.light} />
              <Text style={styles.metaText}>
                {formatTime(earthquake.time, preferences.timeFormat)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Layers size={16} color={COLORS.text.secondary.light} />
            <Text style={styles.detailText}>
              Depth: {formatDepth(earthquake.depth, preferences.units)}
            </Text>
          </View>
          {distance !== null && (
            <View style={styles.detailItem}>
              <MapPin size={16} color={COLORS.text.secondary.light} />
              <Text style={styles.detailText}>
                {distance.toFixed(0)} {preferences.units === 'metric' ? 'km' : 'mi'} away
              </Text>
            </View>
          )}
        </View>

        {earthquake.tsunami && (
          <View style={styles.tsunamiWarning}>
            <Text style={styles.tsunamiText}>⚠️ Tsunami Warning</Text>
          </View>
        )}
      </TouchableOpacity>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  cardTouchable: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  magnitudeBadge: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  magnitudeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  place: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  tsunamiWarning: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.alert.red + '20',
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.alert.red,
  },
  tsunamiText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.alert.red,
  },
});