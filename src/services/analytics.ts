import AsyncStorage from '@react-native-async-storage/async-storage';
import { sentryService } from './SentryService';

const STORAGE_KEYS = {
  TRACKING_CONSENT: 'tracking_consent',
  TRACKING_CONSENT_AT: 'tracking_consent_at',
} as const;

export interface AnalyticsEvent {
  action: string;
  type?: 'CUSTOM' | 'ERROR' | 'NAVIGATION' | 'PERFORMANCE';
  properties?: Record<string, any>;
}

class AnalyticsService {
  private consentGranted: boolean | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const consent = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CONSENT);
      this.consentGranted = consent === 'true';
      this.isInitialized = true;
      
      // Update Sentry service with current consent
      sentryService.setConsent(this.consentGranted || false);
    } catch (error) {
      console.warn('Failed to load analytics consent:', error);
      this.consentGranted = false;
      this.isInitialized = true;
      sentryService.setConsent(false);
    }
  }

  async setConsent(consent: boolean): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CONSENT, consent.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CONSENT_AT, timestamp)
      ]);
      
      this.consentGranted = consent;
      
      // Update Sentry service with new consent
      sentryService.setConsent(consent);
    } catch (error) {
      console.warn('Failed to save analytics consent:', error);
    }
  }

  async getConsent(): Promise<boolean | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.consentGranted;
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.consentGranted) {
      // Still log to console in development for debugging
      if (__DEV__) {
        console.log('Analytics event (consent denied):', event);
      }
      return;
    }

    // Send to Sentry as a breadcrumb
    sentryService.addBreadcrumb({
      category: 'analytics',
      message: event.action,
      data: {
        type: event.type || 'CUSTOM',
        properties: event.properties,
      },
      level: 'info',
    });

    // Also log to console in development
    if (__DEV__) {
      console.log('Analytics event:', event);
    }
  }

  trackError(error: Error, context?: Record<string, any>): void {
    if (!this.consentGranted) {
      if (__DEV__) {
        console.error('Error (consent denied):', error, context);
      }
      return;
    }

    sentryService.captureException(error, context);
  }

  startTracking(action: string, type: string = 'CUSTOM'): void {
    this.trackEvent({
      action: `Started: ${action}`,
      type: type as any,
    });
  }

  stopTracking(action: string, type: string = 'CUSTOM'): void {
    this.trackEvent({
      action: `Stopped: ${action}`,
      type: type as any,
    });
  }
}

export const analyticsService = new AnalyticsService(); 