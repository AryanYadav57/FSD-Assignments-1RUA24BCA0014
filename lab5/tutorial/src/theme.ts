export type ThemeName = 'noir' | 'samba' | 'psychological' | 'giallo' | 'sci-fi';

export type ThemePalette = {
  name: ThemeName;
  label: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceGlass: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentGlow: string;
  accentWash: string;
  gridLine: string;
  border: string;
  borderStrong: string;
  badgeBg: string;
  badgeText: string;
  searchBg: string;
  success: string;
  warning: string;
  danger: string;
};

export const themes: Record<ThemeName, ThemePalette> = {
  noir: {
    name: 'noir',
    label: 'NOIR',
    background: '#111215',
    surface: '#18191e',
    surfaceElevated: '#20222a',
    surfaceGlass: 'rgba(24, 25, 30, 0.85)',
    text: '#ffffff',
    textMuted: '#9aa2b1',
    textDim: '#5c6370',
    accent: '#ffffff',
    accentGlow: 'rgba(255, 255, 255, 0.15)',
    accentWash: '#1c1d22',
    gridLine: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.12)',
    borderStrong: 'rgba(255, 255, 255, 0.28)',
    badgeBg: '#ffffff',
    badgeText: '#0f1012',
    searchBg: 'rgba(32, 35, 42, 0.9)',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
  },
  samba: {
    name: 'samba',
    label: 'SAMBA',
    background: '#18130e',
    surface: '#221b14',
    surfaceElevated: '#2d241a',
    surfaceGlass: 'rgba(34, 27, 20, 0.85)',
    text: '#fff6ed',
    textMuted: '#bda895',
    textDim: '#736152',
    accent: '#f3a65a',
    accentGlow: 'rgba(243, 166, 90, 0.2)',
    accentWash: '#2b2117',
    gridLine: 'rgba(243, 166, 90, 0.08)',
    border: 'rgba(243, 166, 90, 0.18)',
    borderStrong: 'rgba(243, 166, 90, 0.38)',
    badgeBg: '#f3a65a',
    badgeText: '#18130e',
    searchBg: 'rgba(45, 36, 26, 0.9)',
    success: '#4ade80',
    warning: '#f3a65a',
    danger: '#fb7185',
  },
  psychological: {
    name: 'psychological',
    label: 'PSYCHOLOGICAL',
    background: '#170f19',
    surface: '#221525',
    surfaceElevated: '#2d1b31',
    surfaceGlass: 'rgba(34, 21, 37, 0.85)',
    text: '#faeffa',
    textMuted: '#b99ebc',
    textDim: '#6c5570',
    accent: '#d86f93',
    accentGlow: 'rgba(216, 111, 147, 0.2)',
    accentWash: '#2c1930',
    gridLine: 'rgba(216, 111, 147, 0.08)',
    border: 'rgba(216, 111, 147, 0.18)',
    borderStrong: 'rgba(216, 111, 147, 0.38)',
    badgeBg: '#d86f93',
    badgeText: '#170f19',
    searchBg: 'rgba(45, 27, 49, 0.9)',
    success: '#34d399',
    warning: '#f472b6',
    danger: '#f43f5e',
  },
  giallo: {
    name: 'giallo',
    label: 'GIALLO',
    background: '#16150d',
    surface: '#201f12',
    surfaceElevated: '#2c2b18',
    surfaceGlass: 'rgba(32, 31, 18, 0.85)',
    text: '#fffdec',
    textMuted: '#b7b494',
    textDim: '#68664d',
    accent: '#f2d84b',
    accentGlow: 'rgba(242, 216, 75, 0.2)',
    accentWash: '#292714',
    gridLine: 'rgba(242, 216, 75, 0.08)',
    border: 'rgba(242, 216, 75, 0.18)',
    borderStrong: 'rgba(242, 216, 75, 0.38)',
    badgeBg: '#f2d84b',
    badgeText: '#16150d',
    searchBg: 'rgba(44, 43, 24, 0.9)',
    success: '#86efac',
    warning: '#f2d84b',
    danger: '#f87171',
  },
  'sci-fi': {
    name: 'sci-fi',
    label: 'SCI-FI',
    background: '#0c141d',
    surface: '#131e2b',
    surfaceElevated: '#1a293a',
    surfaceGlass: 'rgba(19, 30, 43, 0.85)',
    text: '#f0f9ff',
    textMuted: '#94a9bf',
    textDim: '#4e6277',
    accent: '#6fd4ff',
    accentGlow: 'rgba(111, 212, 255, 0.22)',
    accentWash: '#152535',
    gridLine: 'rgba(111, 212, 255, 0.08)',
    border: 'rgba(111, 212, 255, 0.18)',
    borderStrong: 'rgba(111, 212, 255, 0.38)',
    badgeBg: '#6fd4ff',
    badgeText: '#0c141d',
    searchBg: 'rgba(26, 41, 58, 0.9)',
    success: '#38bdf8',
    warning: '#facc15',
    danger: '#fb7185',
  },
};

export const defaultTheme = themes.noir;

// Backward-compatible fallback tokens for legacy components
export const colors = {
  background: defaultTheme.background,
  backgroundAlt: defaultTheme.surface,
  border: defaultTheme.border,
  card: defaultTheme.surface,
  cardTint: defaultTheme.accentWash,
  codeBackground: '#0b0d11',
  codeText: '#e2e8f0',
  danger: '#ef4444',
  ink: '#ffffff',
  muted: defaultTheme.textDim,
  mutedText: defaultTheme.textMuted,
  primary: '#38bdf8',
  primaryPressed: '#0284c7',
  rail: '#18191e',
  rose: '#f43f5e',
  success: '#10b981',
  text: defaultTheme.text,
  teal: '#14b8a6',
  warning: '#f59e0b',
  warningPressed: '#d97706',
} as const;

export const radii = {
  full: 9999,
  xl: 18,
  lg: 12,
  md: 8,
  sm: 6,
  xs: 4,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;
