import { Slot } from 'expo-router';
import { View, Pressable, Text } from '@/tw';
import { Sidebar } from '@/components/Sidebar';
import { QuickCapture } from '@/components/QuickCapture';
import { CommandPalette } from '@/components/CommandPalette';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useNotesStore } from '@/store/notesStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { fetchNotes } from '@/lib/notes';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Sun, Moon, Plus, Settings } from 'lucide-react-native';

export default function AppLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { openQuickCapture } = useNotesStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchAndSetProfile } = useProfileStore();

  useEffect(() => {
    fetchNotes();
    if (user?.id) fetchAndSetProfile(user.id);
  }, [user?.id]);

  return (
    <View className="flex-1 bg-synapse-bg">
      <View className="flex-1 flex-row">
        {/* Sidebar — hidden on mobile */}
        {!isMobile && <Sidebar />}

        {/* Main Content */}
        <View className="flex-1">
          {/* Mobile Header */}
          {isMobile && (
            <View className="flex-row items-center justify-between px-5 py-3 border-b border-synapse-border bg-synapse-bg">
              <Pressable onPress={() => router.push('/(app)/welcome')} className="flex-row items-center gap-2">
                <View className="w-4 h-4 flex-row flex-wrap justify-between content-between">
                  <View className="w-1.5 h-1.5 bg-synapse-text rounded-full" />
                  <View className="w-1.5 h-1.5 bg-synapse-accent rounded-full" />
                  <View className="w-1.5 h-1.5 bg-synapse-gold rounded-full" />
                  <View className="w-1.5 h-1.5 bg-synapse-text rounded-full" />
                </View>
                <Text className="font-sans font-bold text-base text-synapse-text">Synapse</Text>
              </Pressable>
              <View className="flex-row gap-1 items-center">
                <Pressable onPress={toggleTheme} className="w-9 h-9 items-center justify-center rounded-xl">
                  {isDark
                    ? <Sun  size={18} color="#8C8A84" strokeWidth={1.6} />
                    : <Moon size={18} color="#6B6A65" strokeWidth={1.6} />
                  }
                </Pressable>
                <Pressable onPress={openQuickCapture} className="bg-synapse-text w-9 h-9 rounded-full items-center justify-center">
                  <Plus size={18} color={isDark ? '#141210' : '#EBE9E1'} strokeWidth={2} />
                </Pressable>
                <Pressable onPress={() => router.push('/(app)/settings')} className="w-9 h-9 items-center justify-center rounded-xl">
                  <Settings size={18} color={isDark ? '#8C8A84' : '#6B6A65'} strokeWidth={1.6} />
                </Pressable>
              </View>
            </View>
          )}

          <Slot />
        </View>
      </View>

      {/* Mobile Bottom Nav */}
      {isMobile && <MobileBottomNav />}

      {/* Global Overlays */}
      <QuickCapture />
      <CommandPalette />
    </View>
  );
}
