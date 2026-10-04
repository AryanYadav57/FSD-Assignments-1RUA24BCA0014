import { supabase } from './supabase';
import { Note } from './types';

// Regex to match [[wikilinks]]
export const WIKILINK_REGEX = /\[\[([^\]]+)\]\]/g;

/**
 * Extracts titles from text enclosed in [[...]]
 */
export function extractWikilinks(text: string): string[] {
  const matches = [...text.matchAll(WIKILINK_REGEX)];
  return matches.map((match) => match[1].trim()).filter(Boolean);
}

/**
 * Syncs the links for a specific note in the database.
 * If a linked note doesn't exist, it creates a new stub note.
 */
export async function syncNoteLinks(sourceNoteId: string, text: string, allNotes: Note[]) {
  const linkedTitles = extractWikilinks(text);
  
  if (linkedTitles.length === 0) {
    // Clear all existing wikilinks for this note
    await supabase
      .from('note_links')
      .delete()
      .eq('source_id', sourceNoteId)
      .eq('kind', 'wikilink');
    return;
  }

  const newLinks = [];
  
  // Find or create target notes
  for (const title of linkedTitles) {
    // Exact match case-insensitive
    let targetNote = allNotes.find((n) => n.title.toLowerCase() === title.toLowerCase());
    
    if (!targetNote) {
      // Create stub note
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title,
          content_text: '',
          status: 'note'
        })
        .select()
        .single();
        
      if (!error && data) {
        targetNote = data;
      }
    }

    if (targetNote && targetNote.id !== sourceNoteId) {
      newLinks.push({
        source_id: sourceNoteId,
        target_id: targetNote.id,
        kind: 'wikilink'
      });
    }
  }

  // Sync to database
  if (newLinks.length > 0) {
    // We can just upsert or delete all and insert
    await supabase
      .from('note_links')
      .delete()
      .eq('source_id', sourceNoteId)
      .eq('kind', 'wikilink');
      
    await supabase
      .from('note_links')
      .insert(newLinks);
  }
}
