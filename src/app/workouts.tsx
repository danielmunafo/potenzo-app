import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/ScreenContainer';
import { WorkoutCardList } from '@/components/workouts/WorkoutsCardList';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';

export function WorkoutsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const statusBarStyle = useStatusBarStyle();

  return (
    <ScreenContainer edges={['bottom']} accessibilityLabel="workouts-screen">
      <StatusBar
        backgroundColor={getColorToken('core-primary')}
        style={statusBarStyle}
        translucent
        hidden={false}
        animated
      />
      <Surface
        style={[
          styles.banner,
          { paddingTop: insets.top + getSpacingToken('spacing-sm') },
        ]}
      >
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
    fontFamily: 'Exo2-Bold',
  },
});

export default WorkoutsScreen;
