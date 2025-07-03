import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { useStatusBarContext } from '../../contexts/StatusBarContext';
import { useTabsContext } from '../../contexts/TabsContext';
import { ScreenContainer } from '../ScreenContainer';

export default function WorkoutPreview() {
  const { t } = useTranslation();
  const { workout, setWorkout } = useWorkoutContext();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();

  const exercise = workout?.exercises[currentExerciseIndex];

  useEffect(() => {
    setIsStatusBarVisible(false);
    setIsTabsVisible(false);
  }, [setIsTabsVisible, setIsStatusBarVisible]);

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

  if (!exercise || !workout) {
    return <Text variant="displayLarge">{t('common.loading')}</Text>;
  }

  return (
    <ScreenContainer accessibilityLabel="preview-screen-container">
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

      <View
        style={[
          StyleSheet.absoluteFill,
          styles.overlayContainer,
          containerPaddingStyle,
        ]}
      >
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
      </View>
      <View style={styles.bottomButtons}>
        <IconButton
          style={styles.overNavigationArea}
          mode="contained"
          containerColor={getColorToken('background')}
          icon={() => (
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={getColorToken('core-primary')}
            />
          )}
          onPress={() => {
            setWorkout(undefined);
            setIsTabsVisible(true);
            setIsStatusBarVisible(true);
          }}
        />
        <Button
          style={styles.overNavigationArea}
          buttonColor={getColorToken('core-primary')}
          mode="elevated"
        >
          {t('preview.start')}
        </Button>
        <IconButton
          style={styles.overNavigationArea}
          mode="contained"
          containerColor={getColorToken('background')}
          icon={() => (
            <MaterialIcons
              name="info"
              size={24}
              color={getColorToken('core-primary')}
            />
          )}
          onPress={() => {
            setWorkout(undefined);
            setIsTabsVisible(true);
            setIsStatusBarVisible(true);
          }}
        />
      </View>
    </ScreenContainer>
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
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  splashIcon: {
    width: 200,
    height: 200,
    marginBottom: 80,
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
  overNavigationArea: {
    zIndex: 11,
  },
  bottomButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    height: 80,
    padding: getSpacingToken('spacing-md'),
    bottom: 0,
    width: '100%',
  },
});
