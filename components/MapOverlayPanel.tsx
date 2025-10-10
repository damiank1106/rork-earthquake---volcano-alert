import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMapLayers } from '@/contexts/MapLayersContext';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

interface MapOverlayPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  slideAnim: Animated.Value;
}

export const MapOverlayPanel: React.FC<MapOverlayPanelProps> = ({ isVisible, onToggle, slideAnim }) => {
  const { layers, magnitudeFilter, toggleLayer, setMagnitudeFilterValue } = useMapLayers();

  const magnitudeCategories = Array.from({ length: 11 }, (_, i) => i);

  return (
    <Animated.View
      style={[
        styles.panel,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
        {isVisible ? <ChevronRight size={24} color={COLORS.text.primary.light} /> : <ChevronLeft size={24} color={COLORS.text.primary.light} />}
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Map Layers</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earthquake Categories</Text>
          <View style={styles.magnitudeGrid}>
            {magnitudeCategories.map((mag) => (
              <TouchableOpacity
                key={mag}
                style={[
                  styles.magnitudeButton,
                  magnitudeFilter === mag && styles.magnitudeButtonActive,
                ]}
                onPress={() => setMagnitudeFilterValue(magnitudeFilter === mag ? null : mag)}
              >
                <Text style={[
                  styles.magnitudeText,
                  magnitudeFilter === mag && styles.magnitudeTextActive,
                ]}>
                  {mag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {magnitudeFilter !== null && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setMagnitudeFilterValue(null)}
            >
              <Text style={styles.clearText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overlays</Text>
          {layers.map((layer) => (
            <TouchableOpacity
              key={layer.id}
              style={styles.layerRow}
              onPress={() => toggleLayer(layer.id)}
            >
              <Text style={styles.layerText}>{layer.name}</Text>
              <View style={[styles.checkbox, layer.enabled && styles.checkboxActive]}>
                {layer.enabled && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: COLORS.surface.light + 'F0',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border.light,
    zIndex: 15,
  },
  toggleButton: {
    position: 'absolute',
    left: -40,
    top: '50%',
    width: 40,
    height: 60,
    backgroundColor: COLORS.surface.light + 'F0',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border.light,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.md,
  },
  magnitudeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  magnitudeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  magnitudeButtonActive: {
    backgroundColor: COLORS.primary[500],
    borderColor: COLORS.primary[500],
  },
  magnitudeText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.primary.light,
  },
  magnitudeTextActive: {
    color: '#FFFFFF',
  },
  clearButton: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.alert.red,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: {
    fontSize: FONT_SIZE.sm,
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.medium,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface.light,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  layerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary.light,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary[500],
    borderColor: COLORS.primary[500],
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
});