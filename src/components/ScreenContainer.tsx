import React from 'react';
import { ViewStyle } from 'react-native';
import { Surface, useTheme, type MD3Elevation } from 'react-native-paper';
import {
  Edge,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import SentryWrapper from './SentryWrapper';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: MD3Elevation;
  accessibilityLabel?: string;
  edges?: Edge[];
  useSentryWrapper?: boolean;
}

export function ScreenContainer({
  children,
  style,
  accessibilityLabel,
  elevation = 0,
  edges = ['top', 'bottom'],
  useSentryWrapper = true,
}: ScreenContainerProps) {
  // const insets = useSafeAreaInsets();
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const Wrapper = useSentryWrapper ? SentryWrapper : React.Fragment;

  return (
    <Wrapper>
      <Surface
        style={[containerStyle, style]}
        elevation={elevation}
        accessibilityLabel={accessibilityLabel}
      >
        <SafeAreaProvider
          accessibilityLabel={`${accessibilityLabel}-safe-area-provider`}
        >
          <SafeAreaView
            accessibilityLabel={`${accessibilityLabel}-safe-area-view`}
            edges={edges}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          >
            {children}
          </SafeAreaView>
        </SafeAreaProvider>
      </Surface>
    </Wrapper>
  );
}
