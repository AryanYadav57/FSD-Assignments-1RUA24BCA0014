import { View, StyleSheet, TouchableOpacity, Text, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { readSavedStudioTheme, STUDIO_THEMES, type StudioThemeId } from '../constants/studio-themes';
import { getDemoGame } from '../data/demo-games';
import { getSavedGame } from '../data/game-library';

function GameFrame({ htmlContent, frameKey, runtimeVersion, autoStart = true }: { htmlContent: string; frameKey: number; runtimeVersion: string; autoStart?: boolean }) {
  const isFullDocument = /^\s*(?:<!doctype\s+html|<html[\s>])/i.test(htmlContent);
  const wrappedHtml = isFullDocument ? htmlContent : `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
      canvas { max-width: 100%; max-height: 100%; display: block; }
    </style>
  </head>
  <body>${htmlContent}</body>
  </html>`;

  const startGameAfterLoad = (iframe: HTMLIFrameElement) => {
    iframe.focus();

    // Shared runtime games present their own consistent menu. Legacy games
    // retain the compatibility key/click signal for older generated start UIs.
    if (runtimeVersion === '1' || runtimeVersion === '2' || !autoStart) return;

    // Generated games sometimes render a start/menu layer but fail to wire its
    // button to the state machine. Send one centered click plus Enter as a
    // compatibility start signal so the player does not remain stuck there.
    setTimeout(() => {
      try {
        const frameWindow = iframe.contentWindow as (Window & typeof globalThis) | null;
        const frameDocument = iframe.contentDocument;
        if (!frameWindow || !frameDocument) return;

        const x = iframe.clientWidth / 2;
        const y = iframe.clientHeight / 2;
        const target = frameDocument.elementFromPoint(x, y) ?? frameDocument.querySelector('canvas');
        target?.dispatchEvent(new frameWindow.MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: frameWindow,
          clientX: x,
          clientY: y,
        }));
        frameWindow.dispatchEvent(new frameWindow.KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          bubbles: true,
          cancelable: true,
        }));
      } catch (error) {
        console.warn('[player] Could not send generated game start signal.', error);
      }
    }, 200);
  };

  if (Platform.OS === 'web') {
    return (
      <iframe
        key={frameKey}
        srcDoc={wrappedHtml}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          display: 'block',
          backgroundColor: '#000',
        } as any}
        sandbox={runtimeVersion === '1' || runtimeVersion === '2' ? 'allow-scripts allow-pointer-lock' : 'allow-scripts allow-same-origin allow-pointer-lock'}
        title="Generated Game"
        // Auto-focus the iframe so clicks and keystrokes work immediately
        ref={(el) => { if (el) setTimeout(() => el.focus(), 100); }}
        onLoad={(e) => {
          const iframe = e.currentTarget as HTMLIFrameElement;
          startGameAfterLoad(iframe);
        }}
      />
    );
  }

  return (
    <WebView
      key={frameKey}
      source={{ html: wrappedHtml, baseUrl: 'about:blank' }}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      setSupportMultipleWindows={false}
      allowFileAccess={false}
      mixedContentMode="never"
      mediaPlaybackRequiresUserAction
      bounces={false}
      overScrollMode="never"
      scrollEnabled={false}
      style={{ flex: 1, backgroundColor: '#000' }}
      renderLoading={() => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}><ActivityIndicator color="#c8eaf5" /></View>}
      startInLoadingState
      onError={(event) => console.warn('[player] Native game WebView failed to load.', event.nativeEvent.description)}
      onRenderProcessGone={() => console.warn('[player] Native game WebView renderer exited.')}
    />
  );
}

export default function PlayerScreen() {
  const { html, title, enrichedBrief, runtimeVersion, demoId, savedGameId, qualityNotice } = useLocalSearchParams();
  const router = useRouter();
  const [frameKey, setFrameKey] = useState(0);
  const [briefOpen, setBriefOpen] = useState(false);
  const [themeId] = useState<StudioThemeId>(readSavedStudioTheme);
  const theme = STUDIO_THEMES.find((item) => item.id === themeId) ?? STUDIO_THEMES[0];

  const demo = getDemoGame(Array.isArray(demoId) ? demoId[0] : demoId);
  const requestedSavedId = Array.isArray(savedGameId) ? savedGameId[0] : savedGameId;
  const [savedState, setSavedState] = useState({ id: requestedSavedId ?? '', loading: Boolean(requestedSavedId), game: undefined as Awaited<ReturnType<typeof getSavedGame>> });
  useEffect(() => {
    let active = true;
    if (!requestedSavedId) return () => { active = false; };
    void getSavedGame(requestedSavedId).then((game) => { if (active) setSavedState({ id: requestedSavedId, game, loading: false }); }).catch(() => { if (active) setSavedState({ id: requestedSavedId, game: undefined, loading: false }); });
    return () => { active = false; };
  }, [requestedSavedId]);
  const saved = savedState.id === requestedSavedId ? savedState.game : undefined;
  const savedLoading = Boolean(requestedSavedId && (savedState.id !== requestedSavedId || savedState.loading));
  const htmlParam = Array.isArray(html) ? html[0] : html ?? '';
  const savedRuntimeSupported = Boolean(saved && ['', '1', '2'].includes(saved.runtimeVersion));
  const htmlContent = demo?.html ?? (savedRuntimeSupported ? saved?.html : undefined) ?? (requestedSavedId ? '' : htmlParam);
  const gameTitle = demo?.title ?? saved?.title ?? (Array.isArray(title) ? title[0] : title ?? 'Game');
  const brief = saved?.enrichedBrief ?? (Array.isArray(enrichedBrief) ? enrichedBrief[0] : enrichedBrief ?? '');
  const gameRuntimeVersion = saved?.runtimeVersion ?? (Array.isArray(runtimeVersion) ? runtimeVersion[0] : runtimeVersion ?? '');
  const savedUnavailable = Boolean(requestedSavedId && !savedLoading && !savedRuntimeSupported);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.canvasDeep }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }]} onPress={handleBack}>
          <Text style={[styles.backBtnText, { color: theme.ink }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText} numberOfLines={1}>{gameTitle}</Text>
        <TouchableOpacity style={[styles.restartBtn, { backgroundColor: theme.accent }]} onPress={() => setFrameKey((k) => k + 1)}>
          <Text style={[styles.restartBtnText, { color: theme.buttonText }]}>⟳ Restart</Text>
        </TouchableOpacity>
      </View>

      {qualityNotice ? (
        <View style={[styles.qualityNotice, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <Text style={[styles.qualityNoticeText, { color: theme.muted }]}>{Array.isArray(qualityNotice) ? qualityNotice[0] : qualityNotice}</Text>
        </View>
      ) : null}

      {/* AI Design Brief — collapsible panel */}
      {brief ? (
      <View style={[styles.briefContainer, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.briefToggle} onPress={() => setBriefOpen((o) => !o)}>
            <Text style={styles.briefToggleIcon}>🧠</Text>
            <Text style={[styles.briefToggleText, { color: theme.muted }]}>AI Game Design Brief</Text>
            <Text style={[styles.briefCaret, { color: theme.accent }]}>{briefOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {briefOpen && (
            <ScrollView style={styles.briefBody} nestedScrollEnabled>
              <Text style={[styles.briefText, { color: theme.muted }]}>{brief}</Text>
            </ScrollView>
          )}
        </View>
      ) : null}

      {/* Game iframe */}
      <View style={styles.gameArea}>
        {savedLoading ? (
          <View style={styles.noGame}><ActivityIndicator color={theme.accent} /><Text style={styles.noGameText}>Opening your saved game…</Text></View>
        ) : htmlContent ? (
          <GameFrame htmlContent={htmlContent} frameKey={frameKey} runtimeVersion={gameRuntimeVersion} autoStart={!demo} />
        ) : (
          <View style={styles.noGame}>
            <Text style={styles.noGameText}>{savedUnavailable ? 'This saved game is unavailable or uses an unsupported runtime.' : 'No game content received.'}</Text>
            {savedUnavailable ? <Text style={styles.noGameDetail}>Return to My games. If the game still appears there, remove it and build a fresh copy.</Text> : null}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070809',
    minHeight: '100vh' as any,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#202522',
    borderWidth: 1,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 3,
    backgroundColor: '#252b27',
    borderWidth: 1,
    borderColor: '#3c4640',
    minWidth: 80,
    alignItems: 'center',
  },
  backBtnText: { color: '#d4ddd5', fontWeight: '600', fontSize: 14 },
  titleText: {
    color: '#e6edf3',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  restartBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 3,
    backgroundColor: '#c8eaf5',
    minWidth: 80,
    alignItems: 'center',
  },
  restartBtnText: { color: '#101a1d', fontWeight: '700', fontSize: 14 },
  qualityNotice: { marginHorizontal: 12, marginTop: 8, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderRadius: 8 },
  qualityNoticeText: { fontSize: 11, lineHeight: 16 },

  // ── AI Brief ──
  briefContainer: {
    backgroundColor: '#202522',
    marginHorizontal: 12,
    borderWidth: 1,
    borderTopWidth: 0,
  },
  briefToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  briefToggleIcon: { fontSize: 16 },
  briefToggleText: { flex: 1, color: '#d4ddd5', fontSize: 13, fontWeight: '600' },
  briefCaret: { color: '#8fcbd6', fontSize: 11, fontWeight: '700' },
  briefBody: {
    maxHeight: 200,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  briefText: {
    color: '#a4aea6',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },

  gameArea: { flex: 1, backgroundColor: '#000' },
  noGame: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 24 },
  noGameText: { color: '#8b949e', fontSize: 16 },
  noGameDetail: { color: '#8b949e', fontSize: 13, textAlign: 'center', maxWidth: 440, lineHeight: 19 },
});
