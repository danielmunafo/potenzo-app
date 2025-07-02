import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getBorderRadiusToken,
  getColorToken,
  getSpacingToken,
} from '@/theme/FigmaTokens';
import { router } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Exercise, Workout } from '../../constants/types';

const exercises: Exercise[] = [
  {
    name: 'skippingRope',
    assetId: require('@/assets/videos/skipping-rope.mov'),
    duration: 15,
    sets: 10,
    reps: 100,
    rest: 20,
  },
  {
    name: 'humanFlag',
    assetId: require('@/assets/videos/human-flag.mov'),
    duration: 15,
    sets: 10,
    reps: 100,
    rest: 20,
  },
  {
    name: 'pressToHandstand',
    assetId: require('@/assets/videos/press-to-handstand.mov'),
    duration: 15,
    sets: 10,
    reps: 100,
    rest: 20,
  },
];

const workoutIcons = [
  '🔥',
  '💪',
  '⚡',
  '🏃‍♂️',
  '🧘‍♀️',
  '🏋️‍♂️',
  '🏠',
  '🌳',
  '⭐',
  '🎖️',
  '🥇',
  '💯',
];

const workoutPlaces = ['anywhere', 'park'];

const workoutData: Workout[] = [
  {
    title: 'workout1',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[0],
  },
  {
    title: 'workout2',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [exercises[1], exercises[0]],
    icon: workoutIcons[1],
  },
  {
    title: 'workout3',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [exercises[2], exercises[1]],
    icon: workoutIcons[2],
  },
  {
    title: 'workout4',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [exercises[0], exercises[2]],
    icon: workoutIcons[3],
  },
  {
    title: 'workout5',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [exercises[0], exercises[1]],
    icon: workoutIcons[4],
  },
  {
    title: 'workout6',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[5],
  },
  {
    title: 'workout7',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[6],
  },
  {
    title: 'workout8',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[7],
  },
  {
    title: 'workout9',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[8],
  },
  {
    title: 'workout10',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[9],
  },
  {
    title: 'workout11',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[10],
  },
  {
    title: 'workout12',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[9],
  },
  {
    title: 'workout13',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[8],
  },
  {
    title: 'workout14',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[7],
  },
  {
    title: 'workout15',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[6],
  },
];

interface WorkoutCardProps {
  workout: Workout;
  index: number;
  onPress: (workout: Workout) => void;
}

const WorkoutCard = memo(({ workout, index, onPress }: WorkoutCardProps) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={() => onPress(workout)}>
      <Surface
        accessibilityLabel={`workout-card-${index}.surface`}
        style={styles.card}
      >
        <View
          accessibilityLabel={`workout-card-${index}.text-container`}
          style={styles.textContainer}
        >
          <Text
            variant="titleMedium"
            style={styles.title}
            accessibilityLabel={`workout-card-${index}.title`}
          >
            {t(`workouts.${workout.title}`)}
          </Text>
          <View style={styles.row}>
            <Text
              style={styles.chip}
              variant="bodySmall"
              accessibilityLabel={`workout-card-${index}.time`}
            >
              {t('workouts.time', {
                minutes: workout.minutes,
              })}
            </Text>
            <Text
              style={styles.chip}
              variant="bodySmall"
              accessibilityLabel={`workout-card-${index}.kcal`}
            >
              {t('workouts.kcal', {
                kcal: workout.kcal,
              })}
            </Text>
            <Text
              style={styles.chip}
              variant="bodySmall"
              accessibilityLabel={`workout-card-${index}.place`}
            >
              {t(`workouts.place.${workout.place}`)}
            </Text>
          </View>
        </View>
        <View
          accessibilityLabel={`workout-card-${index}.icon-container`}
          style={styles.iconContainer}
        >
          <Text
            style={styles.icon}
            accessibilityLabel={`workout-card-${index}.icon`}
          >
            {workout.icon}
          </Text>
        </View>
      </Surface>
    </Pressable>
  );
});
WorkoutCard.displayName = 'WorkoutCard';

export function WorkoutCardList() {
  const { setWorkout } = useWorkoutContext();

  const handleCardPress = useCallback(
    (workout: Workout) => {
      if (workout) {
        setWorkout(workout);
        router.push('/workouts/preview');
      }
    },
    [setWorkout]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Workout; index: number }) => (
      <WorkoutCard workout={item} index={index} onPress={handleCardPress} />
    ),
    [handleCardPress]
  );

  return (
    <FlatList
      accessibilityLabel="workouts-list"
      data={workoutData}
      keyExtractor={(_, idx) => idx.toString()}
      contentContainerStyle={{
        paddingVertical: 0,
        paddingHorizontal: getSpacingToken('spacing-md'),
      }}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'stretch',
    backgroundColor: getColorToken('surface'),
    borderLeftColor: getColorToken('core-primary'),
    borderLeftWidth: getSpacingToken('spacing-sm'),
    borderRadius: getBorderRadiusToken('radius-md'),
    elevation: 2,
    flexDirection: 'row',
    marginBottom: getSpacingToken('spacing-md'),
    minHeight: 80,
    padding: 0,
  },
  textContainer: {
    flex: 1,
    padding: getSpacingToken('spacing-md'),
    justifyContent: 'center',
  },
  title: {
    marginBottom: getSpacingToken('spacing-sm'),
  },
  row: {
    flexDirection: 'row',
    gap: getSpacingToken('spacing-xs'),
  },
  chip: {
    backgroundColor: getColorToken('core-primary'),
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'OpenSans-Light',
    color: getColorToken('core-on-primary'),
    fontSize: 10,
    marginRight: getSpacingToken('spacing-xs'),
    paddingHorizontal: getSpacingToken('spacing-sm'),
    paddingVertical: getSpacingToken('spacing-xs'),
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: getColorToken('core-primary'),
    borderBottomRightRadius: getBorderRadiusToken('radius-md'),
    borderTopRightRadius: getBorderRadiusToken('radius-md'),
    justifyContent: 'center',
    width: 64,
  },
  icon: {
    fontSize: 36,
    color: getColorToken('core-on-primary'),
  },
});
