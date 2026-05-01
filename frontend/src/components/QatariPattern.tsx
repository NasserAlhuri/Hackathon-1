import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

// Qatari/Islamic geometric pattern as decorative background
// Uses overlapping rotated squares to create an 8-point star motif
export default function QatariPattern({
  color = '#fff',
  opacity = 0.06,
  size = 40,
  style,
}: {
  color?: string;
  opacity?: number;
  size?: number;
  style?: ViewStyle;
}) {
  // Render a 4×4 grid of star motifs
  const cols = 6;
  const rows = 6;
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: c * size, y: r * size });
    }
  }
  return (
    <View style={[styles.wrap, style, { pointerEvents: 'none' } as any]}>
      {cells.map((cell, i) => (
        <View key={i} style={{ position: 'absolute', left: cell.x, top: cell.y, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          {/* 8-point star = 2 rotated squares */}
          <View style={{ position: 'absolute', width: size * 0.7, height: size * 0.7, backgroundColor: color, opacity, transform: [{ rotate: '0deg' }] }} />
          <View style={{ position: 'absolute', width: size * 0.7, height: size * 0.7, backgroundColor: color, opacity, transform: [{ rotate: '45deg' }] }} />
        </View>
      ))}
    </View>
  );
}

// Qatari decorative motif elements as inline shapes
export function PalmTree({ size = 24, color = COLORS.accent }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Trunk */}
      <View style={{ width: size * 0.12, height: size * 0.55, backgroundColor: '#8B5E3C', borderRadius: 2 }} />
      {/* Fronds */}
      <View style={{ position: 'absolute', top: 0, width: size, height: size * 0.6, alignItems: 'center', justifyContent: 'center' }}>
        {[-60, -30, 0, 30, 60].map((rot, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: size * 0.6,
              height: size * 0.18,
              backgroundColor: color,
              borderRadius: size * 0.1,
              transform: [{ rotate: `${rot}deg` }],
              top: size * 0.05,
            }}
          />
        ))}
      </View>
    </View>
  );
}

export function DhowBoat({ width = 80, height = 30, color = '#fff' }: { width?: number; height?: number; color?: string }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* Hull (curved trapezoid) */}
      <View style={{ width: width * 0.85, height: height * 0.3, backgroundColor: color, borderBottomLeftRadius: width, borderBottomRightRadius: width, opacity: 0.9 }} />
      {/* Mast */}
      <View style={{ position: 'absolute', bottom: height * 0.3, left: width * 0.4, width: 1.5, height: height * 0.7, backgroundColor: color, opacity: 0.7 }} />
      {/* Triangular sail */}
      <View
        style={{
          position: 'absolute',
          bottom: height * 0.32,
          left: width * 0.4,
          width: 0,
          height: 0,
          borderLeftWidth: width * 0.45,
          borderBottomWidth: height * 0.7,
          borderLeftColor: 'transparent',
          borderBottomColor: color,
          opacity: 0.85,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
});
