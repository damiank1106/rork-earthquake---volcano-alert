import { Tabs } from 'expo-router';
import { Map, List, BookOpen, Settings, Waves, Flame } from 'lucide-react-native';
import React from 'react';
import { COLORS } from '@/constants/theme';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
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
            <View style={focused && styles.activeIcon}>
              <Map color="#000000" size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeIcon}>
              <List color="#000000" size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tsunami"
        options={{
          title: 'Tsunami',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeIcon}>
              <Waves color="#000000" size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="volcanoes"
        options={{
          title: 'Volcanoes',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeIcon}>
              <Flame color="#000000" size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeIcon}>
              <BookOpen color="#000000" size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused && styles.activeIcon}>
              <Settings color="#000000" size={size} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
});