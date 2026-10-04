import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const LIBRARY_STORAGE_KEY = 'spawn-gg-saved-games-v1';
const MAX_SAVED_GAMES = 6;
const MAX_GAME_HTML_LENGTH = 650_000;

export type SavedGame = {
  id: string;
  title: string;
  html: string;
  enrichedBrief: string;
  runtimeVersion: string;
  createdAt: string;
};

async function readStoredGames(): Promise<string | null> {
  if (Platform.OS !== 'web') return AsyncStorage.getItem(LIBRARY_STORAGE_KEY);
  try { return typeof window === 'undefined' ? null : window.localStorage.getItem(LIBRARY_STORAGE_KEY); } catch { return null; }
}

async function writeStoredGames(value: string): Promise<void> {
  if (Platform.OS !== 'web') return AsyncStorage.setItem(LIBRARY_STORAGE_KEY, value);
  if (typeof window === 'undefined') throw new Error('Browser storage is unavailable.');
  window.localStorage.setItem(LIBRARY_STORAGE_KEY, value);
}

function isSavedGame(value: unknown): value is SavedGame {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedGame>;
  return typeof item.id === 'string' && item.id.length > 0 &&
    typeof item.title === 'string' && item.title.length > 0 && item.title.length <= 60 &&
    typeof item.html === 'string' && item.html.length > 0 && item.html.length <= MAX_GAME_HTML_LENGTH &&
    (item.runtimeVersion === undefined || typeof item.runtimeVersion === 'string') &&
    (item.enrichedBrief === undefined || typeof item.enrichedBrief === 'string');
}

export async function readSavedGames(): Promise<SavedGame[]> {
  try {
    const parsed: unknown = JSON.parse(await readStoredGames() ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedGame).map((item) => ({
      ...item,
      enrichedBrief: item.enrichedBrief ?? '',
      runtimeVersion: item.runtimeVersion ?? '',
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : '',
    }));
  } catch {
    return [];
  }
}

export async function getSavedGame(id: string | undefined): Promise<SavedGame | undefined> {
  if (!id) return undefined;
  return (await readSavedGames()).find((game) => game.id === id);
}

export async function saveGeneratedGame(game: Omit<SavedGame, 'id' | 'createdAt'>): Promise<string | null> {
  if (!game.html || game.html.length > MAX_GAME_HTML_LENGTH || !['', '1', '2'].includes(game.runtimeVersion)) return null;
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `game-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const saved: SavedGame = { ...game, id, createdAt: new Date().toISOString() };
  try {
    const games = [saved, ...(await readSavedGames()).filter((item) => item.id !== id)].slice(0, MAX_SAVED_GAMES);
    await writeStoredGames(JSON.stringify(games));
    return id;
  } catch {
    return null;
  }
}

export async function removeSavedGame(id: string): Promise<SavedGame[]> {
  const games = (await readSavedGames()).filter((game) => game.id !== id);
  try { await writeStoredGames(JSON.stringify(games)); } catch { /* Keep the page usable if storage is full. */ }
  return games;
}
