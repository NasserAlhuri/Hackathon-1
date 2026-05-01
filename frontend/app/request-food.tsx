import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '../src/components/Screen';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING } from '../src/constants/theme';
import { QATAR_LOCATIONS } from '../src/data/mockData';

type Urg = 'high' | 'mid' | 'low';

export default function RequestFood() {
  const router = useRouter();
  const { t, lang, isRTL } = useApp();
  const [familySize, setFamilySize] = useState('4');
  const [urgency, setUrgency] = useState<Urg>('mid');
  const [locationId, setLocationId] = useState(QATAR_LOCATIONS[0].id);
  const [notes, setNotes] = useState('');

  const urgs: { id: Urg; key: Parameters<typeof t>[0]; color: string }[] = [
    { id: 'high', key: 'urgencyHigh', color: COLORS.error },
    { id: 'mid', key: 'urgencyMid', color: COLORS.warning },
    { id: 'low', key: 'urgencyLow', color: COLORS.accent },
  ];

  const submit = () => {
    Alert.alert(t('requestSubmitted'), t('success_thanks'), [
      { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
    ]);
  };

  return (
    <Screen testID="request-food-screen">
      <Header title={t('requestFood')} />
      <Text style={[styles.description, isRTL && styles.rtl]}>{t('yourNeed')}</Text>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('familySize')}</Text>
        <TextInput
          testID="family-size-input"
          keyboardType="numeric"
          value={familySize}
          onChangeText={setFamilySize}
          style={[styles.input, isRTL && styles.rtl]}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('urgency')}</Text>
        <View style={styles.chipRow}>
          {urgs.map((u) => {
            const active = urgency === u.id;
            return (
              <TouchableOpacity
                key={u.id}
                testID={`urgency-${u.id}`}
                onPress={() => setUrgency(u.id)}
                style={[styles.chip, active && { backgroundColor: u.color, borderColor: u.color }]}
              >
                <Text style={[styles.chipTxt, active && { color: '#fff', fontWeight: '700' }]}>{t(u.key)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('pickupLocation')}</Text>
        <View style={styles.chipRow}>
          {QATAR_LOCATIONS.slice(0, 6).map((l) => {
            const active = locationId === l.id;
            return (
              <TouchableOpacity
                key={l.id}
                onPress={() => setLocationId(l.id)}
                style={[styles.chip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
              >
                <Text style={[styles.chipTxt, active && { color: '#fff' }]}>{lang === 'en' ? l.en : l.ar}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>Notes <Text style={styles.optional}>({t('optional')})</Text></Text>
        <TextInput
          testID="request-notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }, isRTL && styles.rtl]}
          placeholder="Dietary restrictions, preferences..."
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      <Button testID="submit-request-btn" label={t('submitRequest')} onPress={submit} style={{ marginTop: SPACING.md, marginBottom: SPACING.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  description: { fontSize: FONT.size.md, color: COLORS.textSecondary, marginBottom: SPACING.md },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  section: { marginBottom: SPACING.lg },
  label: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, marginBottom: 8 },
  optional: { color: COLORS.textMuted, fontWeight: '400' },
  input: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: FONT.size.md, color: COLORS.textPrimary,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.full,
  },
  chipTxt: { fontSize: FONT.size.sm, color: COLORS.textPrimary },
});
