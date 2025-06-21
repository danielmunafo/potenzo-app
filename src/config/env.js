import Constants from 'expo-constants';

export const DATADOG_CONFIG = {
  apiKey: Constants.expoConfig?.extra?.datadogApiKey || process.env.DATADOG_API_KEY,
  appKey: Constants.expoConfig?.extra?.datadogAppKey || process.env.DATADOG_APP_KEY,
  site: Constants.expoConfig?.extra?.datadogSite || process.env.DATADOG_SITE || 'eu1.datadoghq.com',
  service: Constants.expoConfig?.extra?.datadogService || process.env.DATADOG_SERVICE || 'potenzo-app',
  env: Constants.expoConfig?.extra?.datadogEnv || process.env.DATADOG_ENV || 'local',
};

export const APP_CONFIG = {
  nodeEnv: Constants.expoConfig?.extra?.nodeEnv || process.env.NODE_ENV || 'development',
  isDevelopment: Constants.expoConfig?.extra?.nodeEnv === 'development' || process.env.NODE_ENV === 'development',
  isProduction: Constants.expoConfig?.extra?.nodeEnv === 'production' || process.env.NODE_ENV === 'production',
};

// Validate required environment variables
export const validateEnv = () => {
  const required = ['apiKey', 'appKey'];
  const missing = required.filter(key => !DATADOG_CONFIG[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing required Datadog configuration: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};