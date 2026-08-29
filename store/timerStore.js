import { create } from 'zustand';
import { loadJSON, saveJSON } from '../utils/storage';
import { useSettingsStore } from './settingsStore';
import { scheduleTimerNotification, cancelTimerNotification } from '../utils/notifications';

const STORAGE_KEY = 'timer_last_duration_v1';

export const useTimerStore = create((set, get) => ({
  minutes: 5,
  seconds: 0,
  remaining: 300, // seconds left in the countdown
  isRunning: false,
  hydrated: false,
  notificationId: null, // id of the "timer finished" notification scheduled for background/closed-app delivery

  // Load the last-used duration, falling back to the Settings default.
  hydrate: async (fallbackMinutes, fallbackSeconds) => {
    const saved = await loadJSON(STORAGE_KEY, null);
    const minutes = saved?.minutes ?? fallbackMinutes;
    const seconds = saved?.seconds ?? fallbackSeconds;
    set({ minutes, seconds, remaining: minutes * 60 + seconds, hydrated: true });
  },

  setDuration: (minutes, seconds) => {
    set({ minutes, seconds, remaining: minutes * 60 + seconds });
    saveJSON(STORAGE_KEY, { minutes, seconds });
  },

  // Schedules a local notification to fire when the countdown ends,
  // so the user is still alerted if they background or close the app.
  // It's resolved async, so a pause/reset that happens before it resolves must cancel it rather than let it linger in state.
  start: () => {
    if (get().remaining <= 0) return;
    set({ isRunning: true });
    const soundEnabled = useSettingsStore.getState().soundEnabled;
    scheduleTimerNotification(get().remaining, soundEnabled).then((notificationId) => {
      if (get().isRunning) {
        set({ notificationId });
      } else {
        cancelTimerNotification(notificationId);
      }
    });
  },

  pause: () => {
    const { notificationId } = get();
    set({ isRunning: false, notificationId: null });
    cancelTimerNotification(notificationId);
  },

  // Resets to the given default duration (from Settings),
  // Falls back to the current duration if no default is passed in.
  reset: (defaultMinutes, defaultSeconds) => {
    const minutes = defaultMinutes ?? get().minutes;
    const seconds = defaultSeconds ?? get().seconds;
    const { notificationId } = get();
    set({ minutes, seconds, remaining: minutes * 60 + seconds, isRunning: false, notificationId: null });
    saveJSON(STORAGE_KEY, { minutes, seconds });
    cancelTimerNotification(notificationId);
  },

  tick: () => {
    const remaining = Math.max(0, get().remaining - 1);
    const isRunning = remaining > 0;
    set({ remaining, isRunning, notificationId: isRunning ? get().notificationId : null });
  },
}));
