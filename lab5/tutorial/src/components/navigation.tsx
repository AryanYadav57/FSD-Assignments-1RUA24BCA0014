import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RoutePath } from '../data/tutorials';
import { tutorials } from '../data/tutorials';
import { colors, radii, spacing } from '../theme';

type NavigationProps = {
  activePath: RoutePath;
  onNavigate: (path: RoutePath) => void;
};

const routes = [
  { label: 'Home', detail: 'Overview', path: '/' as const },
  ...tutorials.map((tutorial) => ({ label: tutorial.shortTitle, detail: `Tutorial ${tutorial.id}`, path: tutorial.path })),
];

export function Navigation({ activePath, onNavigate }: NavigationProps) {
  return (
    <View style={styles.nav}>
      {routes.map((route) => {
        const active = route.path === activePath;

        return (
          <Pressable
            accessibilityRole="link"
            key={route.path}
            onPress={() => onNavigate(route.path)}
            style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}
          >
            <Text style={[styles.detail, active && styles.detailActive]}>{route.detail}</Text>
            <Text style={[styles.text, active && styles.textActive]}>{route.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#fdfaf5',
    borderColor: '#e5d6c2',
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  item: {
    borderRadius: radii.md,
    borderColor: '#eadfce',
    borderWidth: 1,
    flexBasis: 142,
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  itemActive: {
    backgroundColor: '#ffffff',
    borderColor: '#caa574',
  },
  itemPressed: {
    opacity: 0.75,
  },
  detail: {
    color: '#8b7460',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detailActive: {
    color: '#9b4a1f',
  },
  text: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  textActive: {
    color: '#9b4a1f',
  },
});
