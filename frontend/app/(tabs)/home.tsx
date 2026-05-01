import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import LanguageSheet from '../../src/components/LanguageSheet';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';
import { LANGUAGES } from '../../src/constants/i18n';
import { getTier, getNextTier } from '../../src/constants/gamification';
import { MOCK_IMPACT, MOCK_RECENT, VOLUNTEER_STATS, MOCK_MY_REQUESTS, MOCK_LEADERBOARD, MY_RANK, MY_TOTAL_MEALS } from '../../src/data/mockData';

export default function Home() {
  const { t, lang, isRTL, role } = useApp();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);

  const counter = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = counter.addListener(({ value }) => setDisplay(Math.floor(value)));
    Animated.timing(counter, { toValue: MOCK_IMPACT.mealsRescued, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => counter.removeListener(id);
  }, []);

  const peopleFed = Math.round(MOCK_IMPACT.mealsRescued / 3);
  const co2SavedTons = Math.round(MOCK_IMPACT.co2AvoidedKg / 1000);
  const maxVal = Math.max(...MOCK_IMPACT.weeklyTrend);
  const days = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
  const currentLang = LANGUAGES.find((l) => l.id === lang);

  // Role-specific actions
  const actions = (() => {
    switch (role) {
      case 'volunteer':
        return [{ id: 'deliver', icon: 'car-outline' as const, label: t('volunteerDelivery'), color: COLORS.accent, route: '/(tabs)/activity' }];
      case 'recipient':
        return [
          { id: 'findFood', icon: 'map-outline' as const, label: t('findFoodNearby'), color: COLORS.accent, route: '/find-food' },
          { id: 'request', icon: 'hand-left-outline' as const, label: t('requestFood'), color: COLORS.warning, route: '/request-food' },
        ];
      case 'donor':
      default:
        return [{ id: 'donate', icon: 'gift-outline' as const, label: t('donateFood'), color: COLORS.primary, route: '/donate' }];
    }
  })();

  // Donor tier card (Qatari gamified)
  const renderTierCard = () => {
    if (role !== 'donor') return null;
    const tier = getTier(MY_TOTAL_MEALS);
    const next = getNextTier(MY_TOTAL_MEALS);
    const progress = next ? (MY_TOTAL_MEALS - tier.threshold) / (next.threshold - tier.threshold) : 1;
    const tierName = lang === 'ar' ? tier.name_ar : lang === 'fa' ? tier.name_fa : tier.name_en;
    const nextName = next ? (lang === 'ar' ? next.name_ar : lang === 'fa' ? next.name_fa : next.name_en) : '';
    return (
      <View style={[styles.tierCard, { backgroundColor: tier.color }]} testID="donor-tier-card">
        <View style={[styles.tierRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.tierEmoji}>{tier.emoji}</Text>
          <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
            <Text style={[styles.tierLabel, isRTL && styles.rtl]}>{lang === 'ar' ? 'لقبك' : lang === 'fa' ? 'عنوان شما' : 'Your Title'}</Text>
            <Text style={[styles.tierName, isRTL && styles.rtl]}>{tierName}</Text>
            <Text style={[styles.tierMeals, isRTL && styles.rtl]}>{MY_TOTAL_MEALS} {t('meals')}</Text>
          </View>
        </View>
        {next && (
          <View style={styles.tierProgressWrap}>
            <View style={styles.tierTrack}>
              <View style={[styles.tierFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
            </View>
            <Text style={styles.tierNext}>
              {lang === 'ar' ? `${next.threshold - MY_TOTAL_MEALS} وجبة متبقية لـ ${nextName} ${next.emoji}` : lang === 'fa' ? `${next.threshold - MY_TOTAL_MEALS} وعده تا ${nextName} ${next.emoji}` : `${next.threshold - MY_TOTAL_MEALS} meals to ${nextName} ${next.emoji}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Donor leaderboard card
  const renderLeaderboard = () => {
    if (role !== 'donor') return null;
    const top5 = MOCK_LEADERBOARD.slice(0, 5);
    return (
      <View style={styles.lbCard} testID="donor-leaderboard">
        <View style={[styles.lbHead, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.lbTitle, isRTL && styles.rtl]}>{t('donorLeaderboard')}</Text>
            <Text style={[styles.lbSub, isRTL && styles.rtl]}>{t('topDonors')}</Text>
          </View>
          <View style={styles.rankPill}>
            <Ionicons name="trophy" size={12} color="#fff" />
            <Text style={styles.rankPillTxt}>#{MY_RANK} · {MY_TOTAL_MEALS} {t('meals')}</Text>
          </View>
        </View>
        {top5.map((d, i) => {
          const isMe = d.isMe;
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
          return (
            <View key={d.id} style={[styles.lbRow, isMe && styles.lbRowMe, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={styles.lbRank}>{medal || `#${i + 1}`}</Text>
              <View style={[styles.lbAvatar, isMe && { backgroundColor: COLORS.primary }]}>
                <Text style={styles.lbAvatarTxt}>{d.avatar}</Text>
              </View>
              <Text style={[styles.lbName, isMe && { fontWeight: '800', color: COLORS.primary }]} numberOfLines={1}>{d.name}{isMe ? ` (${t('you')})` : ''}</Text>
              <Text style={styles.lbMeals}>{d.meals.toLocaleString()}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderRoleStats = () => {
    if (role === 'volunteer') {
      return (
        <View style={styles.roleStatsCard}>
          <View style={[styles.roleStatsHead, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.roleStatsTitle, isRTL && styles.rtl]}>{t('yourDay')}</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.ratingTxt}>{VOLUNTEER_STATS.rating}</Text>
            </View>
          </View>
          <View style={styles.roleStatsRow}>
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>{VOLUNTEER_STATS.tasksToday}</Text><Text style={styles.roleStatLabel}>{t('tasksToday')}</Text></View>
            <View style={styles.divider} />
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>{VOLUNTEER_STATS.kmCovered}</Text><Text style={styles.roleStatLabel}>{t('kmCovered')}</Text></View>
            <View style={styles.divider} />
            <View style={styles.roleStat}><Text style={styles.roleStatNum}>{VOLUNTEER_STATS.totalDeliveries}</Text><Text style={styles.roleStatLabel}>{t('totalRuns')}</Text></View>
          </View>
        </View>
      );
    }
    if (role === 'recipient') {
      const active = MOCK_MY_REQUESTS.find((r) => r.status === 'matched');
      return (
        <View style={styles.roleStatsCard}>
          <Text style={[styles.roleStatsTitle, isRTL && styles.rtl, { marginBottom: 10 }]}>{t('activeRequest')}</Text>
          {active ? (
            <View>
              <View style={[styles.statusPill, { backgroundColor: COLORS.accent + '1A', alignSelf: 'flex-start' }]}>
                <Text style={[styles.statusTxt, { color: COLORS.accentDark }]}>{t('matchedStatus')}</Text>
              </View>
              <Text style={styles.matchTxt}>
                {lang === 'en' ? `Matched with ${active.match_en} for ${active.familySize} people` : `${active.match_ar} - ${active.familySize}`}
              </Text>
            </View>
          ) : (
            <Text style={styles.matchTxt}>—</Text>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <Screen testID="home-screen">
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <View>
            <Text style={[styles.greet, isRTL && styles.rtl]}>{t('hello')} 👋</Text>
            <Text style={[styles.appname, isRTL && styles.rtl]}>{t('appName')}</Text>
          </View>
          <TouchableOpacity testID="home-lang-toggle" onPress={() => setLangOpen(true)} style={styles.langBtn}>
            <Text style={styles.langFlag}>{currentLang?.flag}</Text>
            <Text style={styles.langTxt} numberOfLines={1}>{currentLang?.native}</Text>
          </TouchableOpacity>
        </View>

        {renderRoleStats()}
        {renderTierCard()}

        <View testID="home-impact-hero" style={[styles.hero, role === 'volunteer' || role === 'recipient' ? { marginTop: SPACING.md } : null]}>
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
            <Text style={styles.translateTxt}>{peopleFed.toLocaleString()} {t('peopleFed')}</Text>
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
          <TouchableOpacity testID="hero-see-full-impact" style={styles.heroCta} activeOpacity={0.85} onPress={() => router.push('/impact')}>
            <Text style={styles.heroCtaTxt}>{t('seeImpact')}</Text>
            <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Ionicons name="leaf-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statNum}>{MOCK_IMPACT.wasteReducedKg.toLocaleString()}</Text>
            <Text style={styles.statTitle}>{t('kg')} {t('wasteReduced').toLowerCase()}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="cloud-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statNum}>{co2SavedTons}t</Text>
            <Text style={styles.statTitle}>{t('co2Avoided')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statNum}>{MOCK_IMPACT.activeVolunteers}</Text>
            <Text style={styles.statTitle}>{t('activeVolunteers')}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t('quickActions')}</Text>
        <View style={styles.grid}>
          {actions.map((a) => (
            <TouchableOpacity key={a.id} testID={`home-action-${a.id}`} activeOpacity={0.85} onPress={() => router.push(a.route as any)} style={[styles.tile, actions.length === 1 ? { width: '100%' } : null]}>
              <View style={[styles.tileIcon, { backgroundColor: a.color + '1A' }]}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={styles.tileLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderLeaderboard()}

        <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t('recentActivity')}</Text>
        <View style={{ marginBottom: SPACING.xl }}>
          {MOCK_RECENT.map((r) => (
            <View key={r.id} style={[styles.activity, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.activityDot} />
              <Text style={[styles.activityText, isRTL && styles.rtl]} numberOfLines={2}>{lang === 'ar' ? r.ar : r.en}</Text>
              <Text style={styles.activityTime}>{r.time}</Text>
            </View>
          ))}
        </View>
      </Screen>
      <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  greet: { fontSize: FONT.size.sm, color: COLORS.textMuted },
  appname: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.primary, marginTop: 2 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  langBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, maxWidth: 130 },
  langFlag: { fontSize: 14, marginEnd: 6 },
  langTxt: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary },
  roleStatsCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
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

  hero: { backgroundColor: COLORS.primary, borderRadius: 28, padding: SPACING.lg, overflow: 'hidden', position: 'relative', ...SHADOW.md },
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
  statBox: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  statNum: { fontSize: FONT.size.lg, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginTop: 4 },
  statTitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
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

  // Leaderboard
  lbCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.lg, ...SHADOW.sm },
  lbHead: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  lbTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  lbSub: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
  rankPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full },
  rankPillTxt: { color: '#fff', fontSize: 11, fontWeight: '800', marginStart: 4 },
  lbRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  lbRowMe: { backgroundColor: COLORS.primary + '0F', marginHorizontal: -SPACING.md, paddingHorizontal: SPACING.md, borderRadius: RADIUS.md },
  lbRank: { width: 30, fontSize: FONT.size.sm, fontWeight: '700', color: COLORS.textSecondary },
  lbAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  lbAvatarTxt: { fontSize: FONT.size.sm, fontWeight: '700', color: COLORS.textPrimary },
  lbName: { flex: 1, fontSize: FONT.size.sm, color: COLORS.textPrimary, fontWeight: '600' },
  lbMeals: { fontSize: FONT.size.sm, fontWeight: '800', color: COLORS.primary },
});
