import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { AppContainer } from '@/components/AppContainer';
import { ExternalLink } from '@/components/ExternalLink';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

const STORAGE_KEYS = {
  TERMS_ACCEPTED: 'terms_accepted',
  TERMS_ACCEPTED_AT: 'terms_accepted_at',
  TRACKING_CONSENT: 'tracking_consent',
  TRACKING_CONSENT_AT: 'tracking_consent_at',
  TRACKING_SHOWN: 'tracking_shown'
} as const;

interface UserConsent {
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  trackingConsent: boolean | null;
  trackingConsentAt?: string;
}

const startTrackingAction = async ({ action, type = 'CUSTOM' }: { action: string; type?: 'CUSTOM' }) => {
  console.log('Starting action:', action);
};
const stopTrackingAction = async ({ action, type = 'CUSTOM' }: { action: string; type?: 'CUSTOM' }) => {
  console.log('Stopping action:', action);
};
const trackAction = async ({ action, type = 'CUSTOM' }: { action: string; type?: 'CUSTOM' }) => {
  console.log('Adding action:', action);
};

export function SettingsScreen() {
  const { t } = useTranslation();
  const [userConsent, setUserConsent] = React.useState<UserConsent>({
    termsAccepted: false,
    trackingConsent: null
  });

  React.useEffect(() => {
    startTrackingAction({ action: 'Viewing Settings Screen', type: 'CUSTOM' });
    loadUserConsent();

    return () => {
      stopTrackingAction({ action: 'Viewing Settings Screen', type: 'CUSTOM' });
    };
  }, []);

  const loadUserConsent = async () => {
    try {
      const [termsAccepted, trackingConsent] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TERMS_ACCEPTED),
        AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CONSENT)
      ]);

      setUserConsent({
        termsAccepted: termsAccepted === 'true',
        trackingConsent: trackingConsent === 'true' ? true : trackingConsent === 'false' ? false : null
      });
    } catch (error) {
      console.warn('Failed to load user consent:', error);
    }
  };

  const formatConsentStatus = (consent: boolean | null) => {
    if (consent === null) return t('settings.notSet');
    return consent ? t('settings.accepted') : t('settings.declined');
  };

  return (
    <AppContainer
      accessibilityLabel="settings-screen-container">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text
          accessibilityLabel="settings-screen-title"
          variant="headlineMedium"
          style={styles.title}
        >
          {t('profile.settings')}
        </Text>

        <View style={styles.languageSelectorContainer}>
          <LanguageSelector />
        </View>

        <Card style={styles.consentCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.cardTitle]}
            >
              {t('settings.consent.title')}
            </Text>

            <View style={styles.consentItem}>
              <Text
                variant="bodyMedium"
                style={[styles.consentLabel]}
              >
                {t('settings.consent.terms')}:
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.consentValue,
                ]}
              >
                {formatConsentStatus(userConsent.termsAccepted)}
              </Text>
            </View>

            <View style={styles.consentItem}>
              <Text
                variant="bodyMedium"
                style={[styles.consentLabel]}
              >
                {t('settings.consent.tracking')}:
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.consentValue,
                ]}
              >
                {formatConsentStatus(userConsent.trackingConsent)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.websiteCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.cardTitle]}
            >
              {t('settings.website.title')}
            </Text>

            <View style={styles.websiteItem}>
              <Text
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.url')}:
              </Text>
              <ExternalLink
                href="https://potenzo.app"
                accessibilityLabel="settings-website-link"
                onPress={() => trackAction({ action: 'Website Link' })}
              >
                <Text
                  style={[
                    styles.websiteLink,
                    { color: getColorToken('core-primary') }
                  ]}
                >
                  potenzo.app
                </Text>
              </ExternalLink>
            </View>

            <View style={styles.websiteItem}>
              <Text
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.contact')}:
              </Text>
              <ExternalLink
                href="mailto:support@potenzo.app"
                accessibilityLabel="settings-contact-link"
                onPress={() => trackAction({ action: 'Contact Link' })}
              >
                <Text
                  style={[
                    styles.websiteLink,
                    { color: getColorToken('core-primary') }
                  ]}
                >
                  support@potenzo.app
                </Text>
              </ExternalLink>
            </View>

            <View style={styles.websiteItem}>
              <Text
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.terms')}:
              </Text>
              <ExternalLink
                href="https://potenzo.app/terms-and-conditions"
                accessibilityLabel="settings-terms-link"
                onPress={() => trackAction({ action: 'Terms of Service' })}
              >
                <Text
                  style={[
                    styles.websiteLink,
                    { color: getColorToken('core-primary') }
                  ]}
                >
                  {t('settings.website.termsLink')}
                </Text>
              </ExternalLink>
            </View>

            <View style={styles.websiteItem}>
              <Text
                variant="bodyMedium"
                style={[styles.websiteLabel]}
              >
                {t('settings.website.privacy')}:
              </Text>
              <ExternalLink
                href="https://potenzo.app/privacy-policy"
                accessibilityLabel="settings-privacy-link"
                onPress={() => trackAction({ action: 'Privacy Policy' })}
              >
                <Text
                  style={[
                    styles.websiteLink,
                    { color: getColorToken('core-primary') }
                  ]}
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
    </AppContainer>
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
    fontFamily: 'Exo2-Bold',
    textAlign: 'center',
    marginBottom: getSpacingToken('spacing-sm'),
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginBottom: getSpacingToken('spacing-lg'),
    opacity: 0.7,
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginTop: getSpacingToken('spacing-lg'),
    lineHeight: 24,
  },
  consentCard: {
    marginBottom: getSpacingToken('spacing-lg'),
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    marginBottom: getSpacingToken('spacing-md'),
  },
  consentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacingToken('spacing-sm'),
  },
  consentLabel: {
    fontFamily: 'OpenSans-Regular',
    flex: 1,
  },
  consentValue: {
    fontFamily: 'OpenSans-Bold',
  },
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
    fontFamily: 'OpenSans-Regular',
    flex: 1,
  },
  websiteLink: {
    fontFamily: 'OpenSans-Regular',
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;