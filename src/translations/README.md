# Translation System

This app uses `react-i18next` for internationalization with support for English and Portuguese.

## Structure

```
src/translations/
├── en.json          # English translations
├── pt.json          # Portuguese translations
├── i18n.ts          # i18n configuration
└── README.md        # This file
```

## Usage

### Basic Translation

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  
  return <Text>{t('common.getStarted')}</Text>;
}
```

### Language Switching

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function LanguageSwitcher() {
  const { changeLanguage, currentLanguage } = useTranslation();
  
  return (
    <Button onPress={() => changeLanguage('pt')}>
      Switch to Portuguese
    </Button>
  );
}
```

### Using the LanguageSelector Component

```tsx
import { LanguageSelector } from '@/components/LanguageSelector';

function SettingsScreen() {
  return (
    <View>
      <LanguageSelector />
    </View>
  );
}
```

## Adding New Translations

1. Add the key to both `en.json` and `pt.json`
2. Use the key in your component with `t('key.path')`

### Example

**en.json:**
```json
{
  "workouts": {
    "newFeature": "New Workout Feature"
  }
}
```

**pt.json:**
```json
{
  "workouts": {
    "newFeature": "Nova Funcionalidade de Treino"
  }
}
```

**Component:**
```tsx
<Text>{t('workouts.newFeature')}</Text>
```

## Features

- ✅ Automatic language detection based on device locale
- ✅ Fallback to English if translation is missing
- ✅ Type-safe translation keys
- ✅ RTL support ready
- ✅ Debug mode in development
- ✅ Persistent language selection

## Available Languages

- 🇺🇸 English (`en`)
- 🇧🇷 Portuguese (`pt`)

## Adding New Languages

1. Create a new JSON file (e.g., `es.json` for Spanish)
2. Add the language to the resources in `i18n.ts`
3. Update the `LanguageSelector` component
4. Update the `useTranslation` hook types 