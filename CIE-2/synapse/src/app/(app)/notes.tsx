import React from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { createNote } from '@/lib/notes';
import { useRouter } from 'expo-router';

export default function NotesScreen() {
  const { notes } = useNotesStore();
  const router = useRouter();

  const allNotes = notes
    .filter((n) => n.status === 'note')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const pinnedNotes = allNotes.filter((n) => n.is_pinned);
  const unpinnedNotes = allNotes.filter((n) => !n.is_pinned);

  const handleCreateNote = async () => {
    const note = await createNote('');
    if (note) {
      router.push(`/(app)/note/${note.id}`);
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="font-serif text-3xl text-synapse-text mb-1">Notes</Text>
          <Text className="font-sans text-sm text-synapse-text-muted">
            {allNotes.length} {allNotes.length === 1 ? 'note' : 'notes'}
          </Text>
        </View>
        <Pressable
          onPress={handleCreateNote}
          className="bg-synapse-text px-5 py-2.5 rounded-full"
        >
          <Text className="text-synapse-bg font-sans font-medium text-sm">+ New Note</Text>
        </Pressable>
      </View>

      {/* Empty State */}
      {allNotes.length === 0 && (
        <View className="items-center py-20">
          <Text className="font-serif text-2xl text-synapse-text mb-3">No notes yet.</Text>
          <Text className="font-sans text-base text-synapse-text-muted text-center max-w-xs">
            Create your first note or convert an idea from your inbox.
          </Text>
        </View>
      )}

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <View className="mb-8">
          <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
            Pinned
          </Text>
          {pinnedNotes.map((note) => (
            <NoteCard key={note.id} note={note} onPress={() => router.push(`/(app)/note/${note.id}`)} />
          ))}
        </View>
      )}

      {/* All Notes */}
      {unpinnedNotes.length > 0 && (
        <View>
          {pinnedNotes.length > 0 && (
            <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
              All Notes
            </Text>
          )}
          {unpinnedNotes.map((note) => (
            <NoteCard key={note.id} note={note} onPress={() => router.push(`/(app)/note/${note.id}`)} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function NoteCard({ note, onPress }: { note: any; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-synapse-surface border border-synapse-border rounded-2xl p-5 mb-3"
    >
      <View className="flex-row items-center mb-2">
        <View className="w-2 h-2 bg-synapse-gold rounded-full mr-3" />
        <Text className="font-sans text-base font-semibold text-synapse-text flex-1" numberOfLines={1}>
          {note.title || 'Untitled'}
        </Text>
        {note.is_pinned && (
          <Text className="font-sans text-xs text-synapse-gold ml-2">★</Text>
        )}
      </View>
      {note.content_text && (
        <Text className="font-sans text-sm text-synapse-text-muted ml-5" numberOfLines={2}>
          {note.content_text}
        </Text>
      )}
      <Text className="font-sans text-xs text-synapse-text-muted/50 ml-5 mt-2">
        {formatDate(note.updated_at)}
      </Text>
    </Pressable>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}
