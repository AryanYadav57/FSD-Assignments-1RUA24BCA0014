import { create } from 'zustand';
import { Profile } from '@/lib/types';
import { fetchProfile, createProfile, updateProfile, checkUsernameAvailable } from '@/lib/profiles';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  setProfile: (profile: Profile | null) => void;
  fetchAndSetProfile: (userId: string) => Promise<void>;
  saveProfile: (
    userId: string,
    updates: Partial<Pick<Profile, 'username' | 'display_name'>>
  ) => Promise<boolean>;
  createAndSetProfile: (
    userId: string,
    username: string,
    displayName?: string
  ) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,

  setProfile: (profile) => set({ profile }),

  fetchAndSetProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    const profile = await fetchProfile(userId);
    set({ profile, isLoading: false });
  },

  saveProfile: async (userId, updates) => {
    set({ isSaving: true, error: null });
    const updated = await updateProfile(userId, updates);
    if (updated) {
      set({ profile: updated, isSaving: false });
      return true;
    }
    set({ isSaving: false, error: 'Failed to update profile.' });
    return false;
  },

  createAndSetProfile: async (userId, username, displayName) => {
    set({ isSaving: true, error: null });
    const profile = await createProfile(userId, username, displayName);
    if (profile) {
      set({ profile, isSaving: false });
      return true;
    }
    set({ isSaving: false, error: 'Failed to create profile.' });
    return false;
  },
}));
