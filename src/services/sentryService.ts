import type { SeverityLevel } from '@sentry/react-native';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { Logger } from './loggerService';

class SentryService {
  public readonly navigationIntegration: ReturnType<
    typeof Sentry.reactNavigationIntegration
  >;
  private hasTrackingConsent: boolean;
  constructor() {
    this.hasTrackingConsent = true; // default to true for now.
    this.navigationIntegration = Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: !isRunningInExpoGo(),
    });
  }

  initialize(hasTrackingConsent: boolean = true) {
    if (!hasTrackingConsent) {
      Sentry.init({
        dsn: '',
        enabled: false,
      });
      return;
    }

    Sentry.init({
      dsn: 'https://a359a1f33b81485a82ec1fcf5dfe12a4@o4509550482817024.ingest.de.sentry.io/4509559563747408',
      enabled: true,
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
      enableAutoSessionTracking: true,
      sendDefaultPii: true,
      beforeSendSpan: span => {
        Logger.debug('[Sentry] beforeSendSpan called – consent is:', {
          hasTrackingConsent: this.hasTrackingConsent,
        });
        if (!this.hasTrackingConsent) {
          return null;
        }
        return span;
      },
      beforeScreenshot: () => {
        Logger.debug('[Sentry] beforeScreenshot called – consent is:', {
          hasTrackingConsent: this.hasTrackingConsent,
        });
        if (!this.hasTrackingConsent) {
          return false;
        }
        return true;
      },
      beforeSend: event => {
        Logger.debug('[Sentry] beforeSend called – consent is:', {
          hasTrackingConsent: this.hasTrackingConsent,
        });

        if (!this.hasTrackingConsent) {
          return null;
        }
        return event;
      },
      beforeBreadcrumb: breadcrumb => {
        Logger.debug('[Sentry] beforeBreadcrumb called – consent is:', {
          hasTrackingConsent: this.hasTrackingConsent,
        });

        if (!this.hasTrackingConsent) {
          return null;
        }
        return breadcrumb;
      },
      beforeSendTransaction: transaction => {
        Logger.debug('[Sentry] beforeSendTransaction called – consent is:', {
          hasTrackingConsent: this.hasTrackingConsent,
        });

        if (!this.hasTrackingConsent) {
          return null;
        }
        return transaction;
      },
      integrations: [
        this.navigationIntegration,
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
