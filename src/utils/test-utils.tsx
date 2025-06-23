import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { AppThemeProvider } from '@/theme/ThemeProvider';
import i18n from '@/translations/i18n';

// Reusable test wrapper that handles async state updates
export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider systemTheme="light">
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </AppThemeProvider>
  );
} 