import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

export function useIsMobile() {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR (not mounted), we default to desktop (false) to prevent hydration mismatches
  // Once mounted on the client, we return the actual mobile state
  return mounted ? width < 768 : false;
}
