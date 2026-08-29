# ChronoLite

A minimal, clean, and lightweight productivity app combining a countdown **Timer** and a lap-recording **Stopwatch**. Built with React Native and Expo.

---

## Features

### Timer
- **Visual Countdown**: Animated circular progress ring.
- **Flexible Controls**: Precise steppers (minutes/seconds) with press-and-hold support, plus quick-duration preset chips.
- **Smart Reset**: Resets to your custom default duration configured in Settings.
- **Alerts**: Vibrates when the timer finishes, with an optional sound (toggle in Settings), plus a system notification if the app is backgrounded or closed.
- **State Persistence**: Remembers your last-used duration across app launches.

### Stopwatch
- **High-Precision Timing**: 10-millisecond resolution tracking for accurate elapsed time measurement.
- **Lap Tracking**: Record and review laps with the newest lap listed first.
- **Background Accuracy**: Timestamp-based time calculation ensures elapsed time remains accurate even if the app is closed or backgrounded.

### Customization & Settings
- **Themes**: System-ready Light and Dark modes with blue-tinted palettes.
- **Quick Presets**: Add, edit, or remove quick-timer chips (up to 8 custom presets).
- **Default Duration**: Set a custom fallback duration for the timer.
- **Alert Sound**: Pick between three built-in tones (Chime, Beep, Bell) played when the timer finishes — only shown while sound is on.
- **Sound Toggle**: Turn the alert sound on or off independently of vibration, which always plays.

---

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Graphics & Icons**: `react-native-svg`, `@expo/vector-icons`
- **Notifications & Audio**: `expo-notifications`, `expo-audio`

---

## Getting Started

### Prerequisites
- [Node.js (LTS)](https://nodejs.org/) & `npm`
- **iOS**: [Expo Go](https://expo.dev/go) app on your device, or the iOS Simulator (macOS only).
- **Android**: Android Studio with an emulator, or a physical device with USB debugging enabled. Timer notifications use `expo-notifications`, which Expo Go no longer supports on Android, so Android requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/) instead of Expo Go.

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   - **iOS** (Expo Go or Simulator):
     ```bash
     npx expo start
     ```
   - **Android** (development build):
     ```bash
     npx expo run:android
     ```
     This builds and installs the app on a connected emulator or device.

### Running the App
- **iOS Physical Device**: Scan the QR code in your terminal using the **Camera app** or **Expo Go**.
- **iOS Simulator**: Press `i` in the terminal (macOS only).
- **Android**: `npx expo run:android` builds, installs, and launches the app on a connected emulator or device.

---

## Future Improvements

- Adding functionalities such as Focus mode, Workout Timer and Meditation mode.
- Accessibility improvements (`accessibilityLabel`, `accessibilityRole`, larger touch targets).
