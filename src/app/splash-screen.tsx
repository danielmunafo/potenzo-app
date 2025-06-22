import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Modal, Portal, Text, useTheme } from 'react-native-paper';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { AppContainer } from '@/components/AppContainer';
import { ExternalLink } from '@/components/ExternalLink';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

const STORAGE_KEYS = {
  TERMS_ACCEPTED: 'terms_accepted',
  TRACKING_CONSENT: 'tracking_consent',
  TRACKING_CONSENT_AT: 'tracking_consent_at',
  TRACKING_SHOWN: 'tracking_shown',
  TERMS_ACCEPTED_AT: 'terms_accepted_at'
} as const;

export function SplashScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const scale = useSharedValue(1);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [showTrackingModal, setShowTrackingModal] = React.useState(false);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  React.useEffect(() => {
    loadStoredPreferences();
  }, []);

  const loadStoredPreferences = async () => {
    try {
      const [storedTerms, storedTracking, trackingShown] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TERMS_ACCEPTED),
        AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CONSENT),
        AsyncStorage.getItem(STORAGE_KEYS.TRACKING_SHOWN)
      ]);

      if (storedTerms === 'true') {
        setTermsAccepted(true);
      }

      // Show tracking modal if not shown before AND no tracking decision made yet
      if (trackingShown !== 'true' && storedTracking === null) {
        setShowTrackingModal(true);
      }
    } catch (error) {
      console.warn('Failed to load stored preferences:', error);
    }
  };

  const saveTermsAccepted = async (accepted: boolean) => {
    try {
      const timestamp = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TERMS_ACCEPTED, accepted.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.TERMS_ACCEPTED_AT, timestamp)
      ]);
    } catch (error) {
      console.warn('Failed to save terms acceptance:', error);
    }
  };

  const saveTrackingConsent = async (consent: boolean) => {
    try {
      const timestamp = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CONSENT, consent.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CONSENT_AT, timestamp),
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_SHOWN, 'true')
      ]);
    } catch (error) {
      console.warn('Failed to save tracking consent:', error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleGetStarted = () => {
    if (termsAccepted) {
      console.log('Get Started pressed - Terms accepted');
      // Navigate to settings screen
      router.push('/settings');
    } else {
      console.log('Terms must be accepted first');
      // You could show an alert or toast here
    }
  };

  const toggleTerms = () => {
    const newValue = !termsAccepted;
    setTermsAccepted(newValue);
    saveTermsAccepted(newValue);
  };

  const handleTrackingConsent = (consent: boolean) => {
    setShowTrackingModal(false);
    saveTrackingConsent(consent);
  };

  return (
    <AppContainer accessibilityLabel="splash-screen-container">
      <View style={styles.contentContainer}>
        <View style={styles.scrollableContent}>
          <Text
            dd-action-name="splash-screen-main-title"
            accessibilityLabel="splash-screen-main-title"
            variant="headlineLarge"
            style={styles.mainTitle}
          >
            {t('splash.mainTitle')}
          </Text>

          <Text
            dd-action-name="splash-screen-subtitle"
            accessibilityLabel="splash-screen-subtitle"
            variant="titleLarge"
            style={styles.subtitle}
          >
            {t('splash.subtitle')}
          </Text>

          <Animated.View
            dd-action-name="splash-screen-animated-icon"
            accessibilityLabel="splash-screen-animated-icon"
            style={animatedStyle}
          >
            <Image
              dd-action-name="splash-screen-icon"
              accessibilityLabel="splash-screen-icon"
              source={require('@/assets/images/splash-icon.png')}
              style={styles.splashIcon}
              contentFit="contain"
            />
          </Animated.View>

          <Text
            dd-action-name="splash-screen-description"
            accessibilityLabel="splash-screen-description"
            variant="bodyLarge"
            style={styles.description}
          >
            {t('splash.description')}
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <LanguageSelector />

          <View style={styles.termsContainer}>
            <Checkbox
              dd-action-name="splash-screen-terms-checkbox"
              status={termsAccepted ? 'checked' : 'unchecked'}
              onPress={toggleTerms}
              uncheckedColor={theme.colors.onSurface}
            />
            <Text
              dd-action-name="splash-screen-terms-text"
              accessibilityLabel="splash-screen-terms-text"
              variant="bodySmall"
              style={[styles.termsText, { color: theme.colors.onSurface }]}
            >
              {t('splash.termsAndConditions')}{' '}
              <ExternalLink
                href="https://potenzo.app/terms-and-conditions"
                dd-action-name="splash-screen-terms-link"
                accessibilityLabel="splash-screen-terms-link"
              >
                <Text
                  style={[
                    styles.termsText,
                    {
                      color: getColorToken('core-primary'),
                      textDecorationLine: 'underline'
                    }
                  ]}
                >
                  {t('splash.termsOfService')}
                </Text>
              </ExternalLink>{', '}
              <ExternalLink
                href="https://potenzo.app/privacy-policy"
                dd-action-name="splash-screen-privacy-link"
                accessibilityLabel="splash-screen-privacy-link"
              >
                <Text
                  style={[
                    styles.termsText,
                    {
                      color: getColorToken('core-primary'),
                      textDecorationLine: 'underline'
                    }
                  ]}
                >
                  {t('splash.privacyPolicy')}
                </Text>
              </ExternalLink>
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={[
              styles.getStartedButton,
              !termsAccepted && styles.getStartedButtonDisabled
            ]}
            dd-action-name="splash-screen-get-started-button"
            accessibilityLabel="splash-screen-get-started-button"
            buttonColor={getColorToken('core-primary')}
            disabled={!termsAccepted}
          >
            {t('common.getStarted')}
          </Button>
        </View>
      </View>

      <Portal>
        <Modal
          dd-action-name="splash-screen-tracking-modal"
          visible={showTrackingModal}
          dismissable={false}
          contentContainerStyle={styles.modalOverlay}
        >
          <BlurView
            dd-action-name="splash-screen-tracking-modal-blur-view"
            intensity={5}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.surface }
            ]}
          >
            <Text
              dd-action-name="splash-screen-tracking-modal-title"
              variant="titleMedium"
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              {t('tracking.title')}
            </Text>

            <Text
              dd-action-name="splash-screen-tracking-modal-description"
              variant="bodyMedium"
              style={[styles.modalText, { color: theme.colors.onSurface }]}
            >
              {t('tracking.description')}{' '}
              <ExternalLink
                href="https://potenzo.app/privacy-policy"
                dd-action-name="splash-screen-tracking-modal-privacy-link"
                accessibilityLabel="tracking-privacy-link"
              >
                <Text
                  style={[
                    styles.modalText,
                    {
                      color: getColorToken('core-primary'),
                      textDecorationLine: 'underline'
                    }
                  ]}
                >
                  {t('tracking.privacyPolicy')}
                </Text>
              </ExternalLink>
              .
            </Text>

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => handleTrackingConsent(false)}
                style={styles.modalButton}
                dd-action-name="splash-screen-tracking-modal-dont-allow-button"
                accessibilityLabel="tracking-dont-allow-button"
              >
                {t('tracking.dontAllow')}
              </Button>
              <Button
                mode="contained"
                onPress={() => handleTrackingConsent(true)}
                style={styles.modalButton}
                buttonColor={getColorToken('core-primary')}
                dd-action-name="splash-screen-tracking-modal-allow-button"
                accessibilityLabel="tracking-allow-button"
              >
                {t('tracking.allow')}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  splashIcon: {
    width: 200,
    height: 200,
  },
  textContainer: {
    marginVertical: getSpacingToken('spacing-lg'),
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'Exo2-Bold',
    textAlign: 'center',
    marginVertical: getSpacingToken('spacing-md'),
  },
  subtitle: {
    fontFamily: 'Exo2-Italic',
    textAlign: 'center',
    marginBottom: getSpacingToken('spacing-lg'),
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollableContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: getSpacingToken('spacing-md'),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getSpacingToken('spacing-md'),
    paddingHorizontal: getSpacingToken('spacing-sm'),
    justifyContent: 'center',
  },
  termsText: {
    fontFamily: 'OpenSans-Regular',
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: getSpacingToken('spacing-xs'),
  },
  getStartedButton: {
    marginTop: getSpacingToken('spacing-md'),
    width: '100%',
  },
  getStartedButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    margin: getSpacingToken('spacing-lg'),
    padding: getSpacingToken('spacing-lg'),
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    marginBottom: getSpacingToken('spacing-md'),
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: getSpacingToken('spacing-lg'),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getSpacingToken('spacing-md'),
  },
  modalButton: {
    flex: 1,
  },
});

export default SplashScreen;