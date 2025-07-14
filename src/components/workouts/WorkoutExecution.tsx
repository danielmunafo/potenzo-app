import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useTabsContext } from '@/contexts/TabsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import {
  getBorderRadiusToken,
  getColorToken,
  getSpacingToken,
} from '@/theme/FigmaTokens';
import { typography } from '@/theme/MaterialTheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, ColorSchemeName, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { CarouselExecuteExercise } from '../../constants/types';
import { SHADOW_COLOR } from '../../theme/CustomColorTokens';
import { ScreenContainer } from '../ScreenContainer';
import WorkoutCarousel from './WorkoutCarousel';

export default function WorkoutExecution() {
  const { t } = useTranslation();
  const { workout, setStep, step } = useWorkoutContext();
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const styles = useStyles(useColorScheme(), containerPaddingStyle);
  const [isDisplayingVideoOnly, setIsDisplayingVideoOnly] = useState(false);

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

  const bottomButtons = useMemo(
    () => (
      <View style={styles.bottomButtons}>
        {!isDisplayingVideoOnly && (
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={styles.bottomArea}
          >
            <View
              style={[styles.overNavigationArea, styles.bottomCounterWrapper]}
            >
              <Text
                style={{ ...styles.text, fontSize: 22, lineHeight: 30 }}
                variant="displaySmall"
              >
                {t('preview.getReady')}
              </Text>
            </View>
            <IconButton
              style={[styles.overNavigationArea, styles.iconButtonIcon]}
              mode="outlined"
              onPress={() => setIsDisplayingVideoOnly(!isDisplayingVideoOnly)}
              icon={() =>
                isDisplayingVideoOnly ? (
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
            />
          </Animated.View>
        )}
      </View>
    ),
    [t, styles, isDisplayingVideoOnly]
  );

  const carouselExercises = useMemo((): CarouselExecuteExercise[] | null => {
    if (!workout) return null;

    return workout.exercises.map(exercise => ({
      ...exercise,
      overlayContent: (
        <>
          <Text>{'counters and stuff'}</Text>
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
        isDisplayingVideoOnly={isDisplayingVideoOnly}
        containerPaddingStyle={containerPaddingStyle}
        isOverlayHidden={isDisplayingVideoOnly}
        setIsDisplayingVideoOnly={setIsDisplayingVideoOnly}
        exercises={carouselExercises}
        showLogo={false}
      />
      {!isDisplayingVideoOnly && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.upperCounterWrapper}
        >
          <View style={styles.upperCounter}>
            <Text style={styles.text} variant="displaySmall">
              {'00:01:20.234'}
            </Text>
            <IconButton
              style={[styles.overNavigationArea, styles.iconButtonIcon]}
              size={30}
              mode="outlined"
              onPress={() => setIsDisplayingVideoOnly(!isDisplayingVideoOnly)}
              icon={() => (
                <FontAwesome
                  name="flag-checkered"
                  size={24}
                  color={styles.iconButtonIcon.color}
                />
              )}
            />
          </View>
        </Animated.View>
      )}

      {bottomButtons}
    </ScreenContainer>
  );
}
function useStyles(
  colorScheme: ColorSchemeName,
  containerPaddingStyle: { paddingTop: number }
) {
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
          color: getColorToken('palette-primary-100', colorScheme),
        },
        upperCounterWrapper: {
          position: 'absolute',
          width: '100%',
          top: containerPaddingStyle.paddingTop + getSpacingToken('spacing-md'),
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        upperCounter: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          width: '80%',
          height: 60,
          backgroundColor: '#00000086',
          borderRadius: getBorderRadiusToken('radius-full'),
          marginHorizontal: getSpacingToken('spacing-md'),
        },
        bottomCounterWrapper: {
          flex: 1,
          alignItems: 'center',
          borderWidth: 1,
          height: 42,
          paddingVertical: 3,
          borderColor: getColorToken('palette-primary-100', colorScheme),
          borderRadius: getBorderRadiusToken('radius-full'),
          marginHorizontal: getSpacingToken('spacing-md'),
        },
        text: {
          color: getColorToken('palette-primary-100', colorScheme),
          textAlignVertical: 'center',
          textAlign: 'center',
          textShadowColor: SHADOW_COLOR,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 5,
          lineHeight: undefined,
          includeFontPadding: false,
        },
      }),
    [colorScheme, containerPaddingStyle]
  );
}
