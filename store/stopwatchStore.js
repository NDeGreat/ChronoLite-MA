import { create } from 'zustand';
import { loadJSON, saveJSON } from '../utils/storage';

const STORAGE_KEY = 'stopwatch_state_v1';

function persist(state) {
  const { baseElapsed, startedAt, laps } = state;
  saveJSON(STORAGE_KEY, { baseElapsed, startedAt, laps });
}

// Computes the true elapsed time from the wall clock rather than accumulating fixed tick deltas.
// This avoids drift and, combined with persisting `startedAt`, means the stopwatch resumes correctly
// (still counting the time that passed) even if the app was closed and reopened while running.
function computeElapsed(baseElapsed, startedAt) {
  return startedAt != null ? baseElapsed + (Date.now() - startedAt) : baseElapsed;
}

export const useStopwatchStore = create((set, get) => ({
  baseElapsed: 0, // accumulated milliseconds from previous runs
  startedAt: null, // Date.now() when the current run began, null while paused
  elapsed: 0, // displayed value, refreshed by tick()
  isRunning: false,
  laps: [], // newest lap first, each entry is an elapsed-ms snapshot
  hydrated: false,

  // Restore persisted elapsed time and laps once on mount.
  hydrate: async () => {
    const saved = await loadJSON(STORAGE_KEY, null);
    const baseElapsed = saved?.baseElapsed ?? 0;
    const startedAt = saved?.startedAt ?? null;
    set({
      baseElapsed,
      startedAt,
      elapsed: computeElapsed(baseElapsed, startedAt),
      isRunning: startedAt != null,
      laps: saved?.laps ?? [],
      hydrated: true,
    });
  },

  start: () => {
    if (get().isRunning) return;
    const startedAt = Date.now();
    set({ startedAt, isRunning: true });
    persist(get());
  },

  pause: () => {
    if (!get().isRunning) return;
    const { baseElapsed, startedAt } = get();
    const elapsed = computeElapsed(baseElapsed, startedAt);
    set({ baseElapsed: elapsed, startedAt: null, elapsed, isRunning: false });
    persist(get());
  },

  reset: () => {
    set({ baseElapsed: 0, startedAt: null, elapsed: 0, isRunning: false, laps: [] });
    persist(get());
  },

  // Refreshes the displayed elapsed time; called on a short interval while running.
  tick: () => {
    const { baseElapsed, startedAt, isRunning } = get();
    if (!isRunning) return;
    set({ elapsed: computeElapsed(baseElapsed, startedAt) });
  },

  addLap: () => {
    const { baseElapsed, startedAt, laps } = get();
    set({ laps: [computeElapsed(baseElapsed, startedAt), ...laps] });
    persist(get());
  },
}));
