import * as Sentry from '@sentry/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { ExternalLink } from '@/components/ExternalLink';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useTranslation } from '@/hooks/useTranslation';
import sentryService from '@/services/sentryService';
import { getSpacingToken } from '../theme/FigmaTokens';

const STORAGE_KEYS = {
  TERMS_ACCEPTED: 'terms_accepted',
  TERMS_ACCEPTED_AT: 'terms_accepted_at',
  TRACKING_CONSENT: 'tracking_consent',
  TRACKING_CONSENT_AT: 'tracking_consent_at',
  TRACKING_SHOWN: 'tracking_shown',
} as const;

interface UserConsent {
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  trackingConsent: boolean | null;
  trackingConsentAt?: string;
}

export function SettingsScreen() {
  const { t } = useTranslation();
  const [userConsent, setUserConsent] = React.useState<UserConsent>({
    termsAccepted: false,
    trackingConsent: null,
  });

  useEffect(() => {
    loadUserConsent();
  }, []);

  const loadUserConsent = async () => {
    try {
      const [termsAccepted, trackingConsent] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TERMS_ACCEPTED),
        AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CONSENT),
      ]);

      setUserConsent({
        termsAccepted: termsAccepted === 'true',
        trackingConsent:
          trackingConsent === 'true'
            ? true
            : trackingConsent === 'false'
              ? false
              : null,
      });
    } catch (error) {
      sentryService.captureException(error, {
        message: 'Failed to load user consent',
        source: 'SettingsScreen',
        level: 'error',
      });
    }
  };

  const formatConsentStatus = (consent: boolean | null) => {
    if (consent === null) return t('settings.notSet');
    return consent ? t('settings.accepted') : t('settings.declined');
  };

  return (
    <ScreenContainer accessibilityLabel="settings-screen-container">
      <ScrollView
        accessibilityLabel="settings-screen-scroll-view"
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Button
          accessibilityLabel="settings-screen-button"
          onPress={() => {
            Sentry.captureException(new Error('First error'));
          }}
        >
          Try!
        </Button>

        <Text
          accessibilityLabel="settings-screen-title"
          variant="headlineMedium"
          style={styles.title}
        >
          {t('profile.settings')}
        </Text>

        <View
          accessibilityLabel="settings-screen-language-selector-container"
          style={styles.languageSelectorContainer}
        >
          <LanguageSelector />
        </View>

        <Card
          accessibilityLabel="settings-screen-consent-card"
          style={styles.consentCard}
        >
          <Card.Content accessibilityLabel="settings-screen-consent-card-content">
            <Text
              accessibilityLabel="settings-screen-consent-card-title"
              variant="titleMedium"
              style={[styles.cardTitle]}
            >
              {t('settings.consent.title')}
            </Text>

            <View
              accessibilityLabel="settings-screen-consent-card-item"
              style={styles.consentItem}
            >
              <Text
                accessibilityLabel="settings-screen-consent-card-item-label"
                variant="bodyMedium"
                style={[styles.consentLabel]}
              >
                {t('settings.consent.terms')}:
              </Text>
              <Text
                accessibilityLabel="settings-screen-consent-card-item-value"
                variant="bodyMedium"
                style={[styles.consentValue]}
              >
                {formatConsentStatus(userConsent.termsAccepted)}
              </Text>
            </View>

            <View
              accessibilityLabel="settings-screen-consent-card-item"
              style={styles.consentItem}
            >
              <Text
                accessibilityLabel="settings-screen-consent-card-item-label"
                variant="bodyMedium"
                style={[styles.consentLabel]}
              >
                {t('settings.consent.tracking')}:
              </Text>
              <Text
                accessibilityLabel="settings-screen-consent-card-item-value"
                variant="bodyMedium"
                style={[styles.consentValue]}
              >
                {formatConsentStatus(userConsent.trackingConsent)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card
          accessibilityLabel="settings-screen-website-card"
          style={styles.websiteCard}
        >
          <Card.Content accessibilityLabel="settings-screen-website-card-content">
            <Text
              accessibilityLabel="settings-screen-website-card-title"
              variant="titleMedium"
              style={[styles.cardTitle]}
            >
              {t('settings.website.title')}
            </Text>

            <View
              accessibilityLabel="settings-screen-website-card-item"
              style={styles.websiteItem}
            >
              <Text
                accessibilityLabel="settings-screen-website-card-item-label"
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.url')}:
              </Text>
              <ExternalLink
                href="https://potenzo.app"
                accessibilityLabel="settings-website-link"
              >
                <Text
                  accessibilityLabel="settings-screen-website-card-item-link"
                  style={[styles.websiteLink]}
                >
                  potenzo.app
                </Text>
              </ExternalLink>
            </View>

            <View
              accessibilityLabel="settings-screen-website-card-item"
              style={styles.websiteItem}
            >
              <Text
                accessibilityLabel="settings-screen-website-card-item-label"
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.contact')}:
              </Text>
              <ExternalLink
                href="mailto:support@potenzo.app"
                accessibilityLabel="settings-contact-link"
              >
                <Text
                  accessibilityLabel="settings-screen-website-card-item-link"
                  style={[styles.websiteLink]}
                >
                  support@potenzo.app
                </Text>
              </ExternalLink>
            </View>

            <View
              accessibilityLabel="settings-screen-website-card-item"
              style={styles.websiteItem}
            >
              <Text
                accessibilityLabel="settings-screen-website-card-item-label"
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.terms')}:
              </Text>
              <ExternalLink
                href="https://potenzo.app/terms-and-conditions"
                accessibilityLabel="settings-terms-link"
              >
                <Text
                  accessibilityLabel="settings-screen-website-card-item-link"
                  style={[styles.websiteLink]}
                >
                  {t('settings.website.termsLink')}
                </Text>
              </ExternalLink>
            </View>

            <View
              accessibilityLabel="settings-screen-website-card-item"
              style={styles.websiteItem}
            >
              <Text
                accessibilityLabel="settings-screen-website-card-item-label"
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.privacy')}:
              </Text>
              <ExternalLink
                href="https://potenzo.app/privacy-policy"
                accessibilityLabel="settings-privacy-link"
              >
                <Text
                  accessibilityLabel="settings-screen-website-card-item-link"
                  style={[styles.websiteLink]}
                >
                  {t('settings.website.privacyLink')}
                </Text>
              </ExternalLink>
            </View>
          </Card.Content>
        </Card>

        <Text
          accessibilityLabel="settings-screen-description"
          variant="bodyMedium"
          style={styles.description}
        >
          {t('splash.description')}
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getSpacingToken('spacing-md'),
  },
  languageSelectorContainer: {
    marginBottom: getSpacingToken('spacing-md'),
  },
  title: {
    textAlign: 'center',
    marginBottom: getSpacingToken('spacing-sm'),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: getSpacingToken('spacing-lg'),
    opacity: 0.7,
  },
  description: {
    textAlign: 'center',
    marginTop: getSpacingToken('spacing-lg'),
    lineHeight: 24,
  },
  consentCard: {
    marginBottom: getSpacingToken('spacing-lg'),
  },
  cardTitle: {
    marginBottom: getSpacingToken('spacing-md'),
  },
  consentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacingToken('spacing-sm'),
  },
  consentLabel: {
    flex: 1,
  },
  consentValue: {},
  websiteCard: {
    marginBottom: getSpacingToken('spacing-lg'),
  },
  websiteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacingToken('spacing-sm'),
  },
  websiteLabel: {
    flex: 1,
  },
  websiteLink: {
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;
