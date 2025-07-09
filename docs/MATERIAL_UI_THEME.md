# Material UI Theme & Figma Integration

### Figma

Use the plugin Material Theme Builder to generate the theme
Import it using the script `node ./import-figma-tokens.js ../design/figma-tokens.json`

Styles that will use custom colors should follow:

```typescript
// this is important to make things work properly on web since it needs to be hydrated before rendering colors there's a custom hook for it.
import { useColorScheme } from '@/hooks/useColorScheme'

function Component() {
  const styles = useStyles(useColorScheme());

  return <View style={styles.banner}>
    <Text style={styles.bannerText}>Performant Usage</Text>
  </View>
}

function useStyles(colorScheme: ColorSchemeName) {
  return useMemo(
    () =>
      StyleSheet.create({
        banner: {
          backgroundColor: getColorToken('primary', colorScheme),
          padding: getSpacingToken('spacing-md'),
          marginBottom: getSpacingToken('spacing-sm'),
        },
        bannerText: {
          color: getColorToken('onPrimary', colorScheme),
          textAlign: 'center',
        },
      }),
    [colorScheme]
  );
}

```

## Resources

- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Theme Builder Plugin](https://www.figma.com/community/plugin/1203065856768575535/Material-Theme-Builder)
- [Material Design Color System](https://m3.material.io/foundations/color/overview)
