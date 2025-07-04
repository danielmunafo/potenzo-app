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
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import Video, { VideoRef } from 'react-native-video';
import { Exercise } from '../../constants/types';
import { ScreenContainer } from '../ScreenContainer';

export default function WorkoutPreview() {
  const { t } = useTranslation();
  const { workout, setWorkout } = useWorkoutContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const { setIsTabsVisible } = useTabsContext();
  const { setIsStatusBarVisible } = useStatusBarContext();
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const videoRefs = useRef<(VideoRef | null)[]>([]);
  const { width } = useWindowDimensions();

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
  }, [setWorkout, setIsTabsVisible, setIsStatusBarVisible]);

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
        data={workout.exercises}
        onProgressChange={progress}
        loop={true}
        onSnapToItem={idx => setActiveIndex(idx)}
        renderItem={({ item, index }) => (
          <>
            <Video
              ref={ref => {
                videoRefs.current[index] = ref;
              }}
              controls={false}
              playInBackground={false}
              playWhenInactive={false}
              key={`${item.assetId}+${workout.id}`}
              source={{ uri: item.assetId }}
              resizeMode="cover"
              style={[{ width: '100%', height: '100%' }]}
              paused={index !== activeIndex}
              repeat={true}
              onError={e => console.warn('Video error', e)}
              muted={true}
            />
            <View
              style={{
                padding: getSpacingToken('spacing-md'),
              }}
            >
              <Text style={styles.text} variant="displayLarge">
                {t(`exercises.${item.name}.name`)}
              </Text>
              <Text style={styles.text} variant="titleLarge">
                {t(`exercises.${item.name}.description`)}
              </Text>
            </View>
          </>
        )}
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
            {t('preview.start')}
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
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
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
    width: '10%',
    height: '100%',
    zIndex: 20,
  },
  rightNavigationArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '10%',
    height: '100%',
    zIndex: 20,
  },
  touchArea: {
    width: '100%',
    height: '100%',
  },
  overNavigationArea: {
    zIndex: 11,
  },
  bottomArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
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
