/* global jest */

jest.mock('expo-localization', () => ({
  useLocales: () => [
    {
      languageTag: 'en-US',
      languageCode: null,
      regionCode: null,
      currencyCode: null,
      currencySymbol: null,
      decimalSeparator: null,
      digitGroupingSeparator: null,
      textDirection: null,
      measurementSystem: null,
      temperatureUnit: null,
    },
  ],
  getLocales: () => [
    {
      languageTag: 'en-US',
      languageCode: 'en',
      regionCode: 'US',
      currencyCode: 'USD',
      currencySymbol: '$',
      decimalSeparator: '.',
      digitGroupingSeparator: ',',
      textDirection: 'ltr',
      measurementSystem: 'metric',
      temperatureUnit: 'celsius',
    },
  ],
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock the Datadog hook
jest.mock('@/hooks/useDatadog', () => ({
  useDatadog: () => ({
    config: {},
    onSDKInitialized: jest.fn(),
    isInitialized: false,
    trackingConsent: 'PENDING',
    setTrackingConsent: jest.fn(),
    startTrackingAction: jest.fn(),
    stopTrackingAction: jest.fn(),
    trackAction: jest.fn(),
  }),
}));