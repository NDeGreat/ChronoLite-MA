import AsyncStorage from '@react-native-async-storage/async-storage';

// Small JSON wrapper around AsyncStorage with basic error handling.
export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Failed to load "${key}" from storage`, e);
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save "${key}" to storage`, e);
  }
}
