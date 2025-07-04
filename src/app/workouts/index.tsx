import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/ScreenContainer';
import WorkoutPreview from '@/components/workouts/WorkoutPreview';
import { WorkoutCardList } from '@/components/workouts/WorkoutsCardList';
import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

export function WorkoutsScreen() {
  const { t } = useTranslation();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const { workout } = useWorkoutContext();

  useEffect(() => {
    setIsStatusBarVisible(true);
  }, [setIsStatusBarVisible]);

  if (workout) {
    return <WorkoutPreview />;
  }

  return (
    <ScreenContainer edges={['bottom']} accessibilityLabel="workouts-screen">
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
