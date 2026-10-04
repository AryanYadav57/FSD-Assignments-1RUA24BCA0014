import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from '@/tw';
import { useRouter } from 'expo-router';
import { useNotesStore } from '@/store/notesStore';
import { useAuthStore } from '@/store/authStore';
import { useWindowDimensions, Animated } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useProfileStore } from '@/store/profileStore';
import { checkUsernameAvailable, isValidUsername } from '@/lib/profiles';
import {
  Zap,
  FileText,
  Search,
  GitFork,
  Inbox,
  Archive,
  ArrowRight,
  Sparkles,
  Link2,
  Download,
  AtSign,
  Check,
  X,
} from 'lucide-react-native';

// ─── Feature definitions ────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap,
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.10)',
    border: 'rgba(255,107,53,0.20)',
    label: 'Quick Capture',
    description: 'Drop any thought instantly. One shortcut, zero friction.',
    shortcut: '⌘⇧N',
    action: 'capture',
  },
  {
    icon: Search,
    color: '#D4A336',
    bg: 'rgba(212,163,54,0.10)',
    border: 'rgba(212,163,54,0.20)',
    label: 'Smart Search',
    description: 'Full-text fuzzy search across every idea and note.',
    shortcut: '⌘K',
    action: 'search',
  },
  {
    icon: Inbox,
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.08)',
    border: 'rgba(255,107,53,0.15)',
    label: 'Idea Inbox',
    description: 'Raw ideas land here. Process, convert, or merge them.',
    shortcut: null,
    action: 'inbox',
  },
  {
    icon: FileText,
    color: '#D4A336',
    bg: 'rgba(212,163,54,0.08)',
    border: 'rgba(212,163,54,0.15)',
    label: 'Rich Notes',
    description: 'Write with headings, checklists, code blocks and more.',
    shortcut: null,
    action: 'notes',
  },
  {
    icon: Link2,
    color: '#1C1C1C',
    bg: 'rgba(28,28,28,0.06)',
    border: 'rgba(28,28,28,0.10)',
    label: 'Wikilinks',
    description: 'Connect ideas with [[double brackets]] to build a knowledge web.',
    shortcut: '[[',
    action: 'notes',
  },
  {
    icon: GitFork,
    color: '#1C1C1C',
    bg: 'rgba(28,28,28,0.06)',
    border: 'rgba(28,28,28,0.10)',
    label: 'Graph View',
    description: 'See how all your ideas connect in a living force graph.',
    shortcut: null,
    action: 'graph',
  },
  {
    icon: Archive,
    color: '#6B6A65',
    bg: 'rgba(107,106,101,0.08)',
    border: 'rgba(107,106,101,0.15)',
    label: 'Archive',
    description: 'Keep your workspace clean. Archive anything, restore anytime.',
    shortcut: null,
    action: 'archive',
  },
  {
    icon: Download,
    color: '#6B6A65',
    bg: 'rgba(107,106,101,0.08)',
    border: 'rgba(107,106,101,0.15)',
    label: 'Export to Markdown',
    description: 'Your notes are always yours. Export everything as .md files.',
    shortcut: null,
    action: 'settings',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { openQuickCapture, openCommandPalette } = useNotesStore();
  const { user } = useAuthStore();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { profile, isSaving, createAndSetProfile } = useProfileStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Username onboarding state
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Subtle fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Debounced availability check
  useEffect(() => {
    if (!usernameInput || !isValidUsername(usernameInput)) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      const available = await checkUsernameAvailable(usernameInput, user?.id);
      setUsernameAvailable(available);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [usernameInput]);

  const handleSetUsername = async () => {
    if (!user?.id || !usernameInput || !usernameAvailable) return;
    const ok = await createAndSetProfile(user.id, usernameInput);
    if (ok) setDismissed(false); // profile set, banner disappears naturally
  };

  // Display name: @username if set, else email prefix
  const displayName = profile?.username
    ? `@${profile.username}`
    : (user?.email?.split('@')[0] ?? 'there');

  const showUsernamePrompt = !profile && !dismissed;

  const handleFeaturePress = (action: string) => {
    switch (action) {
      case 'capture':
        openQuickCapture();
        break;
      case 'search':
        openCommandPalette();
        break;
      case 'inbox':
        router.push('/(app)/inbox');
        break;
      case 'notes':
        router.push('/(app)/notes');
        break;
      case 'graph':
        router.push('/(app)/graph');
        break;
      case 'archive':
        router.push('/(app)/archive');
        break;
      case 'settings':
        router.push('/(app)/settings');
        break;
      default:
        router.push('/(app)');
    }
  };

  const cols = isDesktop ? 4 : 2;

  return (
    <ScrollView className="flex-1 bg-synapse-bg" contentContainerClassName="pb-20">
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <View className="px-8 pt-16 pb-12 items-center">
          {/* Logo mark */}
          <View className="w-14 h-14 mb-6 flex-row flex-wrap justify-between content-between">
            <View className="w-5.5 h-5.5 bg-synapse-text rounded-full" style={{ width: 22, height: 22 }} />
            <View className="w-5.5 h-5.5 bg-synapse-accent rounded-full" style={{ width: 22, height: 22 }} />
            <View className="w-5.5 h-5.5 bg-synapse-gold rounded-full" style={{ width: 22, height: 22 }} />
            <View className="w-5.5 h-5.5 bg-synapse-text rounded-full" style={{ width: 22, height: 22 }} />
          </View>

          <Text className="font-serif text-5xl text-synapse-text text-center leading-tight mb-3">
            {`Welcome back,\n${displayName}.`}
          </Text>
          <Text className="font-sans text-base text-synapse-text-muted text-center max-w-sm leading-relaxed">
            Your second brain is ready. Pick a feature below or jump straight to your dashboard.
          </Text>

          {/* Username onboarding prompt */}
          {showUsernamePrompt && (
            <View className="mt-8 w-full max-w-sm bg-synapse-surface border border-synapse-border rounded-2xl p-5">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <Text className="font-sans font-semibold text-sm text-synapse-text mb-1">Set your @username</Text>
                  <Text className="font-sans text-xs text-synapse-text-muted">Required to share notes with a personal link.</Text>
                </View>
                <Pressable onPress={() => setDismissed(true)} className="w-7 h-7 items-center justify-center ml-2">
                  <X size={14} color="#6B6A65" strokeWidth={1.75} />
                </Pressable>
              </View>
              <View className="flex-row items-center gap-2">
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
                  />
                  {usernameInput.length >= 3 && (
                    checkingUsername
                      ? <View className="w-3.5 h-3.5 rounded-full border border-synapse-text-muted" />
                      : usernameAvailable
                        ? <Check size={14} color="#16a34a" strokeWidth={2.5} />
                        : <X size={14} color="#dc2626" strokeWidth={2.5} />
                  )}
                </View>
                <Pressable
                  onPress={handleSetUsername}
                  disabled={!usernameAvailable || isSaving}
                  className={`px-4 py-2.5 rounded-xl ${
                    usernameAvailable && !isSaving ? 'bg-synapse-text' : 'bg-synapse-border'
                  }`}
                >
                  <Text className={`font-sans font-semibold text-sm ${
                    usernameAvailable && !isSaving ? 'text-synapse-bg' : 'text-synapse-text-muted'
                  }`}>
                    {isSaving ? '…' : 'Set'}
                  </Text>
                </Pressable>
              </View>
              {usernameInput.length > 0 && !isValidUsername(usernameInput) && (
                <Text className="font-sans text-xs text-synapse-text-muted mt-2">
                  3–20 chars, lowercase letters, numbers, underscores only.
                </Text>
              )}
            </View>
          )}

          {/* CTA */}
          <Pressable
            onPress={() => router.push('/(app)')}
            className="mt-8 flex-row items-center justify-center gap-2.5 bg-synapse-text px-7 py-3.5 rounded-full"
          >
            <Text className="text-synapse-bg font-sans font-semibold text-sm">
              Open Dashboard
            </Text>
            <ArrowRight size={15} color={isDark ? '#1C1C1C' : '#EBE9E1'} strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── Divider ──────────────────────────────────────────────── */}
        <View className="mx-8 border-t border-synapse-border mb-10" />

        {/* ── Section header ───────────────────────────────────────── */}
        <View className="px-8 mb-6 flex-row items-center gap-2">
          <Sparkles size={14} color="#6B6A65" strokeWidth={1.75} />
          <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest font-semibold">
            Everything in Synapse
          </Text>
        </View>

        {/* ── Feature Grid ─────────────────────────────────────────── */}
        <View className="px-6">
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {FEATURES.map((feat) => (
              <FeatureCard
                key={feat.label}
                feat={feat}
                cols={cols}
                onPress={() => handleFeaturePress(feat.action)}
              />
            ))}
          </View>
        </View>

        {/* ── Quick-action strip ───────────────────────────────────── */}
        <View className="mx-6 mt-10 bg-synapse-surface border border-synapse-border rounded-2xl p-6">
          <Text className="font-serif text-xl text-synapse-text mb-1">
            Start with a thought.
          </Text>
          <Text className="font-sans text-sm text-synapse-text-muted mb-5">
            The fastest way to use Synapse is to capture first and organise later.
          </Text>
          <View className="flex-row gap-3 flex-wrap">
            <Pressable
              onPress={openQuickCapture}
              className="flex-row items-center gap-2 bg-synapse-accent px-5 py-3 rounded-full"
            >
              <Zap size={14} color="#fff" strokeWidth={2} />
              <Text className="font-sans font-semibold text-sm text-synapse-bg">
                Capture Idea
              </Text>
            </Pressable>
            <Pressable
              onPress={openCommandPalette}
              className="flex-row items-center gap-2 border border-synapse-border px-5 py-3 rounded-full"
            >
              <Search size={14} color="#6B6A65" strokeWidth={1.75} />
              <Text className="font-sans font-medium text-sm text-synapse-text-muted">
                Search Notes
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(app)')}
              className="flex-row items-center gap-2 border border-synapse-border px-5 py-3 rounded-full"
            >
              <ArrowRight size={14} color="#6B6A65" strokeWidth={1.75} />
              <Text className="font-sans font-medium text-sm text-synapse-text-muted">
                Dashboard
              </Text>
            </Pressable>
          </View>
        </View>

      </Animated.View>
    </ScrollView>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({
  feat,
  cols,
  onPress,
}: {
  feat: (typeof FEATURES)[number];
  cols: number;
  onPress: () => void;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 48 - (cols - 1) * 12) / cols; // px-6 * 2 = 48, gap = 12
  const isSmallScreen = width < 400; // hide shortcuts on very narrow phones

  const { Icon } = { Icon: feat.icon };

  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      style={{ width: cardWidth }}
    >
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: pressed ? feat.bg : isDark ? 'rgba(255,255,255,0.02)' : 'transparent',
            borderColor: feat.border,
            borderWidth: 1,
            borderRadius: 20,
            padding: 16,
            minHeight: 140, // min instead of fixed — grows with content
            opacity: pressed ? 0.85 : 1,
          }}
        >
          {/* Icon circle */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: feat.bg,
              borderColor: feat.border,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Icon size={18} color={feat.color === '#1C1C1C' && isDark ? '#F0EDE6' : feat.color} strokeWidth={1.75} />
          </View>

          <Text
            className="font-sans text-[13px] font-semibold text-synapse-text mb-1.5"
          >
            {feat.label}
          </Text>

          <Text
            className="font-sans text-xs text-synapse-text-muted flex-1"
            style={{ lineHeight: 18 }}
          >
            {feat.description}
          </Text>

          {feat.shortcut && !isSmallScreen && (
            <View
              style={{
                marginTop: 10,
                alignSelf: 'flex-start',
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 6,
                backgroundColor: feat.bg,
                borderColor: feat.border,
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 10,
                  color: feat.color === '#1C1C1C' && isDark ? '#EBE9E1' : feat.color,
                }}
              >
                {feat.shortcut}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
