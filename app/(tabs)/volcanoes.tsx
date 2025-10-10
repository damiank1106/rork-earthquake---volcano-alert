import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, SectionList, TouchableOpacity, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { Mountain, MapPin } from 'lucide-react-native';
import { fetchVolcanoes } from '@/services/api';
import { Volcano } from '@/types';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';
import { router } from 'expo-router';

export default function VolcanoesScreen() {
  const insets = useSafeAreaInsets();
  const volcanoesQuery = useQuery({ queryKey: ['volcanoes'], queryFn: fetchVolcanoes, refetchInterval: 12 * 60 * 60 * 1000 });
  const volcanoes = useMemo<Volcano[]>(() => volcanoesQuery.data ?? [], [volcanoesQuery.data]);

  const [selectedVolcano, setSelectedVolcano] = useState<Volcano | null>(null);

  const sections = useMemo(() => {
    const grouped = volcanoes.reduce((acc: { [key: string]: Volcano[] }, v) => {
      const country = v.country;
      if (!acc[country]) acc[country] = [];
      acc[country].push(v);
      return acc;
    }, {});
    return Object.keys(grouped).sort().map(country => ({
      title: country,
      data: grouped[country].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [volcanoes]);

  if (volcanoesQuery.isLoading && volcanoes.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      {Platform.OS === 'web' ? (
        <View style={[styles.header, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
          <Text style={styles.title}>Active Volcanoes</Text>
          <Text style={styles.subtitle}>{volcanoes.length} records</Text>
        </View>
      ) : (
        <BlurView intensity={80} tint="light" style={styles.header}>
          <Text style={styles.title}>Active Volcanoes</Text>
          <Text style={styles.subtitle}>{volcanoes.length} records</Text>
        </BlurView>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VolcanoItem v={item} onPress={() => setSelectedVolcano(item)} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: COLORS.text.secondary.light }}>No volcano data available</Text>}
      />

      <Modal visible={!!selectedVolcano} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          {Platform.OS === 'web' ? (
            <View style={[styles.modalContent, { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
            {selectedVolcano && (
              <>
                <Text style={styles.modalTitle}>{selectedVolcano.name}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Country:</Text> {selectedVolcano.country}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Region:</Text> {selectedVolcano.region}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Elevation:</Text> {selectedVolcano.elevation} m</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Type:</Text> {selectedVolcano.type}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Status:</Text> {selectedVolcano.status}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Last Eruption:</Text> {selectedVolcano.lastEruptionDate || 'Unknown'}</Text>
                {selectedVolcano.activitySummary && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Activity:</Text> {selectedVolcano.activitySummary}</Text>}
                {selectedVolcano.alertLevel && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Alert Level:</Text> {selectedVolcano.alertLevel}</Text>}
                {selectedVolcano.vei && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>VEI:</Text> {selectedVolcano.vei}</Text>}
                <TouchableOpacity style={styles.modalButton} onPress={() => {
                  setSelectedVolcano(null);
                  router.push(`/map?volcanoId=${selectedVolcano.id}`);
                }}>
                  <MapPin size={16} color="#fff" />
                  <Text style={styles.modalButtonText}>Show on Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedVolcano(null)}>
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
            </View>
          ) : (
            <BlurView intensity={80} tint="light" style={styles.modalContent}>
            {selectedVolcano && (
              <>
                <Text style={styles.modalTitle}>{selectedVolcano.name}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Country:</Text> {selectedVolcano.country}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Region:</Text> {selectedVolcano.region}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Elevation:</Text> {selectedVolcano.elevation} m</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Type:</Text> {selectedVolcano.type}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Status:</Text> {selectedVolcano.status}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Last Eruption:</Text> {selectedVolcano.lastEruptionDate || 'Unknown'}</Text>
                {selectedVolcano.activitySummary && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Activity:</Text> {selectedVolcano.activitySummary}</Text>}
                {selectedVolcano.alertLevel && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Alert Level:</Text> {selectedVolcano.alertLevel}</Text>}
                {selectedVolcano.vei && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>VEI:</Text> {selectedVolcano.vei}</Text>}
                <TouchableOpacity style={styles.modalButton} onPress={() => {
                  setSelectedVolcano(null);
                  router.push(`/map?volcanoId=${selectedVolcano.id}`);
                }}>
                  <MapPin size={16} color="#fff" />
                  <Text style={styles.modalButtonText}>Show on Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedVolcano(null)}>
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

function VolcanoItem({ v, onPress }: { v: Volcano; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} testID={`volcano-card-${v.id}`} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{v.name}</Text>
        <Text style={styles.cardMeta}>{v.region}</Text>
      </View>
      <Text style={styles.cardSubtitle}>{v.type} • {v.elevation} m • Status: {v.status}</Text>
      <View style={styles.row}>
        <Mountain size={16} color={COLORS.primary[600]} />
        <Text style={styles.rowText}>Last eruption: {v.lastEruptionDate || 'Unknown'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.light },
  header: { margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, ...SHADOW.md },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  list: { padding: SPACING.md, paddingTop: 0, paddingBottom: SPACING.xxl },
  sectionHeader: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary[600], marginTop: SPACING.md, marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.surface.light, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light, marginRight: SPACING.md },
  cardMeta: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  cardSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  rowText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { margin: SPACING.md, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, maxWidth: 400, width: '90%', ...SHADOW.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: '#000000', marginBottom: SPACING.md },
  modalLabel: { fontWeight: FONT_WEIGHT.bold, color: '#000000' },
  modalDetail: { fontSize: FONT_SIZE.md, color: '#000000', marginBottom: SPACING.xs },
  modalButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[500], paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md },
  modalButtonText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  closeModal: { alignSelf: 'center', marginTop: SPACING.sm, padding: SPACING.sm },
  closeModalText: { color: COLORS.primary[600], fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
});