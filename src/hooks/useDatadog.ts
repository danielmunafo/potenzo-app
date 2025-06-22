import {
  ImagePrivacyLevel,
  SessionReplay,
  TextAndInputPrivacyLevel,
  TouchPrivacyLevel,
} from "@datadog/mobile-react-native-session-replay";
import { BatchSize, DatadogProviderConfiguration, DdRum, DdSdkReactNative, SdkVerbosity, TrackingConsent, UploadFrequency } from 'expo-datadog';
import { usePathname, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

const config = new DatadogProviderConfiguration(
  process.env.EXPO_PUBLIC_DATADOG_CLIENT_TOKEN,
  process.env.EXPO_PUBLIC_DATADOG_ENV,
  process.env.EXPO_PUBLIC_DATADOG_APP_KEY,
  true,
  true,
  true,
  TrackingConsent.PENDING
)

config.site = process.env.EXPO_PUBLIC_DATADOG_SITE
config.longTaskThresholdMs = 100
config.nativeCrashReportEnabled = true
config.sessionSamplingRate = 100

if (__DEV__) {
  config.uploadFrequency = UploadFrequency.FREQUENT
  config.batchSize = BatchSize.SMALL
  config.verbosity = SdkVerbosity.DEBUG
}

const onSDKInitialized = async () => {
  await SessionReplay.enable({
    replaySampleRate: 100,
    textAndInputPrivacyLevel: TextAndInputPrivacyLevel.MASK_SENSITIVE_INPUTS,
    imagePrivacyLevel: ImagePrivacyLevel.MASK_NONE,
    touchPrivacyLevel: TouchPrivacyLevel.SHOW,
  });
};

export const useDatadog = () => {
  const pathname = usePathname();
  const segments = useSegments();
  const viewKey = segments.join('/');

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!isInitialized) {
          await DdSdkReactNative.initialize(config);
          setIsInitialized(true);
        }
        DdRum.startView(pathname, viewKey);
      } catch (error) {
        console.error('Failed to initialize Datadog:', error);
      }
    })();
  }, [viewKey, pathname, isInitialized]);

  return {
    config,
    onSDKInitialized,
    isInitialized,
  };
};