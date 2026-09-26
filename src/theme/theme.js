export const colors = {
  background: '#FFF8E7',
  surface: '#FFFFFF',
  surfaceMuted: '#FFF1CE',
  primary: '#FFA000',
  primaryDark: '#E65100',
  accent: '#FFC107',
  textOnPrimary: '#2B1600',
  textPrimary: '#2B1600',
  textSecondary: '#8A6D3B',
  border: '#F2D08A',
  success: '#2E7D32',
  danger: '#C62828',
  boxStroke: '#E65100',
};

export const spacing = {
  xs: 6,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confidenceBig: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primaryDark,
  },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  button: {
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
};
