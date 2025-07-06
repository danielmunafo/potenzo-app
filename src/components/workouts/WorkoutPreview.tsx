import { useStatusBarContext } from '@/contexts/StatusBarContext';
import { useTabsContext } from '@/contexts/TabsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useContainerStyleWhenHiddenStatusBar } from '@/hooks/useStyleWhenHiddenStatusBar';
import { useTranslation } from '@/hooks/useTranslation';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import { typography } from '@/theme/MaterialTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
} from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
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
      const hiddenStyle =
        Platform.OS === 'android'
          ? {
              display: (isReadyForDisplay ? 'flex' : 'none') as 'flex' | 'none',
            }
          : { opacity: isReadyForDisplay ? 1 : 0 };
      return (
        <>
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: getColorToken('dark-surface') },
            ]}
          >
            {!isReadyForDisplay && (
              <ActivityIndicator
                animating={true}
                size={50}
                color={getColorToken('core-primary')}
                style={{ flex: 1 }}
              />
            )}

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
                hiddenStyle,
              ]}
              repeat={true}
              onError={e => Logger.error('Video error', e)}
              muted={true}
            />
          </View>
          <View
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
          </View>
        </>
      );
    },
    [workout, activeIndex, t, containerPaddingStyle]
  );

  const getReady = useCallback(() => setStep(step + 1), [setStep, step]);

  const bottomButtons = useMemo(
    () => (
      <View style={styles.bottomButtons}>
        <Image
          accessibilityLabel="preview-workout-icon"
          source={require('@/assets/images/splash-icon.png')}
          style={styles.splashIcon}
          contentFit="contain"
        />
        <View style={styles.bottomArea}>
          <IconButton
            style={styles.overNavigationArea}
            mode="contained"
            containerColor={'rgba(14, 14, 14, 0.5)'}
            icon={() => (
              <MaterialIcons
                name="chevron-left"
                size={24}
                color={getColorToken('core-primary')}
              />
            )}
            onPress={onBack}
          />
          <Button
            onPress={getReady}
            style={[
              styles.overNavigationArea,
              { flex: 1, marginHorizontal: getSpacingToken('spacing-md') },
            ]}
            buttonColor={getColorToken('core-primary')}
            labelStyle={{
              ...typography.titleMedium,
              lineHeight: 28,
              fontSize: 20,
              color: getColorToken('onPrimary'),
            }}
            mode="elevated"
          >
            {t('preview.getReady')}
          </Button>
          <IconButton
            style={styles.overNavigationArea}
            mode="contained"
            containerColor={'rgba(14, 14, 14, 0.5)'}
            icon={() => (
              <MaterialIcons
                name="info"
                size={24}
                color={getColorToken('core-primary')}
              />
            )}
            onPress={onBack}
          />
        </View>
      </View>
    ),
    [t, onBack, getReady]
  );

  if (!workout) {
    return <Text variant="displayLarge">{t('common.loading')}</Text>;
  }

  return (
    <ScreenContainer edges={[]} accessibilityLabel="preview-screen-container">
      <Pagination.Basic<Exercise>
        progress={progress}
        data={workout.exercises}
        dotStyle={{
          width:
            width / workout.exercises.length - getSpacingToken('spacing-md'),
          height: 4,
          backgroundColor: 'rgba(14, 14, 14, 0.76)',
          borderRadius: 4,
        }}
        activeDotStyle={{
          overflow: 'hidden',
          backgroundColor: getColorToken('core-primary'),
        }}
        containerStyle={{
          gap: 4,
          width: '95%',
          flex: 1,
          zIndex: 50,
          position: 'absolute',
          top: 0,
          ...containerPaddingStyle,
        }}
        horizontal
        onPress={onPressPagination}
      />

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

      {bottomButtons}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  overlayContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  text: {
    color: getColorToken('core-primary'),
    textAlignVertical: 'center',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
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
    zIndex: 2,
  },
  bottomButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: getSpacingToken('spacing-md'),
    bottom: getSpacingToken('spacing-md'),
    width: '100%',
    minHeight: 120,
  },
});
