import { create } from 'zustand';
import { loadJSON, saveJSON } from '../utils/storage';

const STORAGE_KEY = 'settings_v1';
const MAX_QUICK_DURATIONS = 8;

const DEFAULTS = {
  defaultMinutes: 5,
  defaultSeconds: 0,
  soundEnabled: true,
  soundChoice: 'chime', // 'chime' | 'beep' | 'bell'
  theme: 'light', // 'light' | 'dark'
  quickDurations: [
    { minutes: 0, seconds: 30 },
    { minutes: 1, seconds: 0 },
    { minutes: 3, seconds: 0 },
    { minutes: 5, seconds: 0 },
    { minutes: 10, seconds: 0 },
  ],
};

function sortByLength(list) {
  return [...list].sort((a, b) => a.minutes * 60 + a.seconds - (b.minutes * 60 + b.seconds));
}

function persist(state) {
  const { defaultMinutes, defaultSeconds, soundEnabled, soundChoice, theme, quickDurations } = state;
  saveJSON(STORAGE_KEY, { defaultMinutes, defaultSeconds, soundEnabled, soundChoice, theme, quickDurations });
}

export const useSettingsStore = create((set, get) => ({
  ...DEFAULTS,
  hydrated: false,

  // Load persisted settings once on app start.
  hydrate: async () => {
    const saved = await loadJSON(STORAGE_KEY, DEFAULTS);
    set({ ...DEFAULTS, ...saved, hydrated: true });
  },

  setDefaultDuration: (minutes, seconds) => {
    set({ defaultMinutes: minutes, defaultSeconds: seconds });
    persist(get());
  },

  toggleSound: () => {
    set({ soundEnabled: !get().soundEnabled });
    persist(get());
  },

  setSoundChoice: (soundId) => {
    set({ soundChoice: soundId });
    persist(get());
  },

  toggleTheme: () => {
    set({ theme: get().theme === 'light' ? 'dark' : 'light' });
    persist(get());
  },

  addQuickDuration: (minutes, seconds) => {
    const list = get().quickDurations;
    const isZero = minutes === 0 && seconds === 0;
    const isDuplicate = list.some((p) => p.minutes === minutes && p.seconds === seconds);
    if (isZero || isDuplicate || list.length >= MAX_QUICK_DURATIONS) return;
    set({ quickDurations: sortByLength([...list, { minutes, seconds }]) });
    persist(get());
  },

  removeQuickDuration: (index) => {
    set({ quickDurations: get().quickDurations.filter((_, i) => i !== index) });
    persist(get());
  },
}));
