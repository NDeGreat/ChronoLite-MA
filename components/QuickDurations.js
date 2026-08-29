import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { formatDurationLabel } from '../utils/time';

// Row of quick-select duration chips shown above the manual stepper.
// `presets` comes from Settings, so the user controls how many there are.
export default function QuickDurations({ presets, onSelect, theme, selectedMinutes, selectedSeconds }) {
  if (!presets || presets.length === 0) return null;

  return (
    <View style={styles.row}>
      {presets.map((preset) => {
        const active = selectedMinutes === preset.minutes && selectedSeconds === preset.seconds;
        return (
          <Pressable
            key={`${preset.minutes}-${preset.seconds}`}
            onPress={() => onSelect(preset.minutes, preset.seconds)}
            style={[
              styles.chip,
              {
                borderColor: active ? theme.primary : theme.border,
                backgroundColor: active ? theme.primarySoft : 'transparent',
              },
            ]}
          >
            <Text style={[styles.chipText, { color: active ? theme.primary : theme.subtext }]}>
              {formatDurationLabel(preset.minutes, preset.seconds)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontWeight: '600' },
});
