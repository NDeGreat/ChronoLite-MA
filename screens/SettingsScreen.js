import React from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import DurationPicker from '../components/DurationPicker';
import QuickDurationsEditor from '../components/QuickDurationsEditor';
import SoundPicker from '../components/SoundPicker';
import { useSettingsStore } from '../store/settingsStore';
import { getTheme } from '../utils/theme';

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const theme = getTheme(settings.theme);

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <ScreenHeader title="Settings" theme={theme} />

      <Card theme={theme} style={styles.card}>
        <Text style={[styles.section, { color: theme.subtext }]}>Default Timer Duration</Text>
        <DurationPicker
          minutes={settings.defaultMinutes}
          seconds={settings.defaultSeconds}
          onChange={(m, s) => settings.setDefaultDuration(m, s)}
          theme={theme}
        />
      </Card>

      <Card theme={theme} style={styles.card}>
        <Text style={[styles.section, { color: theme.subtext, marginBottom: 12 }]}>Quick Timer Options</Text>
        <QuickDurationsEditor
          presets={settings.quickDurations}
          onAdd={settings.addQuickDuration}
          onRemove={settings.removeQuickDuration}
          theme={theme}
        />
      </Card>

      <Card theme={theme} style={styles.card}>
        <Row label="Sound" theme={theme} isLast={false}>
          <Switch
            value={settings.soundEnabled}
            onValueChange={settings.toggleSound}
            trackColor={{ true: theme.primary, false: theme.border }}
            thumbColor="#ffffff"
          />
        </Row>
        {settings.soundEnabled && (
          <View style={[styles.soundPickerRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.section, { color: theme.subtext, marginBottom: 10 }]}>Alert Sound</Text>
            <SoundPicker value={settings.soundChoice} onChange={settings.setSoundChoice} theme={theme} />
          </View>
        )}
        <Row label="Dark Theme" theme={theme} isLast>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={settings.toggleTheme}
            // Fixed colors on purpose: this switch's own toggle changes `theme`,
            // so tying its track color to theme.primary/border made it redraw with new colors mid-animation,
            // causing a visible glitch. A constant color avoids that self-referential redraw.
            trackColor={{ true: '#2f6fed', false: '#94a3b8' }}
            thumbColor="#ffffff"
          />
        </Row>
      </Card>
    </ScrollView>
  );
}

function Row({ label, theme, children, isLast }) {
  return (
    <View style={[styles.row, !isLast && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },
  card: { marginBottom: 20 },
  section: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  soundPickerRow: { paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { fontSize: 16, fontWeight: '500' },
});
