import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';
import { getColorToken, getMD3Colors } from './FigmaTokens';

// Get Material Design 3 colors
const md3Colors = getMD3Colors();

export const typography = {
  ...MD3LightTheme.fonts,
  // Configure custom fonts for different text variants
  displayLarge: {
    ...MD3LightTheme.fonts.displayLarge,
    fontFamily: 'Exo2-Bold',
  },
  displayMedium: {
    ...MD3LightTheme.fonts.displayMedium,
    fontFamily: 'Exo2-Bold',
  },
  displaySmall: {
    ...MD3LightTheme.fonts.displaySmall,
    fontFamily: 'Exo2-Bold',
  },
  headlineLarge: {
    ...MD3LightTheme.fonts.headlineLarge,
    fontFamily: 'Exo2-Bold',
  },
  headlineMedium: {
    ...MD3LightTheme.fonts.headlineMedium,
    fontFamily: 'Exo2-Bold',
  },
  headlineSmall: {
    ...MD3LightTheme.fonts.headlineSmall,
    fontFamily: 'Exo2-Bold',
  },
  titleLarge: {
    ...MD3LightTheme.fonts.titleLarge,
    fontFamily: 'Exo2-Bold',
  },
  titleMedium: {
    ...MD3LightTheme.fonts.titleMedium,
    fontFamily: 'Exo2-Bold',
  },
  titleSmall: {
    ...MD3LightTheme.fonts.titleSmall,
    fontFamily: 'Exo2-Bold',
  },
  bodyLarge: {
    ...MD3LightTheme.fonts.bodyLarge,
    fontFamily: 'OpenSans-Regular',
  },
  bodyMedium: {
    ...MD3LightTheme.fonts.bodyMedium,
    fontFamily: 'OpenSans-Regular',
  },
  bodySmall: {
    ...MD3LightTheme.fonts.bodySmall,
    fontFamily: 'OpenSans-Regular',
  },
  labelLarge: {
    ...MD3LightTheme.fonts.labelLarge,
    fontFamily: 'OpenSans-Medium',
  },
  labelMedium: {
    ...MD3LightTheme.fonts.labelMedium,
    fontFamily: 'OpenSans-Medium',
  },
  labelSmall: {
    ...MD3LightTheme.fonts.labelSmall,
    fontFamily: 'OpenSans-Medium',
  },
};

// Light Theme
export const LightMaterialTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Use the Material Design 3 light theme colors directly
    primary: md3Colors.light.primary,
    onPrimary: md3Colors.light.onPrimary,
    primaryContainer: md3Colors.light.primaryContainer,
    onPrimaryContainer: md3Colors.light.onPrimaryContainer,
    secondary: md3Colors.light.secondary,
    onSecondary: md3Colors.light.onSecondary,
    secondaryContainer: md3Colors.light.secondaryContainer,
    onSecondaryContainer: md3Colors.light.onSecondaryContainer,
    tertiary: md3Colors.light.tertiary,
    onTertiary: md3Colors.light.onTertiary,
    tertiaryContainer: md3Colors.light.tertiaryContainer,
    onTertiaryContainer: md3Colors.light.onTertiaryContainer,
    error: md3Colors.light.error,
    onError: md3Colors.light.onError,
    errorContainer: md3Colors.light.errorContainer,
    onErrorContainer: md3Colors.light.onErrorContainer,
    background: md3Colors.light.background,
    onBackground: md3Colors.light.onBackground,
    surface: md3Colors.light.surface,
    onSurface: md3Colors.light.onSurface,
    surfaceVariant: md3Colors.light.surfaceVariant,
    onSurfaceVariant: md3Colors.light.onSurfaceVariant,
    outline: md3Colors.light.outline,
    outlineVariant: md3Colors.light.outlineVariant,
    shadow: getColorToken('light-shadow'),
    scrim: getColorToken('light-scrim'),
    inverseSurface: getColorToken('light-inverseSurface'),
    inverseOnSurface: getColorToken('light-inverseOnSurface'),
    inversePrimary: getColorToken('light-inversePrimary'),
    elevation: {
      level0: 'transparent',
      level1: getColorToken('light-surfaceContainerLow'),
      level2: getColorToken('light-surfaceContainer'),
      level3: getColorToken('light-surfaceContainerHigh'),
      level4: getColorToken('light-surfaceContainerHighest'),
      level5: getColorToken('light-surfaceContainerHighest'),
    },
  },
  fonts: typography,
};

// Dark Theme
export const DarkMaterialTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Use the Material Design 3 dark theme colors directly
    primary: md3Colors.dark.primary,
    onPrimary: md3Colors.dark.onPrimary,
    primaryContainer: md3Colors.dark.primaryContainer,
    onPrimaryContainer: md3Colors.dark.onPrimaryContainer,
    secondary: md3Colors.dark.secondary,
    onSecondary: md3Colors.dark.onSecondary,
    secondaryContainer: md3Colors.dark.secondaryContainer,
    onSecondaryContainer: md3Colors.dark.onSecondaryContainer,
    tertiary: md3Colors.dark.tertiary,
    onTertiary: md3Colors.dark.onTertiary,
    tertiaryContainer: md3Colors.dark.tertiaryContainer,
    onTertiaryContainer: md3Colors.dark.onTertiaryContainer,
    error: md3Colors.dark.error,
    onError: md3Colors.dark.onError,
    errorContainer: md3Colors.dark.errorContainer,
    onErrorContainer: md3Colors.dark.onErrorContainer,
    background: md3Colors.dark.background,
    onBackground: md3Colors.dark.onBackground,
    surface: md3Colors.dark.surface,
    onSurface: md3Colors.dark.onSurface,
    surfaceVariant: md3Colors.dark.surfaceVariant,
    onSurfaceVariant: md3Colors.dark.onSurfaceVariant,
    outline: md3Colors.dark.outline,
    outlineVariant: md3Colors.dark.outlineVariant,
    shadow: getColorToken('dark-shadow'),
    scrim: getColorToken('dark-scrim'),
    inverseSurface: getColorToken('dark-inverseSurface'),
    inverseOnSurface: getColorToken('dark-inverseOnSurface'),
    inversePrimary: getColorToken('dark-inversePrimary'),
    elevation: {
      level0: 'transparent',
      level1: getColorToken('dark-surfaceContainerLow'),
      level2: getColorToken('dark-surfaceContainer'),
      level3: getColorToken('dark-surfaceContainerHigh'),
      level4: getColorToken('dark-surfaceContainerHighest'),
      level5: getColorToken('dark-surfaceContainerHighest'),
    },
  },
  fonts: typography,
};

// Export the MD3 colors for direct access if needed
export { md3Colors };
