import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SPACING } from '../src/constants/theme';

export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/role-select');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View testID="splash-screen" style={styles.container}>
      {/* Decorative blobs */}
      <View style={[styles.blob, { top: -80, left: -80, backgroundColor: COLORS.primaryDark }]} />
      <View
        style={[
          styles.blob,
          { bottom: -100, right: -100, width: 260, height: 260, backgroundColor: COLORS.primaryLight, opacity: 0.35 },
        ]}
      />

      <Animated.View style={{ opacity: fade, transform: [{ scale }], alignItems: 'center' }}>
        <View style={styles.logo}>
          <Ionicons name="restaurant" size={48} color={COLORS.primary} />
        </View>
        <Text testID="splash-title-en" style={styles.titleEn}>Nekhwa</Text>
        <Text testID="splash-title-ar" style={styles.titleAr}>نخوة</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Community Food Rescue • Qatar</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 200,
    opacity: 0.5,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  titleEn: {
    fontSize: 42,
    fontWeight: FONT.weight.extrabold,
    color: '#fff',
    letterSpacing: 1,
  },
  titleAr: {
    fontSize: 34,
    fontWeight: FONT.weight.bold,
    color: '#fff',
    marginTop: 2,
  },
  divider: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.accent,
    marginVertical: SPACING.md,
    borderRadius: 2,
  },
  tagline: {
    color: '#fff',
    opacity: 0.85,
    fontSize: FONT.size.sm,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
