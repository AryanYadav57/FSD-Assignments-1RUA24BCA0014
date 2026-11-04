// Design Tokens — single source of truth for all styling
export const Colors = {
  navy: '#14183E',
  navyLight: '#1E2652',
  coral: '#DF6951',
  coralDark: '#C8503A',
  coralLight: '#FEE9E5',
  yellow: '#F1A501',
  yellowDark: '#D99500',
  yellowLight: '#FEF3C7',
  cream: '#FFF8EE',
  creamDeep: '#FFF1DA',
  lavender: '#DFD7F9',
  lavenderLight: '#F8F7FF',
  slate: '#5E6282',
  slateLight: '#8D8FAD',
  slateLighter: '#C4C5D6',
  white: '#FFFFFF',
  offWhite: '#F8F7FF',
  border: '#EDEEF5',
  borderLight: '#F4F5FB',
  black: '#000000',
  sky: '#38BDF8',
  skyDark: '#0284C7',
  teal: '#006380',
  ratingYellow: '#F1A501',
  rose: '#F43F5E',
  success: '#10B981',
  successLight: 'rgba(16,185,129,0.1)',
  // Gradients used as background colors
  heroGradientStart: '#FFFBF5',
  heroGradientEnd: '#F8F7FF',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  section: 96,
} as const;

export const Radii = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
  hero: 56,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const FontFamily = {
  serif: 'Volkhov_700Bold',
  serifItalic: 'Volkhov_700Bold_Italic',
  sans: 'Poppins_400Regular',
  sansMedium: 'Poppins_500Medium',
  sansSemibold: 'Poppins_600SemiBold',
  sansBold: 'Poppins_700Bold',
  sansExtrabold: 'Poppins_800ExtraBold',
} as const;

export const Shadows = {
  soft: {
    shadowColor: '#14183E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  medium: {
    shadowColor: '#14183E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 6,
  },
  cardLift: {
    shadowColor: '#14183E',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.13,
    shadowRadius: 40,
    elevation: 10,
  },
  cardLiftStrong: {
    shadowColor: '#14183E',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 48,
    elevation: 14,
  },
  glowCoral: {
    shadowColor: '#DF6951',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  glowYellow: {
    shadowColor: '#F1A501',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  glowNavy: {
    shadowColor: '#14183E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export const Breakpoints = {
  mobile: 768,
  tablet: 1024,
} as const;
