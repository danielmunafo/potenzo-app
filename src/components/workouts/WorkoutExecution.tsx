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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, ColorSchemeName, StyleSheet, View } from 'react-native';
import StopwatchTimer, {
  StopwatchTimerMethods,
} from 'react-native-animated-stopwatch-timer';
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
  const { workout, setStep, step, exercise } = useWorkoutContext();
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const colorScheme = useColorScheme();
  const styles = useStyles(colorScheme, containerPaddingStyle);
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
                {}
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
    [styles, isDisplayingVideoOnly]
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
  }, [workout]);

  const stopwatchRef = useRef<StopwatchTimerMethods>(null);
  const [isStopwatchInitialized, setIsStopwatchInitialized] = useState(false);
  const [isStopwatchPaused, setIsStopwatchPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (stopwatchRef.current && !isStopwatchInitialized) {
      stopwatchRef.current.play();
      setIsStopwatchInitialized(true);
      setIsStopwatchPaused(false);
    }
  }, [stopwatchRef, setIsStopwatchInitialized, isStopwatchInitialized]);

  const toggleDisplayVideoOnly = useCallback(
    (incIsDisplayingVideoOnly: boolean) => {
      if (incIsDisplayingVideoOnly && stopwatchRef.current) {
        setTimeElapsed(stopwatchRef.current.getSnapshot());
      }
      setIsDisplayingVideoOnly(incIsDisplayingVideoOnly);
    },
    [setIsDisplayingVideoOnly, setTimeElapsed]
  );

  useEffect(() => {
    if (!isDisplayingVideoOnly && stopwatchRef.current && !isStopwatchPaused) {
      stopwatchRef.current.play();
      setIsStopwatchPaused(false);
    }
  }, [isDisplayingVideoOnly, stopwatchRef, isStopwatchPaused]);

  if (!workout) {
    return <Text variant="displayLarge">{t('common.loading')}</Text>;
  }

  return (
    <ScreenContainer edges={[]} accessibilityLabel="preview-screen-container">
      <WorkoutCarousel
        isDisplayingVideoOnly={isDisplayingVideoOnly}
        setIsDisplayingVideoOnly={toggleDisplayVideoOnly}
        containerPaddingStyle={containerPaddingStyle}
        isOverlayHidden={isDisplayingVideoOnly}
        exercises={carouselExercises}
        showLogo={false}
      />
      {!isDisplayingVideoOnly && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.upperCounterWrapper, styles.overNavigationArea]}
        >
          <View style={[styles.upperCounter, styles.overNavigationArea]}>
            <IconButton
              style={[
                styles.overNavigationArea,
                styles.iconButtonIcon,
                { paddingLeft: isStopwatchPaused ? 2 : 0.5 },
              ]}
              size={16}
              mode="outlined"
              onPress={() => {
                setIsStopwatchPaused(!isStopwatchPaused);
                if (isStopwatchPaused) {
                  stopwatchRef.current?.play();
                } else {
                  stopwatchRef.current?.pause();
                }
              }}
              icon={() => (
                <FontAwesome
                  name={isStopwatchPaused ? 'play' : 'pause'}
                  size={12}
                  color={styles.iconButtonIcon.color}
                />
              )}
            />
            <StopwatchTimer
              ref={stopwatchRef}
              containerStyle={styles.stopWatchContainer}
              digitStyle={{ width: 24 }}
              separatorStyle={{ width: 8 }}
              textCharStyle={styles.stopWatchChar}
              trailingZeros={2}
              initialTimeInMs={timeElapsed}
            />
            <IconButton
              style={[styles.overNavigationArea, styles.iconButtonIcon]}
              size={16}
              mode="outlined"
              onPress={() => setIsDisplayingVideoOnly(!isDisplayingVideoOnly)}
              icon={() => (
                <FontAwesome
                  name="flag-checkered"
                  size={12}
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
        stopWatchContainer: {
          marginTop: -4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: getSpacingToken('spacing-sm'),
        },
        buttonsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 240,
          paddingTop: 48,
        },
        stopWatchChar: {
          fontFamily: 'Exo2-Bold',
          fontSize: 36,
          color: getColorToken('palette-primary-100', colorScheme),
          textAlignVertical: 'center',
          textAlign: 'center',
          lineHeight: undefined,
          includeFontPadding: false,
        },
        overNavigationArea: {
          zIndex: 4,
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
          paddingHorizontal: getSpacingToken('spacing-md'),
        },
        upperCounter: {
          paddingHorizontal: getSpacingToken('spacing-md'),
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          height: 60,
          backgroundColor: '#00000086',
          borderWidth: 4,
          borderColor: '#000000AB',
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
