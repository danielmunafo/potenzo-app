import * as Sentry from '@sentry/react-native';
// @ts-ignore: Access experimental logger API
const SentryLogger = (Sentry as any).logger;

/**
 * Logger wraps Sentry's structured logging APIs.
 * Provides methods for trace, debug, info, warn, error, and fatal logs.
 */
export class Logger {
  private static logger: any = SentryLogger;

  static trace(message: string, attributes?: Record<string, unknown>): void {
    try {
      this.logger.trace(message, attributes);
    } catch (err) {
      console.trace(`Logger.trace failed: ${err}`, message, attributes);
    }
  }

  static debug(message: string, attributes?: Record<string, unknown>): void {
    try {
      this.logger.debug(message, attributes);
    } catch (err) {
      console.debug(`Logger.debug failed: ${err}`, message, attributes);
    }
  }

  static info(message: string, attributes?: Record<string, unknown>): void {
    try {
      this.logger.info(message, attributes);
    } catch (err) {
      console.info(`Logger.info failed: ${err}`, message, attributes);
    }
  }

  static warn(message: string, attributes?: Record<string, unknown>): void {
    try {
      this.logger.warn(message, attributes);
    } catch (err) {
      console.warn(`Logger.warn failed: ${err}`, message, attributes);
    }
  }

  static error(message: string, attributes?: Record<string, unknown>): void {
    try {
      this.logger.error(message, attributes);
    } catch (err) {
      console.error(`Logger.error failed: ${err}`, message, attributes);
    }
  }

  static fatal(message: string, attributes?: Record<string, unknown>): void {
    try {
      this.logger.fatal(message, attributes);
    } catch (err) {
      console.error(`Logger.fatal failed: ${err}`, message, attributes);
    }
  }
} 