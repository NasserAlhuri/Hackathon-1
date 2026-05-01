import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SPACING } from '../src/constants/theme';
import QatariPattern, { DhowBoat, PalmTree } from '../src/components/QatariPattern';

export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const dhowFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 650, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dhowFloat, { toValue: 1, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(dhowFloat, { toValue: 0, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();

    const timer = setTimeout(() => {
      router.replace('/role-select');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const dhowY = dhowFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <View testID="splash-screen" style={styles.container}>
      <QatariPattern color="#fff" opacity={0.07} size={48} />
      <View style={[styles.blob, { top: -80, left: -80, backgroundColor: COLORS.primaryDark }]} />
      <View style={[styles.blob, { bottom: -100, right: -100, width: 260, height: 260, backgroundColor: COLORS.primaryLight, opacity: 0.35 }]} />

      {/* Decorative palm trees */}
      <View style={{ position: 'absolute', bottom: 60, left: 30, opacity: 0.5 }}>
        <PalmTree size={48} color="#5DEE9C" />
      </View>
      <View style={{ position: 'absolute', bottom: 90, right: 40, opacity: 0.45 }}>
        <PalmTree size={40} color="#5DEE9C" />
      </View>
      {/* Floating dhow */}
      <Animated.View style={{ position: 'absolute', bottom: 110, alignSelf: 'center', transform: [{ translateY: dhowY }], opacity: 0.7 }}>
        <DhowBoat width={120} height={50} color="#FFD7A8" />
      </Animated.View>

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
  container: { flex: 1, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blob: { position: 'absolute', width: 200, height: 200, borderRadius: 200, opacity: 0.5 },
  logo: { width: 96, height: 96, borderRadius: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  titleEn: { fontSize: 42, fontWeight: FONT.weight.extrabold, color: '#fff', letterSpacing: 1 },
  titleAr: { fontSize: 34, fontWeight: FONT.weight.bold, color: '#fff', marginTop: 2 },
  divider: { width: 48, height: 3, backgroundColor: COLORS.accent, marginVertical: SPACING.md, borderRadius: 2 },
  tagline: { color: '#fff', opacity: 0.85, fontSize: FONT.size.sm, letterSpacing: 1.2, textTransform: 'uppercase' },
});
