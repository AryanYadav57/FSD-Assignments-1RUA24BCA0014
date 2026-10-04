import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { useRouter } from 'expo-router';
import { archiveNote, updateNote } from '@/lib/notes';

export default function ArchiveScreen() {
  const { notes } = useNotesStore();
  const router = useRouter();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const archivedNotes = notes
    .filter((n) => n.status === 'archived')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    await updateNote(id, { status: 'note' });
    setRestoringId(null);
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-8">
      <Text className="font-serif text-3xl text-synapse-text mb-2">Archive</Text>
      <Text className="font-sans text-sm text-synapse-text-muted mb-8">
        {archivedNotes.length} archived {archivedNotes.length === 1 ? 'note' : 'notes'}
      </Text>

      {archivedNotes.length === 0 && (
        <View className="items-center py-20">
          <Text className="font-serif text-2xl text-synapse-text mb-3">Nothing archived.</Text>
          <Text className="font-sans text-base text-synapse-text-muted text-center max-w-xs">
            Archive notes you want to keep but don't need in your active workspace.
          </Text>
        </View>
      )}

      {archivedNotes.map((note) => (
        <Pressable
          key={note.id}
          onPress={() => router.push(`/(app)/note/${note.id}`)}
          className="bg-synapse-surface border border-synapse-border rounded-2xl p-5 mb-3"
        >
          <Text className="font-sans text-base font-semibold text-synapse-text mb-1" numberOfLines={1}>
            {note.title || 'Untitled'}
          </Text>
          <Text className="font-sans text-sm text-synapse-text-muted mb-3" numberOfLines={2}>
            {note.content_text || 'No content'}
          </Text>
          <View className="flex-row pt-3 border-t border-synapse-border">
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); handleRestore(note.id); }}
              disabled={restoringId === note.id}
              className="bg-synapse-text/5 px-4 py-2 rounded-full"
            >
              <Text className="font-sans text-xs font-medium text-synapse-text">
                {restoringId === note.id ? 'Restoring...' : '↩ Unarchive'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
