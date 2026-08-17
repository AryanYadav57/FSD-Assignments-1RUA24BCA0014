import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { defaultTheme, radii, spacing, type ThemePalette } from '../theme';

type SectionProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  summary: string;
  theme?: ThemePalette;
}>;

export function Section({ eyebrow, title, summary, theme = defaultTheme, children }: SectionProps) {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.heading}>
        <Text style={[styles.eyebrow, { color: theme.accent }]}>{eyebrow}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.summary, { color: theme.textMuted }]}>{summary}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: 20,
    padding: spacing.xl,
    width: '100%',
  },
  heading: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  summary: {
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 780,
  },
});
