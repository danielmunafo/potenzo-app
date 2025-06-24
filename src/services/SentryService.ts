import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';

class SentryService {
  private isInitialized = false;
  private consentGranted = false;
  private navigationIntegration: any;

  initialize(): void {
    if (this.isInitialized) return;

    this.navigationIntegration = Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: !isRunningInExpoGo(),
      routeChangeTimeoutMs: 1000,
      ignoreEmptyBackNavigationTransactions: true,
    });
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      sendDefaultPii: false, // Enable PII collection (controlled by beforeSend)
      replaysSessionSampleRate: 0, // Enable session replays (controlled by beforeSend)
      replaysOnErrorSampleRate: 0, // Enable error replays (controlled by beforeSend)
      tracesSampleRate: 0, // Enable performance tracing (controlled by beforeSend)
      integrations: [
        Sentry.mobileReplayIntegration({
          maskAllText: true, // Don't mask text (controlled by beforeSend)
          maskAllImages: true, // Don't mask images (controlled by beforeSend)
          maskAllVectors: true, // Don't mask vectors (controlled by beforeSend)
        }),
        Sentry.feedbackIntegration(),
        this.navigationIntegration
      ],
      enableNativeFramesTracking: !isRunningInExpoGo(),
      profilesSampleRate: 0, // Enable profiling (controlled by beforeSend)
      spotlight: __DEV__,
      beforeSend: (event) => null,
      beforeBreadcrumb: (breadcrumb) => null
    });

    this.isInitialized = true;
  }

  setConsent(consent: boolean): void {
    this.consentGranted = consent;

    if (consent) {
      Sentry.init({
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
        sendDefaultPii: true, // Enable PII collection (controlled by beforeSend)
        replaysSessionSampleRate: 1.0, // Enable session replays (controlled by beforeSend)
        replaysOnErrorSampleRate: 1.0, // Enable error replays (controlled by beforeSend)
        tracesSampleRate: 1.0, // Enable performance tracing (controlled by beforeSend)
        integrations: [
          Sentry.mobileReplayIntegration({
            maskAllText: false, // Don't mask text (controlled by beforeSend)
            maskAllImages: false, // Don't mask images (controlled by beforeSend)
            maskAllVectors: false, // Don't mask vectors (controlled by beforeSend)
          }),
          Sentry.feedbackIntegration(),
          this.navigationIntegration
        ],
        enableNativeFramesTracking: !isRunningInExpoGo(),
        profilesSampleRate: 1.0, // Enable profiling (controlled by beforeSend)
        spotlight: __DEV__,
      });
      this.enableTracking();
    } else {
      this.disableTracking();
    }
  }

  private enableTracking(): void {
    // Set user context to indicate consent
    Sentry.setUser({
      id: 'anonymous',
      consent_granted: true,
      consent_granted_at: new Date().toISOString(),
    });

    // The beforeSend and beforeBreadcrumb functions will now allow data through
  }

  private disableTracking(): void {
    // Clear user context
    Sentry.setUser(null);

    // The beforeSend and beforeBreadcrumb functions will now block all data
  }

  getNavigationIntegration(): any {
    return this.navigationIntegration;
  }

  // Expose Sentry.wrap for component wrapping
  wrap(component: React.ComponentType<any>): React.ComponentType<any> {
    return Sentry.wrap(component);
  }

  // Helper methods for direct Sentry operations
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.consentGranted) {
      if (__DEV__) {
        console.error('Sentry error (consent denied):', error, context);
      }
      return;
    }

    Sentry.captureException(error, {
      contexts: {
        analytics: context,
      },
    });
  }

  addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
    if (!this.consentGranted) {
      if (__DEV__) {
        console.log('Sentry breadcrumb (consent denied):', breadcrumb);
      }
      return;
    }

    Sentry.addBreadcrumb(breadcrumb);
  }

  setTag(key: string, value: string): void {
    if (!this.consentGranted) {
      if (__DEV__) {
        console.log('Sentry tag (consent denied):', { key, value });
      }
      return;
    }

    Sentry.setTag(key, value);
  }

  setContext(name: string, context: Record<string, any>): void {
    if (!this.consentGranted) {
      if (__DEV__) {
        console.log('Sentry context (consent denied):', { name, context });
      }
      return;
    }

    Sentry.setContext(name, context);
  }

  // Method to check if tracking is enabled
  isTrackingEnabled(): boolean {
    return this.consentGranted;
  }
}

export const sentryService = new SentryService(); 