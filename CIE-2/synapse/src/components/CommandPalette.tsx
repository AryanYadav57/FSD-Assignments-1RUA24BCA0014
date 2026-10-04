import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { searchNotes } from '@/lib/search';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchResult {
  id: string;
  title: string;
  content_text: string;
  status: string;
  score: number;
  match: Record<string, string[]>;
}

export function CommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette, openQuickCapture } = useNotesStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (isCommandPaletteOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isCommandPaletteOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  // Global keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        useNotesStore.getState().toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (text.trim()) {
      const searchResults = searchNotes(text);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, []);

  const handleSelect = (result: SearchResult) => {
    closeCommandPalette();
    router.push(`/(app)/note/${result.id}`);
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS !== 'web') return;

    const key = e.nativeEvent?.key;

    if (key === 'Escape') {
      closeCommandPalette();
    } else if (key === 'ArrowDown') {
      e.preventDefault?.();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (key === 'ArrowUp') {
      e.preventDefault?.();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (key === 'Enter' && results.length > 0) {
      e.preventDefault?.();
      handleSelect(results[selectedIndex]);
    }
  };

  /**
   * Highlight matching terms in the text.
   */
  const highlightMatch = (text: string, matchedTerms: string[]): React.ReactNode => {
    if (!matchedTerms.length || !text) return text;

    const pattern = new RegExp(`(${matchedTerms.join('|')})`, 'gi');
    const parts = text.split(pattern);

    return parts.map((part, i) =>
      matchedTerms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
        <Text key={i} className="bg-synapse-accent/20 text-synapse-accent font-semibold">
          {part}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );
  };

  const getMatchedTerms = (match: Record<string, string[]>): string[] => {
    const terms = new Set<string>();
    Object.values(match).forEach((fieldTerms) => {
      fieldTerms.forEach((t) => terms.add(t));
    });
    return Array.from(terms);
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <View className="absolute inset-0 z-50 items-center pt-[15%]">
      {/* Backdrop */}
      <Pressable
        className="absolute inset-0 bg-black/30"
        onPress={closeCommandPalette}
      />

      {/* Palette */}
      <View className="w-full max-w-2xl mx-4 bg-synapse-bg rounded-2xl border border-synapse-border overflow-hidden z-10 shadow-2xl">
        {/* Search Input */}
        <View className="flex-row items-center gap-3 px-5 py-4 border-b border-synapse-border">
          <Search size={16} color="#6B6A65" strokeWidth={1.75} />
          <TextInput
            ref={inputRef}
            className="flex-1 font-sans text-base text-synapse-text"
            placeholder="Search notes, ideas, tags..."
            placeholderTextColor="#6B6A65"
            value={query}
            onChangeText={handleSearch}
            onKeyPress={handleKeyPress}
          />
          <Pressable
            onPress={closeCommandPalette}
            className="ml-1 px-2 py-1 bg-synapse-surface border border-synapse-border rounded-lg"
          >
            <Text className="font-sans text-xs text-synapse-text-muted">ESC</Text>
          </Pressable>
        </View>

        {/* Results */}
        <ScrollView className="max-h-80">
          {query.trim().length > 0 && results.length === 0 && (
            <View className="px-5 py-8 items-center">
              <Text className="font-sans text-synapse-text-muted text-sm">
                No results for "{query}"
              </Text>
              <Pressable
                className="mt-4 bg-synapse-text px-5 py-2.5 rounded-full"
                onPress={() => {
                  closeCommandPalette();
                  openQuickCapture();
                }}
              >
                <Text className="text-synapse-bg font-sans font-medium text-sm">
                  Capture as new idea
                </Text>
              </Pressable>
            </View>
          )}

          {results.map((result, index) => {
            const matchedTerms = getMatchedTerms(result.match);
            const isSelected = index === selectedIndex;
            return (
              <Pressable
                key={result.id}
                onPress={() => handleSelect(result)}
                className={`px-5 py-3 border-b border-synapse-border ${
                  isSelected ? 'bg-synapse-text/5' : ''
                }`}
              >
                <View className="flex-row items-center mb-1">
                  <View
                    className={`w-2 h-2 rounded-full mr-3 ${
                      result.status === 'inbox'
                        ? 'bg-synapse-accent'
                        : result.status === 'note'
                        ? 'bg-synapse-gold'
                        : 'bg-synapse-text-muted'
                    }`}
                  />
                  <Text className="font-sans text-sm font-semibold text-synapse-text flex-1" numberOfLines={1}>
                    {result.title ? highlightMatch(result.title, matchedTerms) : 'Untitled'}
                  </Text>
                  <Text className="font-sans text-xs text-synapse-text-muted ml-2 uppercase">
                    {result.status}
                  </Text>
                </View>
                {Boolean(result.content_text) && (
                  <Text className="font-sans text-xs text-synapse-text-muted ml-5" numberOfLines={2}>
                    {highlightMatch(
                      result.content_text.substring(0, 120),
                      matchedTerms
                    )}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Footer hints */}
        {!query.trim() && (
          <View className="px-5 py-4 border-t border-synapse-border">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="font-sans text-xs text-synapse-text-muted mr-4">↑↓ Navigate</Text>
                <Text className="font-sans text-xs text-synapse-text-muted mr-4">↵ Open</Text>
                <Text className="font-sans text-xs text-synapse-text-muted">Esc Close</Text>
              </View>
              <Text className="font-sans text-xs text-synapse-text-muted">
                Type to search...
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
