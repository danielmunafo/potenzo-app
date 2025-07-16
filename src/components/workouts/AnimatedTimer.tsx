import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColorSchemeName, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedTimerProps {
  style?: any;
  colorScheme: ColorSchemeName;
  variant?: string;
  elapsedTime: number; // Time in milliseconds from parent
}

interface TimeDigits {
  minutesTens: string;
  minutesUnits: string;
  secondsTens: string;
  secondsUnits: string;
  milliseconds: string;
}

export default function AnimatedTimer({
  style,
  colorScheme,
  variant = 'displaySmall',
  elapsedTime,
}: AnimatedTimerProps) {
  const [currentDigits, setCurrentDigits] = useState<TimeDigits>({
    minutesTens: '0',
    minutesUnits: '0',
    secondsTens: '0',
    secondsUnits: '0',
    milliseconds: '000',
  });

  const [prevDigits, setPrevDigits] = useState<TimeDigits>(currentDigits);
  const mountTimeRef = useRef<number>(Date.now());

  // Individual digit animations
  const minutesTensAnimation = useSharedValue(0);
  const minutesUnitsAnimation = useSharedValue(0);
  const secondsTensAnimation = useSharedValue(0);
  const secondsUnitsAnimation = useSharedValue(0);

  const formatTimeToDigits = useCallback((elapsed: number): TimeDigits => {
    const totalMs = Math.max(0, Math.floor(elapsed));
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = totalMs % 1000;

    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return {
      minutesTens: minutesStr[0],
      minutesUnits: minutesStr[1],
      secondsTens: secondsStr[0],
      secondsUnits: secondsStr[1],
      milliseconds: String(milliseconds).padStart(3, '0'), // Ensures 000, 001, 012, 123 format
    };
  }, []);

  const triggerAnimation = useCallback((animatedValue: SharedValue<number>) => {
    'worklet';
    animatedValue.value = withTiming(1, { duration: 400 }, finished => {
      if (finished) {
        animatedValue.value = 0;
      }
    });
  }, []);

  useEffect(() => {
    const newDigits = formatTimeToDigits(elapsedTime);
    const timeSinceMount = Date.now() - mountTimeRef.current;
    const shouldAnimate = timeSinceMount > 1000; // Prevent animations for first 1000ms

    setCurrentDigits(prevDigits => {
      setPrevDigits(prevDigits);

      // Only animate digits that actually changed and after initial delay
      if (shouldAnimate) {
        requestAnimationFrame(() => {
          if (prevDigits.minutesTens !== newDigits.minutesTens) {
            triggerAnimation(minutesTensAnimation);
          }
          if (prevDigits.minutesUnits !== newDigits.minutesUnits) {
            triggerAnimation(minutesUnitsAnimation);
          }
          if (prevDigits.secondsTens !== newDigits.secondsTens) {
            triggerAnimation(secondsTensAnimation);
          }
          if (prevDigits.secondsUnits !== newDigits.secondsUnits) {
            triggerAnimation(secondsUnitsAnimation);
          }
        });
      }

      return newDigits;
    });
  }, [
    elapsedTime,
    formatTimeToDigits,
    triggerAnimation,
    minutesTensAnimation,
    minutesUnitsAnimation,
    secondsTensAnimation,
    secondsUnitsAnimation,
  ]);

  // Create styles for individual digits
  const useCreateDigitStyle = (
    animationValue: SharedValue<number>,
    isNext: boolean
  ) => {
    return useAnimatedStyle(() => ({
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [
        {
          translateY: interpolate(
            animationValue.value,
            [0, 1],
            isNext ? [40, 0] : [0, -40],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        animationValue.value,
        [0, 0.3, 1],
        isNext ? [0, 0.7, 1] : [1, 0.3, 0],
        Extrapolation.CLAMP
      ),
    }));
  };

  const textStyles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: getColorToken('palette-primary-100', colorScheme),
          textAlignVertical: 'center',
          textAlign: 'center',
          lineHeight: undefined,
          includeFontPadding: false,
        },
        container: {
          marginTop: -8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: getSpacingToken('spacing-sm'),
        },
        digitContainer: {
          overflow: 'hidden',
          height: 40,
          minWidth: 24,
          position: 'relative',
        },
        millisecondsSegment: {
          overflow: 'hidden',
          height: 40,
          width: 72, // Increased width for 3 digits
          alignItems: 'center',
          justifyContent: 'center',
        },
        separator: {
          width: 8,
          alignItems: 'center',
        },
      }),
    [colorScheme]
  );

  return (
    <View style={[textStyles.container, style]}>
      {/* Minutes Tens */}
      <View style={textStyles.digitContainer}>
        <Animated.View style={useCreateDigitStyle(minutesTensAnimation, false)}>
          <Text style={textStyles.text} variant={variant as any}>
            {prevDigits.minutesTens}
          </Text>
        </Animated.View>
        <Animated.View style={useCreateDigitStyle(minutesTensAnimation, true)}>
          <Text style={textStyles.text} variant={variant as any}>
            {currentDigits.minutesTens}
          </Text>
        </Animated.View>
      </View>

      {/* Minutes Units */}
      <View style={textStyles.digitContainer}>
        <Animated.View
          style={useCreateDigitStyle(minutesUnitsAnimation, false)}
        >
          <Text style={textStyles.text} variant={variant as any}>
            {prevDigits.minutesUnits}
          </Text>
        </Animated.View>
        <Animated.View style={useCreateDigitStyle(minutesUnitsAnimation, true)}>
          <Text style={textStyles.text} variant={variant as any}>
            {currentDigits.minutesUnits}
          </Text>
        </Animated.View>
      </View>

      <View style={textStyles.separator}>
        <Text style={textStyles.text} variant={variant as any}>
          :
        </Text>
      </View>

      {/* Seconds Tens */}
      <View style={textStyles.digitContainer}>
        <Animated.View style={useCreateDigitStyle(secondsTensAnimation, false)}>
          <Text style={textStyles.text} variant={variant as any}>
            {prevDigits.secondsTens}
          </Text>
        </Animated.View>
        <Animated.View style={useCreateDigitStyle(secondsTensAnimation, true)}>
          <Text style={textStyles.text} variant={variant as any}>
            {currentDigits.secondsTens}
          </Text>
        </Animated.View>
      </View>

      {/* Seconds Units */}
      <View style={textStyles.digitContainer}>
        <Animated.View
          style={useCreateDigitStyle(secondsUnitsAnimation, false)}
        >
          <Text style={textStyles.text} variant={variant as any}>
            {prevDigits.secondsUnits}
          </Text>
        </Animated.View>
        <Animated.View style={useCreateDigitStyle(secondsUnitsAnimation, true)}>
          <Text style={textStyles.text} variant={variant as any}>
            {currentDigits.secondsUnits}
          </Text>
        </Animated.View>
      </View>

      <View style={textStyles.separator}>
        <Text style={textStyles.text} variant={variant as any}>
          .
        </Text>
      </View>

      {/* Milliseconds without animation */}
      <View style={textStyles.millisecondsSegment}>
        <Text style={textStyles.text} variant={variant as any}>
          {currentDigits.milliseconds}
        </Text>
      </View>
    </View>
  );
}
