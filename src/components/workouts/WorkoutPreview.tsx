import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useTabsContext } from '@/contexts/TabsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import { typography } from '@/theme/MaterialTheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, ColorSchemeName, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { CarouselPreviewExercise } from '../../constants/types';
import { SHADOW_COLOR } from '../../theme/CustomColorTokens';
import { ScreenContainer } from '../ScreenContainer';
import WorkoutCarousel from './WorkoutCarousel';

export default function WorkoutPreview() {
  const { t } = useTranslation();
  const { workout, setWorkout, setStep, step } = useWorkoutContext();
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const styles = useStyles(useColorScheme());
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [isDisplayingVideoOnly, setIsDisplayingVideoOnly] = useState(false);

  useEffect(() => {
    setIsStatusBarVisible(false);
    setIsTabsVisible(false);
  }, [setIsTabsVisible, setIsStatusBarVisible]);

  const onBack = useCallback(() => {
    setWorkout(undefined);
    setIsTabsVisible(true);
    setIsStatusBarVisible(true);
    setStep(step - 1);
  }, [setWorkout, setIsTabsVisible, setIsStatusBarVisible, setStep, step]);

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

  const getReady = useCallback(() => setStep(step + 1), [setStep, step]);

  const bottomButtons = useMemo(
    () => (
      <View style={styles.bottomButtons}>
        {!isDisplayingVideoOnly && (
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={styles.bottomArea}
          >
            <IconButton
              style={[styles.overNavigationArea, styles.iconButtonIcon]}
              mode="outlined"
              icon={() => (
                <MaterialIcons
                  style={styles.iconButtonIcon}
                  name="chevron-left"
                  size={24}
                />
              )}
              onPress={onBack}
            />
            <Button
              onPress={getReady}
              style={[styles.overNavigationArea, styles.buttonStyle]}
              labelStyle={styles.buttonLabelStyle}
              mode="elevated"
            >
              {t('preview.getReady')}
            </Button>
            <IconButton
              style={[styles.overNavigationArea, styles.iconButtonIcon]}
              mode="outlined"
              icon={() =>
                isOverlayHidden ? (
                  <Ionicons
                    name="eye-off-outline"
                    color={styles.iconButtonIcon.color}
                    size={24}
                  />
                ) : (
                  <Ionicons
                    name="eye-outline"
                    color={styles.iconButtonIcon.color}
                    size={24}
                  />
                )
              }
              onPress={() => setIsOverlayHidden(!isOverlayHidden)}
            />
          </Animated.View>
        )}
      </View>
    ),
    [t, onBack, getReady, styles, isOverlayHidden, isDisplayingVideoOnly]
  );

  const carouselExercises = useMemo((): CarouselPreviewExercise[] | null => {
    if (!workout) return null;

    return workout.exercises.map(exercise => ({
      ...exercise,
      overlayContent: (
        <>
          <Text style={styles.text} variant="displayMedium">
            {t(`exercises.${exercise.name}.name`)}
          </Text>
          <Text
            style={{
              ...styles.text,
              paddingTop: getSpacingToken('spacing-md'),
            }}
            variant="titleLarge"
          >
            {t(`exercises.${exercise.name}.description`)}
          </Text>
        </>
      ),
    }));
  }, [workout, styles, t]);

  if (!workout) {
    return <Text variant="displayLarge">{t('common.loading')}</Text>;
  }

  return (
    <ScreenContainer edges={[]} accessibilityLabel="preview-screen-container">
      <WorkoutCarousel
        isOverlayHidden={isOverlayHidden}
        isDisplayingVideoOnly={isDisplayingVideoOnly}
        containerPaddingStyle={containerPaddingStyle}
        setIsDisplayingVideoOnly={setIsDisplayingVideoOnly}
        exercises={carouselExercises}
      />

      {bottomButtons}
    </ScreenContainer>
  );
}
function useStyles(colorScheme: ColorSchemeName) {
  return useMemo(
    () =>
      StyleSheet.create({
        overNavigationArea: {
          zIndex: 2,
        },
        bottomArea: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          bottom: 0,
          zIndex: 3,
        },
        bottomButtons: {
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          padding: getSpacingToken('spacing-md'),
          bottom: getSpacingToken('spacing-xs'),
          width: '100%',
          zIndex: 3,
          minHeight: 120,
        },
        iconButtonIcon: {
          color: getColorToken('palette-primary-100', colorScheme),
          borderColor: getColorToken('palette-primary-100', colorScheme),
        },
        buttonLabelStyle: {
          ...typography.titleMedium,
          lineHeight: 24,
          fontSize: 20,
          color: getColorToken('onPrimaryFixed'),
        },
        buttonStyle: {
          flex: 1,
          backgroundColor: getColorToken('extended-accent'),
          marginHorizontal: getSpacingToken('spacing-md'),
        },
        text: {
          color: getColorToken('palette-primary-100', colorScheme),
          textAlignVertical: 'center',
          textAlign: 'center',
          textShadowColor: SHADOW_COLOR,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 5,
        },
      }),
    [colorScheme]
  );
}
