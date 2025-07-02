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
  { translationKey: 'workout1' },
  { translationKey: 'workout2' },
  { translationKey: 'workout3' },
  { translationKey: 'workout4' },
  { translationKey: 'workout5' },
  { translationKey: 'workout6' },
  { translationKey: 'workout7' },
  { translationKey: 'workout8' },
  { translationKey: 'workout9' },
  { translationKey: 'workout10' },
  { translationKey: 'workout11' },
  { translationKey: 'workout12' },
  { translationKey: 'workout13' },
  { translationKey: 'workout14' },
  { translationKey: 'workout15' },
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
                {t(`workouts.${item.translationKey}.title`)}
              </Text>
              <View style={styles.row}>
                <Text
                  style={styles.chip}
                  variant="bodySmall"
                  accessibilityLabel={`workout-card-${index}.time`}
                >
                  {t('workouts.time', {
                    minutes: t(`workouts.${item.translationKey}.minutes`),
                  })}
                </Text>
                <Text
                  style={styles.chip}
                  variant="bodySmall"
                  accessibilityLabel={`workout-card-${index}.kcal`}
                >
                  {t('workouts.kcal', {
                    kcal: t(`workouts.${item.translationKey}.kcal`),
                  })}
                </Text>
                <Text
                  style={styles.chip}
                  variant="bodySmall"
                  accessibilityLabel={`workout-card-${index}.place`}
                >
                  {t(
                    `workouts.place.${t(`workouts.${item.translationKey}.place`)}`
                  )}
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
                {t(`workouts.${item.translationKey}.icon`)}
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
