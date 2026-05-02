import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../src/components/Screen';
import { useApp, Role } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';
import LanguageSheet from '../src/components/LanguageSheet';
import { LANGUAGES } from '../src/constants/i18n';
import { TraditionalMinaret } from '../src/components/QatariLandmarks';

const ROLES: { id: Exclude<Role, null>; icon: keyof typeof Ionicons.glyphMap; titleKey: string; descKey: string; color: string }[] = [
  { id: 'donor', icon: 'gift-outline', titleKey: 'donor', descKey: 'donorDesc', color: COLORS.primary },
  { id: 'volunteer', icon: 'car-outline', titleKey: 'volunteer', descKey: 'volunteerDesc', color: COLORS.accent },
  { id: 'recipient', icon: 'people-circle-outline', titleKey: 'recipient', descKey: 'recipientDesc', color: COLORS.warning },
];

export default function RoleSelect() {
  const router = useRouter();
  const { t, setRole, lang, isRTL } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.id === lang);

  const pick = (r: Exclude<Role, null>) => {
    setRole(r);
    router.replace('/(tabs)/home');
  };

  return (
    <>
      {/* Traditional minaret – bottom-right decorative accent */}
      <TraditionalMinaret
        height={180}
        width={90}
        opacity={0.07}
        style={{ position: 'absolute', right: 0, bottom: 40, zIndex: 0 }}
      />
      <Screen testID="role-select-screen">
        <View style={[styles.topBar, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.brandRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.brandMark}>
              <Ionicons name="restaurant" size={20} color={COLORS.primary} />
            </View>
            <View style={{ marginHorizontal: SPACING.sm }}>
              <Text style={[styles.brandName, isRTL && styles.rtlText]}>{t('appName')}</Text>
              <Text style={[styles.brandTag, isRTL && styles.rtlText]}>{t('tagline')}</Text>
            </View>
          </View>
          <TouchableOpacity
            testID="lang-toggle-button"
            onPress={() => setLangOpen(true)}
            style={styles.langBtn}
          >
            <Text style={styles.langFlag}>{currentLang?.flag}</Text>
            <Text style={[styles.langText, isRTL && styles.rtlText]} numberOfLines={1}>{currentLang?.native}</Text>
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
                <Ionicons name={r.icon} size={28} color={r.color} />
              </View>
              <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>{t(r.titleKey)}</Text>
                <Text style={[styles.cardDesc, isRTL && styles.rtlText]}>{t(r.descKey)}</Text>
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </Screen>
      <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  brandTag: { fontSize: FONT.size.xs, color: COLORS.textMuted },
  langBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, maxWidth: 140 },
  langFlag: { fontSize: 16, marginEnd: 6 },
  langText: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary },
  h1: { fontSize: FONT.size.xxl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, marginTop: SPACING.sm },
  sub: { fontSize: FONT.size.md, color: COLORS.textSecondary, marginTop: 4 },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOW.sm },
  iconWrap: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  cardDesc: { fontSize: FONT.size.sm, color: COLORS.textMuted, marginTop: 2 },
});
