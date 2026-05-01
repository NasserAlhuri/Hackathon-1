import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../src/components/Screen';
import Header from '../src/components/Header';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';
import { MOCK_NEARBY_RESTAURANTS } from '../src/data/mockData';

type Mode = 'all' | 'pickup' | 'byo' | 'delivery';

export default function FindFood() {
  const { t, lang, isRTL } = useApp();
  const [selected, setSelected] = useState<string>(MOCK_NEARBY_RESTAURANTS[0].id);
  const [filter, setFilter] = useState<Mode>('all');

  const filtered = MOCK_NEARBY_RESTAURANTS.filter((r) => {
    if (filter === 'pickup') return r.allowsPickup;
    if (filter === 'byo') return r.allowsBYO;
    if (filter === 'delivery') return r.allowsDelivery;
    return true;
  });

  const reserve = (r: any, mode: 'self' | 'byo' | 'delivery') => {
    const label = mode === 'self' ? t('selfPickup') : mode === 'byo' ? t('byoContainer') : t('delivery');
    Alert.alert(t('pickupReserved'), `${lang === 'ar' || lang === 'fa' ? r.name_ar : r.name_en}\n${label}`, [{ text: 'OK' }]);
  };

  return (
    <Screen testID="find-food-screen" scroll={false} padded={false}>
      <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg }}>
        <Header title={t('findFoodNearby')} />
      </View>

      {/* Mock map */}
      <View style={styles.mapWrap}>
        <View style={styles.mapBg}>
          <View style={[styles.road, { top: '30%', left: 0, right: 0 }]} />
          <View style={[styles.road, { top: '60%', left: 0, right: 0 }]} />
          <View style={[styles.roadV, { left: '40%', top: 0, bottom: 0 }]} />
          <View style={[styles.roadV, { left: '70%', top: 0, bottom: 0 }]} />
          <View style={styles.water} />
          <View style={[styles.youPin, { left: '45%', top: '50%' }]}>
            <View style={styles.youPulse} />
            <View style={styles.youDot} />
          </View>
          {MOCK_NEARBY_RESTAURANTS.map((r) => {
            const active = r.id === selected;
            return (
              <TouchableOpacity
                key={r.id}
                testID={`pin-${r.id}`}
                onPress={() => setSelected(r.id)}
                activeOpacity={0.85}
                style={[styles.pin, { left: `${r.x}%`, top: `${r.y}%` }, active && styles.pinActive]}
              >
                <Ionicons name="restaurant" size={active ? 18 : 14} color="#fff" />
              </TouchableOpacity>
            );
          })}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3A8FB7' }]} />
              <Text style={styles.legendTxt}>{t('you')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendTxt}>{t('restaurants')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {(['all', 'pickup', 'byo', 'delivery'] as const).map((f) => {
          const active = filter === f;
          const label = f === 'all' ? t('allFilter') : f === 'pickup' ? t('selfPickup') : f === 'byo' ? t('byoContainer') : t('delivery');
          return (
            <TouchableOpacity key={f} testID={`filter-${f}`} onPress={() => setFilter(f)} style={[styles.filterChip, active && styles.filterChipActive]}>
              <Text style={[styles.filterTxt, active && { color: '#fff' }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={[styles.sectionTitle, isRTL && styles.rtl, { paddingHorizontal: SPACING.lg }]}>{t('nearbyRestaurants')}</Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl }}>
        {filtered.map((r) => {
          const isOpen = r.openNow;
          const isSelected = selected === r.id;
          return (
            <View key={r.id} testID={`restaurant-${r.id}`} style={[styles.card, isSelected && { borderColor: COLORS.primary, borderWidth: 2 }]}>
              <View style={[styles.cardHead, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.iconBadge}>
                  <Ionicons name="restaurant-outline" size={18} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                  <Text style={[styles.title, isRTL && styles.rtl]} numberOfLines={1}>{lang === 'ar' || lang === 'fa' ? r.name_ar : r.name_en}</Text>
                  <Text style={[styles.sub, isRTL && styles.rtl]} numberOfLines={1}>{lang === 'ar' || lang === 'fa' ? r.cuisine_ar : r.cuisine_en}</Text>
                </View>
                <View style={[styles.openPill, { backgroundColor: (isOpen ? COLORS.accent : COLORS.error) + '1A' }]}>
                  <Text style={[styles.openTxt, { color: isOpen ? COLORS.accentDark : COLORS.error }]}>{isOpen ? t('openNow') : t('closingSoon')}</Text>
                </View>
              </View>
              <View style={[styles.metaRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.meta}><Ionicons name="location" size={13} color={COLORS.textMuted} /><Text style={styles.metaTxt}>{r.distanceKm} {t('distance')}</Text></View>
                <View style={styles.meta}><Ionicons name="restaurant" size={13} color={COLORS.textMuted} /><Text style={styles.metaTxt}>{r.mealsAvailable} {t('meals')}</Text></View>
              </View>
              <View style={[styles.btnRow, isRTL && { flexDirection: 'row-reverse' }]}>
                {r.allowsPickup && (
                  <TouchableOpacity testID={`pickup-${r.id}`} onPress={() => reserve(r, 'self')} style={[styles.btn, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="bag-handle-outline" size={14} color="#fff" />
                    <Text style={styles.btnTxt}>{t('selfPickup')}</Text>
                  </TouchableOpacity>
                )}
                {r.allowsBYO && (
                  <TouchableOpacity testID={`byo-${r.id}`} onPress={() => reserve(r, 'byo')} style={[styles.btn, { backgroundColor: COLORS.accent }]}>
                    <Ionicons name="leaf-outline" size={14} color="#fff" />
                    <Text style={styles.btnTxt}>{t('byoContainer')}</Text>
                  </TouchableOpacity>
                )}
                {r.allowsDelivery && (
                  <TouchableOpacity testID={`delivery-${r.id}`} onPress={() => reserve(r, 'delivery')} style={[styles.btn, { backgroundColor: COLORS.warning }]}>
                    <Ionicons name="car-outline" size={14} color="#fff" />
                    <Text style={styles.btnTxt}>{t('delivery')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapWrap: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  mapBg: { height: 240, borderRadius: RADIUS.xxl, overflow: 'hidden', backgroundColor: '#E5EFE6', position: 'relative', borderWidth: 1, borderColor: COLORS.border },
  road: { position: 'absolute', height: 6, backgroundColor: '#FAF9F6', opacity: 0.8 },
  roadV: { position: 'absolute', width: 6, backgroundColor: '#FAF9F6', opacity: 0.8 },
  water: { position: 'absolute', right: -20, top: -20, width: 120, height: 100, borderRadius: 60, backgroundColor: '#B8DCE5', opacity: 0.5 },
  youPin: { position: 'absolute', alignItems: 'center', justifyContent: 'center', marginLeft: -14, marginTop: -14 },
  youPulse: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: '#3A8FB7', opacity: 0.25 },
  youDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#3A8FB7', borderWidth: 2, borderColor: '#fff' },
  pin: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginLeft: -14, marginTop: -28, borderWidth: 2, borderColor: '#fff' },
  pinActive: { width: 38, height: 38, borderRadius: 19, marginLeft: -19, marginTop: -38, backgroundColor: COLORS.primaryDark },
  legend: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: RADIUS.md, padding: 8, gap: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendTxt: { fontSize: 10, color: COLORS.textPrimary, fontWeight: '600' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTxt: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary },
  sectionTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm },
  cardHead: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  sub: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
  openPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  openTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  metaRow: { flexDirection: 'row', gap: 14, marginTop: SPACING.sm },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginStart: 4 },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SPACING.md },
  btn: { flexGrow: 1, flexBasis: 0, minWidth: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 8, borderRadius: RADIUS.full },
  btnTxt: { color: '#fff', fontWeight: FONT.weight.bold, fontSize: 11, marginStart: 4 },
});
