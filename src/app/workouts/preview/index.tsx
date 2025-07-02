import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken } from '@/theme/FigmaTokens';
import { useEventListener } from 'expo';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoPlayerStatus, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Exercise } from '../../../constants/types';

export default function WorkoutPreview() {
  const { t } = useTranslation();
  const { workout } = useWorkoutContext();
  const [exercise, setExercise] = useState<Exercise | undefined>(
    workout?.exercises[0] ?? undefined
  );
  const [playerStatus, setPlayerStatus] =
    useState<VideoPlayerStatus>('loading');
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const player = useVideoPlayer(exercise?.assetId, player => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    if (workout) {
      setExercise(workout.exercises[0]);
    }
  }, [workout]);

  useEventListener(player, 'statusChange', ({ status, error }) => {
    setPlayerStatus(status);
  });

  if (playerStatus === 'loading' || !exercise) {
    return <Text variant="displayLarge">{t('common.loading')}</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent animated />
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        nativeControls={false}
        contentFit="cover"
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
  },
  splashIcon: {
    width: 200,
    height: 200,
  },
});
