import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { ThemeName, ThemePalette } from '../theme';
import { radii, spacing, themes } from '../theme';

type FlimHeroProps = {
  theme: ThemePalette;
  currentThemeName: ThemeName;
  onSelectTheme: (name: ThemeName) => void;
};

const themeOptions: ThemeName[] = ['samba', 'noir', 'psychological', 'giallo', 'sci-fi'];

export function FlimHero({
  theme,
  currentThemeName,
  onSelectTheme,
}: FlimHeroProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 860;
  const isMobile = width < 600;

  return (
    <View style={[styles.heroContainer, { borderBottomColor: theme.border }]}>
      {/* Brand Title: Tutorials */}
      <View style={[styles.brandCol, isCompact && styles.brandColCompact]}>
        <View style={styles.kickerRow}>
          <Text style={[styles.kickerText, { color: theme.accent }]}>
            RV UNIVERSITY • SoCSE • BCA(HONS.)
          </Text>
          <View style={[styles.hourBadge, { backgroundColor: theme.accentGlow, borderColor: theme.border }]}>
            <Text style={[styles.hourBadgeText, { color: theme.accent }]}>15 HOURS</Text>
          </View>
        </View>

        <Text style={[styles.heroTitle, { color: theme.text }, isMobile && styles.heroTitleMobile]}>
          Tutorials
        </Text>
        
        <Text style={[styles.heroSubtitle, { color: theme.textMuted }]}>
          Full-Stack Web Development Interactive Lab Studio
        </Text>
      </View>

      {/* Right Theme Selector Box */}
      <View style={[styles.themePanel, { borderColor: theme.border, backgroundColor: theme.surfaceGlass }]}>
        <Text style={[styles.themeHeader, { color: theme.textDim }]}>THEME</Text>
        <View style={styles.themeList}>
          {themeOptions.map((optName) => {
            const isActive = currentThemeName === optName;
            const optPalette = themes[optName];

            return (
              <Pressable
                accessibilityRole="button"
                key={optName}
                onPress={() => onSelectTheme(optName)}
                style={({ pressed }) => [
                  styles.themeRow,
                  { borderTopColor: theme.border },
                  isActive && { backgroundColor: theme.accentGlow },
                  pressed && styles.themeRowPressed,
                ]}
              >
                <Text
                  style={[
                    styles.themeOptionLabel,
                    { color: isActive ? theme.text : theme.textMuted },
                    isActive && styles.themeOptionActive,
                  ]}
                >
                  {optPalette.label}
                </Text>
                {isActive && (
                  <View style={[styles.checkCircle, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.checkMark, { color: theme.background }]}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    width: '100%',
  },
  brandCol: {
    flex: 1,
    gap: 6,
    minWidth: 280,
  },
  brandColCompact: {
    minWidth: '100%',
  },
  kickerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kickerText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  hourBadge: {
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hourBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontFamily: 'System',
    fontSize: 104,
    fontWeight: '900',
    letterSpacing: -4,
    lineHeight: 100,
  },
  heroTitleMobile: {
    fontSize: 64,
    letterSpacing: -2.5,
    lineHeight: 66,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  themePanel: {
    borderRadius: radii.lg,
    borderWidth: 1,
    minWidth: 175,
    padding: spacing.md,
  },
  themeHeader: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  themeList: {
    width: '100%',
  },
  themeRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 7,
  },
  themeRowPressed: {
    opacity: 0.7,
  },
  themeOptionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  themeOptionActive: {
    fontWeight: '900',
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 14,
    justifyContent: 'center',
    width: 14,
  },
  checkMark: {
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 10,
  },
});
