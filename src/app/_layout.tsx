import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ConsentProvider } from '@/contexts/ConsentContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserConsents } from '@/hooks/useUserConsents';
import amplitudeService from '@/services/amplitudeService';
import sentryService from '@/services/sentryService';
import { AppThemeProvider } from '@/theme/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import { getColorToken, getSpacingToken } from '../theme/FigmaTokens';

SplashScreen.preventAutoHideAsync();

const FONT_CONFIG = {
  'Exo2-Bold': require('../assets/fonts/static/Exo2-Bold.ttf'),
  'Exo2-Italic': require('../assets/fonts/static/Exo2-Italic.ttf'),
  'OpenSans-Regular': require('../assets/fonts/static/OpenSans-Regular.ttf'),
  'OpenSans-Bold': require('../assets/fonts/static/OpenSans-Bold.ttf'),
  'OpenSans-Medium': require('../assets/fonts/static/OpenSans-Medium.ttf'),
  'OpenSans-SemiBold': require('../assets/fonts/static/OpenSans-SemiBold.ttf'),
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
  const statusBarStyle = useStatusBarStyle();
  const {
    isLoading: consentLoading,
    needsTrackingDecision,
    trackingConsent,
    termsAccepted,
  } = useUserConsents();
  const [fontsLoaded] = useFonts(FONT_CONFIG);
  const { t } = useTranslation();

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
          amplitudeService.updateConsent(trackingConsent);
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

  return (
    <>
      <StatusBar style={statusBarStyle} animated translucent />
      <AppThemeProvider systemTheme={systemTheme}>
        <ThemeProvider value={navigationTheme}>
          <Tabs
            screenOptions={{
              tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: getColorToken('border-secondary'),
                backgroundColor: getColorToken('background-primary'),
                display: !termsAccepted ? 'none' : 'flex',
              },
              tabBarLabelStyle: {
                marginTop: getSpacingToken('spacing-xs'),
                fontFamily: 'OpenSans-Bold',
                fontSize: 10,
              },
              tabBarActiveTintColor: getColorToken('core-primary'),
              headerShown: false,
              tabBarButton: props => <HapticTab {...props} />,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="terms-and-conditions"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="+not-found"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="workouts/index"
              options={{
                title: t('navigation.workouts'),
                tabBarIcon: ({ color, size }) => (
                  <IconSymbol name="dumbbell" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="workouts/preview/index"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: t('navigation.profile'),
                tabBarIcon: ({ color, size }) => (
                  <IconSymbol name="gearshape" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
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
