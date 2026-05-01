import React from 'react';
import { Image, Text, View, StyleSheet, Platform } from 'react-native';
import { COLORS, FONT, SPACING } from '../constants/theme';

// SVG logo mark — maroon on transparent
const MARK_DARK_B64 =
  'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMDAgMjEwJyBmaWxsPSdub25lJz4KICA8Y2lyY2xlIGN4PScxMDAnIGN5PScxOCcgcj0nNycgc3Ryb2tlPScjOEExNTM4JyBzdHJva2Utd2lkdGg9JzIuNScvPgogIDxwYXRoIGQ9J005NyAxMSBRMTAwIDQgMTAzIDExJyBzdHJva2U9JyM4QTE1MzgnIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPHBhdGggZD0nTTk0IDI0IFE3MiA3OCA1MCAxMjgnIHN0cm9rZT0nIzhBMTUzOCcgc3Ryb2tlLXdpZHRoPScyLjUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgogIDxwYXRoIGQ9J00xMDYgMjQgUTEyOCA3OCAxNTAgMTI4JyBzdHJva2U9JyM4QTE1MzgnIHN0cm9rZS13aWR0aD0nMi41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnLz4KICA8cmVjdCB4PSc0MicgeT0nMTI2JyB3aWR0aD0nMTE2JyBoZWlnaHQ9JzcnIHJ4PSczLjUnIGZpbGw9JyM4QTE1MzgnLz4KICA8bGluZSB4MT0nNTEnIHkxPScxMzMnIHgyPSc1MScgeTI9JzE2OCcgc3Ryb2tlPScjOEExNTM4JyBzdHJva2Utd2lkdGg9JzIuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPGxpbmUgeDE9JzE0OScgeTE9JzEzMycgeDI9JzE0OScgeTI9JzE2OCcgc3Ryb2tlPScjOEExNTM4JyBzdHJva2Utd2lkdGg9JzIuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPGNpcmNsZSBjeD0nNTEnIGN5PScxNzQnIHI9JzYnIHN0cm9rZT0nIzhBMTUzOCcgc3Ryb2tlLXdpZHRoPScyLjUnLz4KICA8Y2lyY2xlIGN4PScxNDknIGN5PScxNzQnIHI9JzYnIHN0cm9rZT0nIzhBMTUzOCcgc3Ryb2tlLXdpZHRoPScyLjUnLz4KICA8Y2lyY2xlIGN4PScxMDAnIGN5PSc2Micgcj0nNScgZmlsbD0nIzhBMTUzOCcvPgogIDxwYXRoIGQ9J00xMDAgNTAgTDYyIDEzNCBMMTM4IDEzNCBaJyBzdHJva2U9JyM4QTE1MzgnIHN0cm9rZS13aWR0aD0nMi41JyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+CiAgPHBvbHlsaW5lIHBvaW50cz0nNzYsOTAgODAsODUgODQsOTAgODgsODUgOTIsOTAgOTYsODUgMTAwLDkwIDEwNCw4NSAxMDgsOTAgMTEyLDg1IDExNiw5MCAxMjAsODUgMTI0LDkwJyBzdHJva2U9JyM4QTE1MzgnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz4KICA8cG9seWxpbmUgcG9pbnRzPSc3MCwxMDYgNzQsMTAxIDc4LDEwNiA4MiwxMDEgODYsMTA2IDkwLDEwMSA5NCwxMDYgOTgsMTAxIDEwMiwxMDYgMTA2LDEwMSAxMTAsMTA2IDExNCwxMDEgMTE4LDEwNiAxMjIsMTAxIDEyNiwxMDYgMTMwLDEwMSAxMzAsMTA2JyBzdHJva2U9JyM4QTE1MzgnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz4KICA8cG9seWxpbmUgcG9pbnRzPSc2NSwxMjAgNjksMTE1IDczLDEyMCA3NywxMTUgODEsMTIwIDg1LDExNSA4OSwxMjAgOTMsMTE1IDk3LDEyMCAxMDEsMTE1IDEwNSwxMjAgMTA5LDExNSAxMTMsMTIwIDExNywxMTUgMTIxLDEyMCAxMjUsMTE1IDEyOSwxMjAgMTMzLDExNSAxMzUsMTIwJyBzdHJva2U9JyM4QTE1MzgnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz4KICA8bGluZSB4MT0nNjAnIHkxPScxMzQnIHgyPScxNDAnIHkyPScxMzQnIHN0cm9rZT0nIzhBMTUzOCcgc3Ryb2tlLXdpZHRoPScyLjUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgogIDxwYXRoIGQ9J002MiAxNDAgUTEwMCAxNTUgMTM4IDE0MCcgc3Ryb2tlPScjOEExNTM4JyBzdHJva2Utd2lkdGg9JzIuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPHBhdGggZD0nTTcwIDE0NiBRMTAwIDE1NyAxMzAgMTQ2JyBzdHJva2U9JyM4QTE1MzgnIHN0cm9rZS13aWR0aD0nMS41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnLz4KPC9zdmc+';

// White version for use on dark backgrounds
const MARK_WHITE_B64 =
  'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMDAgMjEwJyBmaWxsPSdub25lJz4KICA8Y2lyY2xlIGN4PScxMDAnIGN5PScxOCcgcj0nNycgc3Ryb2tlPScjRkZGRkZGJyBzdHJva2Utd2lkdGg9JzIuNScvPgogIDxwYXRoIGQ9J005NyAxMSBRMTAwIDQgMTAzIDExJyBzdHJva2U9JyNGRkZGRkYnIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPHBhdGggZD0nTTk0IDI0IFE3MiA3OCA1MCAxMjgnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLXdpZHRoPScyLjUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgogIDxwYXRoIGQ9J00xMDYgMjQgUTEyOCA3OCAxNTAgMTI4JyBzdHJva2U9JyNGRkZGRkYnIHN0cm9rZS13aWR0aD0nMi41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnLz4KICA8cmVjdCB4PSc0MicgeT0nMTI2JyB3aWR0aD0nMTE2JyBoZWlnaHQ9JzcnIHJ4PSczLjUnIGZpbGw9JyNGRkZGRkYnLz4KICA8bGluZSB4MT0nNTEnIHkxPScxMzMnIHgyPSc1MScgeTI9JzE2OCcgc3Ryb2tlPScjRkZGRkZGJyBzdHJva2Utd2lkdGg9JzIuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPGxpbmUgeDE9JzE0OScgeTE9JzEzMycgeDI9JzE0OScgeTI9JzE2OCcgc3Ryb2tlPScjRkZGRkZGJyBzdHJva2Utd2lkdGg9JzIuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPGNpcmNsZSBjeD0nNTEnIGN5PScxNzQnIHI9JzYnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLXdpZHRoPScyLjUnLz4KICA8Y2lyY2xlIGN4PScxNDknIGN5PScxNzQnIHI9JzYnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLXdpZHRoPScyLjUnLz4KICA8Y2lyY2xlIGN4PScxMDAnIGN5PSc2Micgcj0nNScgZmlsbD0nI0ZGRkZGRicvPgogIDxwYXRoIGQ9J00xMDAgNTAgTDYyIDEzNCBMMTM4IDEzNCBaJyBzdHJva2U9JyNGRkZGRkYnIHN0cm9rZS13aWR0aD0nMi41JyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+CiAgPHBvbHlsaW5lIHBvaW50cz0nNzYsOTAgODAsODUgODQsOTAgODgsODUgOTIsOTAgOTYsODUgMTAwLDkwIDEwNCw4NSAxMDgsOTAgMTEyLDg1IDExNiw5MCAxMjAsODUgMTI0LDkwJyBzdHJva2U9JyNGRkZGRkYnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz4KICA8cG9seWxpbmUgcG9pbnRzPSc3MCwxMDYgNzQsMTAxIDc4LDEwNiA4MiwxMDEgODYsMTA2IDkwLDEwMSA5NCwxMDYgOTgsMTAxIDEwMiwxMDYgMTA2LDEwMSAxMTAsMTA2IDExNCwxMDEgMTE4LDEwNiAxMjIsMTAxIDEyNiwxMDYgMTMwLDEwMSAxMzAsMTA2JyBzdHJva2U9JyNGRkZGRkYnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz4KICA8cG9seWxpbmUgcG9pbnRzPSc2NSwxMjAgNjksMTE1IDczLDEyMCA3NywxMTUgODEsMTIwIDg1LDExNSA4OSwxMjAgOTMsMTE1IDk3LDEyMCAxMDEsMTE1IDEwNSwxMjAgMTA5LDExNSAxMTMsMTIwIDExNywxMTUgMTIxLDEyMCAxMjUsMTE1IDEyOSwxMjAgMTMzLDExNSAxMzUsMTIwJyBzdHJva2U9JyNGRkZGRkYnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz4KICA8bGluZSB4MT0nNjAnIHkxPScxMzQnIHgyPScxNDAnIHkyPScxMzQnIHN0cm9rZT0nI0ZGRkZGRicgc3Ryb2tlLXdpZHRoPScyLjUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgogIDxwYXRoIGQ9J002MiAxNDAgUTEwMCAxNTUgMTM4IDE0MCcgc3Ryb2tlPScjRkZGRkZGJyBzdHJva2Utd2lkdGg9JzIuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJy8+CiAgPHBhdGggZD0nTTcwIDE0NiBRMTAwIDE1NyAxMzAgMTQ2JyBzdHJva2U9JyNGRkZGRkYnIHN0cm9rZS13aWR0aD0nMS41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnLz4KPC9zdmc+';

type MarkProps = { size?: number; white?: boolean; style?: object };

// The hanging merfaa icon mark
export function LogoMark({ size = 64, white = false, style }: MarkProps) {
  const h = size;
  const w = size * (200 / 210); // preserve viewBox aspect ratio
  const b64 = white ? MARK_WHITE_B64 : MARK_DARK_B64;
  return (
    <Image
      source={{ uri: `data:image/svg+xml;base64,${b64}` }}
      style={[{ width: w, height: h }, style]}
      resizeMode="contain"
    />
  );
}

// Just the bilingual name block: نخوة / NEKHWA
export function LogoName({ white = false, style }: { white?: boolean; style?: object }) {
  const c = white ? '#fff' : COLORS.primary;
  return (
    <View style={[styles.nameWrap, style]}>
      <Text style={[styles.nameAr, { color: c }]}>نخوة</Text>
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: c }]} />
        <View style={[styles.diamond, { borderTopColor: c, borderBottomColor: c }]} />
        <View style={[styles.dividerLine, { backgroundColor: c }]} />
      </View>
      <Text style={[styles.nameEn, { color: c }]}>NEKHWA</Text>
    </View>
  );
}

// Full stacked logo: icon above name (for splash screen)
export function LogoFull({ size = 100, white = false, style }: MarkProps) {
  return (
    <View style={[styles.fullWrap, style]}>
      <LogoMark size={size} white={white} />
      <LogoName white={white} style={{ marginTop: SPACING.md }} />
    </View>
  );
}

// Horizontal row: icon left + name right (for home header)
export function LogoRow({ size = 44, style }: { size?: number; style?: object }) {
  return (
    <View style={[styles.rowWrap, style]}>
      <LogoMark size={size} />
      <LogoName style={{ marginStart: SPACING.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullWrap: { alignItems: 'center' },
  rowWrap: { flexDirection: 'row', alignItems: 'center' },
  nameWrap: { alignItems: 'center' },
  nameAr: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    letterSpacing: 1,
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5, width: 120 },
  dividerLine: { flex: 1, height: 1 },
  diamond: {
    width: 7,
    height: 7,
    borderTopWidth: 3.5,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderRightWidth: 3.5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginHorizontal: 5,
    transform: [{ rotate: '45deg' }],
  },
  nameEn: {
    fontSize: FONT.size.xs,
    fontWeight: FONT.weight.bold,
    letterSpacing: 4,
  },
});
