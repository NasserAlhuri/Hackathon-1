import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';
import { MOCK_IMPACT } from '../../src/data/mockData';

export default function Impact() {
  const { t, isRTL } = useApp();
  const maxVal = Math.max(...MOCK_IMPACT.weeklyTrend);

  const stats = [
    { key: 'meals', label: t('mealsRescued'), value: MOCK_IMPACT.mealsRescued.toLocaleString(), icon: 'restaurant-outline' as const, color: COLORS.primary },
    { key: 'waste', label: t('wasteReduced'), value: `${MOCK_IMPACT.wasteReducedKg.toLocaleString()} ${t('kg')}`, icon: 'leaf-outline' as const, color: COLORS.accent },
    { key: 'vol', label: t('activeVolunteers'), value: `${MOCK_IMPACT.activeVolunteers}`, icon: 'people-outline' as const, color: COLORS.primaryDark },
    { key: 'del', label: t('completedDeliveries'), value: MOCK_IMPACT.completedDeliveries.toLocaleString(), icon: 'car-outline' as const, color: COLORS.accentDark },
    { key: 'areas', label: t('areasServed'), value: `${MOCK_IMPACT.areasServed}`, icon: 'location-outline' as const, color: COLORS.warning },
  ];

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <Screen testID="impact-screen">
      <Header title={t('impactDashboard')} showBack={false} />

      {/* Weekly chart */}
      <View style={styles.chartCard}>
        <Text style={[styles.cardTitle, isRTL && styles.rtl]}>This Week</Text>
        <View style={styles.barRow}>
          {MOCK_IMPACT.weeklyTrend.map((v, i) => {
            const h = (v / maxVal) * 120;
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

      {/* Stat cards */}
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm,
  },
  cardTitle: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 170 },
  barCol: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  bar: { width: 20, borderRadius: 8, marginBottom: 6 },
  barVal: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600', marginBottom: 2 },
  barDay: { fontSize: FONT.size.xs, color: COLORS.textSecondary, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '48%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm,
  },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: FONT.size.xl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary },
  statLabel: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
});
