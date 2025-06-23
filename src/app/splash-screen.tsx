import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Modal, Portal, Text, useTheme } from 'react-native-paper';

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

const startTrackingAction = async ({ action, type = 'CUSTOM' }: { action: string; type?: 'CUSTOM' }) => {
  console.log('Starting action:', action);
};
const stopTrackingAction = async ({ action, type = 'CUSTOM' }: { action: string; type?: 'CUSTOM' }) => {
  console.log('Stopping action:', action);
};
const trackAction = async ({ action, type = 'CUSTOM' }: { action: string; type?: 'CUSTOM' }) => {
  console.log('Adding action:', action);
};

export function SplashScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [showTrackingModal, setShowTrackingModal] = React.useState(false);

  React.useEffect(() => {
    startTrackingAction({ action: 'Viewing Splash Screen', type: 'CUSTOM' });

    loadStoredPreferences();

    return () => {
      stopTrackingAction({ action: 'Viewing Splash Screen', type: 'CUSTOM' });
    };
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

  const handleGetStarted = () => {
    if (termsAccepted) {
      trackAction({ action: 'Get Started' });
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
    trackAction({ action: 'Terms Accepted', type: 'CUSTOM' });
  };

  const handleTrackingConsent = async (consent: boolean) => {
    setShowTrackingModal(false);
    await saveTrackingConsent(consent);
    trackAction({ action: 'Tracking Consent', type: 'CUSTOM' });
  };

  return (
    <AppContainer accessibilityLabel="splash-screen-container">
      <View style={styles.contentContainer}>
        <View style={styles.scrollableContent}>
          <Text
            accessibilityLabel="splash-screen-main-title"
            variant="headlineLarge"
            style={styles.mainTitle}
          >
            {t('splash.mainTitle')}
          </Text>

          <Text
            accessibilityLabel="splash-screen-subtitle"
            variant="titleLarge"
            style={styles.subtitle}
          >
            {t('splash.subtitle')}
          </Text>

          <Image
            accessibilityLabel="splash-screen-icon"
            source={require('@/assets/images/splash-icon.png')}
            style={styles.splashIcon}
            contentFit="contain"
          />

          <Text
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
              status={termsAccepted ? 'checked' : 'unchecked'}
              onPress={toggleTerms}
              uncheckedColor={theme.colors.onSurface}
            />
            <Text
              accessibilityLabel="splash-screen-terms-text"
              variant="bodySmall"
              style={[styles.termsText, { color: theme.colors.onSurface }]}
            >
              {t('splash.termsAndConditions')}{' '}
              <ExternalLink
                href="https://potenzo.app/terms-and-conditions"
                accessibilityLabel="splash-screen-terms-link"
                onPress={() => trackAction({ action: 'Terms of Service' })}
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
                accessibilityLabel="splash-screen-privacy-link"
                onPress={() => trackAction({ action: 'Privacy Policy' })}
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
          visible={showTrackingModal}
          dismissable={false}
          contentContainerStyle={styles.modalOverlay}
        >
          <BlurView
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
              variant="titleMedium"
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              {t('tracking.title')}
            </Text>

            <Text
              variant="bodyMedium"
              style={[styles.modalText, { color: theme.colors.onSurface }]}
            >
              {t('tracking.description')}{' '}
              <ExternalLink
                href="https://potenzo.app/privacy-policy"
                accessibilityLabel="tracking-privacy-link"
                onPress={() => trackAction({ action: 'Privacy Policy from Tracking Modal' })}
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
                accessibilityLabel="tracking-dont-allow-button"
              >
                {t('tracking.dontAllow')}
              </Button>
              <Button
                mode="contained"
                onPress={() => handleTrackingConsent(true)}
                style={styles.modalButton}
                buttonColor={getColorToken('core-primary')}
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