import { Platform } from 'react-native';

export const COLORS = {
  primary: '#8A1538',
  primaryLight: '#A62148',
  primaryDark: '#630E26',
  primaryFg: '#FFFFFF',

  accent: '#4E7B62',
  accentLight: '#679B7F',
  accentDark: '#325441',
  accentFg: '#FFFFFF',

  bg: '#FAF9F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EFEA',

  textPrimary: '#2C2525',
  textSecondary: '#5C5353',
  textMuted: '#8A8181',

  border: '#E8E2DD',

  success: '#4E7B62',
  warning: '#D4A373',
  error: '#B23A48',

  overlay: 'rgba(44, 37, 37, 0.4)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FONT = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const SHADOW = Platform.select({
  web: {
    sm: { boxShadow: '0 2px 6px rgba(44,37,37,0.06)' } as any,
    md: { boxShadow: '0 4px 12px rgba(44,37,37,0.08)' } as any,
  },
  default: {
    sm: {
      shadowColor: '#2C2525',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    md: {
      shadowColor: '#2C2525',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  },
})!;
