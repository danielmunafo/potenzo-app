import { AnalyticsEvent, analyticsService } from '@/services/analytics';
import { useCallback, useEffect, useState } from 'react';

export function useAnalytics() {
  const [consentGranted, setConsentGranted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsent();
  }, []);

  const loadConsent = async () => {
    try {
      setIsLoading(true);
      const consent = await analyticsService.getConsent();
      setConsentGranted(consent);
    } catch (error) {
      console.warn('Failed to load analytics consent:', error);
      setConsentGranted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setConsent = useCallback(async (consent: boolean) => {
    try {
      await analyticsService.setConsent(consent);
      setConsentGranted(consent);
    } catch (error) {
      console.warn('Failed to set analytics consent:', error);
    }
  }, []);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analyticsService.trackEvent(event);
  }, []);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    analyticsService.trackError(error, context);
  }, []);

  const startTracking = useCallback((action: string, type: string = 'CUSTOM') => {
    analyticsService.startTracking(action, type);
  }, []);

  const stopTracking = useCallback((action: string, type: string = 'CUSTOM') => {
    analyticsService.stopTracking(action, type);
  }, []);

  return {
    consentGranted,
    isLoading,
    setConsent,
    trackEvent,
    trackError,
    startTracking,
    stopTracking,
  };
} 