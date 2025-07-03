import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken } from '@/theme/FigmaTokens';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function WorkoutPreview() {
  const { t } = useTranslation();
  const { workout } = useWorkoutContext();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();

  const exercise = workout?.exercises[currentExerciseIndex];

  useEffect(() => {
    if (workout) {
      setCurrentExerciseIndex(0);
    }
  }, [workout]);

  const navigateToPrevious = () => {
    if (workout && currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const navigateToNext = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  if (!exercise) {
    return <Text variant="displayLarge">{t('common.loading')}</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent animated />

      {/* Left navigation area */}
      <TouchableOpacity
        style={styles.leftNavigationArea}
        onPress={navigateToPrevious}
        activeOpacity={0.3}
      />

      {/* Right navigation area */}
      <TouchableOpacity
        style={styles.rightNavigationArea}
        onPress={navigateToNext}
        activeOpacity={0.3}
      />

      <View style={[styles.overlayContainer, containerPaddingStyle]}>
        <Text style={styles.text} variant="displayLarge">
          {t(`exercises.${exercise.name}.name`)}
        </Text>
        <Text style={styles.text} variant="bodyMedium">
          {t(`exercises.${exercise.name}.description`)}
        </Text>
        <Image
          accessibilityLabel="preview-workout-icon"
          source={require('@/assets/images/splash-icon.png')}
          style={styles.splashIcon}
          contentFit="contain"
        />
        {/* Exercise counter */}
        <Text style={styles.counterText} variant="bodySmall">
          {currentExerciseIndex + 1} / {workout?.exercises.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  text: {
    color: getColorToken('core-primary'),
    textAlignVertical: 'center',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  splashIcon: {
    width: 200,
    height: 200,
  },
  counterText: {
    color: getColorToken('core-primary'),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  leftNavigationArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '30%',
    height: '100%',
    zIndex: 10,
  },
  rightNavigationArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '30%',
    height: '100%',
    zIndex: 10,
  },
});
