import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import QatariPattern, { DhowBoat, PalmTree } from '../src/components/QatariPattern';
import { LogoFull } from '../src/components/NekhwaLogo';

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
      router.replace('/login');
    }, 2000);
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
        <LogoFull size={120} white testID="splash-logo" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blob: { position: 'absolute', width: 200, height: 200, borderRadius: 200, opacity: 0.5 },
});
