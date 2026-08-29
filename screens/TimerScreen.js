import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Vibration, Platform } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import CircularProgress from '../components/CircularProgress';
import PrimaryButton from '../components/PrimaryButton';
import DurationPicker from '../components/DurationPicker';
import QuickDurations from '../components/QuickDurations';
import { useTimerStore } from '../store/timerStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatSeconds } from '../utils/time';
import { getTheme } from '../utils/theme';
import { getSoundSource } from '../utils/sounds';

export default function TimerScreen() {
  const settings = useSettingsStore();
  const timer = useTimerStore();
  const intervalRef = useRef(null);
  const theme = getTheme(settings.theme);
  const alertPlayer = useAudioPlayer(getSoundSource(settings.soundChoice));

  // Keep the alert player loaded with whichever tone is currently selected.
  useEffect(() => {
    alertPlayer.replace(getSoundSource(settings.soundChoice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.soundChoice]);

  // Load the last-used duration once, falling back to the Settings default.
  useEffect(() => {
    if (!timer.hydrated) {
      timer.hydrate(settings.defaultMinutes, settings.defaultSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive the countdown with a 1-second interval while running.
  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => timer.tick(), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer.isRunning]);

  // Alert the user when the countdown reaches zero: vibration always fires, sound only when enabled in Settings.
  // If the app is backgrounded or closed, a notification scheduled in timerStore's `start` covers the alert instead.
  useEffect(() => {
    if (timer.hydrated && timer.remaining === 0) {
      // A short on/off/on pattern reads as "longer" and also works on iOS, which ignores custom durations on a single vibrate() call.
      Vibration.vibrate([0, 600, 200, 600]);
      if (settings.soundEnabled) {
        alertPlayer.seekTo(0).finally(() => alertPlayer.play());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.remaining]);

  if (!timer.hydrated) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // The real configured duration.
  const actualTotal = timer.minutes * 60 + timer.seconds;
  const total = actualTotal || 1; // guard against divide-by-zero in the progress ring only
  const progress = timer.remaining / total;
  const atFullDuration = timer.remaining === actualTotal;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Timer" theme={theme} />

      <Card theme={theme} style={styles.card}>
        <CircularProgress progress={progress} color={theme.primary} trackColor={theme.track}>
          <Text style={[styles.time, { color: theme.text }]}>{formatSeconds(timer.remaining)}</Text>
        </CircularProgress>

        {!timer.isRunning && atFullDuration && (
          <View style={styles.editor}>
            <QuickDurations
              presets={settings.quickDurations}
              theme={theme}
              selectedMinutes={timer.minutes}
              selectedSeconds={timer.seconds}
              onSelect={(m, s) => timer.setDuration(m, s)}
            />
            <DurationPicker
              minutes={timer.minutes}
              seconds={timer.seconds}
              onChange={(m, s) => timer.setDuration(m, s)}
              theme={theme}
            />
          </View>
        )}
      </Card>

      <View style={styles.buttonRow}>
        {!timer.isRunning ? (
          <PrimaryButton title="Start" onPress={timer.start} color={theme.primary} disabled={timer.remaining === 0} />
        ) : (
          <PrimaryButton title="Pause" onPress={timer.pause} color={theme.subtext} variant="outline" />
        )}
        <PrimaryButton
          title="Reset"
          onPress={() => timer.reset(settings.defaultMinutes, settings.defaultSeconds)}
          color={theme.danger}
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  card: { alignItems: 'center', marginBottom: 24 },
  editor: { marginTop: 24, alignItems: 'center', gap: 20 },
  time: {
    fontSize: 40,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  buttonRow: { flexDirection: 'row', gap: 16 },
});
