// Blue light/dark color palettes used across all screens.
export const themes = {
  light: {
    background: '#eaf1fb',
    card: '#ffffff',
    text: '#0f1b33',
    subtext: '#5b6b8c',
    primary: '#2563eb',
    primarySoft: '#dbe7fd',
    danger: '#e0455a',
    border: '#c7d7f2',
    shadow: '#1e3a8a',
    track: '#d4e2fa',
  },
  dark: {
    background: '#0a1122',
    card: '#121d36',
    text: '#e8eefc',
    subtext: '#8fa2c9',
    primary: '#5b8def',
    primarySoft: '#1c2c4d',
    danger: '#f0707f',
    border: '#233457',
    shadow: '#000814',
    track: '#1c2c4d',
  },
};

export function getTheme(name) {
  return themes[name] ?? themes.light;
}
