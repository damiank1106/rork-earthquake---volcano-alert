import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchVolcanoes } from '@/services/api';
import { Volcano } from '@/types';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

export default function VolcanoesScreen() {
  const insets = useSafeAreaInsets();
  const { data: volcanoes, isLoading } = useQuery({
    queryKey: ['volcanoes'],
    queryFn: fetchVolcanoes,
  });

  const [selectedVolcano, setSelectedVolcano] = React.useState<Volcano | null>(null);

  const activeVolcanoes = volcanoes?.filter(v => v.status !== 'Unknown' && v.status !== 'Dormant') || [];

  const renderVolcanoItem = ({ item }: { item: Volcano }) => (
    <TouchableOpacity
      style={styles.volcanoCard}
      onPress={() => setSelectedVolcano(item)}
    >
      <Text style={styles.volcanoName}>{item.name}</Text>
      <Text style={styles.volcanoLocation}>{item.country}, {item.region}</Text>
      <Text style={styles.volcanoStatus}>Status: {item.status}</Text>
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
      {selectedVolcano ? (
        <View style={styles.detailContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedVolcano(null)}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>{selectedVolcano.name}</Text>
          <Text style={styles.detailLocation}>{selectedVolcano.country}, {selectedVolcano.region}</Text>
          {selectedVolcano.imageUrl && (
            <Image source={{ uri: selectedVolcano.imageUrl }} style={styles.volcanoImage} />
          )}
          <Text style={styles.detailInfo}>
            Elevation: {selectedVolcano.elevation}m{'\n'}
            Type: {selectedVolcano.type}{'\n'}
            Status: {selectedVolcano.status}{'\n'}
            Last Eruption: {selectedVolcano.lastEruptionDate || 'Unknown'}{'\n'}
            VEI: {selectedVolcano.vei || 'N/A'}
          </Text>
          <Text style={styles.detailSummary}>{selectedVolcano.activitySummary || 'No summary available.'}</Text>
          <Text style={styles.detailNews}>{selectedVolcano.latestNews || 'No recent news.'}</Text>
        </View>
      ) : (
        <FlatList
          data={activeVolcanoes}
          keyExtractor={(item) => item.id}
          renderItem={renderVolcanoItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Text style={styles.header}>Active Volcanoes Worldwide</Text>}
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
  header: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.md,
  },
  volcanoCard: {
    backgroundColor: COLORS.surface.light,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
  },
  volcanoName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary.light,
  },
  volcanoLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  volcanoStatus: {
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
  detailLocation: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
    marginBottom: SPACING.md,
  },
  volcanoImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  detailInfo: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  detailSummary: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  detailNews: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    lineHeight: 20,
  },
});