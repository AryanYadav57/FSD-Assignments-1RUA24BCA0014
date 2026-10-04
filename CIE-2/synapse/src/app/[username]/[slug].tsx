import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchPublicNote } from '@/lib/notes';
import { fetchProfileByUsername } from '@/lib/profiles';
import { Note, Profile } from '@/lib/types';
import { useThemeStore } from '@/store/themeStore';
import { Sun, Moon, ArrowLeft, ExternalLink } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

// Render Tiptap JSON as plain formatted text (lightweight, no editor dependency)
function renderTiptapContent(content: any): string {
  if (!content || !content.content) return '';
  const renderNode = (node: any): string => {
    if (node.type === 'text') return node.text || '';
    if (!node.content) return '';
    const children = node.content.map(renderNode).join('');
    switch (node.type) {
      case 'heading': return `\n${children}\n`;
      case 'paragraph': return `${children}\n\n`;
      case 'bulletList':
      case 'orderedList': return `${children}`;
      case 'listItem': return `• ${children}`;
      case 'blockquote': return `  ${children}`;
      case 'codeBlock': return `${children}`;
      default: return children;
    }
  };
  return content.content.map(renderNode).join('').trim();
}

export default function PublicNoteScreen() {
  const { username, slug } = useLocalSearchParams<{ username: string; slug: string }>();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const [note, setNote] = useState<Note | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username || !slug) return;
    async function load() {
      setLoading(true);
      const [fetchedNote, fetchedProfile] = await Promise.all([
        fetchPublicNote(username as string, slug as string),
        fetchProfileByUsername(username as string),
      ]);
      if (!fetchedNote) {
        setNotFound(true);
      } else {
        setNote(fetchedNote);
        setProfile(fetchedProfile);
      }
      setLoading(false);
    }
    load();
  }, [username, slug]);

  const bodyText = note ? renderTiptapContent(note.content) || note.content_text : '';
  const formattedDate = note
    ? new Date(note.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  if (loading) {
    return (
      <View className="flex-1 bg-synapse-bg items-center justify-center">
        <StatusBar style="auto" />
        <View className="flex-row gap-2">
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              className={`rounded-full ${i === 1 ? 'bg-synapse-accent' : i === 2 ? 'bg-synapse-gold' : 'bg-synapse-text'}`}
              style={{ width: 8, height: 8, opacity: 0.3 + i * 0.2 }}
            />
          ))}
        </View>
      </View>
    );
  }

  if (notFound) {
    return (
      <View className="flex-1 bg-synapse-bg items-center justify-center px-8">
        <StatusBar style="auto" />
        <Text className="font-serif text-4xl text-synapse-text mb-3 text-center">Note not found.</Text>
        <Text className="font-sans text-base text-synapse-text-muted text-center mb-8">
          This note may have been made private or the link may be incorrect.
        </Text>
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="bg-synapse-text px-6 py-3 rounded-full"
        >
          <Text className="font-sans font-semibold text-sm text-synapse-bg">Open Synapse</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-synapse-bg">
      <StatusBar style="auto" />

      {/* Top bar */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-synapse-border">
        {/* Logo */}
        <Pressable onPress={() => router.push('/(auth)/login')} className="flex-row items-center gap-2">
          <View className="w-5 h-5 flex-row flex-wrap justify-between content-between">
            <View className="w-2 h-2 bg-synapse-text rounded-full" />
            <View className="w-2 h-2 bg-synapse-accent rounded-full" />
            <View className="w-2 h-2 bg-synapse-gold rounded-full" />
            <View className="w-2 h-2 bg-synapse-text rounded-full" />
          </View>
          <Text className="font-sans font-bold text-sm text-synapse-text">Synapse</Text>
        </Pressable>

        <View className="flex-row items-center gap-3">
          <Pressable onPress={toggleTheme} className="w-8 h-8 items-center justify-center rounded-xl">
            {isDark
              ? <Sun size={16} color="#8C8A84" strokeWidth={1.6} />
              : <Moon size={16} color="#6B6A65" strokeWidth={1.6} />
            }
          </Pressable>
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="bg-synapse-text px-4 py-2 rounded-full"
          >
            <Text className="font-sans font-semibold text-xs text-synapse-bg">Sign up free</Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" contentContainerClassName="max-w-2xl mx-auto w-full px-6 py-14">

        {/* Author */}
        {profile && (
          <View className="flex-row items-center gap-2 mb-8">
            <View className="w-7 h-7 bg-synapse-text rounded-full items-center justify-center">
              <Text className="font-sans font-bold text-xs text-synapse-bg">
                {profile.username[0].toUpperCase()}
              </Text>
            </View>
            <Text className="font-sans text-sm text-synapse-text-muted">
              @{profile.username}
            </Text>
            <Text className="font-sans text-xs text-synapse-text-muted opacity-50">·</Text>
            <Text className="font-sans text-xs text-synapse-text-muted">{formattedDate}</Text>
          </View>
        )}

        {/* Title */}
        <Text className="font-serif text-4xl text-synapse-text leading-tight mb-6">
          {note?.title || 'Untitled'}
        </Text>

        {/* Body */}
        <Text className="font-sans text-base text-synapse-text leading-relaxed" selectable>
          {bodyText || 'This note has no content.'}
        </Text>

        {/* Divider */}
        <View className="border-t border-synapse-border mt-16 pt-8">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-serif text-lg text-synapse-text mb-1">Made with Synapse</Text>
              <Text className="font-sans text-sm text-synapse-text-muted">
                Capture ideas, connect thoughts, share knowledge.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              className="flex-row items-center gap-1.5 bg-synapse-text px-4 py-2.5 rounded-full"
            >
              <Text className="font-sans font-semibold text-xs text-synapse-bg">Try it free</Text>
              <ExternalLink size={11} color={isDark ? '#141210' : '#EBE9E1'} strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
