import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getBorderRadiusToken, getSpacingToken } from '@/theme/FigmaTokens';
import React, { memo, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Exercise, Workout } from '../../constants/types';
import { useStatusBarContext } from '../../contexts/StatusBarContext';
import { useTabsContext } from '../../contexts/TabsContext';

const exercises: Exercise[] = [
  {
    id: `1`,
    name: 'skippingRope',
    assetId: require('@/assets/gifs/skipping-rope.mp4'),
    duration: 15,
    sets: 10,
    reps: 100,
    rest: 20,
  },
  {
    id: `2`,
    name: 'humanFlag',
    assetId: require('@/assets/gifs/human-flag.mp4'),
    duration: 15,
    sets: 10,
    reps: 100,
    rest: 20,
  },
  {
    id: `3`,
    name: 'pressToHandstand',
    assetId: require('@/assets/gifs/press-to-handstand.mp4'),
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
    id: 't1',
    title: 'workout1',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[0],
  },
  {
    id: 't2',
    title: 'workout2',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [exercises[1], exercises[0]],
    icon: workoutIcons[1],
  },
  {
    id: 't3',
    title: 'workout3',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [exercises[2], exercises[1]],
    icon: workoutIcons[2],
  },
  {
    id: 't4',
    title: 'workout4',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [exercises[0], exercises[2]],
    icon: workoutIcons[3],
  },
  {
    id: 't5',
    title: 'workout5',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [exercises[0], exercises[1]],
    icon: workoutIcons[4],
  },
  {
    id: 't6',
    title: 'workout6',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[5],
  },
  {
    id: 't7',
    title: 'workout7',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[6],
  },
  {
    id: 't8',
    title: 'workout8',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[7],
  },
  {
    id: 't9',
    title: 'workout9',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[8],
  },
  {
    id: '10',
    title: 'workout10',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[9],
  },
  {
    id: '11',
    title: 'workout11',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[10],
  },
  {
    id: '12',
    title: 'workout12',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[9],
  },
  {
    id: '13',
    title: 'workout13',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[0],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[8],
  },
  {
    id: '14',
    title: 'workout14',
    minutes: 15,
    kcal: 150,
    place: workoutPlaces[1],
    equipment: [],
    exercises: [...exercises],
    icon: workoutIcons[7],
  },
  {
    id: '15',
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
      <Animated.View entering={FadeInLeft.delay(index * 100)}>
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
      </Animated.View>
    </Pressable>
  );
});
WorkoutCard.displayName = 'WorkoutCard';

export function WorkoutCardList() {
  const { setWorkout, step, setStep } = useWorkoutContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const { setIsTabsVisible } = useTabsContext();

  const handleCardPress = useCallback(
    (workout: Workout) => {
      if (workout) {
        setIsStatusBarVisible(false);
        setIsTabsVisible(false);
        setWorkout(workout);
        setTimeout(() => {
          setStep(step + 1);
        }, 15);
      }
    },
    [setWorkout, step, setStep, setIsStatusBarVisible, setIsTabsVisible]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Workout; index: number }) => (
      <WorkoutCard
        key={item.id}
        workout={item}
        index={index}
        onPress={handleCardPress}
      />
    ),
    [handleCardPress]
  );

  return (
    <FlatList
      accessibilityLabel="workouts-list"
      data={workoutData}
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
    borderRadius: getBorderRadiusToken('radius-md'),
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
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'OpenSans-Light',
    fontSize: 10,
    marginRight: getSpacingToken('spacing-xs'),
    paddingVertical: getSpacingToken('spacing-xs'),
  },
  iconContainer: {
    alignItems: 'center',
    borderBottomRightRadius: getBorderRadiusToken('radius-md'),
    borderTopRightRadius: getBorderRadiusToken('radius-md'),
    justifyContent: 'center',
    width: 64,
  },
  icon: {
    fontSize: 36,
  },
});
