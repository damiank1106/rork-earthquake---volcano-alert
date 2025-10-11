import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAGNITUDE_SCALE, SAFETY_GUIDES } from '@/constants/education';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';

export default function EducationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.md }]}>
      <Text style={styles.title}>Earthquake Education</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Magnitude Scale</Text>
        <Text style={styles.sectionDescription}>
          Understanding earthquake magnitudes and their potential effects
        </Text>
        {MAGNITUDE_SCALE.map((mag) => (
          <View key={mag.value} style={styles.magnitudeCard}>
            <View style={[styles.magnitudeBadge, { backgroundColor: mag.color }]}>
              <Text style={styles.magnitudeBadgeText}>{mag.value}.0</Text>
            </View>
            <View style={styles.magnitudeInfo}>
              <Text style={styles.magnitudeLabel}>{mag.label}</Text>
              <Text style={styles.magnitudeDescription}>{mag.description}</Text>
              <Text style={styles.magnitudeEffects}>Effects: {mag.effects}</Text>
              <Text style={styles.magnitudeFrequency}>Frequency: {mag.frequency}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Guides</Text>
        {SAFETY_GUIDES.filter((guide) => guide.eventType === 'earthquake').map((guide) => (
          <View key={guide.id} style={styles.guideCard}>
            <Text style={styles.guideTitle}>{guide.title}</Text>
            <Text style={styles.guideCategory}>
              {guide.category === 'before' ? '📋 Before' : guide.category === 'during' ? '⚠️ During' : '✅ After'}
            </Text>
            {guide.steps.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <Text style={styles.stepNumber}>{index + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
            <Text style={styles.sources}>Sources: {guide.sources.join(', ')}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          This app provides informational content only and is not an official early warning system.
          Always follow official emergency alerts and guidance from local authorities.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
    marginBottom: SPACING.md,
  },
  magnitudeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  magnitudeBadge: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  magnitudeBadgeText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  magnitudeInfo: {
    flex: 1,
  },
  magnitudeLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#000000',
    marginBottom: 4,
  },
  magnitudeDescription: {
    fontSize: FONT_SIZE.sm,
    color: '#000000',
    marginBottom: 4,
  },
  magnitudeEffects: {
    fontSize: FONT_SIZE.sm,
    color: '#000000',
    marginBottom: 2,
  },
  magnitudeFrequency: {
    fontSize: FONT_SIZE.xs,
    color: '#000000',
    fontStyle: 'italic',
  },
  guideCard: {
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  guideTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#000000',
    marginBottom: SPACING.xs,
  },
  guideCategory: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary[500],
    marginBottom: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  stepNumber: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary[500],
    marginRight: SPACING.xs,
    minWidth: 20,
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: '#000000',
    lineHeight: 20,
  },
  sources: {
    fontSize: FONT_SIZE.xs,
    color: '#000000',
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  disclaimer: {
    backgroundColor: COLORS.alert.orange + '20',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.alert.orange,
  },
  disclaimerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.alert.orange,
    marginBottom: SPACING.sm,
  },
  disclaimerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    lineHeight: 20,
  },
});