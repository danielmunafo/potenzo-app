import AsyncStorage from '@react-native-async-storage/async-storage';
import { SentryService } from './sentryService';

export const STORAGE_KEYS = {
  TERMS_ACCEPTED: 'terms_accepted',
  TRACKING_CONSENT: 'tracking_consent',
  TRACKING_CONSENT_AT: 'tracking_consent_at',
  TRACKING_SHOWN: 'tracking_shown',
  TERMS_ACCEPTED_AT: 'terms_accepted_at'
} as const;

export interface ConsentData {
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  trackingConsent?: boolean;
  trackingConsentAt?: string;
  trackingShown: boolean;
}

export class ConsentService {
  static async loadConsents(): Promise<ConsentData> {
    try {
      const [
        storedTerms,
        storedTermsAt,
        storedTracking,
        storedTrackingAt,
        trackingShown
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TERMS_ACCEPTED),
        AsyncStorage.getItem(STORAGE_KEYS.TERMS_ACCEPTED_AT),
        AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CONSENT),
        AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CONSENT_AT),
        AsyncStorage.getItem(STORAGE_KEYS.TRACKING_SHOWN)
      ]);

      return {
        termsAccepted: storedTerms === 'true',
        termsAcceptedAt: storedTermsAt || undefined,
        trackingConsent: storedTracking === null ? undefined : storedTracking === 'true',
        trackingConsentAt: storedTrackingAt || undefined,
        trackingShown: trackingShown === 'true'
      };
    } catch (error) {
      SentryService.captureException(error, {
        message: 'Failed to load consents',
        source: 'ConsentService',
        level: 'error',
      });
      return {
        termsAccepted: false,
        trackingShown: false
      };
    }
  }

  static async saveTermsAccepted(accepted: boolean): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TERMS_ACCEPTED, accepted.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.TERMS_ACCEPTED_AT, timestamp)
      ]);
    } catch (error) {
      SentryService.captureException(error, {
        message: 'Failed to save terms acceptance',
        source: 'ConsentService',
        level: 'error',
      });
      throw error;
    }
  }

  static async saveTrackingConsent(consent: boolean): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CONSENT, consent.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CONSENT_AT, timestamp),
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_SHOWN, 'true')
      ]);
    } catch (error) {
      SentryService.captureException(error, {
        message: 'Failed to save tracking consent',
        source: 'ConsentService',
        level: 'error',
      });
      throw error;
    }
  }
} 