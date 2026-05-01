import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';
import { QATAR_LOCATIONS, MOCK_MY_DONATIONS, MOCK_MY_REQUESTS } from '../../src/data/mockData';

export default function Activity() {
  const { t, role, tasks, lang, isRTL, updateTask } = useApp();
  const router = useRouter();

  const locName = (id: string) => {
    const l = QATAR_LOCATIONS.find((x) => x.id === id);
    return l ? (lang === 'en' ? l.en : l.ar) : id;
  };

  // VOLUNTEER
  if (role === 'volunteer') {
    const openTasks = tasks.filter((x) => x.status !== 'delivered');
    return (
      <Screen testID="activity-screen">
        <Header title={t('nearbyTasks')} showBack={false} />
        {openTasks.map((task) => {
          const label = task.status === 'open' ? t('accept') : task.status === 'accepted' ? t('markPickup') : task.status === 'pickup' ? t('markOnWay') : t('confirmDelivery');
          const nextStatus = task.status === 'open' ? 'accepted' : task.status === 'accepted' ? 'pickup' : task.status === 'pickup' ? 'onway' : 'delivered';
          const btnColor = task.status === 'open' ? COLORS.accent : COLORS.primary;
          return (
            <View key={task.id} testID={`task-card-${task.id}`} style={styles.card}>
              <View style={[styles.cardHead, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.iconBadge}><Ionicons name="restaurant-outline" size={18} color={COLORS.primary} /></View>
                <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                  <Text style={[styles.title, isRTL && styles.rtl]}>{lang === 'en' ? task.title_en : task.title_ar}</Text>
                  <Text style={[styles.sub, isRTL && styles.rtl]}>{task.meals} meals · {task.distanceKm} {t('distance')}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: task.status === 'open' ? COLORS.accent + '1A' : COLORS.warning + '26' }]}>
                  <Text style={[styles.statusTxt, { color: task.status === 'open' ? COLORS.accentDark : COLORS.warning }]}>{task.status.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.routeRow}>
                <View style={styles.routeCol}>
                  <Text style={styles.routeLabel}>{t('fromLabel')}</Text>
                  <Text style={styles.routeVal}>{locName(task.from)}</Text>
                </View>
                <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color={COLORS.textMuted} />
                <View style={[styles.routeCol, { alignItems: 'flex-end' }]}>
                  <Text style={styles.routeLabel}>{t('toLabel')}</Text>
                  <Text style={styles.routeVal}>{lang === 'en' ? task.toNgo_en : task.toNgo_ar}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.meta}><Ionicons name="time-outline" size={14} color={COLORS.textMuted} /><Text style={styles.metaTxt}>{task.scheduledIn}</Text></View>
                <View style={styles.meta}><Ionicons name="car-outline" size={14} color={COLORS.textMuted} /><Text style={styles.metaTxt}>{t(task.vehicle)}</Text></View>
              </View>
              <TouchableOpacity
                testID={`task-advance-${task.id}`}
                activeOpacity={0.85}
                onPress={() => {
                  updateTask(task.id, { status: nextStatus });
                  if (nextStatus === 'delivered') Alert.alert(t('taskCompleted'), t('success_thanks'));
                }}
                style={[styles.cta, { backgroundColor: btnColor }]}
              >
                <Text style={styles.ctaTxt}>{label}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        {openTasks.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-outline" size={40} color={COLORS.accent} />
            <Text style={styles.emptyTxt}>{lang === 'en' ? 'All deliveries completed. Great work!' : 'تم الانتهاء من كل التوصيلات'}</Text>
          </View>
        )}
      </Screen>
    );
  }

  // NGO
  if (role === 'ngo') {
    const incoming = tasks.slice(0, 4);
    return (
      <Screen testID="activity-screen">
        <Header title={t('incomingDonations')} showBack={false} />
        {incoming.map((task) => (
          <View key={task.id} style={styles.card}>
            <View style={[styles.cardHead, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.iconBadge}><Ionicons name="restaurant-outline" size={16} color={COLORS.primary} /></View>
              <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                <Text style={[styles.title, isRTL && styles.rtl]}>{lang === 'en' ? task.title_en : task.title_ar}</Text>
                <Text style={[styles.sub, isRTL && styles.rtl]}>{task.meals} meals · {locName(task.from)}</Text>
              </View>
            </View>
            <View style={[styles.actionRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity testID={`ngo-accept-${task.id}`} onPress={() => updateTask(task.id, { status: 'accepted' })} style={[styles.actionBtn, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.actionTxt}>{t('accept')}</Text>
              </TouchableOpacity>
              <TouchableOpacity testID={`ngo-review-${task.id}`} style={[styles.actionBtn, { backgroundColor: COLORS.surfaceAlt }]}>
                <Text style={[styles.actionTxt, { color: COLORS.textPrimary }]}>{t('reviewNeeded')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Screen>
    );
  }

  // REQUESTER
  if (role === 'requester') {
    return (
      <Screen testID="activity-screen">
        <Header title={lang === 'en' ? 'My Requests' : 'طلباتي'} showBack={false} />
        <TouchableOpacity testID="new-request-btn" style={styles.newBtn} onPress={() => router.push('/request-food')}>
          <Ionicons name="add-circle" size={22} color={COLORS.primary} />
          <Text style={styles.newBtnTxt}>{lang === 'en' ? 'New Request' : 'طلب جديد'}</Text>
        </TouchableOpacity>
        {MOCK_MY_REQUESTS.map((r) => {
          const statusColor = r.status === 'matched' ? COLORS.accent : r.status === 'fulfilled' ? COLORS.accentDark : COLORS.warning;
          return (
            <View key={r.id} style={styles.card}>
              <View style={[styles.cardHead, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.iconBadge}><Ionicons name="hand-left-outline" size={16} color={COLORS.primary} /></View>
                <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                  <Text style={[styles.title, isRTL && styles.rtl]}>
                    {lang === 'en' ? `Family of ${r.familySize}` : `عائلة من ${r.familySize}`}
                  </Text>
                  <Text style={[styles.sub, isRTL && styles.rtl]}>
                    {lang === 'en' ? r.area_en : r.area_ar} · {r.date}
                  </Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: statusColor + '1A' }]}>
                  <Text style={[styles.statusTxt, { color: statusColor }]}>{r.status.toUpperCase()}</Text>
                </View>
              </View>
              {r.status !== 'pending' && (
                <Text style={[styles.matchInfo, isRTL && styles.rtl]}>
                  ✓ {lang === 'en' ? `Matched with ${r.match_en}` : `تم الربط مع ${r.match_ar}`}
                </Text>
              )}
            </View>
          );
        })}
      </Screen>
    );
  }

  // DONOR (individual / org) - My Donations
  return (
    <Screen testID="activity-screen">
      <Header title={lang === 'en' ? 'My Donations' : 'تبرعاتي'} showBack={false} />
      <TouchableOpacity testID="new-donation-btn" style={styles.newBtn} onPress={() => router.push(role === 'org' ? '/donate-bulk' : '/donate-quick')}>
        <Ionicons name="add-circle" size={22} color={COLORS.primary} />
        <Text style={styles.newBtnTxt}>{lang === 'en' ? 'New Donation' : 'تبرع جديد'}</Text>
      </TouchableOpacity>
      {MOCK_MY_DONATIONS.map((d) => {
        const isDelivered = d.status === 'delivered';
        return (
          <View key={d.id} style={styles.card}>
            <View style={[styles.cardHead, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.iconBadge}><Ionicons name="gift-outline" size={16} color={COLORS.primary} /></View>
              <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                <Text style={[styles.title, isRTL && styles.rtl]}>{lang === 'en' ? d.title_en : d.title_ar}</Text>
                <Text style={[styles.sub, isRTL && styles.rtl]}>{d.meals} meals · {d.date}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: (isDelivered ? COLORS.accent : COLORS.warning) + '1A' }]}>
                <Text style={[styles.statusTxt, { color: isDelivered ? COLORS.accentDark : COLORS.warning }]}>
                  {isDelivered ? (lang === 'en' ? 'DELIVERED' : 'تم') : (lang === 'en' ? 'IN TRANSIT' : 'في الطريق')}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm },
  cardHead: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  sub: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.md },
  routeCol: { flex: 1 },
  routeLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  routeVal: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: SPACING.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginStart: 4 },
  cta: { marginTop: SPACING.md, paddingVertical: 12, borderRadius: RADIUS.full, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontWeight: FONT.weight.semibold, fontSize: FONT.size.md },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyTxt: { marginTop: 12, color: COLORS.textMuted, fontSize: FONT.size.md, textAlign: 'center' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: SPACING.md },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.full, alignItems: 'center' },
  actionTxt: { color: '#fff', fontWeight: FONT.weight.semibold, fontSize: FONT.size.sm },
  newBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary + '10', borderWidth: 1.5, borderColor: COLORS.primary + '40', borderStyle: 'dashed', paddingVertical: 14, borderRadius: RADIUS.lg, marginBottom: SPACING.md },
  newBtnTxt: { color: COLORS.primary, fontWeight: FONT.weight.bold, fontSize: FONT.size.md, marginStart: 6 },
  matchInfo: { fontSize: FONT.size.sm, color: COLORS.accentDark, fontWeight: FONT.weight.semibold, marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.surfaceAlt },
});
