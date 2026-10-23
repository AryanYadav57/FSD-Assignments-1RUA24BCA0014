import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tutorials, type RoutePath } from '../data/tutorials';
import type { ThemePalette } from '../theme';
import { radii, spacing } from '../theme';

type FlimNavbarProps = {
  activePath: RoutePath;
  theme: ThemePalette;
  onNavigate: (path: RoutePath) => void;
  onOpenTutorialDrawer: () => void;
};

export function FlimNavbar({
  activePath,
  theme,
  onNavigate,
  onOpenTutorialDrawer,
}: FlimNavbarProps) {
  const [labsDropdownOpen, setLabsDropdownOpen] = useState(false);

  const isHome = activePath === '/';
  const isLabActive =
    activePath === '/http-cycle' ||
    activePath === '/layout-fixer' ||
    activePath === '/validation-lab' ||
    activePath === '/component-hierarchy';

  function handleSelectLab(path: RoutePath) {
    setLabsDropdownOpen(false);
    onNavigate(path);
  }

  return (
    <View style={[styles.navbar, { borderBottomColor: theme.border }]}>
      <View style={styles.leftGroup}>
        {/* Home Link */}
        <Pressable
          accessibilityRole="link"
          onPress={() => {
            setLabsDropdownOpen(false);
            onNavigate('/');
          }}
          style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
        >
          <Text style={[styles.navText, isHome && styles.navTextActive, isHome && { color: theme.text }]}>
            {isHome ? '▶ HOME' : 'HOME'}
          </Text>
        </Pressable>

        {/* Expandable LABS Dropdown Trigger */}
        <View style={styles.dropdownAnchor}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setLabsDropdownOpen((prev) => !prev)}
            style={({ pressed }) => [
              styles.labsTrigger,
              {
                backgroundColor: labsDropdownOpen || isLabActive ? theme.surfaceElevated : 'transparent',
                borderColor: labsDropdownOpen || isLabActive ? theme.accent : theme.border,
              },
              pressed && styles.navItemPressed,
            ]}
          >
            <Text
              style={[
                styles.navText,
                (labsDropdownOpen || isLabActive) && { color: theme.accent, fontWeight: '900' },
              ]}
            >
              LABS {labsDropdownOpen ? '▴' : '▾'}
            </Text>
          </Pressable>

          {/* Expandable Dropdown Menu */}
          {labsDropdownOpen && (
            <View
              style={[
                styles.dropdownMenu,
                {
                  backgroundColor: theme.surfaceGlass,
                  borderColor: theme.borderStrong,
                  shadowColor: '#000000',
                },
              ]}
            >
              <Text style={[styles.dropdownHeader, { color: theme.textDim }]}>
                SYLLABUS TUTORIALS (1 - 4)
              </Text>
              {tutorials.map((tut) => {
                const isActive = activePath === tut.path;
                return (
                  <Pressable
                    accessibilityRole="link"
                    key={tut.id}
                    onPress={() => handleSelectLab(tut.path)}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      { borderTopColor: theme.border },
                      isActive && { backgroundColor: theme.accentGlow },
                      pressed && styles.dropdownItemPressed,
                    ]}
                  >
                    <View style={[styles.tutNumberBadge, { backgroundColor: tut.accent }]}>
                      <Text style={styles.tutNumberText}>0{tut.id}</Text>
                    </View>
                    <View style={styles.tutItemTextCol}>
                      <Text
                        style={[
                          styles.tutItemTitle,
                          { color: isActive ? theme.accent : theme.text },
                          isActive && { fontWeight: '900' },
                        ]}
                      >
                        {tut.title}
                      </Text>
                      <Text numberOfLines={1} style={[styles.tutItemGoal, { color: theme.textMuted }]}>
                        {tut.goal}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* Right Group Actions */}
      <View style={styles.rightGroup}>
        <View style={styles.quickPillsRow}>
          {tutorials.map((tut) => (
            <Pressable
              accessibilityRole="link"
              key={tut.id}
              onPress={() => {
                setLabsDropdownOpen(false);
                onNavigate(tut.path);
              }}
              style={({ pressed }) => [
                styles.quickPill,
                {
                  backgroundColor: activePath === tut.path ? tut.accent : theme.surfaceElevated,
                  borderColor: activePath === tut.path ? tut.accent : theme.border,
                },
                pressed && styles.quickPillPressed,
              ]}
            >
              <Text
                style={[
                  styles.quickPillText,
                  { color: activePath === tut.path ? '#000000' : theme.textMuted },
                ]}
              >
                T{tut.id}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityLabel="Toggle Tutorial Drawer"
          accessibilityRole="button"
          onPress={() => {
            setLabsDropdownOpen(false);
            onOpenTutorialDrawer();
          }}
          style={({ pressed }) => [
            styles.iconButton,
            { borderColor: theme.border, backgroundColor: theme.surfaceElevated },
            pressed && styles.iconButtonPressed,
          ]}
        >
          <Text style={[styles.iconText, { color: theme.accent }]}>◎</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    rowGap: 10,
    width: '100%',
    zIndex: 100,
  },
  leftGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    zIndex: 110,
  },
  rightGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  navItem: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navItemPressed: {
    opacity: 0.65,
  },
  navText: {
    color: '#8b94a0',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  navTextActive: {
    fontWeight: '900',
  },
  dropdownAnchor: {
    position: 'relative',
    zIndex: 120,
  },
  labsTrigger: {
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownMenu: {
    borderRadius: radii.lg,
    borderWidth: 1,
    left: 0,
    minWidth: 320,
    padding: spacing.sm,
    position: 'absolute',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    top: 36,
    zIndex: 200,
  },
  dropdownHeader: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    textTransform: 'uppercase',
  },
  dropdownItem: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  dropdownItemPressed: {
    opacity: 0.7,
  },
  tutNumberBadge: {
    borderRadius: radii.xs,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tutNumberText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  tutItemTextCol: {
    flex: 1,
    gap: 2,
  },
  tutItemTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  tutItemGoal: {
    fontSize: 11,
    lineHeight: 14,
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quickPill: {
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quickPillPressed: {
    opacity: 0.75,
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: '900',
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  iconText: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 15,
  },
});
