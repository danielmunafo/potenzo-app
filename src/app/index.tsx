import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { TermsAndConditionsScreen } from '@/app/terms-and-conditions';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useConsentContext } from '@/contexts/ConsentContext';
import { useTranslation } from '@/hooks/useTranslation';
import '@/translations/i18n';
import { WorkoutCardList } from '../components/workouts/WorkoutsCardList';
import { getColorToken, getSpacingToken } from '../theme/FigmaTokens';

export default function App() {
  const { consentData } = useConsentContext();
  const { t } = useTranslation();

  if (!consentData.termsAccepted) {
    return <TermsAndConditionsScreen />;
  }

  return (
    <ScreenContainer accessibilityLabel="app-screen">
      <Surface style={styles.banner}>
        <Text variant="titleMedium" style={styles.bannerText}>
          {t('home.banner.title')}
        </Text>
      </Surface>

      <WorkoutCardList />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: getColorToken('core-primary'),
    paddingVertical: getSpacingToken('spacing-md'),
    paddingHorizontal: getSpacingToken('spacing-md'),
    marginBottom: getSpacingToken('spacing-md'),
    elevation: 2,
  },
  bannerText: {
    color: getColorToken('core-on-primary'),
    textAlign: 'center',
    fontWeight: '600',
  },
});
