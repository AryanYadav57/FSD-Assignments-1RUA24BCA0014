import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { defaultTheme, radii, spacing, type ThemePalette } from '../theme';
import { Section } from './section';

type RequestResult = {
  status: number;
  statusText: string;
  contentType: string;
  elapsed: number;
  url: string;
  body: {
    id: number;
    title: string;
    completed: boolean;
  };
};

const cycleSteps = [
  { step: '1. Client Browser', desc: 'Prepares HTTP GET & headers' },
  { step: '2. DNS Lookup', desc: 'Resolves IP from hostname' },
  { step: '3. Web Server', desc: 'Routes request & generates payload' },
  { step: '4. HTTP Response', desc: 'Streams status code & JSON' },
  { step: '5. DOM / React Native', desc: 'Parses body & renders UI' },
];

const sampleEndpoints = [
  { label: 'Todo Item #1', url: 'https://jsonplaceholder.typicode.com/todos/1' },
  { label: 'Todo Item #42', url: 'https://jsonplaceholder.typicode.com/todos/42' },
];

type HttpCycleTracerProps = {
  theme?: ThemePalette;
};

export function HttpCycleTracer({ theme = defaultTheme }: HttpCycleTracerProps) {
  const [selectedUrl, setSelectedUrl] = useState(sampleEndpoints[0].url);
  const [result, setResult] = useState<RequestResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const responseRows = useMemo(
    () =>
      result
        ? [
            ['Request Method', 'GET'],
            ['Status Code', `${result.status} ${result.statusText}`],
            ['Content-Type', result.contentType || 'application/json; charset=utf-8'],
            ['Roundtrip Latency', `${result.elapsed} ms`],
            ['Request URL', result.url],
          ]
        : [],
    [result]
  );

  async function traceRequest() {
    setLoading(true);
    setError('');
    setActiveStepIndex(0);

    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 120);

    const startedAt = Date.now();
    try {
      const response = await fetch(selectedUrl);
      const body = await response.json();

      clearInterval(stepInterval);
      setActiveStepIndex(4);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setResult({
        status: response.status,
        statusText: response.statusText || 'OK',
        contentType: response.headers.get('content-type') ?? 'application/json',
        elapsed: Date.now() - startedAt,
        url: selectedUrl,
        body,
      });
    } catch {
      clearInterval(stepInterval);
      setError('The live network request could not be completed. Check connection.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section
      eyebrow="Tutorial 1 • Syllabus Topic"
      summary="Syllabus: Trace and explain the HTTP request–response cycle using browser developer tools (Network tab) for a sample website."
      theme={theme}
      title="HTTP Request–Response Cycle & DevTools Inspector"
    >
      {/* DevTools Guide Callout */}
      <View style={[styles.devToolsGuide, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
        <Text style={[styles.guideTitle, { color: theme.accent }]}>
          🛠️ How to Trace in Browser Developer Tools (Network Tab)
        </Text>
        <Text style={[styles.guideText, { color: theme.textMuted }]}>
          1. Press <Text style={[styles.codeSpan, { color: theme.text }]}>F12</Text> or <Text style={[styles.codeSpan, { color: theme.text }]}>Ctrl+Shift+I</Text> (Cmd+Option+I on Mac) to open Developer Tools.{'\n'}
          2. Click the <Text style={[styles.codeSpan, { color: theme.text }]}>Network</Text> tab and filter by <Text style={[styles.codeSpan, { color: theme.text }]}>Fetch/XHR</Text>.{'\n'}
          3. Click the "TRACE LIVE HTTP REQUEST" button below to observe the network request, request headers, timing waterfall, and JSON payload in real-time.
        </Text>
      </View>

      {/* Visual Pipeline Stages */}
      <View style={styles.cycleGrid}>
        {cycleSteps.map((item, index) => {
          const isHighlighted = activeStepIndex >= index;
          return (
            <View
              key={item.step}
              style={[
                styles.stepCard,
                {
                  backgroundColor: isHighlighted ? theme.surfaceElevated : theme.surface,
                  borderColor: isHighlighted ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.stepTitle,
                  { color: isHighlighted ? theme.accent : theme.text },
                ]}
              >
                {item.step}
              </Text>
              <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
                {item.desc}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Endpoint Selector & Trigger Button */}
      <View style={styles.controlsRow}>
        <View style={styles.endpointPicker}>
          {sampleEndpoints.map((ep) => (
            <Pressable
              accessibilityRole="button"
              key={ep.url}
              onPress={() => setSelectedUrl(ep.url)}
              style={[
                styles.endpointBtn,
                {
                  backgroundColor:
                    selectedUrl === ep.url ? theme.surfaceElevated : 'transparent',
                  borderColor: selectedUrl === ep.url ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.endpointText,
                  { color: selectedUrl === ep.url ? theme.text : theme.textMuted },
                ]}
              >
                {ep.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={traceRequest}
          style={({ pressed }) => [
            styles.traceButton,
            { backgroundColor: theme.badgeBg },
            pressed && styles.traceButtonPressed,
            loading && styles.traceButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={theme.badgeText} />
          ) : (
            <Text style={[styles.traceButtonText, { color: theme.badgeText }]}>
              TRACE LIVE HTTP REQUEST
            </Text>
          )}
        </Pressable>
      </View>

      {error ? (
        <View style={[styles.errorBox, { borderColor: theme.danger }]}>
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : null}

      {/* Result Metrics and JSON Body */}
      {result ? (
        <View style={styles.resultsWrap}>
          <View style={[styles.tablePanel, { borderColor: theme.border, backgroundColor: theme.surfaceElevated }]}>
            <Text style={[styles.panelHeading, { color: theme.accent }]}>HTTP Headers & Network Metrics</Text>
            {responseRows.map(([label, val]) => (
              <View key={label} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.tableLabel, { color: theme.textMuted }]}>{label}</Text>
                <Text style={[styles.tableVal, { color: theme.text }]}>{val}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.jsonPanel, { backgroundColor: theme.searchBg, borderColor: theme.border }]}>
            <View style={styles.jsonHeader}>
              <Text style={[styles.panelHeading, { color: theme.accent }]}>Response JSON Payload</Text>
              <View style={[styles.statusTag, { backgroundColor: theme.success }]}>
                <Text style={styles.statusTagText}>200 OK</Text>
              </View>
            </View>
            <Text style={[styles.codeText, { color: theme.text }]}>
              {JSON.stringify(result.body, null, 2)}
            </Text>
          </View>
        </View>
      ) : null}
    </Section>
  );
}

const styles = StyleSheet.create({
  devToolsGuide: {
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 6,
    padding: spacing.md,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  guideText: {
    fontSize: 12,
    lineHeight: 18,
  },
  codeSpan: {
    fontFamily: 'monospace',
    fontWeight: '800',
  },
  cycleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stepCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: 180,
    flexGrow: 1,
    gap: 4,
    minHeight: 70,
    padding: 12,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stepDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  endpointPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  endpointBtn: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  endpointText: {
    fontSize: 12,
    fontWeight: '800',
  },
  traceButton: {
    borderRadius: radii.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  traceButtonPressed: {
    opacity: 0.8,
  },
  traceButtonDisabled: {
    opacity: 0.5,
  },
  traceButtonText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  errorBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 12,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  tablePanel: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: 320,
    flexGrow: 1,
    padding: 16,
  },
  panelHeading: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  tableVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  jsonPanel: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flexBasis: 320,
    flexGrow: 1,
    gap: 8,
    padding: 16,
  },
  jsonHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusTag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusTagText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
