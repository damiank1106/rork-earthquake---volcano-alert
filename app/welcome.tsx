import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing, Platform, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

const GlassView = Platform.OS === 'web' ? View : BlurView;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, logoRotate, pulseAnim]);

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glassProps = Platform.OS === 'web'
    ? { style: { backgroundColor: 'rgba(255, 255, 255, 0.7)' } }
    : { intensity: 60, tint: 'light' as const };

  const handleContinue = () => {
    router.replace('/map');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.backgroundGradient}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: rotation }, { scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.logoOuter}>
            <View style={styles.logoMiddle}>
              <View style={styles.logoInner}>
                <Text style={styles.logoText}>🌍</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <GlassView {...glassProps} style={styles.card}>
          <Text style={styles.title}>Seismic Monitor</Text>
          <Text style={styles.subtitle}>Real-Time Earthquake & Volcanic Activity Tracker</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>
            Monitor earthquakes, volcanoes, and tsunami alerts worldwide. Stay informed with real-time data from USGS, NOAA, and other trusted sources.
          </Text>
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🗺️</Text>
              <Text style={styles.featureText}>Interactive Maps</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌋</Text>
              <Text style={styles.featureText}>Volcano Tracking</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌊</Text>
              <Text style={styles.featureText}>Tsunami Alerts</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleContinue} testID="btn-continue">
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </GlassView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: '#3B82F6',
    top: -100,
    left: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: '#8B5CF6',
    bottom: -50,
    right: -50,
  },
  circle3: {
    width: 250,
    height: 250,
    backgroundColor: '#EC4899',
    top: '40%',
    right: '10%',
  },
  content: {
    width: '90%',
    maxWidth: 500,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  logoMiddle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: SPACING.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary.light,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary.light,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary.light,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SPACING.lg,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  featureText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary.light,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
});
