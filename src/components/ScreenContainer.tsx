import * as Haptics from 'expo-haptics';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { type MD3Elevation } from 'react-native-paper';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Edge,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import SentryWrapper from './SentryWrapper';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: MD3Elevation;
  accessibilityLabel?: string;
  edges?: Edge[];
  useSentryWrapper?: boolean;
  enableGestureUpDownGestureHandling?: boolean;
}

export function ScreenContainer({
  children,
  style,
  accessibilityLabel,
  elevation = 0,
  edges = ['top', 'bottom'],
  useSentryWrapper = true,
  enableGestureUpDownGestureHandling = false,
}: ScreenContainerProps) {
  const translateY = useSharedValue(0);

  const containerStyle: ViewStyle = {
    flex: 1,
  };

  const triggerHapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const gestureHandler = Gesture.Pan()
    .onUpdate(event => {
      'worklet';
      // Simple, performant rubber band effect
      const maxTranslation = 20;
      const dampening = 0.3;

      translateY.value = Math.max(
        -maxTranslation,
        Math.min(maxTranslation, event.translationY * dampening)
      );
    })
    .onEnd(event => {
      'worklet';
      // Add haptic feedback when the gesture reaches certain thresholds
      if (Math.abs(event.translationY) > 10) {
        runOnJS(triggerHapticFeedback)();
      }

      // Simple spring back to original position
      translateY.value = withSpring(0, {
        damping: 12,
        stiffness: 100,
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const Wrapper = useSentryWrapper ? SentryWrapper : React.Fragment;

  const surfaceContent = (
    <View
      style={[containerStyle, style]}
      accessibilityLabel={accessibilityLabel}
    >
      <SafeAreaProvider
        accessibilityLabel={`${accessibilityLabel}-safe-area-provider`}
      >
        <SafeAreaView
          accessibilityLabel={`${accessibilityLabel}-safe-area-view`}
          edges={edges}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );

  if (!enableGestureUpDownGestureHandling) {
    return <Wrapper>{surfaceContent}</Wrapper>;
  }

  return (
    <Wrapper>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={gestureHandler}>
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            {surfaceContent}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Wrapper>
  );
}
