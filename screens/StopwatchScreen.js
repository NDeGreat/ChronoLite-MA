import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import LiveDot from '../components/LiveDot';
import PrimaryButton from '../components/PrimaryButton';
import LapList from '../components/LapList';
import { useStopwatchStore } from '../store/stopwatchStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatMillis } from '../utils/time';
import { getTheme } from '../utils/theme';

const TICK_MS = 10; // update every 10ms for a smooth-looking display adn precise tracking.

export default function StopwatchScreen() {
  const stopwatch = useStopwatchStore();
  const settings = useSettingsStore();
  const theme = getTheme(settings.theme);
  const intervalRef = useRef(null);

  // Restore persisted elapsed time and laps once on mount.
  useEffect(() => {
    if (!stopwatch.hydrated) {
      stopwatch.hydrate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive the elapsed time with a short interval while running.
  useEffect(() => {
    if (stopwatch.isRunning) {
      intervalRef.current = setInterval(() => stopwatch.tick(), TICK_MS);
    }
    return () => clearInterval(intervalRef.current);
  }, [stopwatch.isRunning]);

  if (!stopwatch.hydrated) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <ScreenHeader title="Stopwatch" theme={theme} />

      <Card theme={theme} style={styles.timeCard}>
        <View style={styles.statusRow}>
          <LiveDot active={stopwatch.isRunning} color={theme.primary} />
          <Text style={[styles.status, { color: theme.subtext }]}>
            {stopwatch.isRunning ? 'Running' : 'Paused'}
          </Text>
        </View>
        {/* Monospace, tabular-figure font keeps digit widths fixed so the display never jitters as the numbers change. */}
        <Text style={[styles.time, { color: theme.text }]}>{formatMillis(stopwatch.elapsed)}</Text>
      </Card>

      <View style={styles.buttonRow}>
        {!stopwatch.isRunning ? (
          <PrimaryButton title="Start" onPress={stopwatch.start} color={theme.primary} />
        ) : (
          <PrimaryButton title="Pause" onPress={stopwatch.pause} color={theme.subtext} variant="outline" />
        )}
        <PrimaryButton
          title="Lap"
          onPress={stopwatch.addLap}
          color={theme.primary}
          variant="outline"
          disabled={!stopwatch.isRunning}
        />
        <PrimaryButton title="Reset" onPress={stopwatch.reset} color={theme.danger} variant="outline" />
      </View>

      <Card theme={theme} style={styles.lapCard}>
        <Text style={[styles.lapTitle, { color: theme.subtext }]}>Laps</Text>
        <LapList laps={stopwatch.laps} theme={theme} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', paddingTop: 0 },
  timeCard: { alignItems: 'center', marginBottom: 24 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  status: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  time: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  lapCard: { flexGrow: 0 },
  lapTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
});
