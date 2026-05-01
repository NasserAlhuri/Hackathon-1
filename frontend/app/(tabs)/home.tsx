import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';
import { MOCK_IMPACT, MOCK_RECENT } from '../../src/data/mockData';

export default function Home() {
  const { t, lang, setLang, isRTL, role } = useApp();
  const router = useRouter();

  const actions = [
    { id: 'donate', icon: 'gift-outline' as const, label: t('donateFood'), color: COLORS.primary, route: '/donate-quick' },
    { id: 'request', icon: 'hand-left-outline' as const, label: t('requestFood'), color: COLORS.warning, route: '/request-food' },
    { id: 'deliver', icon: 'car-outline' as const, label: t('volunteerDelivery'), color: COLORS.accent, route: '/(tabs)/deliveries' },
    { id: 'impact', icon: 'bar-chart-outline' as const, label: t('impactDashboard'), color: COLORS.primaryDark, route: '/(tabs)/impact' },
  ];

  return (
    <Screen testID="home-screen">
      {/* Header */}
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

      {/* Hero impact card */}
      <View testID="home-impact-hero" style={styles.hero}>
        <View style={styles.heroBlob1} />
        <View style={styles.heroBlob2} />
        <Text style={styles.heroLabel}>{t('mealsRescuedToday')}</Text>
        <Text style={styles.heroValue}>{MOCK_IMPACT.mealsRescued.toLocaleString()}</Text>
        <View style={[styles.heroStatsRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.heroStat}>
            <Ionicons name="leaf-outline" size={14} color="#fff" />
            <Text style={styles.heroStatTxt}>
              {MOCK_IMPACT.wasteReducedKg.toLocaleString()} {t('kg')}
            </Text>
          </View>
          <View style={styles.heroStat}>
            <Ionicons name="people-outline" size={14} color="#fff" />
            <Text style={styles.heroStatTxt}>{MOCK_IMPACT.activeVolunteers}</Text>
          </View>
          <View style={styles.heroStat}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.heroStatTxt}>{MOCK_IMPACT.areasServed}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
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
              <Ionicons name={a.icon} size={24} color={a.color} />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg },
  greet: { fontSize: FONT.size.sm, color: COLORS.textMuted },
  appname: { fontSize: FONT.size.xxl, fontWeight: FONT.weight.extrabold, color: COLORS.primary, marginTop: 2 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border,
  },
  langTxt: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginStart: 6 },
  hero: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xxl,
    padding: SPACING.lg, overflow: 'hidden', position: 'relative',
    ...SHADOW.md,
  },
  heroBlob1: { position: 'absolute', width: 180, height: 180, borderRadius: 180, backgroundColor: COLORS.primaryLight, opacity: 0.4, top: -60, right: -40 },
  heroBlob2: { position: 'absolute', width: 100, height: 100, borderRadius: 100, backgroundColor: COLORS.accent, opacity: 0.3, bottom: -30, left: -20 },
  heroLabel: { color: '#fff', opacity: 0.8, fontSize: FONT.size.sm, letterSpacing: 0.6 },
  heroValue: { color: '#fff', fontSize: 40, fontWeight: FONT.weight.extrabold, marginTop: 4, letterSpacing: -1 },
  heroStatsRow: { flexDirection: 'row', marginTop: SPACING.md, flexWrap: 'wrap', gap: 8 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full },
  heroStatTxt: { color: '#fff', fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, marginStart: 6 },
  sectionTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginTop: SPACING.xl, marginBottom: SPACING.md },
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
  tileIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
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
