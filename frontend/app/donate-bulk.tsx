import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Screen from '../src/components/Screen';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING } from '../src/constants/theme';
import { QATAR_LOCATIONS, MOCK_NGOS, suggestVehicle } from '../src/data/mockData';

export default function DonateBulk() {
  const router = useRouter();
  const params = useLocalSearchParams<{ meals?: string }>();
  const { t, lang, isRTL } = useApp();

  const [eventType, setEventType] = useState<string>('wedding');
  const [meals, setMeals] = useState(params.meals || '150');
  const [locationId, setLocationId] = useState(QATAR_LOCATIONS[0].id);
  const [pickupTime, setPickupTime] = useState('19:00');
  const [packagingReady, setPackagingReady] = useState(true);

  const mealsNum = parseInt(meals || '0', 10);
  const vehicle = suggestVehicle(mealsNum);
  const assignedNgo = MOCK_NGOS[Math.abs((mealsNum + eventType.length) % MOCK_NGOS.length)];

  const events: { id: string; key: Parameters<typeof t>[0]; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'wedding', key: 'eventWedding', icon: 'heart-circle-outline' },
    { id: 'graduation', key: 'eventGraduation', icon: 'school-outline' },
    { id: 'restaurant', key: 'eventRestaurant', icon: 'restaurant-outline' },
    { id: 'hotel', key: 'eventHotel', icon: 'bed-outline' },
    { id: 'catering', key: 'eventCatering', icon: 'fast-food-outline' },
  ];

  const submit = () => {
    Alert.alert(
      t('donationSubmitted'),
      `${t('vehicleMatched')}: ${t(vehicle)}\nNGO: ${lang === 'en' ? assignedNgo.en : assignedNgo.ar}`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
    );
  };

  return (
    <Screen testID="donate-bulk-screen">
      <Header title={t('bulkDonation')} />
      <Text style={[styles.description, isRTL && styles.rtl]}>{t('bulkDesc')}</Text>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('eventType')}</Text>
        <View style={styles.chipRow}>
          {events.map((e) => {
            const active = eventType === e.id;
            return (
              <TouchableOpacity
                key={e.id}
                testID={`event-${e.id}`}
                onPress={() => setEventType(e.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Ionicons name={e.icon} size={16} color={active ? '#fff' : COLORS.textPrimary} />
                <Text style={[styles.chipTxt, active && { color: '#fff' }]}>{t(e.key)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('mealCount')}</Text>
        <TextInput
          testID="bulk-meals-input"
          keyboardType="numeric"
          value={meals}
          onChangeText={setMeals}
          style={[styles.input, isRTL && styles.rtl]}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('pickupTime')}</Text>
        <TextInput
          testID="bulk-pickup-time"
          value={pickupTime}
          onChangeText={setPickupTime}
          style={[styles.input, isRTL && styles.rtl]}
          placeholder="19:00"
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('pickupLocation')}</Text>
        <View style={styles.chipRow}>
          {QATAR_LOCATIONS.slice(0, 6).map((l) => {
            const active = locationId === l.id;
            return (
              <TouchableOpacity key={l.id} onPress={() => setLocationId(l.id)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipTxt, active && { color: '#fff' }]}>{lang === 'en' ? l.en : l.ar}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        testID="bulk-packaging-toggle"
        style={[styles.rowCard, isRTL && { flexDirection: 'row-reverse' }]}
        onPress={() => setPackagingReady(!packagingReady)}
      >
        <Ionicons name={packagingReady ? 'checkbox' : 'square-outline'} size={22} color={COLORS.primary} />
        <Text style={[styles.rowCardTxt, isRTL && styles.rtl]}>{t('packagingReady')}</Text>
      </TouchableOpacity>

      {/* Smart recommendations */}
      <View style={styles.recommendCard}>
        <View style={[styles.recRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="car-outline" size={18} color={COLORS.accentDark} />
          <Text style={styles.recLabel}>{t('vehicleSuggested')}</Text>
          <Text style={styles.recVal}>{t(vehicle)}</Text>
        </View>
        <View style={[styles.recRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="heart-outline" size={18} color={COLORS.accentDark} />
          <Text style={styles.recLabel}>{t('assigned')} NGO</Text>
          <Text style={styles.recVal}>{lang === 'en' ? assignedNgo.en : assignedNgo.ar}</Text>
        </View>
      </View>

      <Button
        testID="bulk-submit-btn"
        label={t('submitDonation')}
        onPress={submit}
        style={{ marginTop: SPACING.md, marginBottom: SPACING.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  description: { fontSize: FONT.size.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  section: { marginBottom: SPACING.lg },
  label: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: FONT.size.md, color: COLORS.textPrimary,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.full,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipTxt: { fontSize: FONT.size.sm, color: COLORS.textPrimary, marginStart: 4 },
  rowCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  rowCardTxt: { fontSize: FONT.size.md, color: COLORS.textPrimary, marginStart: 8 },
  recommendCard: {
    backgroundColor: COLORS.accent + '15', borderRadius: RADIUS.xl, padding: SPACING.md,
    marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.accent + '40',
  },
  recRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  recLabel: { flex: 1, fontSize: FONT.size.sm, color: COLORS.textSecondary, marginStart: 8 },
  recVal: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.accentDark },
});
