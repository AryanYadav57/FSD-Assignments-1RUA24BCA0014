import { StyleSheet, Text, View } from 'react-native';

import { defaultTheme, radii, spacing, type ThemePalette } from '../theme';
import { Section } from './section';

const hierarchyGroups = [
  {
    layer: 'Root Application Shell',
    components: [
      { name: 'App', desc: 'Main state manager, theme provider, and route dispatcher' },
      { name: 'FlimNavbar', desc: 'Global header navigation, brand links & sign-up CTA' },
      { name: 'FlimHero', desc: 'Cinematic brand typography, tagline, & interactive theme switcher' },
    ],
  },
  {
    layer: 'Interactive Canvas Components',
    components: [
      { name: 'FlimCanvas', desc: 'Blueprint grid overlay & organic stage coordinator' },
      { name: 'FilmTileCard (8x)', desc: 'Photographic still preview cards with touch lightbox' },
      { name: 'SearchCapsule', desc: 'Monospace query filter & command shortcut bar' },
    ],
  },
  {
    layer: 'Syllabus Tutorial Labs (1 to 4)',
    components: [
      { name: 'HttpCycleTracer', desc: 'Tutorial 1: REST network latency & JSON inspector' },
      { name: 'LayoutFixer', desc: 'Tutorial 2: Flexbox before/after responsive repair' },
      { name: 'ValidationLab', desc: 'Tutorial 3: Controlled event telemetry & form validation' },
      { name: 'ComponentHierarchy', desc: 'Tutorial 4: Architectural composition graph' },
      { name: 'TutorialDrawer', desc: 'Docked multi-lab switcher & assignment navigation' },
    ],
  },
];

type ComponentHierarchyProps = {
  theme?: ThemePalette;
};

export function ComponentHierarchy({ theme = defaultTheme }: ComponentHierarchyProps) {
  return (
    <Section
      eyebrow="Tutorial 4 • Syllabus Topic"
      summary="Syllabus: Analyze a UI and decompose it into reusable React components with proper hierarchy."
      theme={theme}
      title="UI Analysis & Reusable Component Hierarchy"
    >
      {/* Component Design Principles Callout */}
      <View style={[styles.conceptCallout, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
        <Text style={[styles.conceptTitle, { color: theme.accent }]}>
          📐 React Component Decomposition Principles
        </Text>
        <View style={styles.conceptList}>
          <Text style={[styles.conceptItem, { color: theme.textMuted }]}>
            • <Text style={{ color: theme.text, fontWeight: '800' }}>Single Responsibility Principle (SRP):</Text> Each component manages one distinct part of the UI (e.g. <Text style={styles.codeText}>FlimHero</Text> handles branding, <Text style={styles.codeText}>FlimCanvas</Text> handles the grid).
          </Text>
          <Text style={[styles.conceptItem, { color: theme.textMuted }]}>
            • <Text style={{ color: theme.text, fontWeight: '800' }}>Unidirectional Data Flow:</Text> Theme state and route parameters flow down from <Text style={styles.codeText}>App.tsx</Text> via props, while user interactions trigger callbacks upward.
          </Text>
          <Text style={[styles.conceptItem, { color: theme.textMuted }]}>
            • <Text style={{ color: theme.text, fontWeight: '800' }}>Reusability & Composability:</Text> Leaf components like <Text style={styles.codeText}>FilmTileCard</Text> and <Text style={styles.codeText}>Section</Text> are fully isolated and reused across multiple views.
          </Text>
        </View>
      </View>

      <View style={styles.treeContainer}>
        {hierarchyGroups.map((group) => (
          <View
            key={group.layer}
            style={[
              styles.layerCard,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            <View style={styles.layerHeader}>
              <Text style={[styles.layerTitle, { color: theme.accent }]}>
                {group.layer}
              </Text>
            </View>

            <View style={styles.nodesList}>
              {group.components.map((c) => (
                <View
                  key={c.name}
                  style={[
                    styles.componentNode,
                    { backgroundColor: theme.surface, borderColor: theme.borderStrong },
                  ]}
                >
                  <View style={styles.nodeHeader}>
                    <Text style={[styles.nodeIcon, { color: theme.accent }]}>❖</Text>
                    <Text style={[styles.nodeName, { color: theme.text }]}>
                      {c.name}
                    </Text>
                  </View>
                  <Text style={[styles.nodeDesc, { color: theme.textMuted }]}>
                    {c.desc}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  conceptCallout: {
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 8,
    padding: spacing.md,
  },
  conceptTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  conceptList: {
    gap: 4,
  },
  conceptItem: {
    fontSize: 12,
    lineHeight: 18,
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  treeContainer: {
    gap: 16,
    width: '100%',
  },
  layerCard: {
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: 12,
    padding: spacing.lg,
  },
  layerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 8,
  },
  layerTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  nodesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  componentNode: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: 260,
    flexGrow: 1,
    gap: 4,
    padding: 12,
  },
  nodeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  nodeIcon: {
    fontSize: 12,
  },
  nodeName: {
    fontSize: 14,
    fontWeight: '900',
  },
  nodeDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
});
