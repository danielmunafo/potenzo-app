import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppThemeProvider } from '@/theme/ThemeProvider';
import { StatusBar } from 'react-native';

const FONT_CONFIG = {
  'Exo2-Bold': require('../assets/fonts/static/Exo2-Bold.ttf'),
  'Exo2-Italic': require('../assets/fonts/static/Exo2-Italic.ttf'),
  'OpenSans-Regular': require('../assets/fonts/static/OpenSans-Regular.ttf'),
  'OpenSans-Bold': require('../assets/fonts/static/OpenSans-Bold.ttf'),
  'OpenSans-Medium': require('../assets/fonts/static/OpenSans-Medium.ttf'),
  'OpenSans-SemiBold': require('../assets/fonts/static/OpenSans-SemiBold.ttf'),
} as const;

const STACK_SCREEN_CONFIG = {
  name: 'index',
  options: {
    headerShown: false,
    title: 'Splash',
  },
} as const;

const SETTINGS_SCREEN_CONFIG = {
  name: 'settings',
  options: {
    headerShown: false,
    title: 'Settings',
  },
} as const;

export default function RootLayout() {
  const userDeviceColorScheme = useColorScheme();
  const [fontsLoaded] = useFonts(FONT_CONFIG);

  if (!fontsLoaded) {
    return null;
  }

  const isDark = userDeviceColorScheme === 'dark';
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;
  const systemTheme = isDark ? 'dark' : 'light';
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <AppThemeProvider systemTheme={systemTheme}>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen {...STACK_SCREEN_CONFIG} />
          <Stack.Screen {...SETTINGS_SCREEN_CONFIG} />
        </Stack>
        <StatusBar barStyle={statusBarStyle} />
      </ThemeProvider>
    </AppThemeProvider>
  );
}
