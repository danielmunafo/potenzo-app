import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.banner, { paddingTop: insets.top }]}>
        <Text style={styles.bannerHeadline}>
          🚧 Potenzo in progress
        </Text>
        <Text style={styles.bannerText}>
          Follow @potenzo.app for updates
        </Text>
      </ThemedView>

      <ThemedText type="title" style={styles.mainTitle}>
        Unlock Your Potential.
      </ThemedText>

      <ThemedText type="subtitle" style={styles.subtitle}>
        Train anywhere. Eat smart. Win every day.
      </ThemedText>

      <Animated.View style={animatedStyle}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.splashIcon}
          contentFit="contain"
        />
      </Animated.View>

      <ThemedView style={styles.textContainer}>
        <ThemedText type="default" style={styles.description}>
          Potenzo is your no-excuses fitness companion.{'\n'}
          Calisthenics, nutrition, and progress — simplified.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  splashIcon: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'Exo2-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Exo2-Italic',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2fff00',
    padding: 16,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  bannerHeadline: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    lineHeight: 24,
    color: '#1d1d1d',
  },
  bannerText: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    lineHeight: 24,
    color: '#1d1d1d',
  },
});
