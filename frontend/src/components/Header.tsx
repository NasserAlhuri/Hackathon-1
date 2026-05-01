import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONT, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';

type Props = { title: string; showBack?: boolean; right?: React.ReactNode };

export default function Header({ title, showBack = true, right }: Props) {
  const router = useRouter();
  const { isRTL } = useApp();
  return (
    <View style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]}>
      <View style={[styles.side, isRTL && { alignItems: 'flex-end' }]}>
        {showBack && (
          <TouchableOpacity
            testID="header-back-button"
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  side: { width: 60 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.textPrimary,
  },
});
