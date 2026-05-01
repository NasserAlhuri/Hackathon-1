import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Screen from '../src/components/Screen';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';
import { QATAR_LOCATIONS, MOCK_NGOS, computeSafety, suggestVehicle } from '../src/data/mockData';
import { ALLERGEN_ICONS } from '../src/constants/gamification';

type Storage = 'hot' | 'cold' | 'room';

export default function Donate() {
  const router = useRouter();
  const { t, lang, isRTL } = useApp();
  const [photo, setPhoto] = useState<string | null>(null);
  const [meals, setMeals] = useState('10');
  const [hoursAgo, setHoursAgo] = useState('1');
  const [storage, setStorage] = useState<Storage>('hot');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [locationId, setLocationId] = useState<string>(QATAR_LOCATIONS[0].id);
  const [eventType, setEventType] = useState<string>('wedding');
  const [pickupTime, setPickupTime] = useState('19:00');
  const [packagingReady, setPackagingReady] = useState(true);

  const mealsNum = parseInt(meals || '0', 10);
  const isBulk = mealsNum >= 50;

  const vehicle = useMemo(() => suggestVehicle(mealsNum), [mealsNum]);
  const assignedNgo = useMemo(() => MOCK_NGOS[Math.abs((mealsNum + (eventType?.length || 0)) % MOCK_NGOS.length)], [mealsNum, eventType]);

  const pickImage = async (fromCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = { quality: 0.5, mediaTypes: 'images' as any };
    try {
      if (fromCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) return Alert.alert('Permission', 'Camera permission required');
        const res = await ImagePicker.launchCameraAsync(options);
        if (!res.canceled && res.assets[0]) setPhoto(res.assets[0].uri);
      } else {
        const res = await ImagePicker.launchImageLibraryAsync(options);
        if (!res.canceled && res.assets[0]) setPhoto(res.assets[0].uri);
      }
    } catch {
      setPhoto('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400');
    }
  };

  const toggleAllergen = (a: string) =>
    setAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const submit = () => {
    if (isBulk) {
      Alert.alert(
        t('donationSubmitted'),
        `${t('vehicleSuggested')}: ${t(vehicle)}\n${t('assignedNgo')}: ${lang === 'en' ? assignedNgo.en : assignedNgo.ar}`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
      );
      return;
    }
    const safety = computeSafety(parseFloat(hoursAgo || '0'), storage);
    const loc = QATAR_LOCATIONS.find((l) => l.id === locationId)!;
    router.push({
      pathname: '/safety-result',
      params: {
        level: safety.level,
        window: String(safety.windowMinutes),
        meals: String(mealsNum),
        location: lang === 'en' ? loc.en : loc.ar,
      },
    });
  };

  const allergenOpts = ['gluten', 'dairy', 'nuts', 'seafood', 'eggs', 'soy'];
  const storageOpts: { id: Storage; key: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'hot', key: 'storageHot', icon: 'flame-outline' },
    { id: 'cold', key: 'storageCold', icon: 'snow-outline' },
    { id: 'room', key: 'storageRoom', icon: 'thermometer-outline' },
  ];
  const events = [
    { id: 'wedding', label: lang === 'en' ? 'Wedding' : 'عرس', icon: 'heart-circle-outline' as const },
    { id: 'graduation', label: lang === 'en' ? 'Graduation' : 'تخرج', icon: 'school-outline' as const },
    { id: 'restaurant', label: lang === 'en' ? 'Restaurant' : 'مطعم', icon: 'restaurant-outline' as const },
    { id: 'hotel', label: lang === 'en' ? 'Hotel' : 'فندق', icon: 'bed-outline' as const },
    { id: 'catering', label: lang === 'en' ? 'Catering' : 'تموين', icon: 'fast-food-outline' as const },
  ];

  return (
    <Screen testID="donate-screen">
      <Header title={t('donateTitle')} />

      {/* Mode badge — auto switches */}
      <View style={[styles.modeBadge, { backgroundColor: isBulk ? COLORS.primary + '12' : COLORS.accent + '12', borderColor: (isBulk ? COLORS.primary : COLORS.accent) + '40' }]}>
        <Ionicons name={isBulk ? 'business' : 'gift'} size={18} color={isBulk ? COLORS.primary : COLORS.accent} />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={[styles.modeTitle, { color: isBulk ? COLORS.primary : COLORS.accentDark }]}>
            {isBulk ? t('bulkModeBadge') : t('quickModeBadge')}
          </Text>
          <Text style={styles.modeNote}>{isBulk ? t('bulkModeNote') : t('quickModeNote')}</Text>
        </View>
      </View>

      {/* Photo */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('uploadPhoto')}</Text>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera-outline" size={36} color={COLORS.textMuted} />
          </View>
        )}
        <View style={styles.photoBtns}>
          <TouchableOpacity testID="photo-camera-btn" style={styles.photoBtn} onPress={() => pickImage(true)}>
            <Ionicons name="camera" size={18} color={COLORS.primary} />
            <Text style={styles.photoBtnTxt}>{t('takePhoto')}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="photo-gallery-btn" style={styles.photoBtn} onPress={() => pickImage(false)}>
            <Ionicons name="images" size={18} color={COLORS.primary} />
            <Text style={styles.photoBtnTxt}>{t('fromGallery')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Meal count */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('mealCount')}</Text>
        <TextInput
          testID="input-meals"
          keyboardType="numeric"
          value={meals}
          onChangeText={setMeals}
          style={[styles.input, isRTL && styles.rtl]}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* QUICK-only fields: prep time + storage + allergens */}
      {!isBulk && (
        <>
          <View style={styles.section}>
            <Text style={[styles.label, isRTL && styles.rtl]}>{t('preparedAt')}</Text>
            <TextInput
              testID="input-prep-hours"
              keyboardType="numeric"
              value={hoursAgo}
              onChangeText={setHoursAgo}
              style={[styles.input, isRTL && styles.rtl]}
            />
          </View>
          <View style={styles.section}>
            <Text style={[styles.label, isRTL && styles.rtl]}>{t('storage')}</Text>
            <View style={styles.chipRow}>
              {storageOpts.map((s) => {
                const active = storage === s.id;
                return (
                  <TouchableOpacity key={s.id} testID={`storage-${s.id}`} onPress={() => setStorage(s.id)} style={[styles.chip, active && styles.chipActive]}>
                    <Ionicons name={s.icon} size={16} color={active ? '#fff' : COLORS.textPrimary} />
                    <Text style={[styles.chipTxt, active && { color: '#fff' }]}>{t(s.key)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.label, isRTL && styles.rtl]}>{t('allergens')} <Text style={styles.optional}>({t('optional')})</Text></Text>
            <View style={styles.allergenGrid}>
              {allergenOpts.map((a) => {
                const active = allergens.includes(a);
                const info = ALLERGEN_ICONS[a];
                return (
                  <TouchableOpacity
                    key={a}
                    testID={`allergen-${a}`}
                    onPress={() => toggleAllergen(a)}
                    style={[styles.allergenChip, active && styles.allergenChipActive]}
                  >
                    <Text style={styles.allergenEmoji}>{info.emoji}</Text>
                    <Text style={[styles.allergenLabel, active && { color: COLORS.accentDark, fontWeight: '700' }]}>
                      {lang === 'ar' || lang === 'fa' ? info.ar : info.en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}

      {/* BULK-only fields: event type + pickup time + packaging */}
      {isBulk && (
        <>
          <View style={styles.section}>
            <Text style={[styles.label, isRTL && styles.rtl]}>{t('eventType')}</Text>
            <View style={styles.chipRow}>
              {events.map((e) => {
                const active = eventType === e.id;
                return (
                  <TouchableOpacity key={e.id} testID={`event-${e.id}`} onPress={() => setEventType(e.id)} style={[styles.chip, active && styles.chipActive]}>
                    <Ionicons name={e.icon} size={16} color={active ? '#fff' : COLORS.textPrimary} />
                    <Text style={[styles.chipTxt, active && { color: '#fff' }]}>{e.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.label, isRTL && styles.rtl]}>{t('pickupTime')}</Text>
            <TextInput
              testID="input-pickup-time"
              value={pickupTime}
              onChangeText={setPickupTime}
              style={[styles.input, isRTL && styles.rtl]}
              placeholder="19:00"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <TouchableOpacity testID="packaging-toggle" style={styles.rowCard} onPress={() => setPackagingReady(!packagingReady)}>
            <Ionicons name={packagingReady ? 'checkbox' : 'square-outline'} size={22} color={COLORS.primary} />
            <Text style={styles.rowCardTxt}>{t('packagingReady')}</Text>
          </TouchableOpacity>
          <View style={styles.recommendCard}>
            <View style={styles.recRow}>
              <Ionicons name="car-outline" size={18} color={COLORS.accentDark} />
              <Text style={styles.recLabel}>{t('vehicleSuggested')}</Text>
              <Text style={styles.recVal}>{t(vehicle)}</Text>
            </View>
            <View style={styles.recRow}>
              <Ionicons name="heart-outline" size={18} color={COLORS.accentDark} />
              <Text style={styles.recLabel}>{t('assignedNgo')}</Text>
              <Text style={styles.recVal}>{lang === 'en' ? assignedNgo.en : assignedNgo.ar}</Text>
            </View>
          </View>
        </>
      )}

      {/* Location */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('pickupLocation')}</Text>
        <View style={styles.chipRow}>
          {QATAR_LOCATIONS.slice(0, 7).map((l) => {
            const active = locationId === l.id;
            return (
              <TouchableOpacity key={l.id} testID={`location-${l.id}`} onPress={() => setLocationId(l.id)} style={[styles.chip, active && styles.chipActive]}>
                <Ionicons name="location" size={14} color={active ? '#fff' : COLORS.textMuted} />
                <Text style={[styles.chipTxt, active && { color: '#fff' }]}>{lang === 'en' ? l.en : l.ar}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Button testID="submit-donation-btn" label={t('submitDonation')} onPress={submit} style={{ marginTop: SPACING.md, marginBottom: SPACING.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  modeBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: SPACING.md, borderRadius: RADIUS.lg, marginBottom: SPACING.md },
  modeTitle: { fontSize: FONT.size.sm, fontWeight: '800', letterSpacing: 1 },
  modeNote: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: 2 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  section: { marginBottom: SPACING.lg },
  label: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, marginBottom: 8 },
  optional: { color: COLORS.textMuted, fontWeight: '400' },
  input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: 16, paddingVertical: 14, fontSize: FONT.size.md, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  photo: { width: '100%', height: 180, borderRadius: RADIUS.xl, marginBottom: SPACING.sm },
  photoPlaceholder: { width: '100%', height: 140, borderRadius: RADIUS.xl, backgroundColor: COLORS.surfaceAlt, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  photoBtns: { flexDirection: 'row', gap: 8 },
  photoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary + '10', paddingVertical: 12, borderRadius: RADIUS.full, gap: 6 },
  photoBtnTxt: { color: COLORS.primary, fontWeight: FONT.weight.semibold, fontSize: FONT.size.sm, marginStart: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.full },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipActiveSoft: { backgroundColor: COLORS.accent + '22', borderColor: COLORS.accent },
  chipTxt: { fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: COLORS.textPrimary, marginStart: 4 },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  rowCardTxt: { fontSize: FONT.size.md, color: COLORS.textPrimary, marginStart: 8 },
  recommendCard: { backgroundColor: COLORS.accent + '15', borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.accent + '40' },
  recRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  recLabel: { flex: 1, fontSize: FONT.size.sm, color: COLORS.textSecondary, marginStart: 8 },
  recVal: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.accentDark },
  allergenGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  allergenChip: {
    width: '31%', alignItems: 'center', paddingVertical: 14,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  allergenChipActive: { backgroundColor: COLORS.accent + '15', borderColor: COLORS.accent },
  allergenEmoji: { fontSize: 28, marginBottom: 4 },
  allergenLabel: { fontSize: FONT.size.xs, color: COLORS.textPrimary, fontWeight: '600' },
});
