import React from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView, BlurTint } from 'expo-blur';
import { X } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, getMagnitudeColor } from '@/constants/theme';

const GlassView = Platform.OS === 'web' ? View : BlurView;

interface MapLegendModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MapLegendModal({ visible, onClose }: MapLegendModalProps) {
  const insets = useSafeAreaInsets();
  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255, 255, 255, 0.98)' } } : { intensity: 100, tint: "light" as BlurTint };

  const magnitudeRanges = [
    { min: 0, max: 1, label: '0-1', description: 'Micro' },
    { min: 1, max: 2, label: '1-2', description: 'Minor' },
    { min: 2, max: 3, label: '2-3', description: 'Minor' },
    { min: 3, max: 4, label: '3-4', description: 'Light' },
    { min: 4, max: 5, label: '4-5', description: 'Moderate' },
    { min: 5, max: 6, label: '5-6', description: 'Strong' },
    { min: 6, max: 7, label: '6-7', description: 'Major' },
    { min: 7, max: 8, label: '7-8', description: 'Great' },
    { min: 8, max: 10, label: '8+', description: 'Extreme' },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { paddingTop: insets.top + SPACING.md }]}>
          <GlassView {...glassProps} style={styles.glassContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Map Legend</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollContent}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              bounces={true}
            >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earthquake Magnitude Icons</Text>
              <Text style={styles.sectionDescription}>
                Colored circles represent earthquake events. The color indicates the magnitude strength:
              </Text>
              <View style={styles.legendItems}>
                {magnitudeRanges.map((range, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.magnitudeCircle,
                        { backgroundColor: getMagnitudeColor(range.min + 0.5) },
                      ]}
                    />
                    <View style={styles.legendItemText}>
                      <Text style={styles.legendLabel}>Magnitude {range.label}</Text>
                      <Text style={styles.legendDescription}>{range.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Volcano Icons</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.volcanoIcon, { backgroundColor: '#DC2626' }]} />
                  <View style={styles.legendItemText}>
                    <Text style={styles.legendLabel}>Active Volcanoes</Text>
                    <Text style={styles.legendDescription}>Currently erupting or recently active</Text>
                  </View>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.volcanoIcon, { backgroundColor: '#000000' }]} />
                  <View style={styles.legendItemText}>
                    <Text style={styles.legendLabel}>Super Volcanoes</Text>
                    <Text style={styles.legendDescription}>Massive volcanic calderas</Text>
                  </View>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.volcanoIcon, { backgroundColor: '#2563EB' }]} />
                  <View style={styles.legendItemText}>
                    <Text style={styles.legendLabel}>Your Location</Text>
                    <Text style={styles.legendDescription}>Blue marker shows your current position</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tectonic Plate Boundaries</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={styles.plateLine} />
                  <View style={styles.legendItemText}>
                    <Text style={styles.legendLabel}>Red Lines</Text>
                    <Text style={styles.legendDescription}>
                      Show boundaries between Earth&apos;s tectonic plates where earthquakes are most common
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                💡 Tip: You can control this popup from Settings → Map → Show Legend on Start
              </Text>
            </View>
          </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
                <Text style={styles.gotItButtonText}>Got It!</Text>
              </TouchableOpacity>
            </View>
          </GlassView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  glassContainer: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: '#000000',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: '#000000',
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: FONT_SIZE.sm,
    color: '#000000',
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  legendItems: {
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  magnitudeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  volcanoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  plateLine: {
    width: 40,
    height: 3,
    backgroundColor: '#FF0000',
    borderRadius: 2,
  },
  legendItemText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#000000',
    marginBottom: 2,
  },
  legendDescription: {
    fontSize: FONT_SIZE.sm,
    color: '#000000',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.lg,
  },
  footer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primary[50],
    borderRadius: BORDER_RADIUS.md,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: '#000000',
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  gotItButton: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  gotItButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
});
