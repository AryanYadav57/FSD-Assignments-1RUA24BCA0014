import React from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { notes, openQuickCapture, openCommandPalette } = useNotesStore();
  const router = useRouter();

  const inboxNotes = notes.filter((n) => n.status === 'inbox');
  const recentNotes = notes.filter((n) => n.status === 'note').slice(0, 6);
  const totalNotes = notes.filter((n) => n.status !== 'trashed').length;
  const pinnedNotes = notes.filter((n) => n.is_pinned && n.status === 'note');

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-8 pb-16">
      {/* Greeting */}
      <View className="mb-10">
        <Text className="font-serif text-5xl text-synapse-text mb-3 leading-tight">
          Good {getTimeOfDay()}.
        </Text>
        <Text className="font-sans text-base text-synapse-text-muted">
          {totalNotes === 0
            ? 'Start capturing your ideas below.'
            : `${totalNotes} note${totalNotes !== 1 ? 's' : ''} in your knowledge base${inboxNotes.length > 0 ? `, ${inboxNotes.length} idea${inboxNotes.length !== 1 ? 's' : ''} in inbox` : ''}.`}
        </Text>
      </View>

      {/* Quick Actions */}
      <View className="flex-row flex-wrap mb-10 gap-3">
        <Pressable
          onPress={openQuickCapture}
          className="bg-synapse-text h-11 px-6 rounded-full items-center justify-center"
        >
          <Text className="text-synapse-bg font-sans font-medium text-sm">+ Capture Idea</Text>
        </Pressable>
        <Pressable
          onPress={openCommandPalette}
          className="border border-synapse-border h-11 px-6 rounded-full items-center justify-center"
        >
          <Text className="text-synapse-text font-sans font-medium text-sm">⌘K Search</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(app)/inbox')}
          className="border border-synapse-border h-11 px-6 rounded-full items-center justify-center"
        >
          <Text className="text-synapse-text font-sans font-medium text-sm">
            Inbox {inboxNotes.length > 0 ? `(${inboxNotes.length})` : ''}
          </Text>
        </Pressable>
      </View>

      {/* Stats Cards */}
      <View className="flex-row mb-10 gap-3">
        <Pressable
          onPress={() => router.push('/(app)/inbox')}
          className="flex-1 bg-synapse-accent/10 border border-synapse-accent/20 rounded-2xl p-5 h-32 justify-between"
        >
          <View>
            <Text className="font-sans text-xs text-synapse-accent uppercase tracking-widest mb-1 font-semibold">
              Inbox
            </Text>
            <Text className="font-serif text-4xl text-synapse-accent">{inboxNotes.length}</Text>
          </View>
          <Text className="font-sans text-xs text-synapse-accent/70">ideas waiting</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(app)/notes')}
          className="flex-1 bg-synapse-gold/10 border border-synapse-gold/20 rounded-2xl p-5 h-32 justify-between"
        >
          <View>
            <Text className="font-sans text-xs text-synapse-gold uppercase tracking-widest mb-1 font-semibold">
              Notes
            </Text>
            <Text className="font-serif text-4xl text-synapse-gold">
              {notes.filter((n) => n.status === 'note').length}
            </Text>
          </View>
          <Text className="font-sans text-xs text-synapse-gold/70">written</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(app)/graph')}
          className="flex-1 bg-synapse-text/5 border border-synapse-border rounded-2xl p-5 h-32 justify-between"
        >
          <View>
            <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-1 font-semibold">
              Total
            </Text>
            <Text className="font-serif text-4xl text-synapse-text">{totalNotes}</Text>
          </View>
          <Text className="font-sans text-xs text-synapse-text-muted">captured</Text>
        </Pressable>
      </View>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <View className="mb-10">
          <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
            Pinned
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} router={router} accent />
            ))}
          </View>
        </View>
      )}

      {/* Recent Notes */}
      {recentNotes.length > 0 && (
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest font-semibold">
              Recent Notes
            </Text>
            <Pressable onPress={() => router.push('/(app)/notes')}>
              <Text className="font-sans text-xs text-synapse-accent">View all →</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} router={router} />
            ))}
          </View>
        </View>
      )}

      {/* Empty State */}
      {totalNotes === 0 && (
        <View className="items-center py-16">
          <View className="w-16 h-16 rounded-full bg-synapse-accent/10 items-center justify-center mb-4">
            <Text className="text-2xl">✦</Text>
          </View>
          <Text className="font-serif text-2xl text-synapse-text mb-2">Your canvas is blank.</Text>
          <Text className="font-sans text-sm text-synapse-text-muted text-center max-w-xs">
            Press <Text className="font-semibold">Capture Idea</Text> or Ctrl+Shift+N to drop your first thought.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function NoteCard({ note, router, accent = false }: { note: any; router: any; accent?: boolean }) {
  return (
    <Pressable
      onPress={() => router.push(`/(app)/note/${note.id}`)}
      style={{ flexBasis: '31%', minWidth: 200, marginBottom: 12 }}
    >
      <View className={`rounded-2xl p-5 h-40 border justify-between ${
        accent
          ? 'bg-synapse-gold/10 border-synapse-gold/20'
          : 'bg-synapse-surface border-synapse-border'
      }`}>
        <View>
          {note.is_pinned && (
            <Text className="font-sans text-xs text-synapse-gold mb-1">★ Pinned</Text>
          )}
          <Text className="font-sans text-sm font-semibold text-synapse-text mb-1.5" numberOfLines={1}>
            {note.title || 'Untitled'}
          </Text>
          <Text className="font-sans text-xs text-synapse-text-muted leading-relaxed" numberOfLines={3}>
            {note.content_text || 'Empty note'}
          </Text>
        </View>
        <Text className="font-sans text-xs text-synapse-text-muted/50">
          {formatDate(note.updated_at)}
        </Text>
      </View>
    </Pressable>
  );
}


function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  } catch {
    return '';
  }
}
