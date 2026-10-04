import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from '@/tw';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { syncNoteLinks } from '@/lib/links';
import { useNotesStore } from '@/store/notesStore';
import { exportAllNotesAsMarkdown } from '@/lib/markdown';
import { checkUsernameAvailable, isValidUsername } from '@/lib/profiles';
import { Platform } from 'react-native';
import { AtSign, Check, X, Loader } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user } = useAuthStore();
  const { profile, isSaving, saveProfile, createAndSetProfile } = useProfileStore();
  const { notes } = useNotesStore();
  const router = useRouter();
  const [isPopulating, setIsPopulating] = useState(false);

  // Username editing state
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Pre-fill input with current username when opening editor
  useEffect(() => {
    if (editingUsername) {
      setUsernameInput(profile?.username ?? '');
      setUsernameAvailable(null);
    }
  }, [editingUsername]);

  // Debounced availability check
  useEffect(() => {
    if (!editingUsername) return;
    if (!usernameInput || !isValidUsername(usernameInput)) {
      setUsernameAvailable(null);
      return;
    }
    // If unchanged, it's "available" (it's theirs)
    if (usernameInput === profile?.username) {
      setUsernameAvailable(true);
      return;
    }
    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      const available = await checkUsernameAvailable(usernameInput, user?.id);
      setUsernameAvailable(available);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [usernameInput, editingUsername]);

  const handleSaveUsername = async () => {
    if (!user?.id || !usernameInput || !usernameAvailable) return;
    if (profile) {
      await saveProfile(user.id, { username: usernameInput });
    } else {
      await createAndSetProfile(user.id, usernameInput);
    }
    setEditingUsername(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    useAuthStore.getState().signOut();
    router.replace('/(auth)/login');
  };

  const handlePopulateData = async () => {
    setIsPopulating(true);
    try {
      const sampleNotes = [
        {
          title: 'Personal Knowledge Management (PKM)',
          content_text: 'PKM is a process of collecting information that a person uses to gather, classify, store, search, retrieve and share knowledge in their daily activities. See also [[Zettelkasten]] and [[Second Brain]].',
          status: 'note'
        },
        {
          title: 'Zettelkasten',
          content_text: 'A Zettelkasten is a personal tool for thinking and writing. It emphasizes atomic notes and heavy linking. It is a core part of [[Personal Knowledge Management (PKM)]].',
          status: 'note'
        },
        {
          title: 'Second Brain',
          content_text: 'Building a Second Brain is a methodology for saving and systematically reminding us of the ideas, inspirations, insights, and connections we\'ve gained through our experience. It expands on [[Personal Knowledge Management (PKM)]].',
          status: 'note'
        },
        {
          title: 'Startup Ideas',
          content_text: 'A collection of potential projects. [[Idea: AI Note Taker]] is one of them. We should use principles from [[Second Brain]].',
          status: 'inbox'
        },
        {
          title: 'Idea: AI Note Taker',
          content_text: 'An app that automatically organizes thoughts. Connects deeply with [[Zettelkasten]].',
          status: 'inbox'
        }
      ];

      const insertedNotes = [];
      for (const note of sampleNotes) {
        const contentJson = {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: note.content_text }] }]
        };
        const { data } = await supabase
          .from('notes')
          .insert({ title: note.title, content_text: note.content_text, content: contentJson, status: note.status, user_id: user?.id })
          .select().single();
        if (data) insertedNotes.push(data);
      }

      const { data: allNotes } = await supabase.from('notes').select('*');
      if (allNotes) {
        for (const note of insertedNotes) await syncNoteLinks(note.id, note.content_text, allNotes);
      }
      const { data: updatedNotes } = await supabase.from('notes').select('*').order('updated_at', { ascending: false });
      if (updatedNotes) useNotesStore.getState().setNotes(updatedNotes);
      alert('Sample data populated!');
    } catch (e: any) {
      alert('Failed: ' + e.message);
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-8 pb-24">
      <Text className="font-serif text-3xl text-synapse-text mb-8">Settings</Text>

      {/* ── Profile ─────────────────────────────────────────────── */}
      <View className="mb-8">
        <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
          Profile
        </Text>
        <View className="bg-synapse-surface border border-synapse-border rounded-2xl overflow-hidden">
          {/* Email */}
          <View className="px-5 py-4 border-b border-synapse-border">
            <Text className="font-sans text-xs text-synapse-text-muted mb-1">Email</Text>
            <Text className="font-sans text-sm text-synapse-text font-medium">{user?.email || 'Unknown'}</Text>
          </View>

          {/* Username */}
          <View className="px-5 py-4">
            <Text className="font-sans text-xs text-synapse-text-muted mb-1">Username</Text>
            {!editingUsername ? (
              <View className="flex-row items-center justify-between">
                <Text className="font-sans text-sm text-synapse-text font-medium">
                  {profile?.username ? `@${profile.username}` : '—  not set yet'}
                </Text>
                <Pressable
                  onPress={() => setEditingUsername(true)}
                  className="bg-synapse-bg border border-synapse-border rounded-xl px-3 py-1.5"
                >
                  <Text className="font-sans text-xs text-synapse-text font-medium">
                    {profile ? 'Change' : 'Set username'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <View className="flex-row items-center gap-2 mt-1">
                  <View className="flex-row items-center flex-1 bg-synapse-bg border border-synapse-border rounded-xl px-3 py-2.5 gap-1.5">
                    <AtSign size={14} color="#6B6A65" strokeWidth={1.75} />
                    <TextInput
                      className="flex-1 font-sans text-sm text-synapse-text"
                      placeholder="yourname"
                      placeholderTextColor="#8C8A84"
                      value={usernameInput}
                      onChangeText={(t) => setUsernameInput(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                    />
                    {usernameInput.length >= 3 && (
                      checkingUsername
                        ? <View className="w-3.5 h-3.5 rounded-full border-2 border-synapse-text-muted" />
                        : usernameAvailable
                          ? <Check size={14} color="#16a34a" strokeWidth={2.5} />
                          : <X size={14} color="#dc2626" strokeWidth={2.5} />
                    )}
                  </View>
                  <Pressable
                    onPress={handleSaveUsername}
                    disabled={!usernameAvailable || isSaving}
                    className={`px-4 py-2.5 rounded-xl ${usernameAvailable && !isSaving ? 'bg-synapse-text' : 'bg-synapse-border'}`}
                  >
                    <Text className={`font-sans font-semibold text-sm ${usernameAvailable && !isSaving ? 'text-synapse-bg' : 'text-synapse-text-muted'}`}>
                      {isSaving ? '…' : 'Save'}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setEditingUsername(false)} className="px-3 py-2.5">
                    <Text className="font-sans text-sm text-synapse-text-muted">Cancel</Text>
                  </Pressable>
                </View>
                {usernameInput.length > 0 && !isValidUsername(usernameInput) && (
                  <Text className="font-sans text-xs text-synapse-text-muted mt-2">
                    3–20 chars · lowercase letters, numbers, underscores only.
                  </Text>
                )}
                {usernameInput.length >= 3 && isValidUsername(usernameInput) && usernameAvailable === false && (
                  <Text className="font-sans text-xs text-red-500 mt-2">
                    @{usernameInput} is already taken.
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Share URL preview */}
        {profile?.username && (
          <View className="mt-3 px-4 py-3 bg-synapse-surface border border-synapse-border rounded-xl">
            <Text className="font-sans text-xs text-synapse-text-muted mb-1">Your share link base</Text>
            <Text className="font-sans text-xs text-synapse-accent font-medium" selectable>
              {typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.netlify.app'}/{profile.username}/note-title
            </Text>
          </View>
        )}
      </View>

      {/* ── Account ─────────────────────────────────────────────── */}
      <View className="mb-8">
        <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
          Account
        </Text>
        <View className="bg-synapse-surface border border-synapse-border rounded-2xl overflow-hidden">
          <Pressable onPress={handleSignOut} className="px-5 py-4">
            <Text className="font-sans text-sm text-red-500 font-medium">Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Demo Tools ──────────────────────────────────────────── */}
      <View className="mb-8">
        <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
          Demo Tools
        </Text>
        <View className="bg-synapse-surface border border-synapse-border rounded-2xl overflow-hidden">
          <Pressable onPress={handlePopulateData} disabled={isPopulating} className={`px-5 py-4 ${isPopulating ? 'opacity-50' : ''}`}>
            <Text className="font-sans text-sm text-synapse-accent font-medium">
              {isPopulating ? 'Populating...' : 'Populate Sample Data'}
            </Text>
            <Text className="font-sans text-xs text-synapse-text-muted mt-1">
              Creates 5 interconnected sample ideas to test the graph and links.
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ── Data & Export ───────────────────────────────────────── */}
      <View className="mb-8">
        <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
          Data
        </Text>
        <View className="bg-synapse-surface border border-synapse-border rounded-2xl overflow-hidden">
          {Platform.OS === 'web' && (
            <Pressable onPress={() => exportAllNotesAsMarkdown(notes)} className="px-5 py-4 border-b border-synapse-border">
              <Text className="font-sans text-sm text-synapse-text font-medium">↓ Export All Notes</Text>
              <Text className="font-sans text-xs text-synapse-text-muted mt-1">Downloads all your notes as a combined Markdown file.</Text>
            </Pressable>
          )}
          <Pressable onPress={() => router.push('/(app)/archive')} className="px-5 py-4 border-b border-synapse-border flex-row justify-between items-center">
            <Text className="font-sans text-sm text-synapse-text font-medium">Archive</Text>
            <Text className="text-synapse-text-muted">→</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(app)/trash')} className="px-5 py-4 flex-row justify-between items-center">
            <Text className="font-sans text-sm text-red-500 font-medium">Trash</Text>
            <Text className="text-red-400">→</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Keyboard Shortcuts ──────────────────────────────────── */}
      <View className="mb-8">
        <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
          Keyboard Shortcuts
        </Text>
        <View className="bg-synapse-surface border border-synapse-border rounded-2xl overflow-hidden">
          {[
            { key: '⌘ Shift N', action: 'Quick Capture' },
            { key: '⌘ K', action: 'Search (Command Palette)' },
          ].map((shortcut, index) => (
            <View
              key={shortcut.key}
              className={`flex-row justify-between items-center px-5 py-3.5 ${index > 0 ? 'border-t border-synapse-border' : ''}`}
            >
              <Text className="font-sans text-sm text-synapse-text">{shortcut.action}</Text>
              <View className="bg-black/5 px-3 py-1.5 rounded-lg">
                <Text className="font-sans text-xs text-synapse-text-muted font-medium">{shortcut.key}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── About ───────────────────────────────────────────────── */}
      <View>
        <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest mb-4 font-semibold">
          About
        </Text>
        <View className="bg-synapse-surface border border-synapse-border rounded-2xl px-5 py-4">
          <Text className="font-sans text-sm text-synapse-text font-semibold mb-1">Synapse</Text>
          <Text className="font-sans text-xs text-synapse-text-muted">
            Version 1.0.0 · Capture every idea in one tap, find it in one keystroke, and connect ideas into something better.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
