import { Platform } from 'react-native';

export const typography = {
  fontFamily: Platform.select({
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", Helvetica, Arial, sans-serif',
    default: 'System',
  }),
  sizes: {
    xs: 12,
    sm: 14,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 30,
  },
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 22,
    lg: 24,
    xl: 32,
    xxl: 38,
  },
};
