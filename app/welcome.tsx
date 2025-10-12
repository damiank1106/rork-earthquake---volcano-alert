import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableOpacity, Dimensions, ActivityIndicator, ImageURISource, Alert, TextStyle } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { useLocation } from '@/contexts/LocationContext';

const { width, height } = Dimensions.get('window');

const RING_OF_FIRE_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4frlq0qiwtpl1p0rkxttl';
const BACKGROUND_COLOR = '#0A1220';

type OutlinedTextProps = { text: string; textStyle: TextStyle; testID?: string };
const OutlinedText: React.FC<OutlinedTextProps> = React.memo(({ text, textStyle, testID }) => {
  const outlineColor = '#000000';
  const offsets = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];
  return (
    <View style={{ position: 'relative', alignItems: 'center' }} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
      {offsets.map((o, idx) => (
        <Text
          key={`outline-${idx}`}
          style={[textStyle, { position: 'absolute', left: o.x, top: o.y, color: outlineColor }]}
          testID={testID ? `${testID}-outline-${idx}` : undefined}
        >
          {text}
        </Text>
      ))}
      <Text style={textStyle} testID={testID}>{text}</Text>
    </View>
  );
});

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { locationPermission, isLoadingLocation, refreshLocation } = useLocation();
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);

  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeIn]);

  const handleContinue = async () => {
    Alert.alert(
      'Enable Location',
      'To personalize seismic alerts for your area, allow location access. You can change this later in Settings.',
      [
        {
          text: 'Not now',
          style: 'cancel',
          onPress: () => router.replace('/loading'),
        },
        {
          text: 'Continue',
          onPress: async () => {
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
          },
        },
      ],
      { cancelable: true }
    );
  };

  const source: ImageURISource = { uri: RING_OF_FIRE_URI };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} testID="welcome-screen">
      <Animated.View
        style={[
          styles.bgWrapper,
          {
            opacity: fadeIn,
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

      <Animated.View style={[styles.content, { opacity: fadeIn, transform: [{ translateY: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>
        <OutlinedText text="Seismic Monitor" textStyle={styles.title} testID="title-text" />
        <OutlinedText text="Global Ring of Fire • Real-time seismic insights" textStyle={styles.subtitle} />
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
            <OutlinedText text="Continue" textStyle={styles.buttonText} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bgWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  ringImage: {
    width: width,
    height: height,
    backgroundColor: BACKGROUND_COLOR,
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
