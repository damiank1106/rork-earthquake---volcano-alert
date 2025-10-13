import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Text, SectionList, TouchableOpacity, Modal, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { Mountain, MapPin, AlertTriangle, Clock } from 'lucide-react-native';
import { fetchVolcanoes, fetchVolcanoWarnings } from '@/services/api';
import { Volcano, VolcanoWarning } from '@/types';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';
import { router } from 'expo-router';
import { usePreferences } from '@/contexts/PreferencesContext';

type TabType = 'active' | 'super' | 'warnings';

export default function VolcanoesScreen() {
  const insets = useSafeAreaInsets();
  const { updatePreferences } = usePreferences();
  const volcanoesQuery = useQuery({ queryKey: ['volcanoes'], queryFn: fetchVolcanoes, refetchInterval: 12 * 60 * 60 * 1000 });
  const volcanoes = useMemo<Volcano[]>(() => volcanoesQuery.data ?? [], [volcanoesQuery.data]);
  const warningsQuery = useQuery({ 
    queryKey: ['volcano-warnings'], 
    queryFn: fetchVolcanoWarnings, 
    refetchInterval: 5 * 60 * 1000 
  });
  const warnings = useMemo<VolcanoWarning[]>(() => warningsQuery.data ?? [], [warningsQuery.data]);

  const [selectedVolcano, setSelectedVolcano] = useState<Volcano | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [nextUpdate, setNextUpdate] = useState<number>(300);

  const activeVolcanoes = useMemo(() => volcanoes.filter(v => v.category === 'active'), [volcanoes]);
  const superVolcanoes = useMemo(() => volcanoes.filter(v => v.category === 'super'), [volcanoes]);

  const currentVolcanoes = activeTab === 'active' ? activeVolcanoes : activeTab === 'super' ? superVolcanoes : [];

  useEffect(() => {
    if (activeTab === 'warnings') {
      const interval = setInterval(() => {
        setNextUpdate(prev => {
          if (prev <= 1) {
            warningsQuery.refetch();
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab, warningsQuery.refetch]);

  const handleShowOnMap = (volcano: Volcano) => {
    updatePreferences({ volcanoesEnabled: true });
    setSelectedVolcano(null);
    router.push(`/map?volcanoId=${volcano.id}`);
  };

  const sections = useMemo(() => {
    const grouped = currentVolcanoes.reduce((acc: { [key: string]: Volcano[] }, v) => {
      const country = v.country;
      if (!acc[country]) acc[country] = [];
      acc[country].push(v);
      return acc;
    }, {});
    return Object.keys(grouped).sort().map(country => ({
      title: country,
      data: grouped[country].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [currentVolcanoes]);

  if (volcanoesQuery.isLoading && volcanoes.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Loading. Please wait…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      {Platform.OS === 'web' ? (
        <View style={[styles.header, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
          <Text style={styles.title}>Volcanoes</Text>
          <Text style={styles.subtitle}>{currentVolcanoes.length} records</Text>
        </View>
      ) : (
        <BlurView intensity={80} tint="light" style={styles.header}>
          <Text style={styles.title}>Volcanoes</Text>
          <Text style={styles.subtitle}>{currentVolcanoes.length} records</Text>
        </BlurView>
      )}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active ({activeVolcanoes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'super' && styles.activeTab]}
          onPress={() => setActiveTab('super')}
        >
          <Text style={[styles.tabText, activeTab === 'super' && styles.activeTabText]}>
            Super ({superVolcanoes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'warnings' && styles.activeTab]}
          onPress={() => setActiveTab('warnings')}
        >
          <Text style={[styles.tabText, activeTab === 'warnings' && styles.activeTabText]}>
            Warnings ({warnings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'active' ? (
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
      ) : activeTab === 'super' ? (
        <ScrollView 
          contentContainerStyle={styles.list}
          style={{ flex: 1 }}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {superVolcanoes.map((volcano) => (
            <SuperVolcanoItem key={volcano.id} v={volcano} onPress={() => setSelectedVolcano(volcano)} />
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.timerContainer}>
            <Clock size={16} color={COLORS.text.secondary.light} />
            <Text style={styles.timerText}>
              Updates in {Math.floor(nextUpdate / 60)}:{(nextUpdate % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          <ScrollView 
            contentContainerStyle={styles.list}
            style={{ flex: 1 }}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            {warningsQuery.isLoading && warnings.length === 0 ? (
              <Text style={{ textAlign: 'center', color: COLORS.text.secondary.light }}>Loading warnings...</Text>
            ) : warnings.length === 0 ? (
              <Text style={{ textAlign: 'center', color: COLORS.text.secondary.light }}>No active warnings</Text>
            ) : (
              warnings.map((warning) => (
                <WarningItem key={warning.id} warning={warning} />
              ))
            )}
          </ScrollView>
        </View>
      )}

      <Modal visible={!!selectedVolcano} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          {Platform.OS === 'web' ? (
            <ScrollView 
              style={[styles.modalContent, { backgroundColor: 'rgba(255,255,255,0.95)' }]}
              contentContainerStyle={{ padding: SPACING.lg }}
              scrollEnabled={true}
            >
            {selectedVolcano && (
              <>
                <Text style={styles.modalTitle}>{selectedVolcano.name}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Country:</Text> {selectedVolcano.country}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Region:</Text> {selectedVolcano.region}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Elevation:</Text> {selectedVolcano.elevation} m</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Type:</Text> {selectedVolcano.type}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Status:</Text> {selectedVolcano.status}</Text>
                {selectedVolcano.category === 'super' && selectedVolcano.calderaSize && (
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Caldera Size:</Text> {selectedVolcano.calderaSize}</Text>
                )}
                {selectedVolcano.category === 'super' && selectedVolcano.lastMajorEruption && (
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Last Major Eruption:</Text> {selectedVolcano.lastMajorEruption}</Text>
                )}
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Last Eruption:</Text> {selectedVolcano.lastEruptionDate || 'Unknown'}</Text>
                {selectedVolcano.activitySummary && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Activity:</Text> {selectedVolcano.activitySummary}</Text>}
                {selectedVolcano.description && <Text style={styles.modalDescription}>{selectedVolcano.description}</Text>}
                {selectedVolcano.alertLevel && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Alert Level:</Text> {selectedVolcano.alertLevel}</Text>}
                {selectedVolcano.vei && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>VEI:</Text> {selectedVolcano.vei}</Text>}
                <TouchableOpacity style={styles.modalButton} onPress={() => handleShowOnMap(selectedVolcano)}>
                  <MapPin size={16} color="#fff" />
                  <Text style={styles.modalButtonText}>Show on Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedVolcano(null)}>
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
            </ScrollView>
          ) : (
            <BlurView intensity={80} tint="light" style={styles.modalContent}>
            <ScrollView 
              contentContainerStyle={{ padding: SPACING.lg }}
              scrollEnabled={true}
            >
            {selectedVolcano && (
              <>
                <Text style={styles.modalTitle}>{selectedVolcano.name}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Country:</Text> {selectedVolcano.country}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Region:</Text> {selectedVolcano.region}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Elevation:</Text> {selectedVolcano.elevation} m</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Type:</Text> {selectedVolcano.type}</Text>
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Status:</Text> {selectedVolcano.status}</Text>
                {selectedVolcano.category === 'super' && selectedVolcano.calderaSize && (
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Caldera Size:</Text> {selectedVolcano.calderaSize}</Text>
                )}
                {selectedVolcano.category === 'super' && selectedVolcano.lastMajorEruption && (
                  <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Last Major Eruption:</Text> {selectedVolcano.lastMajorEruption}</Text>
                )}
                <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Last Eruption:</Text> {selectedVolcano.lastEruptionDate || 'Unknown'}</Text>
                {selectedVolcano.activitySummary && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Activity:</Text> {selectedVolcano.activitySummary}</Text>}
                {selectedVolcano.description && <Text style={styles.modalDescription}>{selectedVolcano.description}</Text>}
                {selectedVolcano.alertLevel && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>Alert Level:</Text> {selectedVolcano.alertLevel}</Text>}
                {selectedVolcano.vei && <Text style={styles.modalDetail}><Text style={styles.modalLabel}>VEI:</Text> {selectedVolcano.vei}</Text>}
                <TouchableOpacity style={styles.modalButton} onPress={() => handleShowOnMap(selectedVolcano)}>
                  <MapPin size={16} color="#fff" />
                  <Text style={styles.modalButtonText}>Show on Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedVolcano(null)}>
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
            </ScrollView>
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

function SuperVolcanoItem({ v, onPress }: { v: Volcano; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.superCard} testID={`volcano-card-${v.id}`} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{v.name}</Text>
        <Text style={styles.cardMeta}>{v.region}</Text>
      </View>
      <Text style={styles.cardSubtitle}>{v.type} • {v.elevation} m</Text>
      {v.calderaSize && (
        <Text style={styles.cardSubtitle}>Caldera: {v.calderaSize}</Text>
      )}
      {v.lastMajorEruption && (
        <View style={styles.row}>
          <Mountain size={16} color="#000000" />
          <Text style={styles.rowText}>Last major eruption: {v.lastMajorEruption}</Text>
        </View>
      )}
      {v.description && (
        <Text style={styles.superDescription} numberOfLines={3}>{v.description}</Text>
      )}
    </TouchableOpacity>
  );
}

function WarningItem({ warning }: { warning: VolcanoWarning }) {
  const { updatePreferences } = usePreferences();
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'warning': return '#DC2626';
      case 'watch': return '#F59E0B';
      case 'advisory': return '#3B82F6';
      default: return COLORS.text.secondary.light;
    }
  };

  const handleShowOnMap = () => {
    if (warning.latitude && warning.longitude) {
      updatePreferences({ volcanoesEnabled: true });
      router.push(`/map?volcanoId=${warning.id.replace('warning-', '')}`);
    }
  };

  return (
    <View style={[styles.warningCard, { borderLeftColor: getAlertColor(warning.alertLevel) }]}>
      <View style={styles.warningHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.warningTitle}>{warning.volcanoName}</Text>
          <Text style={styles.warningLocation}>{warning.country} • {warning.region}</Text>
        </View>
        <View style={[styles.alertBadge, { backgroundColor: getAlertColor(warning.alertLevel) }]}>
          <AlertTriangle size={16} color="#FFFFFF" />
          <Text style={styles.alertBadgeText}>{warning.alertLevel.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.warningActivity}>{warning.activityType}</Text>
      <Text style={styles.warningDescription} numberOfLines={3}>{warning.description}</Text>
      <View style={styles.warningFooter}>
        <View style={{ flex: 1 }}>
          <Text style={styles.warningSource}>Source: {warning.source}</Text>
          <Text style={styles.warningUpdate}>Updated: {warning.lastUpdate}</Text>
        </View>
        {warning.latitude && warning.longitude && (
          <TouchableOpacity style={styles.showMapButton} onPress={handleShowOnMap}>
            <MapPin size={14} color={COLORS.primary[600]} />
            <Text style={styles.showMapButtonText}>Show on Map</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.light },
  header: { margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, ...SHADOW.md },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  tab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary[500] },
  tabText: { fontSize: FONT_SIZE.md, color: COLORS.text.secondary.light, fontWeight: FONT_WEIGHT.medium },
  activeTabText: { color: COLORS.primary[600], fontWeight: FONT_WEIGHT.bold },
  list: { padding: SPACING.md, paddingTop: 0, paddingBottom: SPACING.xxl },
  sectionHeader: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary[600], marginTop: SPACING.md, marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.surface.light, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.md, borderLeftWidth: 4, borderLeftColor: '#DC2626' },
  superCard: { backgroundColor: COLORS.surface.light, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.md, borderLeftWidth: 4, borderLeftColor: '#000000' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light, marginRight: SPACING.md },
  cardMeta: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  cardSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginBottom: SPACING.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  rowText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  superDescription: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: SPACING.sm, lineHeight: 20 },
  timerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface.light, borderBottomWidth: 1, borderBottomColor: COLORS.border.light },
  timerText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, fontWeight: FONT_WEIGHT.medium },
  warningCard: { backgroundColor: COLORS.surface.light, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.md, borderLeftWidth: 4 },
  warningHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: SPACING.sm },
  warningTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  warningLocation: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  alertBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: BORDER_RADIUS.sm },
  alertBadgeText: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold, color: '#FFFFFF' },
  warningActivity: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light, marginBottom: SPACING.xs },
  warningDescription: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, lineHeight: 20, marginBottom: SPACING.sm },
  warningFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: SPACING.xs, paddingTop: SPACING.xs, borderTopWidth: 1, borderTopColor: COLORS.border.light },
  warningSource: { fontSize: FONT_SIZE.xs, color: COLORS.text.secondary.light },
  warningUpdate: { fontSize: FONT_SIZE.xs, color: COLORS.text.secondary.light },
  showMapButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: COLORS.primary[50], borderRadius: BORDER_RADIUS.sm },
  showMapButtonText: { fontSize: FONT_SIZE.xs, color: COLORS.primary[600], fontWeight: FONT_WEIGHT.semibold },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { margin: SPACING.md, borderRadius: BORDER_RADIUS.lg, maxWidth: 500, width: '90%', maxHeight: '80%', ...SHADOW.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: '#000000', marginBottom: SPACING.md },
  modalLabel: { fontWeight: FONT_WEIGHT.bold, color: '#000000' },
  modalDetail: { fontSize: FONT_SIZE.md, color: '#000000', marginBottom: SPACING.xs },
  modalDescription: { fontSize: FONT_SIZE.sm, color: '#000000', marginTop: SPACING.sm, marginBottom: SPACING.sm, lineHeight: 20 },
  modalButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[500], paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md },
  modalButtonText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  closeModal: { alignSelf: 'center', marginTop: SPACING.sm, padding: SPACING.sm },
  closeModalText: { color: COLORS.primary[600], fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  loadingText: { marginTop: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.text.secondary.light, fontWeight: FONT_WEIGHT.medium },
});
