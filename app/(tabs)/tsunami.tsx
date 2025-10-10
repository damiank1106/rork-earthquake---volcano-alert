import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchTsunamis } from '@/services/api';
import { TsunamiEvent } from '@/types';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import NativeMap from '@/components/NativeMap';

export default function TsunamiScreen() {
  const insets = useSafeAreaInsets();
  const { data: tsunamis, isLoading } = useQuery({
    queryKey: ['tsunamis'],
    queryFn: fetchTsunamis,
  });

  const [selectedTsunami, setSelectedTsunami] = React.useState<TsunamiEvent | null>(null);

  const renderTsunamiItem = ({ item }: { item: TsunamiEvent }) => (
    <TouchableOpacity
      style={styles.tsunamiCard}
      onPress={() => setSelectedTsunami(item)}
    >
      <Text style={styles.tsunamiPlace}>{item.locationName}, {item.country}</Text>
      <Text style={styles.tsunamiDate}>
        {item.year}-{String(item.month).padStart(2, '0')}-{String(item.day).padStart(2, '0')} {String(item.hour).padStart(2, '0')}:{String(item.minute).padStart(2, '0')}
      </Text>
      <Text style={styles.tsunamiMagnitude}>Magnitude: {item.tsunamiMagnitude || 'N/A'}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {selectedTsunami ? (
        <View style={styles.detailContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedTsunami(null)}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>
            {selectedTsunami.locationName}, {selectedTsunami.country}
          </Text>
          <Text style={styles.detailDate}>
            {selectedTsunami.year}-{String(selectedTsunami.month).padStart(2, '0')}-{String(selectedTsunami.day).padStart(2, '0')} {String(selectedTsunami.hour).padStart(2, '0')}:{String(selectedTsunami.minute).padStart(2, '0')}
          </Text>
          <View style={styles.mapContainer}>
            <NativeMap
              earthquakes={[]}
              selectedMarker={null}
              onMarkerPress={() => {}}
              userLocation={null}
              volcanoes={[]}
              nuclearPlants={[]}
              plateBoundaries={[]}
              layers={[]}
            />
          </View>
          <Text style={styles.detailDescription}>{selectedTsunami.comments || 'No description available.'}</Text>
        </View>
      ) : (
        <FlatList
          data={tsunamis}
          keyExtractor={(item) => item.id}
          renderItem={renderTsunamiItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  listContent: {
    padding: SPACING.md,
  },
  tsunamiCard: {
    backgroundColor: COLORS.surface.light,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
  },
  tsunamiPlace: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary.light,
  },
  tsunamiDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  tsunamiMagnitude: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary[600],
  },
  detailContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  backText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary[600],
  },
  detailTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.sm,
  },
  detailDate: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
    marginBottom: SPACING.md,
  },
  mapContainer: {
    height: 200,
    marginBottom: SPACING.md,
  },
  detailDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    lineHeight: 20,
  },
});
