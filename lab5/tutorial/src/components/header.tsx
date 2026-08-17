import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, radii, spacing } from '../theme';

export function Header() {
  const { width } = useWindowDimensions();
  const isCompact = width < 560;

  return (
    <View style={[styles.header, isCompact && styles.headerCompact]}>
      <View style={styles.titleGroup}>
        <View style={styles.kickerRow}>
          <Text style={styles.kicker}>FSD Tutorial Studio</Text>
          <Text style={styles.kickerPill}>React Native Web</Text>
        </View>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>Learn by opening the lab</Text>
        <Text style={styles.subtitle}>
          A single web app that keeps the assignment practical: trace a request, repair a layout, validate a form,
          then explain the component hierarchy that holds it together.
        </Text>
      </View>
      <View style={[styles.stats, isCompact && styles.statsCompact]}>
        <View style={styles.badge}>
          <Text style={styles.badgeNumber}>15</Text>
          <Text style={styles.badgeLabel}>Hours</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeNumber}>4</Text>
          <Text style={styles.badgeLabel}>Labs</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#263247',
    borderColor: '#42516a',
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xxl,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: spacing.xxl,
  },
  headerCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  titleGroup: {
    flex: 1,
    gap: spacing.sm,
  },
  kickerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  kicker: {
    color: '#f2d2aa',
    fontSize: 14,
    fontWeight: '800',
  },
  kickerPill: {
    backgroundColor: '#e5f7f4',
    borderRadius: radii.sm,
    color: colors.teal,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 46,
  },
  titleCompact: {
    fontSize: 26,
    lineHeight: 32,
  },
  subtitle: {
    color: '#dce5f2',
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 680,
  },
  stats: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsCompact: {
    alignSelf: 'stretch',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#fffaf2',
    borderColor: '#f1d8b8',
    borderRadius: radii.md,
    borderWidth: 1,
    minWidth: 92,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  badgeNumber: {
    color: '#9b4a1f',
    fontSize: 28,
    fontWeight: '800',
  },
  badgeLabel: {
    color: '#66513c',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
