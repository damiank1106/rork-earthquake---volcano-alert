import { Platform } from 'react-native';

const isIOSWeb = Platform.OS === 'web' && typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);
const scaleFactor = isIOSWeb ? 0.85 : 1;

export const COLORS = {
  primary: {
    50: '#FFFFFF',
    100: '#F8F8F8',
    200: '#F1F1F1',
    300: '#E5E5E5',
    400: '#D4D4D4',
    500: '#A3A3A3',
    600: '#737373',
    700: '#525252',
    800: '#404040',
    900: '#262626',
    950: '#171717',
  },
  magnitude: {
    micro: '#10B981',
    minor: '#34D399',
    light: '#FCD34D',
    moderate: '#FBBF24',
    strong: '#F59E0B',
    major: '#F97316',
    great: '#EF4444',
    epic: '#991B1B',
  },
  alert: {
    green: '#10B981',
    yellow: '#FBBF24',
    orange: '#F97316',
    red: '#DC2626',
  },
  volcano: {
    normal: '#10B981',
    advisory: '#FBBF24',
    watch: '#F97316',
    warning: '#DC2626',
  },
  background: {
    light: '#FFFFFF',
    dark: '#F8F8F8',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#F1F1F1',
  },
  text: {
    primary: {
      light: '#171717',
      dark: '#F8F8F8',
    },
    secondary: {
      light: '#737373',
      dark: '#D4D4D4',
    },
  },
  border: {
    light: '#E5E5E5',
    dark: '#D4D4D4',
  },
};

export const SPACING = {
  xs: Math.round(4 * scaleFactor),
  sm: Math.round(8 * scaleFactor),
  md: Math.round(16 * scaleFactor),
  lg: Math.round(24 * scaleFactor),
  xl: Math.round(32 * scaleFactor),
  xxl: Math.round(48 * scaleFactor),
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FONT_SIZE = {
  xs: Math.round(12 * scaleFactor),
  sm: Math.round(14 * scaleFactor),
  md: Math.round(16 * scaleFactor),
  lg: Math.round(18 * scaleFactor),
  xl: Math.round(20 * scaleFactor),
  xxl: Math.round(24 * scaleFactor),
  xxxl: Math.round(32 * scaleFactor),
};

export const FONT_WEIGHT = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const getMagnitudeColor = (magnitude: number): string => {
  if (magnitude < 2) return COLORS.magnitude.micro;
  if (magnitude < 3) return COLORS.magnitude.minor;
  if (magnitude < 4) return COLORS.magnitude.light;
  if (magnitude < 5) return COLORS.magnitude.moderate;
  if (magnitude < 6) return COLORS.magnitude.strong;
  if (magnitude < 7) return COLORS.magnitude.major;
  if (magnitude < 8) return COLORS.magnitude.great;
  return COLORS.magnitude.epic;
};

export const getAlertColor = (alert?: 'green' | 'yellow' | 'orange' | 'red'): string => {
  if (!alert) return COLORS.magnitude.moderate;
  return COLORS.alert[alert];
};

export const getVolcanoAlertColor = (
  alertLevel?: 'normal' | 'advisory' | 'watch' | 'warning'
): string => {
  if (!alertLevel) return COLORS.volcano.normal;
  return COLORS.volcano[alertLevel];
};
