import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useContainerStyleWhenHiddenStatusBar } from '../../../hooks/useStyleWhenHiddenStatusBar';
import { getColorToken } from '../../../theme/FigmaTokens';

export default function DemoWorkout() {
  const containerPaddingStyle = useContainerStyleWhenHiddenStatusBar();
  const player = useVideoPlayer(
    require('@/assets/videos/skipping-rope.mov'),
    player => {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent animated />
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
      <View style={[styles.overlayContainer, containerPaddingStyle]}>
        <Text style={styles.text} variant="displayLarge">
          Overlay Content
        </Text>
        <Image
          accessibilityLabel="preview-workout-icon"
          source={require('@/assets/images/splash-icon.png')}
          style={styles.splashIcon}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  splashIcon: {
    width: 200,
    height: 200,
  },
});
