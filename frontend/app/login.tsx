import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LogoFull } from '../src/components/NekhwaLogo';
import { useApp } from '../src/context/AppContext';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../src/constants/theme';

const DEMO_CREDENTIALS = [
  { email: 'donor@nekhwa.qa', password: 'demo123', label: 'Donor' },
  { email: 'volunteer@nekhwa.qa', password: 'demo123', label: 'Volunteer' },
  { email: 'recipient@nekhwa.qa', password: 'demo123', label: 'Recipient' },
  { email: 'ngo@nekhwa.qa', password: 'demo123', label: 'NGO' },
];

export default function Login() {
  const router = useRouter();
  const { t, isRTL } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    const valid = DEMO_CREDENTIALS.find((c) => c.email === email.trim().toLowerCase() && c.password === password);
    if (!valid && (email || password)) {
      setError('Invalid credentials. Use a demo account below.');
      return;
    }
    router.replace('/role-select');
  };

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.inner}>
        <LogoFull size={90} style={styles.logo} />

        <Text style={[styles.welcome, isRTL && styles.rtl]}>{t('welcomeBack')}</Text>
        <Text style={[styles.sub, isRTL && styles.rtl]}>{t('signInToContinue')}</Text>

        <View style={styles.form}>
          <Text style={[styles.label, isRTL && styles.rtl]}>{t('email')}</Text>
          <TextInput
            testID="login-email"
            style={[styles.input, isRTL && styles.inputRtl]}
            value={email}
            onChangeText={(v) => { setEmail(v); setError(''); }}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            textAlign={isRTL ? 'right' : 'left'}
          />

          <Text style={[styles.label, { marginTop: SPACING.md }, isRTL && styles.rtl]}>{t('password')}</Text>
          <TextInput
            testID="login-password"
            style={[styles.input, isRTL && styles.inputRtl]}
            value={password}
            onChangeText={(v) => { setPassword(v); setError(''); }}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            textAlign={isRTL ? 'right' : 'left'}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity testID="login-signin-btn" style={styles.btn} activeOpacity={0.85} onPress={handleSignIn}>
            <Text style={styles.btnTxt}>{t('signIn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity testID="login-demo-btn" style={styles.demoBtn} activeOpacity={0.85} onPress={() => router.replace('/role-select')}>
            <Text style={styles.demoBtnTxt}>{t('continueAsDemo')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>{t('demoAccounts')}</Text>
          <View style={styles.chipRow}>
            {DEMO_CREDENTIALS.map((c) => (
              <TouchableOpacity key={c.label} testID={`demo-chip-${c.label.toLowerCase()}`} style={styles.chip} onPress={() => fillDemo(c)}>
                <Text style={styles.chipTxt}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.demoHint}>{t('demoPasswordHint')}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  inner: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: 64, paddingBottom: SPACING.xl },
  logo: { alignSelf: 'center', marginBottom: SPACING.xl },
  welcome: { fontSize: FONT.size.xxl, fontWeight: FONT.weight.extrabold, color: COLORS.textPrimary, textAlign: 'center' },
  sub: { fontSize: FONT.size.md, color: COLORS.textMuted, textAlign: 'center', marginTop: 4, marginBottom: SPACING.xl },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  form: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  label: { fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, marginBottom: 6 },
  input: { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: 12, fontSize: FONT.size.md, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  inputRtl: { textAlign: 'right' },
  error: { color: COLORS.error, fontSize: FONT.size.sm, marginTop: SPACING.sm },
  btn: { marginTop: SPACING.lg, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: RADIUS.full, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: FONT.weight.bold, fontSize: FONT.size.md },
  demoBtn: { marginTop: SPACING.md, paddingVertical: 14, borderRadius: RADIUS.full, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.primary + '60' },
  demoBtnTxt: { color: COLORS.primary, fontWeight: FONT.weight.semibold, fontSize: FONT.size.md },
  demoSection: { marginTop: SPACING.xl },
  demoTitle: { fontSize: FONT.size.xs, fontWeight: FONT.weight.bold, color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', marginBottom: SPACING.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { backgroundColor: COLORS.primary + '15', borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary + '40' },
  chipTxt: { color: COLORS.primary, fontWeight: FONT.weight.semibold, fontSize: FONT.size.sm },
  demoHint: { fontSize: FONT.size.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.sm },
});
