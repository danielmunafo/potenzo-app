import React from 'react';

import { Redirect } from 'expo-router';

import { useConsentContext } from '@/contexts/ConsentContext';
import '@/translations/i18n';

export default function App() {
  const { consentData } = useConsentContext();

  if (!consentData.termsAccepted) {
    return <Redirect href="/terms-and-conditions" />;
  }

  return <Redirect href="/workouts" />;
}
