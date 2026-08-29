import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { formatMillis } from '../utils/time';

// Displays recorded stopwatch laps, newest first.
export default function LapList({ laps, theme }) {
  if (laps.length === 0) {
    return <Text style={[styles.empty, { color: theme.subtext }]}>No laps yet</Text>;
  }

  return (
    <FlatList
      data={laps}
      keyExtractor={(_, i) => String(i)}
      style={styles.list}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        <View style={[styles.row, { borderColor: theme.border }]}>
          <Text style={{ color: theme.subtext }}>Lap {laps.length - index}</Text>
          <Text style={[styles.lapTime, { color: theme.text }]}>{formatMillis(item)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { width: '100%' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lapTime: { fontVariant: ['tabular-nums'] },
  empty: { textAlign: 'center', paddingVertical: 4 },
});
