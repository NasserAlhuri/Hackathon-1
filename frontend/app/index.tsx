import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONT, SPACING } from '../src/constants/theme';
import QatariPattern, { DhowBoat, PalmTree } from '../src/components/QatariPattern';
import { LogoFull } from '../src/components/NekhwaLogo';
import { DohaSkyline } from '../src/components/QatariLandmarks';

export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const dhowFloat = useRef(new Animated.Value(0)).current;
  const sloganFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 650, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.timing(sloganFade, { toValue: 1, duration: 900, delay: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dhowFloat, { toValue: 1, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(dhowFloat, { toValue: 0, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2800);
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

      {/* Doha skyline at the very bottom */}
      <DohaSkyline
        white
        width="100%"
        height={80}
        opacity={0.25}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      />

      <Animated.View style={{ opacity: fade, transform: [{ scale }], alignItems: 'center' }}>
        <LogoFull size={120} white testID="splash-logo" />
      </Animated.View>

      <Animated.View style={[styles.sloganWrap, { opacity: sloganFade }]}>
        <Text style={styles.sloganAr}>ارفع فائضك واصنع أثرك</Text>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <View style={styles.diamond} />
          <View style={styles.dividerLine} />
        </View>
        <Text style={styles.sloganEn}>Lift Your Surplus, Create an Impact.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blob: { position: 'absolute', width: 200, height: 200, borderRadius: 200, opacity: 0.5 },
  sloganWrap: { position: 'absolute', bottom: 56, alignItems: 'center', paddingHorizontal: SPACING.xl },
  sloganAr: { color: '#fff', fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, opacity: 0.9, textAlign: 'center', letterSpacing: 0.5 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, width: 180 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
  diamond: { width: 7, height: 7, borderTopWidth: 3.5, borderBottomWidth: 3.5, borderLeftWidth: 3.5, borderRightWidth: 3.5, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'rgba(255,255,255,0.8)', borderBottomColor: 'rgba(255,255,255,0.8)', marginHorizontal: 8, transform: [{ rotate: '45deg' }] },
  sloganEn: { color: '#fff', fontSize: FONT.size.sm, opacity: 0.8, textAlign: 'center', fontStyle: 'italic', letterSpacing: 0.3 },
});
