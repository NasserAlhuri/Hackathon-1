import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { LANGUAGES, Lang } from '../constants/i18n';
import { COLORS, FONT, RADIUS, SPACING, SHADOW } from '../constants/theme';

const { height: SCREEN_H } = Dimensions.get('window');

type Props = { open: boolean; onClose: () => void };

export default function LanguageSheet({ open, onClose }: Props) {
  const { lang, setLang, t } = useApp();
  const slideY = useRef(new Animated.Value(SCREEN_H)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(slideY, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: SCREEN_H, duration: 250, useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [open]);

  if (!open) return null;

  const pick = (l: Lang) => {
    setLang(l);
    onClose();
  };

  return (
    <View style={[styles.root, { pointerEvents: 'box-none' }]} testID="language-sheet">
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>{t('chooseLanguage')}</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {LANGUAGES.map((l) => {
            const active = l.id === lang;
            return (
              <TouchableOpacity
                key={l.id}
                testID={`lang-option-${l.id}`}
                onPress={() => pick(l.id)}
                activeOpacity={0.85}
                style={[styles.row, active && styles.rowActive]}
              >
                <Text style={styles.flag}>{l.flag}</Text>
                <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
                  <Text style={styles.native}>{l.native}</Text>
                  <Text style={styles.english}>{l.name}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', zIndex: 1000 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: COLORS.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.md, paddingBottom: SPACING.xxl, maxHeight: SCREEN_H * 0.7,
    ...SHADOW.md,
  },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.md },
  title: { fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.md },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  rowActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  flag: { fontSize: 28 },
  native: { fontSize: FONT.size.md, fontWeight: FONT.weight.bold, color: COLORS.textPrimary },
  english: { fontSize: FONT.size.xs, color: COLORS.textMuted, marginTop: 2 },
});
