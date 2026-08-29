import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

// Small reusable button used across all screens.
// variant "solid" is filled (primary action), "outline" is bordered (secondary action).
export default function PrimaryButton({
  title,
  onPress,
  color = '#2563eb',
  variant = 'solid',
  disabled,
}) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isOutline
          ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: disabled ? '#9ca3af' : color }
          : { backgroundColor: disabled ? '#9ca3af' : color, borderWidth: 1.5, borderColor: 'transparent' },
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.text, { color: isOutline ? (disabled ? '#9ca3af' : color) : '#fff' }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, minWidth: 90, alignItems: 'center' },
  text: { fontSize: 16, fontWeight: '700' },
});
