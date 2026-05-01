import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '../src/components/Screen';
import Header from '../src/components/Header';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';
import { MOCK_IMPACT, QATAR_LOCATIONS } from '../src/data/mockData';

export default function NgoDashboard() {
  const { t, tasks, lang, isRTL, updateTask } = useApp();
  const router = useRouter();

  const locName = (id: string) => {
    const l = QATAR_LOCATIONS.find((x) => x.id === id);
    return l ? (lang === 'en' ? l.en : l.ar) : id;
  };

  const incoming = tasks.slice(0, 3);
  const stats = [
    { label: t('incomingDonations'), value: tasks.length, icon: 'gift-outline' as const, color: COLORS.primary },
    { label: t('reviewNeeded'), value: 2, icon: 'alert-circle-outline' as const, color: COLORS.warning },
    { label: t('completedDeliveries'), value: MOCK_IMPACT.completedDeliveries, icon: 'checkmark-done-outline' as const, color: COLORS.accent },
  ];

  return (
    <Screen testID="ngo-dashboard-screen">
      <Header title={t('ngoDashboard')} showBack={false} />

      <View style={styles.row}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon} size={22} color={s.color} />
            <Text style={styles.statVal}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{t('incomingDonations')}</Text>
      {incoming.map((task) => (
        <View key={task.id} style={styles.taskCard}>
          <View style={[styles.taskHead, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.iconBadge}>
              <Ionicons name="restaurant-outline" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
              <Text style={[styles.taskTitle, isRTL && styles.rtl]}>
                {lang === 'en' ? task.title_en : task.title_ar}
              </Text>
              <Text style={[styles.taskSub, isRTL && styles.rtl]}>
                {task.meals} meals • {locName(task.from)} → {lang === 'en' ? task.toNgo_en : task.toNgo_ar}
              </Text>
            </View>
          </View>
          <View style={[styles.actionRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              testID={`ngo-accept-${task.id}`}
              onPress={() => updateTask(task.id, { status: 'accepted' })}
              style={[styles.actionBtn, { backgroundColor: COLORS.accent }]}
            >
              <Text style={styles.actionTxt}>{t('accept')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID={`ngo-review-${task.id}`}
              style={[styles.actionBtn, { backgroundColor: COLORS.surfaceAlt }]}
            >
              <Text style={[styles.actionTxt, { color: COLORS.textPrimary }]}>{t('reviewNeeded')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        testID="ngo-switch-role"
        style={styles.switchBtn}
        onPress={() => router.replace('/role-select')}
      >
        <Ionicons name="swap-horizontal" size={18} color={COLORS.primary} />
        <Text style={styles.switchTxt}>{t('switchRole')}</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  statVal: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginTop: 6 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginTop: SPACING.md, marginBottom: SPACING.sm },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  taskCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  taskHead: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  taskTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  taskSub: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: SPACING.md },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.full, alignItems: 'center' },
  actionTxt: { color: '#fff', fontWeight: FONT.weight.semibold, fontSize: FONT.size.sm },
  switchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: SPACING.lg, marginBottom: SPACING.xl, paddingVertical: 14, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '10', borderWidth: 1.5, borderColor: COLORS.primary + '40',
  },
  switchTxt: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.primary, marginStart: 6 },
});
