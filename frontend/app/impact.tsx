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

  const maxVal = Math.max(...MOCK_IMPACT.weeklyTrend);
  const days = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];

  const stats = [
    { key: 'meals', label: t('mealsRescued'), value: MOCK_IMPACT.mealsRescued.toLocaleString(), icon: 'restaurant-outline' as const, color: COLORS.primary },
    { key: 'waste', label: t('wasteReduced'), value: `${MOCK_IMPACT.wasteReducedKg.toLocaleString()} ${t('kg')}`, icon: 'leaf-outline' as const, color: COLORS.accent },
    { key: 'vol', label: t('activeVolunteers'), value: `${MOCK_IMPACT.activeVolunteers}`, icon: 'people-outline' as const, color: COLORS.primaryDark },
    { key: 'del', label: t('completedDeliveries'), value: MOCK_IMPACT.completedDeliveries.toLocaleString(), icon: 'car-outline' as const, color: COLORS.accentDark },
    { key: 'areas', label: t('areasServed'), value: `${MOCK_IMPACT.areasServed}`, icon: 'location-outline' as const, color: COLORS.warning },
  ];

  const SHEET_HEIGHT = SCREEN_H * 0.85;

  return (
    <View style={styles.root} testID="impact-modal">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={close} testID="impact-backdrop" />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { height: SHEET_HEIGHT, transform: [{ translateY: slideY }] }]}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity testID="impact-back-btn" onPress={close} style={[styles.backBtn, isRTL && { flexDirection: 'row-reverse' }]} activeOpacity={0.7}>
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color={COLORS.textPrimary} />
            <Text style={styles.backTxt}>{t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('impactDashboard')}</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          {/* Hero number */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>{t('mealsRescued')}</Text>
            <Text style={styles.heroValue}>{MOCK_IMPACT.mealsRescued.toLocaleString()}</Text>
            <Text style={styles.heroSubtitle}>
              {Math.round(MOCK_IMPACT.mealsRescued / 3).toLocaleString()} {lang === 'en' ? 'people fed' : 'شخص أُطعم'}
            </Text>
          </View>

          {/* Weekly chart */}
          <View style={styles.chartCard}>
            <Text style={[styles.cardTitle, isRTL && styles.rtl]}>
              {lang === 'en' ? 'This Week' : 'هذا الأسبوع'}
            </Text>
            <View style={styles.barRow}>
              {MOCK_IMPACT.weeklyTrend.map((v, i) => {
                const h = (v / maxVal) * 130;
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

          {/* Stat grid */}
          <View style={styles.grid}>
            {stats.map((s) => (
              <View key={s.key} testID={`impact-stat-${s.key}`} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: s.color + '1A' }]}>
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.footnote}>
            {lang === 'en' ? 'Data updated live from all NGOs in Qatar' : 'بيانات محدثة مباشرة من جمعيات قطر'}
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
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 6, width: 80 },
  backTxt: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginStart: 4 },
  title: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, flex: 1, textAlign: 'center' },
  body: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  heroCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginBottom: SPACING.md, alignItems: 'center', overflow: 'hidden' },
  heroLabel: { color: '#fff', opacity: 0.85, fontSize: FONT.size.sm, letterSpacing: 0.5 },
  heroValue: { color: '#fff', fontSize: 56, fontWeight: FONT.weight.extrabold, marginTop: 4, letterSpacing: -2 },
  heroSubtitle: { color: '#fff', opacity: 0.95, fontSize: FONT.size.md, marginTop: 4, fontWeight: FONT.weight.semibold },

  chartCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm },
  cardTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 180 },
  barCol: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  bar: { width: 22, borderRadius: 8, marginBottom: 6 },
  barVal: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600', marginBottom: 2 },
  barDay: { fontSize: FONT.size.xs, color: COLORS.textSecondary, fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
  footnote: { textAlign: 'center', fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: SPACING.md, fontStyle: 'italic' },
});
