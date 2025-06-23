import {
  ImagePrivacyLevel,
  SessionReplay,
  TextAndInputPrivacyLevel,
  TouchPrivacyLevel,
} from "@datadog/mobile-react-native-session-replay";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BatchSize, DatadogProviderConfiguration, DdRum, DdSdkReactNative, RumActionType, SdkVerbosity, TrackingConsent, UploadFrequency } from 'expo-datadog';
import { usePathname, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

const STORAGE_KEYS = {
  TRACKING_CONSENT: 'tracking_consent',
} as const;

const config = new DatadogProviderConfiguration(
  process.env.EXPO_PUBLIC_DATADOG_CLIENT_TOKEN || '',
  process.env.EXPO_PUBLIC_DATADOG_ENV || '',
  process.env.EXPO_PUBLIC_DATADOG_APP_KEY || '',
  true,
  true,
  true,
  TrackingConsent.PENDING,
  true,
)

config.site = process.env.EXPO_PUBLIC_DATADOG_SITE || ''
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
}

type ActionType = {
  action: string;
  attributes?: Record<string, unknown>;
  type?: 'TAP' | 'SCROLL' | 'SWIPE' | 'BACK' | 'CUSTOM';
};

export const useDatadog = () => {
  const pathname = usePathname();
  const segments = useSegments();
  const viewKey = segments.join('/');

  const [isInitialized, setIsInitialized] = useState(false);
  const [trackingConsent, setTrackingConsentState] = useState<TrackingConsent>(TrackingConsent.PENDING);

  // Load tracking consent from storage on mount
  useEffect(() => {
    loadTrackingConsent();
  }, []);

  const loadTrackingConsent = async () => {
    try {
      const storedConsent = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CONSENT);
      if (storedConsent !== null) {
        const consent = storedConsent === 'true' ? TrackingConsent.GRANTED : TrackingConsent.NOT_GRANTED;
        setTrackingConsentState(consent);
        updateDatadogTrackingConsent(consent);
      }
    } catch (error) {
      console.warn('Failed to load tracking consent:', error);
    }
  };

  const updateDatadogTrackingConsent = async (consent: TrackingConsent) => {
    try {
      await DdSdkReactNative.setTrackingConsent(consent);
      setTrackingConsentState(consent);

      if (consent === TrackingConsent.GRANTED && !isInitialized) {
        await DdSdkReactNative.initialize(config);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Failed to update Datadog tracking consent:', error);
    }
  };

  const setTrackingConsent = async (consent: boolean) => {
    try {
      const trackingConsent = consent ? TrackingConsent.GRANTED : TrackingConsent.NOT_GRANTED;

      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CONSENT, consent.toString());

      // Update Datadog
      await updateDatadogTrackingConsent(trackingConsent);
    } catch (error) {
      console.error('Failed to set tracking consent:', error);
    }
  };

  const startTrackingAction = async ({ action, attributes = {}, type = RumActionType.TAP }: ActionType) => {
    try {
      console.log('Starting action:', action);
      await DdRum.startAction(type as RumActionType, action, { path: pathname, ...attributes });
    } catch (error) {
      console.error('Failed to start action:', error);
    }
  };

  const stopTrackingAction = async ({ action, attributes = {}, type = RumActionType.TAP }: ActionType) => {
    try {
      console.log('Stopping action:', action);
      await DdRum.stopAction(type as RumActionType, action, { path: pathname, ...attributes });
    } catch (error) {
      console.error('Failed to stop action:', error);
    }
  };

  const trackAction = async ({ action, attributes = {}, type = RumActionType.TAP }: ActionType) => {
    try {
      console.log('Adding action:', action);
      await DdRum.addAction(type as RumActionType, action, { path: pathname, ...attributes });
    } catch (error) {
      console.error('Failed to add action:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Only start view tracking if consent is granted and SDK is initialized
        if (trackingConsent === TrackingConsent.GRANTED && isInitialized) {
          DdRum.startView(viewKey, pathname);
        }
      } catch (error) {
        console.error('Failed to start Datadog view:', error);
      }
    })();
  }, [viewKey, pathname, isInitialized, trackingConsent]);

  return {
    config,
    onSDKInitialized,
    isInitialized,
    trackingConsent,
    setTrackingConsent,
    startTrackingAction,
    stopTrackingAction,
    trackAction,
  };
};