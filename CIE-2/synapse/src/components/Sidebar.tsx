import React from 'react';
import { View, Text, Pressable, ScrollView } from '@/tw';
import { useRouter, usePathname } from 'expo-router';
import { useNotesStore } from '@/store/notesStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useThemeStore } from '@/store/themeStore';
import {
  Home,
  Inbox,
  FileText,
  GitFork,
  Archive,
  Trash2,
  Zap,
  Search,
  Sun,
  Moon,
  Settings,
  LogOut,
} from 'lucide-react-native';

const NAV_ITEMS = [
  { label: 'Home',    Icon: Home,     path: '/(app)' },
  { label: 'Inbox',   Icon: Inbox,    path: '/(app)/inbox' },
  { label: 'Notes',   Icon: FileText, path: '/(app)/notes' },
  { label: 'Graph',   Icon: GitFork,  path: '/(app)/graph' },
  { label: 'Archive', Icon: Archive,  path: '/(app)/archive' },
  { label: 'Trash',   Icon: Trash2,   path: '/(app)/trash' },
];

// Neutral icon color tokens (not themeable via className, so we use string values)
const ICON_ACTIVE   = '#1C1C1C';
const ICON_MUTED    = '#6B6A65';
const ICON_ON_DARK  = '#F0EDE6';
const ICON_MUTED_DK = '#8C8A84';

export function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { openQuickCapture, openCommandPalette, notes } = useNotesStore();
  const { user }   = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const isDark     = theme === 'dark';
  const iconActive = isDark ? ICON_ON_DARK  : ICON_ACTIVE;
  const iconMuted  = isDark ? ICON_MUTED_DK : ICON_MUTED;

  const inboxCount = notes.filter((n) => n.status === 'inbox').length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    useAuthStore.getState().signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View className="w-64 bg-synapse-bg border-r border-synapse-border h-full">
      <ScrollView className="flex-1" contentContainerClassName="pb-4">

        {/* Logo */}
        <View className="px-5 pt-6 pb-5">
          <Pressable onPress={() => router.push('/(app)/welcome')} className="flex-row items-center gap-2.5">
            {/* Four-dot logo mark */}
            <View className="w-5 h-5 flex-row flex-wrap justify-between content-between">
              <View className="w-2 h-2 bg-synapse-text rounded-full" />
              <View className="w-2 h-2 bg-synapse-accent rounded-full" />
              <View className="w-2 h-2 bg-synapse-gold rounded-full" />
              <View className="w-2 h-2 bg-synapse-text rounded-full" />
            </View>
            <Text className="font-sans font-bold text-lg text-synapse-text tracking-tight">
              Synapse
            </Text>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View className="px-3 mb-5">
          <Pressable
            onPress={openQuickCapture}
            className="flex-row items-center gap-2.5 px-3 py-2.5 bg-synapse-text rounded-xl mb-2"
          >
            <Zap size={14} color="#EBE9E1" strokeWidth={2} />
            <Text className="text-synapse-bg font-sans font-medium text-sm flex-1">
              Quick Capture
            </Text>
            <Text className="text-synapse-bg/40 font-sans text-xs">⌘⇧N</Text>
          </Pressable>

          <Pressable
            onPress={openCommandPalette}
            className="flex-row items-center gap-2.5 px-3 py-2.5 border border-synapse-border rounded-xl"
          >
            <Search size={13} color={iconMuted} strokeWidth={1.75} />
            <Text className="text-synapse-text-muted font-sans text-sm flex-1">
              Search…
            </Text>
            <Text className="text-synapse-text-muted font-sans text-xs">⌘K</Text>
          </Pressable>
        </View>

        {/* Navigation */}
        <View className="px-3 mb-6">
          <Text className="px-3 mb-2 font-sans text-xs text-synapse-text-muted uppercase tracking-widest font-semibold">
            Navigate
          </Text>
          {NAV_ITEMS.map(({ label, Icon, path }) => {
            const isActive = pathname === path || pathname.startsWith(path + '/');
            const color    = isActive ? iconActive : iconMuted;
            return (
              <Pressable
                key={path}
                onPress={() => router.push(path as any)}
                className={`flex-row items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 ${
                  isActive ? 'bg-synapse-text/5' : ''
                }`}
              >
                <Icon size={16} color={color} strokeWidth={isActive ? 2 : 1.6} />
                <Text
                  className={`font-sans text-sm flex-1 ${
                    isActive ? 'text-synapse-text font-semibold' : 'text-synapse-text-muted'
                  }`}
                >
                  {label}
                </Text>
                {label === 'Inbox' && inboxCount > 0 && (
                  <View className="bg-synapse-accent px-2 py-0.5 rounded-full">
                    <Text className="text-synapse-bg font-sans text-xs font-bold">
                      {inboxCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Recent Notes */}
        <View className="px-3 mb-6">
          <Text className="px-3 mb-2 font-sans text-xs text-synapse-text-muted uppercase tracking-widest font-semibold">
            Recent
          </Text>
          {notes
            .filter((n) => n.status === 'note')
            .slice(0, 5)
            .map((note) => (
              <Pressable
                key={note.id}
                onPress={() => router.push(`/(app)/note/${note.id}`)}
                className="px-3 py-2 rounded-xl"
              >
                <Text className="font-sans text-sm text-synapse-text" numberOfLines={1}>
                  {note.title || 'Untitled'}
                </Text>
              </Pressable>
            ))}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="px-3 pb-4 border-t border-synapse-border pt-3">
        {/* Theme Toggle */}
        <Pressable
          onPress={toggleTheme}
          className="flex-row items-center gap-3 px-3 py-2.5 rounded-xl mb-1 border border-synapse-border"
        >
          {isDark
            ? <Sun  size={15} color={iconMuted} strokeWidth={1.6} />
            : <Moon size={15} color={iconMuted} strokeWidth={1.6} />
          }
          <Text className="font-sans text-sm text-synapse-text-muted flex-1">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Text>
          {/* Toggle pill */}
          <View className={`w-10 h-5 rounded-full relative ${isDark ? 'bg-synapse-accent' : 'bg-synapse-border'}`}>
            <View className={`absolute top-0.5 w-4 h-4 rounded-full bg-synapse-bg shadow-sm ${isDark ? 'right-0.5' : 'left-0.5'}`} />
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(app)/settings')}
          className="flex-row items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
        >
          <Settings size={15} color={iconMuted} strokeWidth={1.6} />
          <Text className="font-sans text-sm text-synapse-text-muted">Settings</Text>
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center gap-3 px-3 py-2.5 rounded-xl"
        >
          <LogOut size={15} color={iconMuted} strokeWidth={1.6} />
          <Text className="font-sans text-sm text-synapse-text-muted">Sign Out</Text>
        </Pressable>

        {/* User email */}
        <View className="mt-3 px-3 py-2 bg-synapse-surface rounded-xl border border-synapse-border">
          <Text className="font-sans text-xs text-synapse-text-muted" numberOfLines={1}>
            {user?.email || ''}
          </Text>
        </View>
      </View>
    </View>
  );
}
