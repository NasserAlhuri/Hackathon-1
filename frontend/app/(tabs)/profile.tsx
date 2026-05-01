import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import { useApp } from '../../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../../src/constants/theme';

export default function Profile() {
  const router = useRouter();
  const { t, lang, setLang, role, isRTL, notifications, setNotifications } = useApp();

  const roleLabel = () => {
    switch (role) {
      case 'individual': return t('individualDonor');
      case 'org': return t('orgDonor');
      case 'volunteer': return t('volunteer');
      case 'ngo': return t('ngo');
      case 'requester': return t('requester');
      default: return '-';
    }
  };

  return (
    <Screen testID="profile-screen">
      <Header title={t('profile')} showBack={false} />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={{ marginHorizontal: SPACING.md, flex: 1 }}>
          <Text style={styles.name}>Ahmed Al-Mahmoud</Text>
          <Text style={styles.role}>{roleLabel()}</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={14} color={COLORS.accentDark} />
          <Text style={styles.verifiedTxt}>{t('verified')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('verification')}</Text>
        <View style={styles.row}>
          <Ionicons name="card-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.rowLabel}>Qatar ID</Text>
          <Text style={styles.rowVal}>••••• 4821</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.rowLabel}>Phone</Text>
          <Text style={styles.rowVal}>+974 •••• 3421</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <TouchableOpacity
          testID="profile-lang-toggle"
          style={styles.row}
          onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
        >
          <Ionicons name="globe-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.rowLabel}>{t('language')}</Text>
          <Text style={styles.rowVal}>{lang === 'en' ? 'English' : 'العربية'}</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.rowLabel}>{t('notifications')}</Text>
          <Switch
            testID="profile-notifications-switch"
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.accentLight }}
            thumbColor={notifications ? COLORS.accent : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity
        testID="profile-switch-role"
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
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: FONT.size.xl, fontWeight: FONT.weight.bold },
  name: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  role: { fontSize: FONT.size.sm, color: COLORS.textMuted, marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accent + '1A', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  verifiedTxt: { fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.accentDark, marginStart: 4 },
  section: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl,
    padding: SPACING.md, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  sectionTitle: { fontSize: FONT.size.sm, fontWeight: FONT.weight.bold, color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: SPACING.sm },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceAlt,
  },
  rowLabel: { flex: 1, fontSize: FONT.size.md, color: COLORS.textPrimary, marginStart: 12 },
  rowVal: { fontSize: FONT.size.sm, color: COLORS.textSecondary, fontWeight: FONT.weight.medium },
  switchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: SPACING.lg, paddingVertical: 14, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '10', borderWidth: 1.5, borderColor: COLORS.primary + '40',
  },
  switchTxt: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, color: COLORS.primary, marginStart: 6 },
});
