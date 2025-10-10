# Seismic Monitor - Complete Documentation

## 📱 App Overview

A production-ready earthquake and volcanic activity monitoring app built with React Native and Expo. Features real-time USGS data, interactive maps with animated shockwave effects, comprehensive safety education, and offline support.

## 🎯 Key Features Implemented

### 1. Interactive Map Screen (`app/(tabs)/index.tsx`)
- Real-time earthquake visualization with react-native-maps
- Magnitude-scaled markers with color coding
- Animated shockwave pulse effects on selected markers
- Info cards showing earthquake details
- User location tracking
- Pull-to-refresh functionality
- Last updated timestamp

### 2. Events List Screen (`app/(tabs)/events.tsx`)
- Three tabs: All, Significant, Recent (last hour)
- Sortable by: Time, Magnitude, Distance
- Earthquake cards with:
  - Magnitude badge (color-coded)
  - Location and time
  - Depth information
  - Distance from user
  - Tsunami warnings
- Pull-to-refresh
- Empty states

### 3. Education Hub (`app/(tabs)/education.tsx`)
- Interactive magnitude scale (1.0-10.0)
  - Color-coded badges
  - Effects descriptions
  - Frequency information
  - Real-world examples
- Safety guides:
  - Before earthquake preparation
  - During earthquake actions (Drop, Cover, Hold On)
  - After earthquake recovery
  - Volcano safety (ashfall, evacuation)
- Source citations (USGS, FEMA, Red Cross, CDC)
- Safety disclaimer

### 4. Settings Screen (`app/(tabs)/settings.tsx`)
- Display preferences:
  - Units (Metric/Imperial)
  - Time format (12h/24h)
- Data sources toggles:
  - Earthquakes (USGS)
  - Volcanoes (coming soon)
- Map settings:
  - Clustering
  - Heatmap (coming soon)
- Notifications:
  - Enable/disable
  - Quiet hours
- About section with version and data sources

## 🏗️ Architecture

### State Management

#### 1. PreferencesContext (`contexts/PreferencesContext.tsx`)
Manages user preferences stored in SQLite:
```typescript
{
  units: 'metric' | 'imperial',
  timeFormat: '12h' | '24h',
  pollingFrequency: number,
  earthquakesEnabled: boolean,
  volcanoesEnabled: boolean,
  heatmapEnabled: boolean,
  clusteringEnabled: boolean,
  theme: 'light' | 'dark' | 'auto',
  notificationsEnabled: boolean,
  quietHoursEnabled: boolean,
  quietHoursStart?: string,
  quietHoursEnd?: string,
}
```

#### 2. EarthquakesContext (`contexts/EarthquakesContext.tsx`)
Manages earthquake data with React Query:
- Fetches from USGS API
- Caches to SQLite
- Auto-refreshes based on polling frequency
- Provides filtered views (significant, recent)
- Handles offline mode

#### 3. LocationContext (`contexts/LocationContext.tsx`)
Manages location services and saved places:
- Requests location permissions
- Gets current user location
- Manages saved places (CRUD operations)
- Calculates distances

### Database Schema (SQLite)

#### earthquakes table
```sql
CREATE TABLE earthquakes (
  id TEXT PRIMARY KEY,
  time INTEGER NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  magnitude REAL NOT NULL,
  magnitudeType TEXT,
  depth REAL NOT NULL,
  place TEXT NOT NULL,
  mmi REAL,
  tsunami INTEGER NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  felt INTEGER,
  cdi REAL,
  alert TEXT,
  sig INTEGER NOT NULL,
  -- ... additional fields
  cached_at INTEGER NOT NULL
);
```

#### saved_places table
```sql
CREATE TABLE saved_places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius REAL NOT NULL,
  minMagnitude REAL NOT NULL,
  alertsEnabled INTEGER NOT NULL,
  createdAt INTEGER NOT NULL
);
```

#### alert_thresholds table
```sql
CREATE TABLE alert_thresholds (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  minMagnitude REAL NOT NULL,
  radius REAL,
  locationId TEXT,
  enabled INTEGER NOT NULL,
  earthquakesEnabled INTEGER NOT NULL,
  volcanoesEnabled INTEGER NOT NULL
);
```

#### user_preferences table
```sql
CREATE TABLE user_preferences (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  units TEXT NOT NULL,
  timeFormat TEXT NOT NULL,
  pollingFrequency INTEGER NOT NULL,
  -- ... all preference fields
);
```

### API Integration

#### USGS Earthquake API
Base URL: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/`

Endpoints:
- `all_hour.geojson` - All earthquakes in the past hour
- `all_day.geojson` - All earthquakes in the past day
- `all_week.geojson` - All earthquakes in the past week
- `all_month.geojson` - All earthquakes in the past month
- `significant_day.geojson` - Significant earthquakes
- `4.5_day.geojson` - M4.5+ earthquakes
- `2.5_day.geojson` - M2.5+ earthquakes
- `1.0_day.geojson` - M1.0+ earthquakes

Response format (GeoJSON):
```json
{
  "type": "FeatureCollection",
  "metadata": {
    "generated": 1234567890000,
    "url": "...",
    "title": "...",
    "count": 123
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mag": 5.2,
        "place": "10 km NE of City, Country",
        "time": 1234567890000,
        "tsunami": 0,
        "alert": "green",
        "mmi": 4.5,
        // ... more properties
      },
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude, depth]
      },
      "id": "us1000abcd"
    }
  ]
}
```

#### Retry Logic
- 3 retry attempts with exponential backoff
- Backoff: 1s, 2s, 4s (max 10s)
- Falls back to cached data on failure

## 🎨 Design System

### Colors (`constants/theme.ts`)
```typescript
COLORS = {
  primary: { 50-950 }, // Blue shades
  magnitude: {
    micro: '#10B981',    // Green
    minor: '#34D399',    // Light green
    light: '#FCD34D',    // Yellow
    moderate: '#FBBF24', // Orange-yellow
    strong: '#F59E0B',   // Orange
    major: '#F97316',    // Dark orange
    great: '#EF4444',    // Red
    epic: '#991B1B',     // Dark red
  },
  alert: {
    green: '#10B981',
    yellow: '#FBBF24',
    orange: '#F97316',
    red: '#DC2626',
  },
  background: {
    light: '#FFFFFF',
    dark: '#0A1929',
  },
  surface: {
    light: '#F8FAFC',
    dark: '#1E3A5F',
  },
  text: {
    primary: { light: '#0F172A', dark: '#F8FAFC' },
    secondary: { light: '#64748B', dark: '#94A3B8' },
  },
}
```

### Typography
- Font sizes: xs(12), sm(14), md(16), lg(18), xl(20), xxl(24), xxxl(32)
- Font weights: normal(400), medium(500), semibold(600), bold(700)

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

## 🔧 Utility Functions

### Distance Calculation (`services/api.ts`)
```typescript
calculateDistance(lat1, lon1, lat2, lon2): number
// Returns distance in kilometers using Haversine formula
```

### Time Formatting
```typescript
formatTime(timestamp, format): string
// Returns: "Just now", "5m ago", "2h ago", "3d ago", or formatted date

formatFullTime(timestamp, format): string
// Returns: "January 15, 2025, 3:45:30 PM PST"
```

### Earthquake Filtering (`utils/helpers.ts`)
```typescript
filterEarthquakes(earthquakes, filters): Earthquake[]
// Filters by: minMagnitude, maxMagnitude, minDepth, maxDepth, 
//             maxDistance, significantOnly
```

### Earthquake Sorting
```typescript
sortEarthquakes(earthquakes, field, direction, userLocation): Earthquake[]
// Sorts by: time, magnitude, distance, depth
// Direction: asc, desc
```

### Damage Description
```typescript
getDamageDescription(magnitude, mmi?): string
// Returns human-readable damage potential
```

### Safety Tips
```typescript
getQuickSafetyTip(magnitude, tsunami): string
// Returns contextual safety advice
```

## 📊 Data Models

### Earthquake
```typescript
interface Earthquake {
  id: string;
  time: number;
  latitude: number;
  longitude: number;
  magnitude: number;
  magnitudeType: string;
  depth: number;
  place: string;
  mmi?: number;
  tsunami: boolean;
  url: string;
  source: string;
  status: string;
  type: string;
  felt?: number;
  cdi?: number;
  alert?: 'green' | 'yellow' | 'orange' | 'red';
  sig: number;
  // ... additional fields
}
```

### SavedPlace
```typescript
interface SavedPlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  minMagnitude: number;
  alertsEnabled: boolean;
  createdAt: number;
}
```

### AlertThreshold
```typescript
interface AlertThreshold {
  id: string;
  type: 'global' | 'location';
  minMagnitude: number;
  radius?: number;
  locationId?: string;
  enabled: boolean;
  earthquakesEnabled: boolean;
  volcanoesEnabled: boolean;
}
```

## 🚀 Build & Deployment

### Development
```bash
# Start development server
bun start

# Run on iOS
bun ios

# Run on Android
bun android

# Run on Web
bun web
```

### Production Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Environment Configuration

#### app.json
```json
{
  "expo": {
    "name": "Seismic Monitor",
    "slug": "seismic-monitor",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "seismicmonitor",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A1929"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.seismicmonitor",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "We need your location to show distance to nearby earthquakes.",
        "NSLocationAlwaysUsageDescription": "We need your location to send alerts for earthquakes near you."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#0A1929"
      },
      "package": "com.yourcompany.seismicmonitor",
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-sqlite",
      "expo-location"
    ]
  }
}
```

## 🧪 Testing Checklist

### Functional Testing
- [ ] Map loads with earthquake markers
- [ ] Markers show correct magnitude colors
- [ ] Shockwave animation plays on selection
- [ ] Info card displays correct data
- [ ] Events list shows all earthquakes
- [ ] Sorting changes order correctly
- [ ] Filtering shows correct subset
- [ ] Pull-to-refresh updates data
- [ ] Education content displays correctly
- [ ] Settings toggles persist
- [ ] Units conversion works
- [ ] Time format changes apply
- [ ] Offline mode loads cached data
- [ ] Location permission flow works
- [ ] Distance calculations are accurate

### Performance Testing
- [ ] Cold start < 2.5s (Android), < 1.5s (iOS)
- [ ] Map scrolling at 60fps
- [ ] List scrolling smooth
- [ ] Memory usage < 150MB
- [ ] No memory leaks
- [ ] Battery drain acceptable

### Accessibility Testing
- [ ] VoiceOver/TalkBack navigation works
- [ ] All interactive elements have labels
- [ ] Color contrast meets WCAG AA
- [ ] Dynamic Type support
- [ ] Keyboard navigation (web)

## 🐛 Troubleshooting

### Common Issues

#### Database initialization fails
```typescript
// Check if database file is corrupted
// Solution: Clear app data or reinstall
```

#### Map not loading
```typescript
// Check if react-native-maps is properly installed
// iOS: pod install
// Android: Check google-services.json
```

#### Location permission denied
```typescript
// Check Info.plist (iOS) or AndroidManifest.xml
// Ensure permission strings are present
```

#### API fetch fails
```typescript
// Check network connection
// Verify USGS API is accessible
// Check retry logic in services/api.ts
```

## 📈 Future Enhancements

### Phase 2 (Ready to Implement)
1. **Push Notifications**
   - Background fetch for new events
   - Alert threshold notifications
   - Quiet hours respect
   - Deep linking from notifications

2. **Saved Places**
   - UI for managing saved places
   - Per-place alert settings
   - Geofenced alerts

3. **Volcano Data**
   - Smithsonian GVP integration
   - Volcano markers on map
   - Eruption alerts
   - Volcanic activity levels

### Phase 3 (Future)
1. **Advanced Features**
   - ShakeMap intensity overlays
   - Historical earthquake search
   - Statistics and trends
   - Shareable event cards
   - Widgets (iOS/Android)

2. **Social Features**
   - "Did you feel it?" reports
   - Community safety tips
   - Emergency contacts

3. **Premium Features**
   - Advanced filtering
   - Custom alert zones
   - Export data
   - Ad-free experience

## 📞 Support & Resources

### Documentation
- Expo Docs: https://docs.expo.dev
- React Native: https://reactnative.dev
- React Query: https://tanstack.com/query
- USGS API: https://earthquake.usgs.gov/fdsnws/event/1/

### Data Sources
- USGS: https://earthquake.usgs.gov
- Smithsonian GVP: https://volcano.si.edu
- FEMA: https://www.ready.gov/earthquakes
- Red Cross: https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/earthquake.html

### Safety Resources
- ShakeOut: https://www.shakeout.org
- Earthquake Country Alliance: https://www.earthquakecountry.org
- CDC Emergency Preparedness: https://www.cdc.gov/disasters/earthquakes/

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-10  
**Built with**: React Native, Expo, TypeScript
