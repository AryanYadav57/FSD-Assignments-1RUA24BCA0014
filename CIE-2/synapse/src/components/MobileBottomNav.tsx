import React from 'react';
import { View, Text, Pressable } from '@/tw';
import { useRouter, usePathname } from 'expo-router';
import { useNotesStore } from '@/store/notesStore';
import { useThemeStore } from '@/store/themeStore';
import { Home, Inbox, FileText, GitFork } from 'lucide-react-native';
import { Platform } from 'react-native';

const MOBILE_NAV = [
  { label: 'Home',  Icon: Home,     path: '/(app)' },
  { label: 'Inbox', Icon: Inbox,    path: '/(app)/inbox' },
  { label: 'Notes', Icon: FileText, path: '/(app)/notes' },
  { label: 'Graph', Icon: GitFork,  path: '/(app)/graph' },
];

export function MobileBottomNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const { notes } = useNotesStore();
  const { theme } = useThemeStore();

  const isDark    = theme === 'dark';
  const iconActive = isDark ? '#F0EDE6' : '#1C1C1C';
  const iconMuted  = isDark ? '#8C8A84' : '#6B6A65';

  const inboxCount = notes.filter((n) => n.status === 'inbox').length;

  // Extra bottom padding to prevent browser chrome from overlapping nav items.
  // On mobile web the address bar eats ~50-60px. We use env(safe-area-inset-bottom)
  // via inline style when on web.
  const bottomPad = Platform.OS === 'web' ? 8 : 0;

  return (
    <View
      className="border-t border-synapse-border bg-synapse-bg flex-row"
      style={{
        paddingBottom: bottomPad,
        // Minimum tap target height of 56px + safe-area
        minHeight: 56,
      }}
    >
      {MOBILE_NAV.map(({ label, Icon, path }) => {
        const isActive = pathname === path || pathname.startsWith(path + '/');
        return (
          <Pressable
            key={path}
            onPress={() => router.push(path as any)}
            className="flex-1 items-center justify-center"
            style={{ paddingVertical: 10 }}
          >
            <View className="relative items-center justify-center" style={{ width: 28, height: 28 }}>
              <Icon
                size={22}
                color={isActive ? iconActive : iconMuted}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {label === 'Inbox' && inboxCount > 0 && (
                <View className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-synapse-accent rounded-full items-center justify-center">
                  <Text className="text-synapse-bg font-sans font-bold" style={{ fontSize: 8, lineHeight: 10 }}>
                    {inboxCount > 9 ? '9+' : inboxCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              className="font-sans"
              style={{
                fontSize: 10,
                marginTop: 3,
                color: isActive ? iconActive : iconMuted,
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
