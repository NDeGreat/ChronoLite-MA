import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { SOUND_OPTIONS } from '../utils/sounds';

// Lets the user pick which alert tone plays when the timer finishes.
// Tapping an option both selects it and previews it.
export default function SoundPicker({ value, onChange, theme }) {
  return (
    <View style={styles.row}>
      {SOUND_OPTIONS.map((option) => (
        <SoundOption
          key={option.id}
          option={option}
          selected={option.id === value}
          onSelect={() => onChange(option.id)}
          theme={theme}
        />
      ))}
    </View>
  );
}

function SoundOption({ option, selected, onSelect, theme }) {
  const player = useAudioPlayer(option.source);

  const handlePress = () => {
    onSelect();
    player.seekTo(0).finally(() => player.play());
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.chip,
        {
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.primarySoft : theme.background,
        },
      ]}
    >
      {selected && <Ionicons name="checkmark" size={14} color={theme.primary} style={styles.check} />}
      <Text style={[styles.label, { color: selected ? theme.primary : theme.text }]}>{option.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 4,
  },
  check: { marginRight: 2 },
  label: { fontSize: 13, fontWeight: '600' },
});
