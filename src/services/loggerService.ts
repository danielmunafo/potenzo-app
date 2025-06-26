import * as Sentry from '@sentry/react-native';

/**
 * Logger wraps Sentry's structured logging APIs.
 * Provides methods for trace, debug, info, warn, error, and fatal logs.
 */
export class Logger {
  private static getLogger() {
    return (Sentry as any).logger;
  }

  static trace(message: string, attributes?: Record<string, unknown>): void {
    try {
      Logger.getLogger().trace(message, attributes);
    } catch (err) {
      console.trace(`Logger.trace failed: ${err}`, message, attributes);
    }
  }

  static debug(message: string, attributes?: Record<string, unknown>): void {
    try {
      Logger.getLogger().debug(message, attributes);
    } catch (err) {
      console.debug(`Logger.debug failed: ${err}`, message, attributes);
    }
  }

  static info(message: string, attributes?: Record<string, unknown>): void {
    try {
      Logger.getLogger().info(message, attributes);
    } catch (err) {
      console.info(`Logger.info failed: ${err}`, message, attributes);
    }
  }

  static warn(message: string, attributes?: Record<string, unknown>): void {
    try {
      Logger.getLogger().warn(message, attributes);
    } catch (err) {
      console.warn(`Logger.warn failed: ${err}`, message, attributes);
    }
  }

  static error(message: string, attributes?: Record<string, unknown>): void {
    try {
      Logger.getLogger().error(message, attributes);
    } catch (err) {
      console.error(`Logger.error failed: ${err}`, message, attributes);
    }
  }

  static fatal(message: string, attributes?: Record<string, unknown>): void {
    try {
      Logger.getLogger().fatal(message, attributes);
    } catch (err) {
      console.error(`Logger.fatal failed: ${err}`, message, attributes);
    }
  }
}
