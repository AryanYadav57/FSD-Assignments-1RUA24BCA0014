import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { defaultTheme, radii, spacing, type ThemePalette } from '../theme';
import { Section } from './section';

const boxes = [
  { name: 'Navigation Header', desc: 'Main brand navigation & theme control' },
  { name: 'Canvas Grid', desc: 'Floating cinematic still thumbnails' },
  { name: 'Search Capsule', desc: 'Real-time query & tag filter input' },
  { name: 'Lab Drawer', desc: 'Assignment tutorial modules 1 through 4' },
];

type LayoutFixerProps = {
  theme?: ThemePalette;
};

export function LayoutFixer({ theme = defaultTheme }: LayoutFixerProps) {
  const [fixed, setFixed] = useState(true);

  return (
    <Section
      eyebrow="Tutorial 2 • Syllabus Topic"
      summary="Syllabus: Identify and fix layout issues in HTML/CSS code, including alignment, spacing, and responsiveness using Flexbox and Grid."
      theme={theme}
      title="Layout Issue Fixer (Flexbox & CSS Grid)"
    >
      {/* Before / After Toggle Buttons */}
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setFixed(false)}
          style={[
            styles.segment,
            { borderColor: theme.border },
            !fixed && { backgroundColor: theme.danger, borderColor: theme.danger },
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              { color: !fixed ? '#ffffff' : theme.textMuted },
            ]}
          >
            ● BEFORE (BROKEN HTML/CSS)
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setFixed(true)}
          style={[
            styles.segment,
            { borderColor: theme.border },
            fixed && { backgroundColor: theme.success, borderColor: theme.success },
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              { color: fixed ? '#000000' : theme.textMuted },
            ]}
          >
            ✓ AFTER (RESPONSIVE FLEXBOX & GRID)
          </Text>
        </Pressable>
      </View>

      {/* Interactive Visual Canvas */}
      <View
        style={[
          styles.demoArea,
          { borderColor: theme.borderStrong, backgroundColor: theme.surfaceGlass },
          fixed ? styles.fixedDemo : styles.brokenDemo,
        ]}
      >
        {boxes.map((box, index) => (
          <View
            key={box.name}
            style={[
              styles.boxCard,
              fixed
                ? [styles.fixedBox, { borderColor: theme.accent, backgroundColor: theme.surfaceElevated }]
                : [styles.brokenBox, { borderColor: theme.danger, backgroundColor: 'rgba(239,68,68,0.1)' }],
            ]}
          >
            <Text style={[styles.boxTitle, { color: fixed ? theme.text : theme.danger }]}>
              {box.name}
            </Text>
            <Text style={[styles.boxDesc, { color: theme.textMuted }]}>
              {fixed
                ? 'Flex basis & auto wrap responsive'
                : index % 2 === 0
                ? 'Width overflow 320px'
                : 'No wrap collision'}
            </Text>
          </View>
        ))}
      </View>

      {/* Code Snippet Comparison */}
      <View style={[styles.codeSnippetPanel, { backgroundColor: theme.searchBg, borderColor: theme.border }]}>
        <Text style={[styles.codeHeader, { color: theme.accent }]}>
          {fixed ? '✨ Repaired CSS (Responsive Flexbox)' : '⚠️ Broken CSS (Rigid & Inflexible)'}
        </Text>
        <Text style={[styles.codeContent, { color: theme.text }]}>
          {fixed
            ? `.container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n  align-items: stretch;\n}\n.card {\n  flex: 1 1 220px;\n  min-height: 70px;\n}`
            : `.container {\n  display: flex;\n  flex-wrap: nowrap; /* Causes horizontal overflow */\n  width: 100%;\n}\n.card {\n  width: 380px; /* Fixed rigid width */\n  margin-right: -10px; /* Uneven spacing */\n}`}
        </Text>
      </View>

      {/* Architectural Checklist */}
      <View style={styles.checklist}>
        <View
          style={[
            styles.checkCard,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: fixed ? theme.success : theme.danger,
            },
          ]}
        >
          <Text style={[styles.checkLabel, { color: fixed ? theme.success : theme.danger }]}>
            1. Alignment & Flow
          </Text>
          <Text style={[styles.checkValue, { color: theme.text }]}>
            {fixed ? 'align-items: stretch with equal card heights' : 'misaligned baseline and clipped margins'}
          </Text>
        </View>

        <View
          style={[
            styles.checkCard,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: fixed ? theme.success : theme.danger,
            },
          ]}
        >
          <Text style={[styles.checkLabel, { color: fixed ? theme.success : theme.danger }]}>
            2. Spacing & Gaps
          </Text>
          <Text style={[styles.checkValue, { color: theme.text }]}>
            {fixed ? 'Standardized gap: 12px without margin hacks' : 'colliding negative margins & tight boundaries'}
          </Text>
        </View>

        <View
          style={[
            styles.checkCard,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: fixed ? theme.success : theme.danger,
            },
          ]}
        >
          <Text style={[styles.checkLabel, { color: fixed ? theme.success : theme.danger }]}>
            3. Viewport Responsiveness
          </Text>
          <Text style={[styles.checkValue, { color: theme.text }]}>
            {fixed ? 'flexWrap: wrap smoothly re-arranges cards' : 'rigid elements produce overflow and clipping'}
          </Text>
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  segment: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  demoArea: {
    borderRadius: radii.lg,
    borderWidth: 1,
    minHeight: 160,
    overflow: 'hidden',
    padding: spacing.md,
  },
  brokenDemo: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  fixedDemo: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  boxCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 14,
  },
  brokenBox: {
    marginRight: 4,
    minHeight: 60,
    width: 280,
  },
  fixedBox: {
    flexBasis: 220,
    flexGrow: 1,
    minHeight: 70,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  boxDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  codeSnippetPanel: {
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 6,
    padding: spacing.md,
  },
  codeHeader: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  codeContent: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  checklist: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  checkCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: 240,
    flexGrow: 1,
    gap: 4,
    padding: 14,
  },
  checkLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  checkValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});
