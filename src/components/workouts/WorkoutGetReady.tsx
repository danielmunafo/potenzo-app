import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useTabsContext } from '@/contexts/TabsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import { typography } from '@/theme/MaterialTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ColorSchemeName, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import Animated, {
  SlideInDown,
  SlideInRight,
  SlideOutDown,
  SlideOutRight,
} from 'react-native-reanimated';
import { ScreenContainer } from '../ScreenContainer';

export function WorkoutGetReady() {
  const { t } = useTranslation();
  const { workout, setStep, step } = useWorkoutContext();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const containerStyle = useContainerStyleWhenHiddenStatusBar();
  const styles = useStyles(useColorScheme());

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
    <ScreenContainer edges={[]} accessibilityLabel="preview-screen-container">
      <Animated.View
        entering={SlideInRight}
        exiting={SlideOutRight}
        style={[styles.container, containerStyle]}
      >
        <View style={styles.rowContainer}>
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
        </View>

        <View style={styles.rowContainer}>
          <Text variant="titleLarge">
            {t('workoutGetReady.heartRatePrompt')}
          </Text>
          <View style={styles.row}>
            <Text style={styles.chip} variant="bodyLarge">
              {t('workoutGetReady.heartRateValue', { value: 120 })}
            </Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <Text variant="titleLarge">{t('workoutGetReady.focusPrompt')}</Text>
          <View style={styles.row}>
            <Text style={styles.chip} variant="bodyLarge">
              {t('workoutGetReady.focusValue')}
            </Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <Text variant="titleLarge">
            {t('workoutGetReady.sweatLevelPrompt')}
          </Text>
          <View style={styles.row}>
            <Text style={styles.chip} variant="bodyLarge">
              {t('workoutGetReady.sweatLevelValue')}
            </Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <Text variant="titleLarge">
            {t('workoutGetReady.scienceBacking')}{' '}
          </Text>
          <View style={styles.row}>
            <Text style={styles.chip} variant="bodyLarge">
              {t('workoutGetReady.studiesPage')}
            </Text>
          </View>
        </View>
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
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingHorizontal: getSpacingToken('spacing-md'),
          marginBottom: 120,
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
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingBottom: getSpacingToken('spacing-md'),
        },
        row: {
          flexDirection: 'row',
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
