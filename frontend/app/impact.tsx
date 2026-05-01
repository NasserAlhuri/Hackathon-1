import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import QatariPattern from '../src/components/QatariPattern';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';
import { MOCK_IMPACT, WEEKLY_SUMMARY, ENV_EQUIVALENTS } from '../src/data/mockData';

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

  const SHEET_HEIGHT = SCREEN_H * 0.85;
  const maxWeek = Math.max(...MOCK_IMPACT.weeklyTrend);
  const maxPeak = Math.max(...MOCK_IMPACT.peakHours.map((p) => p.value));
  const days = lang === 'ar' || lang === 'fa' || lang === 'ur' ? ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const co2Tons = Math.round(MOCK_IMPACT.co2AvoidedKg / 1000);
  const peopleFed = Math.round(MOCK_IMPACT.mealsRescued / 3);
  const waterM = (MOCK_IMPACT.waterSavedLiters / 1_000_000).toFixed(1);

  // 8 stats in 2 rows of 4
  const stats = [
    { key: 'meals', label: t('mealsRescued'), value: MOCK_IMPACT.mealsRescued.toLocaleString(), color: COLORS.primary, emoji: '🍽️' },
    { key: 'waste', label: t('wasteReduced'), value: `${(MOCK_IMPACT.wasteReducedKg / 1000).toFixed(1)}t`, color: COLORS.accent, emoji: '🌿' },
    { key: 'co2', label: t('co2Avoided'), value: `${co2Tons}t`, color: '#3A8FB7', emoji: '☁️' },
    { key: 'vol', label: t('activeVolunteers'), value: `${MOCK_IMPACT.activeVolunteers}`, color: COLORS.warning, emoji: '👥' },
    { key: 'water', label: t('waterSaved'), value: `${waterM}M L`, color: '#2196F3', emoji: '💧' },
    { key: 'del', label: t('completedDeliveries'), value: MOCK_IMPACT.completedDeliveries.toLocaleString(), color: COLORS.accentDark, emoji: '🚚' },
    { key: 'areas', label: t('areasServed'), value: `${MOCK_IMPACT.areasServed}`, color: COLORS.primaryLight, emoji: '📍' },
    { key: 'resp', label: t('avgResponseTime'), value: `${MOCK_IMPACT.avgResponseMinutes} min`, color: COLORS.warning, emoji: '⚡' },
  ];

  const maxAreaMeals = Math.max(...MOCK_IMPACT.topAreas.map((a) => a.meals));
  const maxNgoMeals = Math.max(...MOCK_IMPACT.topNgos.map((n) => n.meals));

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
            <QatariPattern color="#fff" opacity={0.08} size={42} />
            <View style={styles.heroBlob1} />
            <View style={styles.heroBlob2} />
            <View style={styles.heroBadge}>
              <View style={styles.heroDot} />
              <Text style={styles.heroBadgeTxt}>LIVE • QATAR</Text>
            </View>
            <Text style={styles.heroLabel}>{t('mealsRescued')}</Text>
            <Text style={styles.heroValue}>{MOCK_IMPACT.mealsRescued.toLocaleString()}</Text>
            <View style={styles.heroDivider} />
            <View style={styles.heroPeopleRow}>
              <Text style={styles.heroBigEmoji}>🌟</Text>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.heroPeopleNum}>{peopleFed.toLocaleString()}</Text>
                <Text style={styles.heroPeopleLabel}>{t('peopleFed')}</Text>
              </View>
            </View>
          </View>

          {/* 8 stat cards (2x4 grid) */}
          <View style={styles.grid}>
            {stats.map((s) => (
              <View key={s.key} testID={`impact-stat-${s.key}`} style={[styles.statCard, { borderLeftWidth: 3, borderLeftColor: s.color }]}>
                <Text style={styles.statEmoji}>{s.emoji}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel} numberOfLines={2}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Weekly chart */}
          <View style={styles.chartCard}>
            <View style={[styles.chartHead, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.cardTitle, isRTL && styles.rtl]}>{t('weeklySummary')}</Text>
              <View style={styles.todayPill}>
                <Text style={styles.todayPillTxt}>+{WEEKLY_SUMMARY.changePct}%</Text>
              </View>
            </View>
            <View style={styles.weekSummary}>
              <View style={styles.weekStat}>
                <Text style={styles.weekStatVal}>{WEEKLY_SUMMARY.totalThisWeek.toLocaleString()}</Text>
                <Text style={styles.weekStatLabel}>{t('totalThisWeek')}</Text>
              </View>
              <View style={styles.weekDivider} />
              <View style={styles.weekStat}>
                <Text style={styles.weekStatVal}>{WEEKLY_SUMMARY.bestDayValue}</Text>
                <Text style={styles.weekStatLabel}>
                  {t('bestDay')} · {lang === 'ar' ? WEEKLY_SUMMARY.bestDayLabel_ar : lang === 'fa' ? WEEKLY_SUMMARY.bestDayLabel_fa : WEEKLY_SUMMARY.bestDayLabel_en}
                </Text>
              </View>
              <View style={styles.weekDivider} />
              <View style={styles.weekStat}>
                <Text style={styles.weekStatVal}>{WEEKLY_SUMMARY.avgPerDay}</Text>
                <Text style={styles.weekStatLabel}>{t('avgPerDay')}</Text>
              </View>
            </View>
            <View style={styles.barRow}>
              {MOCK_IMPACT.weeklyTrend.map((v, i) => {
                const h = (v / maxWeek) * 120;
                const isToday = i === 6;
                return (
                  <View key={i} style={styles.barCol}>
                    {isToday && <Text style={styles.barVal}>{v}</Text>}
                    <View style={[styles.bar, { height: h, backgroundColor: isToday ? COLORS.primary : COLORS.accent + '99' }]} />
                    <Text style={[styles.barDay, isToday && { color: COLORS.primary, fontWeight: '800' }]}>{days[i]}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Top Areas */}
          <View style={styles.chartCard}>
            <Text style={[styles.cardTitle, isRTL && styles.rtl]}>{t('topAreas')}</Text>
            {MOCK_IMPACT.topAreas.map((area) => {
              const name = lang === 'ar' || lang === 'fa' || lang === 'ur' ? area.ar : area.en;
              const fillPct = (area.meals / maxAreaMeals) * 100;
              return (
                <View key={area.id} style={styles.areaRow}>
                  <Text style={[styles.areaName, isRTL && styles.rtl]} numberOfLines={1}>{name}</Text>
                  <View style={styles.areaBarWrap}>
                    <View style={[styles.areaBar, { width: `${fillPct}%`, backgroundColor: COLORS.primary }]} />
                  </View>
                  <Text style={styles.areaMeals}>{area.meals.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>

          {/* Top NGOs */}
          <View style={styles.chartCard}>
            <Text style={[styles.cardTitle, isRTL && styles.rtl]}>{t('topNgos')}</Text>
            {MOCK_IMPACT.topNgos.map((ngo, i) => {
              const name = lang === 'ar' || lang === 'fa' || lang === 'ur' ? ngo.ar : ngo.en;
              const fillPct = (ngo.meals / maxNgoMeals) * 100;
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
              return (
                <View key={ngo.id} style={[styles.ngoRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.ngoMedal}>{medal}</Text>
                  <View style={{ flex: 1, marginHorizontal: 8 }}>
                    <Text style={[styles.ngoName, isRTL && styles.rtl]} numberOfLines={1}>{name}</Text>
                    <View style={styles.ngoBarWrap}>
                      <View style={[styles.ngoBar, { width: `${fillPct}%`, backgroundColor: COLORS.accent }]} />
                    </View>
                  </View>
                  <Text style={styles.ngoMeals}>{ngo.meals.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>

          {/* Food Categories */}
          <View style={styles.chartCard}>
            <Text style={[styles.cardTitle, isRTL && styles.rtl]}>{t('foodCategories')}</Text>
            <View style={styles.stackedBar}>
              {MOCK_IMPACT.foodCategories.map((cat, i) => (
                <View key={i} style={[styles.stackSeg, { flex: cat.share, backgroundColor: cat.color }]} />
              ))}
            </View>
            <View style={styles.legendGrid}>
              {MOCK_IMPACT.foodCategories.map((cat, i) => {
                const name = lang === 'ar' || lang === 'fa' || lang === 'ur' ? cat.ar : cat.en;
                return (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.legendName} numberOfLines={1}>{name}</Text>
                    <Text style={styles.legendVal}>{cat.share}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Peak Hours */}
          <View style={styles.chartCard}>
            <Text style={[styles.cardTitle, isRTL && styles.rtl]}>{t('peakHours')}</Text>
            <View style={styles.peakRow}>
              {MOCK_IMPACT.peakHours.map((p, i) => {
                const h = (p.value / maxPeak) * 80;
                const isPeak = p.value === maxPeak;
                return (
                  <View key={i} style={styles.peakCol}>
                    <View style={[styles.peakBar, { height: h, backgroundColor: isPeak ? COLORS.primary : COLORS.primary + '55' }]} />
                    <Text style={[styles.peakLabel, isPeak && { color: COLORS.primary, fontWeight: '800' }]}>{p.hour}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Environmental equivalents */}
          <View style={styles.chartCard}>
            <Text style={[styles.cardTitle, isRTL && styles.rtl]}>{t('envImpact')}</Text>
            <Text style={[styles.envSub, isRTL && styles.rtl]}>{t('envImpactSub')}</Text>
            <View style={styles.envGrid}>
              {ENV_EQUIVALENTS.map((e, i) => {
                const label = lang === 'ar' ? e.label_ar : lang === 'fa' ? e.label_fa : e.label_en;
                return (
                  <View key={i} style={styles.envCard}>
                    <Text style={styles.envEmoji}>{e.icon}</Text>
                    <Text style={styles.envValue}>{e.value.toLocaleString()}</Text>
                    <Text style={styles.envLabel} numberOfLines={2}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.footnote}>🇶🇦 {t('togetherWeRescue')}</Text>
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
  rtl: { textAlign: 'right', writingDirection: 'rtl' },

  // Hero
  heroCard: { backgroundColor: COLORS.primary, borderRadius: 28, padding: SPACING.lg, marginBottom: SPACING.lg, overflow: 'hidden', position: 'relative', ...SHADOW.md },
  heroBlob1: { position: 'absolute', width: 240, height: 240, borderRadius: 240, backgroundColor: COLORS.primaryLight, opacity: 0.4, top: -100, right: -80 },
  heroBlob2: { position: 'absolute', width: 160, height: 160, borderRadius: 160, backgroundColor: COLORS.accent, opacity: 0.25, bottom: -60, left: -40 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  heroDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5DEE9C', marginRight: 6 },
  heroBadgeTxt: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  heroLabel: { color: '#fff', opacity: 0.85, fontSize: FONT.size.sm, marginTop: SPACING.md, letterSpacing: 0.5 },
  heroValue: { color: '#fff', fontSize: 64, fontWeight: FONT.weight.extrabold, marginTop: 4, letterSpacing: -2.5, lineHeight: 70 },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: SPACING.md },
  heroPeopleRow: { flexDirection: 'row', alignItems: 'center' },
  heroBigEmoji: { fontSize: 32 },
  heroPeopleNum: { color: '#fff', fontSize: FONT.size.xl, fontWeight: '800' },
  heroPeopleLabel: { color: '#fff', opacity: 0.85, fontSize: FONT.size.xs, marginTop: 2 },

  // 8 stat cards (2x4 grid)
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: SPACING.lg },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm, borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, letterSpacing: -0.5 },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2, lineHeight: 14 },

  // Chart card shared
  chartCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  chartHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg },
  cardTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  todayPill: { backgroundColor: COLORS.accent + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  todayPillTxt: { color: COLORS.accentDark, fontSize: FONT.size.xs, fontWeight: '800' },

  // Weekly summary
  weekSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.lg, paddingVertical: SPACING.md, marginBottom: SPACING.lg },
  weekStat: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  weekStatVal: { fontSize: FONT.size.lg, fontWeight: FONT.weight.extrabold, color: COLORS.primary },
  weekStatLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  weekDivider: { width: 1, height: 32, backgroundColor: COLORS.border },

  // Bar chart
  barRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 },
  barCol: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  bar: { width: 26, borderRadius: 10, marginBottom: 6 },
  barVal: { fontSize: FONT.size.xs, color: COLORS.primary, fontWeight: '800', marginBottom: 4 },
  barDay: { fontSize: FONT.size.xs, color: COLORS.textSecondary, fontWeight: '600' },

  // Top Areas
  areaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  areaName: { width: 80, fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary },
  areaBarWrap: { flex: 1, height: 10, backgroundColor: COLORS.surfaceAlt, borderRadius: 5, overflow: 'hidden', marginHorizontal: 8 },
  areaBar: { height: '100%', borderRadius: 5 },
  areaMeals: { width: 54, fontSize: FONT.size.xs, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'right' },

  // Top NGOs
  ngoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ngoMedal: { fontSize: 18, width: 28 },
  ngoName: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginBottom: 4 },
  ngoBarWrap: { height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  ngoBar: { height: '100%', borderRadius: 4 },
  ngoMeals: { fontSize: FONT.size.xs, fontWeight: '800', color: COLORS.accentDark, width: 50, textAlign: 'right' },

  // Food categories stacked bar
  stackedBar: { flexDirection: 'row', height: 24, borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.md },
  stackSeg: { height: '100%' },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  legendItem: { width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { flex: 1, fontSize: FONT.size.xs, color: COLORS.textPrimary },
  legendVal: { fontSize: FONT.size.xs, fontWeight: '800', color: COLORS.textSecondary, marginEnd: 4 },

  // Peak hours
  peakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  peakCol: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  peakBar: { width: 22, borderRadius: 8, marginBottom: 6 },
  peakLabel: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600' },

  // Environmental
  envSub: { fontSize: FONT.size.sm, color: COLORS.textMuted, marginTop: -SPACING.sm, marginBottom: SPACING.md },
  envGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  envCard: { width: '48%', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center' },
  envEmoji: { fontSize: 28, marginBottom: 4 },
  envValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, letterSpacing: -0.5 },
  envLabel: { fontSize: FONT.size.xs, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4, lineHeight: 16 },

  footnote: { textAlign: 'center', fontSize: FONT.size.sm, color: COLORS.textSecondary, marginTop: SPACING.lg, fontWeight: '600' },
});
