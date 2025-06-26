import * as Sentry from '@sentry/react-native';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';

import { ConsentProvider, useConsentContext } from '@/contexts/ConsentContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SentryService } from '@/services/sentryService';
import { AppThemeProvider } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();
const navigationTrackingIntegration = SentryService.initializeBeforeConsent();

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

const App = () => {
  const userDeviceColorScheme = useColorScheme();
  const {
    isLoading: consentLoading,
    consentData: { trackingConsent },
  } = useConsentContext();
  const [navigationIntegration, setNavigationIntegration] = useState<
    ReturnType<typeof Sentry.reactNavigationIntegration> | undefined
  >(undefined);
  const [fontsLoaded] = useFonts(FONT_CONFIG);

  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref && navigationIntegration) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref, navigationIntegration]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded && !consentLoading) {
        try {
          setNavigationIntegration(
            SentryService.initialize(trackingConsent ?? false)
          );
        } catch (error) {
          SentryService.captureException(error, {
            message: 'Failed to initialize Sentry',
            source: 'AppLayout',
            level: 'error',
          });
        }
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          SentryService.captureException(error, {
            message: 'Failed to hide splash screen',
            source: 'AppLayout',
            level: 'error',
          });
        }
      }
    };

    hideSplashScreen();
  }, [fontsLoaded, consentLoading, trackingConsent]);

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
};

const RootLayout: React.FC = () => {
  return (
    <ConsentProvider>
      <App />
    </ConsentProvider>
  );
};

export default Sentry.wrap(RootLayout, {
  touchEventBoundaryProps: { labelName: 'accessibilityLabel' },
});
