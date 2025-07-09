import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useTabsContext } from '@/contexts/TabsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import {
  getBorderRadiusToken,
  getColorToken,
  getSpacingToken,
} from '@/theme/FigmaTokens';
import { typography } from '@/theme/MaterialTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  ColorSchemeName,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, IconButton, Surface, Text } from 'react-native-paper';
import Animated, {
  Easing,
  SlideInDown,
  SlideInRight,
  SlideOutDown,
  SlideOutRight,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ScreenContainer } from '../ScreenContainer';

export function WorkoutGetReady() {
  const { t } = useTranslation();
  const { workout, setStep, step } = useWorkoutContext();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const containerStyle = useContainerStyleWhenHiddenStatusBar();
  const styles = useStyles(useColorScheme());
  const { height: screenHeight } = Dimensions.get('window');

  // Add countdown state
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    setIsStatusBarVisible(false);
    setIsTabsVisible(false);
  }, [setIsTabsVisible, setIsStatusBarVisible]);

  // Add countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Show "GO!" for 1 second when countdown reaches 0
      const goTimer = setTimeout(() => {
        setCountdown(-1); // Use -1 to indicate we should hide
      }, 1000);
      return () => clearTimeout(goTimer);
    } else {
      // countdown is -1, hide the overlay
      const hideTimer = setTimeout(() => {
        setShowCountdown(false);
      }, 500); // Wait for fade out animation
      return () => clearTimeout(hideTimer);
    }
  }, [countdown]);

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
            onPress={() => console.log()}
            style={[styles.overNavigationArea, styles.buttonStyle]}
            labelStyle={styles.buttonLabelStyle}
            mode="elevated"
          >
            {t('workoutGetReady.start')}
          </Button>
        </Animated.View>
      </View>
    ),
    [t, styles, onBack]
  );

  if (!workout) return <></>;

  return (
    <ScreenContainer
      enableGestureUpDownGestureHandling
      edges={[]}
      accessibilityLabel="preview-screen-container"
    >
      {/* Show countdown overlay only when showCountdown is true and countdown >= 0 */}
      {showCountdown && countdown >= 0 && (
        <Animated.View
          key={countdown === 0 ? 'go' : countdown}
          entering={() => {
            'worklet';
            return {
              initialValues: {
                opacity: 0.1,
                transform: [
                  { translateX: -150 },
                  { translateY: screenHeight },
                  { scale: 0 },
                ],
              },
              animations: {
                opacity: withTiming(1, {
                  duration: 500,
                  easing: Easing.out(Easing.cubic),
                }),
                transform: [
                  { translateX: -150 },
                  {
                    translateY: withTiming(-150, {
                      duration: 500,
                      easing: Easing.out(Easing.cubic),
                    }),
                  },
                  {
                    scale: withSpring(1.1, { damping: 8, stiffness: 100 }),
                  },
                ],
              },
            };
          }}
          exiting={() => {
            'worklet';
            return {
              initialValues: {
                opacity: 1,
                transform: [
                  { translateX: -150 },
                  { translateY: -150 },
                  { scale: 1.1 },
                ],
              },
              animations: {
                opacity: withTiming(0.1, {
                  duration: 500,
                  easing: Easing.in(Easing.cubic),
                }),
                transform: [
                  { translateX: -150 },
                  {
                    translateY: withTiming(-screenHeight, {
                      duration: 500,
                      easing: Easing.in(Easing.cubic),
                    }),
                  },
                  {
                    scale: withTiming(0, {
                      duration: 500,
                      easing: Easing.in(Easing.cubic),
                    }),
                  },
                ],
              },
            };
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderWidth: 25,
            borderColor: getColorToken('extended-accent'),
            transform: [{ translateX: -150 }, { translateY: -150 }],
            zIndex: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 10,
          }}
        >
          <Text
            variant="displayLarge"
            style={{
              marginTop: Platform.OS === 'android' ? -25 : undefined,
              fontSize: countdown === 0 ? 120 : 200, // Smaller font for "GO!"
              color: getColorToken('extended-accent'),
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 0.5, height: 0.5 },
              textShadowRadius: 0.5,
              lineHeight: countdown === 0 ? 120 : 200,
              includeFontPadding: false,
              textAlignVertical: 'center',
            }}
          >
            {countdown === 0 ? 'GO!' : countdown}
          </Text>
        </Animated.View>
      )}

      <Animated.View
        entering={SlideInRight}
        exiting={SlideOutRight}
        style={[styles.container, containerStyle]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Surface mode="flat" style={styles.rowContainer}>
            <Text variant="titleLarge">{t('workoutGetReady.title')}</Text>
            <View style={styles.row}>
              <Text style={styles.chip} variant="bodyLarge">
                {t('workoutGetReady.aerobics')}
              </Text>
              <Text style={styles.chip} variant="bodyLarge">
                {t('workoutGetReady.functional')}
              </Text>
              <Text style={styles.chip} variant="bodyLarge">
                {t('workoutGetReady.other')}
              </Text>
            </View>
          </Surface>

          <Surface mode="flat" style={styles.rowContainer}>
            <Text variant="titleLarge">
              {t('workoutGetReady.heartRatePrompt')}
            </Text>
            <View style={styles.row}>
              <Text style={styles.chip} variant="bodyLarge">
                {t('workoutGetReady.heartRateValue', { value: 120 })}
              </Text>
            </View>
          </Surface>

          <Surface mode="flat" style={styles.rowContainer}>
            <Text variant="titleLarge">{t('workoutGetReady.focusPrompt')}</Text>
            <View style={styles.row}>
              <Text style={styles.chip} variant="bodyLarge">
                {t('workoutGetReady.focusValue')}
              </Text>
            </View>
          </Surface>

          <Surface mode="flat" style={styles.rowContainer}>
            <Text variant="titleLarge">
              {t('workoutGetReady.sweatLevelPrompt')}
            </Text>
            <View style={styles.row}>
              <Text style={styles.chip} variant="bodyLarge">
                {t('workoutGetReady.sweatLevelValue')}
              </Text>
            </View>
          </Surface>

          <Surface mode="flat" style={styles.rowContainer}>
            <Text variant="titleLarge">
              {t('workoutGetReady.scienceBacking')}{' '}
            </Text>
            <View style={styles.row}>
              <Text style={styles.chip} variant="bodyLarge">
                {t('workoutGetReady.studiesPage')}
              </Text>
            </View>
          </Surface>
        </ScrollView>
      </Animated.View>
      {bottomButtons}
    </ScreenContainer>
  );
}

function useStyles(colorScheme: ColorSchemeName) {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: getSpacingToken('spacing-md'),
          marginBottom: 108,
        },
        scrollView: {
          flex: 1,
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
        overNavigationArea: {
          zIndex: 2,
        },
        iconButtonIcon: {
          borderColor: getColorToken('neutral', colorScheme),
          color: getColorToken('neutral', colorScheme),
        },
        rowContainer: {
          backgroundColor: getColorToken('surface', colorScheme),
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
          flexDirection: 'column',
          borderRadius: getBorderRadiusToken('radius-md'),
          padding: getSpacingToken('spacing-md'),
          marginBottom: getSpacingToken('spacing-md'),
          width: '100%',
        },
        row: {
          flexDirection: 'row',
          paddingTop: getSpacingToken('spacing-sm'),
          gap: getSpacingToken('spacing-xs'),
        },
        chip: {
          borderRadius: 8,
          textAlign: 'center',
          textAlignVertical: 'center',
          marginRight: getSpacingToken('spacing-xs'),
          paddingVertical: getSpacingToken('spacing-xs'),
        },
      }),
    [colorScheme]
  );
}
