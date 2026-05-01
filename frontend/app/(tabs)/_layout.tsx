import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';

export default function TabsLayout() {
  const { t, role } = useApp();

  // Activity tab label varies by role
  const activityLabel = (() => {
    switch (role) {
      case 'volunteer': return t('deliveries');
      case 'ngo': return t('incomingDonations');
      case 'requester': return 'My Requests';
      default: return 'My Donations';
    }
  })();

  const activityIcon = (() => {
    switch (role) {
      case 'volunteer': return 'car-outline';
      case 'ngo': return 'archive-outline';
      case 'requester': return 'document-text-outline';
      default: return 'list-outline';
    }
  })();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: COLORS.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: activityLabel,
          tabBarIcon: ({ color, size }) => <Ionicons name={activityIcon as any} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
