import { create } from 'zustand';

interface AuthState {
  session: any | null;
  user: any | null;
  isLoading: boolean;
  setSession: (session: any | null) => void;
  setUser: (user: any | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),

  signOut: () =>
    set({
      session: null,
      user: null,
    }),
}));
