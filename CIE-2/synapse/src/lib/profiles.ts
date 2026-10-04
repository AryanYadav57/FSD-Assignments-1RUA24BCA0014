import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert any string into a URL-safe slug: lowercase, hyphens, no specials */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || crypto.randomUUID().substring(0, 8);
}

/** Validate username format (matches DB constraint) */
export function isValidUsername(username: string): boolean {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

// ─── Profile CRUD ─────────────────────────────────────────────────────────────

/**
 * Fetch the current user's profile.
 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data as Profile | null;
}

/**
 * Fetch a profile by username (used for public note pages — no auth needed).
 */
export async function fetchProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile by username:', error);
    return null;
  }
  return data as Profile | null;
}

/**
 * Create a new profile for the current user.
 */
export async function createProfile(
  userId: string,
  username: string,
  displayName?: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username: username.toLowerCase().trim(),
      display_name: displayName || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }
  return data as Profile;
}

/**
 * Update the current user's profile.
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'username' | 'display_name'>>
): Promise<Profile | null> {
  const payload: Record<string, string | null> = {};
  if (updates.username !== undefined) {
    payload.username = updates.username.toLowerCase().trim();
  }
  if (updates.display_name !== undefined) {
    payload.display_name = updates.display_name;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data as Profile;
}

/**
 * Check whether a username is available.
 * Returns true if available, false if taken.
 */
export async function checkUsernameAvailable(
  username: string,
  currentUserId?: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle();

  if (error) return false;
  if (!data) return true;
  // It's taken by the current user (updating their own username is fine)
  if (currentUserId && data.id === currentUserId) return true;
  return false;
}
