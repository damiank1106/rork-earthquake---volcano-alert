import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView, BlurTint } from 'expo-blur';
import { ChevronRight, Info } from 'lucide-react-native';
import { usePreferences } from '@/contexts/PreferencesContext';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';

const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences } = usePreferences();

  const glassProps = Platform.OS === 'web' ? { style: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } } : { intensity: 80, tint: "light" as BlurTint };

  const SettingRow = ({
    title,
    subtitle,
    value,
    onPress,
    showChevron = true,
  }: {
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {showChevron && onPress && <ChevronRight size={20} color={COLORS.text.secondary.light} />}
    </TouchableOpacity>
  );

  const SettingToggle = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border.light, true: COLORS.primary[500] }}
        thumbColor={COLORS.text.primary.light}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.md }]}>
      <Text style={styles.title}>Settings</Text>

      <GlassView {...glassProps} style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.card}>
          <SettingRow
            title="Units"
            subtitle="Distance and depth measurements"
            value={preferences.units === 'metric' ? 'Metric (km)' : 'Imperial (mi)'}
            onPress={() =>
              updatePreferences({
                units: preferences.units === 'metric' ? 'imperial' : 'metric',
              })
            }
          />
          <View style={styles.divider} />
          <SettingRow
            title="Time Format"
            subtitle="How times are displayed"
            value={preferences.timeFormat === '12h' ? '12-hour' : '24-hour'}
            onPress={() =>
              updatePreferences({
                timeFormat: preferences.timeFormat === '12h' ? '24h' : '12h',
              })
            }
          />
        </View>
      </GlassView>

      <GlassView {...glassProps} style={styles.section}>
        <Text style={styles.sectionTitle}>Data Sources</Text>
        <View style={styles.card}>
          <SettingToggle
            title="Earthquakes"
            subtitle="Show earthquake data from USGS"
            value={preferences.earthquakesEnabled}
            onValueChange={(value) => updatePreferences({ earthquakesEnabled: value })}
          />
          <View style={styles.divider} />
          <SettingToggle
            title="Volcanoes"
            subtitle="Show volcano data (coming soon)"
            value={preferences.volcanoesEnabled}
            onValueChange={(value) => updatePreferences({ volcanoesEnabled: value })}
          />
        </View>
      </GlassView>

      <GlassView {...glassProps} style={styles.section}>
        <Text style={styles.sectionTitle}>Map</Text>
        <View style={styles.card}>
          <SettingToggle
            title="Clustering"
            subtitle="Group nearby events on map"
            value={preferences.clusteringEnabled}
            onValueChange={(value) => updatePreferences({ clusteringEnabled: value })}
          />
          <View style={styles.divider} />
          <SettingToggle
            title="Heatmap"
            subtitle="Show intensity heatmap (coming soon)"
            value={preferences.heatmapEnabled}
            onValueChange={(value) => updatePreferences({ heatmapEnabled: value })}
          />
        </View>
      </GlassView>

      <GlassView {...glassProps} style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <SettingToggle
            title="Enable Notifications"
            subtitle="Receive alerts for significant events"
            value={preferences.notificationsEnabled}
            onValueChange={(value) => updatePreferences({ notificationsEnabled: value })}
          />
          <View style={styles.divider} />
          <SettingToggle
            title="Quiet Hours"
            subtitle="Mute notifications during set hours"
            value={preferences.quietHoursEnabled}
            onValueChange={(value) => updatePreferences({ quietHoursEnabled: value })}
          />
        </View>
      </GlassView>

      <GlassView {...glassProps} style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <SettingRow title="Data Sources" subtitle="USGS, Smithsonian GVP" showChevron={false} />
          <View style={styles.divider} />
          <SettingRow title="Version" subtitle="1.0.0" showChevron={false} />
          <View style={styles.divider} />
          <SettingRow title="Privacy Policy" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow title="Terms of Use" onPress={() => {}} />
        </View>
      </GlassView>

      <View style={styles.disclaimer}>
        <Info size={20} color={COLORS.alert.orange} />
        <Text style={styles.disclaimerText}>
          This app is for informational purposes only. Always follow official emergency alerts and
          guidance from local authorities.
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
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.secondary.light,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: SPACING.md,
    paddingBottom: 0,
  },
  card: {
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    minHeight: 60,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.primary.light,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
  },
  settingValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
    marginRight: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginLeft: SPACING.md,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.alert.orange + '20',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    lineHeight: 20,
  },
});