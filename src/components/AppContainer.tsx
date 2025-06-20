import React from 'react';
import { ViewStyle } from 'react-native';
import { Surface, useTheme, type MD3Elevation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSpacingToken } from '@/theme/FigmaTokens';

interface AppContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: MD3Elevation;
  accessibilityLabel?: string;
}

export function AppContainer({
  children,
  style,
  elevation = 0,
  accessibilityLabel
}: AppContainerProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    marginTop: insets.top,
    paddingTop: getSpacingToken('spacing-2xl'),
    paddingBottom: getSpacingToken('spacing-2xl'),
    paddingLeft: getSpacingToken('spacing-md'),
    paddingRight: getSpacingToken('spacing-md'),
    backgroundColor: theme.colors.background,
  };

  return (
    <Surface
      style={[containerStyle, style]}
      elevation={elevation}
      accessibilityLabel={accessibilityLabel} // used on RUM tracking - otherwise generic names will appear on the view routes.
    >
      {children}
    </Surface>
  );
}