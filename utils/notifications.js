import * as Notifications from 'expo-notifications';
import { Platform, AppState } from 'react-native';

const CHANNEL_ID = 'timer-alerts';

// Suppress the OS banner/sound while the app is in the foreground
// The Timer screen already alerts with an in-app sound and vibration,
// so a background/closed-app notification only needs to show when we're not there to alert in-app.
Notifications.setNotificationHandler({
  handleNotification: async () => {
    const inForeground = AppState.currentState === 'active';
    return {
      shouldShowBanner: !inForeground,
      shouldShowList: !inForeground,
      shouldPlaySound: !inForeground,
      shouldSetBadge: false,
    };
  },
});

let setupDone = false;

// Requests notification permission and sets up the Android alert channel.
// Safe to call multiple times; only does real work once per app session.
export async function ensureNotificationSetup() {
  if (setupDone) return;
  setupDone = true;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Timer alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 600, 200, 600],
        // Omitting `sound` uses the system's default notification sound.
      });
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  } catch (e) {
    console.warn('Failed to set up notifications', e);
  }
}

// Schedules a "timer finished" notification to fire `seconds` from now,
// so it still arrives if the app is backgrounded or closed before then.
// Returns the notification id, or null if scheduling wasn't possible.
export async function scheduleTimerNotification(seconds, soundEnabled) {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return null;
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Timer done',
        body: 'Your countdown timer has finished.',
        sound: soundEnabled,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(seconds)),
        channelId: CHANNEL_ID,
      },
    });
  } catch (e) {
    console.warn('Failed to schedule timer notification', e);
    return null;
  }
}

export async function cancelTimerNotification(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {
    console.warn('Failed to cancel timer notification', e);
  }
}
