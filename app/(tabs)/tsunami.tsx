import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { BlurView, BlurTint } from 'expo-blur';
import { MapPin, RefreshCw } from 'lucide-react-native';
import { fetchTsunamiAlerts, formatTime } from '@/services/api';
import { TsunamiAlert } from '@/types';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';

const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function TsunamiScreen() {
  const insets = useSafeAreaInsets();
  const alertsQuery = useQuery({ queryKey: ['tsunami-alerts'], queryFn: fetchTsunamiAlerts, refetchInterval: 5 * 60 * 1000 });
  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255,255,255,0.8)' } } : { intensity: 80, tint: 'light' as BlurTint };
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<TsunamiAlert | null>(null);
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(0);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());

  const alerts = useMemo<TsunamiAlert[]>(() => alertsQuery.data ?? [], [alertsQuery.data]);

  useEffect(() => {
    if (alertsQuery.dataUpdatedAt) {
      setLastFetchTime(alertsQuery.dataUpdatedAt);
    }
  }, [alertsQuery.dataUpdatedAt]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastFetchTime;
      const remaining = Math.max(0, 300000 - elapsed);
      setNextUpdateIn(Math.ceil(remaining / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastFetchTime]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await alertsQuery.refetch();
    setIsRefreshing(false);
  };

  const renderItem = ({ item }: { item: TsunamiAlert }) => {
    const coords = extractPoint(item);
    return (
      <TouchableOpacity style={styles.card} testID={`tsunami-card-${item.id}`} onPress={() => setSelectedAlert(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.sent ? formatTime(new Date(item.sent).getTime(), '24h') : '—'}</Text>
        </View>
        <Text style={styles.cardSubtitle} numberOfLines={2}>{item.areaDescription}</Text>
        <View style={styles.row}>
          <MapPin size={16} color={COLORS.primary[600]} />
          <Text style={styles.rowText}>{coords ? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}` : 'Location not provided'}</Text>
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
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Tsunami Alerts</Text>
            <Text style={styles.updateTimer}>Updates in {nextUpdateIn}s</Text>
          </View>
          <Text style={styles.subtitle}>{alerts.length} alerts from multiple sources</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
          testID="btn-refresh-tsunami"
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={COLORS.primary[600]} />
          ) : (
            <RefreshCw size={20} color={COLORS.primary[600]} />
          )}
        </TouchableOpacity>
      </GlassView>

      <FlatList
        data={alerts}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: COLORS.text.secondary.light }}>No active tsunami alerts</Text>}
      />

      <Modal visible={!!selectedAlert} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          {Platform.OS === 'web' ? (
            <View style={[styles.modalContent, { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
              {selectedAlert && (
                <>
                  <Text style={styles.modalTitle}>{selectedAlert.title}</Text>
                  {selectedAlert.source && (
                    <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Source:</Text> {selectedAlert.source}</Text>
                  )}
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Area:</Text> {selectedAlert.areaDescription}</Text>
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Severity:</Text> {selectedAlert.severity}</Text>
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Urgency:</Text> {selectedAlert.urgency}</Text>
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Certainty:</Text> {selectedAlert.certainty}</Text>
                  {selectedAlert.sent && (
                    <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Issued:</Text> {formatTime(new Date(selectedAlert.sent).getTime(), '24h')}</Text>
                  )}
                  {selectedAlert.description && (
                    <Text style={styles.modalDescription}>{selectedAlert.description}</Text>
                  )}
                  <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedAlert(null)}>
                    <Text style={styles.closeModalText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <BlurView intensity={80} tint="light" style={styles.modalContent}>
              {selectedAlert && (
                <>
                  <Text style={styles.modalTitle}>{selectedAlert.title}</Text>
                  {selectedAlert.source && (
                    <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Source:</Text> {selectedAlert.source}</Text>
                  )}
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Area:</Text> {selectedAlert.areaDescription}</Text>
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Severity:</Text> {selectedAlert.severity}</Text>
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Urgency:</Text> {selectedAlert.urgency}</Text>
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Certainty:</Text> {selectedAlert.certainty}</Text>
                  {selectedAlert.sent && (
                    <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Issued:</Text> {formatTime(new Date(selectedAlert.sent).getTime(), '24h')}</Text>
                  )}
                  {selectedAlert.description && (
                    <Text style={styles.modalDescription}>{selectedAlert.description}</Text>
                  )}
                  <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedAlert(null)}>
                    <Text style={styles.closeModalText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </BlurView>
          )}
        </View>
      </Modal>
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
  header: { margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, ...SHADOW.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerContent: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  updateTimer: { fontSize: FONT_SIZE.sm, color: COLORS.primary[600], fontWeight: FONT_WEIGHT.semibold },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  refreshButton: { padding: SPACING.sm },
  list: { padding: SPACING.md, paddingTop: 0, paddingBottom: SPACING.xl },
  card: { backgroundColor: COLORS.surface.light, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light, marginRight: SPACING.md },
  cardMeta: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  cardSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  rowText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { margin: SPACING.md, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, maxWidth: 500, width: '90%', ...SHADOW.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: '#000000', marginBottom: SPACING.md },
  modalLabel: { fontWeight: FONT_WEIGHT.bold, color: '#000000' },
  modalDetail: { fontSize: FONT_SIZE.md, color: '#000000', marginBottom: SPACING.xs },
  modalDescription: { fontSize: FONT_SIZE.sm, color: '#000000', marginTop: SPACING.sm, lineHeight: 20 },
  closeModal: { alignSelf: 'center', marginTop: SPACING.md, padding: SPACING.sm, backgroundColor: COLORS.primary[500], borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.lg },
  closeModalText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
});
