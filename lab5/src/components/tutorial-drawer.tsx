import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tutorials, type RoutePath } from '../data/tutorials';
import type { ThemePalette } from '../theme';
import { radii, spacing } from '../theme';

type TutorialDrawerProps = {
  activePath: RoutePath;
  theme: ThemePalette;
  onNavigate: (path: RoutePath) => void;
  onClose?: () => void;
};

export function TutorialDrawer({
  activePath,
  theme,
  onNavigate,
  onClose,
}: TutorialDrawerProps) {
  return (
    <View
      style={[
        styles.drawerContainer,
        {
          backgroundColor: theme.surfaceGlass,
          borderColor: theme.borderStrong,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={[styles.kicker, { color: theme.accent }]}>
            RV University • SoCSE • BCA(Hons.)
          </Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Full-Stack Development Tutorials (15 Hours)
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            Select any syllabus tutorial lab below to interact with live implementations built directly into this application.
          </Text>
        </View>
        {onClose && (
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={[styles.closeBtn, { borderColor: theme.border }]}
          >
            <Text style={[styles.closeText, { color: theme.textMuted }]}>✕</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.grid}>
        {tutorials.map((tut) => {
          const isActive = activePath === tut.path;

          return (
            <Pressable
              accessibilityRole="link"
              key={tut.id}
              onPress={() => onNavigate(tut.path)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: isActive ? theme.surfaceElevated : theme.surface,
                  borderColor: isActive ? tut.accent : theme.border,
                },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.badge, { backgroundColor: tut.accent }]}>
                  <Text style={styles.badgeText}>Tutorial {tut.id}</Text>
                </View>
                <Text style={[styles.duration, { color: theme.textDim }]}>{tut.duration}</Text>
              </View>

              <Text style={[styles.cardTitle, { color: theme.text }]}>{tut.title}</Text>
              
              <View style={[styles.syllabusQuote, { borderColor: theme.border }]}>
                <Text numberOfLines={3} style={[styles.syllabusText, { color: theme.textMuted }]}>
                  "{tut.syllabusObjective}"
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={[styles.openLink, { color: tut.accent }]}>
                  {isActive ? '● ACTIVE LAB' : 'LAUNCH LAB →'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.xl,
    width: '100%',
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleCol: {
    gap: 4,
    maxWidth: 820,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  closeBtn: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  closeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: 260,
    flexGrow: 1,
    gap: 10,
    padding: 16,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: radii.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
  },
  duration: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 21,
  },
  syllabusQuote: {
    borderLeftWidth: 2,
    paddingLeft: 8,
  },
  syllabusText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  cardFooter: {
    marginTop: 4,
  },
  openLink: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
