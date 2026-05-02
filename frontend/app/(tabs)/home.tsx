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
import QatariPattern, { PalmTree } from '../../src/components/QatariPattern';
import { LogoRow } from '../../src/components/NekhwaLogo';
import { MOCK_IMPACT, VOLUNTEER_STATS, MOCK_MY_REQUESTS, MOCK_LEADERBOARD, MOCK_LEADERBOARD_ORGS, MY_RANK, MY_TOTAL_MEALS, MY_DONOR_IMPACT } from '../../src/data/mockData';
import { ConchFountain, FanarMosque } from '../../src/components/QatariLandmarks';

export default function Home() {
  const { t, lang, isRTL, role } = useApp();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [lbTab, setLbTab] = useState<'individuals' | 'orgs'>('individuals');

  const counter = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const id = counter.addListener(({ value }) => setDisplay(Math.floor(value)));
    // For donor: count up to their personal meals; for others: global meals
    const target = role === 'donor' ? MY_DONOR_IMPACT.totalMeals : MOCK_IMPACT.mealsRescued;
    Animated.timing(counter, { toValue: target, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => counter.removeListener(id);
  }, [role]);

  const peopleFed = role === 'donor' ? MY_DONOR_IMPACT.peopleFed : Math.round(MOCK_IMPACT.mealsRescued / 3);
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
          { id: 'request', icon: 'basket-outline' as const, label: t('requestFood'), color: COLORS.warning, route: '/request-food' },
        ];
      case 'donor':
      default:
        return [{ id: 'donate', icon: 'gift-outline' as const, label: t('donateFood'), color: COLORS.primary, route: '/donate' }];
    }
  })();

  // Donor tier card (Qatari gamified) — polished
  const renderTierCard = () => {
    if (role !== 'donor') return null;
    const tier = getTier(MY_TOTAL_MEALS);
    const next = getNextTier(MY_TOTAL_MEALS);
    const progress = next ? (MY_TOTAL_MEALS - tier.threshold) / (next.threshold - tier.threshold) : 1;
    const tierName = lang === 'ar' ? tier.name_ar : lang === 'fa' ? tier.name_fa : tier.name_en;
    const nextName = next ? (lang === 'ar' ? next.name_ar : lang === 'fa' ? next.name_fa : next.name_en) : '';
    return (
      <View style={[styles.tierCard, { backgroundColor: tier.color }]} testID="donor-tier-card">
        <QatariPattern color="#fff" opacity={0.08} size={36} />
        <View style={styles.tierPalm}>
          <PalmTree size={48} color="rgba(255,255,255,0.4)" />
        </View>
        <View style={styles.tierShine} />

        <View style={[styles.tierRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.tierEmojiCircle}>
            <Text style={styles.tierEmoji}>{tier.emoji}</Text>
          </View>
          <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
            <Text style={[styles.tierLabel, isRTL && styles.rtl]}>{t('yourTitle')}</Text>
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
              {`${next.threshold - MY_TOTAL_MEALS} ${t('mealsTo')} ${nextName} ${next.emoji}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Donor leaderboard with tabs
  const renderLeaderboard = () => {
    if (role !== 'donor') return null;
    const list = lbTab === 'individuals' ? MOCK_LEADERBOARD : MOCK_LEADERBOARD_ORGS;
    const top5 = list.slice(0, 5);
    return (
      <View style={[styles.lbCard, { overflow: 'hidden' }]} testID="donor-leaderboard">
        {/* Conch fountain – subtle decorative background */}
        <ConchFountain
          height={160}
          width={80}
          opacity={0.15}
          style={{ position: 'absolute', right: -20, bottom: -20 }}
        />
        <View style={[styles.lbHead, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.lbTitle, isRTL && styles.rtl]}>{t('donorLeaderboard')}</Text>
          </View>
          {lbTab === 'individuals' && (
            <View style={styles.rankPill}>
              <Ionicons name="trophy" size={12} color="#fff" />
              <Text style={styles.rankPillTxt}>#{MY_RANK}</Text>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.lbTabs}>
          <TouchableOpacity testID="lb-tab-individuals" onPress={() => setLbTab('individuals')} style={[styles.lbTab, lbTab === 'individuals' && styles.lbTabActive]}>
            <Ionicons name="person" size={14} color={lbTab === 'individuals' ? '#fff' : COLORS.textSecondary} />
            <Text style={[styles.lbTabTxt, lbTab === 'individuals' && { color: '#fff', fontWeight: '800' }]}>{t('individuals')}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="lb-tab-orgs" onPress={() => setLbTab('orgs')} style={[styles.lbTab, lbTab === 'orgs' && styles.lbTabActive]}>
            <Ionicons name="business" size={14} color={lbTab === 'orgs' ? '#fff' : COLORS.textSecondary} />
            <Text style={[styles.lbTabTxt, lbTab === 'orgs' && { color: '#fff', fontWeight: '800' }]}>{t('organizations')}</Text>
          </TouchableOpacity>
        </View>

        {top5.map((d: any, i) => {
          const isMe = (d as any).isMe;
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
              <Text style={[styles.matchTxt, isRTL && styles.rtl]}>
                {isRTL ? `${active.match_ar} - ${active.familySize}` : `${t('matchedWith')} ${active.match_en} · ${t('familyOf')} ${active.familySize}`}
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
          <LogoRow size={40} />
          <TouchableOpacity testID="home-lang-toggle" onPress={() => setLangOpen(true)} style={styles.langBtn}>
            <Text style={styles.langFlag}>{currentLang?.flag}</Text>
            <Text style={styles.langTxt} numberOfLines={1}>{currentLang?.native}</Text>
          </TouchableOpacity>
        </View>

        {renderRoleStats()}
        {renderTierCard()}

        <View testID="home-impact-hero" style={[styles.hero, { marginTop: SPACING.lg }]}>
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />
          <FanarMosque
            white
            width={72}
            height={130}
            opacity={0.15}
            style={{ position: 'absolute', right: 12, top: -10 }}
          />
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTxt}>{t('liveLocation')}</Text>
          </View>
          <Text style={[styles.heroLabel, isRTL && styles.rtl]}>{role === 'donor' ? t('yourMealsRescued') : t('mealsRescuedToday')}</Text>
          <Text style={styles.heroValue}>{display.toLocaleString()}</Text>
          <View style={[styles.translateRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="people" size={14} color="#fff" />
            <Text style={[styles.translateTxt, isRTL && styles.rtl]}>{peopleFed.toLocaleString()} {role === 'donor' ? t('yourPeopleFed') : t('peopleFed')}</Text>
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
            <Text style={styles.heroCtaTxt}>{role === 'donor' ? t('seeCommunityImpact') : t('seeImpact')}</Text>
            <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Community meals rescued card — shown below donor personal hero */}
        {role === 'donor' && (
          <View style={styles.communityCard} testID="community-meals-card">
            <View style={[styles.communityRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="earth-outline" size={20} color={COLORS.primary} />
              <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                <Text style={[styles.communityLabel, isRTL && styles.rtl]}>{t('mealsRescuedToday')}</Text>
                <Text style={[styles.communityValue, isRTL && styles.rtl]}>{MOCK_IMPACT.mealsRescued.toLocaleString()}</Text>
              </View>
              <View style={styles.liveBadgeSmall}>
                <View style={styles.liveDotSmall} />
                <Text style={styles.liveTxtSmall}>{t('liveLocation')}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.statsStrip, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statNum}>{MOCK_IMPACT.activeVolunteers}</Text>
            <Text style={[styles.statTitle, isRTL && styles.rtl]}>{t('activeVolunteers')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statNum}>{MOCK_IMPACT.completedDeliveries.toLocaleString()}</Text>
            <Text style={[styles.statTitle, isRTL && styles.rtl]}>{t('completedDeliveries')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="location-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statNum}>{MOCK_IMPACT.areasServed}</Text>
            <Text style={[styles.statTitle, isRTL && styles.rtl]}>{t('areasServed')}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t('quickActions')}</Text>
        <View style={[styles.grid, isRTL && { flexDirection: 'row-reverse' }]}>
          {actions.map((a) => (
            <TouchableOpacity key={a.id} testID={`home-action-${a.id}`} activeOpacity={0.85} onPress={() => router.push(a.route as any)} style={[styles.tile, actions.length === 1 ? { width: '100%' } : null]}>
              <View style={[styles.tileIcon, { backgroundColor: a.color + '1A' }, isRTL && { alignSelf: 'flex-end' }]}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={[styles.tileLabel, isRTL && styles.rtl]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderLeaderboard()}

        <View style={{ height: SPACING.xl }} />
      </Screen>
      <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
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
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5DEE9C', marginEnd: 6 },
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

  communityCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  communityRow: { flexDirection: 'row', alignItems: 'center' },
  communityLabel: { fontSize: FONT.size.sm, color: COLORS.textSecondary, fontWeight: FONT.weight.semibold },
  communityValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.primary, marginTop: 2 },
  liveBadgeSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  liveDotSmall: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#5DEE9C', marginEnd: 4 },
  liveTxtSmall: { color: COLORS.textSecondary, fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },

  statsStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, paddingVertical: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  statBox: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  statNum: { fontSize: FONT.size.lg, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginTop: 4 },
  statTitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },

  sectionTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginTop: SPACING.lg, marginBottom: SPACING.md, alignSelf: 'stretch' },
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

  // Donor tier card (polished)
  tierCard: { borderRadius: 28, padding: SPACING.lg, marginTop: SPACING.md, overflow: 'hidden', position: 'relative', ...SHADOW.md },
  tierPalm: { position: 'absolute', top: -8, right: -8, opacity: 0.5 },
  tierShine: { position: 'absolute', top: -40, left: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff', opacity: 0.08 },
  tierRow: { flexDirection: 'row', alignItems: 'center' },
  tierEmojiCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  tierEmoji: { fontSize: 36 },
  tierLabel: { color: '#fff', opacity: 0.8, fontSize: FONT.size.xs, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700' },
  tierName: { color: '#fff', fontSize: FONT.size.xxl, fontWeight: FONT.weight.extrabold, marginTop: 4, letterSpacing: -0.5 },
  tierMeals: { color: '#fff', opacity: 0.9, fontSize: FONT.size.sm, marginTop: 2, fontWeight: '600' },
  tierProgressWrap: { marginTop: SPACING.lg },
  tierTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' },
  tierFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  tierNext: { color: '#fff', opacity: 0.95, fontSize: FONT.size.xs, marginTop: 8, fontWeight: '700' },

  // Leaderboard tabs
  lbTabs: { flexDirection: 'row', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full, padding: 4, marginBottom: SPACING.md, gap: 4 },
  lbTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: RADIUS.full },
  lbTabActive: { backgroundColor: COLORS.primary },
  lbTabTxt: { fontSize: FONT.size.sm, fontWeight: '600', color: COLORS.textSecondary, marginStart: 4 },

});
