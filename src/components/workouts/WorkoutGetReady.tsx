import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTabsContext } from '../../contexts/TabsContext';
import { ScreenContainer } from '../ScreenContainer';

export function WorkoutGetReady() {
  const { t } = useTranslation();
  const { workout, setStep, step } = useWorkoutContext();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();

  useEffect(() => {
    setIsStatusBarVisible(false);
    setIsTabsVisible(false);
  }, [setIsTabsVisible, setIsStatusBarVisible]);

  const onBack = useCallback(() => {
    setStep(step - 1);
  }, [setStep, step]);

  useFocusEffect(
    useCallback(() => {
      const onHardwareBackPress = () => {
        onBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onHardwareBackPress
      );

      return () => subscription.remove();
    }, [onBack])
  );

  if (!workout) return <></>;

  return (
    <ScreenContainer accessibilityLabel="workout-check-in-screen-container">
      <View style={styles.container}>
        <Text variant="displayLarge">{t(workout.title)}</Text>
      </View>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
});
