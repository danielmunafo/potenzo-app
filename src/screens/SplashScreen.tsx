import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { AppContainer } from '@/components/AppContainer';
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

export function SplashScreen() {
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
    <AppContainer accessibilityLabel="splash-screen-container">
      <Card
        accessibilityLabel="splash-screen-banner"
        style={[styles.banner, { backgroundColor: getColorToken('core-primary') }]}
      >
        <Card.Content>
          <Text
            accessibilityLabel="splash-screen-banner-headline"
            variant="titleMedium"
            style={[styles.bannerHeadline, { color: getColorToken('light-onPrimary') }]}
          >
            🚧 Potenzo in progress
          </Text>
          <Text
            accessibilityLabel="splash-screen-banner-text"
            variant="bodyMedium"
            style={[styles.bannerText, { color: getColorToken('light-onPrimary') }]}
          >
            Follow @potenzo.app for updates
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.bannerSpacer} />

      <View style={styles.contentContainer}>
        <View style={styles.scrollableContent}>
          <Text
            accessibilityLabel="splash-screen-main-title"
            variant="headlineLarge"
            style={styles.mainTitle}
          >
            Unlock Your Potential.
          </Text>

          <Text
            accessibilityLabel="splash-screen-subtitle"
            variant="titleLarge"
            style={styles.subtitle}
          >
            Train anywhere. Eat smart. Win every day.
          </Text>

          <Animated.View accessibilityLabel="splash-screen-animated-icon" style={animatedStyle}>
            <Image
              accessibilityLabel="splash-screen-icon"
              source={require('@/assets/images/splash-icon.png')}
              style={styles.splashIcon}
              contentFit="contain"
            />
          </Animated.View>

          <Text
            accessibilityLabel="splash-screen-description"
            variant="bodyLarge"
            style={styles.description}
          >
            Potenzo is your no-excuses fitness companion.{'\n'}
            Calisthenics, nutrition, and progress — simplified.
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={() => console.log('Get Started pressed')}
          style={styles.getStartedButton}
          accessibilityLabel="splash-screen-get-started-button"
          buttonColor={getColorToken('core-primary')}
        >
          Get Started
        </Button>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  splashIcon: {
    width: 200,
    height: 200,
  },
  textContainer: {
    marginVertical: getSpacingToken('spacing-lg'),
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'Exo2-Bold',
    textAlign: 'center',
    marginVertical: getSpacingToken('spacing-md'),
  },
  subtitle: {
    fontFamily: 'Exo2-Italic',
    textAlign: 'center',
    marginBottom: getSpacingToken('spacing-lg'),
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
    marginBottom: getSpacingToken('spacing-lg'),
    borderRadius: 0,
  },
  bannerHeadline: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  bannerText: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: getSpacingToken('spacing-xs'),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollableContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButton: {
    marginTop: getSpacingToken('spacing-lg'),
  },
  bannerSpacer: {
    height: getSpacingToken('spacing-lg'),
  },
});

export default SplashScreen;