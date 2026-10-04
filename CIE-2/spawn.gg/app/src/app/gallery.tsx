import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { readSavedStudioTheme, STUDIO_THEMES, THEME_STORAGE_KEY, type StudioThemeId } from '../constants/studio-themes';
import { DEMO_GAMES, type DemoGame } from '../data/demo-games';
import { readSavedGames, removeSavedGame, type SavedGame } from '../data/game-library';

function CoverArt({ game, theme }: { game: DemoGame; theme: (typeof STUDIO_THEMES)[number] }) {
  const isZombie = game.id === 'last-light';
  const isSpace = game.id === 'starline-courier';
  return (
    <View style={[styles.cover, { backgroundColor: game.palette[0], ...(Platform.OS === 'web' ? { backgroundImage: `linear-gradient(145deg, ${game.palette[0]} 0%, ${theme.canvasDeep} 100%)` } : {}) } as any]}>
      <View style={styles.coverMeta}><Text style={[styles.coverKicker, { color: game.palette[2] }]}>{game.genre}</Text><Text style={[styles.coverKicker, { color: '#c5c7c0' }]}>{game.players}</Text></View>
      {isZombie ? <View pointerEvents="none" style={styles.zombieScene}>
        <View style={styles.sceneGlow} />
        <View style={[styles.zombieShape, styles.zombieOne]}><View style={styles.zombieEye} /><View style={[styles.zombieEye, styles.zombieEyeRight]} /></View>
        <View style={[styles.zombieShape, styles.zombieTwo]}><View style={styles.zombieEye} /><View style={[styles.zombieEye, styles.zombieEyeRight]} /></View>
        <View style={styles.sceneCrosshair}><View style={styles.sceneCrosshairLine} /><View style={[styles.sceneCrosshairLine, styles.sceneCrosshairVertical]} /></View>
      </View> : isSpace ? <View pointerEvents="none" style={styles.spaceScene}>
        {Array.from({ length: 18 }, (_, i) => <View key={i} style={[styles.spaceStar, { left: `${(i * 37) % 96}%`, top: `${(i * 23) % 86}%`, opacity: 0.3 + (i % 5) * 0.13 }]} />)}
        <View style={styles.spaceShip}><View style={styles.spaceShipCore} /></View>
      </View> : <View pointerEvents="none" style={styles.driftScene}>
        <View style={styles.road}><View style={styles.roadLine} /></View>
        <View style={styles.driftCar}><View style={styles.carGlass} /><View style={styles.carLightLeft} /><View style={styles.carLightRight} /></View>
      </View>}
      <Text style={[styles.coverStamp, { color: game.palette[2] }]}>{isZombie ? '09' : isSpace ? '04' : '01'}</Text>
    </View>
  );
}

function DemoCard({ game, theme, featured, compact, onPlay }: { game: DemoGame; theme: (typeof STUDIO_THEMES)[number]; featured?: boolean; compact?: boolean; onPlay: () => void }) {
  return (
    <View style={[styles.gameCard, featured && styles.featuredCard, compact && styles.gameCardCompact, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={featured ? styles.featureArtWrap : styles.cardArtWrap}><CoverArt game={game} theme={theme} /></View>
      <View style={[styles.cardInfo, featured && styles.featureInfo]}>
        <View style={styles.cardHeading}><Text accessibilityRole="header" style={[styles.cardTitle, { color: theme.ink }]}>{game.title}</Text><Text style={[styles.cardSubtitle, { color: theme.muted }]}>{game.subtitle}</Text></View>
        <Text style={[styles.cardDescription, { color: theme.muted }]}>{game.description}</Text>
        <Text style={[styles.cardControls, { color: theme.muted }]} numberOfLines={2}>{game.controls}</Text>
        <Pressable accessibilityRole="button" onPress={onPlay} style={({ pressed }) => [styles.playButton, { backgroundColor: theme.accent, opacity: pressed ? 0.82 : 1 }]}><Text style={[styles.playButtonText, { color: theme.buttonText }]}>Play demo <Text style={styles.playArrow}>↗</Text></Text></Pressable>
      </View>
    </View>
  );
}

function SavedCard({ game, theme, compact, onPlay, onRemove }: { game: SavedGame; theme: (typeof STUDIO_THEMES)[number]; compact?: boolean; onPlay: () => void; onRemove: () => void }) {
  return (
    <View style={[styles.savedCard, compact && styles.savedCardCompact, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.savedCover, { backgroundColor: theme.surfaceAlt, borderBottomColor: theme.border }]}>
        <Text style={[styles.savedCoverMark, { color: theme.accent }]}>✳</Text>
        <View style={styles.savedCoverText}><Text style={[styles.coverKicker, { color: theme.muted }]}>YOUR GAME</Text><Text style={[styles.savedCoverTitle, { color: theme.ink }]} numberOfLines={2}>{game.title}</Text></View>
        <Text style={[styles.savedCoverRuntime, { color: theme.muted }]}>{game.runtimeVersion === '1' ? 'CANVAS RUNTIME' : game.runtimeVersion === '2' ? 'THREE.JS RUNTIME' : 'LEGACY GAME'}</Text>
      </View>
      <View style={styles.savedCardBody}>
        <Text style={[styles.savedDate, { color: theme.muted }]}>{new Date(game.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
        <View style={styles.savedActions}>
          <Pressable accessibilityRole="button" onPress={onPlay} style={({ pressed }) => [styles.playButton, styles.savedPlayButton, { backgroundColor: theme.accent, opacity: pressed ? 0.82 : 1 }]}><Text style={[styles.playButtonText, { color: theme.buttonText }]}>Open game ↗</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${game.title} from library`} onPress={onRemove} style={styles.removeButton}><Text style={[styles.removeText, { color: theme.muted }]}>Remove</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

export default function GalleryScreen() {
  const [themeId, setThemeId] = useState<StudioThemeId>(readSavedStudioTheme);
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const { width } = useWindowDimensions();
  const compact = width < 860;
  const router = useRouter();
  const theme = STUDIO_THEMES.find((item) => item.id === themeId) ?? STUDIO_THEMES[0];
  useEffect(() => {
    let active = true;
    void readSavedGames().then((games) => { if (active) setSavedGames(games); });
    return () => { active = false; };
  }, []);
  const chooseTheme = (id: StudioThemeId) => {
    setThemeId(id);
    if (Platform.OS === 'web') {
      try { window.localStorage.setItem(THEME_STORAGE_KEY, id); } catch { /* Keep the selected palette for this visit. */ }
    }
  };

  return (
    <View style={[styles.shell, { backgroundColor: theme.canvas }]}>
      {!compact && <View style={[styles.sidebar, { backgroundColor: theme.surfaceAlt, borderRightColor: theme.border }]}>
        <View style={styles.brandBlock}><Text style={[styles.brand, { color: theme.ink }]}>spawn.gg <Text style={{ color: theme.accent }}>✳</Text></Text><Text style={[styles.brandCaption, { color: theme.muted }]}>YOUR GAME WORKSPACE</Text></View>
        <Text style={[styles.sideLabel, { color: theme.muted }]}>STUDIO</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/')} style={styles.sideItem}><Text style={[styles.sideIcon, { color: theme.muted }]}>＋</Text><Text style={[styles.sideText, { color: theme.muted }]}>New game</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: true }} style={[styles.sideItem, { backgroundColor: theme.surface }]}><Text style={[styles.sideIcon, { color: theme.accent }]}>▤</Text><Text style={[styles.sideText, { color: theme.ink }]}>My library</Text></Pressable>
        <View style={[styles.sideDivider, { backgroundColor: theme.border }]} />
        <Text style={[styles.sideLabel, { color: theme.muted }]}>COLOR THEME</Text>
        <View style={styles.themeRow} accessibilityLabel="Studio color themes">
          {STUDIO_THEMES.map((item) => <Pressable key={item.id} hitSlop={6} accessibilityRole="button" accessibilityLabel={`Use ${item.name} theme`} accessibilityState={{ selected: item.id === themeId }} onPress={() => chooseTheme(item.id)} style={[styles.themeSwatch, { backgroundColor: item.swatch, borderColor: item.id === themeId ? theme.accent : theme.border }]}><Text style={{ color: item.ink, fontSize: 12 }}>{item.id === themeId ? '✓' : ''}</Text></Pressable>)}
        </View>
        <View style={styles.sideFoot}><Text style={[styles.sideFootTitle, { color: theme.ink }]}>Made to be played.</Text><Text style={[styles.sideFootText, { color: theme.muted }]}>Pick a demo or build a game of your own.</Text></View>
      </View>}

      <View style={styles.main}>
        <View style={[styles.topbar, { borderColor: theme.border, backgroundColor: theme.surfaceAlt }]}>
          {compact ? <Text style={[styles.brand, { color: theme.ink }]}>spawn.gg <Text style={{ color: theme.accent }}>✳</Text></Text> : <View><Text style={[styles.topbarKicker, { color: theme.muted }]}>STUDIO / LIBRARY</Text><Text style={[styles.topbarTitle, { color: theme.ink }]}>Your library</Text></View>}
          <Pressable accessibilityRole="button" onPress={() => router.push('/')} style={({ pressed }) => [styles.newGameButton, { backgroundColor: theme.accent, opacity: pressed ? 0.83 : 1 }]}><Text style={[styles.newGameText, { color: theme.buttonText }]}>＋ <Text style={styles.newGameLabel}>{compact ? 'Create' : 'Create a game'}</Text></Text></Pressable>
        </View>

        {!compact && <View style={[styles.libraryTicker, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}><Text style={[styles.libraryTickerText, { color: theme.muted }]}>SPAWN STUDIO　/　COLLECTION</Text><Text style={[styles.libraryTickerText, { color: theme.accent }]}>PLAY SOMETHING NEW　 ●　 BUILT FOR THE CURIOUS</Text></View>}

        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, compact && styles.contentCompact]}>
          <View style={styles.pageIntro}>
            <View style={{ flex: 1 }}><Text style={[styles.eyebrow, { color: theme.accent }]}>READY TO PLAY</Text><Text accessibilityRole="header" style={[styles.pageTitle, { color: theme.ink }]}>Game library</Text><Text style={[styles.pageDescription, { color: theme.muted }]}>A few worlds to jump into while you’re dreaming up your own.</Text></View>
            <View style={[styles.totalBadge, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}><Text style={[styles.totalNumber, { color: theme.ink }]}>{DEMO_GAMES.length + savedGames.length}</Text><Text style={[styles.totalLabel, { color: theme.muted }]}>GAMES</Text></View>
          </View>

          <View style={styles.sectionHeading}><View><Text style={[styles.sectionTitle, { color: theme.ink }]}>Your games</Text><Text style={[styles.sectionSub, { color: theme.muted }]}>Games you create are saved on this device.</Text></View><Text style={[styles.sectionCount, { color: theme.muted }]}>{savedGames.length} SAVED</Text></View>
          {savedGames.length ? <View style={[styles.savedGrid, compact && styles.gridCompact]}>{savedGames.map((game) => <SavedCard key={game.id} game={game} theme={theme} compact={compact} onPlay={() => router.push({ pathname: '/player', params: { savedGameId: game.id } } as never)} onRemove={() => { void removeSavedGame(game.id).then(setSavedGames); }} />)}</View> : <View style={[styles.emptyState, compact && styles.emptyStateCompact, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}><View style={[styles.emptyMark, { backgroundColor: theme.surface, borderColor: theme.border }]}><Text style={[styles.emptyAsterisk, { color: theme.accent }]}>✳</Text></View><View style={styles.emptyCopy}><Text style={[styles.emptyTitle, { color: theme.ink }]}>Your next game starts with an idea.</Text><Text style={[styles.emptyDescription, { color: theme.muted }]}>When you build a game in the studio, it will show up here automatically.</Text></View><Pressable accessibilityRole="button" onPress={() => router.push('/')} style={[styles.emptyButton, { borderColor: theme.border }]}><Text style={[styles.emptyButtonText, { color: theme.ink }]}>Start creating ↗</Text></Pressable></View>}

          <View style={[styles.sectionHeading, styles.demoSectionHeading]}><View><Text style={[styles.sectionTitle, { color: theme.ink }]}>Featured demos</Text><Text style={[styles.sectionSub, { color: theme.muted }]}>Curated games, ready to play.</Text></View><Text style={[styles.sectionCount, { color: theme.muted }]}>{DEMO_GAMES.length} INCLUDED</Text></View>
          <View style={[styles.demoGrid, compact && styles.gridCompact]}>
            {DEMO_GAMES.map((game, index) => <DemoCard key={game.id} game={game} theme={theme} featured={index === 0 && !compact} compact={compact} onPlay={() => router.push({ pathname: '/player', params: { demoId: game.id } } as never)} />)}
          </View>
          {compact && <View style={[styles.mobilePalette, { borderTopColor: theme.border }]}><View><Text style={[styles.mobilePaletteTitle, { color: theme.ink }]}>Studio palette</Text><Text style={[styles.mobilePaletteSub, { color: theme.muted }]}>Make it yours</Text></View><View style={styles.mobileSwatches}>{STUDIO_THEMES.map((item) => <Pressable key={item.id} hitSlop={5} accessibilityRole="button" accessibilityLabel={`Use ${item.name} theme`} accessibilityState={{ selected: item.id === themeId }} onPress={() => chooseTheme(item.id)} style={[styles.mobileSwatch, { backgroundColor: item.swatch, borderColor: item.id === themeId ? theme.accent : theme.border }]}><Text style={{ color: item.ink, fontSize: 11 }}>{item.id === themeId ? '✓' : ''}</Text></Pressable>)}</View></View>}
          <Text style={[styles.storageNote, { color: theme.muted }]}>Your saved games stay on this device and browser.</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, height: '100vh' as any, minHeight: '100vh' as any, flexDirection: 'row' },
  sidebar: { width: 224, flexShrink: 0, paddingHorizontal: 16, paddingTop: 22, paddingBottom: 18, borderRightWidth: 1 },
  brandBlock: { minHeight: 79, marginBottom: 24 },
  brand: { fontSize: 22, fontWeight: '900', letterSpacing: -1.4 },
  brandCaption: { fontSize: 9, letterSpacing: 1.1, fontWeight: '800', marginTop: 5 },
  sideLabel: { fontSize: 9, letterSpacing: 1.25, fontWeight: '800', marginBottom: 9 },
  sideItem: { minHeight: 40, borderRadius: 9, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 3 },
  sideIcon: { fontSize: 18, width: 20, textAlign: 'center', fontWeight: '700' },
  sideText: { fontSize: 12, fontWeight: '700' },
  sideDivider: { height: 1, marginVertical: 17 },
  themeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  themeSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sideFoot: { marginTop: 'auto', borderTopWidth: 1, paddingTop: 14 },
  sideFootTitle: { fontSize: 12, fontWeight: '750' as any },
  sideFootText: { fontSize: 10, lineHeight: 15, marginTop: 5 },
  main: { flex: 1, minWidth: 0 },
  topbar: { height: 62, flexShrink: 0, borderWidth: 1, borderRadius: 12, marginTop: 13, marginHorizontal: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  libraryTicker: { minHeight: 31, marginHorizontal: 18, marginTop: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  libraryTickerText: { fontSize: 8, letterSpacing: 1.05, fontWeight: '800' },
  topbarKicker: { fontSize: 9, letterSpacing: 1.25, fontWeight: '700' },
  topbarTitle: { fontSize: 15, fontWeight: '750' as any, marginTop: 3 },
  newGameButton: { minHeight: 42, paddingHorizontal: 15, borderRadius: 10, justifyContent: 'center' },
  newGameText: { fontSize: 13, fontWeight: '800' },
  newGameLabel: { fontWeight: '700' },
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 1540, alignSelf: 'center', paddingHorizontal: 42, paddingTop: 36, paddingBottom: 42 },
  contentCompact: { paddingHorizontal: 18, paddingTop: 25, paddingBottom: 28 },
  pageIntro: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 33 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '800', marginBottom: 8 },
  pageTitle: { fontSize: 54, lineHeight: 59, fontWeight: '850' as any, letterSpacing: -2.6 },
  pageDescription: { fontSize: 14, lineHeight: 21, marginTop: 9, maxWidth: 600 },
  totalBadge: { minWidth: 94, minHeight: 76, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  totalNumber: { fontSize: 18, fontWeight: '800' },
  totalLabel: { fontSize: 9, letterSpacing: 1.1, fontWeight: '700', marginTop: 2 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '750' as any },
  sectionSub: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  sectionCount: { fontSize: 9, letterSpacing: 1.05, fontWeight: '700', paddingBottom: 2 },
  emptyState: { minHeight: 118, borderWidth: 1, borderRadius: 14, padding: 19, flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 31 },
  emptyStateCompact: { flexDirection: 'column', alignItems: 'flex-start' },
  emptyMark: { width: 42, height: 42, borderWidth: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  emptyAsterisk: { fontSize: 23, fontWeight: '800' },
  emptyCopy: { flex: 1 },
  emptyTitle: { fontSize: 14, fontWeight: '700' },
  emptyDescription: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  emptyButton: { minHeight: 40, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, justifyContent: 'center' },
  emptyButtonText: { fontSize: 11, fontWeight: '700' },
  demoSectionHeading: { marginTop: 9 },
  demoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' },
  gridCompact: { flexDirection: 'column' },
  gameCard: { width: '31.7%', minWidth: 250, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  gameCardCompact: { width: '100%', minWidth: 0 },
  featuredCard: { width: '100%', minWidth: 0, flexDirection: 'row', minHeight: 248, marginBottom: 1 },
  cardArtWrap: { height: 156 },
  featureArtWrap: { width: '38%', minHeight: 248 },
  cover: { flex: 1, minHeight: '100%', position: 'relative', overflow: 'hidden', padding: 14, justifyContent: 'space-between' },
  coverMeta: { zIndex: 2, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  coverKicker: { fontSize: 9, letterSpacing: 1.05, fontWeight: '800' },
  coverStamp: { position: 'absolute', right: 18, bottom: -34, fontSize: 110, lineHeight: 120, fontWeight: '900', opacity: 0.13 },
  zombieScene: { position: 'absolute', inset: 0 as any, overflow: 'hidden' },
  sceneGlow: { position: 'absolute', width: 220, height: 150, right: '4%', bottom: '-12%', borderRadius: 120, backgroundColor: '#b15c4a', opacity: 0.2 },
  zombieShape: { position: 'absolute', width: 52, height: 83, backgroundColor: '#161c17', borderRadius: 24, bottom: 22, right: '29%', borderWidth: 1, borderColor: '#737164' },
  zombieOne: { transform: [{ rotate: '-8deg' }, { scale: 1.14 }] },
  zombieTwo: { width: 43, height: 66, right: '51%', bottom: 18, opacity: 0.82, transform: [{ rotate: '7deg' }] },
  zombieEye: { position: 'absolute', width: 5, height: 3, borderRadius: 3, backgroundColor: '#dc6a54', top: 24, left: 12 },
  zombieEyeRight: { left: 27 },
  sceneCrosshair: { position: 'absolute', width: 24, height: 24, right: '43%', top: '44%', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#d2b87b77', borderRadius: 12 },
  sceneCrosshairLine: { position: 'absolute', width: 10, height: 1, backgroundColor: '#e1d5bb' },
  sceneCrosshairVertical: { width: 1, height: 10 },
  spaceScene: { position: 'absolute', inset: 0 as any },
  spaceStar: { position: 'absolute', width: 3, height: 3, borderRadius: 2, backgroundColor: '#e8efff' },
  spaceShip: { position: 'absolute', left: '48%', top: '46%', width: 0, height: 0, borderLeftWidth: 16, borderRightWidth: 16, borderBottomWidth: 39, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#8ba9fa', transform: [{ rotate: '12deg' }] },
  spaceShipCore: { position: 'absolute', left: -4, top: 15, width: 8, height: 18, backgroundColor: '#d9e4ff', borderRadius: 4 },
  driftScene: { position: 'absolute', inset: 0 as any, alignItems: 'center', overflow: 'hidden' },
  road: { position: 'absolute', bottom: -8, width: '82%', height: '67%', backgroundColor: '#16171a', transform: [{ perspective: 190 }, { rotateX: '26deg' }], borderTopWidth: 2, borderTopColor: '#b66c60' },
  roadLine: { alignSelf: 'center', width: 3, height: '100%', backgroundColor: '#e0b285', opacity: 0.7 },
  driftCar: { position: 'absolute', width: 57, height: 77, bottom: 23, left: '45%', backgroundColor: '#934c47', borderRadius: 13, borderWidth: 1, borderColor: '#e0a18d' },
  carGlass: { position: 'absolute', top: 14, left: 9, right: 9, height: 20, backgroundColor: '#282c33', borderRadius: 5 },
  carLightLeft: { position: 'absolute', bottom: 8, left: 5, width: 9, height: 4, backgroundColor: '#ffb78a' },
  carLightRight: { position: 'absolute', bottom: 8, right: 5, width: 9, height: 4, backgroundColor: '#ffb78a' },
  cardInfo: { padding: 15, flex: 1 },
  featureInfo: { flex: 1, justifyContent: 'center', paddingHorizontal: 23, paddingVertical: 19 },
  cardHeading: { marginBottom: 8 },
  cardTitle: { fontSize: 16, lineHeight: 21, fontWeight: '750' as any },
  cardSubtitle: { fontSize: 11, lineHeight: 17, marginTop: 3 },
  cardDescription: { fontSize: 12, lineHeight: 18, marginBottom: 9 },
  cardControls: { fontSize: 10, lineHeight: 15, marginBottom: 13 },
  playButton: { minHeight: 42, borderRadius: 9, paddingHorizontal: 14, alignSelf: 'flex-start', justifyContent: 'center' },
  playButtonText: { fontSize: 12, fontWeight: '800' },
  playArrow: { fontSize: 15 },
  savedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 31 },
  savedCard: { width: '31.7%', minWidth: 250, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  savedCardCompact: { width: '100%', minWidth: 0 },
  savedCover: { minHeight: 126, borderBottomWidth: 1, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  savedCoverMark: { fontSize: 28, fontWeight: '800' },
  savedCoverText: { flex: 1 },
  savedCoverTitle: { fontSize: 15, lineHeight: 20, fontWeight: '750' as any, marginTop: 7 },
  savedCoverRuntime: { position: 'absolute', bottom: 10, right: 12, fontSize: 8, letterSpacing: 0.7, fontWeight: '700' },
  savedCardBody: { padding: 13 },
  savedDate: { fontSize: 10, marginBottom: 12 },
  savedActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  savedPlayButton: { minHeight: 38, paddingHorizontal: 12 },
  removeButton: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 3 },
  removeText: { fontSize: 11, fontWeight: '650' as any },
  storageNote: { fontSize: 10, textAlign: 'right', marginTop: 18 },
  mobilePalette: { borderTopWidth: 1, paddingTop: 14, marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  mobilePaletteTitle: { fontSize: 12, fontWeight: '700' },
  mobilePaletteSub: { fontSize: 10, marginTop: 3 },
  mobileSwatches: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 4 },
  mobileSwatch: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
