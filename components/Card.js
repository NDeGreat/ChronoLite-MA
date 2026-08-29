import React from 'react';
import { View, StyleSheet } from 'react-native';

// Bordered, softly-shadowed container used to group content on every screen.
export default function Card({ theme, style, children }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },
});
