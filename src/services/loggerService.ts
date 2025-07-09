export class Logger {
  private static getLogger() {
    return { ...console, debug: (a1: unknown, ...a2: unknown[]) => {} };
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
      Logger.getLogger().error(message, attributes);
    } catch (err) {
      console.error(`Logger.fatal failed: ${err}`, message, attributes);
    }
  }
}
