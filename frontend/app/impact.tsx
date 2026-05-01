import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';
import { MOCK_IMPACT } from '../src/data/mockData';

const { height: SCREEN_H } = Dimensions.get('window');

export default function ImpactModal() {
  const { t, lang, isRTL } = useApp();
  const router = useRouter();
  const slideY = useRef(new Animated.Value(SCREEN_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const close = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: SCREEN_H, duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => router.back());
  };

  const maxWeek = Math.max(...MOCK_IMPACT.weeklyTrend);
  const maxMonth = Math.max(...MOCK_IMPACT.monthlyTrend);
  const maxHour = Math.max(...MOCK_IMPACT.peakHours.map((p) => p.value));
  const maxNgo = Math.max(...MOCK_IMPACT.topNgos.map((n) => n.meals));
  const days = lang === 'ar' ? ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const months = lang === 'ar'
    ? ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس']
    : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const SHEET_HEIGHT = SCREEN_H * 0.85;
  const co2Tons = Math.round(MOCK_IMPACT.co2AvoidedKg / 1000);
  const waterMillions = (MOCK_IMPACT.waterSavedLiters / 1_000_000).toFixed(1);

  const stats = [
    { key: 'meals', label: t('mealsRescued'), value: MOCK_IMPACT.mealsRescued.toLocaleString(), icon: 'restaurant-outline' as const, color: COLORS.primary },
    { key: 'waste', label: t('wasteReduced'), value: `${MOCK_IMPACT.wasteReducedKg.toLocaleString()} ${t('kg')}`, icon: 'leaf-outline' as const, color: COLORS.accent },
    { key: 'co2', label: t('co2Avoided'), value: `${co2Tons}t`, icon: 'cloud-outline' as const, color: COLORS.primaryDark },
    { key: 'water', label: t('waterSaved'), value: `${waterMillions}M L`, icon: 'water-outline' as const, color: '#3A8FB7' },
    { key: 'vol', label: t('activeVolunteers'), value: `${MOCK_IMPACT.activeVolunteers}`, icon: 'people-outline' as const, color: COLORS.accentDark },
    { key: 'del', label: t('completedDeliveries'), value: MOCK_IMPACT.completedDeliveries.toLocaleString(), icon: 'car-outline' as const, color: COLORS.warning },
    { key: 'areas', label: t('areasServed'), value: `${MOCK_IMPACT.areasServed}`, icon: 'location-outline' as const, color: COLORS.error },
    { key: 'time', label: t('avgResponseTime'), value: `${MOCK_IMPACT.avgResponseMinutes}m`, icon: 'time-outline' as const, color: '#7B6CA8' },
  ];

  return (
    <View style={styles.root} testID="impact-modal">
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={close} testID="impact-backdrop" />
      </Animated.View>

      <Animated.View style={[styles.sheet, { height: SHEET_HEIGHT, transform: [{ translateY: slideY }] }]}>
        <View style={styles.handle} />
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity testID="impact-back-btn" onPress={close} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color={COLORS.textPrimary} />
            <Text style={styles.backTxt}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('impactDashboard')}</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          {/* Hero */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>{t('mealsRescued')}</Text>
            <Text style={styles.heroValue}>{MOCK_IMPACT.mealsRescued.toLocaleString()}</Text>
            <Text style={styles.heroSubtitle}>
              {Math.round(MOCK_IMPACT.mealsRescued / 3).toLocaleString()} {t('peopleFed')}
            </Text>
          </View>

          {/* 8 stat cards */}
          <View style={styles.grid}>
            {stats.map((s) => (
              <View key={s.key} testID={`impact-stat-${s.key}`} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: s.color + '1A' }]}>
                  <Ionicons name={s.icon} size={18} color={s.color} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel} numberOfLines={2}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Weekly chart */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>{t('thisWeek')}</Text>
            <View style={styles.barRow}>
              {MOCK_IMPACT.weeklyTrend.map((v, i) => {
                const h = (v / maxWeek) * 130;
                return (
                  <View key={i} style={styles.barCol}>
                    <Text style={styles.barVal}>{v}</Text>
                    <View style={[styles.bar, { height: h, backgroundColor: i === 6 ? COLORS.primary : COLORS.accent }]} />
                    <Text style={styles.barDay}>{days[i]}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Monthly trend (line-style bar) */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>{t('monthlyTrend')}</Text>
            <View style={[styles.barRow, { height: 120 }]}>
              {MOCK_IMPACT.monthlyTrend.map((v, i) => {
                const h = (v / maxMonth) * 100;
                return (
                  <View key={i} style={[styles.barCol, { flex: 1 }]}>
                    <View style={[styles.barThin, { height: h }]} />
                    <Text style={styles.barDay}>{months[i]}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Top areas served */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>{t('topAreas')}</Text>
            {MOCK_IMPACT.topAreas.map((a) => (
              <View key={a.id} style={styles.rankRow}>
                <Text style={styles.rankName} numberOfLines={1}>{lang === 'ar' ? a.ar : a.en}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${a.share * 2.5}%`, backgroundColor: COLORS.primary }]} />
                </View>
                <Text style={styles.rankVal}>{a.meals.toLocaleString()}</Text>
              </View>
            ))}
          </View>

          {/* Top NGOs */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>{t('topNgos')}</Text>
            {MOCK_IMPACT.topNgos.map((n, i) => (
              <View key={n.id} style={styles.rankRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeTxt}>{i + 1}</Text>
                </View>
                <Text style={styles.rankName} numberOfLines={1}>{lang === 'ar' ? n.ar : n.en}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${(n.meals / maxNgo) * 100}%`, backgroundColor: COLORS.accent }]} />
                </View>
                <Text style={styles.rankVal}>{n.meals.toLocaleString()}</Text>
              </View>
            ))}
          </View>

          {/* Food categories */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>{t('foodCategories')}</Text>
            <View style={styles.stackedBar}>
              {MOCK_IMPACT.foodCategories.map((c, i) => (
                <View key={i} style={[styles.stackSeg, { flex: c.share, backgroundColor: c.color }]} />
              ))}
            </View>
            {MOCK_IMPACT.foodCategories.map((c, i) => (
              <View key={i} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                <Text style={styles.legendName}>{lang === 'ar' ? c.ar : c.en}</Text>
                <Text style={styles.legendVal}>{c.share}%</Text>
              </View>
            ))}
          </View>

          {/* Peak hours */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>{t('peakHours')}</Text>
            <View style={styles.barRow}>
              {MOCK_IMPACT.peakHours.map((p, i) => {
                const h = (p.value / maxHour) * 100;
                return (
                  <View key={i} style={styles.barCol}>
                    <View style={[styles.bar, { height: h, width: 14, backgroundColor: COLORS.warning }]} />
                    <Text style={[styles.barDay, { fontSize: 9 }]}>{p.hour}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.footnote}>
            {lang === 'ar' ? 'بيانات محدثة مباشرة من جمعيات قطر' : 'Data updated live from all NGOs in Qatar'}
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: COLORS.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', ...SHADOW.md },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, width: 80 },
  backTxt: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginStart: 4 },
  title: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, flex: 1, textAlign: 'center' },
  body: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  heroCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginBottom: SPACING.md, alignItems: 'center', overflow: 'hidden' },
  heroLabel: { color: '#fff', opacity: 0.85, fontSize: FONT.size.sm, letterSpacing: 0.5 },
  heroValue: { color: '#fff', fontSize: 56, fontWeight: FONT.weight.extrabold, marginTop: 4, letterSpacing: -2 },
  heroSubtitle: { color: '#fff', opacity: 0.95, fontSize: FONT.size.md, marginTop: 4, fontWeight: FONT.weight.semibold },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm },
  statIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: FONT.size.lg, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  chartCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm },
  cardTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barCol: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  bar: { width: 22, borderRadius: 8, marginBottom: 6 },
  barThin: { width: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginBottom: 6 },
  barVal: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600', marginBottom: 2 },
  barDay: { fontSize: FONT.size.xs, color: COLORS.textSecondary, fontWeight: '600' },

  rankRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  rankBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  rankBadgeTxt: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary },
  rankName: { width: 90, fontSize: FONT.size.xs, color: COLORS.textPrimary, fontWeight: '600' },
  barTrack: { flex: 1, height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  rankVal: { fontSize: FONT.size.xs, color: COLORS.textSecondary, fontWeight: '700', minWidth: 50, textAlign: 'right' },

  stackedBar: { flexDirection: 'row', height: 24, borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.md },
  stackSeg: { height: '100%' },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginEnd: 8 },
  legendName: { flex: 1, fontSize: FONT.size.sm, color: COLORS.textPrimary, marginStart: 8 },
  legendVal: { fontSize: FONT.size.sm, fontWeight: '700', color: COLORS.textSecondary },

  footnote: { textAlign: 'center', fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: SPACING.md, fontStyle: 'italic' },
});
