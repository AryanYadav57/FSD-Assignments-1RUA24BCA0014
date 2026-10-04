export const THEME_STORAGE_KEY = 'spawn-gg-studio-theme';

export const STUDIO_THEMES = [
  {
    id: 'iron', name: 'Iron', swatch: '#30383d',
    canvas: '#17191b', canvasDeep: '#0d0f11', gradient: 'linear-gradient(138deg, #1e2023 0%, #151719 48%, #0d0f11 100%)',
    surface: '#1d2023', surfaceAlt: '#15181b', input: '#111315', border: '#2d3236',
    accent: '#b9c3c9', ink: '#f0f2f3', muted: '#a9afb3', buttonText: '#111315',
  },
  {
    id: 'graphite', name: 'Graphite', swatch: '#282b30',
    canvas: '#17191b', canvasDeep: '#0d0f11', gradient: 'linear-gradient(145deg, #202225 0%, #151719 48%, #0d0f11 100%)',
    surface: '#1d2023', surfaceAlt: '#15181b', input: '#111315', border: '#2d3236',
    accent: '#d0d3d6', ink: '#f0f2f3', muted: '#a9afb3', buttonText: '#111315',
  },
  {
    id: 'umber', name: 'Umber', swatch: '#38261d',
    canvas: '#17191b', canvasDeep: '#0d0f11', gradient: 'linear-gradient(140deg, #202225 0%, #151719 52%, #0d0f11 100%)',
    surface: '#1d2023', surfaceAlt: '#15181b', input: '#111315', border: '#2d3236',
    accent: '#c7a98f', ink: '#f0f2f3', muted: '#a9afb3', buttonText: '#171310',
  },
  {
    id: 'oxblood', name: 'Oxblood', swatch: '#3b151f',
    canvas: '#17191b', canvasDeep: '#0d0f11', gradient: 'linear-gradient(140deg, #202225 0%, #151719 52%, #0d0f11 100%)',
    surface: '#1d2023', surfaceAlt: '#15181b', input: '#111315', border: '#2d3236',
    accent: '#d08b98', ink: '#f0f2f3', muted: '#a9afb3', buttonText: '#1a1012',
  },
  {
    id: 'moss', name: 'Moss', swatch: '#1c3027',
    canvas: '#17191b', canvasDeep: '#0d0f11', gradient: 'linear-gradient(140deg, #202225 0%, #151719 52%, #0d0f11 100%)',
    surface: '#1d2023', surfaceAlt: '#15181b', input: '#111315', border: '#2d3236',
    accent: '#a8c7b1', ink: '#f0f2f3', muted: '#a9afb3', buttonText: '#111713',
  },
] as const;

export type StudioThemeId = (typeof STUDIO_THEMES)[number]['id'];

export function isStudioThemeId(value: string | null): value is StudioThemeId {
  return STUDIO_THEMES.some((theme) => theme.id === value);
}

export function readSavedStudioTheme(): StudioThemeId {
  if (typeof window === 'undefined') return 'iron';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isStudioThemeId(saved) ? saved : 'iron';
  } catch {
    return 'iron';
  }
}
