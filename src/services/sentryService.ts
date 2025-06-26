import type { SeverityLevel } from '@sentry/react-native';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { Logger } from './loggerService';

class SentryService {
  private hasTrackingConsent: boolean;
  constructor() {
    this.hasTrackingConsent = false;
  }

  setHasTrackingConsent(consent: boolean) {
    this.hasTrackingConsent = consent;
  }

  initialize(): ReturnType<typeof Sentry.reactNavigationIntegration> {
    const navigationIntegration = Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: !isRunningInExpoGo(),
    });

    Sentry.init({
      dsn: 'https://a359a1f33b81485a82ec1fcf5dfe12a4@o4509550482817024.ingest.de.sentry.io/4509559563747408',
      replaysSessionSampleRate: 1.0,
      replaysOnErrorSampleRate: 1.0,
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      enableUserInteractionTracing: true,
      enableAutoPerformanceTracing: true,
      enableAppHangTracking: true,
      enableAppStartTracking: true,
      enableCaptureFailedRequests: true,
      enableNativeFramesTracking: !isRunningInExpoGo(),
      enableAutoSessionTracking: false,
      sendDefaultPii: true,
      beforeSendSpan: span => {
        console.log(
          '[Sentry] beforeSendSpan called – consent is:',
          this.hasTrackingConsent
        );
        if (!this.hasTrackingConsent) {
          return null;
        }
        return span;
      },
      beforeScreenshot: () => {
        console.log(
          '[Sentry] beforeScreenshot called – consent is:',
          this.hasTrackingConsent
        );
        if (!this.hasTrackingConsent) {
          return false;
        }
        return true;
      },
      beforeSend: event => {
        console.log(
          '[Sentry] beforeSend called – consent is:',
          this.hasTrackingConsent
        );

        if (!this.hasTrackingConsent) {
          return null;
        }
        return event;
      },
      beforeBreadcrumb: breadcrumb => {
        console.log(
          '[Sentry] beforeBreadcrumb called – consent is:',
          this.hasTrackingConsent
        );

        if (!this.hasTrackingConsent) {
          return null;
        }
        return breadcrumb;
      },
      beforeSendTransaction: transaction => {
        console.log(
          '[Sentry] beforeSend called – consent is:',
          this.hasTrackingConsent
        );

        if (!this.hasTrackingConsent) {
          return null;
        }
        return transaction;
      },
      integrations: [
        navigationIntegration,
        Sentry.mobileReplayIntegration({
          maskAllText: false,
          maskAllImages: false,
          maskAllVectors: false,
        }),
        Sentry.reactNativeTracingIntegration(),
        Sentry.feedbackIntegration(),
      ],
      _experiments: {
        enableLogs: true,
      },
    });

    return navigationIntegration;
  }

  /**
   * Reports an exception to Sentry with optional extra context.
   */
  captureException(error: unknown, extras?: Record<string, any>): void {
    try {
      Sentry.withScope(scope => {
        if (extras) {
          Object.entries(extras).forEach(([key, value]) =>
            scope.setExtra(key, value)
          );
        }
        Sentry.captureException(error);
      });
    } catch (e) {
      Logger.error('sentryService.captureException failed', { error: e });
    }
  }

  /**
   * Sends a message to Sentry with optional severity.
   */
  captureMessage(message: string, level?: SeverityLevel): void {
    try {
      Sentry.captureMessage(message, level);
    } catch (e) {
      Logger.error('sentryService.captureMessage failed', { error: e });
    }
  }
}

export default new SentryService();
