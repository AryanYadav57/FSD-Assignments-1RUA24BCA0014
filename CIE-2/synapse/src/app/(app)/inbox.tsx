import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { convertToNote, archiveNote, trashNote, createNote } from '@/lib/notes';
import { useRouter } from 'expo-router';
import { syncNoteLinks } from '@/lib/links';

export default function InboxScreen() {
  const { notes } = useNotesStore();
  const router = useRouter();
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const inboxNotes = notes
    .filter((n) => n.status === 'inbox')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const toggleSelection = (id: string) => {
    const newSel = new Set(selectedIds);
    if (newSel.has(id)) newSel.delete(id);
    else newSel.add(id);
    setSelectedIds(newSel);
  };

  const handleConvert = async (id: string) => {
    await convertToNote(id);
  };

  const handleArchive = async (id: string) => {
    await archiveNote(id);
    setSelectedIds(sel => { sel.delete(id); return new Set(sel); });
  };

  const handleTrash = async (id: string) => {
    await trashNote(id);
    setSelectedIds(sel => { sel.delete(id); return new Set(sel); });
  };

  const handleMerge = async () => {
    const selectedNotes = inboxNotes.filter(n => selectedIds.has(n.id));
    if (selectedNotes.length < 2) return;

    let mergedText = '';
    
    selectedNotes.forEach((n, i) => {
      mergedText += `### Idea ${i + 1}\n${n.content_text}\n\n`;
    });

    const newNote = await createNote('Merged Ideas', mergedText);
    if (!newNote) return;

    // Create JSON for Tiptap (very basic)
    const contentJson = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: mergedText }] }
      ]
    };
    
    // Archive originals
    for (const n of selectedNotes) {
      await archiveNote(n.id);
    }
    
    setSelectedIds(new Set());
    router.push(`/(app)/note/${newNote.id}`);
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="p-8 pb-24">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="font-serif text-3xl text-synapse-text mb-1">Inbox</Text>
            <Text className="font-sans text-sm text-synapse-text-muted">
              {inboxNotes.length} {inboxNotes.length === 1 ? 'idea' : 'ideas'} captured
            </Text>
          </View>
          <Pressable
            onPress={() => useNotesStore.getState().openQuickCapture()}
            className="bg-synapse-text px-5 py-2.5 rounded-full"
          >
            <Text className="text-synapse-bg font-sans font-medium text-sm">+ Capture</Text>
          </Pressable>
        </View>

        {/* Empty State */}
        {inboxNotes.length === 0 && (
          <View className="items-center py-20">
            <Text className="font-serif text-2xl text-synapse-text mb-3">All clear.</Text>
            <Text className="font-sans text-base text-synapse-text-muted text-center max-w-xs">
              Your inbox is empty. Capture a new idea with the button above or press Ctrl+Shift+N.
            </Text>
          </View>
        )}

        {/* Idea Cards */}
        {inboxNotes.map((note) => {
          const isSelected = selectedIds.has(note.id);
          return (
            <View
              key={note.id}
              className={`bg-synapse-surface border rounded-2xl p-5 mb-3 ${isSelected ? 'border-synapse-accent shadow-sm' : 'border-synapse-border'}`}
            >
              <View className="flex-row items-start">
                <Pressable onPress={() => toggleSelection(note.id)} className="pt-1 pr-3">
                  <View className={`w-5 h-5 rounded border items-center justify-center ${isSelected ? 'bg-synapse-accent border-synapse-accent' : 'border-synapse-border'}`}>
                    {isSelected && <Text className="text-synapse-bg text-xs">✓</Text>}
                  </View>
                </Pressable>
                
                <View className="w-2.5 h-2.5 bg-synapse-accent rounded-full mt-1.5 mr-4" />

                {/* Content */}
                <View className="flex-1">
                  {note.title ? (
                    <Text className="font-sans text-base font-semibold text-synapse-text mb-1">
                      {note.title}
                    </Text>
                  ) : null}
                  <Text className="font-sans text-sm text-synapse-text leading-relaxed">
                    {note.content_text}
                  </Text>
                  <Text className="font-sans text-xs text-synapse-text-muted mt-2">
                    {formatRelativeDate(note.created_at)}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row mt-4 pt-3 border-t border-synapse-border ml-12">
                <Pressable
                  onPress={() => handleConvert(note.id)}
                  className="bg-synapse-text/5 px-4 py-2 rounded-full mr-2"
                >
                  <Text className="font-sans text-xs font-medium text-synapse-text">
                    Convert to Note
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleArchive(note.id)}
                  className="bg-synapse-text/5 px-4 py-2 rounded-full mr-2"
                >
                  <Text className="font-sans text-xs font-medium text-synapse-text-muted">
                    Archive
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleTrash(note.id)}
                  className="px-4 py-2 rounded-full"
                >
                  <Text className="font-sans text-xs font-medium text-red-500">
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Action Bar for Merge */}
      {selectedIds.size >= 2 && (
        <View className="absolute bottom-8 left-0 right-0 items-center">
          <View className="bg-synapse-text flex-row items-center px-6 py-3 rounded-full shadow-lg">
            <Text className="text-synapse-bg font-sans text-sm mr-4">
              {selectedIds.size} ideas selected
            </Text>
            <Pressable onPress={handleMerge} className="bg-synapse-accent px-4 py-2 rounded-full">
              <Text className="text-synapse-bg font-sans font-medium text-sm">Merge Ideas</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function formatRelativeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  } catch {
    return '';
  }
}
