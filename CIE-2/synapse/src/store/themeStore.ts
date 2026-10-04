import { create } from 'zustand';
import { Platform } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  if (Platform.OS === 'web') {
    try {
      const stored = localStorage.getItem('synapse-theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') return stored;
      // Respect OS preference
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {}
  }
  return 'light';
}

function applyTheme(theme: Theme) {
  if (Platform.OS !== 'web') return;
  try {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('synapse-theme', theme);
  } catch {}
}

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = getInitialTheme();
  // Apply on boot
  if (Platform.OS === 'web') {
    setTimeout(() => applyTheme(initialTheme), 0);
  }

  return {
    theme: initialTheme,
    isDark: initialTheme === 'dark',

    setTheme: (theme) => {
      applyTheme(theme);
      set({ theme, isDark: theme === 'dark' });
    },

    toggleTheme: () => {
      set((state) => {
        const next: Theme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        return { theme: next, isDark: next === 'dark' };
      });
    },
  };
});
