# Material UI Theme & Figma Integration

This document explains how to use the Material UI theme system and integrate Figma design tokens in your Potenzo app.

## Overview

The app now uses **React Native Paper** (Material Design 3) for consistent theming and components, with full support for importing design tokens from Figma's Material Theme Builder.

## Features

- ✅ Material Design 3 (MD3) theme system
- ✅ Light/Dark mode support with system preference detection
- ✅ Figma Material Theme Builder integration
- ✅ Type-safe theme usage
- ✅ Consistent spacing and typography
- ✅ Accessibility support for RUM tracking
- ✅ AsyncStorage theme persistence

## Quick Start

### Using Material UI Components

```tsx
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { ScreenContainer } from '@/components/ScreenContainer';

export default function MyScreen() {
  const theme = useTheme();

  return (
    <ScreenContainer padding="lg">
      <Card elevation={2}>
        <Card.Content>
          <Text variant="headlineMedium">Hello World</Text>
          <Text variant="bodyMedium">This is a Material UI component</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => {}}>
            Get Started
          </Button>
        </Card.Actions>
      </Card>
    </ScreenContainer>
  );
}
```

### Using Figma Design Tokens

```tsx
import { getColorToken, getSpacingToken } from '@/theme/FigmaTokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: getColorToken('light-primary'),
    padding: getSpacingToken('spacing-lg'),
  },
});
```

## Theme Structure

### Material UI Theme Files

- `src/theme/MaterialTheme.ts` - Main MD3 theme configuration
- `src/theme/ThemeProvider.tsx` - Theme provider with AsyncStorage persistence
- `src/theme/FigmaTokens.ts` - Figma design tokens with MD3 color system

### Theme Components

- `AppThemeProvider` - Main theme provider with system theme detection
- `useTheme()` - Hook to access current theme and theme controls
- Theme-aware components from React Native Paper

## Importing Figma Design Tokens

### Step 1: Export from Material Theme Builder

1. Use Figma's **Material Theme Builder** plugin
2. Configure your color scheme (primary, secondary, tertiary, error)
3. Export the design tokens as JSON

### Step 2: Import into App

```bash
# Run the import script
node scripts/import-figma-tokens.js path/to/material-theme-builder-tokens.json
```

### Step 3: Use in Components

```tsx
import {
  getColorToken,
  getSpacingToken,
  getShadowToken,
} from '@/theme/FigmaTokens';

const styles = StyleSheet.create({
  button: {
    backgroundColor: getColorToken('light-primary'),
    padding: getSpacingToken('spacing-md'),
    borderRadius: getBorderRadiusToken('radius-md'),
    ...getShadowToken('shadow-md'),
  },
});
```

## Available Design Tokens

### Material Design 3 Colors

#### Core Colors

- `core-primary` - Primary brand color
- `core-secondary` - Secondary brand color
- `core-tertiary` - Tertiary brand color
- `core-error` - Error color
- `extended-accent` - Extended accent color

#### Light Theme Colors

- `light-primary`, `light-onPrimary`
- `light-primaryContainer`, `light-onPrimaryContainer`
- `light-secondary`, `light-onSecondary`
- `light-secondaryContainer`, `light-onSecondaryContainer`
- `light-tertiary`, `light-onTertiary`
- `light-tertiaryContainer`, `light-onTertiaryContainer`
- `light-error`, `light-onError`
- `light-errorContainer`, `light-onErrorContainer`
- `light-background`, `light-onBackground`
- `light-surface`, `light-onSurface`
- `light-surfaceVariant`, `light-onSurfaceVariant`
- `light-outline`, `light-outlineVariant`
- `light-shadow`, `light-scrim`
- `light-inverseSurface`, `light-inverseOnSurface`, `light-inversePrimary`

#### Dark Theme Colors

- `dark-primary`, `dark-onPrimary`
- `dark-primaryContainer`, `dark-onPrimaryContainer`
- `dark-secondary`, `dark-onSecondary`
- `dark-secondaryContainer`, `dark-onSecondaryContainer`
- `dark-tertiary`, `dark-onTertiary`
- `dark-tertiaryContainer`, `dark-onTertiaryContainer`
- `dark-error`, `dark-onError`
- `dark-errorContainer`, `dark-onErrorContainer`
- `dark-background`, `dark-onBackground`
- `dark-surface`, `dark-onSurface`
- `dark-surfaceVariant`, `dark-onSurfaceVariant`
- `dark-outline`, `dark-outlineVariant`
- `dark-shadow`, `dark-scrim`
- `dark-inverseSurface`, `dark-inverseOnSurface`, `dark-inversePrimary`

### Spacing

- `spacing-xs` (4px) to `spacing-3xl` (64px)

### Border Radius

- `radius-none` to `radius-full`

### Shadows

- `shadow-sm`, `shadow-md`, `shadow-lg`

## Material UI Components

### Text Components

```tsx
<Text variant="headlineLarge">Large Headline</Text>
<Text variant="titleMedium">Medium Title</Text>
<Text variant="bodyLarge">Body Text</Text>
<Text variant="labelMedium">Label</Text>
```

### Button Components

```tsx
<Button mode="contained" onPress={() => {}}>
  Primary Button
</Button>
<Button mode="outlined" onPress={() => {}}>
  Secondary Button
</Button>
<Button mode="text" onPress={() => {}}>
  Text Button
</Button>
```

### Card Components

```tsx
<Card elevation={2}>
  <Card.Cover source={{ uri: 'image-url' }} />
  <Card.Content>
    <Text variant="titleLarge">Card Title</Text>
    <Text variant="bodyMedium">Card content</Text>
  </Card.Content>
  <Card.Actions>
    <Button>Action</Button>
  </Card.Actions>
</Card>
```

### Surface Components

```tsx
<Surface elevation={4} style={styles.surface}>
  <Text>Content with elevation</Text>
</Surface>
```

## Theme Switching

The app supports automatic theme switching with persistence:

```tsx
import { useTheme } from '@/theme/ThemeProvider';

function MyComponent() {
  const { themeMode, setThemeMode, isDark } = useTheme();

  return (
    <View>
      <Button onPress={() => setThemeMode('light')}>Light Mode</Button>
      <Button onPress={() => setThemeMode('dark')}>Dark Mode</Button>
      <Button onPress={() => setThemeMode('system')}>System Default</Button>
    </View>
  );
}
```

## Using MD3 Colors Directly

For advanced usage, you can access the MD3 color system directly:

```tsx
import { getMD3Colors } from '@/theme/FigmaTokens';

const md3Colors = getMD3Colors();

// Access light theme colors
const lightPrimary = md3Colors.light.primary;
const lightSurface = md3Colors.light.surface;

// Access dark theme colors
const darkPrimary = md3Colors.dark.primary;
const darkSurface = md3Colors.dark.surface;
```

## Accessibility & RUM Tracking

All components include `accessibilityLabel` props for proper tracking:

```tsx
<ScreenContainer accessibilityLabel="my-screen-container">
  <Button accessibilityLabel="my-button">Click Me</Button>
</ScreenContainer>
```

## Customizing the Theme

### Adding Custom Colors

1. Update `src/theme/FigmaTokens.ts`:

```tsx
export const FigmaDesignTokens = {
  colors: {
    // ... existing colors
    'brand-accent': { value: '#FF6B6B', type: 'color' as const },
  },
};
```

2. Update `src/theme/MaterialTheme.ts`:

```tsx
export const LightMaterialTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // ... existing colors
    customAccent: getColorToken('brand-accent'),
  },
};
```

### Adding Custom Typography

```tsx
export const LightMaterialTheme: MD3Theme = {
  // ... existing theme
  fonts: {
    // ... existing fonts
    customDisplay: {
      fontFamily: 'Exo2-Bold',
      fontSize: 28,
      lineHeight: 32,
      letterSpacing: 0,
      fontWeight: '700',
    },
  },
};
```

## Best Practices

1. **Use MD3 Colors**: Always use the MD3 color system (`light-primary`, `dark-surface`, etc.)
2. **Consistent Components**: Use Material UI components for consistency
3. **Theme Awareness**: Use `useTheme()` hook to access theme values and controls
4. **Accessibility**: Always include `accessibilityLabel` props for RUM tracking
5. **Type Safety**: Use TypeScript for better development experience
6. **Persistence**: Theme mode is automatically saved to AsyncStorage

## Troubleshooting

### Common Issues

1. **Font not loading**: Ensure fonts are properly loaded in `_layout.tsx`
2. **Theme not updating**: Check that `AppThemeProvider` wraps your app
3. **Tokens not found**: Verify token names match exactly in `FigmaTokens.ts`
4. **Material Theme Builder**: Ensure you're using the correct export format

### Debugging

```tsx
import { useTheme } from '@/theme/ThemeProvider';
import { getMD3Colors } from '@/theme/FigmaTokens';

function DebugTheme() {
  const { themeMode, isDark } = useTheme();
  const md3Colors = getMD3Colors();

  console.log('Theme mode:', themeMode);
  console.log('Is dark:', isDark);
  console.log('MD3 colors:', md3Colors);
  return null;
}
```

## Resources

- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Theme Builder Plugin](https://www.figma.com/community/plugin/1203065856768575535/Material-Theme-Builder)
- [Material Design Color System](https://m3.material.io/foundations/color/overview)
