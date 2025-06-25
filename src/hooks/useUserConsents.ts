import { useConsentContext } from '@/contexts/ConsentContext';

export function useUserConsents() {
  const {
    consentData,
    isLoading,
    updateTermsAccepted,
    updateTrackingConsent,
    shouldShowTrackingModal
  } = useConsentContext();

  return {
    // Data
    termsAccepted: consentData.termsAccepted,
    termsAcceptedAt: consentData.termsAcceptedAt,
    trackingConsent: consentData.trackingConsent,
    trackingConsentAt: consentData.trackingConsentAt,
    trackingShown: consentData.trackingShown,
    
    // State
    isLoading,
    shouldShowTrackingModal,
    
    // Actions
    updateTermsAccepted,
    updateTrackingConsent,
    
    // Computed values
    hasCompletedOnboarding: consentData.termsAccepted,
    needsTrackingDecision: shouldShowTrackingModal
  };
} 