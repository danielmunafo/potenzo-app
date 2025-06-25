import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';

import { ConsentProvider, useConsentContext } from '@/contexts/ConsentContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AppThemeProvider } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

const FONT_CONFIG = {
  'Exo2-Bold': require('../assets/fonts/static/Exo2-Bold.ttf'),
  'Exo2-Italic': require('../assets/fonts/static/Exo2-Italic.ttf'),
  'OpenSans-Regular': require('../assets/fonts/static/OpenSans-Regular.ttf'),
  'OpenSans-Bold': require('../assets/fonts/static/OpenSans-Bold.ttf'),
  'OpenSans-Medium': require('../assets/fonts/static/OpenSans-Medium.ttf'),
  'OpenSans-SemiBold': require('../assets/fonts/static/OpenSans-SemiBold.ttf'),
} as const;

const HOME_SCREEN_CONFIG = {
  name: 'index',
  options: {
    headerShown: false,
    title: 'Home',
  },
} as const;

const SETTINGS_SCREEN_CONFIG = {
  name: 'settings',
  options: {
    headerShown: false,
    title: 'Settings',
  },
} as const;

export const App = () => {
  const userDeviceColorScheme = useColorScheme();
  const { isLoading: consentLoading } = useConsentContext();
  const [fontsLoaded] = useFonts(FONT_CONFIG);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded && !consentLoading) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [fontsLoaded, consentLoading]);

  if (!fontsLoaded || consentLoading) {
    return null;
  }

  const isDark = userDeviceColorScheme === 'dark';
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;
  const systemTheme = isDark ? 'dark' : 'light';
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar barStyle={statusBarStyle} animated />
      <AppThemeProvider systemTheme={systemTheme}>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen {...HOME_SCREEN_CONFIG} />
            <Stack.Screen {...SETTINGS_SCREEN_CONFIG} />
          </Stack>
        </ThemeProvider>
      </AppThemeProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <ConsentProvider>
      <App />
    </ConsentProvider>
  );
}
