import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Tutorial } from '../data/tutorials';
import { colors, radii } from '../theme';

type TutorialCardProps = {
  onOpen: (path: Tutorial['path']) => void;
  tutorial: Tutorial;
};

export function TutorialCard({ onOpen, tutorial }: TutorialCardProps) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => onOpen(tutorial.path)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: tutorial.surface, borderColor: tutorial.accent },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: tutorial.accent }]}>Tutorial {tutorial.id}</Text>
        <Text style={styles.duration}>{tutorial.duration}</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.number, { backgroundColor: tutorial.accent }]}>
          <Text style={styles.numberText}>{tutorial.id}</Text>
        </View>
        <Text style={styles.title}>{tutorial.title}</Text>
      </View>
      <Text style={styles.goal}>{tutorial.goal}</Text>
      <View style={styles.deliverablePanel}>
        <Text style={styles.deliverableLabel}>What you will show</Text>
        <Text style={styles.deliverable}>{tutorial.deliverable}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.open, { color: tutorial.accent }]}>Open this lab</Text>
        <Text style={[styles.arrow, { color: tutorial.accent }]}>{'>'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: 260,
    flexGrow: 1,
    gap: 12,
    minWidth: 230,
    minHeight: 260,
    padding: 18,
  },
  cardPressed: {
    opacity: 0.78,
    transform: [{ translateY: 1 }],
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  duration: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: radii.sm,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  number: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  numberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  title: {
    color: '#192234',
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 21,
  },
  goal: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  deliverable: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  deliverablePanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderColor: 'rgba(34, 48, 68, 0.1)',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  deliverableLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  open: {
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  arrow: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 28,
  },
});
