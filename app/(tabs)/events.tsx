import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { SortAsc } from 'lucide-react-native';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { useLocation } from '@/contexts/LocationContext';
import { EarthquakeCard } from '@/components/EarthquakeCard';
import { sortEarthquakes } from '@/utils/helpers';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { Earthquake, SortOption } from '@/types';

export default function EventsScreen() {
  const { earthquakes, isLoading, refetch, significantEarthquakes, recentEarthquakes } =
    useEarthquakes();
  const { userLocation } = useLocation();
  const [activeTab, setActiveTab] = useState<'all' | 'significant' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<SortOption>({ field: 'time', direction: 'desc' });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const displayedEarthquakes = useMemo(() => {
    let data: Earthquake[] = [];
    switch (activeTab) {
      case 'all':
        data = earthquakes;
        break;
      case 'significant':
        data = significantEarthquakes;
        break;
      case 'recent':
        data = recentEarthquakes;
        break;
    }
    return sortEarthquakes(data, sortBy.field, sortBy.direction, userLocation ?? undefined);
  }, [activeTab, earthquakes, significantEarthquakes, recentEarthquakes, sortBy, userLocation]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const toggleSort = () => {
    if (sortBy.field === 'time') {
      setSortBy({ field: 'magnitude', direction: 'desc' });
    } else if (sortBy.field === 'magnitude') {
      setSortBy({ field: 'distance', direction: 'asc' });
    } else {
      setSortBy({ field: 'time', direction: 'desc' });
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Earthquake Events</Text>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({earthquakes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'significant' && styles.activeTab]}
          onPress={() => setActiveTab('significant')}
        >
          <Text style={[styles.tabText, activeTab === 'significant' && styles.activeTabText]}>
            Significant ({significantEarthquakes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
            Recent ({recentEarthquakes.length})
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleSort}>
          <SortAsc size={20} color={COLORS.primary[500]} />
          <Text style={styles.controlText}>
            Sort: {sortBy.field === 'time' ? 'Time' : sortBy.field === 'magnitude' ? 'Magnitude' : 'Distance'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading && earthquakes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
          <Text style={styles.loadingText}>Loading earthquakes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedEarthquakes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EarthquakeCard earthquake={item} onPress={() => {}} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No earthquakes found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary[500]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
  },
  headerContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.dark,
    marginBottom: SPACING.md,
  },
  tabs: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface.dark,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary[500],
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.secondary.dark,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface.dark,
    borderRadius: 8,
  },
  controlText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary.dark,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.dark,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.dark,
  },
});
