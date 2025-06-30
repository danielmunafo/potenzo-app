import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/ScreenContainer';
import { WorkoutCardList } from '@/components/workouts/WorkoutsCardList';
import { useStatusBarStyle } from '@/hooks/useStatusBarStyle';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

export function WorkoutsScreen() {
  const { t } = useTranslation();
  const statusBarStyle = useStatusBarStyle();
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();

  return (
    <ScreenContainer edges={['bottom']} accessibilityLabel="workouts-screen">
      <StatusBar style={statusBarStyle} animated translucent />
      <Surface style={[styles.banner, containerPaddingStyle]}>
        <Text variant="titleMedium" style={styles.bannerText}>
          {t('workouts.banner.title')}
        </Text>
      </Surface>

      <WorkoutCardList />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: getColorToken('core-primary'),
    padding: getSpacingToken('spacing-md'),
    marginBottom: getSpacingToken('spacing-md'),
  },
  bannerText: {
    color: getColorToken('core-on-primary'),
    textAlign: 'center',
  },
});

export default WorkoutsScreen;
