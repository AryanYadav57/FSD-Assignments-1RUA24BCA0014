import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { defaultTheme, radii, spacing, type ThemePalette } from '../theme';
import { Section } from './section';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationLabProps = {
  theme?: ThemePalette;
};

export function ValidationLab({ theme = defaultTheme }: ValidationLabProps) {
  const [name, setName] = useState('Aryan Yadav');
  const [email, setEmail] = useState('aryan.yadav@example.com');
  const [role, setRole] = useState('Cinematographer');
  const [submitted, setSubmitted] = useState(false);
  const [eventsCount, setEventsCount] = useState(0);

  const errors = useMemo(() => {
    const list: string[] = [];
    if (name.trim().length < 3) {
      list.push('Full Name must contain at least 3 characters.');
    }
    if (!emailPattern.test(email.trim())) {
      list.push('Email address must match valid regex pattern (e.g. user@domain.com).');
    }
    if (role.trim().length < 2) {
      list.push('Creative Specialty / Role must not be empty.');
    }
    return list;
  }, [name, email, role]);

  const isValid = errors.length === 0;

  function handleInput(setter: (val: string) => void, val: string) {
    setter(val);
    setEventsCount((c) => c + 1);
  }

  function handleSubmit() {
    setSubmitted(true);
    setEventsCount((c) => c + 1);
  }

  return (
    <Section
      eyebrow="Tutorial 3 • Syllabus Topic"
      summary="Syllabus: Solve JavaScript problems involving DOM manipulation, event handling, dynamic updates, and form validation."
      theme={theme}
      title="Event Handling, Dynamic Updates & Form Validation"
    >
      {/* JavaScript Core Concepts Callout */}
      <View style={[styles.conceptCallout, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
        <Text style={[styles.conceptTitle, { color: theme.accent }]}>
          ⚡ JavaScript Core Concepts Demonstrated
        </Text>
        <View style={styles.conceptList}>
          <Text style={[styles.conceptItem, { color: theme.textMuted }]}>
            • <Text style={{ color: theme.text, fontWeight: '800' }}>Event Handling:</Text> Controlled <Text style={styles.codeText}>onChangeText</Text> and <Text style={styles.codeText}>onPress</Text> SyntheticEvent listeners.
          </Text>
          <Text style={[styles.conceptItem, { color: theme.textMuted }]}>
            • <Text style={{ color: theme.text, fontWeight: '800' }}>Dynamic Updates:</Text> Declarative reactive updates via React state without manual <Text style={styles.codeText}>document.getElementById</Text>.
          </Text>
          <Text style={[styles.conceptItem, { color: theme.textMuted }]}>
            • <Text style={{ color: theme.text, fontWeight: '800' }}>Form Validation:</Text> Real-time Regex pattern evaluation and error state computation using <Text style={styles.codeText}>useMemo</Text>.
          </Text>
        </View>
      </View>

      <View style={styles.formGrid}>
        {/* Controlled Input Form */}
        <View style={styles.formCol}>
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>STUDENT / CREATIVE NAME</Text>
          <TextInput
            accessibilityLabel="Full Name"
            onChangeText={(v) => handleInput(setName, v)}
            placeholder="Enter full name..."
            placeholderTextColor={theme.textDim}
            style={[
              styles.input,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={name}
          />

          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>EMAIL ADDRESS</Text>
          <TextInput
            accessibilityLabel="Email Address"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(v) => handleInput(setEmail, v)}
            placeholder="user@example.com"
            placeholderTextColor={theme.textDim}
            style={[
              styles.input,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={email}
          />

          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>CREATIVE SPECIALTY / ROLE</Text>
          <TextInput
            accessibilityLabel="Creative Role"
            onChangeText={(v) => handleInput(setRole, v)}
            placeholder="Designer, Developer, Director..."
            placeholderTextColor={theme.textDim}
            style={[
              styles.input,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={role}
          />

          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: theme.badgeBg },
              pressed && styles.submitBtnPressed,
            ]}
          >
            <Text style={[styles.submitBtnText, { color: theme.badgeText }]}>
              DISPATCH VALIDATION EVENT
            </Text>
          </Pressable>
        </View>

        {/* Live Validation & Telemetry Output */}
        <View
          style={[
            styles.telemetryCol,
            {
              backgroundColor: theme.surfaceGlass,
              borderColor: submitted && !isValid ? theme.danger : theme.borderStrong,
            },
          ]}
        >
          <View style={styles.telemetryHeader}>
            <Text style={[styles.telemetryTitle, { color: theme.accent }]}>
              Live JavaScript Telemetry
            </Text>
            <View
              style={[
                styles.badgeStatus,
                { backgroundColor: isValid ? theme.success : theme.warning },
              ]}
            >
              <Text style={styles.badgeStatusText}>
                {isValid ? 'VALID' : 'NEEDS INPUT'}
              </Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Dispatched React Events:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{eventsCount}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total Characters Buffered:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {name.length + email.length + role.length}
            </Text>
          </View>

          {/* Validation Feedback */}
          <View style={styles.messagesBox}>
            {submitted && isValid ? (
              <View style={[styles.successBox, { backgroundColor: 'rgba(52, 211, 153, 0.1)', borderColor: theme.success }]}>
                <Text style={[styles.successTitle, { color: theme.success }]}>
                  ✓ Form Submission Validated!
                </Text>
                <Text style={[styles.successCopy, { color: theme.text }]}>
                  All validation invariants satisfied for {name.trim()} ({role.trim()}).
                </Text>
              </View>
            ) : (
              errors.map((err) => (
                <Text key={err} style={[styles.errorItem, { color: theme.danger }]}>
                  • {err}
                </Text>
              ))
            )}
          </View>
        </View>
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
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  formCol: {
    flexBasis: 320,
    flexGrow: 1,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    fontSize: 14,
    fontWeight: '600',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  submitBtn: {
    alignItems: 'center',
    borderRadius: radii.md,
    marginTop: 8,
    paddingVertical: 12,
  },
  submitBtnPressed: {
    opacity: 0.8,
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  telemetryCol: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: 300,
    flexGrow: 1,
    gap: 12,
    padding: spacing.lg,
  },
  telemetryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  telemetryTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badgeStatus: {
    borderRadius: radii.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeStatusText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  messagesBox: {
    gap: 6,
    marginTop: 4,
  },
  successBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  successTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  successCopy: {
    fontSize: 12,
    lineHeight: 16,
  },
  errorItem: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
});
