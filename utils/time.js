// Format whole seconds as MM:SS (used by the Timer).
export function formatSeconds(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Format milliseconds as MM:SS.CC (used by the Stopwatch and lap list).
export function formatMillis(totalMs) {
  const centiseconds = Math.floor((totalMs % 1000) / 10).toString().padStart(2, '0');
  const totalSeconds = Math.floor(totalMs / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}.${centiseconds}`;
}

// Short label for a quick-timer preset, e.g. "30 sec", "5 min", "1m 30s".
export function formatDurationLabel(minutes, seconds) {
  if (minutes === 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes}m ${seconds}s`;
}
