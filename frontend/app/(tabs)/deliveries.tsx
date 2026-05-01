import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';
import { QATAR_LOCATIONS } from '../../src/data/mockData';

export default function Deliveries() {
  const { t, tasks, lang, isRTL, updateTask } = useApp();

  const locName = (id: string) => {
    const l = QATAR_LOCATIONS.find((x) => x.id === id);
    return l ? (lang === 'en' ? l.en : l.ar) : id;
  };

  const openTasks = tasks.filter((x) => x.status !== 'delivered');

  const advance = (id: string, to: 'accepted' | 'pickup' | 'onway' | 'delivered') => {
    updateTask(id, { status: to });
  };

  return (
    <Screen testID="deliveries-screen">
      <Header title={t('nearbyTasks')} showBack={false} />

      {openTasks.map((task) => {
        const label =
          task.status === 'open'
            ? t('accept')
            : task.status === 'accepted'
            ? t('markPickup')
            : task.status === 'pickup'
            ? t('markOnWay')
            : t('confirmDelivery');

        const nextStatus =
          task.status === 'open'
            ? 'accepted'
            : task.status === 'accepted'
            ? 'pickup'
            : task.status === 'pickup'
            ? 'onway'
            : 'delivered';

        const btnColor =
          task.status === 'open' ? COLORS.accent : COLORS.primary;

        return (
          <View key={task.id} testID={`task-card-${task.id}`} style={styles.card}>
            <View style={[styles.cardHead, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.iconBadge}>
                <Ionicons name="restaurant-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                <Text style={[styles.title, isRTL && styles.rtl]}>
                  {lang === 'en' ? task.title_en : task.title_ar}
                </Text>
                <Text style={[styles.sub, isRTL && styles.rtl]}>
                  {task.meals} {t('mealsRescued').toLowerCase()} · {task.distanceKm} {t('distance')}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      task.status === 'open'
                        ? COLORS.accent + '1A'
                        : task.status === 'delivered'
                        ? COLORS.accent + '1A'
                        : COLORS.warning + '26',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusTxt,
                    {
                      color:
                        task.status === 'open' || task.status === 'delivered'
                          ? COLORS.accentDark
                          : COLORS.warning,
                    },
                  ]}
                >
                  {task.status === 'open' ? 'OPEN' : task.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.routeCol}>
                <Text style={styles.routeLabel}>{t('fromLabel')}</Text>
                <Text style={styles.routeVal}>{locName(task.from)}</Text>
              </View>
              <Ionicons
                name={isRTL ? 'arrow-back' : 'arrow-forward'}
                size={18}
                color={COLORS.textMuted}
              />
              <View style={[styles.routeCol, { alignItems: 'flex-end' }]}>
                <Text style={styles.routeLabel}>{t('toLabel')}</Text>
                <Text style={styles.routeVal}>
                  {lang === 'en' ? task.toNgo_en : task.toNgo_ar}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.meta}>
                <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.metaTxt}>{task.scheduledIn}</Text>
              </View>
              <View style={styles.meta}>
                <Ionicons name="car-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.metaTxt}>{t(task.vehicle)}</Text>
              </View>
            </View>

            <TouchableOpacity
              testID={`task-advance-${task.id}`}
              activeOpacity={0.85}
              onPress={() => {
                advance(task.id, nextStatus);
                if (nextStatus === 'delivered') {
                  Alert.alert(t('taskCompleted'), t('success_thanks'));
                }
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
          <Text style={styles.emptyTxt}>All deliveries completed. Great work!</Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  sub: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  routeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginTop: SPACING.md,
  },
  routeCol: { flex: 1 },
  routeLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  routeVal: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: SPACING.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginStart: 4 },
  cta: {
    marginTop: SPACING.md, paddingVertical: 12,
    borderRadius: RADIUS.full, alignItems: 'center',
  },
  ctaTxt: { color: '#fff', fontWeight: FONT.weight.semibold, fontSize: FONT.size.md },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyTxt: { marginTop: 12, color: COLORS.textMuted, fontSize: FONT.size.md },
});
