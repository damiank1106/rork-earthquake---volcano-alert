import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Info, RotateCw, X } from 'lucide-react-native';
import { usePreferences } from '@/contexts/PreferencesContext';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '@/constants/theme';
import { router } from 'expo-router';

const GlassView = View;

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

For privacy questions: seismicsupport@icloud.com
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

For questions: seismicsupport@icloud.com
`;

const APP_INFO = `
Seismic Monitor - Your Earthquake & Volcano Companion

Version 1.0.0 | October 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT THIS APP OFFERS

🌍 Real-Time Earthquake Monitoring
• Live earthquake data from USGS
• Interactive map with customizable filters
• Magnitude-based color coding (0-10 scale)
• Distance calculations from your location
• Detailed event information and impact radius
• Click on earthquake markers to see details in glass containers
• Zoom and pulse animations for selected events
• Filter by magnitude categories (All, 0-10)
• Toggle earthquake display on/off

🌋 Active Volcano Tracking
• Global volcano database from Smithsonian GVP
• 44+ currently erupting volcanoes worldwide
• Real-time volcano locations on map with red markers
• Eruption history and activity status
• Toggle active volcano markers on/off independently
• Click on volcano markers to zoom, pulse, and view details
• Separate tabs for Active Volcanoes and Super Volcanoes
• Filter volcanoes by category in map view
• Live volcano eruption warnings with auto-refresh
• "Show on Map" feature for each volcano

🌋 Super Volcanoes
• Comprehensive database of 11 major supervolcanoes
• Black markers distinguish from active volcanoes (red)
• Independent toggle control in map filters
• Detailed information about each supervolcano:
  - Yellowstone (USA)
  - Taupō (New Zealand)
  - Toba (Indonesia)
  - La Garita (USA)
  - La Pacana (Chile)
  - Cerro Galán (Argentina)
  - Campi Flegrei (Italy)
  - Long Valley Caldera (USA)
  - Aso Caldera (Japan)
  - Whakamaru Caldera (New Zealand)
  - Apolaki Caldera (Philippine Sea)
• Caldera size, last major eruption dates
• Educational descriptions and fun facts
• Interactive map integration with zoom and pulse effects
• Scrollable detailed view for each supervolcano

⚠️ Volcano Warnings System
• Live volcano eruption warnings from multiple sources
• Alert levels: Warning, Watch, Advisory, Normal
• Color-coded by severity (Red, Orange, Blue)
• Auto-refresh every 5 minutes
• Timer display showing next update
• Activity type and detailed descriptions
• Source attribution and last update time
• "Show on Map" button for each warning
• Sorted by alert priority (warnings first)

🌊 Tsunami Alerts & Safety
• Live tsunami warnings from NOAA/NWS and PHIVOLCS
• Affected regions and threat levels
• Automatic refresh for latest updates
• Critical safety information
• Comprehensive tsunami safety guidelines:
  - How to recognize tsunami warning signs
  - What to do before, during, and after
  - Evacuation procedures
  - Emergency preparedness tips
• Timer showing when data updates

📚 Educational Resources
• Comprehensive magnitude scale guide
• Safety guides for earthquakes and tsunamis
• Before, during, and after preparedness tips
• Emergency contact information
• Tsunami recognition and response guidelines
• Volcano and supervolcano educational content
• Interactive learning materials

🔔 Smart Notifications
• Separate notification controls for Earthquakes and Volcanoes
• Customizable earthquake alerts by country and magnitude
• Customizable volcano alerts by country
• Filter by country (100+ countries supported)
• Magnitude thresholds (3.0+ to 8.0+)
• Stay informed about significant events
• Works on iOS and Android devices
• Background notification support
• Push notifications for critical events

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW TO USE THE APP

📍 Map Tab (Home)
• View earthquakes and volcanoes on interactive map
• Tap earthquake markers to see detailed information in glass containers
• Tap volcano markers to zoom in, pulse, and view details
• Use Filters button (slider icon) to access filter panel
• Filter by magnitude: Off, All, or specific ranges (0-10)
• Toggle Plate Boundaries (red lines) on/off
• Toggle Active Volcanoes (red markers) on/off independently
• Toggle Super Volcanoes (black markers) on/off independently
• All filters default to ON when app starts
• Pinch to zoom, drag to explore
• Click "Show on Map" from Events/Volcanoes to locate specific items
• Selected items pulse and zoom for easy identification
• Blue marker shows your current location
• Tap map to close filter panel
• Glass container UI with crisp black text

📋 Events Tab
• Browse recent earthquakes in list format
• Sort by time, magnitude, or distance
• Tap any event to view on map with zoom and pulse
• Pull down to refresh data
• See time, location, magnitude, and depth
• Glass container displays with crisp black text

🌋 Volcanoes Tab
• Three tabs: Active Volcanoes, Super Volcanoes, and Warnings
• Active Volcanoes (44+ currently erupting):
  - Explore active volcanoes worldwide
  - View eruption history and status
  - See last eruption dates and activity summaries
  - Red markers on map (independent toggle in filters)
  - Click "Show on Map" to locate with zoom and pulse
  - Automatically enables Active Volcanoes filter on map
  - Grouped by country for easy navigation
  - Red left border on cards
• Super Volcanoes (11 major calderas):
  - Learn about Earth's largest volcanic systems
  - Read detailed descriptions and fun facts
  - View caldera sizes and eruption history
  - Black markers on map (independent toggle in filters)
  - Scrollable list with full descriptions
  - Click "Show on Map" to locate with zoom and pulse
  - Automatically enables Super Volcanoes filter on map
  - Black left border on cards
  - Comprehensive educational content
• Warnings Tab:
  - Live volcano eruption warnings from global sources
  - Sorted by alert level (warning, watch, advisory, normal)
  - Color-coded badges (Red=Warning, Orange=Watch, Blue=Advisory)
  - Auto-refresh every 5 minutes with countdown timer
  - Activity type and detailed descriptions
  - Source attribution and last update timestamp
  - Click "Show on Map" to locate volcano with coordinates
  - Border color matches alert severity
• Toggle volcano markers on map independently
• Pulsing animation shows selected volcano
• Modal view with scrollable details

🌊 Tsunami Tab
• Check active tsunami warnings
• View affected regions and threat levels
• Tap refresh icon for latest updates
• Read comprehensive safety guidelines:
  - Warning signs (rapid ocean recession, roaring sound)
  - Evacuation procedures
  - What to do before, during, and after
  - Emergency preparedness checklist

📖 Education Tab
• Learn about earthquake magnitudes
• Read comprehensive safety guides
• Understand what to do before, during, and after
• Access emergency preparedness tips
• Tsunami safety and recognition guidelines

⚙️ Settings Tab
• Customize display units (metric/imperial)
• Set time format (12h/24h)
• Configure earthquake notifications:
  - Enable/disable earthquake alerts
  - Filter by country (100+ countries)
  - Set minimum magnitude (3.0+ to 8.0+)
• Configure volcano notifications:
  - Enable/disable volcano alerts
  - Filter by country (100+ countries)
  - Separate control from earthquake notifications
• Toggle map features:
  - Clustering (group nearby events)
  - Heatmap (intensity visualization)
• Legend section:
  - Magnitude color scale (green to red)
  - Active volcano markers (red)
  - Super volcano markers (black)
  - Your location marker (blue)
  - Plate boundaries (red lines)
• View privacy policy and terms
• Access this comprehensive guide
• Reload welcome page
• Data source information

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECENT UPDATES

Version 1.0.0 (October 2025)
✨ Initial release
• Real-time earthquake monitoring with USGS data
• Interactive map with advanced filters:
  - Magnitude categories (Off, All, 0-10)
  - Plate boundaries toggle
  - Active volcanoes toggle (independent)
  - Super volcanoes toggle (independent)
  - All filters default to ON
• Volcano tracking system (Active + Super + Warnings)
• 44+ currently erupting volcanoes with red markers
• 11 supervolcanoes with black markers and detailed info
• Live volcano eruption warnings with auto-refresh
• Alert levels: Warning, Watch, Advisory, Normal
• Color-coded severity indicators
• Tsunami alert integration with timer
• Comprehensive tsunami safety guidelines
• Educational resources for all event types
• Separate notification controls:
  - Earthquake notifications (country + magnitude)
  - Volcano notifications (country-based)
  - Independent enable/disable for each
• Location-based distance calculations
• Impact radius visualization
• Zoom and pulse animations for selected items
• "Show on Map" feature auto-enables relevant filters
• Glass container UI with crisp black text
• Multi-platform support (iOS, Android, Web, iOS-Web)
• Smooth transitions and loading animations
• Welcome page with Earth imagery
• Comprehensive legend in Settings
• Timer displays for auto-updating data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIPS & TRICKS

💡 Quick Actions
• Double-tap map to zoom in
• Tap markers for quick info with zoom and pulse
• Swipe between tabs for faster navigation
• Pull down on lists to refresh data
• Switch between Active, Super, and Warnings volcano tabs
• Use Filters button to access map controls
• Tap map to close filter panel
• Click "Show on Map" to auto-enable filters and locate items

🎯 Best Practices
• Enable location for accurate distance calculations
• Set up separate notifications for earthquakes and volcanoes
• Configure country filters for relevant alerts
• Set appropriate magnitude thresholds for earthquakes
• Check volcano warnings tab for latest eruption alerts
• Check tsunami alerts regularly if near coast
• Review safety guides before emergencies
• Keep app updated for latest features
• Explore all three volcano tabs: Active, Super, and Warnings
• Use independent toggles for Active and Super volcanoes on map
• Read tsunami warning signs in Education tab
• Monitor auto-refresh timers for latest data

⚠️ Important Reminders
• This is NOT an official early warning system
• Always follow local emergency authorities
• Data may have delays or revisions
• Use for informational purposes only
• Supervolcano eruptions are extremely rare (millions of years)
• Tsunami warnings require immediate action
• Volcano warnings are informational, not official alerts
• Check multiple sources for critical events
• Map filters default to ON for comprehensive view
• Notifications work on iOS and Android (not web)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATA SOURCES

• USGS - United States Geological Survey
• NOAA/NWS - National Oceanic and Atmospheric Administration
• PHIVOLCS - Philippine Institute of Volcanology and Seismology
• Smithsonian GVP - Global Volcanism Program
• PB2002 - Tectonic Plate Boundaries

All data is updated automatically from trusted sources.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUPPORT & FEEDBACK

Need help? Have suggestions?
Contact: seismicsupport@icloud.com

Stay safe and informed! 🌍
`;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences } = usePreferences();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [volcanoCountryModalVisible, setVolcanoCountryModalVisible] = useState(false);
  const [magnitudeModalVisible, setMagnitudeModalVisible] = useState(false);
  const [tempCountry, setTempCountry] = useState<string>(preferences.notificationCountry || '');
  const [tempVolcanoCountry, setTempVolcanoCountry] = useState<string>(preferences.volcanoNotificationCountry || '');
  const [tempMagnitude, setTempMagnitude] = useState<string>(String(preferences.notificationMinMagnitude || 5.0));
  const [showSavedMessage, setShowSavedMessage] = useState<boolean>(false);
  const [iconColorModalVisible, setIconColorModalVisible] = useState<boolean>(false);
  const [glowColorModalVisible, setGlowColorModalVisible] = useState<boolean>(false);
  const [plateBoundaryColorModalVisible, setPlateBoundaryColorModalVisible] = useState<boolean>(false);

  const glassProps = { style: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } };

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

  const ICON_COLORS = [
    { value: '#000000', label: 'Black' },
    { value: '#FFFFFF', label: 'White' },
    { value: '#ef4444', label: 'Red' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#14b8a6', label: 'Teal' },
    { value: '#f97316', label: 'Dark Orange' },
  ];

  const GLOW_COLORS = [
    { value: '#60a5fa', label: 'Light Blue' },
    { value: '#ef4444', label: 'Red' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#fbbf24', label: 'Yellow' },
    { value: '#14b8a6', label: 'Teal' },
    { value: '#a855f7', label: 'Violet' },
    { value: '#06b6d4', label: 'Cyan' },
  ];

  const PLATE_BOUNDARY_COLORS = [
    { value: '#ef4444', label: 'Red' },
    { value: '#f97316', label: 'Orange' },
    { value: '#fbbf24', label: 'Yellow' },
    { value: '#10b981', label: 'Green' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#000000', label: 'Black' },
    { value: '#FFFFFF', label: 'White' },
    { value: '#14b8a6', label: 'Teal' },
  ];

  const handleCountrySave = () => {
    updatePreferences({ notificationCountry: tempCountry || undefined });
    setCountryModalVisible(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleVolcanoCountrySave = () => {
    updatePreferences({ volcanoNotificationCountry: tempVolcanoCountry || undefined });
    setVolcanoCountryModalVisible(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleMagnitudeSave = () => {
    const mag = parseFloat(tempMagnitude);
    if (!isNaN(mag) && mag >= 1.0 && mag <= 10.0) {
      updatePreferences({ notificationMinMagnitude: mag });
      setMagnitudeModalVisible(false);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
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
            <View style={styles.divider} />
            <SettingRow
              title="Icon Color"
              subtitle="Color for menu icons"
              value={ICON_COLORS.find(c => c.value === (preferences.customIconColor || '#000000'))?.label || 'Black'}
              onPress={() => setIconColorModalVisible(true)}
            />
            <View style={styles.divider} />
            <SettingRow
              title="Glow Color"
              subtitle="Color for active icon glow"
              value={GLOW_COLORS.find(c => c.value === (preferences.customGlowColor || '#60a5fa'))?.label || 'Light Blue'}
              onPress={() => setGlowColorModalVisible(true)}
            />
            <View style={styles.divider} />
            <SettingRow
              title="Plate Boundary Color"
              subtitle="Color for tectonic plate lines"
              value={PLATE_BOUNDARY_COLORS.find(c => c.value === (preferences.customPlateBoundaryColor || '#ef4444'))?.label || 'Red'}
              onPress={() => setPlateBoundaryColorModalVisible(true)}
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
          <Text style={styles.sectionTitle}>Legend</Text>
          <View style={styles.card}>
            <View style={styles.legendSection}>
              <Text style={styles.legendTitle}>Map Icons & Features</Text>
              
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#22c55e' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Magnitude 0-3</Text>
                  <Text style={styles.legendDescription}>Minor earthquakes, rarely felt</Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#84cc16' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Magnitude 3-4</Text>
                  <Text style={styles.legendDescription}>Often felt, minimal damage</Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#eab308' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Magnitude 4-5</Text>
                  <Text style={styles.legendDescription}>Noticeable shaking, light damage</Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#f97316' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Magnitude 5-6</Text>
                  <Text style={styles.legendDescription}>Moderate damage to buildings</Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#ef4444' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Magnitude 6-7</Text>
                  <Text style={styles.legendDescription}>Strong, destructive in populated areas</Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#dc2626' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Magnitude 7+</Text>
                  <Text style={styles.legendDescription}>Major to great, serious damage</Text>
                </View>
              </View>

              <View style={styles.legendDivider} />

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#ef4444' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Red Icons</Text>
                  <Text style={styles.legendDescription}>Active volcanoes (currently erupting)</Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#000000' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Black Icons</Text>
                  <Text style={styles.legendDescription}>Super volcanoes (major calderas)</Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: '#3b82f6' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Blue Icon</Text>
                  <Text style={styles.legendDescription}>Your current location</Text>
                </View>
              </View>

              <View style={styles.legendDivider} />

              <View style={styles.legendItem}>
                <View style={[styles.legendLine, { backgroundColor: '#ef4444' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Red Lines</Text>
                  <Text style={styles.legendDescription}>Tectonic plate boundaries</Text>
                </View>
              </View>
            </View>
          </View>
        </GlassView>

        <GlassView {...glassProps} style={styles.section}>
          <Text style={styles.sectionTitle}>Earthquake Notifications</Text>
          <View style={styles.card}>
            <SettingToggle
              title="Enable Earthquake Notifications"
              subtitle="Receive alerts for significant earthquakes"
              value={preferences.notificationsEnabled}
              onValueChange={(value) => updatePreferences({ notificationsEnabled: value })}
            />
            {preferences.notificationsEnabled && (
              <>
                <View style={styles.divider} />
                <SettingRow
                  title="Country"
                  subtitle="Filter earthquake notifications by country"
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
          </View>
        </GlassView>

        <GlassView {...glassProps} style={styles.section}>
          <Text style={styles.sectionTitle}>Volcano Notifications</Text>
          <View style={styles.card}>
            <SettingToggle
              title="Enable Volcano Notifications"
              subtitle="Receive alerts for volcano eruptions and warnings"
              value={preferences.volcanoNotificationsEnabled ?? true}
              onValueChange={(value) => updatePreferences({ volcanoNotificationsEnabled: value })}
            />
            {preferences.volcanoNotificationsEnabled && (
              <>
                <View style={styles.divider} />
                <SettingRow
                  title="Country"
                  subtitle="Filter volcano notifications by country"
                  value={preferences.volcanoNotificationCountry || 'All Countries'}
                  onPress={() => {
                    setTempVolcanoCountry(preferences.volcanoNotificationCountry || '');
                    setVolcanoCountryModalVisible(true);
                  }}
                />
              </>
            )}
          </View>
        </GlassView>

        <GlassView {...glassProps} style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => openModal('About This App', APP_INFO)}
              activeOpacity={0.7}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>About & How to Use</Text>
                <Text style={styles.settingSubtitle}>Learn about features and updates</Text>
              </View>
              <Info size={20} color={COLORS.text.secondary.light} />
            </TouchableOpacity>
            <View style={styles.divider} />
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

        {showSavedMessage && (
          <View style={styles.savedMessage}>
            <Text style={styles.savedMessageText}>Notification has been saved</Text>
          </View>
        )}
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

      <Modal visible={volcanoCountryModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country for Volcano Alerts</Text>
            <TouchableOpacity onPress={() => setVolcanoCountryModalVisible(false)}>
              <X size={24} color={COLORS.text.primary.light} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <TouchableOpacity
              style={[styles.countryOption, tempVolcanoCountry === '' && styles.countryOptionSelected]}
              onPress={() => setTempVolcanoCountry('')}
            >
              <Text style={[styles.countryOptionText, tempVolcanoCountry === '' && styles.countryOptionTextSelected]}>
                All Countries
              </Text>
            </TouchableOpacity>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country}
                style={[styles.countryOption, tempVolcanoCountry === country && styles.countryOptionSelected]}
                onPress={() => setTempVolcanoCountry(country)}
              >
                <Text style={[styles.countryOptionText, tempVolcanoCountry === country && styles.countryOptionTextSelected]}>
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveButton} onPress={handleVolcanoCountrySave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={iconColorModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Icon Color</Text>
            <TouchableOpacity onPress={() => setIconColorModalVisible(false)}>
              <X size={24} color={COLORS.text.primary.light} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.colorDescription}>
              Choose the color for all menu icons in the app.
            </Text>
            {ICON_COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  (preferences.customIconColor || '#000000') === color.value && styles.colorOptionSelected
                ]}
                onPress={() => {
                  updatePreferences({ customIconColor: color.value });
                  setIconColorModalVisible(false);
                }}
              >
                <View style={[styles.colorSwatch, { backgroundColor: color.value, borderWidth: color.value === '#FFFFFF' ? 1 : 0, borderColor: '#E5E5E5' }]} />
                <Text style={[
                  styles.colorOptionText,
                  (preferences.customIconColor || '#000000') === color.value && styles.colorOptionTextSelected
                ]}>
                  {color.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={glowColorModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Glow Color</Text>
            <TouchableOpacity onPress={() => setGlowColorModalVisible(false)}>
              <X size={24} color={COLORS.text.primary.light} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.colorDescription}>
              Choose the glow color for active icons in the app.
            </Text>
            {GLOW_COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  (preferences.customGlowColor || '#60a5fa') === color.value && styles.colorOptionSelected
                ]}
                onPress={() => {
                  updatePreferences({ customGlowColor: color.value });
                  setGlowColorModalVisible(false);
                }}
              >
                <View style={[styles.colorSwatch, { backgroundColor: color.value }]} />
                <Text style={[
                  styles.colorOptionText,
                  (preferences.customGlowColor || '#60a5fa') === color.value && styles.colorOptionTextSelected
                ]}>
                  {color.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={plateBoundaryColorModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Plate Boundary Color</Text>
            <TouchableOpacity onPress={() => setPlateBoundaryColorModalVisible(false)}>
              <X size={24} color={COLORS.text.primary.light} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.colorDescription}>
              Choose the color for tectonic plate boundary lines on the map.
            </Text>
            {PLATE_BOUNDARY_COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  (preferences.customPlateBoundaryColor || '#ef4444') === color.value && styles.colorOptionSelected
                ]}
                onPress={() => {
                  updatePreferences({ customPlateBoundaryColor: color.value });
                  setPlateBoundaryColorModalVisible(false);
                }}
              >
                <View style={[styles.colorSwatch, { backgroundColor: color.value, borderWidth: color.value === '#FFFFFF' ? 1 : 0, borderColor: '#E5E5E5' }]} />
                <Text style={[
                  styles.colorOptionText,
                  (preferences.customPlateBoundaryColor || '#ef4444') === color.value && styles.colorOptionTextSelected
                ]}>
                  {color.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  card: { 
    backgroundColor: COLORS.surface.light, 
    borderRadius: BORDER_RADIUS.lg, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
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
  savedMessage: { 
    position: 'absolute', 
    bottom: SPACING.xl, 
    left: SPACING.md, 
    right: SPACING.md, 
    backgroundColor: COLORS.primary[600], 
    borderRadius: BORDER_RADIUS.lg, 
    padding: SPACING.md, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  savedMessageText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light },
  colorDescription: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginBottom: SPACING.lg, lineHeight: 20 },
  colorOption: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border.light, marginBottom: SPACING.sm },
  colorOptionSelected: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
  colorSwatch: { width: 32, height: 32, borderRadius: 16, marginRight: SPACING.md },
  colorOptionText: { fontSize: FONT_SIZE.md, color: COLORS.text.primary.light },
  colorOptionTextSelected: { fontWeight: FONT_WEIGHT.semibold, color: COLORS.primary[600] },
  legendSection: { padding: SPACING.md },
  legendTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.text.primary.light, marginBottom: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.md },
  legendIcon: { width: 24, height: 24, borderRadius: 12 },
  legendLine: { width: 40, height: 3, borderRadius: 2 },
  legendTextContainer: { flex: 1 },
  legendLabel: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text.primary.light },
  legendDescription: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary.light, marginTop: 2 },
  legendDivider: { height: 1, backgroundColor: COLORS.border.light, marginVertical: SPACING.sm },
});
