import React from 'react';

import { SettingsScreen } from '@/app/settings';
import { TermsAndConditionsScreen } from '@/app/terms-and-conditions';
import { useConsentContext } from '@/contexts/ConsentContext';
import '@/translations/i18n';

export default function App() {
  const { consentData } = useConsentContext();

  if (!consentData.termsAccepted) {
    return <TermsAndConditionsScreen />;
  }

  return <SettingsScreen />;
}
