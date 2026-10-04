import MiniSearch from 'minisearch';
import { Note } from '@/lib/types';

let searchIndex: MiniSearch<Note> | null = null;

/**
 * Initialize or rebuild the MiniSearch index from a list of notes.
 */
export function buildSearchIndex(notes: Note[]): void {
  searchIndex = new MiniSearch<Note>({
    fields: ['title', 'content_text'], // fields to index for search
    storeFields: ['id', 'title', 'content_text', 'status', 'created_at', 'updated_at'],
    searchOptions: {
      boost: { title: 3 }, // title matches rank higher
      fuzzy: 0.2,
      prefix: true,
    },
  });

  searchIndex.addAll(notes);
}

/**
 * Add a single note to the search index.
 */
export function addToSearchIndex(note: Note): void {
  if (searchIndex) {
    // Remove first if exists (to avoid duplicates on update)
    try {
      searchIndex.discard(note.id);
    } catch {
      // note wasn't in index, that's fine
    }
    searchIndex.add(note);
  }
}

/**
 * Remove a note from the search index.
 */
export function removeFromSearchIndex(noteId: string): void {
  if (searchIndex) {
    try {
      searchIndex.discard(noteId);
    } catch {
      // note wasn't in index
    }
  }
}

/**
 * Search notes by query string.
 * Returns results ranked by relevance (title matches boosted 3x).
 */
export function searchNotes(query: string): Array<{
  id: string;
  title: string;
  content_text: string;
  status: string;
  score: number;
  match: Record<string, string[]>;
}> {
  if (!searchIndex || !query.trim()) {
    return [];
  }

  const results = searchIndex.search(query, {
    boost: { title: 3 },
    fuzzy: 0.2,
    prefix: true,
  });

  return results.map((r) => ({
    id: r.id as string,
    title: r.title as string,
    content_text: r.content_text as string,
    status: r.status as string,
    score: r.score,
    match: r.match,
  }));
}

/**
 * Get autocomplete suggestions for a partial query.
 */
export function autoSuggest(query: string): Array<{ suggestion: string; score: number }> {
  if (!searchIndex || !query.trim()) {
    return [];
  }

  return searchIndex.autoSuggest(query, {
    boost: { title: 3 },
    fuzzy: 0.2,
  });
}
