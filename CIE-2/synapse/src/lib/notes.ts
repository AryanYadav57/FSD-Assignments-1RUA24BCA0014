import { supabase } from '@/lib/supabase';
import { Note } from '@/lib/types';
import { useNotesStore } from '@/store/notesStore';
import { buildSearchIndex, addToSearchIndex, removeFromSearchIndex } from '@/lib/search';

/**
 * Fetch all notes for the current user from Supabase.
 */
export async function fetchNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }

  const notes = data as Note[];
  useNotesStore.getState().setNotes(notes);
  buildSearchIndex(notes);
  return notes;
}

/**
 * Fetch only inbox ideas (status = 'inbox').
 */
export async function fetchInboxNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('status', 'inbox')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inbox:', error);
    return [];
  }

  return data as Note[];
}

/**
 * Create a new quick capture idea (status = 'inbox').
 * Uses optimistic update: the note is immediately added to the store.
 */
export async function quickCapture(text: string, title?: string): Promise<Note | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const optimisticNote: Note = {
    id: crypto.randomUUID(),
    user_id: user.id,
    parent_id: null,
    title: title || '',
    content: null,
    content_text: text,
    status: 'inbox',
    is_pinned: false,
    folder_id: null,
    is_public: false,
    share_slug: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Optimistic update
  useNotesStore.getState().addNote(optimisticNote);
  addToSearchIndex(optimisticNote);

  const { data, error } = await supabase
    .from('notes')
    .insert({
      id: optimisticNote.id,
      user_id: user.id,
      title: title || '',
      content_text: text,
      status: 'inbox',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating quick capture:', error);
    // Rollback optimistic update
    useNotesStore.getState().removeNote(optimisticNote.id);
    removeFromSearchIndex(optimisticNote.id);
    return null;
  }

  // Replace the optimistic note with the real one
  useNotesStore.getState().removeNote(optimisticNote.id);
  removeFromSearchIndex(optimisticNote.id);
  useNotesStore.getState().addNote(data as Note);
  addToSearchIndex(data as Note);

  return data as Note;
}

/**
 * Create a full note (status = 'note').
 */
export async function createNote(title: string, content_text: string = ''): Promise<Note | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      title,
      content_text,
      status: 'note',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating note:', error);
    return null;
  }

  const note = data as Note;
  useNotesStore.getState().addNote(note);
  addToSearchIndex(note);
  return note;
}

/**
 * Update a note.
 */
export async function updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
  // Optimistic update
  useNotesStore.getState().updateNote(id, updates);

  const { data, error } = await supabase
    .from('notes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating note:', error);
    return null;
  }

  const note = data as Note;
  useNotesStore.getState().updateNote(id, note);
  addToSearchIndex(note);
  return note;
}

/**
 * Move a note to trash.
 */
export async function trashNote(id: string): Promise<boolean> {
  return (await updateNote(id, { status: 'trashed' })) !== null;
}

/**
 * Archive a note.
 */
export async function archiveNote(id: string): Promise<boolean> {
  return (await updateNote(id, { status: 'archived' })) !== null;
}

/**
 * Convert an inbox idea to a full note.
 */
export async function convertToNote(id: string): Promise<boolean> {
  return (await updateNote(id, { status: 'note' })) !== null;
}

/**
 * Permanently delete a note.
 */
export async function deleteNote(id: string): Promise<boolean> {
  useNotesStore.getState().removeNote(id);
  removeFromSearchIndex(id);

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note:', error);
    return false;
  }

  return true;
}

// ─── Sharing ──────────────────────────────────────────────────────────────────

/** Convert note title to a URL-safe slug with collision-avoidance suffix. */
function makeSlug(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
  const suffix = id.substring(0, 6);
  return base ? `${base}-${suffix}` : suffix;
}

/**
 * Make a note public and generate a share slug.
 * Returns the slug on success, null on failure.
 */
export async function shareNote(id: string, title: string): Promise<string | null> {
  const slug = makeSlug(title, id);
  const result = await updateNote(id, { is_public: true, share_slug: slug });
  return result ? slug : null;
}

/**
 * Revoke public access to a note.
 */
export async function unshareNote(id: string): Promise<boolean> {
  return (await updateNote(id, { is_public: false })) !== null;
}

/**
 * Fetch a single public note by username + slug.
 * Does NOT require authentication (Supabase RLS allows public reads).
 */
export async function fetchPublicNote(
  username: string,
  slug: string
): Promise<Note | null> {
  // First look up the profile by username to get user_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (!profile) return null;

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', profile.id)
    .eq('share_slug', slug)
    .eq('is_public', true)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching public note:', error);
    return null;
  }
  return data as Note;
}

