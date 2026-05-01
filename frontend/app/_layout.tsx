import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../src/context/AppContext';

function StackInner() {
  const { isRTL } = useApp();
  return (
    <View
      style={[styles.root, { direction: isRTL ? 'rtl' : 'ltr' } as any]}
    >
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="role-select" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="donate" />
        <Stack.Screen name="safety-check" />
        <Stack.Screen name="safety-result" />
        <Stack.Screen name="find-food" />
        <Stack.Screen name="request-food" />
        <Stack.Screen name="impact" options={{ presentation: 'transparentModal', animation: 'fade', headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StackInner />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
