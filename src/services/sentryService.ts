import type { SeverityLevel } from '@sentry/react-native';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { Logger } from './loggerService';

export class SentryService {
  static initializeBeforeConsent(): void {
    Sentry.init({
      dsn: '',
      defaultIntegrations: false,
      enabled: false,
    });
  }

  static initialize(
    consent: boolean
  ): ReturnType<typeof Sentry.reactNavigationIntegration> | undefined {
    if (!consent) {
      return undefined;
    }

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
      sendDefaultPii: true,
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
  static captureException(error: unknown, extras?: Record<string, any>): void {
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
      Logger.error('SentryService.captureException failed', { error: e });
    }
  }

  /**
   * Sends a message to Sentry with optional severity.
   */
  static captureMessage(message: string, level?: SeverityLevel): void {
    try {
      Sentry.captureMessage(message, level);
    } catch (e) {
      Logger.error('SentryService.captureMessage failed', { error: e });
    }
  }
}
