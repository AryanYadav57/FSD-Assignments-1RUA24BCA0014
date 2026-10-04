export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  parent_id: string | null;
  title: string;
  content: any | null; // Tiptap JSON
  content_text: string;
  status: 'inbox' | 'note' | 'archived' | 'trashed';
  is_pinned: boolean;
  folder_id: string | null;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
}

export interface NoteTag {
  note_id: string;
  tag_id: string;
}

export interface NoteLink {
  source_id: string;
  target_id: string;
  kind: 'wikilink' | 'manual' | 'merged_from';
  created_at: string;
}
