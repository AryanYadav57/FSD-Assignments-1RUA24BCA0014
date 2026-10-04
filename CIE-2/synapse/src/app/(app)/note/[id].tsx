import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from '@/tw';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotesStore } from '@/store/notesStore';
import { updateNote, trashNote, shareNote, unshareNote } from '@/lib/notes';
import { tiptapJsonToMarkdown, downloadMarkdown } from '@/lib/markdown';
import { Platform, useWindowDimensions } from 'react-native';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { syncNoteLinks } from '@/lib/links';
import { supabase } from '@/lib/supabase';
import { NoteLink } from '@/lib/types';
import { useProfileStore } from '@/store/profileStore';
import { ArrowLeft, Download, Trash2, Share2, Globe, Lock } from 'lucide-react-native';

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes } = useNotesStore();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [backlinks, setBacklinks] = useState<NoteLink[]>([]);

  // Sync title when note changes (switching notes)
  useEffect(() => {
    if (note) setTitle(note.title);
  }, [note?.id]);

  // Load backlinks
  useEffect(() => {
    if (!id) return;
    async function fetchBacklinks() {
      const { data } = await supabase
        .from('note_links')
        .select('*')
        .eq('target_id', id);
      if (data) setBacklinks(data);
    }
    fetchBacklinks();
  }, [id, lastSaved]); // Reload backlinks occasionally, lastSaved is a decent proxy for updates

  // Debounced title save
  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(async () => {
      if (note && title !== note.title) {
        setIsSaving(true);
        await updateNote(id, { title });
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [title, id]);

  // Called by TiptapEditor on every change
  const handleEditorUpdate = async (json: any, text: string) => {
    if (!id) return;
    setIsSaving(true);
    await updateNote(id, { content: json, content_text: text });
    await syncNoteLinks(id, text, notes);
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const { profile } = useProfileStore();
  const [shareToast, setShareToast] = useState('');

  const handleShare = async () => {
    if (!note || !id) return;
    if (!profile?.username) {
      setShareToast('Set a @username in Settings first');
      setTimeout(() => setShareToast(''), 3000);
      return;
    }
    if (note.is_public && note.share_slug) {
      // Already shared — copy link again
      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${profile.username}/${note.share_slug}`;
      if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(url);
      setShareToast('Link copied! ✓');
      setTimeout(() => setShareToast(''), 3000);
      return;
    }
    // Share the note
    const slug = await shareNote(id, title || 'untitled');
    if (slug) {
      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${profile.username}/${slug}`;
      if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(url);
      setShareToast('Link copied! ✓');
      setTimeout(() => setShareToast(''), 3000);
    }
  };

  const handleUnshare = async () => {
    if (!id) return;
    await unshareNote(id);
    setShareToast('Note set to private.');
    setTimeout(() => setShareToast(''), 3000);
  };

  const handleDelete = async () => {
    if (!id) return;
    await trashNote(id);
    router.back();
  };

  const handleExport = () => {
    if (!note || Platform.OS !== 'web') return;
    const md = tiptapJsonToMarkdown(note.content);
    downloadMarkdown(`# ${title}\n\n${md}`, title);
  };

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-sans text-synapse-text-muted">Note not found.</Text>
      </View>
    );
  }

  const BacklinksPanel = () => {
    if (backlinks.length === 0) return null;
    return (
      <View className={`${isDesktop ? 'w-64 border-l pl-4' : 'w-full border-t pt-4 mt-4'} border-synapse-border`}>
        <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest font-semibold mb-3">
          Backlinks
        </Text>
        <ScrollView>
          {backlinks.map(link => {
            const sourceNote = notes.find(n => n.id === link.source_id);
            if (!sourceNote) return null;
            return (
              <Pressable
                key={link.source_id}
                onPress={() => router.push(`/(app)/note/${link.source_id}`)}
                className="bg-synapse-surface border border-synapse-border p-3 rounded-xl mb-2"
              >
                <Text className="font-sans text-sm text-synapse-text font-medium" numberOfLines={1}>
                  {sourceNote.title || 'Untitled'}
                </Text>
                <Text className="font-sans text-xs text-synapse-text-muted mt-1" numberOfLines={2}>
                  {sourceNote.content_text || 'No content'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-synapse-bg">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-synapse-border">
        <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center rounded-xl">
          <ArrowLeft size={18} color="#6B6A65" strokeWidth={1.75} />
        </Pressable>

        <View className="flex-row items-center gap-1">
          {isSaving ? (
            <Text className="font-sans text-xs text-synapse-text-muted mr-2">Saving…</Text>
          ) : lastSaved ? (
            <Text className="font-sans text-xs text-synapse-text-muted mr-2">
              Saved {formatTime(lastSaved)}
            </Text>
          ) : null}

          <View className={`px-3 py-1 rounded-full mr-1 ${
            note.status === 'inbox' ? 'bg-synapse-accent/10' :
            note.status === 'note'  ? 'bg-synapse-gold/10'   :
                                      'bg-synapse-surface'
          }`}>
            <Text className={`font-sans text-xs font-medium ${
              note.status === 'inbox' ? 'text-synapse-accent' :
              note.status === 'note'  ? 'text-synapse-gold'   :
                                        'text-synapse-text-muted'
            }`}>
              {note.status}
            </Text>
          </View>

          {/* Share / Unshare */}
          {Platform.OS === 'web' && (
            <View className="flex-row items-center gap-1">
              {shareToast ? (
                <Text className="font-sans text-xs text-synapse-text-muted mr-1">{shareToast}</Text>
              ) : null}
              {note.is_public ? (
                <View className="flex-row items-center gap-1">
                  <Pressable onPress={handleShare} className="flex-row items-center gap-1 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <Globe size={13} color="#16a34a" strokeWidth={2} />
                    <Text className="font-sans text-xs text-green-600 font-medium">Copy link</Text>
                  </Pressable>
                  <Pressable onPress={handleUnshare} className="w-8 h-8 items-center justify-center rounded-xl">
                    <Lock size={14} color="#6B6A65" strokeWidth={1.75} />
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={handleShare} className="flex-row items-center gap-1 px-3 py-1.5 bg-synapse-surface border border-synapse-border rounded-xl">
                  <Share2 size={13} color="#6B6A65" strokeWidth={1.75} />
                  <Text className="font-sans text-xs text-synapse-text-muted font-medium">Share</Text>
                </Pressable>
              )}
            </View>
          )}

          {Platform.OS === 'web' && (
            <Pressable onPress={handleExport} className="w-9 h-9 items-center justify-center rounded-xl">
              <Download size={16} color="#6B6A65" strokeWidth={1.75} />
            </Pressable>
          )}

          <Pressable onPress={handleDelete} className="w-9 h-9 items-center justify-center rounded-xl">
            <Trash2 size={16} color="#EF4444" strokeWidth={1.75} />
          </Pressable>
        </View>
      </View>

      <View className={`flex-1 ${isDesktop ? 'flex-row' : 'flex-col'} p-8`}>
        {/* Main Editor Area */}
        <View className="flex-1 pr-4">
          {/* Title */}
          <View className="pb-2">
            <TextInput
              className="font-serif text-4xl text-synapse-text leading-tight"
              placeholder="Untitled"
              placeholderTextColor="#6B6A6560"
              value={title}
              onChangeText={setTitle}
              multiline
            />
          </View>

          {/* Rich Editor */}
          <View className="flex-1">
            <TiptapEditor
              initialContent={
                note.content ||
                (note.content_text
                  ? {
                      type: 'doc',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: note.content_text }],
                        },
                      ],
                    }
                  : undefined)
              }
              placeholder="Start writing… type / for commands, or [[ to link"
              onUpdate={handleEditorUpdate}
              dom={{ style: { flex: 1 } }}
            />
          </View>
        </View>

        {/* Backlinks Panel */}
        <BacklinksPanel />
      </View>
    </View>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
