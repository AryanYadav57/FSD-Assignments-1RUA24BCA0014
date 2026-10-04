import { create } from 'zustand';
import { Note } from '@/lib/types';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId: string | null;
  isQuickCaptureOpen: boolean;
  isCommandPaletteOpen: boolean;

  // Actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  setSelectedNoteId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  toggleQuickCapture: () => void;
  openQuickCapture: () => void;
  closeQuickCapture: () => void;
  toggleCommandPalette: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  isLoading: false,
  selectedNoteId: null,
  isQuickCaptureOpen: false,
  isCommandPaletteOpen: false,

  setNotes: (notes) => set({ notes }),

  addNote: (note) =>
    set((state) => ({
      notes: [note, ...state.notes],
    })),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),

  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  setLoading: (isLoading) => set({ isLoading }),

  toggleQuickCapture: () =>
    set((state) => ({ isQuickCaptureOpen: !state.isQuickCaptureOpen })),
  openQuickCapture: () => set({ isQuickCaptureOpen: true }),
  closeQuickCapture: () => set({ isQuickCaptureOpen: false }),

  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
}));
