import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { trashNote, deleteNote, updateNote } from '@/lib/notes';

export default function TrashScreen() {
  const { notes } = useNotesStore();
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const trashedNotes = notes
    .filter((n) => n.status === 'trashed')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    await updateNote(id, { status: 'note' });
    setRestoringId(null);
  };

  const handleDeletePermanently = async (id: string) => {
    setDeletingId(id);
    await deleteNote(id);
    setDeletingId(null);
  };

  const handleEmptyTrash = async () => {
    for (const note of trashedNotes) {
      await deleteNote(note.id);
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-8">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-8">
        <View>
          <Text className="font-serif text-3xl text-synapse-text mb-1">Trash</Text>
          <Text className="font-sans text-sm text-synapse-text-muted">
            {trashedNotes.length} {trashedNotes.length === 1 ? 'note' : 'notes'} in trash
          </Text>
        </View>
        {trashedNotes.length > 0 && (
          <Pressable
            onPress={handleEmptyTrash}
            className="border border-red-200 px-4 py-2 rounded-full"
          >
            <Text className="font-sans text-xs text-red-500 font-medium">Empty Trash</Text>
          </Pressable>
        )}
      </View>

      {/* Empty State */}
      {trashedNotes.length === 0 && (
        <View className="items-center py-20">
          <Text className="font-serif text-2xl text-synapse-text mb-3">Trash is empty.</Text>
          <Text className="font-sans text-base text-synapse-text-muted text-center max-w-xs">
            Deleted notes will appear here. You can restore them or delete them permanently.
          </Text>
        </View>
      )}

      {/* Trashed Notes */}
      {trashedNotes.map((note) => (
        <View
          key={note.id}
          className="bg-synapse-surface border border-synapse-border rounded-2xl p-5 mb-3 opacity-70"
        >
          <View className="flex-1 mb-4">
            <Text className="font-sans text-base font-semibold text-synapse-text mb-1" numberOfLines={1}>
              {note.title || 'Untitled'}
            </Text>
            <Text className="font-sans text-sm text-synapse-text-muted" numberOfLines={2}>
              {note.content_text || 'No content'}
            </Text>
            <Text className="font-sans text-xs text-synapse-text-muted/60 mt-2">
              Deleted {formatRelativeDate(note.updated_at)}
            </Text>
          </View>

          <View className="flex-row pt-3 border-t border-synapse-border">
            <Pressable
              onPress={() => handleRestore(note.id)}
              disabled={restoringId === note.id}
              className="bg-synapse-text/5 px-4 py-2 rounded-full mr-2"
            >
              <Text className="font-sans text-xs font-medium text-synapse-text">
                {restoringId === note.id ? 'Restoring...' : '↩ Restore'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleDeletePermanently(note.id)}
              disabled={deletingId === note.id}
              className="px-4 py-2 rounded-full border border-red-100"
            >
              <Text className="font-sans text-xs font-medium text-red-500">
                {deletingId === note.id ? 'Deleting...' : 'Delete Forever'}
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function formatRelativeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  } catch {
    return '';
  }
}
