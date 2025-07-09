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
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  ColorSchemeName,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
} from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import Video, {
  BufferingStrategyType,
  ResizeMode,
  VideoRef,
} from 'react-native-video';
import { Exercise } from '../../constants/types';
import { Logger } from '../../services/loggerService';
import { OVERLAY_COLOR, SHADOW_COLOR } from '../../theme/CustomColorTokens';
import { ScreenContainer } from '../ScreenContainer';

export default function WorkoutPreview() {
  const { t } = useTranslation();
  const { workout, setWorkout, setStep, step } = useWorkoutContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const videoRefs = useRef<(VideoRef | null)[]>([]);
  const { width } = useWindowDimensions();
  const [isReadyForDisplay, setIsReadyForDisplay] = useState(false);
  const [videoLoadingStyle, setVideoLoadingStyle] = useState(
    Platform.OS === 'android'
      ? {
          display: (isReadyForDisplay ? 'flex' : 'none') as 'flex' | 'none',
        }
      : { opacity: isReadyForDisplay ? 1 : 0 }
  );
  const styles = useStyles(useColorScheme());
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [isDisplayingVideoOnly, setIsDisplayingVideoOnly] = useState(false);

  useEffect(() => {
    return () => {
      setActiveIndex(-1);
      videoRefs.current = [];
    };
  }, [setWorkout]);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  useEffect(() => {
    setIsStatusBarVisible(false);
    setIsTabsVisible(false);
  }, [setIsTabsVisible, setIsStatusBarVisible]);

  useEffect(() => {
    if (workout) {
      setActiveIndex(0);
      videoRefs.current = [];
    }
  }, [workout]);

  useEffect(() => {
    setVideoLoadingStyle(
      Platform.OS === 'android'
        ? {
            display: (isReadyForDisplay ? 'flex' : 'none') as 'flex' | 'none',
          }
        : { opacity: isReadyForDisplay ? 1 : 0 }
    );
  }, [isReadyForDisplay]);

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

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: Exercise; index: number }) => {
      const isPaused = index !== activeIndex;
      return (
        <>
          <View style={[StyleSheet.absoluteFill, styles.videoWrapper]}>
            <Pressable
              onLongPress={() => setIsDisplayingVideoOnly(true)}
              onPressOut={() => setIsDisplayingVideoOnly(false)}
            >
              {!isReadyForDisplay && (
                <ActivityIndicator
                  animating={true}
                  size={24}
                  color={getColorToken('extended-accent')}
                  style={{ flex: 1 }}
                />
              )}
              <Animated.View entering={FadeIn} pointerEvents="none">
                <Video
                  controls={false}
                  disableFocus
                  focusable={false}
                  hideShutterView={true}
                  playInBackground={false}
                  playWhenInactive={false}
                  key={`${item.assetId}+${workout?.id}`}
                  bufferingStrategy={BufferingStrategyType.DEPENDING_ON_MEMORY}
                  source={{
                    uri: item.assetId,
                    isNetwork: false,
                    isAsset: true,
                    isLocalAssetFile: true,
                    shouldCache: false,
                    metadata: { title: t(`exercises.${item.name}.name`) },
                  }}
                  onReadyForDisplay={() => setIsReadyForDisplay(true)}
                  resizeMode={ResizeMode.COVER}
                  paused={isPaused}
                  style={[
                    {
                      width: '100%',
                      height: '100%',
                    },
                    videoLoadingStyle,
                  ]}
                  repeat={true}
                  onError={e => Logger.error('Video error', e)}
                  muted={true}
                />
              </Animated.View>
            </Pressable>
          </View>
          {!isOverlayHidden && !isDisplayingVideoOnly && (
            <Animated.View
              pointerEvents="none"
              entering={FadeIn}
              exiting={FadeOut}
              style={[
                StyleSheet.absoluteFill,
                styles.overlayContainer,
                {
                  paddingTop:
                    containerPaddingStyle.paddingTop +
                    getSpacingToken('spacing-md'),
                  paddingHorizontal: getSpacingToken('spacing-md'),
                },
              ]}
            >
              <Text style={styles.text} variant="displayMedium">
                {t(`exercises.${item.name}.name`)}
              </Text>
              <Text
                style={{
                  ...styles.text,
                  paddingTop: getSpacingToken('spacing-md'),
                }}
                variant="titleLarge"
              >
                {t(`exercises.${item.name}.description`)}
              </Text>
            </Animated.View>
          )}
        </>
      );
    },
    [
      workout,
      activeIndex,
      t,
      containerPaddingStyle,
      isReadyForDisplay,
      videoLoadingStyle,
      styles,
      isOverlayHidden,
      isDisplayingVideoOnly,
    ]
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
                  <Ionicons name="eye-off-outline" size={24} />
                ) : (
                  <Ionicons name="eye-outline" size={24} />
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

  if (!workout) {
    return <Text variant="displayLarge">{t('common.loading')}</Text>;
  }

  return (
    <ScreenContainer edges={[]} accessibilityLabel="preview-screen-container">
      {!isOverlayHidden && !isDisplayingVideoOnly && (
        <Animated.View
          style={{
            zIndex: 2,
          }}
          pointerEvents="none"
          entering={SlideInUp}
          exiting={SlideOutUp}
        >
          <Pagination.Basic<Exercise>
            progress={progress}
            data={workout.exercises}
            dotStyle={{
              ...styles.paginationDotStyle,
              width:
                width / workout.exercises.length -
                getSpacingToken('spacing-md'),
            }}
            activeDotStyle={styles.paginationActiveDotStyle}
            containerStyle={[
              styles.paginationContainerStyle,
              containerPaddingStyle,
            ]}
            horizontal
            onPress={onPressPagination}
          />
        </Animated.View>
      )}

      <Carousel
        ref={carouselRef}
        width={width}
        data={[...workout.exercises]}
        onProgressChange={progress}
        loop={true}
        onSnapToItem={idx => setActiveIndex(idx)}
        renderItem={renderCarouselItem}
      />

      <View style={styles.leftNavigationArea} pointerEvents="box-none">
        <View
          style={styles.touchArea}
          onTouchEnd={() => {
            carouselRef.current?.scrollTo({ count: -1, animated: true });
          }}
          accessibilityLabel="previous-item-area"
        />
      </View>
      <View style={styles.rightNavigationArea} pointerEvents="box-none">
        <View
          style={styles.touchArea}
          onTouchEnd={() => {
            carouselRef.current?.scrollTo({ count: 1, animated: true });
          }}
          accessibilityLabel="next-item-area"
        />
      </View>
      {!isOverlayHidden && !isDisplayingVideoOnly && (
        <Animated.View
          pointerEvents="none"
          style={styles.splashIconContainer}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Image
            accessibilityLabel="preview-workout-icon"
            source={require('@/assets/images/splash-icon.png')}
            style={styles.splashIcon}
            contentFit="contain"
          />
        </Animated.View>
      )}

      {bottomButtons}
    </ScreenContainer>
  );
}

function useStyles(colorScheme: ColorSchemeName) {
  return useMemo(
    () =>
      StyleSheet.create({
        pagerView: {
          flex: 1,
        },
        pageContainer: {
          flex: 1,
        },
        overlayContainer: {
          width: '100%',
          height: '100%',
          backgroundColor: OVERLAY_COLOR,
        },
        text: {
          color: getColorToken('palette-primary-100', colorScheme),
          textAlignVertical: 'center',
          textAlign: 'center',
          textShadowColor: SHADOW_COLOR,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 5,
        },
        splashIcon: {
          width: 200,
          height: 200,
          marginBottom: 80,
        },
        leftNavigationArea: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '15%',
          height: '100%',
          zIndex: 1,
        },
        rightNavigationArea: {
          position: 'absolute',
          right: 0,
          top: 0,
          width: '15%',
          height: '100%',
          zIndex: 1,
        },
        touchArea: {
          width: '100%',
          height: '100%',
        },
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
          borderColor: getColorToken('neutral', colorScheme),
          color: getColorToken('neutral', colorScheme),
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
        splashIconContainer: {
          position: 'absolute',
          width: 200,
          height: 200,
          top: '50%',
          left: '50%',
          transform: [{ translateX: -100 }, { translateY: -100 }],
          zIndex: 2,
        },
        paginationDotStyle: {
          height: 4,
          backgroundColor: getColorToken('neutral'),
          borderRadius: 4,
        },
        paginationActiveDotStyle: {
          overflow: 'hidden',
          backgroundColor: getColorToken('extended-accent'),
        },
        paginationContainerStyle: {
          gap: 4,
          width: '95%',
          flex: 1,
          zIndex: 50,
          position: 'absolute',
          top: 0,
        },
        videoWrapper: {
          backgroundColor: getColorToken('surface', colorScheme),
        },
      }),
    [colorScheme]
  );
}
