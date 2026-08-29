import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Simple screen title, used since the tab navigator header is hidden.
export default function ScreenHeader({ title, theme }) {
  return <Text style={[styles.title, { color: theme.text }]}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '800', marginBottom: 20, alignSelf: 'flex-start' },
});
