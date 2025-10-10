import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const wave3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 30,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave1Anim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave1Anim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave2Anim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave2Anim, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave3Anim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave3Anim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, logoScale, wave1Anim, wave2Anim, wave3Anim]);

  const wave1Translate = wave1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const wave2Translate = wave2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const wave3Translate = wave3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  const handleContinue = () => {
    router.replace('/map');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.backgroundGradient}>
        <Animated.View style={[styles.wave, styles.wave1, { transform: [{ translateY: wave1Translate }] }]} />
        <Animated.View style={[styles.wave, styles.wave2, { transform: [{ translateY: wave2Translate }] }]} />
        <Animated.View style={[styles.wave, styles.wave3, { transform: [{ translateY: wave3Translate }] }]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌍</Text>
          </View>
        </Animated.View>

        <View style={styles.card}>
          <Text style={styles.title}>Seismic Monitor</Text>
          <Text style={styles.subtitle}>Real-Time Global Monitoring</Text>
          <Text style={styles.description}>
            Track earthquakes, volcanic activity, and tsunami alerts worldwide.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleContinue} testID="btn-continue">
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: '150%',
    height: 150,
    borderRadius: 9999,
    opacity: 0.06,
  },
  wave1: {
    backgroundColor: '#60A5FA',
    top: -50,
    left: -30,
  },
  wave2: {
    backgroundColor: '#93C5FD',
    top: 120,
    right: -60,
  },
  wave3: {
    backgroundColor: '#BFDBFE',
    bottom: -40,
    left: -50,
  },
  content: {
    width: '85%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: FONT_WEIGHT.bold,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontWeight: '500' as const,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
});
