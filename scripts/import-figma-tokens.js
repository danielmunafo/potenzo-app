#!/usr/bin/env node

/**
 * Figma Design Tokens Import Script
 * 
 * This script helps import design tokens from Figma and convert them to the format
 * used in the React Native app.
 * 
 * Usage:
 * 1. Export tokens from Figma using plugins like "Figma Tokens" or "Design Tokens"
 * 2. Save the exported JSON file
 * 3. Run this script to convert and update the tokens
 * 
 * Example:
 * node scripts/import-figma-tokens.js path/to/figma-tokens.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertMaterialThemeBuilderTokens(figmaTokens) {
  const convertedTokens = {
    colors: {},
    typography: {},
    spacing: {},
    borderRadius: {},
    shadows: {},
  };

  // Convert core colors
  if (figmaTokens.coreColors) {
    Object.entries(figmaTokens.coreColors).forEach(([key, value]) => {
      convertedTokens.colors[`core-${key}`] = {
        value: value,
        type: 'color',
      };
    });
  }

  // Convert extended colors
  if (figmaTokens.extendedColors) {
    figmaTokens.extendedColors.forEach((color) => {
      convertedTokens.colors[`extended-${color.name.toLowerCase()}`] = {
        value: color.color,
        type: 'color',
      };
    });
  }

  // Convert scheme colors (light theme as default)
  if (figmaTokens.schemes && figmaTokens.schemes.light) {
    Object.entries(figmaTokens.schemes.light).forEach(([key, value]) => {
      convertedTokens.colors[`light-${key}`] = {
        value: value,
        type: 'color',
      };
    });
  }

  // Convert dark scheme colors
  if (figmaTokens.schemes && figmaTokens.schemes.dark) {
    Object.entries(figmaTokens.schemes.dark).forEach(([key, value]) => {
      convertedTokens.colors[`dark-${key}`] = {
        value: value,
        type: 'color',
      };
    });
  }

  // Convert palette colors
  if (figmaTokens.palettes) {
    Object.entries(figmaTokens.palettes).forEach(([paletteName, palette]) => {
      Object.entries(palette).forEach(([tone, value]) => {
        convertedTokens.colors[`palette-${paletteName}-${tone}`] = {
          value: value,
          type: 'color',
        };
      });
    });
  }

  // Add some default spacing tokens (Material Design spacing)
  const defaultSpacing = {
    'spacing-xs': 4,
    'spacing-sm': 8,
    'spacing-md': 16,
    'spacing-lg': 24,
    'spacing-xl': 32,
    'spacing-2xl': 48,
    'spacing-3xl': 64,
  };

  Object.entries(defaultSpacing).forEach(([key, value]) => {
    convertedTokens.spacing[key] = {
      value: value,
      type: 'spacing',
    };
  });

  // Add default border radius tokens
  const defaultBorderRadius = {
    'radius-none': 0,
    'radius-sm': 4,
    'radius-md': 8,
    'radius-lg': 12,
    'radius-xl': 16,
    'radius-full': 9999,
  };

  Object.entries(defaultBorderRadius).forEach(([key, value]) => {
    convertedTokens.borderRadius[key] = {
      value: value,
      type: 'borderRadius',
    };
  });

  // Add default shadow tokens
  const defaultShadows = {
    'shadow-sm': {
      color: '#000000',
      x: 0,
      y: 1,
      blur: 2,
      spread: 0,
    },
    'shadow-md': {
      color: '#000000',
      x: 0,
      y: 4,
      blur: 6,
      spread: 0,
    },
    'shadow-lg': {
      color: '#000000',
      x: 0,
      y: 10,
      blur: 15,
      spread: 0,
    },
  };

  Object.entries(defaultShadows).forEach(([key, value]) => {
    convertedTokens.shadows[key] = {
      ...value,
      type: 'shadow',
    };
  });

  return convertedTokens;
}

function generateTokensFile(convertedTokens) {
  const tokensContent = `// Auto-generated from Material Theme Builder design tokens
// Generated on: ${new Date().toISOString()}

export const FigmaDesignTokens = ${JSON.stringify(convertedTokens, null, 2)};

// Utility functions to work with Figma tokens
export function getColorToken(tokenName: string, colorScheme?: 'light' | 'dark' | null): string {
  const theme = colorScheme || 'light';

  // Check if the token name already includes a theme prefix
  if (tokenName.startsWith('light-') || tokenName.startsWith('dark-')) {
    const token = FigmaDesignTokens.colors[tokenName as keyof typeof FigmaDesignTokens.colors];
    return token?.value || '#000000';
  }

  // For core tokens or tokens without theme prefix, try to find the theme-specific variant
  const themeSpecificTokenName = \`\${theme}-\${tokenName} \`;
  const themeSpecificToken = FigmaDesignTokens.colors[themeSpecificTokenName as keyof typeof FigmaDesignTokens.colors];

  if (themeSpecificToken) {
    return themeSpecificToken.value;
  }

  // Fallback to the original token name
  const token = FigmaDesignTokens.colors[tokenName as keyof typeof FigmaDesignTokens.colors];
  return token?.value || '#000000';
}

// Type-safe version for known tokens
export function getColorTokenStrict(tokenName: keyof typeof FigmaDesignTokens.colors, colorScheme?: 'light' | 'dark' | null): string {
  return getColorToken(tokenName, colorScheme);
}

// Legacy theme-aware color getters (keeping for backward compatibility)
export function getThemeColor(lightToken: keyof typeof FigmaDesignTokens.colors, darkToken: keyof typeof FigmaDesignTokens.colors, colorScheme?: 'light' | 'dark' | null): string {
  const theme = colorScheme || 'light';
  const tokenName = theme === 'dark' ? darkToken : lightToken;
  return getColorToken(tokenName);
}

export function getOnSurfaceColor(colorScheme?: 'light' | 'dark' | null): string {
  return getColorToken('onSurface', colorScheme);
}

export function getOnBackgroundColor(colorScheme?: 'light' | 'dark' | null): string {
  return getColorToken('onBackground', colorScheme);
}

export function getSurfaceColor(colorScheme?: 'light' | 'dark' | null): string {
  return getColorToken('surface', colorScheme);
}

export function getBackgroundColor(colorScheme?: 'light' | 'dark' | null): string {
  return getColorToken('background', colorScheme);
}

export function getSpacingToken(tokenName: keyof typeof FigmaDesignTokens.spacing): number {
  const token = FigmaDesignTokens.spacing[tokenName];
  return token?.value || 0;
}

export function getBorderRadiusToken(tokenName: keyof typeof FigmaDesignTokens.borderRadius): number {
  const token = FigmaDesignTokens.borderRadius[tokenName];
  return token?.value || 0;
}

export function getShadowToken(tokenName: keyof typeof FigmaDesignTokens.shadows) {
  const token = FigmaDesignTokens.shadows[tokenName];
  if (!token) return null;

  return {
    shadowColor: token.color,
    shadowOffset: { width: token.x, height: token.y },
    shadowOpacity: 0.1,
    shadowRadius: token.blur,
    elevation: Math.ceil(token.blur / 2),
  };
}

// Function to convert Figma tokens to Material UI theme format
export function convertFigmaTokensToMaterialTheme() {
  return {
    colors: {
      primary: getColorToken('core-primary'),
      secondary: getColorToken('core-secondary'),
      tertiary: getColorToken('core-tertiary'),
      error: getColorToken('core-error'),
      // Light theme colors
      background: getColorToken('light-background'),
      surface: getColorToken('light-surface'),
      onBackground: getColorToken('light-onBackground'),
      onSurface: getColorToken('light-onSurface'),
      // Dark theme colors
      darkBackground: getColorToken('dark-background'),
      darkSurface: getColorToken('dark-surface'),
      darkOnBackground: getColorToken('dark-onBackground'),
      darkOnSurface: getColorToken('dark-onSurface'),
    },
    spacing: {
      xs: getSpacingToken('spacing-xs'),
      sm: getSpacingToken('spacing-sm'),
      md: getSpacingToken('spacing-md'),
      lg: getSpacingToken('spacing-lg'),
      xl: getSpacingToken('spacing-xl'),
      '2xl': getSpacingToken('spacing-2xl'),
      '3xl': getSpacingToken('spacing-3xl'),
    },
    borderRadius: {
      none: getBorderRadiusToken('radius-none'),
      sm: getBorderRadiusToken('radius-sm'),
      md: getBorderRadiusToken('radius-md'),
      lg: getBorderRadiusToken('radius-lg'),
      xl: getBorderRadiusToken('radius-xl'),
      full: getBorderRadiusToken('radius-full'),
    },
  };
}

// Material Design 3 specific color getters
export function getMD3Colors() {
  return {
    // Core colors
    primary: getColorToken('core-primary'),
    secondary: getColorToken('core-secondary'),
    tertiary: getColorToken('core-tertiary'),
    error: getColorToken('core-error'),

    // Light theme
    light: {
      primary: getColorToken('light-primary'),
      onPrimary: getColorToken('light-onPrimary'),
      primaryContainer: getColorToken('light-primaryContainer'),
      onPrimaryContainer: getColorToken('light-onPrimaryContainer'),
      secondary: getColorToken('light-secondary'),
      onSecondary: getColorToken('light-onSecondary'),
      secondaryContainer: getColorToken('light-secondaryContainer'),
      onSecondaryContainer: getColorToken('light-onSecondaryContainer'),
      tertiary: getColorToken('light-tertiary'),
      onTertiary: getColorToken('light-onTertiary'),
      tertiaryContainer: getColorToken('light-tertiaryContainer'),
      onTertiaryContainer: getColorToken('light-onTertiaryContainer'),
      error: getColorToken('light-error'),
      onError: getColorToken('light-onError'),
      errorContainer: getColorToken('light-errorContainer'),
      onErrorContainer: getColorToken('light-onErrorContainer'),
      background: getColorToken('light-background'),
      onBackground: getColorToken('light-onBackground'),
      surface: getColorToken('light-surface'),
      onSurface: getColorToken('light-onSurface'),
      surfaceVariant: getColorToken('light-surfaceVariant'),
      onSurfaceVariant: getColorToken('light-onSurfaceVariant'),
      outline: getColorToken('light-outline'),
      outlineVariant: getColorToken('light-outlineVariant'),
    },

    // Dark theme
    dark: {
      primary: getColorToken('dark-primary'),
      onPrimary: getColorToken('dark-onPrimary'),
      primaryContainer: getColorToken('dark-primaryContainer'),
      onPrimaryContainer: getColorToken('dark-onPrimaryContainer'),
      secondary: getColorToken('dark-secondary'),
      onSecondary: getColorToken('dark-onSecondary'),
      secondaryContainer: getColorToken('dark-secondaryContainer'),
      onSecondaryContainer: getColorToken('dark-onSecondaryContainer'),
      tertiary: getColorToken('dark-tertiary'),
      onTertiary: getColorToken('dark-onTertiary'),
      tertiaryContainer: getColorToken('dark-tertiaryContainer'),
      onTertiaryContainer: getColorToken('dark-onTertiaryContainer'),
      error: getColorToken('dark-error'),
      onError: getColorToken('dark-onError'),
      errorContainer: getColorToken('dark-errorContainer'),
      onErrorContainer: getColorToken('dark-onErrorContainer'),
      background: getColorToken('dark-background'),
      onBackground: getColorToken('dark-onBackground'),
      surface: getColorToken('dark-surface'),
      onSurface: getColorToken('dark-onSurface'),
      surfaceVariant: getColorToken('dark-surfaceVariant'),
      onSurfaceVariant: getColorToken('dark-onSurfaceVariant'),
      outline: getColorToken('dark-outline'),
      outlineVariant: getColorToken('dark-outlineVariant'),
    },
  };
}
`;

  return tokensContent;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node scripts/import-figma-tokens.js <path-to-figma-tokens.json>');
    console.log('');
    console.log('Example:');
    console.log('  node scripts/import-figma-tokens.js ./figma-tokens.json');
    console.log('');
    console.log('This will generate/update src/theme/FigmaTokens.ts with the imported tokens.');
    return;
  }

  const inputFile = args[0];
  const outputFile = path.join(__dirname, '..', 'src', 'theme', 'FigmaTokens.ts');

  try {
    // Read the Figma tokens file
    const figmaTokensContent = fs.readFileSync(inputFile, 'utf8');
    const figmaTokens = JSON.parse(figmaTokensContent);

    // Convert tokens to app format
    const convertedTokens = convertMaterialThemeBuilderTokens(figmaTokens);

    // Generate the TypeScript file
    const tokensFileContent = generateTokensFile(convertedTokens);

    // Write the file
    fs.writeFileSync(outputFile, tokensFileContent, 'utf8');

    console.log('✅ Successfully imported Material Theme Builder tokens!');
    console.log(`📁 Output file: ${outputFile}`);
    console.log('');
    console.log('📊 Token summary:');
    console.log(`  Colors: ${Object.keys(convertedTokens.colors).length}`);
    console.log(`  Typography: ${Object.keys(convertedTokens.typography).length}`);
    console.log(`  Spacing: ${Object.keys(convertedTokens.spacing).length}`);
    console.log(`  Border Radius: ${Object.keys(convertedTokens.borderRadius).length}`);
    console.log(`  Shadows: ${Object.keys(convertedTokens.shadows).length}`);
    console.log('');
    console.log('🎨 Color breakdown:');
    console.log(`  Core colors: ${Object.keys(convertedTokens.colors).filter(k => k.startsWith('core-')).length}`);
    console.log(`  Extended colors: ${Object.keys(convertedTokens.colors).filter(k => k.startsWith('extended-')).length}`);
    console.log(`  Light theme colors: ${Object.keys(convertedTokens.colors).filter(k => k.startsWith('light-')).length}`);
    console.log(`  Dark theme colors: ${Object.keys(convertedTokens.colors).filter(k => k.startsWith('dark-')).length}`);
    console.log(`  Palette colors: ${Object.keys(convertedTokens.colors).filter(k => k.startsWith('palette-')).length}`);
    console.log('');
    console.log('🔄 Next steps:');
    console.log('  1. Review the generated tokens in src/theme/FigmaTokens.ts');
    console.log('  2. Update your Material UI theme in src/theme/MaterialTheme.ts if needed');
    console.log('  3. Test the app to ensure all tokens are working correctly');
    console.log('  4. Use getMD3Colors() function for Material Design 3 specific colors');

  } catch (error) {
    console.error('❌ Error importing Figma tokens:', error.message);
    process.exit(1);
  }
}

// Check if this is the main module (ES module equivalent of require.main === module)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 