import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing, Platform, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, slideAnim, logoScale, waveAnim]);

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const glassProps = Platform.OS === 'web'
    ? { style: { backgroundColor: 'rgba(255, 255, 255, 0.95)' } }
    : { intensity: 90, tint: 'light' as const };

  const handleContinue = () => {
    router.replace('/map');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.backgroundGradient}>
        <View style={[styles.wave, styles.wave1]} />
        <View style={[styles.wave, styles.wave2]} />
        <View style={[styles.wave, styles.wave3]} />
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
              transform: [{ scale: logoScale }, { translateY: waveTranslate }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌍</Text>
          </View>
          <View style={styles.logoRing} />
        </Animated.View>

        <GlassView {...glassProps} style={styles.card}>
          <Text style={styles.title}>Seismic Monitor</Text>
          <Text style={styles.subtitle}>Real-Time Global Monitoring</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>
            Track earthquakes, volcanic activity, and tsunami alerts worldwide with real-time data from trusted sources.
          </Text>
          <View style={styles.features}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🗺️</Text>
              </View>
              <Text style={styles.featureTitle}>Live Maps</Text>
              <Text style={styles.featureDesc}>Interactive visualization</Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🌋</Text>
              </View>
              <Text style={styles.featureTitle}>Volcanoes</Text>
              <Text style={styles.featureDesc}>Activity tracking</Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🌊</Text>
              </View>
              <Text style={styles.featureTitle}>Alerts</Text>
              <Text style={styles.featureDesc}>Tsunami warnings</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleContinue} testID="btn-continue">
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.footer}>Powered by USGS, NOAA & PHIVOLCS</Text>
        </GlassView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: '200%',
    height: 200,
    borderRadius: 9999,
    opacity: 0.08,
  },
  wave1: {
    backgroundColor: '#3B82F6',
    top: -100,
    left: -50,
  },
  wave2: {
    backgroundColor: '#0EA5E9',
    top: 100,
    right: -100,
  },
  wave3: {
    backgroundColor: '#06B6D4',
    bottom: -80,
    left: -80,
  },
  content: {
    width: '90%',
    maxWidth: 480,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#3B82F6',
    opacity: 0.3,
  },
  logoEmoji: {
    fontSize: 56,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    padding: SPACING.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: FONT_WEIGHT.bold,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontWeight: '500' as const,
  },
  divider: {
    height: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: SPACING.md,
    borderRadius: 1,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: SPACING.xl,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  footer: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
