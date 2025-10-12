import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableOpacity, Dimensions, ActivityIndicator, ImageURISource, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { useLocation } from '@/contexts/LocationContext';

const { width, height } = Dimensions.get('window');

const RING_OF_FIRE_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4frlq0qiwtpl1p0rkxttl';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { locationPermission, isLoadingLocation, refreshLocation } = useLocation();
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);

  const bgScale = useRef(new Animated.Value(1)).current;
  const bgRotate = useRef(new Animated.Value(0)).current;
  const bgTranslate = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgScale, { toValue: 1.05, duration: 7000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(bgScale, { toValue: 1, duration: 7000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgRotate, { toValue: 1, duration: 12000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(bgRotate, { toValue: 0, duration: 12000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgTranslate, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(bgTranslate, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      ),
    ]).start();
  }, [bgRotate, bgScale, bgTranslate, fadeIn]);

  const rotateDeg = bgRotate.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] });
  const translate = useMemo(() => ({
    x: bgTranslate.interpolate({ inputRange: [0, 1], outputRange: [0, Platform.OS === 'web' ? 12 : 18] }),
    y: bgTranslate.interpolate({ inputRange: [0, 1], outputRange: [0, Platform.OS === 'web' ? -8 : -12] }),
  }), [bgTranslate]);

  const handleContinue = async () => {
    try {
      if (!locationPermission && !isRequestingPermission) {
        setIsRequestingPermission(true);
        await refreshLocation();
      }
    } catch (e) {
      console.log('Location init error', e);
    } finally {
      setIsRequestingPermission(false);
      router.replace('/loading');
    }
  };

  const source: ImageURISource = { uri: RING_OF_FIRE_URI };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} testID="welcome-screen">
      <Animated.View
        style={[
          styles.bgWrapper,
          {
            opacity: fadeIn,
            transform: [
              { scale: bgScale },
              { rotate: rotateDeg },
              { translateX: translate.x },
              { translateY: translate.y },
            ],
          },
        ]}
      >
        <Animated.Image
          source={source}
          resizeMode="contain"
          style={styles.ringImage}
          testID="ring-of-fire-image"
        />
      </Animated.View>

      <View style={styles.scrim} />

      <Animated.View style={[styles.content, { opacity: fadeIn, transform: [{ translateY: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>
        <Text style={styles.title} testID="title-text">Seismic Monitor</Text>
        <Text style={styles.subtitle}>Global Ring of Fire • Real-time seismic insights</Text>
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.button}
          testID="btn-continue"
          disabled={isRequestingPermission || isLoadingLocation}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          {isRequestingPermission || isLoadingLocation ? (
            <ActivityIndicator size="small" color="#0B0F14" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bgWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringImage: {
    width: width,
    height: height,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 12, 16, 0.35)',
  },
  content: {
    width: '88%',
    maxWidth: 520,
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  title: {
    fontSize: 34,
    fontWeight: FONT_WEIGHT.bold,
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(255, 94, 58, 0.56)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: '#FF6B4A',
    paddingVertical: 16,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#FF6B4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    color: '#0B0F14',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
});
