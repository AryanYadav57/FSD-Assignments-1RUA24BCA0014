import { useWindowDimensions } from 'react-native';
import { Breakpoints } from '../constants/theme';

export interface Breakpoint {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return {
    isMobile: width < Breakpoints.mobile,
    isTablet: width >= Breakpoints.mobile && width < Breakpoints.tablet,
    isDesktop: width >= Breakpoints.tablet,
    width,
  };
}
