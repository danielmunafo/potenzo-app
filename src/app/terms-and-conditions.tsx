import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  Button,
  Checkbox,
  Modal,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';

import { AppContainer } from '@/components/AppContainer';
import { ExternalLink } from '@/components/ExternalLink';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserConsents } from '@/hooks/useUserConsents';
import sentryService from '@/services/sentryService';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

export function TermsAndConditionsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const {
    shouldShowTrackingModal: isTrackingModalVisible,
    updateTermsAccepted,
    updateTrackingConsent,
    trackingConsent,
  } = useUserConsents();

  const handleGetStarted = async () => {
    if (isTermsAccepted) {
      await updateTermsAccepted(isTermsAccepted);
    }
  };

  useEffect(() => {
    if (!isTrackingModalVisible && trackingConsent !== undefined) {
      sentryService.setHasTrackingConsent(trackingConsent);
    }
  }, [trackingConsent, isTrackingModalVisible]);

  const handleTrackingConsent = async (consent: boolean) => {
    try {
      await updateTrackingConsent(consent);
    } catch (error) {
      sentryService.captureException(error, {
        message: 'Failed to update tracking consent',
        source: 'TermsAndConditionsScreen',
        level: 'error',
      });
    }
  };

  return (
    <AppContainer accessibilityLabel="terms-screen-container">
      <StatusBar hidden animated />
      <View
        accessibilityLabel="terms-screen-content-container"
        style={styles.contentContainer}
      >
        <View
          accessibilityLabel="terms-screen-scrollable-content"
          style={styles.scrollableContent}
        >
          <Text
            accessibilityLabel="terms-screen-main-title"
            variant="headlineLarge"
            style={styles.mainTitle}
          >
            {t('splash.mainTitle')}
          </Text>

          <Text
            accessibilityLabel="terms-screen-subtitle"
            variant="titleLarge"
            style={styles.subtitle}
          >
            {t('splash.subtitle')}
          </Text>

          <Image
            accessibilityLabel="terms-screen-icon"
            source={require('@/assets/images/splash-icon.png')}
            style={styles.splashIcon}
            contentFit="contain"
          />

          <Text
            accessibilityLabel="terms-screen-description"
            variant="bodyLarge"
            style={styles.description}
          >
            {t('splash.description')}
          </Text>
        </View>

        <View
          accessibilityLabel="terms-screen-bottom-section"
          style={styles.bottomSection}
        >
          <LanguageSelector />

          <View
            accessibilityLabel="terms-screen-terms-container"
            style={styles.termsContainer}
          >
            <Checkbox.Android
              testID="terms-screen-terms-checkbox"
              status={isTermsAccepted ? 'checked' : 'unchecked'}
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              uncheckedColor={theme.colors.onSurface}
              accessibilityLabel="terms-screen-terms-checkbox"
            />
            <Text
              accessibilityLabel="terms-screen-terms-text"
              variant="bodySmall"
              style={[styles.termsText, { color: theme.colors.onSurface }]}
            >
              <Text
                accessibilityLabel="terms-screen-terms-text-link"
                onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              >
                {t('splash.termsAndConditions')}{' '}
              </Text>
              <ExternalLink
                href="https://potenzo.app/terms-and-conditions"
                accessibilityLabel="terms-screen-terms-link"
              >
                <Text
                  accessibilityLabel="terms-screen-terms-text-link-text"
                  style={[
                    styles.termsText,
                    {
                      color: getColorToken('core-primary'),
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  {t('splash.termsOfService')}
                </Text>
              </ExternalLink>
              {', '}
              <ExternalLink
                href="https://potenzo.app/privacy-policy"
                accessibilityLabel="terms-screen-privacy-link"
              >
                <Text
                  accessibilityLabel="terms-screen-privacy-link-text"
                  style={[
                    styles.termsText,
                    {
                      color: getColorToken('core-primary'),
                      textDecorationLine: 'underline',
                    },
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
            accessibilityLabel="terms-screen-get-started-button"
            style={[
              styles.getStartedButton,
              !isTermsAccepted && styles.getStartedButtonDisabled,
            ]}
            buttonColor={getColorToken('core-primary')}
            disabled={!isTermsAccepted}
          >
            {t('common.getStarted')}
          </Button>
        </View>
      </View>

      <Portal>
        <Modal
          visible={isTrackingModalVisible}
          dismissable={false}
          contentContainerStyle={styles.modalOverlay}
        >
          <BlurView
            intensity={5}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View
            accessibilityLabel="terms-screen-modal-container"
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              accessibilityLabel="terms-screen-modal-title"
              variant="titleMedium"
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              {t('tracking.title')}
            </Text>

            <Text
              accessibilityLabel="terms-screen-modal-text"
              variant="bodyMedium"
              style={[styles.modalText, { color: theme.colors.onSurface }]}
            >
              {t('tracking.description')}{' '}
              <ExternalLink
                href="https://potenzo.app/privacy-policy"
                accessibilityLabel="tracking-privacy-link"
              >
                <Text
                  accessibilityLabel="terms-screen-modal-text-link"
                  style={[
                    styles.modalText,
                    {
                      color: getColorToken('core-primary'),
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  {t('tracking.privacyPolicy')}
                </Text>
              </ExternalLink>
              .
            </Text>

            <View
              accessibilityLabel="terms-screen-modal-buttons"
              style={styles.modalButtons}
            >
              <Button
                mode="outlined"
                onPress={() => handleTrackingConsent(false)}
                accessibilityLabel="terms-screen-modal-button-dont-allow"
                style={styles.modalButton}
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
  termsTextContainer: {
    flex: 1,
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
    width: '100%',
    height: '100%',
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

export default TermsAndConditionsScreen;
