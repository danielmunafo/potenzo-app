import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useSegments } from 'expo-router';
import 'react-native-reanimated';

import { DATADOG_CONFIG, validateEnv } from '@/config/env';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AppThemeProvider } from '@/theme/ThemeProvider';
import { BatchSize, DatadogProvider, DatadogProviderConfiguration, DdRum, DdSdkReactNative, SdkVerbosity, TrackingConsent, UploadFrequency } from 'expo-datadog';
import { useEffect } from 'react';

// Validate environment variables on app start
validateEnv();

const config = new DatadogProviderConfiguration(
  DATADOG_CONFIG.apiKey || "",
  "local",
  DATADOG_CONFIG.appKey || "",
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true, // track Errors,
  TrackingConsent.GRANTED, // for now
)

config.site = DATADOG_CONFIG.site
// Optional: Enable JavaScript long task collection
config.longTaskThresholdMs = 100
// Optional: enable or disable native crash reports
config.nativeCrashReportEnabled = true
// Optional: sample RUM sessions (here, 100% of session will be sent to Datadog. Default = 100%. Only tracked sessions send RUM events.)
config.sessionSamplingRate = 100

if (__DEV__) {
  // Optional: Send data more frequently
  config.uploadFrequency = UploadFrequency.FREQUENT
  // Optional: Send smaller batches of data
  config.batchSize = BatchSize.SMALL
  // Optional: Enable debug logging
  config.verbosity = SdkVerbosity.DEBUG
}

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
    title: 'Splash', // This will be used by Datadog RUM
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
  const pathname = usePathname();
  const segments = useSegments();

  const viewKey = segments.join('/');

  useEffect(() => {
    (async () => {
      await DdSdkReactNative.initialize(config);
      DdRum.startView(viewKey, pathname);
    })();
  }, [viewKey, pathname]);

  // Early return for loading state
  if (!fontsLoaded) {
    return null;
  }

  const isDark = userDeviceColorScheme === 'dark';
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;
  const systemTheme = isDark ? 'dark' : 'light';

  return (
    <DatadogProvider configuration={config}>
      <AppThemeProvider systemTheme={systemTheme}>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen {...STACK_SCREEN_CONFIG} />
            <Stack.Screen {...SETTINGS_SCREEN_CONFIG} />
          </Stack>
        </ThemeProvider>
      </AppThemeProvider>
    </DatadogProvider>
  );
}
