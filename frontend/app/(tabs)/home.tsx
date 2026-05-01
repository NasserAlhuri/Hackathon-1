import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';
import { MOCK_IMPACT, MOCK_RECENT, VOLUNTEER_STATS, MOCK_MY_DONATIONS, MOCK_MY_REQUESTS } from '../../src/data/mockData';

export default function Home() {
  const { t, lang, setLang, isRTL, role } = useApp();
  const router = useRouter();

  const counter = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
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
  const co2SavedTons = Math.round((MOCK_IMPACT.wasteReducedKg * 2.5) / 1000);
  const maxVal = Math.max(...MOCK_IMPACT.weeklyTrend);
  const days = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];

  // Role-specific quick actions
  const actions = (() => {
    switch (role) {
      case 'volunteer':
        return [
          { id: 'deliver', icon: 'car-outline' as const, label: t('volunteerDelivery'), color: COLORS.accent, route: '/(tabs)/activity' },
        ];
      case 'ngo':
        return [
          { id: 'incoming', icon: 'archive-outline' as const, label: t('incomingDonations'), color: COLORS.primary, route: '/(tabs)/activity' },
        ];
      case 'requester':
        return [
          { id: 'request', icon: 'hand-left-outline' as const, label: t('requestFood'), color: COLORS.warning, route: '/request-food' },
        ];
      case 'org':
        return [
          { id: 'donate-bulk', icon: 'business-outline' as const, label: t('bulkDonation'), color: COLORS.primary, route: '/donate-bulk' },
          { id: 'donate-quick', icon: 'gift-outline' as const, label: t('quickDonation'), color: COLORS.primaryDark, route: '/donate-quick' },
        ];
      case 'individual':
      default:
        return [
          { id: 'donate', icon: 'gift-outline' as const, label: t('donateFood'), color: COLORS.primary, route: '/donate-quick' },
        ];
    }
  })();

  // Role-specific stats card (small, above hero for volunteer/ngo/requester)
  const renderRoleStats = () => {
    if (role === 'volunteer') {
      return (
        <View style={styles.roleStatsCard}>
          <View style={[styles.roleStatsHead, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.roleStatsTitle, isRTL && styles.rtl]}>
              {lang === 'en' ? 'Your day' : 'يومك'}
            </Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.ratingTxt}>{VOLUNTEER_STATS.rating}</Text>
            </View>
          </View>
          <View style={styles.roleStatsRow}>
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>{VOLUNTEER_STATS.tasksToday}</Text><Text style={styles.roleStatLabel}>{lang === 'en' ? 'tasks today' : 'مهام اليوم'}</Text></View>
            <View style={styles.divider} />
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>{VOLUNTEER_STATS.kmCovered}</Text><Text style={styles.roleStatLabel}>{lang === 'en' ? 'km covered' : 'كم'}</Text></View>
            <View style={styles.divider} />
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>{VOLUNTEER_STATS.totalDeliveries}</Text><Text style={styles.roleStatLabel}>{lang === 'en' ? 'total runs' : 'إجمالي'}</Text></View>
          </View>
        </View>
      );
    }
    if (role === 'ngo') {
      return (
        <View style={styles.roleStatsCard}>
          <Text style={[styles.roleStatsTitle, isRTL && styles.rtl, { marginBottom: 10 }]}>
            {lang === 'en' ? 'Today at your NGO' : 'اليوم في جمعيتك'}
          </Text>
          <View style={styles.roleStatsRow}>
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>4</Text><Text style={styles.roleStatLabel}>{t('incomingDonations')}</Text></View>
            <View style={styles.divider} />
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>2</Text><Text style={styles.roleStatLabel}>{t('reviewNeeded')}</Text></View>
            <View style={styles.divider} />
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>320</Text><Text style={styles.roleStatLabel}>{lang === 'en' ? 'meals queued' : 'بانتظار التوزيع'}</Text></View>
          </View>
        </View>
      );
    }
    if (role === 'requester') {
      const active = MOCK_MY_REQUESTS.find((r) => r.status === 'matched');
      return (
        <View style={styles.roleStatsCard}>
          <Text style={[styles.roleStatsTitle, isRTL && styles.rtl, { marginBottom: 10 }]}>
            {lang === 'en' ? 'Your active request' : 'طلبك النشط'}
          </Text>
          {active ? (
            <View>
              <View style={[styles.statusPill, { backgroundColor: COLORS.accent + '1A', alignSelf: 'flex-start' }]}>
                <Text style={[styles.statusTxt, { color: COLORS.accentDark }]}>
                  {lang === 'en' ? 'MATCHED' : 'تم الربط'}
                </Text>
              </View>
              <Text style={styles.matchTxt}>
                {lang === 'en' ? `Matched with ${active.match_en} for ${active.familySize} people` : `تم الربط مع ${active.match_ar} لـ ${active.familySize} أفراد`}
              </Text>
            </View>
          ) : (
            <Text style={styles.matchTxt}>{lang === 'en' ? 'No active requests' : 'لا توجد طلبات نشطة'}</Text>
          )}
        </View>
      );
    }
    return null;
  };

  const greetByRole = () => {
    switch (role) {
      case 'volunteer': return lang === 'en' ? 'Volunteer' : 'متطوع';
      case 'ngo': return lang === 'en' ? 'NGO Partner' : 'شريك خيري';
      case 'requester': return lang === 'en' ? 'Welcome' : 'أهلاً بك';
      case 'org': return lang === 'en' ? 'Organization' : 'مؤسسة';
      default: return t('appName');
    }
  };

  return (
    <Screen testID="home-screen">
      {/* Compact header */}
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <View>
          <Text style={[styles.greet, isRTL && styles.rtl]}>{t('hello')} 👋</Text>
          <Text style={[styles.appname, isRTL && styles.rtl]}>{greetByRole()}</Text>
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

      {renderRoleStats()}

      {/* HERO IMPACT — universal across roles */}
      <View testID="home-impact-hero" style={[styles.hero, role && role !== 'individual' && role !== 'org' ? { marginTop: SPACING.md } : null]}>
        <View style={styles.heroBlob1} />
        <View style={styles.heroBlob2} />

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
          onPress={() => router.push('/impact')}
        >
          <Text style={styles.heroCtaTxt}>
            {lang === 'en' ? 'See Full Impact Dashboard' : 'عرض لوحة الأثر الكاملة'}
          </Text>
          <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Compact stats strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statBox}>
          <Ionicons name="leaf-outline" size={20} color={COLORS.accent} />
          <Text style={styles.statNum}>{MOCK_IMPACT.wasteReducedKg.toLocaleString()}</Text>
          <Text style={styles.statTitle}>{lang === 'en' ? 'kg waste saved' : 'كجم هدر'}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="cloud-outline" size={20} color={COLORS.accent} />
          <Text style={styles.statNum}>{co2SavedTons}t</Text>
          <Text style={styles.statTitle}>{lang === 'en' ? 'CO₂ avoided' : 'CO₂'}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="people-outline" size={20} color={COLORS.accent} />
          <Text style={styles.statNum}>{MOCK_IMPACT.activeVolunteers}</Text>
          <Text style={styles.statTitle}>{lang === 'en' ? 'volunteers' : 'متطوع'}</Text>
        </View>
      </View>

      {/* Role-specific actions */}
      <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t('quickActions')}</Text>
      <View style={styles.grid}>
        {actions.map((a) => (
          <TouchableOpacity
            key={a.id}
            testID={`home-action-${a.id}`}
            activeOpacity={0.85}
            onPress={() => router.push(a.route as any)}
            style={[styles.tile, actions.length === 1 && { width: '100%' }]}
          >
            <View style={[styles.tileIcon, { backgroundColor: a.color + '1A' }]}>
              <Ionicons name={a.icon} size={22} color={a.color} />
            </View>
            <Text style={styles.tileLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

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

  // Role stats card
  roleStatsCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  roleStatsHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  roleStatsTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  roleStatsRow: { flexDirection: 'row', alignItems: 'center' },
  roleStat: { flex: 1, alignItems: 'center' },
  roleStatNum: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.primary },
  roleStatLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  divider: { width: 1, height: 30, backgroundColor: COLORS.border },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.warning, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  ratingTxt: { color: '#fff', fontSize: FONT.size.xs, fontWeight: '800', marginStart: 4 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, marginBottom: 6 },
  statusTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  matchTxt: { fontSize: FONT.size.sm, color: COLORS.textPrimary, lineHeight: 20 },

  hero: {
    backgroundColor: COLORS.primary, borderRadius: 28,
    padding: SPACING.lg, overflow: 'hidden', position: 'relative', ...SHADOW.md,
  },
  heroBlob1: { position: 'absolute', width: 220, height: 220, borderRadius: 220, backgroundColor: COLORS.primaryLight, opacity: 0.5, top: -80, right: -60 },
  heroBlob2: { position: 'absolute', width: 140, height: 140, borderRadius: 140, backgroundColor: COLORS.accent, opacity: 0.35, bottom: -50, left: -30 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5DEE9C', marginRight: 6 },
  liveTxt: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  heroLabel: { color: '#fff', opacity: 0.85, fontSize: FONT.size.sm, marginTop: SPACING.md },
  heroValue: { color: '#fff', fontSize: 56, fontWeight: FONT.weight.extrabold, marginTop: 2, letterSpacing: -2, lineHeight: 60 },
  translateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  translateTxt: { color: '#fff', opacity: 0.95, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, marginStart: 6 },
  miniChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 70, marginTop: SPACING.md, paddingHorizontal: 4 },
  miniBarCol: { alignItems: 'center', flex: 1 },
  miniBar: { width: 14, borderRadius: 4, marginBottom: 4 },
  miniDay: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  heroCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 12, borderRadius: RADIUS.full, marginTop: SPACING.md },
  heroCtaTxt: { color: COLORS.primary, fontWeight: FONT.weight.bold, fontSize: FONT.size.sm, marginEnd: 6 },

  statsStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, paddingVertical: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: FONT.size.lg, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginTop: 4 },
  statTitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },

  sectionTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginTop: SPACING.lg, marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm },
  tileIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileLabel: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary },
  activity: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent },
  activityText: { flex: 1, marginHorizontal: SPACING.md, color: COLORS.textPrimary, fontSize: FONT.size.sm },
  activityTime: { color: COLORS.textMuted, fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold },
});
