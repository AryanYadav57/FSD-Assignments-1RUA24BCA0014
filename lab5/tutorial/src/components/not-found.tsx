import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RoutePath } from '../data/tutorials';
import { defaultTheme, radii, spacing, type ThemePalette } from '../theme';

type NotFoundProps = {
  theme?: ThemePalette;
  onNavigate: (path: RoutePath) => void;
};

export function NotFound({ theme = defaultTheme, onNavigate }: NotFoundProps) {
  return (
    <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Frame Not Found</Text>
      <Text style={[styles.copy, { color: theme.textMuted }]}>
        That route does not exist in this cinematic studio application.
      </Text>
      <Pressable
        accessibilityRole="link"
        onPress={() => onNavigate('/')}
        style={[styles.button, { backgroundColor: theme.badgeBg }]}
      >
        <Text style={[styles.buttonText, { color: theme.badgeText }]}>RETURN HOME</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    marginVertical: spacing.xl,
    padding: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  copy: {
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
