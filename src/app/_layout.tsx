import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';

import { ConsentProvider } from '@/contexts/ConsentContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import sentryService from '@/services/sentryService';
import { AppThemeProvider } from '@/theme/ThemeProvider';
import { useUserConsents } from '../hooks/useUserConsents';

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

/**
 * Returns true if the app is ready to load (fonts loaded and consent not loading).
 */
function isAppReadyToLoad(
  fontsLoaded: boolean,
  consentLoading: boolean
): boolean {
  return fontsLoaded && !consentLoading;
}

const App = () => {
  const userDeviceColorScheme = useColorScheme();
  const {
    isLoading: consentLoading,
    needsTrackingDecision,
    trackingConsent,
  } = useUserConsents();
  const [fontsLoaded] = useFonts(FONT_CONFIG);

  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      sentryService.navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (isAppReadyToLoad(fontsLoaded, consentLoading)) {
        if (trackingConsent !== undefined) {
          sentryService.initialize(trackingConsent);
        }
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          sentryService.captureException(error, {
            message: 'Failed to hide splash screen',
            source: 'AppLayout',
            level: 'error',
          });
        }
      }
    };

    hideSplashScreen();
  }, [fontsLoaded, consentLoading, trackingConsent, needsTrackingDecision]);

  if (!isAppReadyToLoad(fontsLoaded, consentLoading)) {
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
};

const RootLayout: React.FC = () => {
  return (
    <ConsentProvider>
      <App />
    </ConsentProvider>
  );
};

export default RootLayout;
