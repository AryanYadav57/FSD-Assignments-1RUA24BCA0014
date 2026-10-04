import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { quickCapture } from '@/lib/notes';
import { Platform, Keyboard, useWindowDimensions } from 'react-native';
import { X, Type } from 'lucide-react-native';

export function QuickCapture() {
  const { isQuickCaptureOpen, closeQuickCapture } = useNotesStore();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<any>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(() => {
    if (isQuickCaptureOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    if (!isQuickCaptureOpen) {
      setText('');
      setTitle('');
      setShowTitle(false);
    }
  }, [isQuickCaptureOpen]);

  // Global keyboard shortcut: Ctrl/Cmd + Shift + N
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        useNotesStore.getState().toggleQuickCapture();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = async () => {
    if (!text.trim()) return;
    setIsSaving(true);
    await quickCapture(text.trim(), title.trim() || undefined);
    setText('');
    setTitle('');
    setShowTitle(false);
    setIsSaving(false);
    closeQuickCapture();
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.nativeEvent?.key === 'Enter' && !e.nativeEvent?.shiftKey) {
      e.preventDefault?.();
      handleSave();
    }
    if (Platform.OS === 'web' && e.nativeEvent?.key === 'Escape') {
      closeQuickCapture();
    }
  };

  if (!isQuickCaptureOpen) return null;

  // ── Mobile: slide-up bottom sheet ────────────────────────────────────────
  if (isMobile) {
    return (
      <View style={{ position: 'absolute', inset: 0, zIndex: 50, justifyContent: 'flex-end' }}>
        {/* Backdrop */}
        <Pressable
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.40)' }}
          onPress={closeQuickCapture}
        />

        {/* Sheet */}
        <View
          style={{
            backgroundColor: 'var(--color-synapse-bg, #EBE9E1)',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: 'rgba(0,0,0,0.07)',
            paddingBottom: 36, // safe-area + extra breathing room
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
          }}
          className="bg-synapse-bg border-synapse-border"
        >
          {/* Drag Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-synapse-border rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row justify-between items-center px-5 pt-3 pb-2">
            <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest font-semibold">
              Quick Capture
            </Text>
            <View className="flex-row items-center gap-2">
              {!showTitle && (
                <Pressable
                  onPress={() => setShowTitle(true)}
                  className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-synapse-border"
                >
                  <Type size={11} color="#6B6A65" strokeWidth={2} />
                  <Text className="font-sans text-xs text-synapse-text-muted">Title</Text>
                </Pressable>
              )}
              <Pressable onPress={closeQuickCapture} className="w-8 h-8 items-center justify-center rounded-full">
                <X size={16} color="#6B6A65" strokeWidth={1.75} />
              </Pressable>
            </View>
          </View>

          {/* Optional Title */}
          {showTitle && (
            <View className="px-5 pt-1 pb-2">
              <TextInput
                className="font-serif text-lg text-synapse-text py-2 border-b border-synapse-border"
                placeholder="Title (optional)"
                placeholderTextColor="#6B6A65"
                value={title}
                onChangeText={setTitle}
              />
            </View>
          )}

          {/* Main Input */}
          <View className="px-5 py-3">
            <TextInput
              ref={inputRef}
              className="font-sans text-base text-synapse-text"
              style={{ minHeight: 80, maxHeight: 160 }}
              placeholder="What's on your mind?"
              placeholderTextColor="#6B6A65"
              value={text}
              onChangeText={setText}
              multiline
              onKeyPress={handleKeyPress}
              textAlignVertical="top"
            />
          </View>

          {/* Footer */}
          <View className="flex-row justify-end items-center px-5 pt-2">
            <Pressable
              onPress={handleSave}
              disabled={isSaving || !text.trim()}
              style={{ opacity: !text.trim() ? 0.4 : 1 }}
              className="bg-synapse-text px-6 py-3 rounded-full"
            >
              <Text className="text-synapse-bg font-sans font-semibold text-sm">
                {isSaving ? 'Saving...' : 'Capture'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // ── Desktop: centered modal overlay ──────────────────────────────────────
  return (
    <View className="absolute inset-0 z-50 items-center justify-center">
      {/* Backdrop */}
      <Pressable
        className="absolute inset-0 bg-black/30"
        onPress={closeQuickCapture}
      />

      {/* Modal */}
      <View className="w-full max-w-lg mx-4 bg-synapse-bg rounded-2xl border border-synapse-border overflow-hidden z-10 shadow-xl">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-5 pb-2">
          <Text className="font-sans text-xs text-synapse-text-muted uppercase tracking-widest font-semibold">
            Quick Capture
          </Text>
          <View className="flex-row items-center gap-2">
            {!showTitle && (
              <Pressable
                onPress={() => setShowTitle(true)}
                className="flex-row items-center gap-1.5 mr-1 px-3 py-1 rounded-full border border-synapse-border"
              >
                <Type size={11} color="#6B6A65" strokeWidth={2} />
                <Text className="font-sans text-xs text-synapse-text-muted">Title</Text>
              </Pressable>
            )}
            <Pressable onPress={closeQuickCapture} className="w-7 h-7 items-center justify-center rounded-full">
              <X size={16} color="#6B6A65" strokeWidth={1.75} />
            </Pressable>
          </View>
        </View>

        {/* Optional Title */}
        {showTitle && (
          <View className="px-5 pt-2">
            <TextInput
              className="font-serif text-xl text-synapse-text py-2 border-b border-synapse-border"
              placeholder="Title (optional)"
              placeholderTextColor="#6B6A65"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        )}

        {/* Main Input */}
        <View className="px-5 py-4">
          <TextInput
            ref={inputRef}
            className="font-sans text-base text-synapse-text min-h-[80px]"
            placeholder="What's on your mind?"
            placeholderTextColor="#6B6A65"
            value={text}
            onChangeText={setText}
            multiline
            onKeyPress={handleKeyPress}
            textAlignVertical="top"
          />
        </View>

        {/* Footer */}
        <View className="flex-row justify-between items-center px-5 pb-5 pt-2 border-t border-synapse-border">
          <Text className="font-sans text-xs text-synapse-text-muted">
            Enter to save · Esc to close
          </Text>
          <Pressable
            onPress={handleSave}
            className="bg-synapse-text px-6 py-2.5 rounded-full"
            disabled={isSaving || !text.trim()}
          >
            <Text className="text-synapse-bg font-sans font-medium text-sm">
              {isSaving ? 'Saving...' : 'Capture'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
