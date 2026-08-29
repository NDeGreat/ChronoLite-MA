// Built-in alert tones the user can pick between in Settings.
export const SOUND_OPTIONS = [
  { id: 'chime', label: 'Chime', source: require('../assets/sounds/chime.wav') },
  { id: 'beep', label: 'Beep', source: require('../assets/sounds/beep.wav') },
  { id: 'bell', label: 'Bell', source: require('../assets/sounds/bell.wav') },
];

export function getSoundSource(soundId) {
  return (SOUND_OPTIONS.find((option) => option.id === soundId) ?? SOUND_OPTIONS[0]).source;
}
