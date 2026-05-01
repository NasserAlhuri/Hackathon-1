import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { COLORS, RADIUS, FONT, SHADOW } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
  fullWidth?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  testID,
  fullWidth = true,
}: Props) {
  const base = [styles.base, fullWidth && styles.fullWidth];
  const variantStyles: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: COLORS.primary, ...SHADOW.sm },
    secondary: { backgroundColor: COLORS.accent, ...SHADOW.sm },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
    ghost: { backgroundColor: 'transparent' },
  };
  const textColor =
    variant === 'outline' ? COLORS.primary : variant === 'ghost' ? COLORS.textPrimary : '#fff';
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[...base, variantStyles[variant], (disabled || loading) && { opacity: 0.5 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  fullWidth: { alignSelf: 'stretch' },
  label: { fontSize: FONT.size.md, fontWeight: FONT.weight.semibold, letterSpacing: 0.2 },
});
