import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';
import { MOCK_IMPACT, MOCK_RECENT } from '../../src/data/mockData';

export default function Home() {
  const { t, lang, setLang, isRTL } = useApp();
  const router = useRouter();

  // Animated counter for headline number
  const counter = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState(0);
  useEffect(() => {
    const id = counter.addListener(({ value }) => setDisplay(Math.floor(value)));
    Animated.timing(counter, {
      toValue: MOCK_IMPACT.mealsRescued,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => counter.removeListener(id);
  }, []);

  const peopleFed = Math.round(MOCK_IMPACT.mealsRescued / 3);
  const co2SavedTons = Math.round(MOCK_IMPACT.wasteReducedKg * 2.5 / 1000);

  const maxVal = Math.max(...MOCK_IMPACT.weeklyTrend);
  const days = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];

  const actions = [
    { id: 'donate', icon: 'gift-outline' as const, label: t('donateFood'), color: COLORS.primary, route: '/donate-quick' },
    { id: 'request', icon: 'hand-left-outline' as const, label: t('requestFood'), color: COLORS.warning, route: '/request-food' },
    { id: 'deliver', icon: 'car-outline' as const, label: t('volunteerDelivery'), color: COLORS.accent, route: '/(tabs)/deliveries' },
    { id: 'impact', icon: 'bar-chart-outline' as const, label: t('impactDashboard'), color: COLORS.primaryDark, route: '/(tabs)/impact' },
  ];

  return (
    <Screen testID="home-screen">
      {/* Compact header */}
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <View>
          <Text style={[styles.greet, isRTL && styles.rtl]}>{t('hello')} 👋</Text>
          <Text style={[styles.appname, isRTL && styles.rtl]}>{t('appName')}</Text>
        </View>
        <TouchableOpacity
          testID="home-lang-toggle"
          onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
          style={styles.langBtn}
        >
          <Ionicons name="globe-outline" size={16} color={COLORS.textPrimary} />
          <Text style={styles.langTxt}>{lang === 'en' ? 'العربية' : 'English'}</Text>
        </TouchableOpacity>
      </View>

      {/* HERO IMPACT SECTION — main feature */}
      <View testID="home-impact-hero" style={styles.hero}>
        <View style={styles.heroBlob1} />
        <View style={styles.heroBlob2} />
        <View style={styles.heroBlob3} />

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveTxt}>LIVE • QATAR</Text>
        </View>

        <Text style={[styles.heroLabel, isRTL && styles.rtl]}>{t('mealsRescuedToday')}</Text>
        <Text style={styles.heroValue}>{display.toLocaleString()}</Text>

        <View style={styles.translateRow}>
          <Ionicons name="people" size={14} color="#fff" />
          <Text style={styles.translateTxt}>
            {peopleFed.toLocaleString()} {lang === 'en' ? 'people fed across Qatar' : 'شخص أُطعموا في قطر'}
          </Text>
        </View>

        {/* Inline weekly trend chart */}
        <View style={styles.miniChart}>
          {MOCK_IMPACT.weeklyTrend.map((v, i) => {
            const h = (v / maxVal) * 56;
            const isToday = i === 6;
            return (
              <View key={i} style={styles.miniBarCol}>
                <View style={[styles.miniBar, { height: h, backgroundColor: isToday ? '#fff' : 'rgba(255,255,255,0.45)' }]} />
                <Text style={[styles.miniDay, isToday && { color: '#fff', fontWeight: '800' }]}>{days[i]}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          testID="hero-see-full-impact"
          style={styles.heroCta}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/impact')}
        >
          <Text style={styles.heroCtaTxt}>
            {lang === 'en' ? 'See Full Impact Dashboard' : 'عرض لوحة الأثر الكاملة'}
          </Text>
          <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Impact stats strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statBox}>
          <Ionicons name="leaf-outline" size={20} color={COLORS.accent} />
          <Text style={styles.statNum}>{MOCK_IMPACT.wasteReducedKg.toLocaleString()}</Text>
          <Text style={styles.statTitle}>
            {lang === 'en' ? `kg waste saved` : `كجم هدر`}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="cloud-outline" size={20} color={COLORS.accent} />
          <Text style={styles.statNum}>{co2SavedTons}t</Text>
          <Text style={styles.statTitle}>
            {lang === 'en' ? 'CO₂ avoided' : 'CO₂'}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="people-outline" size={20} color={COLORS.accent} />
          <Text style={styles.statNum}>{MOCK_IMPACT.activeVolunteers}</Text>
          <Text style={styles.statTitle}>
            {lang === 'en' ? 'volunteers' : 'متطوع'}
          </Text>
        </View>
      </View>

      {/* Quick Actions (smaller, secondary) */}
      <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t('quickActions')}</Text>
      <View style={styles.grid}>
        {actions.map((a) => (
          <TouchableOpacity
            key={a.id}
            testID={`home-action-${a.id}`}
            activeOpacity={0.85}
            onPress={() => router.push(a.route as any)}
            style={styles.tile}
          >
            <View style={[styles.tileIcon, { backgroundColor: a.color + '1A' }]}>
              <Ionicons name={a.icon} size={22} color={a.color} />
            </View>
            <Text style={styles.tileLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent activity */}
      <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t('recentActivity')}</Text>
      <View style={{ marginBottom: SPACING.xl }}>
        {MOCK_RECENT.map((r) => (
          <View key={r.id} style={[styles.activity, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.activityDot} />
            <Text style={[styles.activityText, isRTL && styles.rtl]} numberOfLines={2}>
              {lang === 'en' ? r.en : r.ar}
            </Text>
            <Text style={styles.activityTime}>{r.time}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  greet: { fontSize: FONT.size.sm, color: COLORS.textMuted },
  appname: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.primary, marginTop: 2 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  langBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border,
  },
  langTxt: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginStart: 6 },

  // HERO
  hero: {
    backgroundColor: COLORS.primary, borderRadius: 28,
    padding: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.lg,
    overflow: 'hidden', position: 'relative', ...SHADOW.md,
  },
  heroBlob1: { position: 'absolute', width: 220, height: 220, borderRadius: 220, backgroundColor: COLORS.primaryLight, opacity: 0.5, top: -80, right: -60 },
  heroBlob2: { position: 'absolute', width: 140, height: 140, borderRadius: 140, backgroundColor: COLORS.accent, opacity: 0.35, bottom: -50, left: -30 },
  heroBlob3: { position: 'absolute', width: 60, height: 60, borderRadius: 60, backgroundColor: '#fff', opacity: 0.08, top: 80, left: 30 },

  liveBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5DEE9C', marginRight: 6 },
  liveTxt: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },

  heroLabel: { color: '#fff', opacity: 0.85, fontSize: FONT.size.sm, letterSpacing: 0.3, marginTop: SPACING.md },
  heroValue: { color: '#fff', fontSize: 56, fontWeight: FONT.weight.extrabold, marginTop: 2, letterSpacing: -2, lineHeight: 60 },
  translateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  translateTxt: { color: '#fff', opacity: 0.95, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, marginStart: 6 },

  miniChart: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    height: 70, marginTop: SPACING.md, paddingHorizontal: 4,
  },
  miniBarCol: { alignItems: 'center', flex: 1 },
  miniBar: { width: 14, borderRadius: 4, marginBottom: 4 },
  miniDay: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },

  heroCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', paddingVertical: 12, borderRadius: RADIUS.full,
    marginTop: SPACING.md, gap: 8,
  },
  heroCtaTxt: { color: COLORS.primary, fontWeight: FONT.weight.bold, fontSize: FONT.size.sm, marginEnd: 6 },

  // Stats strip
  statsStrip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: FONT.size.lg, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginTop: 4 },
  statTitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, letterSpacing: 0.3 },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },

  sectionTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginTop: SPACING.lg, marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  tileIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileLabel: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary },
  activity: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm,
  },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent },
  activityText: { flex: 1, marginHorizontal: SPACING.md, color: COLORS.textPrimary, fontSize: FONT.size.sm },
  activityTime: { color: COLORS.textMuted, fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold },
});
