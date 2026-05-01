import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../src/components/Screen';
import { useApp, Role } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';

type RoleCard = {
  id: Exclude<Role, null>;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: Parameters<ReturnType<typeof useApp>['t']>[0];
  descKey: Parameters<ReturnType<typeof useApp>['t']>[0];
  color: string;
};

const ROLES: RoleCard[] = [
  { id: 'individual', icon: 'person-outline', titleKey: 'individualDonor', descKey: 'individualDonorDesc', color: COLORS.primary },
  { id: 'org', icon: 'business-outline', titleKey: 'orgDonor', descKey: 'orgDonorDesc', color: COLORS.primaryDark },
  { id: 'volunteer', icon: 'car-outline', titleKey: 'volunteer', descKey: 'volunteerDesc', color: COLORS.accent },
  { id: 'ngo', icon: 'heart-outline', titleKey: 'ngo', descKey: 'ngoDesc', color: COLORS.accentDark },
  { id: 'requester', icon: 'hand-left-outline', titleKey: 'requester', descKey: 'requesterDesc', color: COLORS.warning },
];

export default function RoleSelect() {
  const router = useRouter();
  const { t, setRole, lang, setLang, isRTL } = useApp();

  const pick = (r: Exclude<Role, null>) => {
    setRole(r);
    if (r === 'volunteer') router.replace('/(tabs)/deliveries');
    else if (r === 'ngo') router.replace('/ngo-dashboard');
    else if (r === 'requester') router.replace('/request-food');
    else router.replace('/(tabs)/home');
  };

  return (
    <Screen testID="role-select-screen">
      <View style={[styles.topBar, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Ionicons name="restaurant" size={20} color={COLORS.primary} />
          </View>
          <View style={{ marginHorizontal: SPACING.sm }}>
            <Text style={styles.brandName}>{t('appName')}</Text>
            <Text style={styles.brandTag}>{t('tagline')}</Text>
          </View>
        </View>
        <TouchableOpacity
          testID="lang-toggle-button"
          onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
          style={styles.langBtn}
        >
          <Text style={styles.langText}>{lang === 'en' ? 'العربية' : 'English'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.h1, isRTL && styles.rtlText]}>{t('chooseRole')}</Text>
      <Text style={[styles.sub, isRTL && styles.rtlText]}>{t('roleSubtitle')}</Text>

      <View style={{ marginTop: SPACING.lg }}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.id}
            testID={`role-${r.id}-card`}
            activeOpacity={0.85}
            onPress={() => pick(r.id)}
            style={[styles.card, isRTL && { flexDirection: 'row-reverse' }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: r.color + '1A' }]}>
              <Ionicons name={r.icon} size={26} color={r.color} />
            </View>
            <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
              <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>{t(r.titleKey)}</Text>
              <Text style={[styles.cardDesc, isRTL && styles.rtlText]}>{t(r.descKey)}</Text>
            </View>
            <Ionicons
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandMark: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  brandName: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  brandTag: { fontSize: FONT.size.xs, color: COLORS.textMuted },
  langBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border,
  },
  langText: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary },
  h1: { fontSize: FONT.size.xxl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginTop: SPACING.sm },
  sub: { fontSize: FONT.size.md, color: COLORS.textSecondary, marginTop: 4 },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  iconWrap: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  cardDesc: { fontSize: FONT.size.sm, color: COLORS.textMuted, marginTop: 2 },
});
