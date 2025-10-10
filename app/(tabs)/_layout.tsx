import { Tabs } from 'expo-router';
import { Map, List, BookOpen, Settings } from 'lucide-react-native';
import React from 'react';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.text.secondary.light,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface.light + 'F0',
          borderTopColor: COLORS.border.light,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}