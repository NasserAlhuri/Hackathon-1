import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Screen from '../src/components/Screen';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';
import { QATAR_LOCATIONS, computeSafety } from '../src/data/mockData';

type Storage = 'hot' | 'cold' | 'room';

export default function DonateQuick() {
  const router = useRouter();
  const { t, lang, isRTL } = useApp();
  const [photo, setPhoto] = useState<string | null>(null);
  const [meals, setMeals] = useState('10');
  const [hoursAgo, setHoursAgo] = useState('1');
  const [storage, setStorage] = useState<Storage>('hot');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [locationId, setLocationId] = useState<string>(QATAR_LOCATIONS[0].id);

  const mealsNum = parseInt(meals || '0', 10);
  const autoSwitchToBulk = mealsNum >= 50;

  const pickImage = async (fromCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = { quality: 0.5, mediaTypes: 'images' as any, base64: false };
    try {
      if (fromCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) return Alert.alert('Permission', 'Camera permission is required');
        const res = await ImagePicker.launchCameraAsync(options);
        if (!res.canceled && res.assets[0]) setPhoto(res.assets[0].uri);
      } else {
        const res = await ImagePicker.launchImageLibraryAsync(options);
        if (!res.canceled && res.assets[0]) setPhoto(res.assets[0].uri);
      }
    } catch (e) {
      // Graceful fallback for web/unavailable picker
      setPhoto('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400');
    }
  };

  const toggleAllergen = (a: string) => {
    setAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const submit = () => {
    if (autoSwitchToBulk) {
      router.replace({ pathname: '/donate-bulk', params: { meals } });
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

  const allergenOpts: { id: string; key: Parameters<typeof t>[0] }[] = [
    { id: 'nuts', key: 'allergenNuts' },
    { id: 'dairy', key: 'allergenDairy' },
    { id: 'gluten', key: 'allergenGluten' },
    { id: 'seafood', key: 'allergenSeafood' },
  ];

  const storageOpts: { id: Storage; key: Parameters<typeof t>[0]; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'hot', key: 'storageHot', icon: 'flame-outline' },
    { id: 'cold', key: 'storageCold', icon: 'snow-outline' },
    { id: 'room', key: 'storageRoom', icon: 'thermometer-outline' },
  ];

  return (
    <Screen testID="donate-quick-screen">
      <Header title={t('quickDonation')} />

      <Text style={[styles.description, isRTL && styles.rtl]}>{t('quickDesc')}</Text>

      {/* Photo upload */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('uploadPhoto')}</Text>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera-outline" size={36} color={COLORS.textMuted} />
            <Text style={styles.photoTxt}>{t('photoAdded').replace('added', '')}</Text>
          </View>
        )}
        <View style={[styles.photoBtns, isRTL && { flexDirection: 'row-reverse' }]}>
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
          placeholder="10"
          placeholderTextColor={COLORS.textMuted}
        />
        {autoSwitchToBulk && (
          <View style={styles.switchNotice}>
            <Ionicons name="information-circle" size={16} color={COLORS.warning} />
            <Text style={styles.switchNoticeTxt}>{t('switchNoticeBulk')}</Text>
          </View>
        )}
      </View>

      {/* Preparation time */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('preparedAt')}</Text>
        <TextInput
          testID="input-prep-hours"
          keyboardType="numeric"
          value={hoursAgo}
          onChangeText={setHoursAgo}
          style={[styles.input, isRTL && styles.rtl]}
          placeholder="1"
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Storage */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('storage')}</Text>
        <View style={styles.chipRow}>
          {storageOpts.map((s) => {
            const active = storage === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                testID={`storage-${s.id}`}
                onPress={() => setStorage(s.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Ionicons name={s.icon} size={16} color={active ? '#fff' : COLORS.textPrimary} />
                <Text style={[styles.chipTxt, active && { color: '#fff' }]}>{t(s.key)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Allergens */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('allergens')} <Text style={styles.optional}>({t('optional')})</Text></Text>
        <View style={styles.chipRow}>
          {allergenOpts.map((a) => {
            const active = allergens.includes(a.id);
            return (
              <TouchableOpacity
                key={a.id}
                testID={`allergen-${a.id}`}
                onPress={() => toggleAllergen(a.id)}
                style={[styles.chip, active && styles.chipActiveSoft]}
              >
                <Text style={[styles.chipTxt, active && { color: COLORS.accentDark }]}>{t(a.key)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={[styles.label, isRTL && styles.rtl]}>{t('pickupLocation')}</Text>
        <View style={styles.chipRow}>
          {QATAR_LOCATIONS.map((l) => {
            const active = locationId === l.id;
            return (
              <TouchableOpacity
                key={l.id}
                testID={`location-${l.id}`}
                onPress={() => setLocationId(l.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
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
  description: { fontSize: FONT.size.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  section: { marginBottom: SPACING.lg },
  label: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, marginBottom: 8, letterSpacing: 0.3 },
  optional: { color: COLORS.textMuted, fontWeight: '400' },
  input: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: FONT.size.md, color: COLORS.textPrimary,
    borderWidth: 1, borderColor: COLORS.border,
  },
  photo: { width: '100%', height: 180, borderRadius: RADIUS.xl, marginBottom: SPACING.sm },
  photoPlaceholder: {
    width: '100%', height: 140, borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceAlt, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  photoTxt: { color: COLORS.textMuted, marginTop: 6, fontSize: FONT.size.sm },
  photoBtns: { flexDirection: 'row', gap: 8 },
  photoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary + '10', paddingVertical: 12, borderRadius: RADIUS.full, gap: 6,
  },
  photoBtnTxt: { color: COLORS.primary, fontWeight: FONT.weight.semibold, fontSize: FONT.size.sm, marginStart: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.full,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipActiveSoft: { backgroundColor: COLORS.accent + '22', borderColor: COLORS.accent },
  chipTxt: { fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: COLORS.textPrimary, marginStart: 4 },
  switchNotice: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.warning + '20', padding: 10, borderRadius: RADIUS.md, marginTop: 10,
  },
  switchNoticeTxt: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, marginStart: 6 },
});
