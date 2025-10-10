import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const wave1Anim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const wave3Anim = useRef(new Animated.Value(0)).current;
  const wave4Anim = useRef(new Animated.Value(0)).current;
  const wave5Anim = useRef(new Animated.Value(0)).current;
  const wave6Anim = useRef(new Animated.Value(0)).current;
  const wave7Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 20,
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
        Animated.timing(wave1Anim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave1Anim, {
          toValue: 0,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave2Anim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave2Anim, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave3Anim, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave3Anim, {
          toValue: 0,
          duration: 12000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave4Anim, {
          toValue: 1,
          duration: 14000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave4Anim, {
          toValue: 0,
          duration: 14000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave5Anim, {
          toValue: 1,
          duration: 16000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave5Anim, {
          toValue: 0,
          duration: 16000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave6Anim, {
          toValue: 1,
          duration: 18000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave6Anim, {
          toValue: 0,
          duration: 18000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave7Anim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wave7Anim, {
          toValue: 0,
          duration: 20000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, logoScale, logoRotate, wave1Anim, wave2Anim, wave3Anim, wave4Anim, wave5Anim, wave6Anim, wave7Anim]);

  const wave1TranslateY = wave1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const wave1TranslateX = wave1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const wave2TranslateY = wave2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  const wave2TranslateX = wave2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const wave3TranslateY = wave3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const wave3TranslateX = wave3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const wave4TranslateY = wave4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -45],
  });

  const wave4TranslateX = wave4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 35],
  });

  const wave5TranslateY = wave5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 55],
  });

  const wave5TranslateX = wave5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const wave6TranslateY = wave6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });

  const wave6TranslateX = wave6Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -45],
  });

  const wave7TranslateY = wave7Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 65],
  });

  const wave7TranslateX = wave7Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleContinue = () => {
    router.replace('/map');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.backgroundGradient}>
        <Animated.View style={[styles.wave, styles.wave1, { transform: [{ translateY: wave1TranslateY }, { translateX: wave1TranslateX }] }]} />
        <Animated.View style={[styles.wave, styles.wave2, { transform: [{ translateY: wave2TranslateY }, { translateX: wave2TranslateX }] }]} />
        <Animated.View style={[styles.wave, styles.wave3, { transform: [{ translateY: wave3TranslateY }, { translateX: wave3TranslateX }] }]} />
        <Animated.View style={[styles.wave, styles.wave4, { transform: [{ translateY: wave4TranslateY }, { translateX: wave4TranslateX }] }]} />
        <Animated.View style={[styles.wave, styles.wave5, { transform: [{ translateY: wave5TranslateY }, { translateX: wave5TranslateX }] }]} />
        <Animated.View style={[styles.wave, styles.wave6, { transform: [{ translateY: wave6TranslateY }, { translateX: wave6TranslateX }] }]} />
        <Animated.View style={[styles.wave, styles.wave7, { transform: [{ translateY: wave7TranslateY }, { translateX: wave7TranslateX }] }]} />
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
              transform: [{ scale: logoScale }, { rotate: logoRotation }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌍</Text>
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Seismic Monitor</Text>
          <Text style={styles.subtitle}>Real-Time Global Monitoring</Text>
          <Text style={styles.description}>
            Track earthquakes, volcanic activity, and tsunami alerts worldwide.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue} testID="btn-continue">
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#E0F2FE',
  },
  wave: {
    position: 'absolute',
    borderRadius: 9999,
  },
  wave1: {
    width: width * 1.8,
    height: width * 1.8,
    backgroundColor: 'rgba(186, 230, 253, 0.4)',
    top: -width * 0.9,
    left: -width * 0.4,
  },
  wave2: {
    width: width * 1.6,
    height: width * 1.6,
    backgroundColor: 'rgba(125, 211, 252, 0.3)',
    top: height * 0.15,
    right: -width * 0.5,
  },
  wave3: {
    width: width * 2,
    height: width * 2,
    backgroundColor: 'rgba(224, 242, 254, 0.5)',
    bottom: -width * 0.8,
    left: -width * 0.6,
  },
  wave4: {
    width: width * 1.4,
    height: width * 1.4,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    top: height * 0.4,
    left: -width * 0.3,
  },
  wave5: {
    width: width * 1.7,
    height: width * 1.7,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    bottom: height * 0.2,
    right: -width * 0.4,
  },
  wave6: {
    width: width * 1.5,
    height: width * 1.5,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    top: height * 0.6,
    right: -width * 0.3,
  },
  wave7: {
    width: width * 1.9,
    height: width * 1.9,
    backgroundColor: 'rgba(186, 230, 253, 0.35)',
    bottom: -width * 0.7,
    right: -width * 0.5,
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
    fontSize: 70,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: FONT_WEIGHT.bold,
    color: '#0C4A6E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: '#0369A1',
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontWeight: '600' as const,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: '#075985',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
});
