import { useTranslation } from '@/hooks/useTranslation';
import {
  getBorderRadiusToken,
  getColorToken,
  getSpacingToken,
} from '@/theme/FigmaTokens';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

const workoutData = [
  { minutes: 15, kcal: 150, place: 'anywhere', icon: '💪' },
  { minutes: 15, kcal: 200, place: 'anywhere', icon: '🔥' },
  { minutes: 30, kcal: 300, place: 'park', icon: '🌞' },
  { minutes: 45, kcal: 450, place: 'park', icon: '🏋️' },
  { minutes: 20, kcal: 120, place: 'anywhere', icon: '🌅' },
  { minutes: 25, kcal: 180, place: 'anywhere', icon: '🏃' },
  { minutes: 18, kcal: 110, place: 'anywhere', icon: '🧘' },
  { minutes: 22, kcal: 160, place: 'park', icon: '🦵' },
  { minutes: 30, kcal: 250, place: 'anywhere', icon: '💥' },
  { minutes: 12, kcal: 90, place: 'anywhere', icon: '🤸' },
  { minutes: 10, kcal: 80, place: 'anywhere', icon: '💦' },
  { minutes: 35, kcal: 320, place: 'park', icon: '🌳' },
  { minutes: 28, kcal: 210, place: 'park', icon: '🌄' },
  { minutes: 16, kcal: 140, place: 'anywhere', icon: '🏙️' },
  { minutes: 40, kcal: 350, place: 'anywhere', icon: '🧘‍♂️' },
];

export function WorkoutCardList() {
  const { t } = useTranslation();

  const handleCardPress = () => {
    router.push('/workouts/preview');
  };

  return (
    <FlatList
      accessibilityLabel="workouts-list"
      data={workoutData}
      keyExtractor={(_, idx) => idx.toString()}
      contentContainerStyle={{
        paddingVertical: 0,
        paddingHorizontal: getSpacingToken('spacing-md'),
      }}
      renderItem={({ item, index }) => (
        <Pressable onPress={handleCardPress}>
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
                {t(`workouts.list.${index}.title`)}
              </Text>
              <View style={styles.row}>
                <Text
                  style={styles.chip}
                  variant="bodySmall"
                  accessibilityLabel={`workout-card-${index}.time`}
                >
                  {t('workouts.time', { minutes: item.minutes })}
                </Text>
                <Text
                  style={styles.chip}
                  variant="bodySmall"
                  accessibilityLabel={`workout-card-${index}.kcal`}
                >
                  {t('workouts.kcal', { kcal: item.kcal })}
                </Text>
                <Text
                  style={styles.chip}
                  variant="bodySmall"
                  accessibilityLabel={`workout-card-${index}.place`}
                >
                  {t(`workouts.place.${item.place}`)}
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
                {item.icon}
              </Text>
            </View>
          </Surface>
        </Pressable>
      )}
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
