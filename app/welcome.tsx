import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableOpacity, Dimensions, ActivityIndicator, ImageURISource, Alert, Platform, Modal } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { useLocation } from '@/contexts/LocationContext';

const { width, height } = Dimensions.get('window');

const RING_OF_FIRE_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ll967onyuzhjbd6a88nw6';
const BACKGROUND_COLOR = '#f0efe8';



export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { locationPermission, isLoadingLocation, refreshLocation } = useLocation();
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const contentFadeIn = useRef(new Animated.Value(0)).current;
  const contentSlideUp = useRef(new Animated.Value(50)).current;
  const screenFadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(screenFadeIn, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(fadeIn, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(contentFadeIn, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(contentSlideUp, { toValue: 0, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, [fadeIn, contentFadeIn, contentSlideUp, screenFadeIn]);

  const handleContinue = async () => {
    if (Platform.OS === 'web') {
      setShowLocationModal(true);
    } else {
      Alert.alert(
        'Enable Location',
        'To personalize seismic alerts for your area, allow location access. You can change this later in Settings.',
        [
          {
            text: 'Not now',
            style: 'cancel',
            onPress: () => router.replace('/map'),
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
                router.replace('/map');
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleModalNotNow = () => {
    setShowLocationModal(false);
    router.replace('/map');
  };

  const handleModalContinue = async () => {
    setShowLocationModal(false);
    try {
      if (!locationPermission && !isRequestingPermission) {
        setIsRequestingPermission(true);
        await refreshLocation();
      }
    } catch (e) {
      console.log('Location init error', e);
    } finally {
      setIsRequestingPermission(false);
      router.replace('/map');
    }
  };

  const source: ImageURISource = { uri: RING_OF_FIRE_URI };

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, opacity: screenFadeIn }]} testID="welcome-screen">
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

      <Animated.View style={[
        styles.content,
        Platform.OS === 'web' ? stylesWeb.content : null,
        { opacity: contentFadeIn, transform: [{ translateY: contentSlideUp }] }
      ]}>
        <Text style={[styles.title, Platform.OS === 'web' ? stylesWeb.title : null]} testID="title-text">Seismic Monitor</Text>
        <Text style={[styles.subtitle, Platform.OS === 'web' ? stylesWeb.subtitle : null]}>Global Ring of Fire • Real-time seismic insights</Text>
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.button}
          testID="btn-continue"
          disabled={isRequestingPermission || isLoadingLocation}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          {isRequestingPermission || isLoadingLocation ? (
            <ActivityIndicator size="small" color="#0B1A2E" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enable Location</Text>
            <Text style={styles.modalMessage}>
              To personalize seismic alerts for your area, allow location access. You can change this later in Settings.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleModalNotNow}
                style={[styles.modalButton, styles.modalButtonCancel]}
                testID="modal-btn-not-now"
              >
                <Text style={styles.modalButtonTextCancel}>Not now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleModalContinue}
                style={[styles.modalButton, styles.modalButtonConfirm]}
                testID="modal-btn-continue"
              >
                <Text style={styles.modalButtonTextConfirm}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
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
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: BACKGROUND_COLOR,
    marginTop: -height * 0.1,
  },

  content: {
    width: '88%',
    maxWidth: 520,
    alignItems: 'center',
    paddingBottom: height * 0.18,
  },
  title: {
    fontSize: 34,
    fontWeight: FONT_WEIGHT.bold,
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: '#000000',
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: '#E8F0F7',
    paddingVertical: 16,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: '#0B1A2E',
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: '#0B1A2E',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modalMessage: {
    fontSize: FONT_SIZE.md,
    color: '#475569',
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#E2E8F0',
  },
  modalButtonConfirm: {
    backgroundColor: '#FF6B4A',
  },
  modalButtonTextCancel: {
    color: '#475569',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  modalButtonTextConfirm: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
});

const stylesWeb = StyleSheet.create({
  content: {
    width: '90%',
  },
  subtitle: {
    fontSize: 26,
    color: '#000000',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  title: {
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
