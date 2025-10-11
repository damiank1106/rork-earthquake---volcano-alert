import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Switch, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView, BlurTint } from 'expo-blur';
import { ChevronRight, Info, RotateCw, X } from 'lucide-react-native';
import { usePreferences } from '@/contexts/PreferencesContext';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOW } from '@/constants/theme';
import { router } from 'expo-router';

const GlassView = Platform.OS === 'web' ? View : BlurView;

const PRIVACY_POLICY = `
Privacy Policy for Seismic Monitor

Last updated: October 2025

Information We Collect

Seismic Monitor collects minimal information to provide its services:

1. Location Data
   - Purpose: Calculate distance to earthquake epicenters
   - Storage: Stored locally on your device only
   - Sharing: Never shared with third parties
   - Control: Can be disabled in device settings

2. Saved Places
   - Purpose: Monitor earthquakes near locations you care about
   - Storage: Stored locally in app database
   - Sharing: Never shared or synced to cloud
   - Control: Can be deleted anytime in app

3. User Preferences
   - Purpose: Customize app experience (units, time format, etc.)
   - Storage: Stored locally on your device
   - Sharing: Never shared with third parties

Information We Don't Collect

- No personal identification information
- No usage analytics or tracking
- No advertising identifiers
- No crash reports (unless you opt-in via device settings)
- No account creation or authentication

Third-Party Services

We use the following third-party services:

1. USGS Earthquake API
   - Purpose: Fetch real-time earthquake data
   - Data sent: None (public API, no authentication)
   - Privacy policy: https://www.usgs.gov/privacy

Data Security

All data is stored locally on your device using industry-standard encryption provided by iOS/Android. We do not transmit your personal data to our servers.

Children's Privacy

Our app does not knowingly collect information from children under 13. The app is designed for general audiences.

Changes to Privacy Policy

We may update this policy. Changes will be posted in the app and on our website.

Contact Us

For privacy questions: privacy@seismicmonitor.com
`;

const TERMS_OF_USE = `
Terms of Use for Seismic Monitor

Last updated: October 2025

Acceptance of Terms

By downloading and using Seismic Monitor, you agree to these Terms of Use.

Description of Service

Seismic Monitor provides informational earthquake and volcanic activity data from public sources (USGS, Smithsonian GVP). The app is for educational and informational purposes only.

Important Disclaimers

1. Not an Early Warning System
   - This app is NOT an official earthquake early warning system
   - Do not rely on this app for emergency alerts
   - Always follow official emergency alerts from local authorities

2. Data Accuracy
   - Data is provided by USGS and other sources "as is"
   - We do not guarantee accuracy, completeness, or timeliness
   - Earthquake data may be delayed or contain errors
   - Magnitude and location estimates may be revised

3. No Liability
   - We are not liable for any damages resulting from app use
   - This includes but is not limited to: property damage, injury, or loss of life
   - Use of safety information is at your own risk

Proper Use

You agree to:
- Use the app for lawful purposes only
- Not attempt to reverse engineer or hack the app
- Not use the app to spread misinformation
- Follow all applicable laws and regulations

Data Sources

Earthquake data: United States Geological Survey (USGS)
Volcano data: Smithsonian Institution Global Volcanism Program
Safety information: FEMA, American Red Cross, CDC, WHO

Intellectual Property

The app design, code, and original content are owned by Seismic Monitor. Data from USGS and other sources remains property of respective owners.

Changes to Terms

We reserve the right to modify these terms. Continued use after changes constitutes acceptance.

Termination

We may terminate or suspend access to the app at any time without notice.

Governing Law

These terms are governed by the laws of the United States.

Contact

For questions: support@seismicmonitor.com
`;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences } = usePreferences();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [magnitudeModalVisible, setMagnitudeModalVisible] = useState(false);
  const [tempCountry, setTempCountry] = useState<string>(preferences.notificationCountry || '');
  const [tempMagnitude, setTempMagnitude] = useState<string>(String(preferences.notificationMinMagnitude || 5.0));

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

  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };

  const COUNTRIES = [
    'United States', 'Japan', 'Indonesia', 'China', 'Philippines', 'Mexico', 'Chile', 'Peru',
    'Turkey', 'Iran', 'Italy', 'Greece', 'New Zealand', 'Papua New Guinea', 'India', 'Pakistan',
    'Afghanistan', 'Ecuador', 'Guatemala', 'Nicaragua', 'Costa Rica', 'El Salvador', 'Taiwan',
    'Russia', 'Canada', 'Iceland', 'Colombia', 'Venezuela', 'Bolivia', 'Argentina', 'Nepal',
    'Myanmar', 'Thailand', 'Vanuatu', 'Fiji', 'Tonga', 'Solomon Islands', 'Algeria', 'Morocco',
    'Portugal', 'Spain', 'Albania', 'Romania', 'Armenia', 'Georgia', 'Azerbaijan', 'Tajikistan',
    'Kyrgyzstan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Saudi Arabia', 'Yemen', 'Oman',
    'United Arab Emirates', 'Iraq', 'Syria', 'Jordan', 'Israel', 'Lebanon', 'Egypt', 'Ethiopia',
    'Kenya', 'Tanzania', 'Malawi', 'Mozambique', 'South Africa', 'Australia', 'Malaysia',
    'Vietnam', 'Cambodia', 'Laos', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Samoa', 'Haiti',
    'Dominican Republic', 'Jamaica', 'Cuba', 'Puerto Rico', 'Honduras', 'Panama', 'Belize',
    'Trinidad and Tobago', 'Barbados', 'Saint Lucia', 'Dominica', 'Grenada', 'Saint Vincent',
    'Antigua and Barbuda', 'Saint Kitts and Nevis', 'Montserrat', 'Guadeloupe', 'Martinique',
    'Guyana', 'Suriname', 'French Guiana', 'Brazil', 'Uruguay', 'Paraguay', 'Norway', 'Sweden',
    'Finland', 'Denmark', 'United Kingdom', 'Ireland', 'France', 'Germany', 'Switzerland',
    'Austria', 'Czech Republic', 'Slovakia', 'Hungary', 'Poland', 'Croatia', 'Serbia',
    'Bosnia and Herzegovina', 'Montenegro', 'North Macedonia', 'Bulgaria', 'Ukraine', 'Belarus',
    'Lithuania', 'Latvia', 'Estonia', 'South Korea', 'North Korea', 'Mongolia'
  ].sort();

  const MAGNITUDE_OPTIONS = [
    { value: 3.0, label: '3.0+ (Minor)', description: 'Often felt, rarely causes damage' },
    { value: 4.0, label: '4.0+ (Light)', description: 'Noticeable shaking, minimal damage' },
    { value: 5.0, label: '5.0+ (Moderate)', description: 'Can cause damage to buildings' },
    { value: 6.0, label: '6.0+ (Strong)', description: 'Can be destructive in populated areas' },
    { value: 7.0, label: '7.0+ (Major)', description: 'Serious damage over large areas' },
    { value: 8.0, label: '8.0+ (Great)', description: 'Can cause serious damage in several hundred km' },
  ];

  const handleCountrySave = () => {
    updatePreferences({ notificationCountry: tempCountry || undefined });
    setCountryModalVisible(false);
  };

  const handleMagnitudeSave = () => {
    const mag = parseFloat(tempMagnitude);
    if (!isNaN(mag) && mag >= 1.0 && mag <= 10.0) {
      updatePreferences({ notificationMinMagnitude: mag });
      setMagnitudeModalVisible(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
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
              subtitle="Show intensity heatmap"
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
            {preferences.notificationsEnabled && (
              <>
                <View style={styles.divider} />
                <SettingRow
                  title="Country"
                  subtitle="Filter notifications by country"
                  value={preferences.notificationCountry || 'All Countries'}
                  onPress={() => {
                    setTempCountry(preferences.notificationCountry || '');
                    setCountryModalVisible(true);
                  }}
                />
                <View style={styles.divider} />
                <SettingRow
                  title="Minimum Magnitude"
                  subtitle="Only notify for earthquakes above this magnitude"
                  value={`${preferences.notificationMinMagnitude || 5.0}+`}
                  onPress={() => {
                    setTempMagnitude(String(preferences.notificationMinMagnitude || 5.0));
                    setMagnitudeModalVisible(true);
                  }}
                />
              </>
            )}
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
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push('/welcome')}
              activeOpacity={0.7}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Reload Welcome Page</Text>
                <Text style={styles.settingSubtitle}>View the welcome screen again</Text>
              </View>
              <RotateCw size={20} color={COLORS.text.secondary.light} />
            </TouchableOpacity>
          </View>
        </GlassView>

        <GlassView {...glassProps} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <SettingRow title="Data Sources" subtitle="Automatically updated from USGS, NOAA/NWS, PHIVOLCS, Smithsonian GVP, PB2002, and other trusted sources" showChevron={false} />
            <View style={styles.divider} />
            <SettingRow title="Version" subtitle="1.0.0" showChevron={false} />
            <View style={styles.divider} />
            <SettingRow title="Privacy Policy" subtitle="We collect no personal data. Location permission is used only to center the map. See full policy." onPress={() => openModal('Privacy Policy', PRIVACY_POLICY)} />
            <View style={styles.divider} />
            <SettingRow title="Terms of Use" subtitle="Information only. No warranty. Always follow official guidance. Data provided by listed sources." onPress={() => openModal('Terms of Use', TERMS_OF_USE)} />
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

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.modalText}>{modalContent.content}</Text>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={countryModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
              <X size={24} color={COLORS.text.primary.light} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <TouchableOpacity
              style={[styles.countryOption, tempCountry === '' && styles.countryOptionSelected]}
              onPress={() => setTempCountry('')}
            >
              <Text style={[styles.countryOptionText, tempCountry === '' && styles.countryOptionTextSelected]}>
                All Countries
              </Text>
            </TouchableOpacity>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country}
                style={[styles.countryOption, tempCountry === country && styles.countryOptionSelected]}
                onPress={() => setTempCountry(country)}
              >
                <Text style={[styles.countryOptionText, tempCountry === country && styles.countryOptionTextSelected]}>
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveButton} onPress={handleCountrySave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={magnitudeModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Minimum Magnitude</Text>
            <TouchableOpacity onPress={() => setMagnitudeModalVisible(false)}>
              <X size={24} color={COLORS.text.primary.light} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.magnitudeDescription}>
              Choose the minimum earthquake magnitude for notifications. Higher magnitudes mean fewer but more significant alerts.
            </Text>
            {MAGNITUDE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.magnitudeOption,
                  parseFloat(tempMagnitude) === option.value && styles.magnitudeOptionSelected
                ]}
                onPress={() => setTempMagnitude(String(option.value))}
              >
                <View style={styles.magnitudeOptionContent}>
                  <Text style={[
                    styles.magnitudeOptionLabel,
                    parseFloat(tempMagnitude) === option.value && styles.magnitudeOptionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.magnitudeOptionDescription}>{option.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveButton} onPress={handleMagnitudeSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.light },
  scroll: { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light, marginBottom: SPACING.lg },
  section: { marginBottom: SPACING.xl, borderRadius: 12, overflow: 'hidden' },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.secondary.light, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5, padding: SPACING.md, paddingBottom: 0 },
  card: { backgroundColor: COLORS.surface.light, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', ...SHADOW.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, minHeight: 60 },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium, color: COLORS.text.primary.light, marginBottom: 2 },
  settingSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
  settingValue: { fontSize: FONT_SIZE.md, color: COLORS.text.secondary.light, marginRight: SPACING.sm },
  divider: { height: 1, backgroundColor: COLORS.border.light, marginLeft: SPACING.md },
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.alert.orange + '20', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, gap: SPACING.sm },
  disclaimerText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, lineHeight: 20 },
  modalContainer: { flex: 1, backgroundColor: COLORS.background.light },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border.light },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light },
  closeText: { fontSize: FONT_SIZE.md, color: COLORS.primary[600] },
  modalScroll: { flex: 1 },
  modalScrollContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  modalText: { fontSize: FONT_SIZE.sm, color: COLORS.text.primary.light, lineHeight: 22 },
  modalFooter: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border.light },
  saveButton: { backgroundColor: COLORS.primary[600], borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  saveButtonText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light },
  countryOption: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border.light },
  countryOptionSelected: { backgroundColor: COLORS.primary[100] },
  countryOptionText: { fontSize: FONT_SIZE.md, color: COLORS.text.primary.light },
  countryOptionTextSelected: { fontWeight: FONT_WEIGHT.semibold, color: COLORS.primary[600] },
  magnitudeDescription: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginBottom: SPACING.lg, lineHeight: 20 },
  magnitudeOption: { padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border.light, marginBottom: SPACING.sm },
  magnitudeOptionSelected: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
  magnitudeOptionContent: { gap: 4 },
  magnitudeOptionLabel: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light },
  magnitudeOptionLabelSelected: { color: COLORS.primary[600] },
  magnitudeOptionDescription: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light },
});