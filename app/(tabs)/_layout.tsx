import { Tabs } from 'expo-router';
import { Map, List, BookOpen, Settings, Waves, Flame } from 'lucide-react-native';
import React from 'react';
import { COLORS } from '@/constants/theme';
import { View } from 'react-native';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function TabLayout() {
  const { preferences } = usePreferences();
  const iconColor = preferences.customIconColor || '#000000';
  const glowColor = preferences.customGlowColor || '#60a5fa';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: iconColor,
        tabBarInactiveTintColor: iconColor,
        headerShown: false,
        animation: 'fade',
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
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && { shadowColor: glowColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 }}>
              <Map color={iconColor} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && { shadowColor: glowColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 }}>
              <List color={iconColor} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tsunami"
        options={{
          title: 'Tsunami',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && { shadowColor: glowColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 }}>
              <Waves color={iconColor} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="volcanoes"
        options={{
          title: 'Volcanoes',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && { shadowColor: glowColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 }}>
              <Flame color={iconColor} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && { shadowColor: glowColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 }}>
              <BookOpen color={iconColor} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && { shadowColor: glowColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 }}>
              <Settings color={iconColor} size={size} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

