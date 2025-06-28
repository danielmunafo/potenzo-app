import * as amplitude from '@amplitude/analytics-react-native';

class AmplitudeService {
  constructor() {
    amplitude.init(process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || '', undefined, {
      serverZone: 'EU',
    });
    amplitude.setOptOut(true);
  }

  updateConsent(trackingConsent: boolean) {
    amplitude.setOptOut(!trackingConsent);
  }

  track(eventName: string, properties?: Record<string, unknown>) {
    amplitude.track(eventName, properties);
  }
}

export default new AmplitudeService();
