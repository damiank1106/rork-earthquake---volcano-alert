import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, Easing, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { useEarthquakes } from '@/contexts/EarthquakesContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useLocation } from '@/contexts/LocationContext';

const { width, height } = Dimensions.get('window');
const RING_OF_FIRE_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4frlq0qiwtpl1p0rkxttl';
const BACKGROUND_COLOR = '#D8DFE5';

export default function LoadingScreen() {
  const insets = useSafeAreaInsets();
  const { earthquakes, isLoading: earthquakesLoading } = useEarthquakes();
  const { isLoading: preferencesLoading } = usePreferences();
  const { isLoadingLocation } = useLocation();
  const [progress, setProgress] = useState<number>(0);
  const [hasNavigated, setHasNavigated] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, pulseAnim]);

  useEffect(() => {
    let calculatedProgress = 0;

    if (!preferencesLoading) {
      calculatedProgress += 20;
    }

    if (!isLoadingLocation) {
      calculatedProgress += 20;
    }

    if (!earthquakesLoading) {
      calculatedProgress += 30;
    }

    if (earthquakes.length > 0) {
      calculatedProgress += 30;
    }

    setProgress(calculatedProgress);

    Animated.timing(progressAnim, {
      toValue: calculatedProgress,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    if (calculatedProgress >= 100 && !hasNavigated) {
      setHasNavigated(true);
      setTimeout(() => {
        router.replace('/map');
      }, 500);
    }
  }, [preferencesLoading, isLoadingLocation, earthquakesLoading, earthquakes.length, hasNavigated, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.background}>
        <Image source={{ uri: RING_OF_FIRE_URI }} resizeMode="contain" style={styles.ringImage} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌍</Text>
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Loading Data</Text>
          <Text style={styles.subtitle}>Preparing your seismic monitor...</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {preferencesLoading && '⏳ Loading preferences...'}
            {!preferencesLoading && isLoadingLocation && '📍 Getting location...'}
            {!preferencesLoading && !isLoadingLocation && earthquakesLoading && '🌍 Fetching earthquake data...'}
            {!preferencesLoading && !isLoadingLocation && !earthquakesLoading && earthquakes.length === 0 && '⏳ Processing data...'}
            {!preferencesLoading && !isLoadingLocation && !earthquakesLoading && earthquakes.length > 0 && '✅ Ready!'}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringImage: {
    width: width,
    height: height,
    backgroundColor: BACKGROUND_COLOR,
  },
  content: {
    width: '85%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xxl * 1.5,
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
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 60,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: FONT_WEIGHT.bold,
    color: '#E2E8F0',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: '#93C5FD',
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: '#BFDBFE',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  statusText: {
    fontSize: FONT_SIZE.md,
    color: '#93C5FD',
    textAlign: 'center',
  },
});
