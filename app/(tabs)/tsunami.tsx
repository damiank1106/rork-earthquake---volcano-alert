import React, { useMemo } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { BlurView, BlurTint } from 'expo-blur';
import { MapPin, ExternalLink } from 'lucide-react-native';
import { fetchTsunamiAlerts, formatTime } from '@/services/api';
import { TsunamiAlert } from '@/types';
import NativeMap from '@/components/NativeMap';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';

const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function TsunamiScreen() {
  const insets = useSafeAreaInsets();
  const alertsQuery = useQuery({ queryKey: ['tsunami-alerts'], queryFn: fetchTsunamiAlerts, refetchInterval: 5 * 60 * 1000 });
  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255,255,255,0.8)' } } : { intensity: 80, tint: 'light' as BlurTint };

  const alerts = useMemo<TsunamiAlert[]>(() => alertsQuery.data ?? [], [alertsQuery.data]);

  const renderItem = ({ item }: { item: TsunamiAlert }) => {
    const coords = extractPoint(item);
    return (
      <TouchableOpacity style={styles.card} testID={`tsunami-card-${item.id}`} onPress={() => {}}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.sent ? formatTime(new Date(item.sent).getTime(), '24h') : '—'}</Text>
        </View>
        <Text style={styles.cardSubtitle} numberOfLines={2}>{item.areaDescription}</Text>
        {coords && (
          <View style={styles.miniMap}>
            <NativeMap earthquakes={[]} selectedMarker={null} onMarkerPress={() => {}} userLocation={{ latitude: coords.latitude, longitude: coords.longitude }} />
          </View>
        )}
        <View style={styles.row}>
          <MapPin size={16} color={COLORS.primary[600]} />
          <Text style={styles.rowText}>{coords ? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}` : 'Location not provided'}</Text>
        </View>
        {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
        <View style={styles.actions}>
          <ExternalLink size={16} color={COLORS.primary[600]} />
          <Text style={styles.linkText}>Open official advisory</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (alertsQuery.isLoading && alerts.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <GlassView {...glassProps} style={styles.header}>
        <Text style={styles.title}>NOAA Tsunami Alerts</Text>
        <Text style={styles.subtitle}>{alerts.length} active alerts</Text>
      </GlassView>

      <FlatList
        data={alerts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: COLORS.text.secondary.light }}>No active tsunami alerts</Text>}
      />
    </View>
  );
}

function extractPoint(alert: TsunamiAlert): { latitude: number; longitude: number } | null {
  const g = alert.geometry;
  if (!g) return null;
  if (g.type === 'Point' && Array.isArray(g.coordinates)) {
    return { latitude: g.coordinates[1], longitude: g.coordinates[0] };
  }
  if (g.type === 'Polygon' && Array.isArray(g.coordinates) && Array.isArray(g.coordinates[0]) && Array.isArray(g.coordinates[0][0])) {
    const first = g.coordinates[0][0];
    return { latitude: first[1], longitude: first[0] };
  }
  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.light },
  header: { margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, ...SHADOW.md },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  list: { padding: SPACING.md, paddingTop: 0, paddingBottom: SPACING.xl },
  card: { backgroundColor: COLORS.surface.light, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light, marginRight: SPACING.md },
  cardMeta: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  cardSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginBottom: SPACING.sm },
  miniMap: { height: 120, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  rowText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  description: { marginTop: SPACING.sm, fontSize: FONT_SIZE.sm, color: COLORS.text.primary.light },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm },
  linkText: { fontSize: FONT_SIZE.sm, color: COLORS.primary[600] },
});
