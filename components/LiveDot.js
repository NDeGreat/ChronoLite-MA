import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

// Small pulsing dot that indicates the stopwatch is actively running.
// Kept separate from the time text so the numbers themselves never resize.
export default function LiveDot({ active, color }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop;
    if (active) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.25, duration: 650, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      opacity.setValue(1);
    }
    return () => loop && loop.stop();
  }, [active]);

  return <Animated.View style={[styles.dot, { backgroundColor: color, opacity: active ? opacity : 0.35 }]} />;
}

const styles = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
});
