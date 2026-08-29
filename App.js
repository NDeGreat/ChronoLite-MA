import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { setAudioModeAsync } from 'expo-audio';

import TimerScreen from './screens/TimerScreen';
import StopwatchScreen from './screens/StopwatchScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useSettingsStore } from './store/settingsStore';
import { getTheme } from './utils/theme';
import { ensureNotificationSetup } from './utils/notifications';

const Tab = createBottomTabNavigator();

const ICONS = {
  Timer: 'timer-outline',
  Stopwatch: 'stopwatch-outline',
  Settings: 'settings-outline',
};

export default function App() {
  const settings = useSettingsStore();

  // Load persisted settings (including theme) once before rendering the app.
  useEffect(() => {
    settings.hydrate();
    ensureNotificationSetup();
    // Let the timer's alert sound play even if the device is muted/on silent.
    setAudioModeAsync({ playsInSilentMode: true }).catch((e) => console.warn('Failed to set audio mode', e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!settings.hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const theme = getTheme(settings.theme);
  const baseNavTheme = settings.theme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseNavTheme,
    colors: {
      ...baseNavTheme.colors,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.subtext,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            height: 64,
            paddingTop: 8,
            paddingBottom: 10,
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        })}
      >
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Stopwatch" component={StopwatchScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
