export const COLORS = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E3A8A',
    900: '#1E3A5F',
    950: '#0A1929',
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
    dark: '#0A1929',
  },
  surface: {
    light: '#F8FAFC',
    dark: '#1E3A5F',
  },
  text: {
    primary: {
      light: '#0F172A',
      dark: '#F8FAFC',
    },
    secondary: {
      light: '#64748B',
      dark: '#94A3B8',
    },
  },
  border: {
    light: '#E2E8F0',
    dark: '#334155',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
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
