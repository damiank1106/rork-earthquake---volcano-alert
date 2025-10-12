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
const BACKGROUND_COLOR = '#ebe7e2';

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
            <Image
              source={{ uri: RING_OF_FIRE_URI }}
              resizeMode="contain"
              style={styles.logoImage}
            />
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
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600' as const,
    opacity: 0.9,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  statusText: {
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.85,
  },
});
