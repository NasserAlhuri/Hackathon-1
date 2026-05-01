import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Screen from '../src/components/Screen';
import Header from '../src/components/Header';
import Button from '../src/components/Button';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';

type Level = 'safe' | 'caution' | 'risky';

export default function SafetyResult() {
  const router = useRouter();
  const { t, isRTL } = useApp();
  const params = useLocalSearchParams<{ level: Level; window: string; meals: string; location: string }>();

  const level = (params.level || 'safe') as Level;
  const windowMin = parseInt((params.window as string) || '0', 10);

  const config = {
    safe: { icon: 'shield-checkmark' as const, color: COLORS.accent, bg: COLORS.accent + '15', title: t('safe'), msg: t('safeMsg') },
    caution: { icon: 'alert-circle' as const, color: COLORS.warning, bg: COLORS.warning + '20', title: t('caution'), msg: t('cautionMsg') },
    risky: { icon: 'warning' as const, color: COLORS.error, bg: COLORS.error + '15', title: t('risky'), msg: t('riskyMsg') },
  }[level];

  const hours = Math.floor(windowMin / 60);
  const mins = windowMin % 60;

  return (
    <Screen testID="safety-result-screen">
      <Header title={t('safetyCheck')} />

      <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.color + '55' }]}>
        <View style={[styles.iconCircle, { backgroundColor: config.color }]}>
          <Ionicons name={config.icon} size={36} color="#fff" />
        </View>
        <Text style={[styles.levelTitle, { color: config.color }]}>{config.title}</Text>
        <Text style={[styles.levelMsg, isRTL && styles.rtl]}>{config.msg}</Text>
      </View>

      {level !== 'risky' && (
        <View style={[styles.infoCard, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="time-outline" size={22} color={COLORS.primary} />
          <View style={{ marginHorizontal: SPACING.md, flex: 1 }}>
            <Text style={styles.infoLabel}>{t('deliveryWindow')}</Text>
            <Text style={styles.infoValue}>
              {hours > 0 ? `${hours} ${t('hours')} ` : ''}
              {mins > 0 ? `${mins} ${t('minutes')}` : ''}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{t('donationSummary')}</Text>
        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>{t('mealsLabel')}</Text>
          <Text style={styles.sumVal}>{params.meals}</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>{t('locationLabel')}</Text>
          <Text style={styles.sumVal}>{params.location}</Text>
        </View>
      </View>

      <View style={{ marginTop: SPACING.lg, gap: 12 }}>
        {level === 'risky' ? (
          <Button
            testID="notify-ngo-btn"
            label={t('notifyNgo')}
            variant="secondary"
            onPress={() => router.replace('/(tabs)/home')}
          />
        ) : (
          <Button
            testID="find-volunteer-btn"
            label={t('findVolunteer')}
            onPress={() => router.replace('/(tabs)/activity')}
          />
        )}
        <Button testID="safety-done-btn" label={t('back')} variant="outline" onPress={() => router.replace('/(tabs)/home')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xxl, padding: SPACING.lg,
    borderWidth: 1, alignItems: 'center', ...SHADOW.sm,
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  levelTitle: { fontSize: FONT.size.xxl, fontWeight: FONT.weight.extrabold },
  levelMsg: { fontSize: FONT.size.md, color: COLORS.textPrimary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  infoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.md, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  infoLabel: { fontSize: FONT.size.xs, color: COLORS.textMuted, letterSpacing: 0.5 },
  infoValue: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, marginTop: 2 },
  summaryCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.md, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  summaryTitle: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  sumLabel: { color: COLORS.textSecondary },
  sumVal: { color: COLORS.textPrimary, fontWeight: FONT.weight.semibold },
});
