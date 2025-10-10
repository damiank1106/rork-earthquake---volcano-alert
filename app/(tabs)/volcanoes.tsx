import React, { useMemo } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { BlurView, BlurTint } from 'expo-blur';
import { Mountain, Globe } from 'lucide-react-native';
import { fetchVolcanoes } from '@/services/api';
import { Volcano } from '@/types';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';

const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function VolcanoesScreen() {
  const insets = useSafeAreaInsets();
  const volcanoesQuery = useQuery({ queryKey: ['volcanoes'], queryFn: fetchVolcanoes, refetchInterval: 12 * 60 * 60 * 1000 });
  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255,255,255,0.8)' } } : { intensity: 80, tint: 'light' as BlurTint };
  const volcanoes = useMemo<Volcano[]>(() => volcanoesQuery.data ?? [], [volcanoesQuery.data]);

  if (volcanoesQuery.isLoading && volcanoes.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <GlassView {...glassProps} style={styles.header}>
        <Text style={styles.title}>Active Volcanoes</Text>
        <Text style={styles.subtitle}>{volcanoes.length} records</Text>
      </GlassView>

      <FlatList
        data={volcanoes}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <VolcanoItem v={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: COLORS.text.secondary.light }}>No volcano data available</Text>}
      />
    </View>
  );
}

function VolcanoItem({ v }: { v: Volcano }) {
  return (
    <TouchableOpacity style={styles.card} testID={`volcano-card-${v.id}`} onPress={() => {}}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{v.name}</Text>
        <Text style={styles.cardMeta}>{v.country}</Text>
      </View>
      <Text style={styles.cardSubtitle}>{v.region} • {v.type} • {v.elevation ? `${v.elevation} m` : '—'}</Text>
      <Image
        source={{ uri: `https://source.unsplash.com/featured/400x200/?volcano,${encodeURIComponent(v.name)}` }}
        style={styles.image}
      />
      <View style={styles.row}>
        <Mountain size={16} color={COLORS.primary[600]} />
        <Text style={styles.rowText}>Status: {v.status}</Text>
      </View>
      <View style={styles.row}>
        <Globe size={16} color={COLORS.primary[600]} />
        <Text style={styles.rowText}>{v.latitude.toFixed(3)}, {v.longitude.toFixed(3)}</Text>
      </View>
    </TouchableOpacity>
  );
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  rowText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  image: { width: '100%', height: 160, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.sm },
});
