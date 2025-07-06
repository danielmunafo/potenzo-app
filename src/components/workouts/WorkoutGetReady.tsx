import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, BackHandler, StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text } from 'react-native-paper';
import { useTabsContext } from '../../contexts/TabsContext';
import { ScreenContainer } from '../ScreenContainer';

export function WorkoutGetReady() {
  const { t } = useTranslation();
  const { workout, setStep, step } = useWorkoutContext();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();

  const [countdown, setCountdown] = useState(5);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setIsStatusBarVisible(false);
    setIsTabsVisible(false);
  }, [setIsTabsVisible, setIsStatusBarVisible]);

  // Countdown logic
  useEffect(() => {
    if (countdown > 1) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    // When countdown reaches 1, start pulsing
    if (countdown === 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [countdown, pulseAnim]);

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
        <IconButton icon="arrow-left" onPress={onBack} />

        <Text variant="titleLarge" style={styles.title}>
          {t('workoutGetReady.title')}
        </Text>

        <View style={styles.chipRow}>
          <Chip>{t('workoutGetReady.aerobics')}</Chip>
          <Chip>{t('workoutGetReady.functional')}</Chip>
          <Chip>{t('workoutGetReady.other')}</Chip>
        </View>

        <Text>{t('workoutGetReady.heartRatePrompt')}</Text>
        <Chip>{t('workoutGetReady.heartRateValue', { value: 120 })}</Chip>

        <Text>{t('workoutGetReady.focusPrompt')}</Text>
        <Chip>{t('workoutGetReady.focusValue')}</Chip>

        <Text>{t('workoutGetReady.sweatLevelPrompt')}</Text>
        <Chip>{t('workoutGetReady.sweatLevelValue')}</Chip>

        <Text>
          {t('workoutGetReady.scienceBacking')}{' '}
          <Text style={{ textDecorationLine: 'underline' }}>
            {t('workoutGetReady.studiesPage')}
          </Text>
        </Text>

        {/* Countdown */}
        <View style={styles.countdown}>
          <Text style={styles.countdownNumber}>{countdown}</Text>
        </View>

        {/* Pulsing Start Button */}
        <Animated.View
          style={{ transform: [{ scale: countdown === 1 ? pulseAnim : 1 }] }}
        >
          <Button
            mode="contained"
            icon="play"
            onPress={() => setStep(step + 1)}
            disabled={countdown !== 1}
          >
            {t('workoutGetReady.start')}
          </Button>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  countdown: {
    position: 'absolute',
    right: 16,
    top: 100,
    alignItems: 'center',
  },
  countdownNumber: { fontSize: 48, color: 'green' },
});
