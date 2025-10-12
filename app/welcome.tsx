import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableOpacity, Dimensions, ActivityIndicator, ImageURISource, Alert, TextStyle, Platform, Modal } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';
import { useLocation } from '@/contexts/LocationContext';

const { width, height } = Dimensions.get('window');

const RING_OF_FIRE_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4frlq0qiwtpl1p0rkxttl';
const BACKGROUND_COLOR = '#ebe7e2';

type OutlinedTextProps = { text: string; textStyle: TextStyle; testID?: string };
const OutlinedText: React.FC<OutlinedTextProps> = React.memo(function OutlinedText({ text, textStyle, testID }) {
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
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeIn]);

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
    }
  };

  const handleModalNotNow = () => {
    setShowLocationModal(false);
    router.replace('/loading');
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
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
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
