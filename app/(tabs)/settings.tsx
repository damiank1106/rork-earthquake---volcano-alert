import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferences } from '@/contexts/PreferencesContext';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

interface SettingRowProps {
  title: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ title, value, onPress, showArrow = true }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <Text style={styles.settingTitle}>{title}</Text>
    <View style={styles.settingRight}>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </View>
  </TouchableOpacity>
);

interface SettingToggleProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ title, value, onValueChange }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingTitle}>{title}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border.light, true: COLORS.primary[500] }}
      thumbColor={COLORS.surface.light}
    />
  </View>
);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences } = usePreferences();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.md }]}
    >
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <SettingRow
          title="Units"
          value={preferences.units === 'metric' ? 'Metric' : 'Imperial'}
          onPress={() => updatePreferences({ units: preferences.units === 'metric' ? 'imperial' : 'metric' })}
        />
        <View style={styles.divider} />
        <SettingRow
          title="Time Format"
          value={preferences.timeFormat === '12h' ? '12 Hour' : '24 Hour'}
          onPress={() => updatePreferences({ timeFormat: preferences.timeFormat === '12h' ? '24h' : '12h' })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Sources</Text>
        <SettingToggle
          title="Earthquakes (USGS)"
          value={preferences.earthquakesEnabled}
          onValueChange={(value) => updatePreferences({ earthquakesEnabled: value })}
        />
        <View style={styles.divider} />
        <SettingToggle
          title="Volcanoes (NOAA)"
          value={preferences.volcanoesEnabled}
          onValueChange={(value) => updatePreferences({ volcanoesEnabled: value })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map Settings</Text>
        <SettingToggle
          title="Clustering"
          value={preferences.clusteringEnabled}
          onValueChange={(value) => updatePreferences({ clusteringEnabled: value })}
        />
        <View style={styles.divider} />
        <SettingToggle
          title="Heatmap"
          value={preferences.heatmapEnabled}
          onValueChange={(value) => updatePreferences({ heatmapEnabled: value })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingToggle
          title="Enable Notifications"
          value={preferences.notificationsEnabled}
          onValueChange={(value) => updatePreferences({ notificationsEnabled: value })}
        />
        <View style={styles.divider} />
        <SettingToggle
          title="Quiet Hours"
          value={preferences.quietHoursEnabled}
          onValueChange={(value) => updatePreferences({ quietHoursEnabled: value })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingRow title="Version" value="1.0.0" onPress={() => {}} showArrow={false} />
        <View style={styles.divider} />
        <SettingRow title="Data Sources" onPress={() => {}} />
        <View style={styles.divider} />
        <SettingRow title="Privacy Policy" onPress={() => {}} />
        <View style={styles.divider} />
        <SettingRow title="Terms of Use" onPress={() => {}} />
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Data provided by USGS, NOAA, and other sources. This app is for informational purposes only.
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
    backgroundColor: COLORS.surface.light,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.secondary.light,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface.light,
  },
  settingTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary.light,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  settingValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
  },
  arrow: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.text.secondary.light,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginLeft: SPACING.md,
  },
  disclaimer: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface.light,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  disclaimerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    textAlign: 'center',
    lineHeight: 20,
  },
});
