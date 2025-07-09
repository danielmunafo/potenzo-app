import 'react-native-reanimated';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
import {
  StatusBarProvider,
  useStatusBarContext,
} from '../contexts/StatusBarContext';
import { TabsProvider, useTabsContext } from '../contexts/TabsContext';
import { WorkoutProvider } from '../contexts/WorkoutContext';
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
  const colorScheme = useColorScheme();
  const statusBarStyle = useStatusBarStyle();
  const { isTabsVisible, setIsTabsVisible } = useTabsContext();
  const { isStatusBarVisible } = useStatusBarContext();
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

  useEffect(() => {
    setIsTabsVisible(termsAccepted);
  }, [termsAccepted, setIsTabsVisible]);

  if (!isAppReadyToLoad(fontsLoaded, consentLoading)) {
    return null;
  }

  const isDark = colorScheme === 'dark';
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;
  const systemTheme = isDark ? 'dark' : 'light';

  return (
    <>
      <StatusBar
        style={statusBarStyle}
        hidden={!isStatusBarVisible}
        animated
        hideTransitionAnimation="slide"
        translucent
      />
      <GestureHandlerRootView>
        <ThemeProvider value={navigationTheme}>
          <AppThemeProvider systemTheme={systemTheme}>
            <Tabs
              screenOptions={{
                animation: 'fade',
                tabBarVisibilityAnimationConfig: {
                  show: {
                    animation: 'timing',
                    config: { duration: 100 },
                  },
                  hide: {
                    animation: 'timing',
                    config: { duration: 100 },
                  },
                },
                transitionSpec: {
                  animation: 'timing',
                  config: {
                    duration: 200,
                  },
                },
                tabBarStyle: {
                  display: isTabsVisible ? 'flex' : 'none',
                },
                tabBarLabelStyle: {
                  marginTop: getSpacingToken('spacing-xs'),
                  fontFamily: 'OpenSans',
                  fontSize: 8,
                },
                tabBarActiveTintColor: getColorToken('primary'),
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
                name="settings"
                options={{
                  title: t('navigation.profile'),
                  tabBarIcon: ({ color, size }) => (
                    <IconSymbol name="gearshape" size={size} color={color} />
                  ),
                }}
              />
            </Tabs>
          </AppThemeProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </>
  );
};

const RootLayout: React.FC = () => {
  return (
    <StatusBarProvider>
      <TabsProvider>
        <ConsentProvider>
          <WorkoutProvider>
            <App />
          </WorkoutProvider>
        </ConsentProvider>
      </TabsProvider>
    </StatusBarProvider>
  );
};

export default RootLayout;
