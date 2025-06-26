import React, { createContext, useContext, useEffect, useState } from 'react';

import { ConsentData, ConsentService } from '@/services/consentService';

interface ConsentContextType {
  consentData: ConsentData;
  isLoading: boolean;
  updateTermsAccepted: (accepted: boolean) => Promise<void>;
  updateTrackingConsent: (consent: boolean) => Promise<void>;
  shouldShowTrackingModal: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

interface ConsentProviderProps {
  children: React.ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [consentData, setConsentData] = useState<ConsentData>({
    termsAccepted: false,
    trackingShown: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsents();
  }, []);

  const loadConsents = async () => {
    try {
      setIsLoading(true);
      const data = await ConsentService.loadConsents();
      setConsentData(data);
    } catch (error) {
      sentryService.captureException(error, {
        message: 'Failed to load consents',
        source: 'ConsentContext',
        level: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTermsAccepted = async (accepted: boolean) => {
    try {
      await ConsentService.saveTermsAccepted(accepted);
      setConsentData(prev => ({
        ...prev,
        termsAccepted: accepted,
        termsAcceptedAt: new Date().toISOString(),
      }));
    } catch (error) {
      sentryService.captureException(error, {
        message: 'Failed to update terms acceptance',
        source: 'ConsentContext',
        level: 'error',
      });
      throw error;
    }
  };

  const updateTrackingConsent = async (consent: boolean) => {
    try {
      await ConsentService.saveTrackingConsent(consent);
      setConsentData(prev => ({
        ...prev,
        trackingConsent: consent,
        trackingConsentAt: new Date().toISOString(),
        trackingShown: true,
      }));
    } catch (error) {
      sentryService.captureException(error, {
        message: 'Failed to update tracking consent',
        source: 'ConsentContext',
        level: 'error',
      });
      throw error;
    }
  };

  const shouldShowTrackingModal =
    !consentData.trackingShown && consentData.trackingConsent === undefined;

  const value: ConsentContextType = {
    consentData,
    isLoading,
    updateTermsAccepted,
    updateTrackingConsent,
    shouldShowTrackingModal,
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsentContext() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsentContext must be used within a ConsentProvider');
  }
  return context;
}
