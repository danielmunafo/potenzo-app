import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { useStatusBarContext } from '../../contexts/StatusBarContext';
import { useTabsContext } from '../../contexts/TabsContext';
import { useContainerStyleWhenHiddenStatusBar } from '../../hooks/useStyleWhenHiddenStatusBar';
import { ScreenContainer } from '../ScreenContainer';
import { WorkoutCardList } from './WorkoutsCardList';

export function WorkoutsList() {
  const { t } = useTranslation();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();

  useEffect(() => {
    setIsStatusBarVisible(true);
    setIsTabsVisible(true);
  }, [setIsTabsVisible, setIsStatusBarVisible]);

  return (
    <ScreenContainer edges={['bottom']} accessibilityLabel="workouts-screen">
      <Animated.View entering={SlideInUp} exiting={SlideOutUp}>
        <Surface style={[styles.banner, containerPaddingStyle]}>
          <Text variant="titleMedium" style={styles.bannerText}>
            {t('workouts.banner.title')}
          </Text>
        </Surface>
      </Animated.View>

      <WorkoutCardList />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: getColorToken('extended-accent'),
    padding: getSpacingToken('spacing-md'),
    marginBottom: getSpacingToken('spacing-sm'),
  },
  bannerText: {
    textAlign: 'center',
  },
});
