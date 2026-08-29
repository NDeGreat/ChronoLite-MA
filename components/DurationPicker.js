import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const HOLD_DELAY_MS = 350; // pause before repeat-stepping kicks in
const HOLD_INTERVAL_MS = 80; // repeat-step rate while held

// +/- stepper pair for choosing minutes and seconds.
// Laid out as explicit rows (buttons / values / buttons / labels) so the ":" lines up with the number row specifically,
// not with the buttons or labels above/below it.
export default function DurationPicker({ minutes, seconds, onChange, theme }) {
  const stepMinutes = (delta) => onChange(clamp(minutes + delta, 0, 99), seconds);
  const stepSeconds = (delta) => onChange(minutes, clamp(seconds + delta, 0, 59));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Column><HoldButton symbol="+" onStep={() => stepMinutes(1)} theme={theme} /></Column>
        <View style={styles.colonSlot} />
        <Column><HoldButton symbol="+" onStep={() => stepSeconds(1)} theme={theme} /></Column>
      </View>

      <View style={styles.row}>
        <Text style={[styles.value, { color: theme.text }]}>{String(minutes).padStart(2, '0')}</Text>
        <Text style={[styles.colon, { color: theme.subtext }]}>:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{String(seconds).padStart(2, '0')}</Text>
      </View>

      <View style={styles.row}>
        <Column><HoldButton symbol="-" onStep={() => stepMinutes(-1)} theme={theme} /></Column>
        <View style={styles.colonSlot} />
        <Column><HoldButton symbol="-" onStep={() => stepSeconds(-1)} theme={theme} /></Column>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.subtext }]}>min</Text>
        <View style={styles.colonSlot} />
        <Text style={[styles.label, { color: theme.subtext }]}>sec</Text>
      </View>
    </View>
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Fixed-width wrapper so button/value/label all center on the same column.
function Column({ children }) {
  return <View style={styles.column}>{children}</View>;
}

// A button that steps once on a normal tap, and keeps stepping while held.
function HoldButton({ symbol, onStep, theme }) {
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  // Keep the latest onStep in a ref: the interval below is started once per press,
  // so without this it would keep calling the stale closure from the moment the press started and repeat the same
  // "+1 from the start" value instead of actually accumulating.
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const clearTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  };

  const handlePressIn = () => {
    onStepRef.current();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => onStepRef.current(), HOLD_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  };

  useEffect(() => clearTimers, []);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={clearTimers}
      hitSlop={8}
      style={({ pressed }) => [
        styles.roundBtn,
        { borderColor: theme.primary, backgroundColor: theme.primarySoft, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.roundBtnText, { color: theme.primary }]}>{symbol}</Text>
    </Pressable>
  );
}

const COLUMN_WIDTH = 64;

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  column: { width: COLUMN_WIDTH, alignItems: 'center' },
  colonSlot: { width: 24 },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnText: { fontSize: 18, fontWeight: '700', lineHeight: 20 },
  value: { width: COLUMN_WIDTH, fontSize: 22, fontWeight: '700', textAlign: 'center', fontVariant: ['tabular-nums'] },
  colon: { width: 24, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  label: { width: COLUMN_WIDTH, fontSize: 12, textAlign: 'center' },
});
