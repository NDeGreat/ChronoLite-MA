import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DurationPicker from './DurationPicker';
import PrimaryButton from './PrimaryButton';
import { formatDurationLabel } from '../utils/time';

const MAX_PRESETS = 8;

// Lets the user review, remove, and add the quick-timer duration presets shown as chips on the Timer screen.
export default function QuickDurationsEditor({ presets, onAdd, onRemove, theme }) {
  const [draftMinutes, setDraftMinutes] = useState(2);
  const [draftSeconds, setDraftSeconds] = useState(0);

  const isZero = draftMinutes === 0 && draftSeconds === 0;
  const isDuplicate = presets.some((p) => p.minutes === draftMinutes && p.seconds === draftSeconds);
  const isFull = presets.length >= MAX_PRESETS;
  const canAdd = !isZero && !isDuplicate && !isFull;

  const addLabel = isFull ? 'Limit reached' : isDuplicate ? 'Already added' : 'Add Option';

  return (
    <View>
      <View style={styles.chipRow}>
        {presets.length === 0 && <Text style={{ color: theme.subtext }}>No quick options yet</Text>}
        {presets.map((preset, index) => (
          <View
            key={`${preset.minutes}-${preset.seconds}-${index}`}
            style={[styles.chip, { borderColor: theme.border, backgroundColor: theme.background }]}
          >
            <Text style={[styles.chipText, { color: theme.text }]}>
              {formatDurationLabel(preset.minutes, preset.seconds)}
            </Text>
            <Pressable onPress={() => onRemove(index)} hitSlop={8} style={styles.removeBtn}>
              <Text style={[styles.removeText, { color: theme.danger }]}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={[styles.addRow, { borderTopColor: theme.border }]}>
        <DurationPicker
          minutes={draftMinutes}
          seconds={draftSeconds}
          onChange={(m, s) => {
            setDraftMinutes(m);
            setDraftSeconds(s);
          }}
          theme={theme}
        />
        <PrimaryButton
          title={addLabel}
          onPress={() => onAdd(draftMinutes, draftSeconds)}
          color={theme.primary}
          disabled={!canAdd}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 14,
    paddingRight: 8,
    gap: 6,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  removeBtn: { paddingHorizontal: 2 },
  removeText: { fontSize: 16, fontWeight: '700', lineHeight: 16 },
  addRow: { alignItems: 'center', paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, gap: 16 },
});
