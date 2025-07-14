import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ColorSchemeName,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
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
import {
  CarouselExecuteExercise,
  CarouselPreviewExercise,
  Exercise,
} from '../../constants/types';
import { Logger } from '../../services/loggerService';
import { OVERLAY_COLOR } from '../../theme/CustomColorTokens';

interface WorkoutCarouselProps {
  isOverlayHidden: boolean;
  isDisplayingVideoOnly: boolean;
  containerPaddingStyle: { paddingTop: number };
  setIsDisplayingVideoOnly: (value: boolean) => void;
  exercises: CarouselPreviewExercise[] | CarouselExecuteExercise[] | null;
}

type CarouselRenderParams = {
  item: CarouselPreviewExercise | CarouselExecuteExercise;
  index: number;
};

export default function WorkoutCarousel({
  isOverlayHidden,
  isDisplayingVideoOnly,
  containerPaddingStyle,
  setIsDisplayingVideoOnly,
  exercises,
}: WorkoutCarouselProps) {
  const { t } = useTranslation();
  const { workout } = useWorkoutContext();
  const [activeIndex, setActiveIndex] = useState(0);
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
  const styles = useStyles(useColorScheme(), containerPaddingStyle);

  useEffect(() => {
    return () => {
      setActiveIndex(-1);
      videoRefs.current = [];
    };
  }, []);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

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

  const renderCarouselItem = useCallback(
    ({ item, index }: CarouselRenderParams) => {
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
              style={[StyleSheet.absoluteFill, styles.overlayContainer]}
            >
              {item.overlayContent}
            </Animated.View>
          )}
        </>
      );
    },
    [
      workout,
      activeIndex,
      t,
      isReadyForDisplay,
      videoLoadingStyle,
      styles,
      isOverlayHidden,
      isDisplayingVideoOnly,
      setIsDisplayingVideoOnly,
    ]
  );

  if (!workout || !exercises) {
    return null;
  }

  return (
    <>
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
        data={exercises}
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
    </>
  );
}

function useStyles(
  colorScheme: ColorSchemeName,
  containerPaddingStyle: { paddingTop: number }
) {
  return useMemo(
    () =>
      StyleSheet.create({
        overlayContainer: {
          width: '100%',
          height: '100%',
          backgroundColor: OVERLAY_COLOR,
          paddingTop:
            containerPaddingStyle.paddingTop + getSpacingToken('spacing-md'),
          paddingHorizontal: getSpacingToken('spacing-md'),
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
    [colorScheme, containerPaddingStyle.paddingTop]
  );
}
