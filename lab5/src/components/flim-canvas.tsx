import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { tutorials, type RoutePath, type Tutorial } from '../data/tutorials';
import type { ThemePalette } from '../theme';
import { radii, spacing } from '../theme';

type FlimCanvasProps = {
  theme: ThemePalette;
  onNavigate: (path: RoutePath) => void;
};

export function FlimCanvas({ theme, onNavigate }: FlimCanvasProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 900;
  const isMobile = width < 560;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredTutorials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tutorials;

    // Handle direct numbers 1, 2, 3, 4
    if (q === '1' || q === '01') return tutorials.filter((t) => t.id === 1);
    if (q === '2' || q === '02') return tutorials.filter((t) => t.id === 2);
    if (q === '3' || q === '03') return tutorials.filter((t) => t.id === 3);
    if (q === '4' || q === '04') return tutorials.filter((t) => t.id === 4);

    return tutorials.filter(
      (tut) =>
        tut.title.toLowerCase().includes(q) ||
        tut.shortTitle.toLowerCase().includes(q) ||
        tut.goal.toLowerCase().includes(q) ||
        tut.syllabusObjective.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  function handleSearchSubmit() {
    if (filteredTutorials.length === 1) {
      onNavigate(filteredTutorials[0].path);
    }
  }

  // Split tutorials into top pair (01, 02) and bottom pair (03, 04) around the search bar
  const topPair = filteredTutorials.filter((t) => t.id === 1 || t.id === 2);
  const bottomPair = filteredTutorials.filter((t) => t.id === 3 || t.id === 4);

  return (
    <View
      style={[
        styles.canvasContainer,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
          ...(Platform.OS === 'web'
            ? ({
                backgroundImage: `linear-gradient(to right, ${theme.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${theme.gridLine} 1px, transparent 1px)`,
                backgroundSize: '36px 36px',
              } as object)
            : {}),
        },
      ]}
    >
      {/* Top Floating Numbered Cards (01 & 02) */}
      <View style={[styles.cardsRow, isCompact && styles.cardsRowCompact]}>
        {topPair.map((tut) => (
          <FloatingTutorialCard
            isCompact={isCompact}
            isMobile={isMobile}
            key={tut.id}
            onSelect={() => onNavigate(tut.path)}
            theme={theme}
            tutorial={tut}
          />
        ))}
      </View>

      {/* Centered Floating Search Command Capsule */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchPill,
            {
              backgroundColor: theme.searchBg,
              borderColor: theme.borderStrong,
              shadowColor: '#000000',
            },
            isMobile && styles.searchPillMobile,
          ]}
        >
          <TextInput
            accessibilityLabel="Search tutorials 1 to 4"
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            placeholder="TYPE '1', '2', '3', '4' OR TOPIC (HTTP, FLEXBOX, DOM)..."
            placeholderTextColor={theme.textDim}
            returnKeyType="go"
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (searchQuery) {
                if (filteredTutorials.length === 1) {
                  onNavigate(filteredTutorials[0].path);
                } else {
                  setSearchQuery('');
                }
              } else {
                setSearchQuery('1');
              }
            }}
            style={({ pressed }) => [
              styles.searchBtn,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
              pressed && styles.searchBtnPressed,
            ]}
          >
            <Text style={[styles.searchBtnText, { color: theme.accent }]}>
              {filteredTutorials.length === 1
                ? `JUMP TO T${filteredTutorials[0].id} ↵`
                : searchQuery
                ? 'CLEAR ✕'
                : 'NAVIGATE ⌘/'}
            </Text>
          </Pressable>
        </View>

        {searchQuery ? (
          <Text style={[styles.searchFeedback, { color: theme.accent }]}>
            Found {filteredTutorials.length} matching tutorial module{filteredTutorials.length === 1 ? '' : 's'}
          </Text>
        ) : (
          <Text style={[styles.searchFeedback, { color: theme.textDim }]}>
            Interactive Canvas • Click any numbered card or type in search to launch lab
          </Text>
        )}
      </View>

      {/* Bottom Floating Numbered Cards (03 & 04) */}
      <View style={[styles.cardsRow, isCompact && styles.cardsRowCompact]}>
        {bottomPair.map((tut) => (
          <FloatingTutorialCard
            isCompact={isCompact}
            isMobile={isMobile}
            key={tut.id}
            onSelect={() => onNavigate(tut.path)}
            theme={theme}
            tutorial={tut}
          />
        ))}
      </View>
    </View>
  );
}

function FloatingTutorialCard({
  tutorial,
  theme,
  isCompact,
  isMobile,
  onSelect,
}: {
  tutorial: Tutorial;
  theme: ThemePalette;
  isCompact: boolean;
  isMobile: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      accessibilityHint={`Open Tutorial ${tutorial.id}: ${tutorial.title}`}
      accessibilityRole="button"
      onPress={onSelect}
      style={({ pressed }) => [
        styles.floatingCard,
        {
          backgroundColor: theme.surfaceGlass,
          borderColor: theme.borderStrong,
          width: isMobile ? '100%' : isCompact ? 340 : 440,
        },
        pressed && styles.floatingCardPressed,
      ]}
    >
      {/* Top Card Row: Huge Stylized Number & Duration Badge */}
      <View style={styles.cardHeaderRow}>
        <View style={styles.numberRow}>
          <Text style={[styles.hugeNumber, { color: tutorial.accent }]}>
            0{tutorial.id}
          </Text>
          <View style={[styles.miniDot, { backgroundColor: tutorial.accent }]} />
        </View>

        <View style={[styles.durationBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <Text style={[styles.durationText, { color: theme.text }]}>{tutorial.duration}</Text>
        </View>
      </View>

      {/* Title & Goal */}
      <Text style={[styles.cardTitle, { color: theme.text }]}>
        {tutorial.title}
      </Text>

      <Text numberOfLines={2} style={[styles.cardSyllabus, { color: theme.textMuted }]}>
        {tutorial.syllabusObjective}
      </Text>

      {/* Footer Action */}
      <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
        <Text style={[styles.launchText, { color: tutorial.accent }]}>
          LAUNCH TUTORIAL {tutorial.id} LAB →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.xl,
    minHeight: 580,
    overflow: 'hidden',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    position: 'relative',
    width: '100%',
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-around',
    width: '100%',
  },
  cardsRowCompact: {
    justifyContent: 'center',
    gap: 16,
  },
  floatingCard: {
    borderRadius: radii.xl,
    borderWidth: 1,
    elevation: 8,
    gap: 10,
    minHeight: 180,
    padding: spacing.lg,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  floatingCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  hugeNumber: {
    fontFamily: 'System',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 48,
  },
  miniDot: {
    borderRadius: radii.full,
    height: 8,
    width: 8,
  },
  durationBadge: {
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    lineHeight: 23,
  },
  cardSyllabus: {
    fontSize: 12,
    lineHeight: 17,
  },
  cardFooter: {
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 8,
  },
  launchText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  searchSection: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
    width: '100%',
    zIndex: 10,
  },
  searchPill: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: 'row',
    maxWidth: 640,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    width: '94%',
  },
  searchPillMobile: {
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '100%',
  },
  searchBtn: {
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchBtnPressed: {
    opacity: 0.7,
  },
  searchBtnText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  searchFeedback: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
