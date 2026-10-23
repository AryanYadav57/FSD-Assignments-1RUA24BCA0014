import { StyleSheet, Text, View } from 'react-native';

import { tutorials } from '../data/tutorials';
import { colors, radii, spacing } from '../theme';

const pulseItems = [
  {
    label: 'Explore',
    value: '4 labs',
    copy: 'Move from network tracing to component thinking.',
  },
  {
    label: 'Practice',
    value: '15 hrs',
    copy: 'Each activity is small enough to test and explain.',
  },
  {
    label: 'Build',
    value: '1 app',
    copy: 'Everything lives in one React Native web experience.',
  },
];

export function LearningPulse() {
  return (
    <View style={styles.panel}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Learning pulse</Text>
        <Text style={styles.title}>A guided path through the tutorial work</Text>
        <Text style={styles.copy}>
          The core assignment stays the same, but the app now frames it like a calm studio: see the route, open a lab,
          try the interaction, and explain what changed.
        </Text>
      </View>

      <View style={styles.timeline}>
        {tutorials.map((tutorial, index) => (
          <View key={tutorial.id} style={styles.timelineItem}>
            <View style={[styles.dot, { backgroundColor: tutorial.accent }]} />
            <Text style={styles.timelineText}>{index + 1}. {tutorial.shortTitle}</Text>
          </View>
        ))}
      </View>

      <View style={styles.stats}>
        {pulseItems.map((item) => (
          <View key={item.label} style={styles.stat}>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statCopy}>{item.copy}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.cardTint,
    borderColor: '#e6d7bd',
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xl,
    padding: spacing.xxl,
  },
  intro: {
    gap: spacing.sm,
  },
  kicker: {
    color: colors.rose,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  copy: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 760,
  },
  timeline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timelineItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  timelineText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  stat: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: 210,
    flexGrow: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  statCopy: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
  },
});
